const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    console.log("Attempting to connect to MongoDB...");
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connection Success");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
