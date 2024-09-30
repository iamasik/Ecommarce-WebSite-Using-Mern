import ProductsModel from "../Model/ProductsModel.js";

export const ViewProducts=async (req,res)=>{
    const Products=await ProductsModel.find()
    
    res.status(200).json({
        Products
    })
}
export const AddProducts=async (req,res)=>{
    const Products=await ProductsModel.create(req.body)
    res.status(200).json({
        Products
    })
}

export const DeleteProduct=async (req,res)=>{
    const Product= await ProductsModel.findById(req?.params?.id)
    if(!Product){
        return res.status(400).json({
            message:"Product Not FOunt"
        })
    }
    await Product.deleteOne()
    res.status(200).json({
        message: "Product Deleted"
    })
}

export const ViewOneProduct=async (req,res)=>{
    const Product=await ProductsModel.findById(req.params.id)
    if(!Product){
        return res.status(400).json({
            message:"Product Not Found"
        })
    }
    res.status(200).json({
        Product
    })
}

export const UpdateProduct=async (req, res)=>{
    const Product=await ProductsModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
    res.status(201).json({
        Product
    })
}