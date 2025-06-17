const fs = require("fs").promises;
const path = require("path");
const multer = require("multer");
const WebsiteSettings = require("../../models/WebSiteSettingsModel");
const { redisClient } = require("../../config/RedisDb");
const { processHeroImage, deleteImageFiles } = require("../../utils/imageProcessor"); // Import your image processor

// Ensure uploads/sliders directory exists
const ensureSlidersDirExists = async () => {
  const slidersPath = path.join(process.cwd(), "uploads", "sliders");
  try {
    await fs.access(slidersPath);
    console.log("Sliders directory exists:", slidersPath);
  } catch (error) {
    await fs.mkdir(slidersPath, { recursive: true });
    console.log("Created uploads/sliders directory at:", slidersPath);
  }
  return slidersPath;
};

// Updated multer configuration to use memory storage for image processing
const storage = multer.memoryStorage(); // Use memory storage instead of disk storage

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log("File filter - fieldname:", file.fieldname, "mimetype:", file.mimetype);
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Helper function to delete files from sliders directory
const deleteFile = async (filePath) => {
  try {
    let fullPath;
    if (path.isAbsolute(filePath)) {
      fullPath = filePath;
    } else {
      const filename = filePath.includes("/") ? path.basename(filePath) : filePath;
      fullPath = path.join(process.cwd(), "uploads", "sliders", filename);
    }
    await fs.unlink(fullPath);
    console.log(`Successfully deleted file: ${fullPath}`);
  } catch (error) {
    console.error(`Error deleting file ${filePath}:`, error);
  }
};

// Helper function to delete all files in uploads/sliders folder for hero sections
const deleteOldHeroFiles = async (heroSections) => {
  try {
    const filePaths = [];
    for (const section of heroSections) {
      if (section.backgroundImage?.desktop) {
        filePaths.push(section.backgroundImage.desktop);
      }
      if (section.backgroundImage?.mobile) {
        filePaths.push(section.backgroundImage.mobile);
      }
      // Also delete thumbnails if they exist
      if (section.backgroundImage?.desktopThumbnail) {
        filePaths.push(section.backgroundImage.desktopThumbnail);
      }
      if (section.backgroundImage?.mobileThumbnail) {
        filePaths.push(section.backgroundImage.mobileThumbnail);
      }
    }
    
    if (filePaths.length > 0) {
      await deleteImageFiles(filePaths);
    }
  } catch (error) {
    console.error("Error deleting old hero files:", error);
  }
};

// Helper function to update Redis cache
const updateRedisCache = async (heroSections) => {
  try {
    const cacheData = {
      data: heroSections,
      timestamp: Date.now(),
      version: Date.now().toString(),
    };
    await redisClient.setEx("hero_sections", 3600, JSON.stringify(cacheData));
    console.log("Redis cache updated successfully");
  } catch (error) {
    console.error("Error updating Redis cache:", error);
  }
};

// Get all sliders
const getAllSliders = async (req, res) => {
  try {
    const cachedData = await redisClient.get("hero_sections");

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).json({
        success: true,
        data: parsedData.data,
        source: "redis",
        timestamp: parsedData.timestamp,
        version: parsedData.version,
      });
    }

    const websiteSettings = await WebsiteSettings.findOne();

    if (!websiteSettings || !websiteSettings.heroSection) {
      return res.status(404).json({
        success: false,
        message: "No hero sections found",
      });
    }

    const heroSections = websiteSettings.heroSection;
    await updateRedisCache(heroSections);

    res.status(200).json({
      success: true,
      data: heroSections,
      source: "database",
      timestamp: Date.now(),
      version: Date.now().toString(),
    });
  } catch (error) {
    console.error("Error fetching sliders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching sliders",
      error: error.message,
    });
  }
};

// Create/Replace all sliders with WebP processing
const createSliders = async (req, res) => {
  try {
    console.log("=== CREATE SLIDERS DEBUG INFO ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log("Number of files received:", req.files?.length || 0);
    
    // Log all received files with their fieldnames
    if (req.files && req.files.length > 0) {
      console.log("Files received:");
      req.files.forEach((file, index) => {
        console.log(`  File ${index}: fieldname="${file.fieldname}", filename="${file.originalname}", size=${file.size}`);
      });
    }

    await ensureSlidersDirExists();

    // Parse sliders data
    let slidersData;
    try {
      slidersData = typeof req.body.sliders === "string" 
        ? JSON.parse(req.body.sliders) 
        : req.body.sliders;
    } catch (parseError) {
      console.error("Error parsing sliders data:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid sliders data format",
      });
    }

    if (!slidersData || !Array.isArray(slidersData)) {
      return res.status(400).json({
        success: false,
        message: "Sliders data is required and must be an array",
      });
    }

    console.log("Number of sliders to process:", slidersData.length);

    // Get current website settings to manage existing files
    const currentSettings = await WebsiteSettings.findOne();

    // Create a map of uploaded files for easier lookup
    const fileMap = new Map();
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        console.log(`Mapping file: ${file.fieldname} -> ${file.originalname}`);
        fileMap.set(file.fieldname, file);
      });
    }

    console.log("File map contents:", Array.from(fileMap.keys()));

    // Process sliders data with WebP conversion
    const processedSliders = await Promise.all(slidersData.map(async (slider, index) => {
      console.log(`\n--- Processing slider ${index} ---`);
      console.log("Slider data:", JSON.stringify(slider, null, 2));

      // Try multiple field name patterns for better matching
      const possibleDesktopFieldNames = [
        `sliders[${index}][desktopImage]`,
        `desktopImage_${index}`,
        `desktop_${index}`,
        `slider_${index}_desktop`,
        `slider[${index}].desktopImage`,
        `sliders.${index}.desktopImage`,
        `desktop-${index}`,
        `slider-${index}-desktop`
      ];

      const possibleMobileFieldNames = [
        `sliders[${index}][mobileImage]`,
        `mobileImage_${index}`,
        `mobile_${index}`,
        `slider_${index}_mobile`,
        `slider[${index}].mobileImage`,
        `sliders.${index}.mobileImage`,
        `mobile-${index}`,
        `slider-${index}-mobile`
      ];

      // Find desktop image
      let desktopFile = null;
      for (const fieldName of possibleDesktopFieldNames) {
        if (fileMap.has(fieldName)) {
          desktopFile = fileMap.get(fieldName);
          console.log(`✅ Found desktop image: ${fieldName} -> ${desktopFile.originalname}`);
          break;
        }
      }

      // Find mobile image
      let mobileFile = null;
      for (const fieldName of possibleMobileFieldNames) {
        if (fileMap.has(fieldName)) {
          mobileFile = fileMap.get(fieldName);
          console.log(`✅ Found mobile image: ${fieldName} -> ${mobileFile.originalname}`);
          break;
        }
      }

      if (!desktopFile) {
        console.log(`❌ No desktop image found for slider ${index}. Tried:`, possibleDesktopFieldNames);
      }
      if (!mobileFile) {
        console.log(`❌ No mobile image found for slider ${index}. Tried:`, possibleMobileFieldNames);
      }

      // Process images to WebP format
      let desktopImageResult = null;
      let mobileImageResult = null;

      if (desktopFile) {
        try {
          console.log(`Processing desktop image for slider ${index}...`);
          desktopImageResult = await processHeroImage(desktopFile.buffer, `desktop-${index}-${desktopFile.originalname}`);
          console.log(`✅ Desktop image processed:`, desktopImageResult);
        } catch (error) {
          console.error(`Error processing desktop image for slider ${index}:`, error);
          throw new Error(`Failed to process desktop image for slider ${index + 1}`);
        }
      }

      if (mobileFile) {
        try {
          console.log(`Processing mobile image for slider ${index}...`);
          mobileImageResult = await processHeroImage(mobileFile.buffer, `mobile-${index}-${mobileFile.originalname}`);
          console.log(`✅ Mobile image processed:`, mobileImageResult);
        } catch (error) {
          console.error(`Error processing mobile image for slider ${index}:`, error);
          throw new Error(`Failed to process mobile image for slider ${index + 1}`);
        }
      }

      // Build the slider object
      const processedSlider = {
        title: {
          en: slider.title?.en || "",
          fr: slider.title?.fr || "",
          ar: slider.title?.ar || "",
        },
        subtitle: {
          en: slider.subtitle?.en || "",
          fr: slider.subtitle?.fr || "",
          ar: slider.subtitle?.ar || "",
        },
        description: {
          en: slider.description?.en || "",
          fr: slider.description?.fr || "",
          ar: slider.description?.ar || "",
        },
        buttonText: {
          en: slider.buttonText?.en || "",
          fr: slider.buttonText?.fr || "",
          ar: slider.buttonText?.ar || "",
        },
        backgroundImage: {
          desktop: desktopImageResult ? desktopImageResult.webpPath : "",
          desktopUrl: desktopImageResult ? desktopImageResult.webpUrl : "",
          desktopThumbnail: desktopImageResult ? desktopImageResult.thumbnailPath : "",
          desktopThumbnailUrl: desktopImageResult ? desktopImageResult.thumbnailUrl : "",
          mobile: mobileImageResult ? mobileImageResult.webpPath : "",
          mobileUrl: mobileImageResult ? mobileImageResult.webpUrl : "",
          mobileThumbnail: mobileImageResult ? mobileImageResult.thumbnailPath : "",
          mobileThumbnailUrl: mobileImageResult ? mobileImageResult.thumbnailUrl : "",
        },
      };

      // Handle existing sliders - preserve images if no new ones uploaded
      if (slider.id && currentSettings?.heroSection) {
        const existingSlider = currentSettings.heroSection.find(
          (s) => s._id?.toString() === slider.id
        );
        
        if (existingSlider) {
          // Keep existing desktop image if no new one uploaded
          if (!desktopImageResult && existingSlider.backgroundImage?.desktop) {
            processedSlider.backgroundImage.desktop = existingSlider.backgroundImage.desktop;
            processedSlider.backgroundImage.desktopUrl = existingSlider.backgroundImage.desktopUrl;
            processedSlider.backgroundImage.desktopThumbnail = existingSlider.backgroundImage.desktopThumbnail;
            processedSlider.backgroundImage.desktopThumbnailUrl = existingSlider.backgroundImage.desktopThumbnailUrl;
            console.log(`📁 Preserving existing desktop image: ${existingSlider.backgroundImage.desktop}`);
          }
          
          // Keep existing mobile image if no new one uploaded
          if (!mobileImageResult && existingSlider.backgroundImage?.mobile) {
            processedSlider.backgroundImage.mobile = existingSlider.backgroundImage.mobile;
            processedSlider.backgroundImage.mobileUrl = existingSlider.backgroundImage.mobileUrl;
            processedSlider.backgroundImage.mobileThumbnail = existingSlider.backgroundImage.mobileThumbnail;
            processedSlider.backgroundImage.mobileThumbnailUrl = existingSlider.backgroundImage.mobileThumbnailUrl;
            console.log(`📁 Preserving existing mobile image: ${existingSlider.backgroundImage.mobile}`);
          }
        }
      }

      console.log(`Processed slider ${index}:`, {
        desktop: processedSlider.backgroundImage.desktop,
        mobile: processedSlider.backgroundImage.mobile
      });

      return processedSlider;
    }));

    // Validation: Check that we have desktop images for all sliders
    const validationErrors = [];
    processedSliders.forEach((slider, index) => {
      if (!slider.backgroundImage.desktop) {
        validationErrors.push(`Slider ${index + 1}: Desktop image is required`);
      }
    });

    if (validationErrors.length > 0) {
      console.error("Validation errors:", validationErrors);
      return res.status(400).json({
        success: false,
        message: validationErrors.join(", "),
      });
    }

    // Delete old files ONLY if we're replacing all sliders
    if (currentSettings?.heroSection) {
      // Collect files that won't be preserved
      const filesToDelete = [];
      
      for (const oldSection of currentSettings.heroSection) {
        const isPreserved = processedSliders.some(newSlider => 
          newSlider.backgroundImage.desktop === oldSection.backgroundImage?.desktop ||
          newSlider.backgroundImage.mobile === oldSection.backgroundImage?.mobile
        );
        
        if (!isPreserved) {
          if (oldSection.backgroundImage?.desktop) {
            filesToDelete.push(oldSection.backgroundImage.desktop);
          }
          if (oldSection.backgroundImage?.mobile) {
            filesToDelete.push(oldSection.backgroundImage.mobile);
          }
          if (oldSection.backgroundImage?.desktopThumbnail) {
            filesToDelete.push(oldSection.backgroundImage.desktopThumbnail);
          }
          if (oldSection.backgroundImage?.mobileThumbnail) {
            filesToDelete.push(oldSection.backgroundImage.mobileThumbnail);
          }
        }
      }
      
      if (filesToDelete.length > 0) {
        await deleteImageFiles(filesToDelete);
      }
    }

    // Update database
    const updatedSettings = await WebsiteSettings.findOneAndUpdate(
      {},
      {
        heroSection: processedSliders,
        updatedAt: new Date(),
        updatedBy: req.user?.name || "admin",
      },
      {
        new: true,
        upsert: true,
      }
    );

    await updateRedisCache(updatedSettings.heroSection);

    console.log("✅ Sliders created successfully with WebP conversion");
    console.log("Final processed sliders:", JSON.stringify(processedSliders, null, 2));

    res.status(200).json({
      success: true,
      message: "Hero sliders updated successfully with WebP conversion",
      data: updatedSettings.heroSection,
      version: Date.now().toString(),
    });
  } catch (error) {
    console.error("Error creating sliders:", error);
    res.status(500).json({
      success: false,
      message: "Error creating sliders",
      error: error.message,
    });
  }
};

// Delete a specific slider
const deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Slider ID is required",
      });
    }

    const currentSettings = await WebsiteSettings.findOne();

    if (!currentSettings || !currentSettings.heroSection) {
      return res.status(404).json({
        success: false,
        message: "No hero sections found",
      });
    }

    const sliderIndex = currentSettings.heroSection.findIndex(
      (slider) => slider._id.toString() === id
    );

    if (sliderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Slider not found",
      });
    }

    const sliderToDelete = currentSettings.heroSection[sliderIndex];

    // Collect all files to delete
    const filesToDelete = [];
    if (sliderToDelete.backgroundImage?.desktop) {
      filesToDelete.push(sliderToDelete.backgroundImage.desktop);
    }
    if (sliderToDelete.backgroundImage?.mobile) {
      filesToDelete.push(sliderToDelete.backgroundImage.mobile);
    }
    if (sliderToDelete.backgroundImage?.desktopThumbnail) {
      filesToDelete.push(sliderToDelete.backgroundImage.desktopThumbnail);
    }
    if (sliderToDelete.backgroundImage?.mobileThumbnail) {
      filesToDelete.push(sliderToDelete.backgroundImage.mobileThumbnail);
    }

    // Delete associated files
    if (filesToDelete.length > 0) {
      await deleteImageFiles(filesToDelete);
    }

    // Remove slider from array
    currentSettings.heroSection.splice(sliderIndex, 1);

    const updatedSettings = await WebsiteSettings.findOneAndUpdate(
      {},
      {
        heroSection: currentSettings.heroSection,
        updatedAt: new Date(),
        updatedBy: req.user?.name || "admin",
      },
      { new: true }
    );

    await updateRedisCache(updatedSettings.heroSection);

    res.status(200).json({
      success: true,
      message: "Slider deleted successfully",
      data: updatedSettings.heroSection,
      version: Date.now().toString(),
    });
  } catch (error) {
    console.error("Error deleting slider:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting slider",
      error: error.message,
    });
  }
};

// Get cache version
const getCacheVersion = async (req, res) => {
  try {
    const cachedData = await redisClient.get("hero_sections");

    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      return res.status(200).json({
        success: true,
        version: parsedData.version,
        timestamp: parsedData.timestamp,
      });
    }

    res.status(200).json({
      success: true,
      version: Date.now().toString(),
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Error getting cache version:", error);
    res.status(500).json({
      success: false,
      message: "Error getting cache version",
      error: error.message,
    });
  }
};

module.exports = {
  getAllSliders,
  createSliders: [
    upload.any(), // Accept any files with any field names
    createSliders,
  ],
  deleteSlider,
  getCacheVersion,
};