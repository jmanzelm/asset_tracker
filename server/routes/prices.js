const express = require("express");
const app = express.Router();
//GET methods

  //date range
  app.get("/stock/:ticker/:range", (req, res)=>{

  });

  app.get("/crypto/:symbol/:range", (req, res)=>{

  });

  //latest price only
  app.get("/stock/:ticker", (req, res)=>{

  });

  app.get("/crypto/:symbol", (req, res)=>{

  });

  module.exports = app;