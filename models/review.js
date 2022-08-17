const mongoose = require('mongoose');
const { Schema } = mongoose;


const reviewSchema = new Schema({
	title: {
		type: String,
		min: [2, 'Title must be at least 2 characters long.'],
		max: [100, 'Title must not exceed 100 characters.'],
		required: true
	},
	body: {
		type: String,
		min: [3, 'Your review is too short.'],
		max: [1000, 'Your review must not exceed 1000 characters.'],
		required: true
	},
	rating: {
		type: Number,
		min: [0, 'Rating must be a positive number.'],
		max: [5, 'Rating must be in range 0-5.'],
		default: 0
	},
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	campground: {
		type: Schema.Types.ObjectId,
		ref: 'Campground'
	}
});

const Review = mongoose.model('Review', reviewSchema);


module.exports = Review;
