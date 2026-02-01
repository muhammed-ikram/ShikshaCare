const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    stressLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    sleepQuality: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    mood: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    socialInteraction: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    academicPressure: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    recommendation: {
        type: String, // 'congratulations', 'low', 'moderate', 'improvement', 'confidence'
        required: true
    },
    averageScore: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
