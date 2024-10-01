import mongoose from "mongoose";
import products from "./data.js";
import ProductsModel from "../Model/ProductsModel.js";

const seedProducts = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/EShop");

    await ProductsModel.deleteMany();
    console.log("Products are deleted");

    await ProductsModel.insertMany(products);
    console.log("Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();
