"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");

// shop
const { findByEmail } = require("./shop.service");

const SHOP_ROLES = {
  ADMIN: "admin",
  WRITER: "writer",
  EDITOR: "editor",
  SHOP: "shop",
};
class AccessService {
  /**
   * check email in dbs
   * match password
   * create accessToken and refreshToken
   * generateToken
   * get data and return login
   * **/
  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyStoreById(keyStore._id);
    console.log(delKey);
    return delKey;
  };

  static login = async ({ email, password, refreshToken = null }) => {
    //  1. check email in dbs
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Email not found");
    // 2. match password
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Password not match");
    // 3.Create accesstoken and refreshToken
    const publicKey = await crypto.randomBytes(64).toString("hex");
    const privateKey = await crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;
    const tokens = await createTokenPair(
      { userId, email },
      publicKey,
      privateKey
    );
    const data = await KeyTokenService.createKeyToken({
      userId,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });
    console.log("Key token created", data);
    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  };

  static signUp = async ({ name, email, password }) => {
    // check email exists
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestError("Error: Shop is already registered");
    }
    const passwordHashed = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHashed,
      roles: [SHOP_ROLES.SHOP],
    });
    console.log("::Shop::", newShop);
    if (newShop) {
      // Create private key and public key
      // const { privateKey, publicKey } = await crypto.generateKeyPairSync(
      //   "rsa",
      //   {
      //     modulusLength: 4096,
      //     publicKeyEncoding: {
      //       type: "pkcs1",
      //       format: "pem",
      //     },
      //     privateKeyEncoding: {
      //       type: "pkcs1",
      //       format: "pem",
      //     },
      //   }
      // );
      const publicKey = await crypto.randomBytes(64).toString("hex");
      const privateKey = await crypto.randomBytes(64).toString("hex");

      // console.log({ privateKey, publicKey }); // save to KeyModel
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });
      if (!keyStore) {
        throw new BadRequestError("Error: keyStore undefined");
      }
      // created token pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );
      console.log("Created tokens::", tokens); // save to KeyModel
      return {
        code: 201,
        metadata: {
          shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: newShop,
          }),
          tokens,
        },
      };
    }
    return {
      code: 200,
      metadata: null,
    };
  };
  // handle refreshToken
  // static handleRefreshToken = async (refreshToken) => {
  //   // check Token is used ?
  //   const foundToken = await KeyTokenService.findByRefreshTokenUsed(
  //     refreshToken
  //   );
  //   if (foundToken) {
  //     // verify userId and check in db exists
  //     const { userId, email } = await verifyJWT(
  //       refreshToken,
  //       foundToken.privateKey
  //     );
  //     console.log({ userId, email });
  //     // Xoa tat ca token trong keyStore
  //     await KeyTokenService.deleteKeyById(userId);
  //     console.log("Xoa roi");
  //     throw new ForbiddenError("Something went wrong|| Pls re-login");
  //   }
  //   // refreshToken is not used
  //   const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
  //   if (!holderToken) throw new AuthFailureError("Shop not found");
  //   // verify token
  //   const { userId, email } = await verifyJWT(
  //     refreshToken,
  //     holderToken.privateKey
  //   );
  //   console.log("[2]---", { userId, email });
  //   const tokens = await createTokenPair(
  //     { userId, email },
  //     holderToken.publicKey,
  //     holderToken.privateKey
  //   );
  //   // Update token
  //   await holderToken.updateOne({
  //     $set: {
  //       refreshToken: tokens.refreshToken,
  //     },
  //     $addToSet: {
  //       refreshTokensUsed: refreshToken, // refreshToken is used
  //     },
  //   });
  //   return {
  //     user: { userId, email },
  //     tokens,
  //   };
  // };
  static handleRefreshTokenV2 = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError(
        "Something went wrong happend!! Pls login again"
      );
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop is not register");
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registered");
    // check Token is used ?
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );
    // Update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken, // refreshToken is used
      },
    });
    return {
      user,
      tokens,
    };
  };
}
module.exports = AccessService;
