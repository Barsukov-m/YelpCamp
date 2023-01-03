const mongoose = require('mongoose');
const { Schema } = mongoose;
const Review = require('./review');

// by default Mongoose does not include virtuals
// when you convert a document to JSON
const opts = {
	toJSON: {
		virtuals: true
	}
};


// campground schema
const campgroundSchema = new Schema({
	title: {
		type: String,
		min: [2, 'Title must be at least 2 characters long.'],
		max: [100, 'Title must not exceed 100 characters.'],
		required: true
	},
	location: {
		type: String,
		min: [2, 'City name must be at least 2 characters long.'],
		max: [100, 'City name must not exceed 100 characters.'],
		required: true
	},
	geometry: {
		type: {
			type: String,
			enum: ['Point'],
			required: true
		},
		coordinates: {
			type: [Number],
			required: true
		}
	},
	price: {
		type: Number,
		min: [0, 'Price must be a positive value.'],
		max: [100000, 'Price value must not exceed 100000 characters.'],
		required: true
	},
	images: [
		{
			_id: false,
			path: String,
			filename: String
		}
	],
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	description: {
		type: String,
		min: [3, 'Campground description must be at least 3 characters long.'],
		max: [1000, 'Campground description must not exceed 1000 characters.'],
		required: true
	},
	date: {
		type: Date,
		required: true
	},
	rating: {
		type: Number,
		default: 0
	},
	reviews: [{
		type: Schema.Types.ObjectId,
		ref: 'Review'
	}]
}, opts);

// brief campground information
campgroundSchema.virtual('properties.id').get(function () { return this._id });
campgroundSchema.virtual('properties.title').get(function () { return this.title });
campgroundSchema.virtual('properties.rating').get(function () { return this.rating });
campgroundSchema.virtual('properties.reviews').get(function () { return this.reviews.length });
campgroundSchema.virtual('properties.price').get(function () { return this.price });
campgroundSchema.virtual('properties.cover').get(function () { return this.images[0] });

// delete all the reviews after the campground has been deleted
// NOTE: findByIdAndDelete() triggers findOneAndDelete(),
//       so we write a middleware for the second one
campgroundSchema.post('findOneAndDelete', async function (camp) {
	if (camp.reviews.length) {
		const res = await Review.deleteMany({ _id: { $in: camp.reviews } })
		console.log(`${res.deletedCount} reviews were deleted.`);
	}
});

const Campground = mongoose.model('Campground', campgroundSchema);


module.exports = Campground;
