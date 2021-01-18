const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    description: String,
    price: String, // this could be a number, but will leave a string for now
    location: String  // will switch to coordinates in the future
})

module.exports = new mongoose.model("Campground", campgroundSchema);