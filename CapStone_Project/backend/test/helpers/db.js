const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Role = require('../../models/Role');

let mongod;

const connect = async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
};

const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};

const seedRoles = async () => {
  await Role.create([
    { roleName: 'user' },
    { roleName: 'admin' },
  ]);
};

const disconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
};

module.exports = { connect, clearDatabase, disconnect, seedRoles };