


const WebSiteSettingsModel = require("../../models/WebSiteSettingsModel");


const getSocialMedia = async (req, res) => {
    try {
        const websiteSettings = await WebSiteSettingsModel.findOne();
        if (websiteSettings && websiteSettings.socialMedia) {
        const socialMediaData = websiteSettings.socialMedia;
    
    
        return res.status(200).json({
            success: true,
            data: socialMediaData,
            source: "database",
        });
        }
    
        return res.status(200).json({
        success: true,
        data: {},
        message: "No social media settings found",
        });
    } catch (error) {
        console.error("Error fetching social media settings:", error);
        return res.status(500).json({
        success: false,
        message: "Internal server error",
        });
    }
    }


const updateSocialMedia = async (req, res) => {
    try {
        const { socialMedia } = req.body;
        console.log("Habib",socialMedia)

        if (!socialMedia || typeof socialMedia !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Invalid social media data",
            });
        }

        // Find or create the website settings document
        let websiteSettings = await WebSiteSettingsModel.findOne();
        if (!websiteSettings) {
            websiteSettings = new WebSiteSettingsModel();
        }

        // Update the social media links
        websiteSettings.socialMedia = socialMedia;

        // Save the updated settings
        await websiteSettings.save();

        return res.status(200).json({
            success: true,
            message: "Social media settings updated successfully",
            data: websiteSettings.socialMedia,
        });
    } catch (error) {
        console.error("Error updating social media settings:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}


module.exports = {
    getSocialMedia,
    updateSocialMedia,
};