const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };


const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual("thumbnail").get(function() {
    return this.url.replace("/upload", "/upload/w_350");
});


const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    createdAt: { type: Date, default: Date.now },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
}, opts);

CampgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<strong><a href=/campgrounds/${this._id}>${this.title}</a></strong>
    <p>${this.description.substring(0,30)}...</p><sub>${this.location}</sub>`
});

CampgroundSchema.post("findOneAndDelete", async function(doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
