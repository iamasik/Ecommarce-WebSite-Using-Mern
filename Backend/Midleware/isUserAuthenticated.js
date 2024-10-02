
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