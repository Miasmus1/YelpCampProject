const express = require("express");
const router = express.Router({mergeParams: true});
const catchAsyncError = require('../utils/catchAsyncError.js');
const Campground = require('../models/campground.js');
const Review = require('../models/review.js');
const reviewCont = require("../controllers/reviews.js");
const {validateReview, isLoggedIn, isCommentAuthor} = require("../utils/middleware.js");


router.post("/", isLoggedIn, validateReview, catchAsyncError(reviewCont.postReview));

router.delete("/:reviewId", isLoggedIn, isCommentAuthor, catchAsyncError(reviewCont.deleteReview));


module.exports = router;