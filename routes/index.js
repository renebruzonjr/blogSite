var express = require("express"),
  passport  = require("passport"),
  User      = require("../models/user"),
  Blog      = require("../models/blog"),
  router    = express.Router();

router.get("/", function(req, res) {
  Blog.find({}, function(err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

router.get("/archived", isLoggedIn, function(req, res) {
  Blog.find(
    { author: { id: req.user._id, username: req.user.username } },
    function(err, blogs) {
      if (err) {
        console.log(err);
      } else {
        res.render("archived", { blogs: blogs });
      }
    }
  );
});

router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username,
    email: req.body.email
  });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash("error", err.message);
      return res.redirect("/register");
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success", "Yay! You are registered.");
      res.redirect("/");
    });
  });
});

router.get("/login", function(req, res) {
  res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  }),
  function(req, res) {}
);

router.get("/logout", function(req, res) {
  req.logOut();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in to do that!");
  res.redirect("/login");
}

module.exports = router;