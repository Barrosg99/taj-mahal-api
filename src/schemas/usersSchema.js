const joi = require('joi');

module.exports = {
  signUp: joi.object({
    name: joi.string().required(),
    nickname: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    passwordConfirmation: joi.string().valid(joi.ref('password')).required(),
    ra: joi.number().required(),
    phone: joi.string().required(),
  }),
  signIn: joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }),
};
