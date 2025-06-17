const mongoose = require("mongoose");

const LogoSchema = mongoose.Schema({
  path: { type: String, default: "", required: true },
  alt: { type: String, default: "Website Logo" },
  publicId: { type: String, default: "" }, // Added publicId field
});

const HeroSectionSchema = mongoose.Schema({
  title: {
    en: { type: String, default: "Welcome to Our Website" },
    fr: { type: String, default: "Bienvenue sur notre site web" },
    ar: { type: String, default: "مرحبا بك في موقعنا الإلكتروني" },
  },
  subtitle: {
    en: { type: String, default: "Your success starts here" },
    fr: { type: String, default: "Votre succès commence ici" },
    ar: { type: String, default: "يبدأ إنجازك هنا" },
  },
  description: {
    en: { type: String, default: "Discover amazing features and services" },
    fr: {
      type: String,
      default: "Découvrez les fonctionnalités et services incroyables",
    },
    ar: { type: String, default: "اكتشف الميزات والخدمات المذهلة" },
  },
  buttonText: {
    en: { type: String, default: "Get Started" },
    fr: { type: String, default: "Commencer" },
    ar: { type: String, default: "ابدأ الآن" },
  },
  backgroundImage: {
    mobile: { type: String, required: true, default: "" },
    desktop: { type: String, required: true, default: "" },
  },
});

const BannerBarSchema = mongoose.Schema({
  enabled: { type: Boolean, default: true },
  text: {
    en: { type: String, default: "Special Offer: 50% Off Today Only!" },
    fr: {
      type: String,
      default: "Offre spéciale: 50% de réduction aujourd'hui seulement!",
    },
    ar: { type: String, default: "عرض خاص: 50% تخفيض اليوم فقط!" },
  },
});

const SocialMediaSchema = mongoose.Schema({
  facebook: { type: String, default: "" },
  instagram: { type: String, default: "" },
  tiktok: { type: String, default: "" },
  whatsapp: { type: String, default: "" },
  email:{ type: String, default: "" }
});

const WebsiteSettingsSchema = mongoose.Schema({
  // Logo settings
  logo: LogoSchema,
  // Hero section
  heroSection: [HeroSectionSchema],
  // Banner/Offers bar
  bannerBar: BannerBarSchema,
  // Social media links
  socialMedia: SocialMediaSchema,
  // Metadata
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: String, default: "admin" },
});

module.exports = mongoose.model("WebsiteSettings", WebsiteSettingsSchema);