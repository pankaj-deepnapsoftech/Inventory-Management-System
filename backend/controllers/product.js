const Product = require("../models/product");
const { TryCatch, ErrorHandler } = require("../utils/error");

exports.create = TryCatch(async (req, res)=>{
    const productDetails = req.body;
    if(!productDetails){
        throw new ErrorHandler("Please provide product details", 400);
    }

    const product = await Product.create({...productDetails});

    res.status(200).json({
        status: 200,
        success: true,
        message: "Product has been added successfully",
        product
    });
});
exports.update = TryCatch(async (req, res)=>{
    const productDetails = req.body;
    if(!productDetails){
        throw new ErrorHandler("Please provide product details", 400);
    }

    const {_id} = productDetails;

    let product = await Product.findById(_id);
    if(!product){
        throw new ErrorHandler("Product doesn't exist", 400);
    }

    product = await Product.findOneAndUpdate({_id}, {...productDetails, approved: req.user.isSuper ? productDetails?.approved : false}, {new: true});

    res.status(200).json({
        status: 200,
        success: true,
        message: "Product has been updated successfully",
        product
    });
});
exports.remove = TryCatch(async (req, res)=>{
    const {_id} = req.body;
    const product = await Product.findByIdAndDelete(_id);
    if(!product){
        throw new ErrorHandler("Product doesn't exist", 400);
    }
    res.status(200).json({
        status: 200,
        success: true,
        message: "Product has been deleted successfully",
        product
    })
});
exports.details = TryCatch(async (req, res)=>{
    const {id} = req.params;
    const product = await Product.findById(id);
    if(!product){
        throw new ErrorHandler("Product doesn't exist", 400);
    }
    res.status(200).json({
        status: 200,
        success: true,
        product
    })
});
exports.all = TryCatch(async (req, res)=>{
    const products = await Product.find({approved: true}).sort({'updatedAt': -1});
    res.status(200).json({
        status: 200,
        success: true,
        products,
    })
})
exports.unapproved = TryCatch(async (req, res)=>{
    const unapprovedProducts = await Product.find({approved: false}).sort({'updatedAt': -1});
    res.status(200).json({
        status: 200,
        success: true,
        unapproved: unapprovedProducts
    })
});