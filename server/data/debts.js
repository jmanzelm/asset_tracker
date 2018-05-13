const mongoCollections = require("../config/mongoCollections");
const debts = mongoCollections.debts;
const uuidv4 = require("uuid/v4");

function ModuleA() {

}

module.exports = ModuleA;

ModuleA.getCollection = function(){
	return debts();
}

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

ModuleA.addDebt = async function(userId, attrs) {
	if (arguments.length !== 2) {
		throw "Please provide a user ID and {creditor: x, startingAmount: y}";
	}
	let creditor = attrs.creditor;
	let startingAmount = attrs.amount;
	let date = (attrs.date) ? attrs.date : Math.round((new Date()).getTime() / 1000);
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
			date: date
		};
		let insInfo = await debtCol.insertOne(newDebt)

		const newId = insInfo.insertedId;
		return await this.getDebtById(newId);
	} catch (error) {
		throw error;
	}
}

ModuleA.addTransactionSeries = async function(user_id, series){
	let countPromises = [];
	let ret;
	for (var i = 0; i < series.length; i++){
		let debt = series[i];
			let attrs = {
				creditor: debt.creditor, 
				startingAmount: debt.transactions[0].qty, 
				date: debt.transactions[0].date
			};
			ret = await this.addDebt(user_id, attrs);
		
			for (var j = 1; j < debt.transactions.length; j++){
				let attrs = {
					quantity: debt.transactions[j].qty,
					date: debt.transactions[j].date,
					type: "add"
				};
				await this.addDebtTransaction(ret._id, attrs);
			}
	}
	
	return await this.getAllDebts();
}

ModuleA.update = (id, params)=>{
	getDebtById(id).then(function(debtObj){
		params.keys.forEach(function(key){
			debtObj[key] = params[key];
		});
		debtCol.updateOne({_id: id}, debtObj, function(err, res){
			if (err){
				console.log(err);
			}
			else{
				console.log(res);
			}
		});
	});
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
ModuleA.addDebtTransaction = async function(id, attrs) {
	if (arguments.length !== 2) {
		throw "Please provide a debt ID {quantity: x, type: y, ?date: z}";
	}
	let amount = attrs.amount;
	let type = attrs.type;
	let date = (attrs.date) ? attrs.date : Math.round((new Date()).getTime() / 1000);
	if (typeof id !== "string" || typeof amount !== "number" || typeof type !== "string"){
		throw "The debt ID and type must be strings and amount must be a number.";
	}
	try {
		if (type === "subtract" && debt.currentAmount <= amount) {
			await this.deleteDebt(id);
			return {};
		}
		let debtCol = await debts();
		let debt = await this.getDebtById(id);
		let newTransaction = {
			type: type,
			qty: amount,
			date: date
		};
		debt.transactions.push(newTransaction);
		let updatedDebt = {
			transactions: debt.transactions,
			currentAmount: (type === "add" ? debt.currentAmount + amount : debt.currentAmount - amount)
		};
		await debtCol.updateOne({_id: id}, {$set: updatedDebt});
		return await this.getDebtById(id);
	}
	catch(error) {
		throw error;
	}
}