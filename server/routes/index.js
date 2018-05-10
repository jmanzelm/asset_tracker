const holdingsRoutes = require("./holdings");
const pricesRoutes = require("./prices");
const loginRoutes = require("./users");

const express = require("express");
const app = express();


const constructorMethod = (app) => 
{	
	app.use("/holdings", holdingsRoutes);
	app.use("/prices", pricesRoutes);
	app.use("/", loginRoutes);

	app.use("*", (req, res) => {
    	res.status(404).json({ error: "Not found" });
  	});

}

module.exports = constructorMethod;