const multer = require('multer');
const { redisClient } = require('../config/RedisDb');
const { processBannerImage, deleteImageFiles, clearDirectory } = require('../utils/imageProcessor');

// Multer configuration for banner uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 8 * 1024 * 1024 // 8MB limit
    },
    fileFilter: (req, file, cb) => {
        // Check if file is an image
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

// GET - Retrieve all banners
const getBanners = async (req, res) => {
    try {
        // Get from Redis cache first
        const cachedBanners = await redisClient.get('website:banners');
        
        if (cachedBanners) {
            return res.status(200).json({
                success: true,
                data: JSON.parse(cachedBanners),
                source: 'cache'
            });
        }
        
        // If not in cache, return default/empty response
        const defaultBanners = {
            banners: [],
            totalBanners: 0,
            lastUpdated: null
        };
        
        res.status(200).json({
            success: true,
            data: defaultBanners,
            source: 'default'
        });
        
    } catch (error) {
        console.error('Error getting banners:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving banners',
            error: error.message
        });
    }
};

// GET - Retrieve single banner
const getSingleBanner = async (req, res) => {
    try {
        const { bannerId } = req.params;
        
        // Get banners from Redis
        const cachedBanners = await redisClient.get('website:banners');
        
        if (!cachedBanners) {
            return res.status(404).json({
                success: false,
                message: 'No banners found'
            });
        }
        
        const bannersData = JSON.parse(cachedBanners);
        const banner = bannersData.banners.find(b => b.id == bannerId);
        
        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: banner
        });
        
    } catch (error) {
        console.error('Error getting banner:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving banner',
            error: error.message
        });
    }
};

// POST - Create new banner
const createBanner = async (req, res) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No banner image uploaded'
            });
        }
        
        const { 
            title, 
            description, 
            linkUrl, 
            linkText, 
            position = 'top',
            isActive = true,
            displayOrder = 1
        } = req.body;
        
        // Validate required fields
        if (!title) {
            return res.status(400).json({
                success: false,
                message: 'Banner title is required'
            });
        }
        
        // Process the banner image
        const processedImage = await processBannerImage(req.file.buffer, req.file.originalname);
        
        // Get existing banners from Redis
        let bannersData = {
            banners: [],
            totalBanners: 0,
            lastUpdated: null
        };
        
        const cachedBanners = await redisClient.get('website:banners');
        if (cachedBanners) {
            bannersData = JSON.parse(cachedBanners);
        }
        
        // Create new banner object
        const newBanner = {
            id: Date.now(), // Simple ID generation
            title: title,
            description: description || null,
            imageUrl: processedImage.webpUrl,
            imagePath: processedImage.webpPath,
            linkUrl: linkUrl || null,
            linkText: linkText || null,
            position: position,
            isActive: isActive,
            displayOrder: parseInt(displayOrder),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            publicId: processedImage.public_id
        };
        
        // Add to banners array
        bannersData.banners.push(newBanner);
        bannersData.totalBanners = bannersData.banners.length;
        bannersData.lastUpdated = new Date().toISOString();
        
        // Sort by display order
        bannersData.banners.sort((a, b) => a.displayOrder - b.displayOrder);
        
        // Store in Redis cache
        await redisClient.set('website:banners', JSON.stringify(bannersData));
        
        // Set expiration for cache (optional - 24 hours)
        await redisClient.expire('website:banners', 86400);
        
        res.status(201).json({
            success: true,
            message: 'Banner created successfully',
            data: newBanner
        });
        
    } catch (error) {
        console.error('Error creating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating banner',
            error: error.message
        });
    }
};

// PUT - Update existing banner
const updateBanner = async (req, res) => {
    try {
        const { bannerId } = req.params;
        const { 
            title, 
            description, 
            linkUrl, 
            linkText, 
            position,
            isActive,
            displayOrder
        } = req.body;
        
        // Get current banners from Redis
        const cachedBanners = await redisClient.get('website:banners');
        
        if (!cachedBanners) {
            return res.status(404).json({
                success: false,
                message: 'No banners found'
            });
        }
        
        const bannersData = JSON.parse(cachedBanners);
        const bannerIndex = bannersData.banners.findIndex(b => b.id == bannerId);
        
        if (bannerIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        
        // Update banner data (keeping existing values if not provided)
        if (title) bannersData.banners[bannerIndex].title = title;
        if (description !== undefined) bannersData.banners[bannerIndex].description = description;
        if (linkUrl !== undefined) bannersData.banners[bannerIndex].linkUrl = linkUrl;
        if (linkText !== undefined) bannersData.banners[bannerIndex].linkText = linkText;
        if (position) bannersData.banners[bannerIndex].position = position;
        if (isActive !== undefined) bannersData.banners[bannerIndex].isActive = isActive;
        if (displayOrder !== undefined) bannersData.banners[bannerIndex].displayOrder = parseInt(displayOrder);
        
        // If new image is uploaded, process it and delete old one
        if (req.file) {
            // Delete old image
            const oldImagePath = bannersData.banners[bannerIndex].imagePath;
            if (oldImagePath) {
                await deleteImageFiles([oldImagePath]);
            }
            
            // Process new image
            const processedImage = await processBannerImage(req.file.buffer, req.file.originalname);
            
            bannersData.banners[bannerIndex].imageUrl = processedImage.webpUrl;
            bannersData.banners[bannerIndex].imagePath = processedImage.webpPath;
            bannersData.banners[bannerIndex].publicId = processedImage.public_id;
        }
        
        bannersData.banners[bannerIndex].updatedAt = new Date().toISOString();
        bannersData.lastUpdated = new Date().toISOString();
        
        // Sort by display order
        bannersData.banners.sort((a, b) => a.displayOrder - b.displayOrder);
        
        // Update Redis cache
        await redisClient.set('website:banners', JSON.stringify(bannersData));
        
        res.status(200).json({
            success: true,
            message: 'Banner updated successfully',
            data: bannersData.banners[bannerIndex]
        });
        
    } catch (error) {
        console.error('Error updating banner:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating banner',
            error: error.message
        });
    }
};

// DELETE - Delete single banner
const deleteBanner = async (req, res) => {
    try {
        const { bannerId } = req.params;
        
        // Get current banners from Redis
        const cachedBanners = await redisClient.get('website:banners');
        
        if (!cachedBanners) {
            return res.status(404).json({
                success: false,
                message: 'No banners found'
            });
        }
        
        const bannersData = JSON.parse(cachedBanners);
        const bannerIndex = bannersData.banners.findIndex(b => b.id == bannerId);
        
        if (bannerIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        
        // Delete image file
        const imagePath = bannersData.banners[bannerIndex].imagePath;
        if (imagePath) {
            await deleteImageFiles([imagePath]);
        }
        
        // Remove banner from array
        bannersData.banners.splice(bannerIndex, 1);
        bannersData.totalBanners = bannersData.banners.length;
        bannersData.lastUpdated = new Date().toISOString();
        
        // Update Redis cache
        await redisClient.set('website:banners', JSON.stringify(bannersData));
        
        res.status(200).json({
            success: true,
            message: 'Banner deleted successfully',
            data: {
                totalBanners: bannersData.totalBanners,
                remainingBanners: bannersData.banners
            }
        });
        
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting banner',
            error: error.message
        });
    }
};

// DELETE - Delete all banners
const deleteAllBanners = async (req, res) => {
    try {
        // Clear all images in banners directory
        await clearDirectory('uploads/banners');
        
        // Remove from Redis cache
        await redisClient.del('website:banners');
        
        res.status(200).json({
            success: true,
            message: 'All banners deleted successfully'
        });
        
    } catch (error) {
        console.error('Error deleting all banners:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting all banners',
            error: error.message
        });
    }
};

// PUT - Update banner status (activate/deactivate)
const updateBannerStatus = async (req, res) => {
    try {
        const { bannerId } = req.params;
        const { isActive } = req.body;
        
        if (isActive === undefined) {
            return res.status(400).json({
                success: false,
                message: 'isActive field is required'
            });
        }
        
        // Get current banners from Redis
        const cachedBanners = await redisClient.get('website:banners');
        
        if (!cachedBanners) {
            return res.status(404).json({
                success: false,
                message: 'No banners found'
            });
        }
        
        const bannersData = JSON.parse(cachedBanners);
        const bannerIndex = bannersData.banners.findIndex(b => b.id == bannerId);
        
        if (bannerIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found'
            });
        }
        
        // Update status
        bannersData.banners[bannerIndex].isActive = isActive;
        bannersData.banners[bannerIndex].updatedAt = new Date().toISOString();
        bannersData.lastUpdated = new Date().toISOString();
        
        // Update Redis cache
        await redisClient.set('website:banners', JSON.stringify(bannersData));
        
        res.status(200).json({
            success: true,
            message: `Banner ${isActive ? 'activated' : 'deactivated'} successfully`,
            data: bannersData.banners[bannerIndex]
        });
        
    } catch (error) {
        console.error('Error updating banner status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating banner status',
            error: error.message
        });
    }
};

module.exports = {
    getBanners,
    getSingleBanner,
    createBanner: [upload.single('image'), createBanner],
    updateBanner: [upload.single('image'), updateBanner],
    deleteBanner,
    deleteAllBanners,
    updateBannerStatus
};