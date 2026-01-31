const express = require('express');
const router = express.Router();
const Roadmap = require('../models/Roadmap');
const { generateRoadmap } = require('../services/aiService');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Get My Roadmap
router.get('/', isLoggedIn, async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ student: req.user.id });
        res.json({ success: true, roadmap });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Generate New Roadmap
router.post('/generate', isLoggedIn, async (req, res) => {
    try {
        const { domain } = req.body;

        // Check if exists
        let roadmap = await Roadmap.findOne({ student: req.user.id });
        if (roadmap) {
            // Optional: You might want to overwrite or keep multiple. For now, let's overwrite for simplicity 
            // or return existing if same domain. 
            // Let's overwrite to allow "switching" paths.
            await Roadmap.deleteOne({ student: req.user.id });
        }

        const steps = await generateRoadmap(domain);

        roadmap = await Roadmap.create({
            student: req.user.id,
            domain,
            steps
        });

        res.json({ success: true, roadmap });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Toggle Step Completion
router.put('/step/:stepId', isLoggedIn, async (req, res) => {
    try {
        const roadmap = await Roadmap.findOne({ student: req.user.id });
        if (!roadmap) return res.status(404).json({ message: "Roadmap not found" });

        const step = roadmap.steps.id(req.params.stepId);
        if (!step) return res.status(404).json({ message: "Step not found" });

        step.isCompleted = !step.isCompleted;

        // Recalculate Progress
        const total = roadmap.steps.length;
        const completed = roadmap.steps.filter(s => s.isCompleted).length;
        roadmap.overallProgress = Math.round((completed / total) * 100);

        await roadmap.save();
        res.json({ success: true, roadmap });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
