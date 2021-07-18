const Campground = require('../models/campground.js');
const Review = require('../models/review.js');


module.exports.postReview = async (req, res) => {
    const {id} = req.params;
    const singleCamp = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    singleCamp.reviews.push(review);
    review.campground.push(singleCamp)
    await review.save();
    await singleCamp.save();
    req.flash("success", "Added a Review")
    res.redirect(`/campgrounds/${singleCamp._id}`);
};


module.exports.deleteReview = async (req, res) => {
    const {id, reviewId} = req.params;
    const singleCamp = await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    const comment = await Review.findByIdAndDelete(reviewId)
    req.flash("error", "A Review Deleted!")
    res.redirect(`/campgrounds/${id}`)
};

