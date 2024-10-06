
# Send reset mail | Reset token using crypto | Reset Password | Jwt and duplicate error handle

## Send reset mail

install nodemailer. for this I use mailtrap SMTP


Utils>sendMail.js

```javascript
import nodemailer from 'nodemailer'
import catchAsyncError from './catchAsyncError.js';
const sendEmail =catchAsyncError( async (options) => {
    const transport = nodemailer.createTransport({
      host: process.env.MAIL_TRAP_HOST,
      port: 25,
      auth: {
        user: process.env.MAIL_TRAP_USER,
        pass: process.env.MAIL_TRAP_PASS
      }
    })
    const message = {
      from: `${process.env.MAIL_TRAP_NAME} <${process.env.MAIL_TRAP_EMAIL}>`,
      to: options.email,
      subject: options.subject,
      html: options.message
    };

    await transport.sendMail(message);
  })

  export default sendEmail
```
Controller>UserCon.js

```javascript
export const ForgetPassword=catchAsyncError(async(req,res,next)=>{
    const user= await UserModel.findOne(req.body)
    if(!user){
        return next(new ErrorHandle("User not found", 401))
    }
    const URL=`${process.env.DOMAIN}/Api/V1/SetPassword/${user.ResetToken()}`
    await user.save()
    const Options={
        email:user.email,
        subject:"Reset your password",
        message:Template(user.name,URL)
    }
    
    try{
        await sendEmail(Options)
    }catch(err){
        return next(new ErrorHandle("Password Reset failed.",403))
    }
    res.status(200).json({
        message:"Password reset message sent."
    })

})
```

Make sure I have all environment variable
```javascript
MAIL_TRAP_PORT=2525
MAIL_TRAP_HOST=sandbox.smtp.mailtrap.io
MAIL_TRAP_USER=
MAIL_TRAP_PASS=
MAIL_TRAP_NAME=EcomShop
MAIL_TRAP_EMAIL=contact@Ecom.com
DOMAIN=http://127.0.0.1:8080
```

## Reset token using crypto
Model>UserModel.js

```javascript
// Reset Password One time token 
UserModel.methods.ResetToken=function(){
    const Token=crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken=crypto.createHash("sha256").update(Token).digest("hex")
    this.resetPasswordExpire=Date.now()+30*60*1000
    return Token
}
```

## Need to setup a HTML email template
Template.js


## Reset Password

```javascript
export const ResetPassword=catchAsyncError(async(req,res,next)=>{
    const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
    const user=await UserModel.findOne({resetPasswordToken,resetPasswordExpire: {$gte:Date.now()}})
    if(!user){
        return next(new ErrorHandle("User not found", 401))
    }
    user.password=req.body.password
    user.resetPasswordToken=undefined
    user.resetPasswordExpire=undefined
    user.save()
    res.status(200).json({
        message:"Password changed."
    })
})
```

## Jwt and duplicate error handle

Midleware>Error.js

```javascript
   // JWT Token Expired Error
    if (err.name === "TokenExpiredError") {
        error = new ErrorHandle("Your token time has been expired. Please login again.", 400);
      }

    // Duplicate error handle
    if (err.code === 11000) {
        error = new ErrorHandle(`This ${err?.keyValue?.email} is already registered`, 400);
      }
```