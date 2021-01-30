const mongoose = require('mongoose');
const { Schema } = mongoose;


reviewSchema = new Schema({
    body: {
        type: String,
        required: true,
    },
    rating: {
        type: String,
        required: true,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model("Review", reviewSchema);