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
    /20180129
    /dynamic
    */
  app.get("/stock/:ticker/:range", (req, res)=>{
    let symbol = req.params.ticker;
    let range = req.params.range;
    if (range.length>3){
      range = "date/"+range;
    }
    let endpoint = stockData+"/stock/"+symbol+"/chart/"+range;
    request({json:true, url:endpoint}, function(err, response, body){
      if (range.length>3){
        res.json(body[body.length]);
      }
      else{
        res.json(body);
      }
    });
  });

  app.post("/stock/:range", (req, res)=>{
    let range = req.params.range;
    let postData = req.body.symbols;

    let tickers=[];
    postData.forEach(element => {
      tickers.push(element.symbol.toUpperCase());
    });

    let requests = [];
    for (let i = 0; i<tickers.length; i++){
      let symbol = tickers[i];
      let endpoint = stockData+"/stock/"+symbol+"/chart/"+range;
      requests.push(new Promise(function(resolve, reject){
        request({json:true, url:endpoint}, function(err, response, body){
          if (err){
            reject(err);
          }
          else{
            let ret = {};
            ret["symbol"] = symbol;
            ret["prices"] = body;
            resolve( ret); 
          }
        });
      }));
    };
    return Promise.all(requests).then(function(data){
      res.json(data);
    });
  });

  /*date range formats:
    /histoday
    /histohour
    /histominute
    /pricehistorical
    /davAvg
    /exchange (Get total volume from the daily historical exchange data.The values are based on 00:00 GMT time. We store the data in BTC and we multiply by the BTC-tsym value)
    */
  app.get("/crypto/:ticker/:range", (req, res)=>{
    let symbol = req.params.ticker;
    symbol = symbol.toUpperCase();
    let range = req.params.range;
    let endpoint;
    if (range.length==10){//unix timestamp recieved
      endpoint = cryptoData+"/data/pricehistorical?fsym="+symbol+"&tsyms=USD&ts="+range;
    }
    else{
      endpoint = cryptoData+"/data/"+range+"?fsyms="+symbol+"&tsym=USD&limit=10";
    }
    request({json:true, url:endpoint}, function(err, response, body){
      if (body.Data){

        res.json(body.Data);
      }
      else{
        let symbol = Object.keys(body)[0];
        res.json(body[symbol]);
      }
    });
  });

  app.post("/crypto/:range", (req, res)=>{
    let range = req.params.range;
    let postData = req.body.symbols;

    let symbols=[];
    postData.forEach(element => {
      symbols.push(element.symbol.toUpperCase());
    });

    let requests = [];
    for (let i = 0; i<symbols.length; i++){
      let symbol = symbols[i];
      let endpoint = cryptoData+"/data/"+range+"?fsym="+symbol+"&tsym=USD&limit=10";
      requests.push(new Promise(function(resolve, reject){
        request({json:true, url:endpoint}, function(err, response, body){
          if (err){
            reject(err);
          }
          else{
            let ret = {};
            ret["symbol"] = symbol;
            ret["prices"] = body.Data;
            resolve( ret); 
          }
        });
      }));
    };
    return Promise.all(requests).then(function(data){
      
      res.json(data);
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