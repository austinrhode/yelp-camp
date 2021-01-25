const express = require('express');
const app = express();
const port = 3000;
const path = require('path');
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require('ejs-mate');
const campgroundRouter = require('./routes/campgrounds');
const reviewRouter = require('./routes/reviews')
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => { console.log("MONGO CONNECTED") })
.catch((err) => { console.log(err)} );

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log("LISTENING ON PORT", port);
})

app.get("/", (req, res) => {
    res.render("home");
})

app.use('/campgrounds', campgroundRouter);
app.use('/campgrounds/:id/reviews', reviewRouter);

app.all('*', (req, res, next) => {
    next(new ExpressError("Page not found", 404));
})

app.use((err, req, res, next) => {
    const { status = 500, message = "Something went wrong" } = err; 
    res.status(status).render('error', { title: "Error", err });
})