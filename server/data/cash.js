const mongoCollections = require("../config/mongoCollections");
const cash = mongoCollections.cash;
const uuidv4 = require("uuid/v4");
const users = require("./users");

function getAllCash() {
	if (arguments.length !== 0) {
		throw "No arguments are needed.";
	}
	try {
		return cash().then(cashCollection => {
			return cashCollection.find({}).toArray();
		});
	}
	catch(error) {
		throw error;
	}
}

function getCashById(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		return cash().then(cashCollection => {
			return cashCollection.findOne({_id: id}).then(cash => {
				if (!cash) throw "Cash not found";
				return cash;
			});
		});
	}
	catch(error) {
		throw error;
	}
}

function addCash(startingAmount) {
	if (arguments.length !== 1) {
		throw "Please provide a user ID and starting amount.";
	}
	if (typeof startingAmount !== "number"){
		"The starting amount must be a number."
	}
	try{
		return cash().then(cashCollection => {
			if (startingAmount <= 0) {
				return {};
			}
			let newCash = {
				_id: uuidv4(),
				transactions: [],
				startingAmount: startingAmount,
				currentAmount: startingAmount
			};
			return cashCollection
				.insertOne(newCash)
				.then(insInfo => {
					return insInfo.insertedId;
				})
				.then(newId => {
					return this.getCashById(newId);
				});
		});
	}
	catch(error) {
		throw error;
	}
}

// should only be used by the user delete
function deleteCash(id) {
	if (arguments.length !== 1) {
		throw "Please provide an cash ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		return cash().then(cashCollection => {
			return cashCollection.removeOne({_id: id}).then(delInfo => {
				if (delInfo.deletedCount === 0) {
					throw `Could not remove cash with id of ${id}.`;
				} else {
				}
			});
		});
	}
	catch(error) {
		throw error;
	}
}

// type is either "deposit" or "withdrawl"
function addCashTransaction(id, quantity, type) {
	if (arguments.length !== 3) {
		throw "Please provide an cash ID, user ID, quantity, and type.";
	}
	if (typeof id !== "string" || typeof quantity !== "number" || typeof type !== "string"){
		throw "The cash ID and type must be strings and quantity must be a number.";
	}
	try {
		return cash().then(cashCollection => {
			cashVal = this.getCashById(id);
			newAmount = 0;
			if (type === "withdrawl" && cashVal.currentAmount <= quantity) {
				newAmount = 0;
			}
			else {
				newAmount = (type === "deposit" ? cashVal.currentAmount + quantity : cashVal.currentAmount - quantity);
			}
			newTransaction = {
				type: type,
				qty: quantity,
				date: Math.round((new Date()).getTime() / 1000)
			};
			let updatedCash = {
				transactions: (this.getCashById(id)).transactions.push(newTransaction),
				currentAmount: newAmount
			}
			return cashCollection
				.updateOne({_id: id}, {$set: updatedCash})
				.then(result => {
					return this.getCashById(id);
				});
		});
	}
	catch(error) {
		throw error;
	}
}

module.exports = {
	getAllCash,
	getCashById,
	addCash,
	deleteCash,
	addCashTransaction
}