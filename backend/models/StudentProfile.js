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
        collegeName: { type: String },
        degree: { type: String }, // e.g. B.Tech, B.E
        year: { type: String }, // e.g. 1st Year, 2nd Year
        branch: { type: String }, // e.g. CSE, ECE
        city: { type: String }
    },
    academicBaseline: {
        programmingLanguages: [{ type: String }], // Java, C, Python
        techInterests: [{ type: String }], // AI/ML, Web Dev
        cgpa: { type: String }, // e.g., "8.5"
        codingHoursPerDay: { type: Number }
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
    careerAspirations: {
        interests: [{ type: String }], // e.g. "Web Development", "Data Science"
        preferredWorkEnvironment: { type: String, enum: ['Remote', 'On-site', 'Hybrid'] },
        expectedSalaryRange: { type: String } // e.g. "5-8 LPA"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('StudentProfile', studentProfileSchema);
