var express = require("express"),
  Blog      = require("../models/blog"),
  router    = express.Router();

router.get("/new", isLoggedIn, function(req, res) {
  res.render("new");
});

router.post("/", isLoggedIn, function(req, res) {
  var title = req.body.title,
    image = req.body.image,
    post = req.sanitize(req.body.post),
    author = {
      id: req.user._id,
      username: req.user.username
    },
    body = { title: title, image: image, post: post, author: author };
  Blog.create(body, function(err, newBlog) {
    if (err) {
      console.log(err);
      res.render("new");
    } else {
      req.flash("success", "Your new post is live!");
      res.redirect("/");
    }
  });
});

router.get("/:id", function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/");
    } else {
      res.render("show", { blog: foundBlog });
    }
  });
});

router.get("/:id/edit", checkOwner, function(req, res) {
  Blog.findById(req.params.id, function(err, foundBlog) {
    if (err) {
      res.redirect("/");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});

router.put("/:id", checkOwner, function(req, res) {
  req.body.post = req.sanitize(req.body.post);
  Blog.findByIdAndUpdate(req.params.id, req.body, function(err, editBlog) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      req.flash("success", "Your post has been updated.");
      res.redirect("/" + req.params.id);
    }
  });
});

router.delete("/:id", checkOwner, function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err);
      res.redirect("/");
    } else {
      req.flash("success", "Your post has been deleted.");
      res.redirect("/");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error", "You must be logged in to do that!");
  res.redirect("/login");
}

function checkOwner(req, res, next) {
  if (req.isAuthenticated()) {
    Blog.findById(req.params.id, function(err, foundBlog) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        if (foundBlog.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "You do not own this post!");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "You must be logged in to do that!");
    res.redirect("back");
  }
}

module.exports = router;