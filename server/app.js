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
	console.log("user id: "+sherlock._id);
	let cashCollectionSize = await cash.getAllCash().then(function(allCash){
		return allCash.length;
	});
	let may7 = new Date(2018, 5, 7)/1000;
	let may8 = new Date(2018, 5, 8)/1000;
	let may9 = new Date(2018, 5, 9)/1000;
	let may10 = new Date(2018, 5, 10)/1000;
	let may11 = new Date(2028, 5, 11)/1000;

	if (cashCollectionSize==0){

		let depositSeries = [
			{amount:100, date: may7, type:"deposit"},
			{amount: 25, date: may8, type:"withdrawal"},
			{amount: 35000, date: may9, type:"deposit"},
			{amount: 2000, date: may10, type: "withdrawal"},
			{amount: 250000, date: may11, type: "deposit"}
		]
		const sherlockCash = await cash.addTransactionSeries(sherlock._id, depositSeries);
	}

	let debtCollectionSize = await debts.getAllDebts().then(function(allDebts){
		return allDebts.length;
	});
	if (debtCollectionSize==0){
		let creditSeries = [
			{
				creditor: "Capital One",
				transactions: [
					{
						type: "add",
						qty: 4000,
						date: may9
					}
				]
			},
			{
				creditor: "Navient",
				transactions: [
					{
						type: "add",
						qty: 8000,
						date: 1407485811
					},
					{
						type: "add",
						qty: 8000,
						date: 1439021811
					},
					{
						type: "add",
						qty: 8000,
						date: 1470644211
					},
					{
						type: "add",
						qty: 8000,
						date: 1502180211
					}
				]
			}
		];

		const sherlockDebts = await debts.addTransactionSeries(sherlock._id, creditSeries);
	}

	console.log("investments", await investments.getAllInvestments());
	console.log("cash", await cash.getAllCash());
	console.log("debts", await debts.getAllDebts());
	console.log("debtsbyid", sherlock._id, await debts.getDebtByUserId(sherlock._id))


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
