const mongoCollections = require("../config/mongoCollections");
const investments = mongoCollections.investments;
const uuidv4 = require("uuid/v4");

function investmentModule() {

}

module.exports = investmentModule;

investmentModule.getCollection = function(){
	return investments();
}

investmentModule.getAllInvestments = async function() {
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

investmentModule.getInvestmentById = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		const investmentCollection = await investments();
		const investment = await investmentCollection.findOne({_id: id});
		if (!investment) throw "investment not found";
		return investment;
	}
	catch(error) {
		throw error;
	}
}

investmentModule.getStockByUserId = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		const investmentCollection = await investments();
		const investment = await investmentCollection.find({userId: id, type: "stock"}).toArray();
		if (!investment) throw "investment not found";
		return investment;
	}
	catch(error) {
		throw error;
	}
}

investmentModule.getCryptoByUserId = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide a single ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be a string.";
	}
	try {
		const investmentCollection = await investments();
		const investment = await investmentCollection.find({userId: id, type: "crypto"}).toArray();
		if (!investment) throw "investment not found";
		return investment;
	}
	catch(error) {
		throw error;
	}
}

// type is either "stock" or "crypto"
investmentModule.addInvestment = async function(userId, attrs) {
	if (arguments.length !== 2) {
		throw "Please provide a user ID, symbol, type, and starting amount.";
	}
	let symbol = attrs.symbol;
	let type = attrs.type;
	let startingAmount = attrs.startingAmount;
	let date = (attrs.date) ? attrs.date : Math.round(new Date().getTime() / 1000);

	if (typeof userId !== "string" || typeof symbol !== "string" || typeof type !== "string" || typeof startingAmount !== "number"){
		throw "The user ID, symbol, and type must be strings and starting amount must be a number.";
	}
	try {
		const investmentCollection = await investments();
		let newInvestment = {
			_id: uuidv4(),
			userId: userId,
			symbol: symbol,
			transactions: [],
			type: type,
			startingAmount: startingAmount,
			currentAmount: startingAmount,
			date: date
		};

		const insertInfo = await investmentCollection.insertOne(newInvestment);
		if (insertInfo.insertedCount === 0) throw "Could not add investment";

		const newId = insertInfo.insertedId;
		return await this.getInvestmentById(newId);
	}
	catch(error) {
		throw error;
	}
}

investmentModule.update = (id, params)=>{
	getInvestmentById(id).then(function(investmentObj){
		params.keys.forEach(function(key){
			investmentObj[key] = params[key];
		});
		investmentCollection.updateOne({_id: id}, investmentObj, function(err, res){
			if (err){
				console.log(err);
			}
			else{
				console.log(res);
			}
		});
	});
}

investmentModule.deleteInvestment = async function(id) {
	if (arguments.length !== 1) {
		throw "Please provide an investment ID.";
	}
	if (typeof id !== "string") {
		throw "The ID must be s string.";
	}
	try {
		const investmentCollection = await investments();
		const deletionInfo = await investmentCollection.removeOne({ _id: id });

	    if (deletionInfo.deletedCount === 0) {
	    	throw `Could not delete investment with id of ${id}`;
		}
	}
	catch(error) {
		throw error;
	}
}

// type is either "add" or "subtract"
investmentModule.addInvestmentTransaction = async function(id, attrs) {
	if (arguments.length !== 2 || !attrs.type || !attrs.quantity) {
		throw "Please provide an investment ID, quantity, and type.";
	}
	let type = attrs.type;
	let quantity = attrs.quantity;
	let date = attrs.date;
	
	if (typeof id !== "string" || typeof quantity !== "number" || typeof type !== "string"){
		throw "The investment ID and type must be strings and quantity must be a number.";
	}

	try {
		let investmentCollection = await investments();
		let investment = await this.getInvestmentById(id);
		if (type === "subtract" && investment.currentAmount <= quantity) {
			await this.deleteInvestment(id);
			return {};
		}
		let newTransaction = {
			type: type,
			qty: quantity,
			date: Math.round((new Date()).getTime() / 1000)
		};
		investment.transactions.push(newTransaction);
		let updatedInvestment = {
			transactions: investment.transactions,
			currentAmount: (type === "add" ? investment.currentAmount + quantity : investment.currentAmount - quantity)
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

investmentModule.addTransactionSeries = async function(user_id, series){
	let countPromises = [];
	let ret;
	for (var i = 0; i < series.length; i++){
		let investment = series[i];
			let attrs = {
				symbol: investment.symbol, 
				startingAmount: investment.transactions[0].qty, 
				date: investment.transactions[0].date,
				type: investment.type
			};
			ret = await this.addInvestment(user_id, attrs);
		
			for (var j = 1; j < investment.transactions.length; j++){
				let attrs = {
					quantity: investment.transactions[j].qty,
					date: investment.transactions[j].date,
					type: investment.transactions[j].type
				};
				await this.addInvestmentTransaction(ret._id, attrs);
			}
	}
	
	return await this.getAllInvestments();
}