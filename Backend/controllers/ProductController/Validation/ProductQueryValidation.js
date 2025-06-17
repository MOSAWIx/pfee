const Joi = require('joi');

const ProductSchemaQuery = Joi.object({
    isActive: Joi.boolean().optional(), // Changed from default(true) to optional()
    page: Joi.number().default(1),
    limit: Joi.number().default(10).min(1).max(50).integer(),
    search: Joi.string().trim().optional(),
    category: Joi.string().optional(),
    sizeType: Joi.string().valid('clothing', 'shoes').optional(),
    size: Joi.string().optional(),
    color: Joi.string().optional(),
    minPrice: Joi.number().optional().min(0),
    maxPrice: Joi.number().optional().min(Joi.ref('minPrice')),
});

module.exports = ProductSchemaQuery;
