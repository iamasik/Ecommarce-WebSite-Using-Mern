import UserModel from "../Model/UserModel.js"
import ErrorHandle from "../Utils/ErrorHandle.js"
import catchAsyncError from "../Utils/catchAsyncError.js"
import Template from "../Utils/Template.js"
import sendEmail from "../Utils/sendMail.js"
import crypto from 'crypto'

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
export const UserInfo=catchAsyncError(async(req,res,next)=>{
    const user= await UserModel.findById(req.user._id)

    if(!user){
        return next( new ErrorHandle("User info not found",400))
    }

    res.status(200).json({
        user
    })
})

//Admin
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

export const AllUserInfo=catchAsyncError(async(req,res,next)=>{
    const users= await UserModel.find()

    if(!users){
        return next( new ErrorHandle("No users info found",400))
    }

    res.status(200).json({
        users
    })
})

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

    await user.save()
    
    res.status(200).json({
        message:"Password changed."
    })

})


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

export const LoginUser=catchAsyncError(async(req,res,next)=>{
    const {email, password}=req.body
    if(!email || !password){
        return next(new ErrorHandle("Please enter you email and password.", 400))
    }

    //Always use find one while finding single info to aboid [] arry return
    const info=await UserModel.findOne({email}).select("+password")
    if(!info){
        return next(new ErrorHandle("Please insert correct email.",400))
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

export const LogOut=catchAsyncError(async(req,res,next)=>{
    const options={
        expires:new Date(Date.now()+1000),
        httpOnly:true
    }
    res.status(200).cookie("token",null,options).json({
        message:"Success"
    })
})

export const DeleteAnyUser=catchAsyncError(async(req,res,next)=>{

    const info=await UserModel.findByIdAndDelete(req.params.id)

    if(!info){
        return next(new ErrorHandle("Delete Failed",400))
    }

    res.status(200).json({
        message:"Success"
    })
})

