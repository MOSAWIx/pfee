// This module handles uploading images to Cloudinary.
const cloudinary = require('../Utils/cloudinary');
const streamifier = require('streamifier');

const uploadToCloudinary = (fileBuffer, folder = 'products',originalname = 'file') => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                format: 'webp',  // Convert to WebP automatically
                resource_type: 'image',
                public_id: `${Date.now()}-${originalname.split('.')[0]}`
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        // Pipe the buffer to Cloudinary upload stream
        streamifier.createReadStream(fileBuffer).pipe(uploadStream);
    });
};

module.exports = uploadToCloudinary;
