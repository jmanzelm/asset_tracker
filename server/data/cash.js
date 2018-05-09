const mongoCollections = require("../config/mongoCollections");
const cash = mongoCollections.cash;
const uuid = require("node-uuid");

let exportedMethods = {
   getAllCashHoldings() {
    return cash().then(cashCollection => {
      return cashCollection.find({}).toArray();
    });
  },
  getCashHoldingsByUserId(id) {
    return cash().then(cashCollection => {
      return cashCollection.findOne({ user_id: id }).then(holdings => {
        if (!holdings) throw "this holding does not exist";
        return holdings;
      });
    });
  },
  addCashDeposit(amount, user_id) {
    let ts = Math.round((new Date()).getTime() / 1000);
    return cash().then(cashCollection => {
        let deposit = {
          type: "deposit",
          amount: amount,
          date: ts,
          _id: uuid.v4()
        };
        //console.log("getting here?")
        return cashCollection
          .updateOne({user_id:user_id}, {$push:{ transactions: deposit}}, {upsert:true})
          .then(results => {
            //console.log(results);
            return cashCollection.findOne({ user_id: user_id }).then(holding => {
             // console.log(holding);
                if (!holding) throw "this holding does not exist";
                return holding;
              });
          });
    });
  },
  addCashWithdrawal(amount, user_id){
    let ts = Math.round((new Date()).getTime() / 1000);
    return cash().then(cashCollection => {
        let withdrawal = {
          type: "withdrawal",
          amount: amount,
          date: ts,
          _id: uuid.v4()
        };

        return cashCollection
          .findOne({"user_id":user_id})
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
            cashCollection.updateOne({user_id:user_id}, {$push:{ transactions: withdrawal}})
              .then(result => {
                return cashCollection.findOne({ user_id: user_id }).then(holding => {
                    if (!holding) throw "this holding does not exist";
                    return holding;
                  });
              });
          });
    });
  },
  removeCash(id) {
    return cash().then(cashCollection => {
      return cashCollection.removeOne({ _id: id }).then(deletionInfo => {
        if (deletionInfo.deletedCount === 0) {
          throw `Could not delete cash holding with id of ${id}`;
        } else {
            return "Delete successful";
        }
      });
    });
  }
};

module.exports = exportedMethods;