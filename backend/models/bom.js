const {Schema, model} = require('mongoose');

const bomSchema = new Schema({
    raw_materials: {
        type: [Schema.Types.ObjectId],
        ref: 'BOM-Raw-Material',
        required: [true, 'Raw material is a required field'],
        validate: {
            validator: function(arr){
                return Array.isArray(arr) && arr.length >= 1;
            },
            message: 'There should be atleast 1 raw material'
        }
    },
    processes: {
        type: [String]
    },
    finished_good: {
        type: Schema.Types.ObjectId,
        ref: "BOM-Finished-Material",
        required: [true, 'Finished good is a required field']
    },
    approved: {
        type: Boolean,
        default: false
    },
    approved_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    approval_date: {
        type: Date
    },
    bom_name: {
        type: String,
        required: [true, 'BOM name is a required field'],
    },
    parts_count: {
        type: Number,
        required: [true, "Part's count is a required field"],
    },
    total_cost: {
        type: Number,
        required: [true, "Total cost is a required field"]
    }
}, {
    timestamps: true
});

const BOM = model('BOM', bomSchema);
module.exports = BOM;