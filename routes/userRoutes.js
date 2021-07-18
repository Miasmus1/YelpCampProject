const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const catchAsyncError = require("../utils/catchAsyncError.js");
const passport = require("passport")
const userCont = require("../controllers/users.js")


router.route("/register")
    .get(userCont.renderRegister)
    .post(catchAsyncError(userCont.signRegister));

router.route("/login")
    .get(userCont.renderLogin)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), userCont.loginFlash);

router.get("/logout", userCont.logout);


module.exports = router;