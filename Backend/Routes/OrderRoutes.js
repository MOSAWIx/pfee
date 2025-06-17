const express = require('express');
const router = express.Router();
const Order = require('../models/OrdersModel'); 


const orderController = require('../controllers/OrderController/OrderController')


router.post('/order',orderController.createOrder);
router.get('/orders',orderController.getAllOrders);
router.get('/order/:id',orderController.getOrderById);
router.put('/order/:id',orderController.updateOrder);
router.delete('/order/:id',orderController.deleteOrderById);












module.exports = router;
