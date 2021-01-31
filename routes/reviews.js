const express = require('express');
const catchAsync = require('../utils/catchAsync');
const router = express.Router({ mergeParams: true });
const { isAuthenticated, validateReview, isReviewAuthor } = require('../utils/middleware');
const reviewController = require('../controllers/reviews');


router.post('/', isAuthenticated, validateReview, catchAsync(reviewController.createReview));

router.delete("/:reviewId", isAuthenticated, isReviewAuthor, catchAsync(reviewController.deleteReview));

module.exports = router;