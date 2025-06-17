const Order = require('../../models/OrdersModel');
const Product = require('../../models/ProductModel');
const mongoose = require('mongoose');
const Joi = require('joi');
const orderSchema = require('./Validation/OrderShemaValidation');
const sendOrderToGoogleSheet = require('../../Utils/SendGoogleSheet');



// Create Order
exports.createOrder = async (req, res, next) => {
    try {
        const { error, value } = orderSchema.validate(req.body);
        if (error) {
            const newErr = new Error();
            newErr.statusCode = 400;
            newErr.message = error.details[0].message;
            return next(newErr);
        }

        const { color, customer, product, quantity, taille, size, status, googleSheetId } = value;

        const order = new Order({
            color,
            customer,
            product,
            quantity,
            taille: taille || null,
            size: size || null,
            status: status || 'pending',
        });

        await order.save();


        res.status(201).json({
            message: 'Order created successfully',
            order,
        });

        // 🔄 Send to Google Sheets in background
        if( googleSheetId && googleSheetId.trim() !== '') {
            await sendOrderToGoogleSheet(order, googleSheetId);
        }
         // 🔄 Update product stock in background
        if (product && product.id) {
            try {
                const productDoc = await Product.findById(product.id);
                if (!productDoc) {
                    console.error('Product not found for stock update');
                    return;
                }

                // Get the color variant using the index from the order
                const colorVariant = productDoc.colors[color.index];
                if (!colorVariant) {
                    console.error('Color variant not found');
                    return;
                }

                // Update stock based on taille or size
                if (taille) {
                    // Find the taille in the color variant's tailles array
                    const tailleItem = colorVariant.tailles.find(t => t.value === taille);
                    if (tailleItem) {
                        tailleItem.stock = Math.max(0, tailleItem.stock - quantity);
                    } else {
                        console.error('Taille not found in product');
                    }
                } else if (size) {
                    // Find the size in the color variant's sizes array
                    const sizeItem = colorVariant.sizes.find(s => s.value === size);
                    if (sizeItem) {
                        sizeItem.stock = Math.max(0, sizeItem.stock - quantity);
                    } else {
                        console.error('Size not found in product');
                    }
                }

                await productDoc.save();
                console.log('Product stock updated successfully');
            } catch (error) {
                console.error('Error updating product stock:', error);
            }
        }
        

    } catch (error) {
        const newErr = new Error();
        newErr.statusCode = 500;
        newErr.message = error.message;
        next(newErr);
    }
};

// Get All Orders
exports.getAllOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status } = req.query;

        const filter = {};
        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .skip((page - 1) * limit)
            .limit(Number(limit)).sort({ createdAt: -1 });

        const totalOrders = await Order.countDocuments(filter);

        res.status(200).json({
            message: 'Orders fetched successfully',
            orders,
            pagination: {
                total: totalOrders,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(totalOrders / limit)
            }
        });
    } catch (error) {
        const newErr = new Error();
        newErr.statusCode = 500;
        newErr.message = error.message;
        next(newErr);
    }
};

// Get Order By Id
exports.getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        res.status(200).json({
            message: 'Order fetched successfully',
            order
        });
    } catch (error) {
        const newErr = new Error();
        newErr.statusCode = 500;
        newErr.message = error.message;
        next(newErr);
    }
};

// Update Order By Id
exports.updateOrder = async (req, res, next) => {
    try {
        const { status } = req.body;
        console.log("update order status", req.body);
        if (!status) {
            const newErr = new Error();
            newErr.statusCode = 400;
            newErr.message = 'Status is required';
            return next(newErr);
        }
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json({
            message: 'Order status updated successfully',
            order
        });
    } catch (error) {
        const newErr = new Error();
        newErr.statusCode = 500;
        newErr.message = error.message;
        next(newErr);
    }
};

// Delete Order By Id
exports.deleteOrderById = async (req, res, next) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: 'Order deleted successfully',
            orderId: req.params.id
        });
    } catch (error) {
        const newErr = new Error();
        newErr.statusCode = 500;
        newErr.message = error.message;
        next(newErr);
    }
};


