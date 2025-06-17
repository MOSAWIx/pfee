const mongoose = require('mongoose');

// Order Schema
const orderSchema = new mongoose.Schema({
    color: {
        index: Number,
        hex: String,
        name: String
    },
    customer: {
        name: String,
        phone: String,
        city: String,
        note: { type: String, default: null }
    },
    product: {
        id: String,
        price: Number,
        title: String
    },
    quantity: Number,
    taille: { type: String, default: null },
    size: { type: String, default: null },
    status: { type: String, default: null },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);