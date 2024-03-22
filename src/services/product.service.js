"use strict";
const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");

class ProductFactory {
  static async createProduct(type, payload) {
    switch (type) {
      case "Clothing":
        return new Clothing(payload).createProduct();
      case "Electronic":
        return new Electronic(payload).createProduct();
      default:
        throw new BadRequestError(`Invalid product Types: ${type}`);
    }
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    (this.product_name = product_name),
      (this.product_thumb = product_thumb),
      (this.product_description = product_description),
      (this.product_price = product_price),
      (this.product_quantity = product_quantity),
      (this.product_type = product_type),
      (this.product_shop = product_shop),
      (this.product_attributes = product_attributes);
  }
  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}
// Define sub-class for different product type = clothing
class Clothing extends Product {
  async createProduct() {
    try {
      const newClothing = await clothing.create({
        ...this.product_attributes,
        product_shop: this.product_shop,
      });
      if (!newClothing) throw new BadRequestError("Create new Clothing error");
      const newProduct = await super.createProduct(newClothing._id);
      if (!newProduct) throw new BadRequestError("Create new Product error");
      return newProduct;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }
}
// Define sub-class for different product type = clothing
class Electronic extends Product {
  async createProduct() {
    try {
      const newElectronic = await electronic.create({
        ...this.product_attributes,
        product_shop: this.product_shop,
      });
      console.log("New Product::->", this.product_attributes);
      if (!newElectronic)
        throw new BadRequestError("Create new Electronic error");
      const newProduct = await super.createProduct(newElectronic._id);
      if (!newProduct) throw new BadRequestError("Create new Product error");
      return newProduct;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  }
}
module.exports = ProductFactory;
