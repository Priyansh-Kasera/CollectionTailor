const sendToken = async(user,statusCode,res)=>{
    const token =await user.getJwtToken();
    console.log("token",token)
    
    const options = {
        httpOnly : true,
        expires : new Date(
            Date.now() + process.env.COOKIE_EXPIRE*24*60*60*1000
        )
    }

    res.status(statusCode).cookie("token",token,options).json({
        "success" : true,
        "message" : 'login Successful'
    })
}
module.exports = sendToken;