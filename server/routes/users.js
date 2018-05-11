const express = require("express");
const app = express.Router();
const userData = require("./login");


app.post("/login", (req, res) => {
  // don't use .then you are bad
  // async await
  userData.login(req, res).then(function(userInfo){
      res.json(userInfo);
  })
  .catch(e => {
    res.status(500).json(e);
  })
});

app.get("/logout", (req, res)=>{
  userData.logout(req, res)
  .then(function(loggedOut) {
    res.json(loggedOut);
  })
  .catch(e => {
    res.status(200).json(e);
  });
});


module.exports = app;
