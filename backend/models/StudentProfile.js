const mongoose = require('mongoose');

const studentProfileSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
        unique: true
    },
    personalInfo: {
        age: { type: Number },
        gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'] },
        school: { type: String },
        classStandard: { type: String }, // e.g., "10th Grade"
        city: { type: String }
    },
    academicBaseline: {
        favoriteSubjects: [{ type: String }],
        difficultSubjects: [{ type: String }],
        recentGrades: { type: String }, // e.g., "A", "85%", "GPA 3.5"
        studyHoursPerDay: { type: Number }
    },
    learningStyle: {
        primaryStyle: { type: String, enum: ['Visual', 'Auditory', 'Kinesthetic', 'Reading/Writing'] },
        attentionSpan: { type: String, enum: ['Short (< 20 mins)', 'Medium (20-45 mins)', 'Long (> 45 mins)'] },
        groupStudyPreference: { type: Boolean, default: false }
    },
    digitalTwinAttributes: {
        curiosityLevel: { type: Number, min: 1, max: 10, default: 5 },
        adaptability: { type: Number, min: 1, max: 10, default: 5 },
        stressLevel: { type: Number, min: 1, max: 10, default: 5 }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
