const request = require("request");
const express = require("express");
const app = express.Router();
const stockData = "https://api.iextrading.com/1.0";
//GET methods

  /*date range formats:
    /chart
    /5y
    /2y
    /1y
    /ytd
    /6m
    /3m
    /1m
    /1d
    /date/20180129
    /dynamic
    */
  app.get("/stock/:ticker/:range", (req, res)=>{
    let symbol = req.params.ticker;
    let range = req.params.range;
    let endpoint = stockData+"/stock/"+symbol+"/chart/"+range;
    request({json:true, url:endpoint}, function(err, response, body){
      res.json(body);
    });

  });

  app.get("/crypto/:symbol/:range", (req, res)=>{

  });

  //latest price only
  app.get("/stock/:ticker", (req, res)=>{

  });

  app.get("/crypto/:symbol", (req, res)=>{

  });

  module.exports = app;