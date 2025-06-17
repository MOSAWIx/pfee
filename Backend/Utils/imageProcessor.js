const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();
const BASE_URL = process.env.Domain || 'http://localhost:5555';

// Generic image processor that can handle different upload paths
const processImage = async (buffer, originalname, uploadPath, options = {}) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const uniqueId = uniqueSuffix + '-' + Math.round(Math.random() * 1E9);
    
    // Sanitize filename to remove spaces and special characters
    const filename = originalname.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    
    const webpFilename = `webp-${uniqueSuffix}-${filename}.webp`;
    const thumbnailFilename = `thumb-${uniqueSuffix}-${filename}.webp`;
    
    // Create the specified upload path
    const fullUploadPath = path.join(__dirname, '..', uploadPath);
    await fs.mkdir(fullUploadPath, { recursive: true });
    
    // Process to WebP with custom quality or default
    const webpQuality = options.webpQuality || 80;
    const webpBuffer = await sharp(buffer)
        .webp({ quality: webpQuality })
        .toBuffer();
    
    const webpPath = path.join(fullUploadPath, webpFilename);
    await fs.writeFile(webpPath, webpBuffer);
    
    // Create thumbnail if requested
    let thumbnailPath = null;
    if (options.createThumbnail !== false) {
        const thumbnailSize = options.thumbnailSize || { width: 200, height: 200 };
        const thumbnailBuffer = await sharp(buffer)
            .resize(thumbnailSize.width, thumbnailSize.height, { fit: 'cover' })
            .webp({ quality: options.thumbnailQuality || 60 })
            .toBuffer();
        
        thumbnailPath = path.join(fullUploadPath, thumbnailFilename);
        await fs.writeFile(thumbnailPath, thumbnailBuffer);
    }
    
    // Create URL-friendly paths
    const result = {
        webpPath: `${uploadPath}/${webpFilename}`,
        webpUrl: `${BASE_URL}/${uploadPath}/${webpFilename}`,
        public_id: uniqueId
    };
    
    if (thumbnailPath) {
        result.thumbnailPath = `${uploadPath}/${thumbnailFilename}`;
        result.thumbnailUrl = `${BASE_URL}/${uploadPath}/${thumbnailFilename}`;
    }
    
    return result;
};

// Specific processors for different types
const processProductImage = async (buffer, originalname, subfolder = '') => {
    const uploadPath = subfolder ? `uploads/products/${subfolder}` : 'uploads/products';
    return processImage(buffer, originalname, uploadPath, {
        webpQuality: 80,
        createThumbnail: true,
        thumbnailSize: { width: 200, height: 200 },
        thumbnailQuality: 60
    });
};

const processLogoImage = async (buffer, originalname) => {
    return processImage(buffer, originalname, 'uploads/logo', {
        webpQuality: 90,
        createThumbnail: false
    });
};

const processHeroImage = async (buffer, originalname) => {
    return processImage(buffer, originalname, 'uploads/sliders', {
        webpQuality: 85,
        createThumbnail: false,
        // thumbnailSize: { width: 400, height: 250 },
        // thumbnailQuality: 70
    });
};

const processBannerImage = async (buffer, originalname) => {
    return processImage(buffer, originalname, 'uploads/banners', {
        webpQuality: 85,
        createThumbnail: false
    });
};

// Utility function to delete old images
const deleteImageFiles = async (imagePaths) => {
    for (const imagePath of imagePaths) {
        try {
            const fullPath = path.join(__dirname, '..', imagePath);
            await fs.unlink(fullPath);
        } catch (error) {
            console.error(`Error deleting image ${imagePath}:`, error);
        }
    }
};

// Utility function to clear directory
const clearDirectory = async (directoryPath) => {
    try {
        const fullPath = path.join(__dirname, '..', directoryPath);
        const files = await fs.readdir(fullPath);
        
        for (const file of files) {
            await fs.unlink(path.join(fullPath, file));
        }
    } catch (error) {
        console.error(`Error clearing directory ${directoryPath}:`, error);
    }
};

module.exports = {
    processImage,
    processProductImage,
    processLogoImage,
    processHeroImage,
    processBannerImage,
    deleteImageFiles,
    clearDirectory
};