const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema }  = require('./schemas');
const Review = require('./models/review');
const Joi = require('joi');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => { console.log("MONGO CONNECTED") })
.catch((err) => { console.log(err)} );

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if( error ){
        const message = error.details.map(el => el.message).join(",");
        next(new ExpressError(message, 400));
    }else{
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if( error ){
        const message = error.details.map(el => el.message).join(",");
        next(new ExpressError(message, 400));
    }else{
        next();
    }
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}))
app.use(methodOverride('_method'))

app.listen(port, () => {
    console.log("LISTENING ON PORT", port);
})

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/campgrounds", catchAsync(async(req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { title: 'Campgrounds', campgrounds });
}))

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new", {title: 'New Campground'})
})

app.post("/campgrounds", validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get("/campgrounds/:id", catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render("campgrounds/show", { title: campground.title, campground });
}))

app.get("/campgrounds/:id/edit", catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { title: 'Edit Campground', campground });
}))

app.put("/campgrounds/:id", validateCampground, catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {useFindAndModify: false});
    res.redirect(`/campgrounds/${campground._id}`); // use ._id instead of .id to ensure update
}))

app.delete("/campgrounds/:id", catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, {useFindAndModify: false});
    res.redirect(`/campgrounds`);
}))

app.post('/campgrounds/:id/review', validateReview, catchAsync(async(req, res, next) =>{
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`)
}))

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async(req, res, next) =>{
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {$pull: {review: reviewId}}, {useFindAndModify: false});
    await Review.findByIdAndDelete(reviewId, {useFindAndModify: false});
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err; 
    res.status(status).render('error', { title: "Error", err });
})