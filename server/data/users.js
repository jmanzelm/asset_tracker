const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuidv4 = require("uuid/v4");

function ModuleA() {

}

module.exports = ModuleA;

const cash = require("./cash");

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
    throw "Please provide a single username.";
  }
  if (typeof name !== "string") {
    throw "The name must be a string.";
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
      date: Math.round((new Date()).getTime() / 1000)
    };
    const insertInfo = await userCollection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) throw "Could not add user";
    await cash.addCash(newUser._id, startingCash) // add a new cash object

    const newId = insertInfo.insertedId;
    const temp =  await this.getUserById(newId);
    return temp;
  }
  catch(error) {
    throw error;
  }
}