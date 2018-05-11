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
  const userCollection = await users();
  return await userCollection.find({}).toArray();

  /*try {
    return users().then(userCollection => {
      return userCollection.find({}).toArray();
    });
  }
  catch(error) {
    throw error;
  }*/
}

ModuleA.getUserById = async function(id) {
  if (arguments.length !== 1) {
    throw "Please provide a single ID.";
  }
  if (typeof id !== "string") {
    throw "The ID must be a string.";
  }
  const userCollection = await users();
  const user1 = await userCollection.findOne({_id: id});
  if (user1 === null) throw "User not found";
  return user1;

  /*try {
    return users().then(userCollection => {
      return userCollection.findOne({_id: id}).then(user => {
        if (!user) throw "User not found";
        return user;
      });
    });
  }
  catch(error) {
    throw error;
  }*/
}

ModuleA.addUser = async function(username, hashedPassword, startingCash) {
  if (arguments.length !== 3) {
    throw "Please provide a username, hashed password, and starting cash amount.";
  }
  if (typeof username !== "string" || typeof hashedPassword !== "string" || typeof startingCash !== "number"){
    "The username and hashed password must be strings and the starting cash amount must be a number."
  }
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
  return await this.getUserById(newId);

  /*try{
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
  }*/
}

ModuleA.deleteUser = async function(id) {
  if (arguments.length !== 1) {
    throw "Please provide a single ID";
  }
  if (typeof id !== "string") {
    throw "The ID must be a string.";
  }

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

  /*try {
    return users().then(userCollection => {
      const user1 = this.getUserById(id);
      cash.deleteCash(user.cash);
      ilen = user.investments.length;
      dlen = user.debts.length;
      for (i = 0; i < ilen; i++) {
        investments.deleteInvestment(user.investments[i]);
      }
      for (i = 0; i < dlen; i++) {
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
  }*/
}

// called when a new investment is created
ModuleA.extendInvestmentList = async function(id, investmentId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and investment ID.";
  }
  if (typeof id !== "string" || typeof investmentId !== "string"){
    throw "The user ID and investment ID must be strings.";
  }

  const userCollection = await users();
  const user1 = await this.getUserById(id);
  let updatedUser = {
    investments: user1.investments.push(investmentId)
  };

  const updateInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
  if (updateInfo.modifiedCount === 0) {
    throw "could not update dog successfully";
  }

  return await this.getUserById(id);

  /*try {
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
  }*/
}

// called when a investment is deleted
ModuleA.shortenInvestmentList = async function(id, investmentId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and investment ID.";
  }
  if (typeof id !== "string" || typeof investmentId !== "string"){
    throw "The user ID and investment ID must be strings.";
  }

  const userCollection = await users();
  const user1 = await this.getUserById(id);
  let updatedUser = {
    investments: user1.investments.splice(user1.investments.findIndex(function(element) {return element === investmentId}), 1)
  };

  const updateInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
  if (updateInfo.modifiedCount === 0) {
    throw "could not update dog successfully";
  }

  return await this.getUserById(id);

  /*try {
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
  }*/
}

// called when a new debt is created
ModuleA.extendDebtList = async function(id, debtId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and debt ID.";
  }
  if (typeof id !== "string" || typeof debtId !== "string"){
    throw "The user ID and debt ID must be strings.";
  }

  const userCollection = await users();
  const user1 = await this.getUserById(id);
  let updatedUser = {
    debts: user1.debts.push(investmentId)
  };

  const updateInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
  if (updateInfo.modifiedCount === 0) {
    throw "could not update dog successfully";
  }

  return await this.getUserById(id);

  /*try {
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
  }*/
}

// called when a debt is deleted
ModuleA.shortenDebtList = async function(id, debtId) {
  if (arguments.length !== 2) {
    throw "Please provide a user ID and debt ID.";
  }
  if (typeof id !== "string" || typeof debtId !== "string"){
    throw "The user ID and debt ID must be strings.";
  }

  const userCollection = await users();
  const user1 = await this.getUserById(id);
  let updatedUser = {
    investments: user1.debts.splice(user1.debts.findIndex(function(element) {return element === investmentId}), 1)
  };

  const updateInfo = await userCollection.updateOne({_id: id}, {$set: updatedUser});
  if (updateInfo.modifiedCount === 0) {
    throw "could not update dog successfully";
  }

  return await this.getUserById(id);

  /*try {
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
  }*/
}