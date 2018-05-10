const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const app = express();
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(__dirname + "views/layouts"));

app.engine("handlebars", exphbs({ }));
app.set("view engine", "handlebars");

const saltRounds = 16;

configRoutes(app);

// We can now navigate to localhost:3000
app.listen(3001, function() {
  console.log(
    "Your server is now listening on port 3001!"
  );
  if (process && process.send) process.send({done: true}); // ADD THIS LINE
});