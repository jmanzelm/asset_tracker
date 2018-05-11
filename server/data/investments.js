const mongoCollections = require("../config/mongoCollections");
const investments = mongoCollections.investments;
const uuidv4 = require("uuid/v4");
const axios = require("axios");

function ModuleA() {

}

module.exports = ModuleA;

const users = require("./users");

ModuleA.getAllInvestments = function() {
	if (arguments.length !== 0) {
		throw "No arguments are needed.";
	}
	try {
		return investments().then(investmentCollection => {
			return investmentCollection.find({}).toArray();
		});
	}
	catch(error) {
		throw error;
	}
}

ModuleA.getInvestmentById = function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		return investments().then(investmentCollection => {
			return investmentCollection.findOne({_id: id}).then(investment => {
				if (!investment) throw "Investment not found";
				return investment;
			});
		});
	}
	catch(error) {
		throw error;
	}
}

// type is either "stock" or "crypto"
ModuleA.addInvestment = function(userId, symbol, type, startingAmount) {
	if (arguments.length !== 4) {
		throw "Please provide a user ID, symbol, type, and starting amount.";
	}
	if (typeof userId !== "string" || typeof symbol !== "string" || typeof type !== "string" || typeof startingAmount !== "number"){
		throw "The user ID, symbol, and type must be strings and starting amount must be a number.";
	}
	try{
		return investments().then(investmentCollection => {
			if (startingAmount <= 0) {
				return {};
			}
			let newInvestment = {
				_id: uuidv4(),
				symbol: symbol,
				transactions: [],
				type: type,
				startingAmount: startingAmount,
				currentAmount: startingAmount
			};
			return investmentCollection
				.insertOne(newInvestment)
				.then(insInfo => {
					users.extendInvestmentList(userId, insInfo.insertedId);
					return insInfo.insertedId;
				})
				.then(newId => {
					return this.getInvestmentById(newId);
				});
		});
	}
	catch(error) {
		throw error;
	}
}

ModuleA.deleteInvestment = function(id, userId) {
	if (arguments.length !== 2) {
		throw "Please provide an investment ID and a user ID.";
	}
	if (typeof id !== "string") {
		throw "Both IDs must be strings.";
	}
	try {
		return investments().then(investmentCollection => {
			return investmentCollection.removeOne({_id: id}).then(delInfo => {
				if (delInfo.deletedCount === 0) {
					throw `Could not remove investment with id of ${id}.`;
				} else {
					users.shortenInvestmentList(userId, id);
				}
			});
		});
	}
	catch(error) {
		throw error;
	}
}

// type is either "add" or "subtract"
ModuleA.addInvestmentTransaction = function(id, userId, quantity, type) {
	if (arguments.length !== 4) {
		throw "Please provide an investment ID, user ID, quantity, and type.";
	}
	if (typeof id !== "string" || typeof userId !== "string" || typeof quantity !== "number" || typeof type !== "string"){
		throw "The investment ID, type, and user ID must be strings and quantity must be a number.";
	}
	try {
		return investments().then(investmentCollection => {
			let investment = this.getInvestmentById(id);
			if (type === "subtract" && investment.currentAmount <= quantity) {
				this.deleteInvestment(id, userId);
				return {};
			}
			let newTransaction = {
				type: type,
				qty: quantity,
				date: Math.round((new Date()).getTime() / 1000),
				price: (investment.type === "stock" ? axios.get("http://localhost:3001/prices/stock/" + investment.symbol).data.close : axios.get("http://localhost:3001/prices/crypto/" + investment.symbol).data.close)
			};
			let updatedInvestment = {
				transactions: (this.getInvestmentById(id)).transactions.push(newTransaction),
				currentAmount: (type === "add" ? investment.currentAmount + quantity : investment.currentAmount - quantity)
			}
			return investmentCollection
				.updateOne({_id: id}, {$set: updatedInvestment}, {upsert:true})
				.then(result => {
					return this.getInvestmentById(id);
				});
		});
	}
	catch(error) {
		throw error;
	}
}