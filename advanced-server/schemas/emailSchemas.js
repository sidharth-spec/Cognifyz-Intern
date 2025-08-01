const Joi = require("@hapi/joi");

const emailSchema = Joi.object({
  to: Joi.string().email().required(),
  subject: Joi.string().min(3).max(100).required(),
  body: Joi.string().min(10).required(),
});

module.exports = emailSchema;
