const User = require("../models/user.js");
const passport = require("passport");


module.exports.renderRegister = (req, res) => {
    res.render("users/register.ejs")
};


module.exports.signRegister = async(req, res) => {
    try {
    const {username, password, email} = req.body;
    const newUser = new User({username, email});
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        req.flash("success", "You are now Registered! Welcome to Yelp Camp")
        res.redirect("/campgrounds");
    });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/register")
    }
};


module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs")
};

module.exports.loginFlash = (req, res) => {
    req.flash("success", "Welcome Back!")
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl)
};

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { 
            return next(err); 
        }
    });
    req.flash("success", "Logged Out");
    res.redirect("/campgrounds");
}