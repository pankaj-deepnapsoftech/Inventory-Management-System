const { Schema, model } = require("mongoose");

const proformaInvoiceSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'Agent',
        required: [true, 'Buyer is a required field']
    },
    proforma_invoice_no: {
        type: String,
        required: [true, 'Proforma invoice number is a required field']
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
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'Product'
        }],
        required: [true, 'Items is a required field'],
        validate: {
            validator: function(arr){
                return Array.isArray(arr) && arr.length >= 1;
            },
            message: 'Items should contain atleast 1 item'
        }
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

const ProformaInvoice = model("Proforma-Invoice", proformaInvoiceSchema);
module.exports = ProformaInvoice;
