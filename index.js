const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => { console.log("MONGO CONNECTED") })
.catch((err) => { console.log(err)} );
const Campground = require('./models/campground');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
    console.log("LISTENING ON PORT", port);
})

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/testCreate", (req, res) => {
    const camp = new Campground({
        title: "Test Campground",
        description: "This is a test",
        price: 0,
        location: "TestLand"
    })
    camp.save();
    res.send(camp);
})