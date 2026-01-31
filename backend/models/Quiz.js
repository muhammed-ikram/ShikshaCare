const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    subTopic: String,
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
        required: true
    },
    questions: [{
        question: String,
        options: [String],
        correctAnswer: Number, // Index of the correct option
        explanation: String
    }],
    score: {
        type: Number,
        default: 0
    },
    totalQuestions: Number,
    isPassed: {
        type: Boolean,
        default: false
    },
    attemptDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Quiz', quizSchema);
