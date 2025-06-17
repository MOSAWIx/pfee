const express = require("express");
const router = express.Router();
const AuthMiddleware = require("../middleware/AuthMiddelware");
const LogoController = require("../controllers/SettingsController/LogoController");
const HeroSliderController = require("../controllers/SettingsController/HeroSliderController");
const socialMediaController = require("../controllers/SettingsController/SocialMediaController");
const SettingsController = require("../controllers/SettingsController/SettingsController");

router.get('/facebookPixel', SettingsController.getSettings);
router.post('/facebookPixel',AuthMiddleware(true), SettingsController.updateSettings);

router.get("/logo", LogoController.getLogo);
router.post("/logo", AuthMiddleware(true), LogoController.updateLogo);

router.get("/hero/version", HeroSliderController.getCacheVersion);
router.get("/hero/sliders", HeroSliderController.getAllSliders);

// POST /api/hero/sliders - Create/Replace all sliders
router.post("/hero/sliders", HeroSliderController.createSliders);

// DELETE /api/hero/sliders/:id - Delete specific slider
router.delete("/hero/sliders/:id", HeroSliderController.deleteSlider);

// GET /api/hero/version - Get cache version for frontend

// Social media routes
router.get("/social-media", socialMediaController.getSocialMedia);
router.post(
  "/social-media",
  AuthMiddleware(true),
  socialMediaController.updateSocialMedia
);

module.exports = router;
