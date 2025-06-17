const jwt = require('jsonwebtoken');
require('dotenv').config();
// Generate Token
const generateToken = (payload, expiresIn = '1d',isAdmin=false) => {
    const jwtSecret = isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET;
    return jwt.sign(
        {
            // If payload is an object, spread it. Otherwise assume it's a user ID
            ...(typeof payload === 'object' ? payload : { userId: payload })
        },
        jwtSecret,
        { expiresIn }
    );
};
// Verify Token
const verifyToken = (token,isAdmin=false) => {
    const jwtSecret = isAdmin ? process.env.ADMIN_JWT_SECRET : process.env.JWT_SECRET;
    try {
        return jwt.verify(token,jwtSecret);
    } catch (error) {
        error.message = `JWT Verification Failed: ${error.message}`;
        throw error;
    }
};

module.exports = {
    generateToken,
    verifyToken
};