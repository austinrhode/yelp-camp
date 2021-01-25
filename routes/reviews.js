const express = require('express');
const { reviewSchema}  = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const Review = require('../models/review');
const router = express.Router({ mergeParams: true })

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if( error ){
        const message = error.details.map(el => el.message).join(",");
        next(new ExpressError(message, 400));
    }else{
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`)
}))

router.delete("/:reviewId", catchAsync(async(req, res, next) =>{
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {review: reviewId}}, {useFindAndModify: false});
    await Review.findByIdAndDelete(reviewId, {useFindAndModify: false});
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;