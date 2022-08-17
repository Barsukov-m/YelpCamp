const campgroundSchema = require('../schemas/campgroundSchema');
const reviewSchema = require('../schemas/reviewSchema');
const userSchema = require('../schemas/userSchema');
const Campground = require('../models/campground');
const Review = require('../models/review');
const AppError = require('./AppError');


// async error handling
// waiting for Express v5 to make this pain disappear ;(
const catchAsync = fn => {
	return (req, res, next) => {
		fn(req, res, next).catch(next);
	}
}

const calculateRating = async (id, camp={}) => {
	if (!Object.entries(camp).length)
		camp = await Campground.findById(id).populate('reviews');

	const rating = camp.reviews.map(review => review.rating).filter(rating => rating != 0);

	if (rating.length)
		camp.rating = Math.ceil( rating.reduce((prev, curr) => prev + curr) / rating.length );
	else
		camp.rating = 0;

	await camp.save();
}

const validateCampground = (req, res, next) => {
	const { body: data } = req;
	const { error } = campgroundSchema.validate(data);

	if (error)
		throw new AppError('Form Validation Error', 400, error.details[0].message);

	next();
}

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);

	if (error)
		throw new AppError('Form Validation Error', 400, error.details[0].message);

	next();
}

const validateUser = (req, res, next) => {
	const { body: data } = req;
	const { error } = userSchema.validate(data);

	if (error)
		throw new AppError('Form Validation Error', 400, error.details[0].message);

	next();
}

const requireLogin = (req, res, next) => {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
		req.flash('error', 'You should sign in first to do this action.');
		return res.redirect('/login');
	}

	next();
}

// since passport overwrites the session, we store
// the redirection URL under res.locals
const checkRedirect = (req, res, next) => {
	if (req.session.returnTo)
		res.locals.returnTo = req.session.returnTo;

	next();
}

const verifyCampAuthor = async (req, res, next) => {
	const { id } = req.params;
	const camp = await Campground.findById(id)

	// check if the current user is the campground author
	if (!camp.author.equals(req.user._id)) {
		req.flash('error', 'You do not have access to edit this page.');
		return res.redirect(`/campgrounds/${id}`);
	}

	next();
}

const verifyReviewAuthor = async (req, res, next) => {
	const { reviewID } = req.params;
	const review = await Review.findById(reviewID);

	// check if the current user is the campground author
	if (!review.author.equals(req.user._id)) {
		req.flash('error', 'You do not have access to edit this page.');
		return res.redirect(`/campgrounds/${id}`);
	}

	next();
}


module.exports = {
	catchAsync,
	calculateRating,
	validateCampground,
	validateReview,
	validateUser,
	requireLogin,
	checkRedirect,
	verifyCampAuthor,
	verifyReviewAuthor,
};
