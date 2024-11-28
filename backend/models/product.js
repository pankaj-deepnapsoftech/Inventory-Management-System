const {Schema, model} = require("mongoose");

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product Name is a required field"],
        minlength: [2, "Product Name should be atleast 2 characters long"],
        maxlength: [40, "Product Name cannot exceed 40 characters"]
    },
    product_id: {
        type: String,
        required: [true, "Product Id is a required field"],
        unique: true,
    },
    // Unit of measurement (uom)
    uom:{
        type: String,
        required: [true, 'Unit of Measurement (UoM) is a required field'],
        minlength: [2, "Unit of Measurement (UoM) should be atleast 2 characters long"],
        maxlength: [40, "Unit of Measurement (UoM) cannot exceed 40 characters"]
    },
    category: {
        type: String,
        required: [true, "Product Category is a required field"],
        enum: {
            values: ['finished goods', 'raw materials', 'semi finished goods', 'consumables', 'bought out parts', 'trading goods', 'service'],
            message: 'Product Category must be one of the following: finished goods, raw materials, semi finished goods, consumables, bought out parts, trading goods, service'
        }
    },
    current_stock: {
        type: Number,
        required: [true, 'Current Stock is a required field']
    },
    price: {
        type: Number,
        required: [true, 'Product Price is a required field']
    },
    min_stock: Number,
    max_stock: Number,
    hsn_code: String,
    approved: {
        type: Boolean,
        default: false
    }
    // tax: Number, // TODO -> Which taxes should be added
    // image: // TODO -> Should be kept or not
}, {
    timestamps: true
});

const Product = model("Product", productSchema);
module.exports = Product;