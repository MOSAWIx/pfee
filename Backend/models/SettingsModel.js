const mongoose = require('mongoose');
const settingsSchema = new mongoose.Schema({
    facebookPixelId: { type: String, required: false, default: null },
    active: { type: Boolean, required: false, default: true }
})


module.exports = mongoose.model('Settings', settingsSchema);


