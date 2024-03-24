"use strict";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const HEADER = {
  API_KEY: "x-api-key",
  ClIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-rtoken-id",
};
const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, publicKey, (err, decode) => {
      if (err) {
        console.error(err);
      } else {
        console.log(`decode verify: `, decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {}
};
// const authentication = asyncHandler(async (req, res, next) => {
//   /**
//    * - Check userId missing??
//    * get accessToken
//    * verifyToken
//    * check user in db
//    * check keyStore with userId
//    * Ok all => return next()
//    *  */
//   // 1.
//   const userId = req.headers[HEADER.ClIENT_ID];
//   if (!userId) throw new AuthFailureError("Invalid Request");
//   // 2.
//   const keyStore = await KeyTokenService.findByUserId(userId);
//   if (!keyStore) throw new NotFoundError("Not found key store");
//   // 3.
//   const accessToken = req.headers[HEADER.AUTHORIZATION];
//   if (!accessToken) throw new AuthFailureError("Invalid Request");

//   try {
//     console.log("====================================");
//     console.log("keyStr::", accessToken);
//     console.log("====================================");
//     const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
//     console.log("decode úe", decodeUser);
//     if (userId !== decodeUser.userId)
//       throw new AuthFailureError("Invalid User id");
//     req.keyStore = keyStore;
//     req.user = decodeUser;
//     return next();
//   } catch (error) {
//     throw error;
//   }
// });

// v2
const authenticationV2 = asyncHandler(async (req, res, next) => {
  /**
   * - Check userId missing??
   * get accessToken
   * verifyToken
   * check user in db
   * check keyStore with userId
   * Ok all => return next()
   *  */
  // 1.
  const userId = req.headers[HEADER.ClIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");
  // 2.
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found key store");
  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];

      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      console.log("decode úe", decodeUser);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid User id");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      console.log("req.user", req.keyStore);
      return next();
    } catch (error) {
      throw error;
    }
  }
  // 3.
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid Request");
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = {
  createTokenPair,
  authenticationV2,
  verifyJWT,
};
