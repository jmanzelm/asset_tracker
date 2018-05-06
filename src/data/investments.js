const mongoCollections = require("../config/mongoCollections");
const investments = mongoCollections.investments;
const uuidv4 = require("uuid/v4");
const users = require("./users");

function getAllInvestments() {
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

function getInvestmentById(id) {
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

// is a stock if "type" is true, crypto if false 
function addInvestment(userId, symbol, type, startingAmount) {
	if (arguments.length !== 4) {
		throw "Please provide a user ID, symbol, type, and starting amount.";
	}
	if (typeof userId !== "string" || typeof symbol !== "string" || typeof type !== "boolean" || typeof startingAmount !== "number"){
		"The user ID and symbol must be strings, type must be a boolean, and starting amount must be a number."
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

function deleteInvestment(id, userId) {
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

// type is true if purchase, false if sale
function addInvestmentTransaction(id, userId, quantity, type) {
	if (arguments.length !== 4) {
		throw "Please provide an investment ID, user ID, quantity, and type.";
	}
	if (typeof id !== "string" || typeof userId !== "string" || typeof quantity !== "number" || typeof type !== "boolean"){
		throw "The investment ID and user ID must be strings, quantity must be a number, and type must be a boolean.";
	}
	try {
		return investments().then(investmentCollection => {
			investment = this.getInvestmentById(id);
			if (!type && investment.currentAmount <= quantity) {
				this.deleteInvestment(id, userId);
				return {};
			}
			newTransaction = {
				type: type,
				qty: quantity,
				date: Math.round((new Date()).getTime() / 1000)
			};
			let updatedInvestment = {
				transactions: (this.getInvestmentById(id)).transactions.push(newTransaction),
				currentAmount: (type ? investment.currentAmount + quantity : investment.currentAmount - quantity)
			}
			return investmentCollection
				.updateOne({_id: id}, {$set: updatedInvestment})
				.then(result => {
					return this.getInvestmentById(id);
				});
		});
	}
	catch(error) {
		throw error;
	}
}

module.exports = {
	getAllInvestments,
	getInvestmentById,
	addInvestment,
	deleteInvestment,
	addInvestmentTransaction
}