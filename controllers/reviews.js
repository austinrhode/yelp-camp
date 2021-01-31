const Review = require('../models/review');
const Campground = require('../models/campground');

module.exports.createReview = async(req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'New review created successfully');
    res.redirect(`/campgrounds/${id}`)
};

module.exports.deleteReview = async(req, res, next) =>{
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {review: reviewId}}, {useFindAndModify: false});
    await Review.findByIdAndDelete(reviewId, {useFindAndModify: false});
    req.flash('success', 'Review deleted successfully');
    res.redirect(`/campgrounds/${id}`);
};