const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err,req,res,next) =>{
    let error = {...err}

    error.message = err.message;

    // console.log(err.stack)
    console.log(err)


    // mongoose bad object id
    if (err.name ==="CastError"){
        const message=`Bootcamp not found with ID ${err.value}`
        error =  new ErrorResponse(message,404);    
    }

    //mongoose duplicate value
    if (err.code === 11000){
        const message = "duplicate value entered"
        error = new ErrorResponse(message,400);
    }

    // /mongoose validation error
    if (err.name === "ValidationError"){
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message,400)
    }
    res.status(error.statusCode|| 500 ).json({
        // statusCode : err.statusCode,
        success : false,
        error :error.message  || "Server Error"
    })
}

module.exports = errorHandler;



 