const Joi = require("joi");

// Reusable i18n schema
const requiredI18nString = Joi.object({
  en: Joi.string().required(),
  fr: Joi.string().required(),
  ar: Joi.string().required(),
});

const optionalI18nString = Joi.object({
  en: Joi.string().optional().allow(""),
  fr: Joi.string().optional().allow(""),
  ar: Joi.string().optional().allow(""),
});

const logoSchema = Joi.object({
  url: Joi.string().uri().required(),
  alt: Joi.string().required(),
});

const heroSectionSchema = Joi.array().items(
  Joi.object({
    title: optionalI18nString,
    subtitle: optionalI18nString,
    description: optionalI18nString,
    backgroundImage: Joi.object({
      mobile: Joi.string().uri().required(),
      desktop: Joi.string().uri().required(),
    }).required(),
  })
);

const bannerBarSchema = Joi.object({
  enabled: Joi.boolean().required(),
  text: requiredI18nString,
});

const socialMediaSchema = Joi.object({
  facebook: Joi.string().allow("").uri(),
  twitter: Joi.string().allow("").uri(),
  instagram: Joi.string().allow("").uri(),
  linkedin: Joi.string().allow("").uri(),
  youtube: Joi.string().allow("").uri(),
  tiktok: Joi.string().allow("").uri(),
});

const websiteSettingsValidation = Joi.object({
  logo: logoSchema.required(),
  heroSection: heroSectionSchema.required(),
  bannerBar: bannerBarSchema.required(),
  socialMedia: socialMediaSchema.required(),
  updatedAt: Joi.date().optional(),
  updatedBy: Joi.string().optional(),
});

module.exports = websiteSettingsValidation;
