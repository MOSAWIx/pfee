const multer = require("multer");
const { redisClient } = require("../../config/RedisDb");
const WebsiteSettings = require("../../models/WebSiteSettingsModel"); // Add this import
const {
  processLogoImage,
  deleteImageFiles,
  clearDirectory,
} = require("../../Utils/imageProcessor");

// Multer configuration for logo uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// GET - Retrieve logo data
const getLogo = async (req, res) => {
  try {
    // First try to get from Redis cache
    const cachedLogo = await redisClient.get("website:logo");
    if (cachedLogo) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedLogo),
        source: "cache",
      });
    }

    // If not in cache, try to get from database
    const websiteSettings = await WebsiteSettings.findOne();
    if (websiteSettings && websiteSettings.logo && websiteSettings.logo.path) {
      const logoData = {
        path: websiteSettings.logo.path,
        altText: websiteSettings.logo.alt,
        publicId: websiteSettings.logo.publicId || null,
      };

      // Cache it in Redis for future requests
      await redisClient.set("website:logo", JSON.stringify(logoData));
      await redisClient.expire("website:logo", 86400);

      return res.status(200).json({
        success: true,
        data: logoData,
        source: "database",
      });
    }

    // If not in cache or database, return default/empty response
    const defaultLogo = {
      url: null,
      altText: "Website Logo",
      width: null,
      height: null,
      uploadedAt: null,
    };

    res.status(200).json({
      success: true,
      data: defaultLogo,
      source: "default",
    });
  } catch (error) {
    console.error("Error getting logo:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving logo",
      error: error.message,
    });
  }
};

// POST - Upload and update logo
const updateLogo = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No logo file uploaded",
      });
    }

    const { altText = "Website Logo" } = req.body;

    // Get current logo from Redis to delete old file
    const currentLogo = await redisClient.get("website:logo");
    let oldImagePath = null;
    if (currentLogo) {
      const logoData = JSON.parse(currentLogo);
      if (logoData.path) {
        oldImagePath = logoData.path;
      }
    }

    // Clear old logo directory to remove previous logo
    await clearDirectory("uploads/logo");

    // Process the new logo image
    const processedImage = await processLogoImage(
      req.file.buffer,
      req.file.originalname
    );

    // Create logo data object
    const logoData = {
      path: processedImage.webpPath,
      altText: altText,
      publicId: processedImage.public_id,
    };

    // Store in Redis cache
    await redisClient.set("website:logo", JSON.stringify(logoData));
    // Set expiration for cache (optional - 24 hours)
    await redisClient.expire("website:logo", 86400);

    // Store/Update in MongoDB database
    let websiteSettings = await WebsiteSettings.findOne();
    
    if (websiteSettings) {
      // Update existing document
      websiteSettings.logo = {
        path: processedImage.webpPath,
        alt: altText,
        publicId: processedImage.public_id,
      };
      websiteSettings.updatedAt = new Date();
      await websiteSettings.save();
    } else {
      // Create new document if none exists
      websiteSettings = new WebsiteSettings({
        logo: {
          path: processedImage.webpPath,
          alt: altText,
          publicId: processedImage.public_id,
        },
        updatedAt: new Date(),
      });
      await websiteSettings.save();
    }

    res.status(200).json({
      success: true,
      message: "Logo updated successfully",
      data: logoData,
    });
  } catch (error) {
    console.error("Error updating logo:", error);
    res.status(500).json({
      success: false,
      message: "Error updating logo",
      error: error.message,
    });
  }
};



module.exports = {
  getLogo,
  updateLogo: [upload.single("logo"), updateLogo],
};