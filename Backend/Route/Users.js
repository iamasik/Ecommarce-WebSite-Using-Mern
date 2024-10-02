import express from "express"
const UserRoute=express.Router()
import {AddUser, LoginUser, LogOut} from "../Controller/UserCon.js"

UserRoute.route('/AddUser').post(AddUser)
UserRoute.route('/Login').post(LoginUser)
UserRoute.route('/Logout').post(LogOut)

export default UserRoute