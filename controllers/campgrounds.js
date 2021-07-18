const Campground = require('../models/campground.js');
const {cloudinary} = require("../cloudinary");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/campgrounds.ejs", {campgrounds, pageTitle: "Campgrounds"});
};


module.exports.renderCampForm = (req, res) => {
    res.render("campgrounds/new.ejs");
};

module.exports.createNewCamp = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campgroundContent.location,
        limit: 1
    }).send()
    const newCamp = new Campground(req.body.campgroundContent);
    newCamp.geometry = geoData.body.features[0].geometry
    newCamp.images = req.files.map(el => ({url: el.path, filename: el.filename}));
    newCamp.author = req.user._id;
    await newCamp.save();
    req.flash("success", "New Campground Created")
    res.redirect(`/campgrounds/${newCamp.id}`)
};

module.exports.showCamp = async (req, res) => {
    const {id} = req.params;
    const singleCamp = await Campground.findById(id).populate({
        path: "reviews", 
        populate: {
            path: "author"
        }
    }).populate("author");
    if(!singleCamp) {
        req.flash("error", "Cannot Find That Campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/singleCamp.ejs", {singleCamp, pageTitle: singleCamp.title});
};

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const singleCamp = await Campground.findById(id);
    if(!singleCamp) {
        req.flash("error", "Cannot Find That Campground")
        return res.redirect("/campgrounds")
    }
    res.render("campgrounds/editCamp.ejs", {singleCamp});
};

module.exports.sendEditCamp = async (req, res) => {
    const {id} = req.params;
    const editedCamp = req.body.campgroundContent
    const singleCamp = await Campground.findByIdAndUpdate(id, {...editedCamp});
    const imgs = req.files.map(el => ({url: el.path, filename: el.filename})); 
    singleCamp.images.push(...imgs);
    await singleCamp.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await singleCamp.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    }
    req.flash("success", "Campground Updated")
    res.redirect(`/campgrounds/${singleCamp.id}`)
};

module.exports.deleteCamp = async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("error", "Campground Deleted!")
    res.redirect("/campgrounds")
};