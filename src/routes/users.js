/**
 *  @file routes/users.js
 *  @author: Taylor He
 *
 *  Handles user login functions and data
 */
const express = require("express");
const app = express();

const path = require("path");
const userCollection = require("../config/mongoCollections").users;
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");             // Password hashing
const session = require("express-session");   // Session handling
const passport = require("passport");         // Authenticating

app.use(bodyParser.json());                   // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));

// Session secret
const sess = {
  secret: "taco bell sushi",
}

// ORDER MATTERS HERE
// Have to app.use session(), then initialize, then session
app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser((user, done) => {
  return done(null, user);
});

// Strategy of how to log in
const LocalStrategy = require("passport-local").Strategy;
passport.use(new LocalStrategy (
  async function(username, password, done) {
    const User = await userCollection();
    User.findOne({ username: username }, async function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      // Compare password with bcrypt
      let m = await bcryptCompare(password, user.hashedPassword);
      if (!m) { return done(null, false); }
      return done(null, user);
    });
  }
));

// populates the mongodb with sherlock
async function dummyData() {
  const User = await userCollection();
  const sherlock = { 
    username: "masterdetective123",
    // password: "elementarymydearwatson",
    hashedPassword: "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", // elementarymydearwatson
    firstName: "Sherlock", 
    lastName: "Holmes",
    profession: "Detective",
  }
  await User.insertOne(sherlock);
}

// checks if the user is authenticated
const isLoggedIn = (req, res, next) => {
  // console.log(req.user);
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
}

// Posting to login
// passport.authenticate takes req.body.username and req.body.password
app.post("/login",
  passport.authenticate('local'), (req, res) => {
    res.redirect("/");
  }
);

// Login page, populate with dummy data first
// Logs out the current user, if there is one logged in
app.get("/login", async (req, res) => {
  await dummyData();
  res.render(path.join(__dirname + '/../views/layouts/login.handlebars'), {});
});


// Home Page, middleware function isLoggedIn
app.get("/", isLoggedIn, (req, res) => {
  res.render(path.join(__dirname + '/../views/layouts/index.handlebars'), {user: req.user.username});
});

// Logout and redirect home
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");  
});


const saltRounds = 16;

// Users is a map of username: {userdetails}
const users = {
  "masterdetective123": {  
    hashedPassword: "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", // elementarymydearwatson
    firstName: "Sherlock", 
    lastName: "Holmes",
    profession: "Detective",
  },

  "lemon": {  
    hashedPassword: "$2a$16$SsR2TGPD24nfBpyRlBzINeGU61AH0Yo/CbgfOlU1ajpjnPuiQaiDm", // damnyoujackdonaghy
    firstName: "Elizabeth", 
    lastName: "Lemon",
    profession: "Writer",
  }, 

  "theboywholived": {
    hashedPassword: "$2a$16$4o0WWtrq.ZefEmEbijNCGukCezqWTqz1VWlPm/xnaLM8d3WlS5pnK", // quidditch
    firstName: "Harry",
    lastName: "Potter",
    profession: "Student",
  }
};

/**
 *  Compares plaintext input with stored hashed password
 *
 *  @param  {Object}  password plaintext
 *  @param  {Object}  hashedPassword
 *  @return {boolean} if password and hashedPassword match
 */
async function bcryptCompare(password, hashedPassword) {
  console.log("Logging in...");
  // console.log("Comparing", password, "to", hashedPassword);
  let success = await bcrypt.compare(password, hashedPassword);
  console.log(success ? "Login success" : "Failed to log in");
  return success;
}

module.exports = app;