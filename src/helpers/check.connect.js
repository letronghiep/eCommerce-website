"use strict";
const os = require("os");
const process = require("process");
const mongoose = require("mongoose");

// CONSTANT
const _SECOND = 5000;

// count connect
const countConnect = () => {
  const numConnection = mongoose.Collection.length;
  return numConnection;
};
// check overload

const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connection.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;
    // Example maximum number of connections based on number of cores
    const maxConnections = numCores * 5;
    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnections) {
      console.log(`Connection is overloaded`);
    }
  }, _SECOND); // Monitor every 5 seconds
};
module.exports = {
  countConnect,
  checkOverLoad,
};
