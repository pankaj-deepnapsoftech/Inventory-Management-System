const Process = require("../models/process");
const { TryCatch, ErrorHandler } = require("../utils/error");

exports.create = TryCatch(async (req, res)=>{
    const process = req.body;
    if(!process){
        throw new ErrorHandler("Please provide all the fields", 400);
    }

    await Process.create({...process, creator: req.user._id});

    res.status(200).json({
        status: 200,
        success: true,
        message: "Process has been created successfully"
    })
})
exports.update = TryCatch(async (req, res)=>{
    const {_id} = req.params;
    const processDetails = req.body;
    if(!_id){
        throw new ErrorHandler("Id not provided", 400);
    }
    if(!processDetails){
        throw new ErrorHandler("Please provide all the fields", 400);
    }
    const process = await Process.findById(_id);
    if(!process){
        throw new ErrorHandler("Process doesn't exist", 400);
    }

    await Process.findByIdAndUpdate({_id}, {...processDetails});

    res.status(200).json({
        status: 200,
        success: true,
        message: "Process has been updated successfully"
    })
})
exports.remove = TryCatch(async (req, res)=>{
    const {_id} = req.params;
    if(!_id){
        throw new ErrorHandler("Id not provided", 400);
    }
    await Process.findByIdAndDelete(_id);
    res.status(200).json({
        status: 200,
        success: true,
        message: "Process has been deleted successfully"
    })
})
exports.details = TryCatch(async (req, res)=>{
    const {_id} = req.params;
    if(!_id){
        throw new ErrorHandler("Id not provided", 400);
    }
    const process = await Process.findById(_id).populate("creator");
    res.status(200).json({
        status: 200,
        success: true,
        process
    })
})
exports.all = TryCatch(async (req, res)=>{
    const processes = await Process.find({}).populate("creator");
    res.status(200).json({
        status: 200,
        success: true,
        processes
    })
})