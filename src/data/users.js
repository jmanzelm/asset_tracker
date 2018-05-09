const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuidv4 = require("uuid/v4");
const cash = require("./cash");
const investments = require("./investments");
const debts = require("./debts");

function getAllUsers() {
  if (arguments.length !== 0) {
    throw "No arguments are needed.";
  }
  try {
    return users().then(userCollection => {
      return userCollection.find({}).toArray();
    });
  }
  catch(error) {
    throw error;
  }
}

function getUserById(id) {
  if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof id !== "string") {
    throw "The ID must be a string.";
  }
  try {
    return users().then(userCollection => {
      return userCollection.findOne({_id: id}).then(user => {
        if (!user) throw "User not found";
        return user;
      });
    });
  }
  catch(error) {
    throw error;
  }
}

function addUser(username, hashedPassword, startingCash) {
  if (arguments.length !== 3) {
    throw "Please provide a username, hashed password, and starting cash amount.";
  }
  if (typeof username !== "string" || typeof hashedPassword !== "string" || typeof startingCash !== "number"){
    "The username and hashed password must be strings and the starting cash amount must be a number."
  }
  try{
    return users().then(userCollection => {
      let newUser = {
        _id: uuidv4(),
        username: username,
        hashedPassword: hashedPassword,
        investments: [],
        cash: (cash.addCash(startingCash))._id, // add a new cash object
        debts: []
      };
      return userCollection
        .insertOne(newUser)
        .then(insInfo => {
          return insInfo.insertedId;
        })
        .then(newId => {
          return this.getUserById(newId);
        });
    });
  }
  catch(error) {
    throw error;
  }
}

function deleteUser(id) {
  if (arguments.length !== 1) {
    throw "Please provide a single ID";
  }
  if (typeof id !== "string") {
    throw "The ID must be a string.";
  }
  try {
    return users().then(userCollection => {
      const user = this.getUserById(id);
      cash.deleteCash(user.cash);
      let ilen = user.investments.length;
      let dlen = user.debts.length;
      for (let i = 0; i < ilen; i++) {
        investments.deleteInvestment(user.investments[i]);
      }
      for (let i = 0; i < dlen; i++) {
        investments.deleteDebt(user.debts[i]);
      }
      return userCollection.removeOne({_id: id}).then(delInfo => {
        if (delInfo.deletedCount === 0) {
          throw `Could not remove user with id of ${id}.`;
        } else {
        }
      });
    });
  }
  catch(error) {
    throw error;
  }
}

// called when a new investment is created
function extendInvestmentList(id, investmentId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and investment ID.";
  }
  if (typeof id !== "string" || typeof investmentId !== "string"){
    throw "The user ID and investment ID must be strings.";
  }
  try {
    return users().then(userCollection => {
      let updatedUser = {
        investments: (this.getUserById(id)).investments.push(investmentId)
      }
      return userCollection
        .updateOne({_id: id}, {$set: updatedUser})
        .then(result => {
          return this.getUserById(id);
        });
    });
  }
  catch(error) {
    throw error;
  }
}

// called when a investment is deleted
function shortenInvestmentList(id, investmentId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and investment ID.";
  }
  if (typeof id !== "string" || typeof investmentId !== "string"){
    throw "The user ID and investment ID must be strings.";
  }
  try {
    return users().then(userCollection => {
      const user = this.getUserById(id);
      let updatedUser = {
        investments: user.investments.splice(user.investments.findIndex(function(element) {return element === investmentId}), 1)
      }
      return userCollection
        .updateOne({_id: id}, {$set: updatedUser})
        .then(result => {
          return this.getUserById(id);
        });
    });
  }
  catch(error) {
    throw error;
  }
}

// called when a new debt is created
function extendDebtList(id, debtId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and debt ID.";
  }
  if (typeof id !== "string" || typeof debtId !== "string"){
    throw "The user ID and debt ID must be strings.";
  }
  try {
    return users().then(userCollection => {
      let updatedUser = {
        debts: (this.getUserById(id)).debts.push(debtId)
      }
      return userCollection
        .updateOne({_id: id}, {$set: updatedUser})
        .then(result => {
          return this.getUserById(id);
        });
    });
  }
  catch(error) {
    throw error;
  }
}

// called when a debt is deleted
function shortenDebtList(id, debtId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and debt ID.";
  }
  if (typeof id !== "string" || typeof debtId !== "string"){
    throw "The user ID and debt ID must be strings.";
  }
  try {
    return users().then(userCollection => {
      const user = this.getUserById(id);
      let updatedUser = {
        debts: user.debts.splice(user.debt.findIndex(function(element) {return element === debtId}), 1)
      }
      return userCollection
        .updateOne({_id: id}, {$set: updatedUser})
        .then(result => {
          return this.getUserById(id);
        });
    });
  }
  catch(error) {
    throw error;
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  deleteUser,
  extendInvestmentList,
  shortenInvestmentList,
  extendDebtList,
  shortenDebtList
}