const Campground = require('../models/campground');         // Campground model
const Review = require('../models/review');                 // Review model
const { calculateRating } = require('../utils/utilities');  // calculate camp rating


const createNew = async (req, res) => {
	const { id } = req.params;
	const { title, body, rating } = req.body;
	const review = new Review({ title, body, rating });
	review.author = res.locals.currentUser;

	const camp = await Campground.findById(id).populate('reviews');
	review.campground = camp;
	camp.reviews.push(review);

	calculateRating(id, camp);

	await review.save();

	req.flash('success', `Your review was added.`);
	res.redirect(`/campgrounds/${id}`);
}

const updateOne = async (req, res) => {
	const { id, reviewID } = req.params;
	const review = await Review.findByIdAndUpdate(reviewID, req.body);
	await review.save();

	calculateRating(id);

	res.redirect(`/campgrounds/${id}`);
}

const deleteOne = async (req, res) => {
	const { id, reviewID } = req.params;

	await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewID } });
	await Review.findByIdAndDelete(reviewID);

	calculateRating(id);

	req.flash('success', `Your review was deleted.`);
	res.redirect(`/campgrounds/${id}`);
}


module.exports = {
	createNew,
	updateOne,
	deleteOne,
}
