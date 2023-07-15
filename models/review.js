const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: { type: Date, default: Date.now },
    campground: [
        {
            type: Schema.Types.ObjectId,
            ref: "Campground"
        }
    ]
});

module.exports = mongoose.model("Review", reviewSchema);
