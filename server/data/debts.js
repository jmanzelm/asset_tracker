const mongoCollections = require("../config/mongoCollections");
const debts = mongoCollections.debts;
const uuid = require("node-uuid");

let exportedMethods = {
  getAllDebts() {
    return cash().then(debtsCollection => {
      return debtsCollection.find({}).toArray();
    });
  },
  getDebtsByUserId(id) {
    return debts().then(debtsCollection => {
      return debtCollection.find({ user_id: id }).then(debt => {
        if (!debt) throw "this debt does not exist";
        return debt;
      });
    });
  },
  addToDebt(creditor, amount, user_id) {
    let ts = Math.round((new Date()).getTime() / 1000);
    return cash().then(debtCollection => {
        let debt = {
          creditor: creditor,
          amount: amount,
          date: ts,
          _id: uuid.v4()
        };

        return debtCollection
          .findOne({user_id: user_id, "creditors.creditor":creditor})
          .then(existingDebt=>{
            let newAmount = amount;
            if (!existingDebt)
            {
              newAmount+=amount;
            }
            else{
              existingDebt.creditors.forEach(element => {
                newAmount+=element.amount;
              });
            }
            return debtCollection.updateOne({"user_id":user_id}, {$push:{ "creditors.creditor": debt}}, {upsert:true})
                    .then(newId => {
                      return debtCollection.findOne({ _id: newId }).then(newDebt => {
                          if (!newDebt) throw "this debt does not exist";
                          return newDebt;
                        });
                    });
          });
    });
  },
  removeDebt(user_id, creditor) {
    return cash().then(debtCollection => {
      return debtCollection.removeOne({ user_id: user_id, "creditors.creditor": creditor }).then(deletionInfo => {
        if (deletionInfo.deletedCount === 0) {
          throw `Could not delete debt with id of ${id}`;
        } else {
            return "Delete successful";
        }
      });
    });
  }
};

module.exports = exportedMethods;