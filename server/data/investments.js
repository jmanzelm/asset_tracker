const mongoCollections = require("../config/mongoCollections");
const investments = mongoCollections.investments;
const uuidv4 = require("uuid/v4");
const axios = require("axios");

function ModuleA() {

}

module.exports = ModuleA;

const users = require("./users");

ModuleA.getAllInvestments = async function() {
	if (arguments.length !== 0) {
		throw "No arguments are needed.";
	}
	try {
		const investmentCollection = await investments();

		return await investmentCollection.find({}).toArray();
	}
	catch(error) {
		throw error;
	}
}

ModuleA.getInvestmentById = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		const investmentCollection = await investments();
		const investment1 = await investmentCollection.findOne({_id: id});
		if (investment1 === null) throw "investment not found";
		return investment1;
	}
	catch(error) {
		throw error;
	}
}

// type is either "stock" or "crypto"
ModuleA.addInvestment = async function(userId, symbol, type, startingAmount) {
	if (arguments.length !== 4) {
		throw "Please provide a user ID, symbol, type, and starting amount.";
	}
	if (typeof userId !== "string" || typeof symbol !== "string" || typeof type !== "string" || typeof startingAmount !== "number"){
		throw "The user ID, symbol, and type must be strings and starting amount must be a number.";
	}
	try {
		const investmentCollection = await investments();
		let newInvestment = {
			_id: uuidv4(),
			symbol: symbol,
			transactions: [],
			type: type,
			startingAmount: startingAmount,
			currentAmount: startingAmount
		};

		const insertInfo = await investmentCollection.insertOne(newInvestment);
		if (insertInfo.insertedCount === 0) throw "Could not add investment";
		await users.extendInvestmentList(userId, insertInfo.insertedId);

		const newId = insertInfo.insertedId;
		return await this.getInvestmentById(newId);
	}
	catch(error) {
		throw error;
	}
}

ModuleA.deleteInvestment = async function(id, userId) {
	if (arguments.length !== 2) {
		throw "Please provide an investment ID and a user ID.";
	}
	if (typeof id !== "string") {
		throw "Both IDs must be strings.";
	}
	try {
		const investmentCollection = await investments();
		const deletionInfo = await investmentCollection.removeOne({ _id: id });

	    if (deletionInfo.deletedCount === 0) {
	    	throw `Could not delete investment with id of ${id}`;
		}

		await users.shortenInvestmentList(userId, id);
	}
	catch(error) {
		throw error;
	}
}

// type is either "add" or "subtract"
ModuleA.addInvestmentTransaction = async function(id, userId, quantity, type) {
	if (arguments.length !== 4) {
		throw "Please provide an investment ID, user ID, quantity, and type.";
	}
	if (typeof id !== "string" || typeof userId !== "string" || typeof quantity !== "number" || typeof type !== "string"){
		throw "The investment ID, type, and user ID must be strings and quantity must be a number.";
	}

	try {
		const investmentCollection = await investments();
		investment1 = await this.getInvestmentById(id);
		if (type === "subtract" && investment.currentAmount <= quantity) {
			await this.deleteInvestment(id, userId);
			return {};
		}
		let newTransaction = {
			type: type,
			qty: quantity,
			date: Math.round((new Date()).getTime() / 1000),
			price: (investment.type === "stock" ? axios.get("http://localhost:3001/prices/stock/" + investment.symbol).data.close : axios.get("http://localhost:3001/prices/crypto/" + investment.symbol).data.close)
		};
		let updatedInvestment = {
			transactions: investment1.transactions.push(newTransaction),
			currentAmount: (type === "add" ? investment1.currentAmount + quantity : investment1.currentAmount - quantity)
		}

		const updateInfo = await investmentCollection.updateOne({_id: id}, {$set: updatedInvestment}, {upsert:true});
		if (updateInfo.modifiedCount === 0) {
	    	throw "could not update investment successfully";
		}

		return await this.getInvestmentById(id);
	}
	catch(error) {
		throw error;
	}
}