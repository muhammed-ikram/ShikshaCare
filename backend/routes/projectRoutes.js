const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Task = require('../models/Task');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Get All Projects for Logged In User
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const projects = await Project.find({ student: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Create New Project
router.post('/', isLoggedIn, async (req, res) => {
    try {
        const { title, description, techStack, deadline, repoLink, liveLink } = req.body;
        const project = new Project({
            student: req.user.id,
            title,
            description,
            techStack,
            deadline,
            repoLink,
            liveLink
        });
        await project.save();
        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Single Project with Tasks
router.get('/:id', isLoggedIn, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, student: req.user.id });
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        const tasks = await Task.find({ project: project._id });
        res.json({ success: true, project, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Delete Project
router.delete('/:id', isLoggedIn, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, student: req.user.id });
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        // Delete associated tasks
        await Task.deleteMany({ project: project._id });

        res.json({ success: true, message: "Project deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Generate AI Tasks
router.post('/:id/generate-tasks', isLoggedIn, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, student: req.user.id });
        if (!project) return res.status(404).json({ success: false, message: "Project not found" });

        const { generateTasks } = require('../services/aiService');
        const aiTasks = await generateTasks(project);

        const savedTasks = [];
        for (const t of aiTasks) {
            // Check for duplicate title in this project to avoid repetition
            const exists = await Task.findOne({ project: project._id, title: t.title });
            if (!exists) {
                const newTask = await Task.create({
                    project: project._id,
                    title: t.title,
                    description: t.description,
                    module: t.module || "General",
                    priority: t.priority,
                    status: 'Todo'
                });
                savedTasks.push(newTask);
            }
        }

        res.json({ success: true, tasks: savedTasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
