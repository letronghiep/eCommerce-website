"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");
// const productService = new ProductService();

class ProductController {
  createProduct = async (req, res, next) => {
    console.log("req body", req.body);
    new CREATED({
      message: "Product created successfully",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
