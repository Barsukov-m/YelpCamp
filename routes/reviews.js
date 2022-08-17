const express = require('express');
const reviews = require('../controllers/reviews');     // reviews controller
const router = express.Router({ mergeParams: true });  // Express router
const {
	catchAsync,
	validateReview,
	requireLogin,
	verifyReviewAuthor,
} = require('../utils/utilities');                     // Utility functions


router.post('/', requireLogin, validateReview, catchAsync(reviews.createNew));

router.route('/:reviewID')
	.patch(requireLogin, verifyReviewAuthor, validateReview, catchAsync(reviews.updateOne))
	.delete(requireLogin, verifyReviewAuthor, catchAsync(reviews.deleteOne))


module.exports = router;
