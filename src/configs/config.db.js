// level 0
// const config = {
//   app: {
//     port: 3000,
//   },
//   db: {
//     name: "eCommerce-shop",
//     password: "letronghiep1",
//   },
// };
// level 01
const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3000,
  },
  db: {
    name: process.env.DEV_DB_NAME || "shopDev",
    password: process.env.DEV_APP_PASSWORD || "letronghiep1",
  },
};
const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    name: process.env.PRO_DB_NAME || "shopPro",
    password: process.env.PRO_APP_PASSWORD || "letronghiep1",
  },
};
const config = { dev, pro };
const env = process.env.NODE_ENV || "dev";
module.exports = config[env];
