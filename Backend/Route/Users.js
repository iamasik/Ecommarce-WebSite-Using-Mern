import express from "express"
const UserRoute=express.Router()
import {AddUser, LoginUser, LogOut, ForgetPassword,ResetPassword} from "../Controller/UserCon.js"
// import isUserAuthenticated from '../Midleware/isUserAuthenticated.js'

UserRoute.route('/ForgetPassword').put(ForgetPassword)
UserRoute.route('/ResetPassword/:token').post(ResetPassword)
UserRoute.route('/AddUser').post(AddUser)
UserRoute.route('/Login').post(LoginUser)
UserRoute.route('/Logout').post(LogOut)

export default UserRoute