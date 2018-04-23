const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const app = express();
const exphbs = require("express-handlebars");

const users = require("./data/users");

app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "views/layouts"));

app.engine("handlebars", exphbs({ }));
app.set("view engine", "handlebars");

const saltRounds = 16;

app.post("/login", (req, res) => {
  users.login(req, res);
});

app.get("/", (req, res) => {
  users.redirectAuth(req, res);
});

app.get("/logout", (req, res) => {
  users.logout(req, res);  
});

// We can now navigate to localhost:3000
app.listen(3000, function() {
  console.log(
    "Your server is now listening on port 3000!"
  );
  if (process && process.send) process.send({done: true}); // ADD THIS LINE
});
