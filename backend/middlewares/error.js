class ErrorHandler extends Error{ // extends means inside ErrorHandler we have all function of Error class
    constructor(message,statusCode){
        super(message); //super means calling parent class constructor
        this.statusCode = statusCode; // statusCode is not present in Error class so we r creating it here by this keyword

        Error.captureStackTrace(this,this.constructor);
    }
}
export const errorMiddleware = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500; 
    err.message = err.message || "Internal Server Error";

    if(err.name === "CastError"){ //CastError means change in datatype and wrong input not valid 
        const message = `Invalid: ${err.path}`;
        err = new ErrorHandler(message,400);  // 400 means bad request
    }
    if(err.code === 11000){ //11000 is error code for duplicate key error in mongodb
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message,400);
    }
    if(err.name === "JsonWebTokenError"){ //for jwt error
        const message = `Json Web Token is invalid, Try Again!`;
        err = new ErrorHandler(message,400);
    }
    if(err.name === "TokenExpiredError"){ //for jwt token expired error
        const message = `Json Web Token is expired, Try Again!`;
        err = new ErrorHandler(message,400);
    }
    return res.status(err.statusCode).json({ // for checking error in json format
        success:false,
        message:err.message
    });
}
export default ErrorHandler;