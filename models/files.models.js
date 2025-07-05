const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    path:{
        type: String,
        required: [true, 'Path required']
    },
    originalname:{
        type: String,
        required: [true, 'Originalname is required']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    }
}, { timestamps: true });

fileSchema.statics.deleteFile = async function(fileId) {
    try {
        const file = await this.findByIdAndDelete(fileId);
        return file;
    } catch (error) {
        throw error;
    }
};

module.exports = mongoose.model('File', fileSchema);