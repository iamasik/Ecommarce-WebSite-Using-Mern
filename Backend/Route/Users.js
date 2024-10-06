import express from "express"
const UserRoute=express.Router()
import {AddUser, LoginUser, LogOut, ForgetPassword,ResetPassword,UserInfo,AllUserInfo,UpdatePassword,GetAnyUserInfo,UpdateAnyUserInfo,DeleteAnyUser} from "../Controller/UserCon.js"
import isUserAuthenticated from '../Midleware/isUserAuthenticated.js'
import userRole from "../Midleware/userRole.js"

UserRoute.route('/ForgetPassword').put(ForgetPassword)
UserRoute.route('/ResetPassword/:token').post(ResetPassword)
UserRoute.route('/AddUser').post(AddUser)
UserRoute.route('/Login').post(LoginUser)
UserRoute.route('/Logout').post(LogOut)

// Only for authenticated users
UserRoute.use(isUserAuthenticated)
UserRoute.route('/GetUserInfo').get(UserInfo)
UserRoute.route('/UpdatePassword').put(UpdatePassword)

// For admin
UserRoute.route('/GetAnyUserInfo/:id').get(userRole("admin"),GetAnyUserInfo)
UserRoute.route('/GetAllUserInfo').get(userRole("admin"),AllUserInfo)
UserRoute.route('/UpdateAnyUserInfo/:id').put(userRole("admin"),UpdateAnyUserInfo)
UserRoute.route('/DeleteAnyUser/:id').put(userRole("admin"),DeleteAnyUser)

export default UserRoute