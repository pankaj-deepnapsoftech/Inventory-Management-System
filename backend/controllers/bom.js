const BOM = require("../models/bom");
const BOMFinishedMaterial = require("../models/bom-finished-material");
const BOMRawMaterial = require("../models/bom-raw-material");
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
    total_cost === undefined ||
    total_cost === undefined
  ) {
    throw new ErrorHandler("Please provide all the fields", 400);
  }
  if (isNaN(parts_count) || isNaN(total_cost)) {
    throw new ErrorHandler("Part's count and Total cost must be a number", 400);
  }

  const bom_raw_materials = await Promise.all(
    raw_materials.map(async (material) => {
      const createdMaterial = await BOMRawMaterial.create({
        ...material,
      });
      return createdMaterial._id;
    })
  );

  const {
    item_id,
    item_name,
    description,
    quantity,
    uom,
    image,
    category,
    supporting_doc,
    comments,
    cost,
  } = finished_good;
  const createdFinishedGood = await BOMFinishedMaterial.create({
    item_id,
    item_name,
    description,
    quantity,
    uom,
    image,
    category,
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
  } = req.body;
  if (!id) {
    throw new ErrorHandler("id not provided", 400);
  }
  const bom = await BOM.findById(id);
  if (!bom) {
    throw new ErrorHandler("BOM not found", 400);
  }

  if (finished_good) {
    await BOMFinishedMaterial.findOneAndUpdate(
      { _id: bom.finished_good },
      { ...finished_good }
    );
  }

  if (raw_materials) {
    await Promise.all(
      raw_materials.map(async (material) => {
        console.log("***************", material);
        const existingMaterial = await BOMRawMaterial.findOne({
          item_id: material.item_id,
        });
        if (existingMaterial) {
          existingMaterial.set({ ...material });
          await existingMaterial.save();
        } else {
          const newMaterial = await BOMRawMaterial.create({ ...material });
          bom.raw_materials.push(newMaterial._id);
        }
      })
    );
  }

  (bom_name && bom_name.trim().length > 0) && (bom.bom_name = bom_name);
  (parts_count && parts_count > 0) && (bom.parts_count = parts_count);
  (total_cost) && (bom.total_cost = total_cost);
  if (approved && req.user.isSuper) {
    bom.approved_by = req.user._id;
    bom.approved = true;
  }
  bom.approval_date = await bom.save();

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
    .populate("finished_good")
    .populate({
      path: "raw_materials",
      populate: {
        path: "supplier",
      },
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
  const boms = await BOM.find({ approved: true }).populate(
    "finished_good raw_materials approved_by"
  ).sort({'updatedAt': -1});
  res.status(200).json({
    status: 200,
    success: true,
    boms,
  });
});
exports.unapproved = TryCatch(async (req, res) => {
  const boms = await BOM.find({ approved: false }).populate(
    "finished_good raw_materials"
  ).sort({'updatedAt': -1});
  res.status(200).json({
    status: 200,
    success: true,
    boms,
  });
});