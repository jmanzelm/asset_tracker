const express = require("express");
const app = express.Router();
const userData = require("../data/users");

app.post("/login", (req, res)=>{
    try{
        userData.login(req, res).then(function(userInfo));

        res.json(userInfo);
    }catch(e){
        res.status(500).json(e);
    }
});

app.get("/logout", (req, res)=>{
    try{
        userData.logout(req, res).then(function(loggedOut));

        res.json(loggedOut);
    }catch(e){
        res.status.(200).json(e);
    }
});
