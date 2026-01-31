const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Linking to the User model (which acts as the student auth entity)
        required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    techStack: [{ type: String }], // e.g., ["React", "Node.js"]
    repoLink: { type: String },
    liveLink: { type: String },
    deadline: { type: Date },
    status: {
        type: String,
        enum: ['Planning', 'In Progress', 'Completed', 'On Hold'],
        default: 'Planning'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
