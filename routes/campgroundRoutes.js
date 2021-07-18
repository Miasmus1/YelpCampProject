const express = require("express");
const router = express.Router();
const campgroundsCont = require("../controllers/campgrounds.js");
const catchAsyncError = require('../utils/catchAsyncError.js');
const Campground = require('../models/campground.js');
const {isLoggedIn, validateCampground, isAuthor, isCommentAuthor} = require("../utils/middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(catchAsyncError(campgroundsCont.index))
    .post(isLoggedIn, upload.array("campgroundContent[images]"), validateCampground,catchAsyncError(campgroundsCont.createNewCamp));


router.get("/new", isLoggedIn, campgroundsCont.renderCampForm);

router.route("/:id")
    .get(catchAsyncError(campgroundsCont.showCamp))
    .patch(isLoggedIn, isAuthor, upload.array("campgroundContent[images]"), validateCampground, catchAsyncError(campgroundsCont.sendEditCamp))
    .delete(isLoggedIn, isAuthor, catchAsyncError(campgroundsCont.deleteCamp));


router.get("/:id/edit", isLoggedIn, isAuthor, catchAsyncError(campgroundsCont.renderEditForm));


module.exports = router;