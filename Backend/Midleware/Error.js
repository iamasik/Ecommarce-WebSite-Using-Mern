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
        error = new ErrorHandle(message, 400);
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