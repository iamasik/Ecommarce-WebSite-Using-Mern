
# Add new order, user view single and all orders, Admin view all orders, update orders, delete orders

## User - Get User Info

Model>OrderModel.js

```javascript
import mongoose from "mongoose";
import UserModel from "./UserModel.js"

const OrderModel=new mongoose.Schema({
    shippingInfo:{
        address: {
            type: String,
            required: true,
          },
          city: {
            type: String,
            required: true,
          },
          phoneNo: {
            type: String,
            required: true,
          },
          zipCode: {
            type: String,
            required: true,
          },
          country: {
            type: String,
            required: true,
          }
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: "UserModel"
    },
    orderItems: [
        {
          name: {
            type: String,
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          image: {
            type: String,
            required: true,
          },
          price: {
            type: String,
            required: true,
          },
          product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
          },
        },
      ],
    paymentMethod: {
    type: String,
    required: [true, "Please select payment method"],
    enum: {
        values: ["COD", "Card"],
        message: "Please select: COD or Card",
    },
    },
    paymentInfo: {
    id: String,
    status: String,
    },
    itemsPrice: {
    type: Number,
    required: true,
    },
    taxAmount: {
    type: Number,
    required: true,
    },
    shippingAmount: {
    type: Number,
    required: true,
    },
    totalAmount: {
    type: Number,
    required: true,
    },
    orderStatus: {
        type: String,
        enum: {
          values: ["Processing", "Shipped", "Delivered"],
          message: "Please select correct order status",
        },
        default: "Processing",
      },
      deliveredAt: Date,
},{timestamps:true})

export default mongoose.model("OrderModel",OrderModel)
```
Controller>OrderCon.js

```javascript
import catchAsyncError from '../Utils/catchAsyncError.js'
import ErrorHandle from '../Utils/ErrorHandle.js'
import OrderModel from '../Model/OrderModel.js'
import ProductsModel from '../Model/ProductsModel.js'

export const AddOrder=catchAsyncError(async(req,res,next)=>{
    
    const {shippingInfo, orderItems, paymentMethod, paymentInfo, itemsPrice, taxAmount, shippingAmount, totalAmount}=req.body

    const Data= await OrderModel.create({
        shippingInfo, orderItems, paymentMethod, paymentInfo, itemsPrice, taxAmount, shippingAmount, totalAmount, user:req.user._id
    })

    orderItems.forEach(async item=>{
        const Product = await ProductsModel.findById(item.product)
        if(Product){
            Product.stock=Product.stock-item.quantity
            await Product.save({validateBeforeSave:false})
        }
    })

    if(!Data){
        return next(new ErrorHandle("Something is wrong",400))
    }
    res.status(201).json({
        message:"Success"
    })
})

export const GetSingleOrder=catchAsyncError(async(req,res,next)=>{
    
    const OrderInfo=await OrderModel.findById(req.params.id).populate('user','name email')

    
    if(OrderInfo.user.id!=req.user.id){
        return next(new ErrorHandle("This order not belongs to you.",400))
    }
    
    if(!OrderInfo){
        return next(new ErrorHandle("Order not found",400))
    }
    res.status(200).json({
        OrderInfo,
        message:"Success"
    })
})

export const MyAllOrders=catchAsyncError(async(req,res,next)=>{
    
    const Orders=await OrderModel.find({user:req.user._id})
    
    if(!Orders){
        return next(new ErrorHandle("No orders found",400))
    }
    res.status(200).json({
        Orders,
        message:"Success"
    })
})

//Admin
export const AllOrders=catchAsyncError(async(req,res,next)=>{
    
    const Orders=await OrderModel.find()
    
    if(!Orders){
        return next(new ErrorHandle("No orders found",400))
    }
    res.status(200).json({
        Orders,
        message:"Success"
    })
})

//Admin
export const UpdateOrder=catchAsyncError(async(req,res,next)=>{
    
    const Orders=await OrderModel.findById(req.params.id)
    
    if(!Orders){
        return next(new ErrorHandle("No order found",400))
    }
    Orders.orderStatus=req.body.orderStatus
    Orders.deliveredAt=Date.now()
    Orders.save({validateBeforeSave:false})

    res.status(200).json({
        Orders,
        message:"Success"
    })
})

//Admin
export const DeleteOrder=catchAsyncError(async(req,res,next)=>{
    
    const Order=await OrderModel.findByIdAndDelete(req.params.id)
    
    if(!Order){
        return next(new ErrorHandle("No order found",400))
    }
    Order.orderItems.forEach(async item=>{
        const Product = await ProductsModel.findById(item.product)
        if(Product){
            Product.stock=Product.stock+item.quantity
            await Product.save({validateBeforeSave:false})
        }
    })

    res.status(200).json({
        message:"Success"
    })
})


```