const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Campground = require('./models/campground');
const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => { console.log("MONGO CONNECTED") })
.catch((err) => { console.log(err)} );

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

app.get("/campgrounds", async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { title: 'Campgrounds', campgrounds });
})

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new", {title: 'New Campground'})
})

app.post("/campgrounds", async(req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

app.get("/campgrounds/:id", async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { title: campground.title, campground });
})

app.get("/campgrounds/:id/edit", async(req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { title: 'Edit Campground', campground });
})

app.put("/campgrounds/:id", async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground}, {useFindAndModify: false});
    res.redirect(`/campgrounds/${campground._id}`); // use ._id instead of .id to ensure update
})

app.delete("/campgrounds/:id", async(req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id, {useFindAndModify: false});
    res.redirect(`/campgrounds`);
})