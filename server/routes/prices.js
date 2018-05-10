const request = require("request");
const express = require("express");
const app = express.Router();
const stockData = "https://api.iextrading.com/1.0";
const cryptoData = "https://min-api.cryptocompare.com";
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

  /*date range formats:
    /histoday
    /histohour
    /histominute
    /prehistorical
    /davAvg
    /exchange (Get total volume from the daily historical exchange data.The values are based on 00:00 GMT time. We store the data in BTC and we multiply by the BTC-tsym value)
    */
  app.get("/crypto/:ticker/:range", (req, res)=>{
    let ts = Math.round((new Date()).getTime() / 1000);
    let symbol = req.params.ticker;
    symbol = symbol.toUpperCase();
    let range = req.params.range;
    let endpoint = cryptoData+"/data/"+range+"?fsym="+symbol+"&tsym=USD&limit=10";
    request({json:true, url:endpoint}, function(err, response, body){
      res.json(body.Data);
    });
  });

  //latest price only
  app.get("/stock/:ticker", (req, res)=>{
    let ts = Math.round((new Date()).getTime() / 1000);
    let symbol = req.params.ticker;
    symbol = symbol.toUpperCase();
    let endpoint = stockData+"/stock/"+symbol+"/chart";
    request({json:true, url:endpoint}, function(err, response, body){
      if (err){
        throw err;
      }
      res.json(body[0]);
    });
  });

  app.get("/crypto/:symbol", (req, res)=>{
    let ts = Math.round((new Date()).getTime() / 1000);
    let symbol = req.params.symbol;
    symbol = symbol.toUpperCase();
    let endpoint = cryptoData+"/data/price?fsym="+symbol+"&tsyms=USD";
    request({json:true, url:endpoint}, function(err, response, body){
      if (err){
        throw err;
      }
      res.json({price:body.USD});
    });
  });

  module.exports = app;