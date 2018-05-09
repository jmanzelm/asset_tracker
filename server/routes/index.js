const userRoutes = require("./users");
const bodyParser = require('body-parser');
const request = require('request');

const constructorMethod = app => {
  app.use(bodyParser.json());
  app.use("/", userRoutes);

  //GET methods

  //date range
  app.get("/prices/stock/:ticker/:range", (req, res)=>{

  });

  app.get("/prices/crypto/:symbol/:range", (req, res)=>{

  });

  //latest price only
  app.get("/prices/stock/:ticker", (req, res)=>{

  });

  app.get("/prices/crypto/:symbol", (req, res)=>{

  });

  app.get("/holdings/crypto/:user_id", (req, res)=>{

  });

  app.get("/holdings/stocks/:user_id", (req, res)=>{

  });

  app.get("/holdings/cash/:user_id", (req, res)=>{

  });

  app.get("/holdings/debt/:user_id", (req, res)=>{

  });

  //POST methods

  //new asset
  app.post("/holdings/crypto", (req, res)=>{

  });

  app.post("/holdings/stock", (req, res)=>{

  });  

  app.post("/holdings/cash", (req, res)=>{

  });

  app.post("/holdings/debt", (req, res)=>{

  });

  //PUT methods

  //update asset
  app.put("/holdings/crypto", (req, res)=>{

  });

  app.put("/holdings/stock", (req, res)=>{

  });

  

  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;