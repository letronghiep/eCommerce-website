"use strict";

const { BadRequestError } = require("../core/error.response");
const { product, clothing, electronic } = require("../models/product.model");
const {
  findAllProductInDraft,
  publishedProductInDraft,
  unPublishedProduct,
  findAllProductInPublished,
  getProductBySearch,
  findAllProduct,
  findProduct,
  updateProductById,
} = require("../models/repositories/product.repo");

class ProductFactory {
  static registryProduct = {};
  static registerProductType(type, classRef) {
    ProductFactory.registryProduct[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.registryProduct[type];
    if (!productClass)
      throw new BadRequestError("Invalid Product type : ", type);
    return new productClass(payload).createProduct();
  }
  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.registryProduct[type];
    if (!productClass)
      throw new BadRequestError("Invalid Product type : ", type);
    return new productClass(payload).updateProduct(productId);
  }
  /**
   * @param { Number} skip
   *  @param {Number} limit
   * @returns {JSON}
   * * */
  // QUERY
  static async getAllProductInDraft({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await findAllProductInDraft({ query, limit, skip });
  }
  static async publishedAProductInDraft({ product_shop, product_id }) {
    return await publishedProductInDraft({ product_shop, product_id });
  }
  static async unPublishedAProductInDraft({ product_shop, product_id }) {
    return await unPublishedProduct({ product_shop, product_id });
  }
  static async getAllProductPublished({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await findAllProductInPublished({ query, limit, skip });
  }
  static async findAllProduct({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await findAllProduct({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }
  static async getSearchProduct({ keySearch }) {
    return getProductBySearch({ keySearch });
  }
  static async findProduct({ product_id }) {
    return findProduct({ product_id, unSelect: ["__v"] });
  }
  // END QUERY
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
  async updateProduct(productId, payload) {
    return await updateProductById({ productId, payload, model: product });
  }
}
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

  async updateProduct(productId) {
    // 1. remove attributes has null undefined
    const objParams = this;
    if (objParams.product_attributes) {
      // Update product by id
      await updateProductById({ productId, objParams, model: clothing });
    }
    const updateProduct = await super.updateProduct(productId, objParams);
    return updateProduct;
  }
}
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);

module.exports = ProductFactory;
