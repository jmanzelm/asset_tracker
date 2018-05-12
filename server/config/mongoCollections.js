const dbConnection = require("./mongoConnection.js");
const mongoSeed = require("mongo-seed");


const getCollectionFn = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

module.exports = {
  users: getCollectionFn("users"),
  investments: getCollectionFn("investments"),
  cash: getCollectionFn("cash"),
  debts: getCollectionFn("debts")
};