// middlewares/HandleErrors.js

const HandleErrors = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging

    // Default error response
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Send the error response
    res.status(statusCode).json({
        success: false,
        message: message,
        
    });
};

module.exports = HandleErrors;