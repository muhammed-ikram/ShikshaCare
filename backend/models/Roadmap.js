const mongoose = require('mongoose');

const roadmapSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    selected_career_name: {
        type: String,
        required: true
    },
    generated_at: {
        type: Date,
        default: Date.now
    },
    roadmap_content: {
        type: Array, // Flexible structure for phases/milestones from AI
        required: true
    }
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
