const Admin = require('../../models/AdminModel');
const generateToken = require('../../Helpers/generateToken');
const joi = require('joi');
const BlackListToken = require('../../models/BlackListToken');

// Login Admin
exports.LoginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        console.log(email,password)
        // Check if email is valid
        const AdminSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().required().min(6)
        });
        // check error
        const { error } = AdminSchema.validate(req.body);
        if (error) {
            const myError = new Error(error.details[0].message);
            myError.statusCode = 400;
            return next(myError);
        }
        // check if admin exists
        const admin = await Admin.findOne({ email });

        console.log(admin)
        if (!admin) {
            const myError = new Error('Invalid credentials');
            myError.statusCode = 400;
            return next(myError);
        }
        // check if password is correct
        // if(!await admin.comparePassword(password)){
        //     const myError = new Error('Password is incorrect');
        //     myError.statusCode = 400;
        //     return next(myError);
        // }
        // create token
        const token =  generateToken(admin,true);
        if (!token) {
            const myError = new Error('Internal server error');
            myError.statusCode = 500;
            return next(myError);
        }
        res.status(200).json({
            "Admin": {
                "name": admin.name,
                "email": admin.email
            },
            "token": token
        });

    } catch (err) {
        return next(err);
    }
};
// Logout Admin
exports.LogoutAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer', '').trim();
        console.log(token);
        // add token to blacklist
        const newBlackListToken = new BlackListToken({ token });
        await newBlackListToken.save();
        res.status(200).json({ "message": "User logged out successfully" });
    }catch(err){
        const myError = new Error('Internal server error');
        myError.statusCode = 500;
        return next(myError);
    }
};