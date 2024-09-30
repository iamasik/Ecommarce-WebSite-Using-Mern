import ProductsModel from "../Model/ProductsModel.js";
import ErrorHandle from "../Utils/ErrorHandle.js";
import catchAsyncError from "../Utils/catchAsyncError.js";

export const ViewProducts=catchAsyncError(
    async (req,res)=>{
        const Products=await ProductsModel.find()
        if(!Products){
            return next(new ErrorHandle("No products are there",400))
        }
        res.status(200).json({
            Products
        })
    }
)
export const AddProducts=catchAsyncError(
    async (req,res)=>{
        const Products=await ProductsModel.create(req.body)
        if(!Products){
            return next(new ErrorHandle("Product Add failed", 400))
        }
        res.status(200).json({
            Products
        })
    }
)

export const DeleteProduct=catchAsyncError(async (req,res,next)=>{
    const Product= await ProductsModel.findById(req?.params?.id)
    if(!Product){
        return next(new ErrorHandle("Product Not FOunt",400))
    }
    await Product.deleteOne()
    res.status(200).json({
        message: "Product Deleted"
    })
})

export const ViewOneProduct=catchAsyncError(async (req,res)=>{
    const Product=await ProductsModel.findById(req.params.id)
    if(!Product){
        return next(new ErrorHandle("Can't find the product",400))
    }
    res.status(200).json({
        Product
    })
})

export const UpdateProduct=catchAsyncError(async (req, res)=>{
    const Product=await ProductsModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if(!Product){
        return next(new ErrorHandle("Can't update the product info", 400))
    }
    res.status(201).json({
        Product
    })
})