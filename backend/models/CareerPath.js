const mongoose = require('mongoose');

const careerPathSchema = mongoose.Schema({
    title: { type: String, required: true }, // e.g. "Full Stack Developer"
    description: { type: String },
    requiredSkills: [{ type: String }], // e.g. ["JavaScript", "React", "Node.js"]
    matchCriteria: {
        minCodingHours: { type: Number, default: 0 },
        preferredLearningStyle: { type: String }, // Optional preference
        keyTraits: [{ type: String }] // e.g. ["Visual", "Analytical"]
    },
    averageSalary: { type: String },
    growthOutlook: { type: String } // "High", "Stable"
});

module.exports = mongoose.model('CareerPath', careerPathSchema);
