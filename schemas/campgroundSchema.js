const BaseJoi = require('joi');
const extension = require('./escapeHTML');
const Joi = BaseJoi.extend(extension);


const campgroundSchema = Joi.object({
	title: Joi.string()
		.min(2)
		.max(100)
		.required()
		.escapeHTML(),
	location: Joi.string()
		.min(2)
		.max(100)
		.required()
		.escapeHTML(),
	price: Joi.number()
		.min(0)
		.max(100000)
		.required(),
	images: Joi.array(),
	description: Joi.string()
		.min(3)
		.max(1000)
		.required()
		.escapeHTML(),
	date: Joi.string()
		.required(),
});


module.exports = campgroundSchema;
