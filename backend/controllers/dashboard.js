const User = require("../models/user");
const Agent = require("../models/agent");
const BOM = require("../models/bom");
const BOMFinishedMaterial = require("../models/bom-finished-material");
const Product = require("../models/product");
const Store = require("../models/store");
const { TryCatch } = require("../utils/error");

exports.summary = TryCatch(async (req, res) => {
  // Products Summary
  const products = await Product.aggregate([
    {
      $project: {
        product_id: 1,
        name: 1,
        current_stock: 1,
        min_stock: 1,
        max_stock: 1,
        price: 1,
        approved: 1,
      },
    },
    {
      $match: {
        approved: true,
      },
    },
    {
      $group: {
        _id: null,
        total_low_stock: {
          $sum: {
            $cond: [{ $lt: ["$current_stock", "$min_stock"] }, 1, 0],
          },
        },
        total_excess_stock: {
          $sum: {
            $cond: [{ $gt: ["$current_stock", "$max_stock"] }, 1, 0],
          },
        },
        total_product_count: {
          $sum: 1,
        },
        total_stock_price: {
          $sum: {
            $multiply: ["$price", "$current_stock"],
          },
        },
      },
    },
  ]);

  // Stores Summary
  const storeCount = await Store.find({ approved: true }).countDocuments();

  // BOM Summary
  const bomCount = await BOM.find({ approved: true }).countDocuments();

  // Merchant Summary
  const merchants = await Agent.aggregate([
    {
      $project: {
        agent_type: 1,
        approved: 1,
      },
    },
    {
      $match: {
        approved: true,
      },
    },
    {
      $group: {
        _id: null,
        total_supplier_count: {
          $sum: {
            $cond: [{ $eq: ["$agent_type", "supplier"] }, 1, 0],
          },
        },
        total_buyer_count: {
          $sum: {
            $cond: [{ $eq: ["$agent_type", "buyer"] }, 1, 0],
          },
        },
      },
    },
  ]);

  // Approval Summary
  const unapprovedProducts = await Product.find({
    approved: false,
  }).countDocuments();
  const unapprovedStores = await Store.find({
    approved: false,
  }).countDocuments();
  const unapprovedMerchants = await Agent.find({
    approved: false,
  }).countDocuments();
  const unapprovedBoms = await BOM.find({ approved: false }).countDocuments();

  // Employee Summary
  const employees = await User.aggregate([
    {
      $lookup: {
        from: "user-roles",
        localField: "role",
        foreignField: "_id",
        as: "role_details",
      },
    },
    {
      $unwind: "$role_details",
    },
    {
      $project: {
        role_details: 1,
        isVerified: 1,
      },
    },
    {
      $match: {
        isVerified: true,
      },
    },
    {
      $group: {
        _id: "$role_details.role",
        total_employee_count: {
            $sum: 1
        }
      },
    },
  ]);

  res.status(200).json({
    status: 200,
    success: true,
    products: products[0],
    stores: {
      total_store_count: storeCount,
    },
    boms: {
      total_bom_count: bomCount,
    },
    merchants: merchants[0],
    approvals_pending: {
      unapproved_product_count: unapprovedProducts,
      unapproved_store_count: unapprovedStores,
      unapproved_merchant_count: unapprovedMerchants,
      unapproved_bom_count: unapprovedBoms,
    },
    employees,
  });
});
