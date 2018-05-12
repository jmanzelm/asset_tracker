const mongoCollections = require("../config/mongoCollections");
const debts = mongoCollections.debts;
const uuidv4 = require("uuid/v4");

function ModuleA() {

}

module.exports = ModuleA;

ModuleA.getAllDebts = async function() {
	if (arguments.length !== 0) {
		throw "No arguments are needed.";
	}
	try {
		let debtCol = await debts();
		return await debtCol.find({}).toArray();
	}
	catch(error) {
		throw error;
	}
}

ModuleA.getDebtById = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		let debtCol = await debts();
		let debt = await debtCol.findOne({_id: id});
		if (debt) {
			return debt;
		}
		throw "Debt not found";
	} catch (error) {
		throw error;
	}
}

ModuleA.getDebtByUserId = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		let debtCol = await debts();
		let debt = await debtCol.find({userId: id}).toArray();
		if (debt) {
			return debt;
		}
		throw "Debt not found";
	} catch (error) {
		throw error;
	}
}

ModuleA.addDebt = async function(userId, creditor, startingAmount) {
	if (arguments.length !== 3) {
		throw "Please provide a user ID, creditor, and starting amount.";
	}
	if (typeof userId !== "string" || typeof creditor !== "string" || typeof startingAmount !== "number"){
		"The user ID and symbol must be strings and starting amount must be a number."
	}
	try{
		if (startingAmount <= 0) {
			return {};
		}
		
		let debtCol = await debts();
		let newDebt = {
			_id: uuidv4(),
			userId: userId,
			creditor: creditor,
			transactions: [],
			startingAmount: startingAmount,
			currentAmount: startingAmount,
			date: Math.round((new Date()).getTime() / 1000)
		};
		let insInfo = await debtCol.insertOne(newDebt)

		const newId = insInfo.insertedId;
		return this.getDebtById(newId);
	} catch (error) {
		throw error;
	}
}

ModuleA.deleteDebt = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a debt ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		let debtCol = await debts();
		let delInfo = await debtCol.removeOne({_id: id});
		if (delInfo.deletedCount === 0) {
			throw `Could not remove debt with id of ${id}.`
		}
	}
	catch(error) {
		throw error;
	}
}

// type is either "add" or "subtract"
ModuleA.addDebtTransaction = async function(id, quantity, type) {
	if (arguments.length !== 3) {
		throw "Please provide an debt ID, quantity, and type.";
	}
	if (typeof id !== "string" || typeof quantity !== "number" || typeof type !== "string"){
		throw "The debt ID and type must be strings and quantity must be a number.";
	}
	try {
		if (type === "subtract" && debt.currentAmount <= quantity) {
			this.deleteDebt(id);
			return {};
		}
		let debtCol = await debts();
		let debt = await this.getDebtById(id);
		let newTransaction = {
			type: type,
			qty: quantity,
			date: Math.round((new Date()).getTime() / 1000)
		};
		let updatedDebt = {
			transactions: (this.getDebtById(id)).transactions.push(newTransaction),
			currentAmount: (type === "add" ? debt.currentAmount + quantity : debt.currentAmount - quantity)
		}
		await debtCol.updateOne({_id: id}, {$set: updatedDebt});
		return await this.getDebtById(id);
	}
	catch(error) {
		throw error;
	}
}