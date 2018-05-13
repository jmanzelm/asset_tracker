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
ModuleA.addCashDeposit = async function(user_id, attrs) {
	if (!attrs){
		throw "Attributes needed";
	}
	let amount = attrs.amount;
    let date = (attrs.date)? attrs.date : Math.round((new Date()).getTime() / 1000);
	
	return cash().then(cashCollection => {
        let deposit = {
          type: "deposit",
          amount: amount,
          date: date
        };
        //console.log("getting here?")
        return cashCollection
          .updateOne({userId:user_id}, {$push:{ transactions: deposit}}, {upsert:true})
          .then(results => {
            //console.log(results);
            return cashCollection.findOne({ userId: user_id }).then(holding => {
             // console.log(holding);
                if (!holding) throw "this holding does not exist";
                return holding;
              });
          });
    });
  }
  ModuleA.addCashWithdrawal = async function(user_id, attrs){
    if (!attrs || !attrs.amount){
		throw "Attributes needed";
	}
	let amount = attrs.amount;
	let date = (attrs.date)? attrs.date : Math.round((new Date()).getTime() / 1000);
	
    return cash().then(cashCollection => {
        let withdrawal = {
          type: "withdrawal",
          amount: amount,
          date: date
        };

        return cashCollection
          .findOne({"userId":user_id})
          .then(holding=>{
            let total = 0;
            holding.transactions.forEach(function(element, index, array){
              if (element.type=="deposit"){
                total+=element.amount;
              }
              else if (element.type=="withdrawal"){
                total-=element.amount;
              }
            });
            if (total-withdrawal.amount<0){
              throw "You cannot withdraw more money than you have"
            }
            cashCollection.updateOne({userId:user_id}, {$push:{ transactions: withdrawal}})
              .then(result => {
                return cashCollection.findOne({ userId: user_id }).then(holding => {
                    if (!holding) throw "this holding does not exist";
                    return holding;
                  });
              });
          });
    });
  }

ModuleA.addTransactionSeries = async function(user_id, series){
	let countPromise = [];
	let userCashObj;
	for (var i = 0; i < series.length; i++){
		let transaction = series[i];
		if (transaction.type=="deposit"){
			if (i==0){
				//first deposit
				userCashObj = await this.addCash(user_id, transaction.amount);
			}
			let deposit = await this.addCashTransaction(userCashObj._id, transaction);
		}
		else if (transaction.type=="withdraw"){
			let withdrawal = this.addCashTransaction(userCashObj._id, transaction);
		}
	}
	console.log(await this.getAllCash());
	return await this.getCashByUserId(user_id);
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
ModuleA.addCashTransaction = async function(id, attrs) {
	if (arguments.length !== 2) {
		throw "Please provide an cash ID and attributes";
	}

	let amount = attrs.amount;
	let type = attrs.type;
	let date = (attrs.date) ? attrs.date : Math.round((new Date()).getTime() / 1000);

	if (typeof id !== "string" || typeof amount !== "number" || typeof type !== "string"){
		throw "The cash ID and type must be strings and amount must be a number.";
	}
	try {
		let cashCol = await cash();
		let cashVal = await this.getCashById(id);
		let newAmount = 0;
		if (!(type === "withdraw" && cashVal.currentAmount <= amount)) {
			newAmount = (type === "deposit" ? cashVal.currentAmount + amount : cashVal.currentAmount - amount);
		}
		console.log("newAmount", newAmount);
		let newTransaction = {
			type: type,
			qty: amount,
			date: (date) ? date : Math.round((new Date()).getTime() / 1000)
		};

		cashVal.transactions.push(newTransaction);
		let updatedCash = {
			transactions: cashVal.transactions,
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