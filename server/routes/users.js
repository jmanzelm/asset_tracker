const express = require("express");
const app = express.Router();
const userData = require("../data/users");

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.post("/login", (req, res) => {
    try{
      userData.login(req, res).then(function(userInfo){
          res.json(userInfo);
      });
    }catch(e){
        res.status(500).json(e);
    }
});

app.get("/logout", (req, res)=>{
    try{
        userData.logout(req, res).then(function(loggedOut){
          res.json(loggedOut);
        });

        
    }catch(e){
        res.status(200).json(e);
    }
});

module.exports = app;
