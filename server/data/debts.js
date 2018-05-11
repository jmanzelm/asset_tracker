const mongoCollections = require("../config/mongoCollections");
const debts = mongoCollections.debts;
const uuidv4 = require("uuid/v4");

function ModuleA() {

}

module.exports = ModuleA;

const users = require("./users");

ModuleA.getAllDebts = function() {
	if (arguments.length !== 0) {
		throw "No arguments are needed.";
	}
	try {
		return debts().then(debtCollection => {
			return debtCollection.find({}).toArray();
		});
	}
	catch(error) {
		throw error;
	}
}

ModuleA.getDebtById = function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		return debts().then(debtCollection => {
			return debtCollection.findOne({_id: id}).then(debt => {
				if (!debt) throw "Debt not found";
				return debt;
			});
		});
	}
	catch(error) {
		throw error;
	}
}

ModuleA.addDebt = function(userId, creditor, startingAmount) {
	if (arguments.length !== 3) {
		throw "Please provide a user ID, creditor, and starting amount.";
	}
	if (typeof userId !== "string" || typeof creditor !== "string" || typeof startingAmount !== "number"){
		"The user ID and symbol must be strings and starting amount must be a number."
	}
	try{
		return debts().then(debtCollection => {
			if (startingAmount <= 0) {
				return {};
			}
			let newDebt = {
				_id: uuidv4(),
				creditor: creditor,
				transactions: [],
				startingAmount: startingAmount,
				currentAmount: startingAmount
			};
			return debtCollection
				.insertOne(newDebt)
				.then(insInfo => {
					users.extendDebtList(userId, insInfo.insertedId);
					return insInfo.insertedId;
				})
				.then(newId => {
					return this.getDebtById(newId);
				});
		});
	}
	catch(error) {
		throw error;
	}
}

ModuleA.deleteDebt = function(id, userId) {
	if (arguments.length !== 2) {
		throw "Please provide an debt ID and a user ID.";
	}
	if (typeof id !== "string") {
		throw "Both IDs must be strings.";
	}
	try {
		return debts().then(debtCollection => {
			return debtCollection.removeOne({_id: id}).then(delInfo => {
				if (delInfo.deletedCount === 0) {
					throw `Could not remove debt with id of ${id}.`;
				} else {
					users.shortenDebtList(userId, id);
				}
			});
		});
	}
	catch(error) {
		throw error;
	}
}

// type is either "add" or "subtract"
ModuleA.addDebtTransaction = function(id, userId, quantity, type) {
	if (arguments.length !== 3) {
		throw "Please provide an debt ID, user ID, quantity, and type.";
	}
	if (typeof id !== "string" || typeof userId !== "string" || typeof quantity !== "number" || typeof type !== "string"){
		throw "The debt ID, user ID, and type must be strings and quantity must be a number.";
	}
	try {
		return debts().then(debtCollection => {
			debt = this.getDebtById(id);
			if (type === "subtract" && debt.currentAmount <= quantity) {
				this.deleteDebt(id, userId);
				return {};
			}
			newTransaction = {
				type: type,
				qty: quantity,
				date: Math.round((new Date()).getTime() / 1000)
			};
			let updatedDebt = {
				transactions: (this.getDebtById(id)).transactions.push(newTransaction),
				currentAmount: (type === "add" ? debt.currentAmount + quantity : debt.currentAmount - quantity)
			}
			return debtCollection
				.updateOne({_id: id}, {$set: updatedDebt})
				.then(result => {
					return this.getDebtById(id);
				});
		});
	}
	catch(error) {
		throw error;
	}
}