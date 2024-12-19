const ProductionProcess = require("../models/productionProcess");
const BOM = require("../models/bom");
const Product = require("../models/product");
const { TryCatch, ErrorHandler } = require("../utils/error");

exports.create = TryCatch(async (req, res) => {
  const processData = req.body;
  if (!processData) {
    throw new ErrorHandler("Please provide all the fields", 400);
  }

  // console.log(processData)

  const bom = await BOM.findById(processData.bom)
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
    throw new ErrorHandler("BOM doesn't exist", 400);
  }

  const finished_good = {
    item: bom.finished_good.item._id,
    estimated_quantity: bom.finished_good.quantity,
  };

  const processes = bom.processes.map((process) => ({
    process: process,
  }));

  const raw_materials = bom.raw_materials.map((material) => ({
    item: material.item._id,
    estimated_quantity: material.quantity,
  }));

  const productionProcess = await ProductionProcess.create({
    ...processData,
    finished_good,
    processes,
    raw_materials,
    creator: req.user._id,
    approved: req.user.isSuper || false,
  });

  res.status(200).json({
    status: 200,
    success: true,
    message: "Process has been created successfully",
  });
});
exports.update = async (req, res) => {
  const { _id, status, bom } = req.body;
  const productionProcess = await ProductionProcess.findById(_id);

  if (!productionProcess) {
    throw new ErrorHandler("Production Process doesn't exist", 400);
  }

  // ADJUST INVENTORY STOCK
  if (status === "work in progress") {
    // FOR FINISHED GOOD
    const prevFinishedGood = productionProcess.finished_good;
    const currFinishedGood = bom.finished_good;

    const finishedGood = await Product.findById(
      productionProcess.finished_good.item
    );

    if (
      prevFinishedGood.produced_quantity < currFinishedGood.produced_quantity
    ) {
      const change =
        currFinishedGood.produced_quantity - prevFinishedGood.produced_quantity;
      productionProcess.finished_good.produced_quantity += change;
      finishedGood.current_stock += change;
    } else if (
      prevFinishedGood.produced_quantity > currFinishedGood.produced_quantity
    ) {
      const change =
        prevFinishedGood.produced_quantity - currFinishedGood.produced_quantity;
      productionProcess.finished_good.produced_quantity -= change;
      finishedGood.current_stock -= change;
    }

    await finishedGood.save();




    // FOR RAW MATERIALS
    const prevRawMaterials = productionProcess.raw_materials;
    const currRawMaterials = bom.raw_materials;

    await Promise.all(prevRawMaterials.map(async prevRm => {
      const id = prevRm.item;
      const rawMaterial = await Product.findById(id);
      const currRm = currRawMaterials.find(item => item.item.toString() === prevRm.item.toString());

      if (prevRm.used_quantity < currRm.used_quantity) {
        const change = currRm.used_quantity - prevRm.used_quantity;
        prevRm.used_quantity += change;
        rawMaterial.current_stock -= change;
      } else if (prevRm.used_quantity > currRm.used_quantity) {
        const change = prevRm.used_quantity - currRm.used_quantity;
        prevRm.used_quantity -= change;
        rawMaterial.current_stock += change;
      }

      return await rawMaterial.save();
    }))
  }

  productionProcess.status = status;
  productionProcess.processes.forEach((p) => {
    const process = bom.processes.find(
      (pr) => pr._id.toString() === p._id.toString()
    );
    p.done = process.done;
  });
  await productionProcess.save();

  res.status(200).json({
    status: 200,
    success: true,
    message: "Production process has been updated successfully",
  });
};
exports.remove = TryCatch(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new ErrorHandler("Id not provided", 400);
  }

  const productionProcess = await ProductionProcess.findById(_id);
  if (!productionProcess) {
    throw new ErrorHandler("Production process doesn't exist", 400);
  }

  await productionProcess.deleteOne();

  res.status(200).json({
    status: 200,
    success: true,
    message: "Production process has been deleted successfully",
  });
});
exports.details = TryCatch(async (req, res) => {
  const { _id } = req.params;
  let productionProcess = await ProductionProcess.findById(_id)
    .populate("rm_store fg_store scrap_store creator item")
    .populate([
      {
        path: "finished_good",
        populate: {
          path: "item",
        },
      },
      {
        path: "raw_materials",
        populate: {
          path: "item",
          populate: {
            path: "store",
          },
        },
      },
    ])
    .populate({
      path: "bom",
      populate: [
        {
          path: "creator",
        },
        {
          path: "finished_good",
          populate: {
            path: "item",
          },
        },
        {
          path: "raw_materials",
          populate: {
            path: "item",
            populate: {
              path: "store",
            },
          },
        },
      ],
    });

  if (!_id) {
    throw new ErrorHandler("Production Process doesn't exist", 400);
  }

  res.status(200).json({
    status: 200,
    success: true,
    production_process: productionProcess,
  });
});
exports.all = TryCatch(async (req, res) => {
  const productionProcesses = await ProductionProcess.find().populate(
    "rm_store fg_store scrap_store creator item bom"
  );

  res.status(200).json({
    status: 200,
    success: true,
    production_processes: productionProcesses,
  });
});
exports.markDone = TryCatch(async (req, res) => {
  const { _id } = req.params;
  if (!_id) {
    throw new ErrorHandler("Id not provided", 400);
  }
  const productionProcess = await ProductionProcess.findById(_id);
  if (!productionProcess) {
    throw new ErrorHandler("Production process doesn't exist", 400);
  }

  productionProcess.status = "completed";
  await productionProcess.save();

  res.status(200).json({
    status: 200,
    success: true,
    message: "Production process has been marked done successfully",
  });
});
