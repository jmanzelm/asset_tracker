const express = require("express");
const app = express.Router();
const cashData = require("../data/cash");
const debtData = require("../data/debts");
const investmentsData = require("../data/investments");

// GET methods

app.get("/crypto/:user_id", async (req, res)=>{
  try {
    let c = await investmentsData.getCryptoByUserId(req.params.user_id);
    res.json(c)
  } catch (e) {
    res.status(500).json(e)
  } 
});

app.get("/stock/:user_id", async (req, res)=>{
  try {
    let c = await investmentsData.getStockByUserId(req.params.user_id);
    res.json(c)
  } catch (e) {
    res.status(500).json(e)
  } 
});

app.get("/cash/:user_id", async (req, res)=>{
  try {
    let c = await cashData.getCashByUserId(req.params.user_id);
    res.json(c);
  } catch (e) {
    res.status(500).json(e)
  } 
});

app.get("/debt/:user_id", async (req, res)=>{
  try{
    let debt = await debtData.getDebtByUserId(req.params.user_id)
    res.json(debt);
  } catch (e) {
    res.status(500).json(e);
  }
});

app.get("/debt/total/:user_id", async (req, res)=>{
  try{
    let debt = await debtData.getDebtByUserId(req.params.user_id);
    let total = 0;
    debt.forEach(element => {
      total+=element.currentAmount;
    });
    let ret = {totalDebt:total};
    res.json(ret);
  } catch (e) {
    res.status(500).json(e);
  }
});

  //POST methods

  //new asset
  app.post("/investment/:user_id", async (req, res)=>{
    try{

      let userId = req.params.user_id;
      let symbol = req.body.symbol.toUpperCase();
      let startingAmount = req.body.startingAmount;
      let type = req.body.type; //stock or crypto
      let date = (req.body.date) ? req.body.date : Math.floor(new Date()/1000);

      let inv = await investmentsData.addInvestment(userId, req.body);
      res.json(inv);
    } catch(e){
      res.status(500).json(e);
    }
  });

  app.post("/cash/deposit/:user_id/", async (req, res)=>{
    // console.log("234");
    let amount = req.body.amount;
    let date = (req.body.date) ? req.body.date : (new Date()/1000);
    console.log(req.body);
    let attrs = {
      amount : amount,
      type: "deposit",
      date: date
    }
    try {
      let userCashObj = await cashData.getCashByUserId(req.params.user_id);

      let cashHoldings = await cashData.addCashTransaction(userCashObj._id, attrs);
      res.json(cashHoldings);
    } catch (e) {
      res.status(500).json(e);
    }
    
  });

  app.post("/cash/withdraw/:user_id", async (req, res)=>{
    try {
      let amount = req.body.amount;
      let date = (req.body.date) ? req.body.date : Math.floor(new Date()/1000);
      let attrs = {
        amount : amount,
        type: "withdraw",
        date : date
      };
      let userCashObj = await cashData.getCashByUserId(req.params.user_id);

      let cashHoldings = await cashData.addCashTransaction(userCashObj._id, attrs);
      res.json(cashHoldings);
    } catch (e) {
      res.status(500).json(e)
    }

  });

  app.post("/debt/:user_id", (req, res)=>{
    try {
      // console.log("234");
      let amount = req.body.amount;
      let creditor = req.body.creditor;
      let startingAmount = req.body.startingAmount;
      let date = (req.body.date) ? req.body.date : Math.round(new Date()/1000);

      let attrs = {
        creditor: creditor,
        startingAmount: startingAmount,
        date: date
      };

      console.log(req.body);
   
      let debts = debtData.addDebt(req.params.user_id, attrs);
      res.json(cashHoldings);
    } catch (e) {
      res.status(500).json(e);
    }
  });



  //PUT methods

  //update asset
  app.put("/investment", (req, res)=>{
    try {
      let id = req.body.id;      
      let quantity = req.body.quantity;
      let type = req.body.type; //add or subtract
      let date = (req.body.date) ? req.body.date : Math.round(new Date()/1000);

      let attrs = {
        type: type,
        quantity: quantity,
        date: date
      }

      let ret = investmentsData.addInvestmentTransaction(id, attrs);
      
      res.json(ret);
    }catch(e){
        res.status(500).json(e);
      }
  });

  app.put("/debt", (req, res)=>{
    let id = req.body.id;
    let quantity = req.body.amount;
    let type = req.body.type; //add or subtract
    let date = (req.body.date) ? req.body.date : Math.round(new Date()/1000);

    let attrs = {
      type: type,
      qty: quantity,
      date: date
    };

    let ret = debtData.addDebtTransaction(id)
  });
  module.exports = app;