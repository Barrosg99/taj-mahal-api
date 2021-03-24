const Joi = require('joi');

module.exports = {
  create: Joi.array().items(Joi.object({
    finality: Joi.string().required(),
    place: Joi.string().required(),
    purchase: Joi.string().required(),
    price: Joi.number().min(1),
  })),
};
