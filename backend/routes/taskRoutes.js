const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Add Task to Project
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { projectId, title, description, priority, dueDate } = req.body;

        // Verify project ownership
        const project = await Project.findOne({ _id: projectId, student: req.user.id });
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        const task = new Task({
            project: projectId,
            title,
            description,
            priority,
            dueDate
        });
        await task.save();
        res.status(201).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Update Task (Status/Details)
router.put('/:id', isLoggedIn, async (req, res) => {
    try {
        const { status, title, description, priority } = req.body;

        // We need to check if the task belongs to a project owned by the user
        // This query ensures safety by looking up the task and populating the project to check the student id
        let task = await Task.findById(req.params.id).populate('project');

        if (!task || task.project.student.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }

        if (status) task.status = status;
        if (title) task.title = title;
        if (description) task.description = description;
        if (priority) task.priority = priority;

        await task.save();
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete Task
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        let task = await Task.findById(req.params.id).populate('project');
        if (!task || task.project.student.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: "Task not found or unauthorized" });
        }

        await Task.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Task deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
