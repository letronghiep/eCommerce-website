"use strict";
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const SHOP_ROLES = {
  ADMIN: "admin",
  WRITER: "writer",
  EDITOR: "editor",
  SHOP: "shop",
};
class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // check email exists
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "Shop is registered!",
        };
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

        console.log({ privateKey, publicKey }); // save to KeyModel
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });
        if (!keyStore) {
          return {
            code: "xxxx",
            message: "keyStore error",
          };
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
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}
module.exports = AccessService;
