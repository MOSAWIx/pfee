const jwt = require('jsonwebtoken');
require('dotenv').config();
// generate token
const generateToken=(user,isAdmin=false)=>{
    const payload = {
        user: {
            id: user._id
        }
    };
    // if user is admin, use admin secret key
    // else use user secret key
    const jWtSecret= isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.SECRET_KEY;
    const token = jwt.sign(payload,jWtSecret);
    return token;
}


module.exports = generateToken;