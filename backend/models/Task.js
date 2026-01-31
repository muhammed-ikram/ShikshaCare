const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    title: { type: String, required: true },
    description: { type: String },
    module: { type: String, default: "General" },
    status: {
        type: String,
        enum: ['Todo', 'In Progress', 'Done'],
        default: 'Todo'
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Medium'
    },
    assignee: { type: String }, // Could be helpful if group projects are added later
    dueDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', taskSchema);
