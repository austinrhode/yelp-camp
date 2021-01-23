const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require("./review");

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    image:  {
        type: String,
        required: true
    },
    description:  {
        type: String,
        required: true
    },
    price:  {
        type: Number,
        required: true,
        min: 0,
    },
    location: {
        type: String,
        required: true
    }, // will switch to coordinates in the future
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
})

campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {$in: doc.reviews }
        });
    }
})

module.exports = new mongoose.model("Campground", campgroundSchema);