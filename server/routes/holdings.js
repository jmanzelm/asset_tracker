const express = require("express");
const app = express.Router();
const cashData = require("../data/cash");
const debtData = require("../data/debts");
const investmentsData = require("../data/investments");

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
    res.json(c)
  } catch (e) {
    res.status(500).json(e)
  } 
});

app.get("/debt/:user_id", async (req, res)=>{
  try{
  	let debt = await debtData.getDebtsByUserId(req.params.user_id)
  	res.json(debt);
  } catch (e) {
    res.status(500).json(e);
  }
});

  //POST methods

  //new asset
  app.post("/new/crypto/:user_id", async (req, res)=>{
    try{

      let symbol = req.body.symbol;
      let type = req.body.type;
      let startingAmount = req.body.startingAmount;
    	let inv = investmentsData.addInvestment(user_id, symbol, 0, startingAmount)
    	res.json(inv);
    } catch(e){
      res.status(500).json(e);
    }
  });

  app.post("/update/crypto/:user_id", async (req, res)=>{
    try {
      let id = req.body.id;
      let userId = req.params.user_id;
      let quantity = req.body.quantity;
      let type = req.body.type;
      let ret = investmentsData.addInvestmentTransaction(id, userId, quantity, 0)
        res.json(ret);
      }catch(e){
        res.status(500).json(e);
      }
  });

  app.post("/stock/:user_id", (req, res)=>{

  });

  app.post("/cash/deposit/:user_id/", async (req, res)=>{
    // console.log("234");
    let amount = req.body.amount;
    console.log(req.body);
    try {
      let cashHoldings = await cashData.addCashTransaction(req.params.user_id, req.body.amount, "deposit")
      res.json(cashHoldings);
    } catch (e) {
      res.status(500).json(e);
    }
    
  });

  app.post("/cash/withdraw/:user_id", async (req, res)=>{
    try {
      let amount = req.body.amount;
      let cashHoldings = await cashData.addCashWithdrawal(amount, req.params.user_id)
      res.json(cashHoldings);
    } catch (e) {
      res.status(500).json(e)
    }

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
