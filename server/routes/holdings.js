const express = require("express");
const app = express.Router();
const cashData = require("../data/cash");
const debtData = require("../data/debts");
const investmentsData = require("../data/investments");

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
    try{

    	debtData.getDebtsByUserId(req.params.user_id).then(function(debt){

    	 res.json(debt);
      });

    }catch(e){
      res.status(500).json(e);
    }
  });

  //POST methods

  //new asset
  app.post("/new/crypto/:user_id", (req, res)=>{
    try{

      let symbol = req.body.symbol;
      let type = req.body.type;
      let startingAmount = req.body.startingAmount;
    	investmentsData.addInvestment(user_id, symbol, 0, startingAmount).then(function(res){

    	 res.json(res);
      });

    }catch(e){
      res.status(500).json(e);
    }
  });

  app.post("/update/crypto/:user_id", (req, res)=>{
    try{
      let id = req.body.id;
      let userId = req.params.user_id;
      let quantity = req.body.quantity;
      let type = req.body.type;
      investmentsData.addInvestmentTransaction(id, userId, quantity, 0).then(function(ret){
        res.json(ret);
      });

    }catch(e){
      res.status(500).json(e);
    }
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
