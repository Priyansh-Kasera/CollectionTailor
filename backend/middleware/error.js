const ErrorHandler = require("../Utility/errorhandler")
module.exports = (err,req,res,next)=>{
    console.log("this called when error occured")
    err.statusCode = err.statusCode || 500
    err.message  = err.message || "Internal server error"
    console.log(err.name,err.path)
    if(err.name === "CastError"){
        const message = `Resource not found. Invalid : ${err.path}`
        err = new ErrorHandler( 400,message)
    }
    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
}