const jwt = require('jsonwebtoken');
require('dotenv').config();


const verifyToken = (token,isAdmin=false) => {
    try {
          // if user is admin, use admin secret key
    // else use user secret key
        const jWtSecret= isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.SECRET_KEY;
        const decoded =  jwt.verify(token,jWtSecret);
        console.log("Decoded Token:", decoded);
        
        if(!decoded){
            return false;
        }
        return decoded;
    } catch (err) {
        return false;
    }
};


module.exports = verifyToken;