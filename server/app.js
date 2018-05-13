const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bcrypt = require("bcrypt");
const app = express();
const exphbs = require("express-handlebars");
const configRoutes = require("./routes");

const mongoCollections = require("./config/mongoCollections");
const users = require("./data/users");
const cash = require("./data/cash");
const investments = require("./data/investments");
const debts = require("./data/debts");
const seed = require('./config/seed');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(__dirname + "views/layouts"));

app.engine("handlebars", exphbs({ }));
app.set("view engine", "handlebars");

app.use(cors()); // Needed for cross origin resource sharing

const saltRounds = 16;

configRoutes(app);

const main = async function() {

	let usersList = await users.getAllUsers();
	let sherlock;
	if (usersList.length==0){
		sherlock = await users.addUser("masterdetective123", "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", 50);
	}
	else{
		sherlock = await users.getUserByName("masterdetective123");
	}

	await seed.populateDb(sherlock);

	console.log("user id:",sherlock._id);
	
	// console.log("investments", await investments.getAllInvestments());
	// console.log("cash", await cash.getAllCash());
	// console.log("debts", await debts.getAllDebts());
	// console.log("debtsbyid", sherlock._id, await debts.getDebtByUserId(sherlock._id));

	// console.log(await investments.getAllInvestments());
	// console.log(await cash.getAllCash());
	// console.log(await debts.getAllDebts());
	/*console.log((await investments.getInvestmentById(benapple._id)).transactions);
	console.log(await investments.getStockByUserId(ben._id));
	console.log(await investments.getCryptoByUserId(ben._id));*/
	// We can now navigate to localhost:3000
	app.listen(3001, function() {
	  console.log(
	    "Your server is now listening on port 3001!"
	  );
	  if (process && process.send) process.send({done: true}); // ADD THIS LINE
	});
}

main().catch(error => {
  console.log(error);
});