const mongoCollections = require("./mongoCollections");
const users = require("../data/users");
const cash = require("../data/cash");
const investments = require("../data/investments");
const debts = require("../data/debts");

async function populateDb(user){
	let cashCollectionSize = await cash.getAllCash().then(function(allCash){
		return allCash.length;
	});
	let may7 = Math.round(new Date(2018, 4, 6)/1000);
	let may8 = Math.round(new Date(2018, 4, 9)/1000);
	let may9 = Math.round(new Date(2018, 4, 10)/1000);
	let may10 = Math.round(new Date(2018, 4, 11)/1000);
	let may11 = Math.round(new Date(2018, 4, 12)/1000);

	if (cashCollectionSize==0){
		console.log("no cash in db, setting cash...");
		let depositSeries = [ 
			{amount: 100000, date: may7, type:"deposit"},
			{amount: 4500, date: may8, type:"withdraw"},
			{amount: 35000, date: may9, type:"deposit"},
			{amount: 2000, date: may10, type: "withdraw"},
			{amount: 250000, date: may11, type: "deposit"}
		]
		const userCash = await cash.addTransactionSeries(user._id, depositSeries);

		console.log("Added deposit series");
	}

	let debtCollectionSize = await debts.getAllDebts().then(function(allDebts){
		return allDebts.length;
	});
	if (debtCollectionSize==0){

		console.log("Seeing debt...");
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
		console.log("debt transaction series done")
	}

	let investmentCollectionSize = await investments.getAllInvestments().then(function(allInvestments){
		return allInvestments.length;
	});
	if (investmentCollectionSize==0){
		console.log("Seeding investments...");
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
		console.log("Investment seed done");
	}
}
module.exports = {populateDb};

