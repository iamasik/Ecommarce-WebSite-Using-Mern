import express from 'express';
import ErrorMessage from './Midleware/Error.js'
import cookieParser from 'cookie-parser';
const app=express()
// To parse json request
app.use(express.json())
app.use(cookieParser())
//Define it at the top to find uncaughtException error such as Variable not define 
process.on("uncaughtException",(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("Shutting down due to uncaught expection");
    process.exit(1)
    
})

// Environment variable setup
import dotenv from 'dotenv'
dotenv.config({path:"Backend/Config/config.env"})



//Connect DataBase
import DabaseConnect from './Config/DBConnect.js'
DabaseConnect()

//Use Product Router
import ProductRoute from './Route/Products.js'
app.use("/Api/V1", ProductRoute)

//Use User Router
import UserRoute from './Route/Users.js';
app.use("/Api/V1",UserRoute)


//Handing error and show message 
app.use(ErrorMessage)

const server=app.listen(process.env.PORT,()=>{
    console.log(`Server started at ${process.env.PORT}`);
})

//Define it at the bottom to find unhandled Rejection error such as MongoDB url Error 
process.on("unhandledRejection",(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1)
    })
})
