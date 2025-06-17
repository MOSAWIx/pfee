const Admin=require('../models/AdminModel');
const connectDB = require('../config/db'); 



const insertAdminData = async () => {
    try {
        // Connect to the database
        await connectDB();
        console.log("Connected to the database");
        const adminData = {
            name: "Mohda",
            email: "MohdaKing@gmail.com",
            password: "admin123"
        };
        // Delete existing admin data
        await Admin.deleteMany({});
        console.log("Existing admin data deleted");
        // Create a new admin
        const newAdmin = new Admin(adminData);
        await newAdmin.save();
        console.log("Admin created successfully:", newAdmin);
    }
    catch (error) {
        console.error("Error creating admin:", error);
    }
    finally {
        process.exit(0); // Exit the process after the operation
    }
};

insertAdminData();