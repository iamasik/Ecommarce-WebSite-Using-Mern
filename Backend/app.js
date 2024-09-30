import express from 'express';
const app=express()
// To parse json request
app.use(express.json())

// Environment variable setup
import dotenv from 'dotenv'
dotenv.config({path:"Backend/Config/config.env"})

//Connect DataBase
import DabaseConnect from './Config/DBConnect.js'
DabaseConnect()

//Use Product Router
import ProductRoute from './Route/Products.js'
app.use("/Api/V1", ProductRoute)

app.listen(process.env.PORT,()=>{
    console.log(`Server started at ${process.env.PORT}`);
})
