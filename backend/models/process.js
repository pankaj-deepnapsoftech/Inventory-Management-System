const {Schema, model} = require('mongoose');

const processSchema = new Schema({
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator is a required field']
    },
    process: {
        type: String,
        required: [true, 'Process is a required field']
    },
    description: {
        type: String
    }
}, {
    timestamps: true
});

const Process = model('Process', processSchema);
module.exports = Process;