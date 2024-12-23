const { TryCatch } = require("../utils/error");
const BOMScrapMaterial = require('../models/bom-scrap-material');

exports.all = TryCatch(async (req, res)=>{
    const scraps = await BOMScrapMaterial.find({is_production_started: true}).populate('bom item');

    res.status(200).json({
        status: 200,
        success: true,
        scraps
    })
})
exports.details = TryCatch(async (req, res)=>{
    
})