const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { campgroundSchema }  = require('../schemas');
const express = require('express');
const router = express.Router();

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if( error ){
        const message = error.details.map(el => el.message).join(",");
        next(new ExpressError(message, 400));
    }else{
        next();
    }
}

router.get("/", catchAsync(async(req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { title: 'Campgrounds', campgrounds });
}))

router.get("/new", (req, res) => {
    res.render("campgrounds/new", {title: 'New Campground'})
})

router.post("/", validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/:id", catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render("campgrounds/show", { title: campground.title, campground });
}))

router.get("/:id/edit", catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { title: 'Edit Campground', campground });
}))

router.put("/:id", validateCampground, catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {useFindAndModify: false});
    res.redirect(`/campgrounds/${campground._id}`); // use ._id instead of .id to ensure update
}))

router.delete("/:id", catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, {useFindAndModify: false});
    res.redirect(`/campgrounds`);
}))

module.exports = router;