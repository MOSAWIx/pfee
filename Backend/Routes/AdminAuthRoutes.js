const express = require('express');
const router = express.Router();
const adminAuthController = require('../controllers/AuthController/AdminController');
// Middleware
const authMiddleware = require('../middleware/AuthMiddelware');


// routers
router.post('/login', adminAuthController.LoginAdmin); // Route to login as admin
router.post("/logout", authMiddleware(true), adminAuthController.LogoutAdmin); 


module.exports = router;