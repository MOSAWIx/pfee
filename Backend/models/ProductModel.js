const mongoose = require('mongoose');

// Schema for sizes and tailles (with stock)
const sizeSchema = new mongoose.Schema({
    value: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 }
}, { _id: false });

// Schema for color variants
const colorSchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    colorHex: { type: String, required: true },
    images: [{
        webpPath: { type: String, required: true },
        thumbnailPath: { type: String, required: true },
        public_id: { type: String, required: true }
    }],
    sizes: [sizeSchema],   // e.g. S, M, L with stock
    tailles: [sizeSchema]  // e.g. 36, 38, 40 with stock
}, { _id: false });

// Main product schema
const productSchema = new mongoose.Schema({
    title: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    description: {
        en: { type: String },
        fr: { type: String },
        ar: { type: String }
    },
    basePrice: { type: Number, required: true },
    priceFor2: { type: Number }, // Optional price for 2 products
    // Optional price for 3 products
    discount: { type: Number, default: 0 },
    colors: [colorSchema],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    rating: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    googleSheetId: { type: String, unique: true, sparse: true, required: false }, // Optional Google Sheet ID
    createdAt: { type: Date, default: Date.now }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Product', productSchema);
