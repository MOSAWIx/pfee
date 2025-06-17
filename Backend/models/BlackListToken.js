// models/BlacklistedToken.js
const mongoose = require('mongoose');

const blacklistedTokenSchema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now, expires: '1h' } // Auto-delete after 1 hour
});

module.exports = mongoose.model('BlacklistedToken', blacklistedTokenSchema);