const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    description: String,
    price: Number,
    location: String  // will switch to coordinates in the future
})

module.exports = new mongoose.model("Campground", campgroundSchema);