const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthor, validateCampground } = require('../utils/middleware');


router.get("/", catchAsync(async(req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { title: 'Campgrounds', campgrounds });
}))

router.get("/new", isAuthenticated, (req, res) => {
    res.render("campgrounds/new", {title: 'New Campground'})
})

router.post("/", isAuthenticated, validateCampground, catchAsync(async(req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'New campground created successfully');
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.get("/:id", catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id).
    populate({
        path: 'reviews',
        populate: 'author'
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { title: campground.title, campground });
}))

router.get("/:id/edit", isAuthenticated, isAuthor, catchAsync(async(req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { title: 'Edit Campground', campground });
}))

router.put("/:id", isAuthenticated, isAuthor, validateCampground, catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {useFindAndModify: false});
    req.flash('success', 'Campground updated successfully');
    res.redirect(`/campgrounds/${campground._id}`); // use ._id instead of .id to ensure update
}))

router.delete("/:id", isAuthenticated, isAuthor, catchAsync(async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, {useFindAndModify: false});
    req.flash('success', 'Campground deleted successfully');
    res.redirect(`/campgrounds`);
}))

module.exports = router;