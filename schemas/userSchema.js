const BaseJoi = require('joi');
const extension = require('./escapeHTML');
const Joi = BaseJoi.extend(extension);


const userSchema = Joi.object({
	name: Joi.string()
		.min(2)
		.max(100)
		.escapeHTML(),
	username: Joi.string()
		.min(2)
		.max(100)
		.required()
		.escapeHTML(),
	password: Joi.string()
		.min(2)
		.required(),
});


module.exports = userSchema;
