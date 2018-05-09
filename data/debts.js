const mongoCollections = require("../config/mongoCollections");
const debts = mongoCollections.debts;
const uuid = require("node-uuid");

let exportedMethods = {
  getAllDebts() {
    return cash().then(debtsCollection => {
      return debtsCollection.find({}).toArray();
    });
  },
  getCashHoldingsByUserId(id) {
    return debts().then(debtsCollection => {
      return cashCollection.findOne({ user_id: id }).then(holdings => {
        if (!holdings) throw "this recipe does not exist";
        return holdings;
      });
    });
  },
  addCash(amount, user_id) {
    let ts = Math.round((new Date()).getTime() / 1000);
    return cash().then(cashCollection => {
        let deposit = {
          type: "deposit",
          amount: amount,
          date: ts,
          _id: uuid.v4()
        };

        return cashCollection
          .updateOne({"user_id":user_id}, {$push:{ transactions: deposit}}, {upsert:true})
          .then(newId => {
            return cashCollection.findOne({ _id: newId }).then(recipe => {
                if (!recipe) throw "this holding does not exist";
                return recipe;
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