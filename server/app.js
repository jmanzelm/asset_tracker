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

const populateDb = async function(user){
	let cashCollectionSize = await cash.getAllCash().then(function(allCash){
		return allCash.length;
	});
	let may7 = Math.round(new Date(2018, 4, 7)/1000);
	let may8 = Math.round(new Date(2018, 4, 8)/1000);
	let may9 = Math.round(new Date(2018, 4, 9)/1000);
	let may10 = Math.round(new Date(2018, 4, 10)/1000);
	let may11 = Math.round(new Date(2018, 4, 11)/1000);

	if (cashCollectionSize==0){


		let depositSeries = [ 
			{amount:100000, date: may7, type:"deposit"},
			{amount: 4500, date: may8, type:"withdrawal"},
			{amount: 35000, date: may9, type:"deposit"},
			{amount: 2000, date: may10, type: "withdrawal"},
			{amount: 250000, date: may11, type: "deposit"}
		]
		const sherlockCash = await cash.addTransactionSeries(user._id, depositSeries);
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
						date: may8
					},
					{
						type: "add",
						qty: 8000,
						date: may9
					},
					{
						type: "add",
						qty: 8000,
						date: may10
					},
					{
						type: "add",
						qty: 8000,
						date: may11
					}
				]
			}
		];
			
		const userDebts = await debts.addTransactionSeries(user._id, creditSeries);
	}

	let investmentCollectionSize = await investments.getAllInvestments().then(function(allInvestments){
		return allInvestments.length;
	});
	if (investmentCollectionSize==0){
		let investmentSeries = [
			{
				symbol: "AAPL",
				type: "stock",
				transactions: [
					{
						type: "add",
						qty: 30,
						date: may8
					},
					{
						type: "add",
						qty: 90,
						date: may9
					},
					{
						type: "subtract",
						qty: 15,
						date: may10
					},
					{
						type: "add",
						qty: 10,
						date: may11
					}
				]
			},
			{
				symbol: "GOOG",
				type: "stock",
				transactions: [
					{
						type: "add",
						qty: 13,
						date: may9
					},
					{
						type: "add",
						qty: 40,
						date: may10
					},
					{
						type: "add",
						qty: 25,
						date: may10
					},
					{
						type: "subtract",
						qty: 20,
						date: may11
					}
				]
			},
			{
				symbol: "TSLA",
				type: "stock",
				transactions: [
					{
						type: "add",
						qty: 80,
						date: may9
					},
					{
						type: "subtract",
						qty: 40,
						date: may10
					},
					{
						type: "subtract",
						qty: 10,
						date: may10
					},
					{
						type: "subtract",
						qty: 5,
						date: may11
					}
				]
			},
			{
				symbol: "BTC",
				type:"crypto",
				transactions: [
					{
						type: "add",
						qty: 5,
						date: may9
					},
					{
						type: "subtract",
						qty: 1,
						date: may10
					},
					{
						type: "subtract",
						qty: 1,
						date: may10
					},
					{
						type: "add",
						qty: 5,
						date: may11
					}
				]
			},
			{
				symbol: "ETH",
				type:"crypto",
				transactions: [
					{
						type: "add",
						qty: 23,
						date: may9
					},
					{
						type: "subtract",
						qty: 14,
						date: may10
					},
					{
						type: "subtract",
						qty: 3,
						date: may10
					},
					{
						type: "add",
						qty: 5,
						date: may11
					}
				]
			},
			{
				symbol: "XMR",
				type:"crypto",
				transactions: [
					{
						type: "add",
						qty: 40,
						date: may9
					},
					{
						type: "add",
						qty: 14,
						date: may10
					},
					{
						type: "add",
						qty: 35,
						date: may10
					},
					{
						type: "add",
						qty: 5,
						date: may11
					}
				]
			}
		];
		const userInvestments = await investments.addTransactionSeries(user._id, investmentSeries);
	}
	let stockSize = await investments.getAllInvestments();
	console.log(stockSize.length)
	if (stockSize.length === 0) {
		investments.addInvestment(sherlock._id, "AAPL", "stock", 10);
		investments.addInvestment(sherlock._id, "GOOG", "stock", 5);
		investments.addInvestment(sherlock._id, "TSLA", "stock", 15);

		investments.addInvestment(sherlock._id, "BTC", "crypto", 10);
		investments.addInvestment(sherlock._id, "LTC", "crypto", 11);
		investments.addInvestment(sherlock._id, "XMR", "crypto", 15);
	}
	
	
	// investments.addInvestment(userId, symbol, type, startingAmount)
	// console.log("investments by id", await investments.getInvestmentById(user._id))
	console.log("investments", await investments.getAllInvestments());
	console.log("cash", await cash.getAllCash());
	console.log("debts", await debts.getAllDebts());
	console.log("debtsbyid", sherlock._id, await debts.getDebtByUserId(sherlock._id))

}

const main = async function() {

	let usersList = await users.getAllUsers();
	let sherlock;
	if (usersList.length==0){
		sherlock = await users.addUser("masterdetective123", "$2a$16$7JKSiEmoP3GNDSalogqgPu0sUbwder7CAN/5wnvCWe6xCKAKwlTD.", 50);
	}
	else{
		sherlock = await users.getUserByName("masterdetective123");
	}

	await populateDb(sherlock);

	console.log("user id: "+sherlock._id);
	
	console.log("investments", await investments.getAllInvestments());
	console.log("cash", await cash.getAllCash());
	console.log("debts", await debts.getAllDebts());
	console.log("debtsbyid", sherlock._id, await debts.getDebtByUserId(sherlock._id));

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