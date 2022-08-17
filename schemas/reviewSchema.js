const BaseJoi = require('joi');
const extension = require('./escapeHTML');
const Joi = BaseJoi.extend(extension);


const reviewSchema = Joi.object({
	title: Joi.string()
		.min(2)
		.max(100)
		.required()
		.escapeHTML(),
	body: Joi.string()
		.min(3)
		.max(1000)
		.required()
		.escapeHTML(),
	rating: Joi.number()
		.min(0)
		.max(5)
});


module.exports = reviewSchema;
