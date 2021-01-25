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
const session = require('express-session')
const flash = require('connect-flash');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => { console.log("MONGO CONNECTED") })
.catch((err) => { console.log(err)} );

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.engine('ejs', ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
const sessionConfig = {
    secret: "thiswillchangebeforedeployment",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24 * 7),
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.listen(port, () => {
    console.log("LISTENING ON PORT", port);
})

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
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