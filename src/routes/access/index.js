"use strict";
const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
//signup
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));
// Authentication accessToken
router.use(authenticationV2);
// ////
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post(
  "/shop/refreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
