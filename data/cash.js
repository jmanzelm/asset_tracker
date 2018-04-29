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

function addCash(userId, startingAmount) {
	if (arguments.length !== 2) {
		throw "Please provide a user ID and starting amount.";
	}
	if (typeof userId !== "string" || typeof startingAmount !== "number"){
		"The user ID be a string and starting amount must be a number."
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

function deleteCash(id, userId) {
	if (arguments.length !== 2) {
		throw "Please provide an cash ID and a user ID.";
	}
	if (typeof id !== "string") {
		throw "Both IDs must be strings.";
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

// type is true if addition, false if reduction
function addCashTransaction(id, userId, quantity, type) {
	if (arguments.length !== 4) {
		throw "Please provide an cash ID, user ID, quantity, and type.";
	}
	if (typeof id !== "string" || typeof userId !== "string" || typeof quantity !== "number" || typeof type !== "boolean"){
		throw "The cash ID and user ID must be strings, quantity must be a number, and type must be a boolean.";
	}
	try {
		return cash().then(cashCollection => {
			cash = this.getCashById(id);
			newAmount = 0;
			if (!type && cash.currentAmount <= quantity) {
				newAmount = 0;
			}
			else {
				newAmount = (type ? cash.currentAmount + quantity : cash.currentAmount - quantity);
			}
			newTransaction = {
				type: type,
				qty: quantity,
				date: Math.round((new Date()).getTime() / 1000)
			};
			let updatedCash = {
				transactions: (await this.getCashById(id)).transactions.push(newTransaction),
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