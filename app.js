var LocalStrategy = require("passport-local"),
  sanitizer       = require("express-sanitizer"),
  method          = require("method-override"),
  flash           = require("connect-flash"),
  parser          = require("body-parser"),
  mongoose        = require("mongoose"),
  passport        = require("passport"),
  express         = require("express"),
  User            = require("./models/user"),
  Blog            = require("./models/blog"),
  indexRoutes     = require("./routes/index"),
  blogRoutes      = require("./routes/blog"),
  app             = express();

mongoose.connect("mongodb+srv://rbbjr1992:kc6km922@testcluster-rpv9l.mongodb.net/test?retryWrites=true", {
    useCreateIndex: true,
    useNewUrlParser: true
  }
);

app.use(parser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(method("_method"));
app.use(sanitizer());
app.use(flash());

app.use(require("express-session")({
    secret: "There be secrets here!",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.user = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(indexRoutes);
app.use(blogRoutes);
  
app.listen("3000", function() {
   console.log("Server On.");
});