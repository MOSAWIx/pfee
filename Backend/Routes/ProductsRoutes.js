const express = require('express');
const multer = require('../Utils/multer');
const router = express.Router();
const  AuthMiddleware = require('../middleware/AuthMiddelware');

const productController = require('../controllers/ProductController/ProductController');

// Configure multer with a more flexible approach
const colorFieldsMiddleware = (req, res, next) => {
    // Use a general multer setup that accepts any field name
    const upload = multer.any();
    
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).json({ message: "File upload error: " + err.message });
        }
        next();
    });
};

// Use the middleware for the product route
router.post('/product',AuthMiddleware(true),colorFieldsMiddleware, productController.addProduct);

router.get('/products', productController.getProducts);
router.get('/product/:id', productController.getProductById);
router.delete('/product/:id',AuthMiddleware(true),productController.deleteProduct);
router.put('/product/:id',AuthMiddleware(true),colorFieldsMiddleware, productController.updateProduct);
// Get Similar Products
router.get('/product/:id/similar', productController.getSimilarProducts);
// get Collection
router.get('/collections', productController.getCollection);

module.exports = router;