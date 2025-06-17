const Joi = require("joi");

const orderSchema = Joi.object({
  color: Joi.object({
    index: Joi.number().required(),
    hex: Joi.string().required(),
    name: Joi.string().required(),
  }).required(),
  customer: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    city: Joi.string().required(),
    note: Joi.string().allow("").optional(),
  }).required(),
  product: Joi.object({
    id: Joi.string().required(),
    price: Joi.number().required(),
    title: Joi.string().required(),
  }).required(),
  quantity: Joi.number().required(),
  googleSheetId: Joi.string().allow("").optional(),
  taille: Joi.string().allow("").optional(),
  size: Joi.string().allow("").optional(),
  status: Joi.string().optional(),
});

module.exports = orderSchema;
