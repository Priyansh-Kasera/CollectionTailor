class ErrorHandler extends Error {
    constructor(statusCode,message){
        super(message)
        this.statusCode = statusCode
        console.log("creting error handler object")
        Error.captureStackTrace(this,this.constructor);
    }
}
module.exports = ErrorHandler