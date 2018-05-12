/**
 *  @file routes/login.js
 *  @author: Taylor He
 *
 *  Handles user login functions and data
 */
const bcrypt = require("bcrypt");
const path = require("path");
const users = require('../data/users');

const saltRounds = 16;

// Users is a map of username: {userdetails}
// const users = {
//   "masterdetective123": {
//     hashedPassword: "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", // elementarymydearwatson
//     firstName: "Sherlock",
//     lastName: "Holmes",
//     profession: "Detective",
//     _id: "bd207af6-7c73-4ba8-a8bc-e4fb20df5d08"
//   },

//   "lemon": {
//     hashedPassword: "$2a$16$SsR2TGPD24nfBpyRlBzINeGU61AH0Yo/CbgfOlU1ajpjnPuiQaiDm", // damnyoujackdonaghy
//     firstName: "Elizabeth",
//     lastName: "Lemon",
//     profession: "Writer",
//   },

//   "theboywholived": {
//     hashedPassword: "$2a$16$4o0WWtrq.ZefEmEbijNCGukCezqWTqz1VWlPm/xnaLM8d3WlS5pnK", // quidditch
//     firstName: "Harry",
//     lastName: "Potter",
//     profession: "Student",
//   }
// };

/**
 *  Compares plaintext input with stored hashed password
 *
 *  @param  {Object}  username
 *  @param  {Object}  password
 *  @return {Object}  user document in database, or null if not found
 */
async function bcryptCompare(username, password) {
  console.log("Logging in...");
  let userDetails = await users.getUserByName(username);
  if(await bcrypt.compare(password, userDetails.hashedPassword)) {
    return userDetails;
  }
  
  return null;
}
/**
 *  Tries to login with the username and password provided
 *  If authentication is successful, it sets an auth cookie
 *  else re-renders the login page
 *
 *  @param {Object} request
 *  @param {Object} response
 */
async function login(request, response) {
  try {
    console.log("I got a login request")
    // Try to log in
    const {username, password} = request.body;
    // console.log(username, password);
    const user = await bcryptCompare(username, password);
    console.log(`Login was ${user ? "" : "un"}successful`);
    // If login was successful, set a cookie to the value of username
    if (user) {
      console.log("Setting AuthCookie...")
      response.cookie("AuthCookie", user);

      response.status(200).json(user);
      return;
    }
    response.status(200).json({});
    // Render handlebars file with parameter failedAttempt=true
    //response.render(path.join(__dirname + '/../views/layouts/login.handlebars'), { failedAttempt:true });
  } catch (e) {
    response.status(500).json({error: e});
  }
}

/**
 *  Mainly a redirect function when a user tries to access /
 *  Checks if a user is logged in, redirects to login page
 *  or home page as needed
 *
 *  @param {Object} request
 *  @param {Object} response
 */
async function redirectAuth(request, response) {
  try {
    // Check cookies for login info
    // and render handlebars file with parameter failedAttempt=false
    if (!(request.cookies && request.cookies.AuthCookie)) {
      response.render(
        path.join(__dirname + '/../views/layouts/login.handlebars'),
        { failedAttempt: false }
      );
      return;
    }
    // Else they are logged in, so render the home page
    response.render(path.join(__dirname + '/../views/layouts/index.handlebars'), {});
  } catch (e) {
    response.status(500).json({error: e});
  }
}

/**
 *  User logout function. Clears Auth cookie, if there is one.
 *
 *  @param {Object} request
 *  @param {Object} response
 */
async function logout(req, res) {
  try {
    console.log("Attempting to log out...")
    let success = false;
    if(req && req.cookies && req.cookies.AuthCookie) {
      res.clearCookie("AuthCookie");
      success = true;
    }
    res.status(200).render(
      path.join(__dirname + "/../views/layouts/logout.handlebars"),
      {success: success}
    );
  } catch (e) {
    res.json({message:e})
  }
}

module.exports = {
  login: login,
  logout: logout,
  redirectAuth: redirectAuth
};
