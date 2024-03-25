"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
// const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.strategy.service");
// const productService = new ProductService();

class ProductController {
  createProduct = async (req, res, next) => {
    console.log("req body", req.body);
    new CREATED({
      message: "Product created successfully",
      metadata: await ProductServiceV2.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  // Update product
  // updateProduct = async (req, res, next) => {
  //   new CREATED({
  //     message: "Update successful",
  //     metadata: await ProductServiceV2.updateProduct(
  //       req.body.product_type,
  //       req.params.productId,
  //       {
  //         ...req.body,
  //         product_shop: req.user.userId,
  //       }
  //     ),
  //   }).send(res);
  // };
  updateProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product updated successfully",
      metadata: await ProductServiceV2.updateProduct(
        req.body.product_type,
        req.params.productId,
        {
          ...req.body,
          product_shop: req.user.userId,
        }
      ),
    }).send(res);
    console.log("Product updated successfully1::", req.body);
  };
  findAllProductDraftInShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Find All ProductDraft Success",
      metadata: await ProductServiceV2.getAllProductInDraft({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  findAllProductPublished = async (req, res, next) => {
    new SuccessResponse({
      message: "Find All ProductPublished Success",
      metadata: await ProductServiceV2.getAllProductPublished({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  publishedAProductInDraft = async (req, res, next) => {
    new SuccessResponse({
      message: "Product is published",
      metadata: await ProductServiceV2.publishedAProductInDraft({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  unPublishedAProductInDraft = async (req, res, next) => {
    new SuccessResponse({
      message: "Product is Unpublished",
      metadata: await ProductServiceV2.unPublishedAProductInDraft({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
  searchProductByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "List search products",
      metadata: await ProductServiceV2.getSearchProduct(req.params),
    }).send(res);
  };
  findAllProducts = async (req, res, next) => {
    new SuccessResponse({
      message: "List search products",
      metadata: await ProductServiceV2.findAllProduct(req.query),
    }).send(res);
  };
  // find a Product
  findProduct = async (req, res, next) => {
    new SuccessResponse({
      message: "Product Details",
      metadata: await ProductServiceV2.findProduct({
        product_id: req.params.id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
