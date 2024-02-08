const jwt = require('jsonwebtoken')

const decryptToken = (token)=>{
    return  jwt.verify(token,process.env.JWT_SECRET,{expiresIn :process.env.JWT_EXPIRE})
    
}

module.exports = decryptToken;

