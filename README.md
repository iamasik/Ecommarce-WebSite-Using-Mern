
# User(Get User Info, Update Password)  | Admin (Get Any User Info, Get All User Info, Update Any User Info, Delete Any User)

## User - Get User Info

Controller>UserCon.js

```javascript
export const UserInfo=catchAsyncError(async(req,res,next)=>{
    const user= await UserModel.findById(req.user._id)

    if(!user){
        return next( new ErrorHandle("User info not found",400))
    }

    res.status(200).json({
        user
    })
})
```
Controller>UserCon.js
## User - Update Password

Controller>UserCon.js

```javascript

export const UpdatePassword=catchAsyncError(async(req,res,next)=>{
    const user= await UserModel.findById(req.user._id).select("+password")
    const token=user.getJwtToken()

    const options={
        expires:new Date(Date.now()+process.env.COOKIE_EXPIRE*24*60*60*1000),
        httpOnly:true
    }
    
    if(!user){
        return next( new ErrorHandle("User info not found",400))
    }
    const isPasswordMatched=await user.comparePassword(req.body.oldpassword)
    if(isPasswordMatched && token){
        user.password=req.body.password
        await user.save()
    }
    else{
        return next(new ErrorHandle("Old password didn't match.",400))
    }

    res.status(200).cookie("token",token,options).json({
        token:token,
        message: "Success"
    })
})
```
Controller>UserCon.js

## Admin - Get Any User Info

Controller>UserCon.js

```javascript
export const GetAnyUserInfo=catchAsyncError(async(req,res,next)=>{
    const user= await UserModel.findById(req.params.id)

    if(!user){
        return next( new ErrorHandle("User info not found",400))
    }

    res.status(200).json({
        user
    })
})
```

## Admin - Get All User Info

Controller>UserCon.js

```javascript
export const AllUserInfo=catchAsyncError(async(req,res,next)=>{
    const users= await UserModel.find()

    if(!users){
        return next( new ErrorHandle("No users info found",400))
    }

    res.status(200).json({
        users
    })
})
```

## Admin - Update Any User Info

Controller>UserCon.js

```javascript
export const UpdateAnyUserInfo=catchAsyncError(async(req,res,next)=>{
    const user= await UserModel.findById(req.params.id)

    if(!user){
        return next( new ErrorHandle("User info not found",400))
    }
    user.name=req.body.name
    user.email=req.body.email

    await user.save()
    res.status(200).json({
        user,
        message:"Success"
    })
})
export const GetAnyUserInfo=catchAsyncError(async(req,res,next)=>{
    const user= await UserModel.findById(req.params.id)

    if(!user){
        return next( new ErrorHandle("User info not found",400))
    }

    res.status(200).json({
        user
    })
})
```

## Admin - Delete Any User

Controller>UserCon.js

```javascript
export const DeleteAnyUser=catchAsyncError(async(req,res,next)=>{

    const info=await UserModel.findByIdAndDelete(req.params.id)

    if(!info){
        return next(new ErrorHandle("Delete Failed",400))
    }

    res.status(200).json({
        message:"Success"
    })
})

```
