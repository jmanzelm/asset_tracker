const express = require("express");
const app = express.Router();
const cashData = require("../data/cash");

 app.get("/crypto/:user_id", (req, res)=>{

  });

  app.get("/stocks/:user_id", (req, res)=>{

  });

  app.get("/cash/:user_id", (req, res)=>{
    cashData.getCashHoldingsByUserId(req.params.user_id).then( function(holdings) {
     res.json(holdings);
    }).catch(e => {
      res.status(500).json(e);
    });
  }
);

  app.get("/debt/:user_id", (req, res)=>{

  });

  //POST methods

  //new asset
  app.post("/crypto/:user_id", (req, res)=>{

  });

  app.post("/stock/:user_id", (req, res)=>{

  });

  app.post("/cash/deposit/:user_id/", (req, res)=>{
    console.log("234");
    let amount = req.body.amount;
    let cashHoldings = cashData.addCashDeposit(amount, req.params.user_id).then(function(holdings){
        res.json(holdings);
    });
    /*console.log(cashHoldings);
    res.json(cashHoldings);
*/
  });

  app.post("/cash/withdraw/:user_id", (req, res)=>{
    let amount = req.body.amount;
    let cashHoldings = cashData.addCashWithdrawal(amount, req.params.user_id).then(function(holdings){
      res.json(holdings);

    });

  });

  app.post("/debt", (req, res)=>{

  });

  //PUT methods

  //update asset
  app.put("/crypto/:symbol", (req, res)=>{

  });

  app.put("/stock/:update", (req, res)=>{

  });

  module.exports = app;
