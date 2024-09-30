
# Error Handing

Complete process of error anding.

## Step 1 
Use one central Error throw:

Utils>ErrorHandle.js
```bash
class ErrorHandle extends Error{
    constructor(message,statuscode){
        super(message)
        this.statusCode=statuscode

        Error.captureStackTrace(this, this.constructor)
    }
}
export default ErrorHandle
```
## Step 2

Import that central error and use on controllers

```javascript
import ErrorHandle from "../Utils/ErrorHandle.js"; //Import it

export const DeleteProduct=async (req,res,next)=>{
    const Product= await ProductsModel.findById(req?.params?.id)
    if(!Product){
        return next(new ErrorHandle("Product Not FOunt",400)) //Use it
    }
    await Product.deleteOne()
    res.status(200).json({
        message: "Product Deleted"
    })
}
```

## Step 3
Get that central error and show error messages
Midleware>Error.js

```javascript
const ErrorMessage=(err,req,res,next)=>{
    let error={
        message:err.message,
        statuscode:err.statuscode || 404
    }

    if(process.env.NODE_ENV==="Development"){
        res.status(error.statuscode).json({
            error:error.message,
            statuscode:error.statuscode,
            stack:err?.stack
        })
    }
}
export default ErrorMessage
```
## Step 4

import and use that show message at the end of the app.js

```javascript
//Handing error and show message 
app.use(ErrorMessage)
```

## Step 5 (If any product id is invalid) = Global error handling

Utilis>catchAsyncError.js.js

import and use that show message at the end of the app.js

```javascript
export default (controllerFunction)=> (req,res,next)=>Promise.resolve(controllerFunction(req,res,next)).catch(next)
```
Here "controllerFunction" is a peparameter which is entire wrapping function from controller. 

```javascript
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
```

Then this Promise.resolve(controllerFunction(req,res,next)) will try to reslove it.  If it's failed to solve it then catch(next) will catch the error and send it to next step. Which is SHow error message midleware.

Now update the middleware Error to get that "CastError" and handle with "Central Error handler". 

Also show error for "Development" and "Production"

```javascript
import ErrorHandle from "../Utils/ErrorHandle.js";
const ErrorMessage=(err,req,res,next)=>{
    let error={
        message:err.message,
        statuscode:err.statuscode || 404
    }
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err?.path}`;
        error = new ErrorHandle(message, 404);
      }
    if(process.env.NODE_ENV==="Development"){
        res.status(error.statuscode).json({
            error:error.message,
            statuscode:error.statuscode,
            stack:err?.stack
        })
    }
    if(process.env.NODE_ENV==="Production"){
        res.status(error.statuscode).json({
            error:error.message
        })
    }
}
export default ErrorMessage
```

## Step 6 (Some Database related Error Handle)

```javascript
import ErrorHandle from "../Utils/ErrorHandle.js";
const ErrorMessage=(err,req,res,next)=>{
    
    let error={
        statusCode: err?.statusCode || 400,
        message: err?.message || "Internal Server Error",
      };

      //If mongodb id not valid
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err?.path}`;
        error = new ErrorHandle(message, 404);
      }

    // ValidationError
    if (err.name === "ValidationError") {
        const message = Object.values(err?.errors).map(item=>item?.message).join(',') || "Please input correct info"
        
        error = new ErrorHandle(message, 404);
      }

    if(process.env.NODE_ENV==="Development"){
        res.status(error.statusCode).json({
            message: error.message,
            error: err,
            stack: err?.stack,
          })
    }

    if(process.env.NODE_ENV==="Production"){
        res.status(error.statusCode).json({
            error:error.message
        })
    }
}
export default ErrorMessage
```

## Step 7 (uncaughtException)
app.js

Define it at the top to find uncaughtException error such as Variable not define 

```javascript
process.on("uncaughtException",(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("Shutting down due to uncaught expection");
    process.exit(1)
})
```

## Step 8 (unhandled Rejection)

app.js

Define it at the bottom to find unhandled Rejection error such as MongoDB url Error 

```javascript
process.on("unhandledRejection",(err)=>{
    console.log(`ERROR: ${err}`);
    console.log("Shutting down server due to Unhandled Promise Rejection");
    server.close(()=>{
        process.exit(1)
    })
})
```
