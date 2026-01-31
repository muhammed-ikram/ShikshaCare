const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    domain: {
        type: String,
        required: true
    },
    overallProgress: {
        type: Number,
        default: 0
    },
    steps: [{
        title: { type: String, required: true },
        description: { type: String },
        level: {
            type: String,
            enum: ['Beginner', 'Intermediate', 'Advanced'],
            default: 'Beginner'
        },
        resources: [{
            title: String,
            link: String,
            type: { type: String, default: 'Video' }
        }],
        subModules: [{
            title: { type: String, required: true },
            description: String,
            resources: [{
                title: String,
                link: String,
                type: { type: String, default: 'Article' }
            }],
            isCompleted: { type: Boolean, default: false }
        }],
        isCompleted: {
            type: Boolean,
            default: false
        },
        isStarted: {
            type: Boolean,
            default: false
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Roadmap', roadmapSchema);
