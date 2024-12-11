const { Schema, model } = require("mongoose");

const invoiceSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        required: [true, 'Buyer is a required field']
    },
    invoice_no: {
        type: String,
        required: [true, 'Invoice number is a required field']
    },
    document_date: {
        type: Date,
        default: Date.now()
    },
    sales_order_date: {
        type: Date,
        default: Date.now
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: [true, 'Store is a required field']
    },
    note: {
        type: String,
    },
    items: {
        type: [Schema.Types.ObjectId],
        required: [true, 'Items is a required field'],
        minlength: [1, 'Items should contain atleast 1 item']
    },
    subtotal: {
        type: Number,
        required: [true, 'Subtotal is a required field']
    },
    tax:{
        type: String
    },
    total: {
        type: Number,
        required: [true, 'Subtotal is a required field']
    }
}, {
    timestamps: true
});

const Invoice = model("Invoice", invoiceSchema);
module.exports = Invoice;
