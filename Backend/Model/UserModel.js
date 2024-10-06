import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
const UserModel=new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Name can't be eampty."],
        maxLength:[30, "Name character can't be exceed 30"]
    },
    email:{
        type:String,
        required:[true, "Please enter your email."],
        unique:true
    },
    password:{
        type:String,
        required:[true, "Please eneter your password."],
        minLength:[6, "Please enter at least 6 chartacter"],
        select: false
    },
    aveter:{
        public_id:String,
        url:String
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {timestamps:true})

//Encrypt password before saving
UserModel.pre("save", async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password=await bcrypt.hash(this.password, 12)
})

//Check is password is right
UserModel.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

//jwt token
UserModel.methods.getJwtToken=function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRE})
}

// Reset Passwor One time token 
UserModel.methods.ResetToken=function(){
    const Token=crypto.randomBytes(20).toString("hex")
    this.resetPasswordToken=crypto.createHash("sha256").update(Token).digest("hex")
    this.resetPasswordExpire=Date.now()+30*60*1000
    return Token
}
export default mongoose.model("UserModel", UserModel)