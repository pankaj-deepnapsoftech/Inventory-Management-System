const { default: mongoose } = require("mongoose");
const BOM = require("../models/bom");
const BOMFinishedMaterial = require("../models/bom-finished-material");
const BOMRawMaterial = require("../models/bom-raw-material");
const Product = require("../models/product");
const { TryCatch, ErrorHandler } = require("../utils/error");

exports.create = TryCatch(async (req, res) => {
  const {
    raw_materials,
    processes,
    finished_good,
    approved_by,
    approval_date,
    bom_name,
    parts_count,
    total_cost,
  } = req.body;

  if (
    !raw_materials ||
    raw_materials.length === 0 ||
    !finished_good ||
    !bom_name ||
    bom_name.trim().length === 0 ||
    total_cost === undefined
  ) {
    throw new ErrorHandler("Please provide all the fields", 400);
  }
  if (isNaN(parts_count) || isNaN(total_cost)) {
    throw new ErrorHandler("Part's count and Total cost must be a number", 400);
  }

  const isBomFinishedGoodExists = await Product.findById(finished_good.item);
  if (!isBomFinishedGoodExists) {
    throw new ErrorHandler("Finished good doesn't exist", 400);
  }
  if (finished_good.quantity < 0) {
    throw new ErrorHandler(`Negative quantities are not allowed`, 400);
  }

  await Promise.all(
    raw_materials.map(async (material) => {
      const isProdExists = await Product.findById(material.item);
      if (!isProdExists) {
        throw new ErrorHandler(`Raw material doesn't exist`, 400);
      }
      if (material.quantity < 0) {
        throw new ErrorHandler(`Negative quantities are not allowed`, 400);
      }
      if (isProdExists.current_stock < material.quantity) {
        throw new ErrorHandler(
          `Insufficient stock of ${isProdExists.name}`,
          400
        );
      }
    })
  );

  const bom_raw_materials = await Promise.all(
    raw_materials.map(async (material) => {
      const isExistingMaterial = await Product.findById(material.item);
      // if(!isExistingMaterial){
      //   throw new ErrorHandler("Raw material doesn't exist", 400);
      // }
      // if(isExistingMaterial.current_stock < material.quantity){
      //   throw new ErrorHandler(`Insufficient stock for ${isExistingMaterial.name}`, 400);
      // }

      // isExistingMaterial.current_stock -= material.quantity;
      // await isExistingMaterial.save();

      const createdMaterial = await BOMRawMaterial.create({
        ...material,
      });
      return createdMaterial._id;
    })
  );

  const { item, description, quantity, image, supporting_doc, comments, cost } =
    finished_good;
  // const isProdExists = await Product.findById(item);
  // if(!isProdExists){
  //   throw new ErrorHandler("Product selected for finished good doesn't exist", 400);
  // }
  // isProdExists.current_stock += quantity;
  // await isProdExists.save();
  const createdFinishedGood = await BOMFinishedMaterial.create({
    item,
    description,
    quantity,
    image,
    supporting_doc,
    comments,
    cost,
  });

  const bom = await BOM.create({
    raw_materials: bom_raw_materials,
    processes,
    finished_good: createdFinishedGood._id,
    approved_by,
    approval_date,
    bom_name,
    parts_count,
    total_cost,
    approved: req.user.isSuper,
    creator: req.user._id
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: "BOM has been created successfully",
    bom,
  });
});
exports.update = TryCatch(async (req, res) => {
  const { id } = req.params;
  const {
    approved,
    raw_materials,
    finished_good,
    bom_name,
    parts_count,
    total_cost,
    processes,
  } = req.body;
  if (!id) {
    throw new ErrorHandler("id not provided", 400);
  }
  const bom = await BOM.findById(id)
    .populate("approved_by")
    .populate({
      path: "finished_good",
      populate: [
        {
          path: "item",
        },
      ],
    })
    .populate({
      path: "raw_materials",
      populate: [
        {
          path: "item",
        },
      ],
    });
  if (!bom) {
    throw new ErrorHandler("BOM not found", 400);
  }

  if (finished_good) {
    const isBomFinishedGoodExists = await Product.findById(finished_good.item);
    if (!isBomFinishedGoodExists) {
      throw new ErrorHandler("Finished good doesn't exist", 400);
    }
    if (finished_good.quantity < 0) {
      throw new ErrorHandler(`Negative quantities are not allowed`, 400);
    }
  }

  if (raw_materials) {
    await Promise.all(
      raw_materials.map(async (material) => {
        const isRawMaterialExists = await BOMRawMaterial.findById(material._id);
        if (!isRawMaterialExists) {
          throw new ErrorHandler(`Raw material doesn't exist`, 400);
        }
        const isProdExists = await Product.findById(material.item);
        if (!isProdExists) {
          throw new ErrorHandler(`Product doesn't exist`, 400);
        }
        if (material.quantity < 0) {
          throw new ErrorHandler(`Negative quantities are not allowed`, 400);
        }
        if (
          isRawMaterialExists.quantity.toString() !==
          material.quantity.toString() &&
          isProdExists.current_stock < material.quantity
        ) {
          throw new ErrorHandler(
            `Insufficient stock of ${isProdExists.name}`,
            400
          );
        }
      })
    );
  }

  if (finished_good) {
    const isProdExists = await Product.findById(finished_good.item);
    // if(!isProdExists){
    //   throw new ErrorHandler("Product selected for Finished Good doesn't exist", 400);
    // }
    if (finished_good.item !== bom.finished_good.item._id.toString()) {
      bom.finished_good.item = finished_good.item;
    }

    const quantityDifference =
      finished_good.quantity - bom.finished_good.quantity;

    if (bom.finished_good.quantity > finished_good.quantity) {
      bom.finished_good.quantity = finished_good.quantity;
      isProdExists.current_stock += quantityDifference;
    } else if (bom.finished_good.quantity < finished_good.quantity) {
      bom.finished_good.quantity = finished_good.quantity;
      isProdExists.current_stock -= quantityDifference;
    }

    await isProdExists.save();

    bom.finished_good.cost = finished_good.cost;
    // bom.finished_good.quantity = finished_good.quantity;
    bom.finished_good.comments = finished_good?.comments;
    bom.finished_good.description = finished_good?.description;
    bom.finished_good.supporting_doc = finished_good?.supporting_doc;
  }

  if (raw_materials) {
    await Promise.all(
      raw_materials.map(async (material) => {
        try {
          const isExistingRawMaterial = await BOMRawMaterial.findById(material._id);
          const isProdExists = await Product.findById(material.item);

          if (!isProdExists) {
            throw new Error(`Product with ID ${material.item} does not exist.`);
          }

          if (isExistingRawMaterial) {
            if (isExistingRawMaterial.item.toString() !== material.item) {
              isExistingRawMaterial.item = material.item;
            }

            isExistingRawMaterial.description = material?.description;

            if (isExistingRawMaterial.quantity.toString() !== material?.quantity?.toString()) {
              const quantityDifference = material.quantity - isExistingRawMaterial.quantity;
              if (quantityDifference > 0) {
                isProdExists.current_stock -= quantityDifference;
                isExistingRawMaterial.quantity = material.quantity;
              } else {
                isProdExists.current_stock += Math.abs(quantityDifference);
                isExistingRawMaterial.quantity = material.quantity;
              }
            }

            isExistingRawMaterial.assembly_phase = material?.assembly_phase;
            isExistingRawMaterial.supporting_doc = material?.supporting_doc;
            isExistingRawMaterial.comments = material?.comments;
            isExistingRawMaterial.total_part_cost = material?.total_part_cost;

            await isExistingRawMaterial.save();
          } else {
            const newRawMaterial = await BOMRawMaterial.create({ ...material });
            isProdExists.current_stock -= newRawMaterial.quantity;
            await isProdExists.save();
            bom.raw_materials.push(newRawMaterial._id);
          }
        } catch (error) {
          console.error(`Error processing raw material ${material._id}:`, error);
        }
      })
    );
  }


  if (processes && processes.length > 0) {
    bom.processes = processes;
  }

  bom_name && bom_name.trim().length > 0 && (bom.bom_name = bom_name);
  parts_count && parts_count > 0 && (bom.parts_count = parts_count);
  total_cost && (bom.total_cost = total_cost);
  if (approved && req.user.isSuper) {
    bom.approved_by = req.user._id;
    bom.approved = true;
  }

  await bom.finished_good.save();
  await bom.save();

  res.status(200).json({
    status: 200,
    success: true,
    message: "BOM has been updated successfully",
  });
});
exports.remove = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ErrorHandler("id not provided", 400);
  }
  const bom = await BOM.findById(id);
  if (!bom) {
    throw new ErrorHandler("BOM not found", 400);
  }

  const rawMaterials = bom.raw_materials.map((material) => material._id);
  const finishedGood = bom.finished_good._id;

  await BOMRawMaterial.deleteMany({ _id: { $in: rawMaterials } });
  await BOMFinishedMaterial.deleteOne({ _id: finishedGood });

  await bom.deleteOne();
  res.status(200).json({
    status: 200,
    success: true,
    message: "BOM has been deleted successfully",
    bom,
  });
});
exports.details = TryCatch(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ErrorHandler("id not provided", 400);
  }
  const bom = await BOM.findById(id)
    .populate("approved_by")
    .populate({
      path: "finished_good",
      populate: { path: "item" },
    })
    .populate({
      path: "raw_materials",
      populate: [
        {
          path: "item",
        },
      ],
    });

  if (!bom) {
    throw new ErrorHandler("BOM not found", 400);
  }
  res.status(200).json({
    status: 200,
    success: true,
    bom,
  });
});
exports.all = TryCatch(async (req, res) => {
  const boms = await BOM.find({ approved: true })
    .populate("approved_by")
    .populate({
      path: "finished_good",
      populate: [
        {
          path: "item",
        },
      ],
    })
    .populate({
      path: "raw_materials",
      populate: [
        {
          path: "item",
        },
      ],
    })
    .sort({ updatedAt: -1 });
  res.status(200).json({
    status: 200,
    success: true,
    boms,
  });
});
exports.unapproved = TryCatch(async (req, res) => {
  const boms = await BOM.find({ approved: false })
    .populate("approved_by")
    .populate({
      path: "finished_good",
      populate: [
        {
          path: "item",
        },
      ],
    })
    .populate({
      path: "raw_materials",
      populate: [
        {
          path: "item",
        },
      ],
    })
    .sort({ updatedAt: -1 });
  res.status(200).json({
    status: 200,
    success: true,
    boms,
  });
});

exports.findFinishedGoodBom = TryCatch(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new ErrorHandler("Id not provided", 400);
  }

  // const boms = await BOM.find({'finished_good': {
  //   $elemMatch: {
  //     item: _id
  //   }}}).populate({
  //   path: "finished_good",
  //   populate: [
  //     {
  //       path: "item",
  //     },
  //   ],
  // });

  const allBoms = await BOM.find().populate('finished_good');
  // console.log(allBoms)
  const boms = allBoms.filter(bom => {
    return bom.finished_good.item.toString() === _id;
  });

  // console.log(boms)

  res.status(200).json({
    status: 200,
    success: true,
    boms: boms
  })
})