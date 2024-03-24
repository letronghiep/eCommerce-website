const { Types } = require("mongoose");
const { product, clothing, electronic } = require("../product.model");
const { getSelectData, getUnSelectData } = require("../../utils");
async function findAllProductInDraft({ query, limit, skip }) {
  return queryProducts({ query, limit, skip });
}
async function publishedProductInDraft({ product_shop, product_id }) {
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublished = true;
  // const { modifiedCount } = await product.updateMany(foundShop);
  const { modifiedCount } = await product.findByIdAndUpdate(
    product_id,
    foundShop,
    { new: true }
  );
  return modifiedCount;
}

async function unPublishedProduct({ product_shop, product_id }) {
  console.log("product_shop::", product_shop);
  const foundShop = await product.findOne({
    product_shop: new Types.ObjectId(product_shop),
    _id: new Types.ObjectId(product_id),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublished = false;
  const { modifiedCount } = await product.findByIdAndUpdate(
    product_id,
    foundShop,
    { new: true }
  );
  console.log("modifiedCount::", modifiedCount);
  return modifiedCount;
}

async function findAllProductInPublished({ query, limit, skip }) {
  return queryProducts({ query, limit, skip });
}
async function getProductBySearch({ keySearch }) {
  const searchRex = new RegExp(keySearch);
  const result = await product
    .find(
      {
        $text: { $search: searchRex },
        isDraft: false,
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();
  return result;
}
// query product
async function queryProducts({ query, limit, skip }) {
  return await product
    .find(query)
    .populate("product_shop", "email name -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
}
async function findAllProduct({ limit, sort, page, filter, select }) {
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const skip = (page - 1) * limit;
  return await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();
}
async function findProduct({ product_id, unSelect }) {
  return await product.findById(product_id).select(getUnSelectData(unSelect));
}

// Update product by id
async function updateProductById({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
}

module.exports = {
  findAllProductInDraft,
  findAllProduct,
  publishedProductInDraft,
  unPublishedProduct,
  findAllProductInPublished,
  getProductBySearch,
  findProduct,
  updateProductById,
};
