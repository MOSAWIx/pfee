const jwt = require('jsonwebtoken');
require('dotenv').config();
const BlackListToken = require('../models/BlackListToken');
const { verifyToken } = require('../Utils/Jwt');

const AuthMiddleware = (isAdmin = false) => {
    return async (req, res, next) => {
        try {
            // Check if Authorization header exists
            if (!req.headers.authorization) {
                const myError = new Error('No authorization header, authorization denied');
                myError.statusCode = 401;
                return next(myError);
            }

            // Extract the token properly
            const token = req.headers.authorization.split(' ')[1].replace(/"/g, '');
            console.log('Extracted Token:', token);

            if (!token) {
                const myError = new Error('No token, authorization denied'); 
                myError.statusCode = 401;
                return next(myError);
            }

            // Check if token is blacklisted
            const isBlackListed = await BlackListToken.findOne({ token });
            if (isBlackListed) {
                const myError = new Error('Token is blacklisted');
                myError.statusCode = 401;
                return next(myError);
            }

            // Verify token
            const decoded = verifyToken(token, isAdmin);
            console.log('Decoded Token:', decoded);
            if (!decoded) {
                const myError = new Error('Token is not valid');
                myError.statusCode = 401;
                return next(myError);
            }

            // Token is valid
            req.user = decoded.user;
            next();
        } catch (err) {
            console.error('Auth Middleware Error:', err);
            const myError = new Error('Server Error');
            myError.statusCode = 500;
            next(myError);
        }
    };
};

module.exports = AuthMiddleware;