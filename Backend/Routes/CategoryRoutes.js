const router = require('express').Router();
const CategoryController = require('../controllers/CategoryController/CategoryController');
// Middleware
const  AuthMiddleware = require('../middleware/AuthMiddelware');

// Category Routes
router.post('/category', AuthMiddleware(true), CategoryController.addCategory); // Create Category
router.get('/categories', CategoryController.getCategories); // Get All Categories
router.get('/category/:id', CategoryController.getCategoryById); // Get Category by id
router.put('/category/:id', AuthMiddleware(true), CategoryController.updateCategory); // Update Category by id
router.delete('/category/:id', AuthMiddleware(true),CategoryController.deleteCategory); // Delete Category by id

module.exports = router;


