import UserModel from "../Model/UserModel.js"
import ErrorHandle from "../Utils/ErrorHandle.js"
import catchAsyncError from "../Utils/catchAsyncError.js"

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
        return next(new ErrorHandle("Please enter you email and password."))
    }

    //Always use find one while finding single info to aboid [] arry return
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

export const LogOut=catchAsyncError(async(req,res,next)=>{
    const options={
        expires:new Date(Date.now()+1000),
        httpOnly:true
    }
    res.status(200).cookie("token",null,options).json({
        message:"Success"
    })
})