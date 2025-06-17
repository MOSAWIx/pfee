const Settings = require('../../models/SettingsModel')




// Get settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.status(200).json({
            message: 'Settings retrieved successfully',
            data: settings || {
                facebookPixelId: null,
                active: true
            }
        });
    } catch (err) {
        const error=new Error();
        error.status=400;
        error.message=err.details[0].message;
        next(error);
    }
}

// update or add Pixel facebook
exports.updateSettings = async (req, res) => {
    const { facebookPixelId, active } = req.body;
    try {
        const settings = await Settings.findOne();
        if (settings) {
            settings.facebookPixelId = facebookPixelId || null; // Set to null if not provided
            settings.active = active !== undefined ? active : true; // Set to true if not provided
            await settings.save();
            res.status(200).json({
                message: 'Settings updated successfully',
                data: settings
            });
            
        }else{
            const newSettings = new Settings({
                facebookPixelId,
                active: active !== undefined ? active : true // Set to true if not provided
            });
            await newSettings.save();
            res.status(200).json({
                message: 'Settings added successfully',
                data: newSettings
            });
        }

    }catch (err) {
        const error=new Error();
        error.status=400;
        error.message=err.details[0].message;
        next(error);
    }
}