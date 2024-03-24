"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  handleRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Refresh successfully",
    //   metadata: await AccessService.handleRefreshToken(req.body.refreshToken),
    // v2
    new SuccessResponse({
      message: "Refresh successfully",
      metadata: await AccessService.handleRefreshTokenV2({
        keyStore: req.keyStore,
        user: req.user,
        refreshToken: req.refreshToken,
      }),
    }).send(res);
  };
  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };
  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Created successfully",
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };
}

module.exports = new AccessController();
