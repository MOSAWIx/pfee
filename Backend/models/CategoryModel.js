const mongoose = require('mongoose');
// Shema Category
const categorySchema = new mongoose.Schema({
    name: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    description: {
        en: { type: String, required: false },
        fr: { type: String, required: false },
        ar: { type: String, required: false }
    },
    slug: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    parent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
}, {
    timestamps: true,
    versionKey: false
});

// Export Category Model
module.exports = mongoose.model('Category', categorySchema);