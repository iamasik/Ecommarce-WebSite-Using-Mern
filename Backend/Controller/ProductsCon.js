import ProductsModel from "../Model/ProductsModel.js";
import ErrorHandle from "../Utils/ErrorHandle.js";
import catchAsyncError from "../Utils/catchAsyncError.js";
import ProductsFilter from "../Utils/ProductsFilter.js";

export const FindProduct=catchAsyncError(async(req,res,next)=>{
    //Reminder: filters() working over the fetch data and search() working over the database
    let useForFilter=new ProductsFilter(ProductsModel,req.query).search().filters()

    // If no pagination
    // let Products = await useForFilter.QueryProductsModel

    //If pagination
    const numOfItems=4
    useForFilter.pagination(numOfItems)
    let Products=await useForFilter.QueryProductsModel
    
    res.status(200).json(
        {
            Total:Products.length,
            Data:Products,
            message:"Success"
        }
    )
})

export const ViewProducts=catchAsyncError(
    async (req,res, next)=>{
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
    async (req,res, next)=>{
        req.body.user=req.user._id
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

export const ViewOneProduct=catchAsyncError(async (req,res,next)=>{
    const Product=await ProductsModel.findById(req.params.id)
    if(!Product){
        return next(new ErrorHandle("Can't find the product",400))
    }
    res.status(200).json({
        Product
    })
})

export const UpdateProduct=catchAsyncError(async (req, res,next)=>{
    const Product=await ProductsModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
    if(!Product){
        return next(new ErrorHandle("Can't update the product info", 400))
    }
    res.status(201).json({
        Product
    })
})