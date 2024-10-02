
# Authentication | Password Hashing | JWT Token | Cookie

## Singup and Password hasing using bcrypt

Controller>UserCon.js

```javascript
export const AddUser=catchAsyncError(async(req,res,next)=>{
    const {name, email, password }=req.body
    const info=await UserModel.create({name, email, password})
    
    if(!info){
        return next(new ErrorHandle("Something is wrong.", 400))
    }

    res.status(201).json({
        message:"Sucess"
    })
})
```
Model>UserModel.js

```javascript
UserModel.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password, 12)
})
```
## Login + Jwt token + Send token as cookie
Controller>UserCon.js
Always use find one while finding single info to avoid [] arry return
```javascript
export const LoginUser=catchAsyncError(async(req,res,next)=>{
    const {email, password}=req.body
    if(!email || !password){
        return next(new ErrorHandle("Please enter you email and password."))
    }

    //Always use find one while finding single info to avoid [] arry return
    const info=await UserModel.findOne({email}).select("+password")

    if(!info){
        return next(new ErrorHandle("Please insert correct email."))
    }
    const isPasswordMatched = await info.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandle("Please insert correct password.",400))
    }
    const token=info.getJwtToken()

    const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }
    res.status(200).cookie("token",token,options).json({
        token:token,
        data:info,
        message:"Success"
    })
})
```

Model > UserModel.js


Password compare method declear within Model (When using find one it the response data will contain this method funtion as well)
```javascript
//Check is password is right
UserModel.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
```


Jwt Token method declear within Model (When using find one it the response data will contain this method funtion as well)
```javascript
//jwt token
UserModel.methods.getJwtToken=function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE})
}
```
Cookie parser use for get token from frontend request
->app.js

```javascript
import cookieParser from 'cookie-parser';
app.use(cookieParser())
```

## Midleware > is user Authenticated

(to check is the request is logged in?)
Midleware>isUserAuthenticated.js

```javascript

import UserModel from '../Model/UserModel.js';
import catchAsyncError from '../Utils/catchAsyncError.js';
import ErrorHandle from '../Utils/ErrorHandle.js';
import jwt from "jsonwebtoken"
const isUserAuthenticated=catchAsyncError(
    async(req,res,next)=>{

        const {token}  = req.cookies;
        if(!token){
            return next(new ErrorHandle("Please login.", 401))
        }
        const Decoded=jwt.verify(token, process.env.JWT_SECRET_KEY)
        req.user= await UserModel.findById(Decoded.id)

        return next()
    }
)

export default isUserAuthenticated
```