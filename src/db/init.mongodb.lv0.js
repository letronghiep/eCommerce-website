"use strict";

const mongoose = require("mongoose");
const connectString =
  "mongodb+srv://Cluster09279:letronghiep1@cluster09279.0xtxlqi.mongodb.net/eCommerce-shop";
mongoose
  .connect(connectString)
  .then((_) => {
    console.log(`Connected to Mongodb`);
  })
  .catch((err) => {
    console.log("error connecting to Mongodb");
  });
// dev

if (1 === 1) {
  mongoose.set("debug", true);
  mongoose.set("debug", { color: true });
}

module.exports = mongoose;
