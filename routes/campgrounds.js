const Campground = require('../models/campground');
const catchAsync = require('../utils/catchAsync');
const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthor, validateCampground } = require('../utils/middleware');
const campgroundController = require('../controllers/campgrounds');

router.route('/')
    .get(catchAsync(campgroundController.renderAllCampgrounds))
    .post(isAuthenticated, validateCampground, catchAsync(campgroundController.createNewCampground));

router.get("/new", isAuthenticated, campgroundController.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgroundController.renderCampgroundId))
    .put(isAuthenticated, isAuthor, validateCampground, catchAsync(campgroundController.editCampground))
    .delete(isAuthenticated, isAuthor, catchAsync(campgroundController.deleteCampground));

router.get("/:id/edit", isAuthenticated, isAuthor, catchAsync(campgroundController.renderEditForm));

module.exports = router;