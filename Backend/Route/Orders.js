import express from "express";
import isUserAuthenticated from "../Midleware/isUserAuthenticated.js";
import { AddOrder, GetSingleOrder,MyAllOrders,AllOrders,UpdateOrder,DeleteOrder } from "../Controller/OrderCon.js";
import userRole from "../Midleware/userRole.js";

const OrderRoute=express.Router()

OrderRoute.use(isUserAuthenticated)
OrderRoute.route("/AddOrder").post(AddOrder)
OrderRoute.route("/GetSingleOrder/:id").get(GetSingleOrder)
OrderRoute.route("/MyAllOrders").get(MyAllOrders)

OrderRoute.route("/Admin/AllOrders").get(userRole('admin'),AllOrders)
OrderRoute.route("/Admin/UpdateOrder/:id").put(userRole('admin'),UpdateOrder)
OrderRoute.route("/Admin/DeleteOrder/:id").delete(userRole('admin'),DeleteOrder)

export default OrderRoute