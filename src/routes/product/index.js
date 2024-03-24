"use strict";
const express = require("express");
const productController = require("../../controllers/product.controller");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();
router.get("", asyncHandler(productController.findAllProducts));
router.get("/:id", asyncHandler(productController.findProduct));
router.get(
  "/search/:keySearch",
  asyncHandler(productController.searchProductByUser)
);
router.use(authenticationV2);
// ////
router.post("", asyncHandler(productController.createProduct));
router.post(
  "/published/:id",
  asyncHandler(productController.publishedAProductInDraft)
);
router.post(
  "/unPublished/:id",
  asyncHandler(productController.unPublishedAProductInDraft)
);
// PUt
router.patch("/:productId", productController.updateProduct);
// get
router.get("/draft", asyncHandler(productController.findAllProductDraftInShop));
router.get(
  "/published",
  asyncHandler(productController.findAllProductPublished)
);
module.exports = router;
