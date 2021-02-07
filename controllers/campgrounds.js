const Campground = require('../models/campground');
const mapBoxGeoCode = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxAccessToken = process.env.MAPBOX_TOKEN;
const geoCoder = mapBoxGeoCode({ accessToken: mapBoxAccessToken });

module.exports.renderAllCampgrounds = async (req, res, next) => {
    const campgrounds = await Campground.find({}).populate('popupText');
    res.render("campgrounds/index", { title: 'Campgrounds', campgrounds });
}


module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new", { title: 'New Campground' });
}

module.exports.createNewCampground = async (req, res, next) => {
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send();
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground)
    req.flash('success', 'New campground created successfully');
    res.redirect(`/campgrounds/${campground._id}`)
};

module.exports.renderCampgroundId = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).
        populate({
            path: 'reviews',
            populate: 'author'
        }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/show", { title: campground.title, campground });
}

module.exports.renderEditForm = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        res.redirect('/campgrounds');
    }
    res.render("campgrounds/edit", { title: 'Edit Campground', campground });
};

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }, { useFindAndModify: false });
    const images = req.files.map(file => ({ url: file.path, filename: file.filename }));
    campground.images.push(...images);
    await campground.save();
    req.flash('success', 'Campground updated successfully');
    res.redirect(`/campgrounds/${campground._id}`); // use ._id instead of .id to ensure update
};

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, { useFindAndModify: false });
    req.flash('success', 'Campground deleted successfully');
    res.redirect(`/campgrounds`);
};