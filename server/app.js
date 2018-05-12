const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');
const bcrypt = require("bcrypt");
const app = express();
const exphbs = require("express-handlebars");
const mongoSeed = require("mongo-seed");
const path = require("path");
const configRoutes = require("./routes");

const mongoCollections = require("./config/mongoCollections");
const users = require("./data/users");
const cash = require("./data/cash");
const investments = require("./data/investments");
const debts = require("./data/debts");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // for parsing application/json
app.use(express.static(__dirname + "views/layouts"));

app.engine("handlebars", exphbs({ }));
app.set("view engine", "handlebars");

app.use(cors()); // Needed for cross origin resource sharing

const saltRounds = 16;

configRoutes(app);

const populateDB = (user_id) => {
	
  let cashSeed = path.resolve(__dirname + "./config/seed/cashSeed.json");
	let debtSeed = path.resolve(__dirname + "./config/seed/debtSeed.json");
	let investmentSeed = path.resolve(__dirname+ "./config/seed/investmentSeed.json");
	
	mongoSeed.load("localhost",27017, "cash", cashSeed, "file", function (err) {
		if (err){
			console.log(err);
		}
		else{
			cash.getAllCash().then(function(cashArray){
				let cashObj = cashArray[0];
				cash.update(cashObj._id, {"userId":user_id});
			});
		}
	});
	mongoSeed.load("localhost", 27017, "debts", debtSeed, "file", function(err){
		if (err){
			console.log(err);
		}
		else{
			debts.getAllDebts().then(function(debtsArray){
				let debtObj = debtsArray[0];
				debts.update(debtObj._id, {"userId": user_id});
			});
		}
	});
	mongoSeed.load("localhost", 27017, "investments", investmentSeed, "file", function(err){
		if (err){
			console.log(err);
		}
		else{
			investments.getAllInvestments().then(function(investmentsArray){
				let investmentObj = investmentsArray[0];
				debts.update(debtObj._id, {"userId": user_id});
			});
		}
	});
}

const main = async function() {
	const ben = await users.addUser("masterdetective123", "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", 50);
/* 	const benapple = await investments.addInvestment(ben._id, "AAPL", "stock", 5);
	const bencoin = await investments.addInvestment(ben._id, "BTC", "crypto", 5);
	const bendebt = await debts.addDebt(ben._id, "college", 150000)
 	await investments.addInvestmentTransaction(benapple._id, 2, "add");
*/

	let emptyCollections = 0;

	let investmentsCollection = await investments.getCollection();
	investmentsCollection.count(function (err, count) {
		if (!err && count === 0) {
			emptyCollections++;
		}
	});

	let cashCollection = await cash.getCollection();
	cashCollection.count(function (err, count) {
		if (!err && count === 0) {
			emptyCollections++;
		}
	});

	let debtCollection = await debts.getCollection();
	debtCollection.count(function (err, count) {
		if (!err && count === 0) {
			emptyCollections++;
		}
	});
	if (emptyCollections==3){
		populateDB(ben._id);
	}

	console.log(await investments.getAllInvestments());
	console.log(await cash.getAllCash());
	console.log(await debts.getAllDebts());

	console.log(await users.getAllUsers());
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