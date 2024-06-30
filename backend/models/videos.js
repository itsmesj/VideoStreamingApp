const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    videoPath: {
        type: String, // Store only the filename
        required: true
    },
    videoType: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

const VideoModel = mongoose.model("videos", VideoSchema);

module.exports = VideoModel;
