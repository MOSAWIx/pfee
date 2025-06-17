const Joi = require("joi");

const productValidationSchema = Joi.object({
    title: Joi.object({
        en: Joi.string().required(),
        fr: Joi.string().required(),
        ar: Joi.string().required()
    }).required(),
    description: Joi.object({
        en: Joi.string().allow(''),
        fr: Joi.string().allow(''),
        ar: Joi.string().allow('')
    }),
    basePrice: Joi.number().required().min(0),
    priceFor2: Joi.number().min(0).optional(),
    priceFor3: Joi.number().min(0).optional(),
    discount: Joi.number().min(0).max(100).default(0),
    googleSheetId: Joi.string().optional().allow(''),
    category: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(), // MongoDB ObjectId ref
    colors: Joi.array().items(
        Joi.object({
            name: Joi.object({
                en: Joi.string().required(),
                fr: Joi.string().required(),
                ar: Joi.string().required()
            }).required(),
            sizes: Joi.array().items(
                Joi.object({
                    value: Joi.string().required(),
                    stock: Joi.number().min(0).default(0)
                })
            ).optional(),
            tailles: Joi.array().items(
                Joi.object({
                    value: Joi.string().required(),
                    stock: Joi.number().min(0).default(0)
                })
            ).optional(),
            colorHex: Joi.string().pattern(/^#([0-9A-F]{3}){1,2}$/i).required(),
            images: Joi.array().optional()
        })
    ).min(1).required(),
    active: Joi.boolean().default(true)
});

module.exports = productValidationSchema;