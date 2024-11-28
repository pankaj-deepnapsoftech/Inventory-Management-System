const Agent = require("../models/agent");
const { TryCatch, ErrorHandler } = require("../utils/error");

exports.create = TryCatch(async (req, res)=>{
    const agentDetails = req.body;
    if(!agentDetails){
        throw new ErrorHandler("Please provide the agent details", 400);
    }
    const agent = await Agent.create({...agentDetails});
    res.status(200).json({
        status: 200,
        success: true,
        message: "Agent has been added successfully",
        agent
    })
})
exports.update = TryCatch(async (req, res)=>{
    const {id} = req.params;
    const agentDetails = req.body;
    if(!id){
        throw new ErrorHandler("Agent Id not provided", 400);
    }
    if(!agentDetails){
        throw new ErrorHandler("Please provide the agent details", 400);
    }
    let agent = await Agent.findById(id);
    if(!agent){
        throw new ErrorHandler("Agent doesn't exist", 400);
    }
    agent = await Agent.findByIdAndUpdate(id, {...agentDetails}, {new: true});
    res.status(200).json({
        status: 200,
        success: true,
        message: "Agent details has been updated successfully",
        agent
    })
})
exports.remove = TryCatch(async (req, res)=>{
    const {id} = req.params;
    if(!id){
        throw new ErrorHandler("Agent Id not provided", 400);
    }
    let agent = await Agent.findById(id);
    if(!agent){
        throw new ErrorHandler("Agent doesn't exist", 400);
    }
    await agent.deleteOne();
    res.status(200).json({
        status: 200,
        success: true,
        message: "Agent has been deleted successfully",
        agent
    })
})
exports.details = TryCatch(async (req, res)=>{
    const {id} = req.params;
    if(!id){
        throw new ErrorHandler("Agent Id not provided", 400);
    }
    let agent = await Agent.findById(id);
    if(!agent){
        throw new ErrorHandler("Agent doesn't exist", 400);
    }
    res.status(200).json({
        status: 200,
        success: true,
        agent
    })
})
exports.allBuyers = TryCatch(async (req, res)=>{
    const agents = await Agent.find({agent_type: 'buyer', approved: true});
    res.status(200).json({
        status: 200,
        success: true,
        agents
    })
})
exports.allSuppliers = TryCatch(async (req, res)=>{
    const agents = await Agent.find({agent_type: 'supplier', approved: true});
    res.status(200).json({
        status: 200,
        success: true,
        agents
    })
})
exports.unapprovedBuyers = TryCatch(async (req, res)=>{
    const agents = await Agent.find({agent_type: 'buyer', approved: false});
    res.status(200).json({
        status: 200,
        success: true,
        agents
    })
})
exports.unapprovedSuppliers = TryCatch(async (req, res)=>{
    const agents = await Agent.find({agent_type: 'supplier', approved: false});
    res.status(200).json({
        status: 200,
        success: true,
        agents
    })
})