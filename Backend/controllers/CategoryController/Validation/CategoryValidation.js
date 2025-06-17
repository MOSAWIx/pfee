const Joi = require('joi');
const mongoose = require('mongoose');

const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.object({
            en: Joi.string().required(),
            fr: Joi.string().required(),
            ar: Joi.string().required()
        }).required(),
        description: Joi.object({
            en: Joi.string().optional().allow(''),
            fr: Joi.string().optional().allow(''),
            ar: Joi.string().optional().allow('')
        }).optional(),
        parent: Joi.string()
            .optional()
            .custom((value, helpers) => {
                // Check if parent is a valid ObjectId
                if (!mongoose.isValidObjectId(value)) {
                    return helpers.message('Invalid parent category ID');
                }
                return value;
            }),
        active: Joi.boolean().optional()
    });

    return schema.validate(data);
};

module.exports = validateCategory;