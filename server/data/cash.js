const mongoCollections = require("../config/mongoCollections");
const cash = mongoCollections.cash;
const uuidv4 = require("uuid/v4");

function ModuleA() {

}

module.exports = ModuleA;

ModuleA.getCollection = function(){
	return cash();
}

ModuleA.getAllCash = async function() {
	if (arguments.length !== 0) {
		throw "No arguments are needed.";
	}
	try {
		let cashCol = await cash();
		return await cashCol.find({}).toArray();
	} catch (e) {
		throw e
	}
}

ModuleA.update = (id, params)=>{
	return getCashById(id).then(function(cashObj){
		params.keys.forEach(function(key){
			cashObj[key] = params[key];
		});
		return cashCol.updateOne({_id: id}, cashObj, function(err, res){
			if (err){
				console.log(err);
			}
			else{
				console.log(res);
				return res;
			}
		});
	});
}

ModuleA.getCashById = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}

	try {
		let cashCol = await cash();
		let c = await cashCol.findOne({_id: id});
		if (c) {
			return c;
		}
		throw "Cash not found";
	}
	catch (error) {
		throw error;
	}
}

ModuleA.getCashByUserId = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}

	try {
		let cashCol = await cash();
		let c = await cashCol.findOne({userId: id});
		if (c) {
			return c;
		}
		throw "Cash not found";
	}
	catch (error) {
		throw error;
	}
}

ModuleA.addCash = async function(userId, startingAmount) {
	if (arguments.length !== 2) {
		throw "Please provide a user ID and starting amount.";
	}
	if (typeof userId !== "string" || typeof startingAmount !== "number"){
		"The user id must be a string and the starting amount must be a number."
	}
	try{
		if (startingAmount <= 0) {
			return {};
		}
		let cashCol = await cash();
		let newCash = {
			_id: uuidv4(),
			userId: userId,
			transactions: [],
			startingAmount: startingAmount,
			currentAmount: startingAmount,
			date: Math.round((new Date()).getTime() / 1000)
		};
		let insInfo = await cashCol.insertOne(newCash);
		return await this.getCashById(insInfo.insertedId);
	}
	catch (error) {
		throw error;
	}
}

// should only be used by the user delete
ModuleA.deleteCash = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide an cash ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		let cashCol = await cash();
		let delInfo = cashCol.removeOne({_id: id});
		if (delInfo.deletedCount === 0) {
			throw  `Could not remove cash with id of ${id}.`
		}
	}
	catch(error) {
		throw error;
	}
}

// type is either "deposit" or "withdraw"
ModuleA.addCashTransaction = async function(id, quantity, type) {
	if (arguments.length !== 3) {
		throw "Please provide an cash ID, quantity, and type.";
	}
	if (typeof id !== "string" || typeof quantity !== "number" || typeof type !== "string"){
		throw "The cash ID and type must be strings and quantity must be a number.";
	}
	try {
		let cashCol = await cash();
		console.log("cash initialized");
		let cashVal = await this.getCashById(id);
		console.log("cashVal", cashVal)
		let newAmount = 0;
		if (!(type === "withdraw" && cashVal.currentAmount <= quantity)) {
			newAmount = (type === "deposit" ? cashVal.currentAmount + quantity : cashVal.currentAmount - quantity);
		}
		console.log("newAmount", newAmount);
		let newTransaction = {
			type: type,
			qty: quantity,
			date: Math.round((new Date()).getTime() / 1000)
		};
		let updatedCash = {
			transactions: (this.getCashById(id)).transactions.push(newTransaction),
			currentAmount: newAmount
		}
		cashCol.updateOne({_id: id}, {$set: updatedCash});
		return await this.getCashById(id);
	}
	catch(error) {
		console.log('hi tehe', error)
		throw error;
	}
}