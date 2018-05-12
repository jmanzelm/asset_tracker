const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuidv4 = require("uuid/v4");

function ModuleA() {

}

module.exports = ModuleA;

const cash = require("./cash");
const investments = require("./investments");
const debts = require("./debts");

ModuleA.getAllUsers = async function() {
  if (arguments.length !== 0) {
    throw "No arguments are needed.";
  }
  try {
    const userCollection = await users();
    return await userCollection.find({}).toArray();
  }
  catch(error) {
    throw error;
  }
}

ModuleA.getUserById = async function(id) {
  if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof id !== "string") {
    throw "The ID must be a string.";
  }
  try {
    const userCollection = await users();
    const user1 = await userCollection.findOne({_id: id});
    if (user1 === null) throw "User not found";
    return user1;
  }
  catch(error) {
    throw error;
  }
}

ModuleA.getUserByName = async function(name) {
  if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof id !== "string") {
    throw "The ID must be a string.";
  }
  try {
    const userCollection = await users();
    const user1 = await userCollection.findOne({username: name});
    if (user1 === null) throw "User not found";
    return user1;
  }
  catch(error) {
    throw error;
  }
}

ModuleA.addUser = async function(username, hashedPassword, startingCash) {
  if (arguments.length !== 3) {
    throw "Please provide a username, hashed password, and starting cash amount.";
  }
  if (typeof username !== "string" || typeof hashedPassword !== "string" || typeof startingCash !== "number"){
    throw "The username and hashed password must be strings and the starting cash amount must be a number."
  }
  try {
    const userCollection = await users();
    let newUser = {
      _id: uuidv4(),
      username: username,
      hashedPassword: hashedPassword,
      investments: [],
      cash: (await cash.addCash(startingCash))._id, // add a new cash object
      debts: []
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not add user";

    const newId = insertInfo.insertedId;
    const temp =  await this.getUserById(newId);
    return temp;
  }
  catch(error) {
    throw error;
  }
}

ModuleA.deleteUser = async function(id) {
  if (arguments.length !== 1) {
    throw "Please provide a single ID";
  }
  if (typeof id !== "string") {
    throw "The ID must be a string.";
  }
  try {
    const userCollection = await users();

    const user1 = await this.getUserById(id);
    await cash.deleteCash(user.cash);
    ilen = user.investments.length;
    dlen = user.debts.length;
    for (i = 0; i < ilen; i++) {
      await investments.deleteInvestment(user.investments[i]);
    }
    for (i = 0; i < dlen; i++) {
      await investments.deleteDebt(user.debts[i]);
    }

    const deletionInfo = await userCollection.removeOne({_id: id});

    if (deletionInfo.deletedCount === 0) {
        throw `Could not delete user with id of ${id}`;
    }
  }
  catch(error) {
    throw error;
  }
}

// called when a new investment is created
ModuleA.extendInvestmentList = async function(id, investmentId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and investment ID.";
  }
  if (typeof id !== "string" || typeof investmentId !== "string"){
    throw "The user ID and investment ID must be strings.";
  }
  try {
    const userCollection = await users();
    const user1 = await this.getUserById(id);
    user1.investments.push(investmentId)
    let updatedUser = {
      investments: user1.investments
    };

    const updateInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
    if (updateInfo.modifiedCount === 0) {
      throw "could not update dog successfully";
    }

    return await this.getUserById(id);
  }
  catch(error) {
    throw error;
  }
}

// called when a investment is deleted
ModuleA.shortenInvestmentList = async function(id, investmentId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and investment ID.";
  }
  if (typeof id !== "string" || typeof investmentId !== "string"){
    throw "The user ID and investment ID must be strings.";
  }
  try {
    const userCollection = await users();
    const user1 = await this.getUserById(id);
    user1.investments.splice(user1.investments.findIndex(function(element) {return element === investmentId}), 1);
    let updatedUser = {
      investments: user1.investments
    };

    const updateInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
    if (updateInfo.modifiedCount === 0) {
      throw "could not update dog successfully";
    }

    return await this.getUserById(id);
  }
  catch(error) {
    throw error;
  }
}

// called when a new debt is created
ModuleA.extendDebtList = async function(id, debtId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and debt ID.";
  }
  if (typeof id !== "string" || typeof debtId !== "string"){
    throw "The user ID and debt ID must be strings.";
  }
  try {
    const userCollection = await users();
    const user1 = await this.getUserById(id);
    user1.debts.push(debtId)
    let updatedUser = {
      debts: user1.debts
    };

    const updateInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
    if (updateInfo.modifiedCount === 0) {
      throw "could not update dog successfully";
    }

    return await this.getUserById(id);
  }
  catch(error) {
    throw error;
  }
}

// called when a debt is deleted
ModuleA.shortenDebtList = async function(id, debtId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and debt ID.";
  }
  if (typeof id !== "string" || typeof debtId !== "string"){
    throw "The user ID and debt ID must be strings.";
  }
  try {
    const userCollection = await users();
    const user1 = await this.getUserById(id);
    user1.debts.splice(user1.debts.findIndex(function(element) {return element === debtId}), 1)
    let updatedUser = {
      investments: user1.debts
    };

    const updateInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
    if (updateInfo.modifiedCount === 0) {
      throw "could not update dog successfully";
    }

    return await this.getUserById(id);
  }
  catch(error) {
    throw error;
  }
}