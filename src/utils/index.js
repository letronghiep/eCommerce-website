"use strict";
const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};
const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};
const removeUndefinedObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null || obj[k] === undefined) {
      delete obj[k];
    }
  });
  return obj;
};
// const updateNestedObj = (obj) => {
//   const final = {};
//   Object.keys(obj).forEach((k) => {
//     if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
//       const response = updateNestedObj(obj[k]);
//       Object.keys(response).forEach((a) => {
//         final[`${k}.${a}`] = response[a];
//       });
//     } else {
//       final[k] = obj[k];
//     }
//   });
//   return final;
// };
const updateNestedObj = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObj(obj[k]);
      Object.keys(response).forEach((a) => {
        final[`${k}.${a}`] = response[a];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};
module.exports = {
  getInfoData,
  getSelectData,
  getUnSelectData,
  removeUndefinedObject,
  updateNestedObj,
};
