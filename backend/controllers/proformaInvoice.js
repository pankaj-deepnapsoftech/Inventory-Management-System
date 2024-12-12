const ProformaInvoice = require("../models/proforma-invoice");
const { TryCatch, ErrorHandler } = require("../utils/error");

exports.create = TryCatch(async (req, res)=>{
    const proformaInvoice = req.body;
    if(!proformaInvoice){
        throw new ErrorHandler('Please provide all the fields', 400);
    }

    const createdProformaInvoice = await ProformaInvoice.create({...proformaInvoice});

    res.status(200).json({
        status: 200,
        success: true,
        proforma_invoice: createdProformaInvoice._doc,
        message: "Proforma Invoice created successfully"
    })
})
exports.update = TryCatch(async (req, res)=>{
    const {_id} = req.params;
    if(!_id){
        throw new ErrorHandler("Proforma Invoice doesn't exist", 400);
    }
    const proformaInvoice = req.body;
    if(!proformaInvoice){
        throw new ErrorHandler("Please provide all the fileds", 400);
    }

    const updatedInvoice = await ProformaInvoice.findByIdAndUpdate({_id: _id}, {
        ...proformaInvoice,
        items: {$set: proformaInvoice.items}
    }, {new: true});

    res.status(200).json({
        status: 200,
        success: true,
        message: "Proforma Invoice has been updated successfully",
        proforma_invoice: updatedInvoice._doc
    })
})
exports.remove = TryCatch(async (req, res)=>{
    const {_id} = req.params;
    if(!_id){
        throw new ErrorHandler("Proforma Invoice Id not provided", 400);
    }

    const proformaInvoice = await ProformaInvoice.findOne({_id: _id});
    if(!proformaInvoice){
        throw new ErrorHandler("Proforma Invoice doesn't exist", 400);
    }
    await proformaInvoice.deleteOne();

    res.status(200).json({
        status: 200,
        success: true,
        message: "Proforma Invoice deleted successfully"
    })
})
exports.details = TryCatch(async (req, res)=>{
    const {_id} = req.params;
    if(!_id){
        throw new ErrorHandler("Proforma Invoice Id not provided", 400);
    }

    const proformaInvoice = await ProformaInvoice.findOne({_id: _id}).populate('buyer store items');
    if(!proformaInvoice){
        throw new ErrorHandler("Proforma Invoice doesn't exist", 400);
    }

    res.status(200).json({
        status: 200,
        success: true,
        proforma_invoice: proformaInvoice._doc
    })
})
exports.all = TryCatch(async (req, res)=>{
    const proformaInvoices = await ProformaInvoice.find().populate('buyer store items');

    res.status(200).json({
        status: 200,
        success: true,
        proforma_invoices: proformaInvoices
    })
})