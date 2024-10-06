import mongoose from "mongoose";
const ProductsModel=new mongoose.Schema({
    name:{
        type:String,
        required: [true, "Please insert a product name"],
        maxLength:[200, "It should be within 200 characters"]
    },
    price:{
        type:Number,
        required: [true, "Please insert product price"],
        message:"Insert numbers as  a value"
    },
    description:{
        type:String,
        required:[true, "The product must have some description"],
        maxLength:[2000, "Description need to be within 2000 character"]
    },
    ratings:{
        type:Number,
        default:0
    },
    category:{
        type:String,
        required:[true, "The product must have a category"],
        enum:[
            "Laptops",
            "Tablets",
            "Desktops",
            "Accessories",
            "Televisions",
            "Headphones",
            "Cameras",
            "Electronics",
            "Headphones",
            "Smart Home Devices",
            "Printers",
            "Drones",
            "Home",
            "Outdoor",
            "Networking Equipment",
            "Sports",
            "Home Appliances",
            "Books",
            "Food"
        ],
        message:"Please select a category"
    },
    images:[
        {
            public_id: {
              type: String,
              required: true,
            },
            url: {
              type: String,
              required: true,
            },
          },
    ],
    seller:{
        type:String,
        required:[true, "The product must have a seller name."]
    },
    stock:{
        type:Number,
        required:[true,"Please mention how many product are there."]
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                reqired:true
            },
            rating: {
                type: Number,
                required: true,
              },
            comment:{
                type:String,
                required:true
            }

        }
    ],
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{timestamps:true})

export default mongoose.model("ProductsModel",ProductsModel)