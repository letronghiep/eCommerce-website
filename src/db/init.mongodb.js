"use strict";

const mongoose = require("mongoose");
const { countConnect } = require("../helpers/check.connect");
const {
  db: { name, password },
} = require("../configs/config.db");

const connectString =  `mongodb+srv://Cluster09279:${password}@cluster09279.0xtxlqi.mongodb.net/${name}`
console.log(connectString);
class Database {
  constructor() {
    this.connect();
  }
  // connect
  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString, {
        maxPoolSize: 50,
      })
      .then((_) => {
        console.log(`Connected to Mongodb`, countConnect());
      })
      .catch((err) => {
        console.log("error connecting to Mongodb");
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
const instanceMongoDb = Database.getInstance();
module.exports = instanceMongoDb;
