const express          = require("express"),
	  app              = express(),
      bodyParser       = require("body-parser"),
	  mongoose 	       = require('mongoose'),
	  flash	           = require("connect-flash"),
	  passport         = require("passport"),
	  localStrategy    = require("passport-local"),
	  methodOverride   = require("method-override"),
	  Campground       = require("./models/campground"),
      seedDB	       = require("./seeds.js"),
	  Comment          = require("./models/comment"),
	  User             = require("./models/user");

let   commentRoutes    = require("./routes/comments"),
	  campgroundRoutes = require("./routes/campgrounds"),
	  indexRoutes	   = require("./routes/index")

mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.use(require("express-session")({
	secret: "Havarti is a stinker",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT || 3000, function(){
	console.log("The YelpCamp Server has Started!")
});