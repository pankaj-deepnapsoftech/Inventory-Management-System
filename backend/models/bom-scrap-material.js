const { Schema, model } = require("mongoose");

const BOMScrapMaterialSchema = new Schema(
  {
    // production_process: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Production-Process",
    //   required: [true, "Production process is a required field"]
    // },
    bom: {
      type: Schema.Types.ObjectId,
      ref: "BOM",
      required: [true, "BOM is a required field"]
    },
    item: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is a required field']
    },
    // produced_quantity: {
    //   type: Number,
    //   default: 0,
    // },
    total_part_cost: {
      type: Number,
    },
    is_production_started: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const BOMScrapMaterial = model("BOM-Scrap-Material", BOMScrapMaterialSchema);
module.exports = BOMScrapMaterial;