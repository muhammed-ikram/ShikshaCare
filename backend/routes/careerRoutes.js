const express = require('express');
const router = express.Router();
const CareerPath = require('../models/CareerPath');
const StudentProfile = require('../models/StudentProfile');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Seed some initial career paths (Dev Helper)
router.post('/seed', async (req, res) => {
    try {
        const count = await CareerPath.countDocuments();
        if (count > 0) return res.json({ message: "Already seeded" });

        const paths = [
            {
                title: "Full Stack Developer",
                description: "Build both client and server software.",
                requiredSkills: ["JavaScript", "HTML/CSS", "React", "Node.js", "MongoDB"],
                matchCriteria: { minCodingHours: 2, keyTraits: ["Visual", "Analytical"] },
                averageSalary: "6-12 LPA",
                growthOutlook: "High"
            },
            {
                title: "Data Scientist",
                description: "Analyze and interpret complex data.",
                requiredSkills: ["Python", "SQL", "Machine Learning", "Mathematics"],
                matchCriteria: { minCodingHours: 1, keyTraits: ["Analytical", "Curious"] },
                averageSalary: "8-15 LPA",
                growthOutlook: "High"
            },
            {
                title: "UI/UX Designer",
                description: "Design user-friendly interfaces.",
                requiredSkills: ["Figma", "Adobe XD", "Prototyping"],
                matchCriteria: { minCodingHours: 0, keyTraits: ["Visual", "Creative"] },
                averageSalary: "5-10 LPA",
                growthOutlook: "Stable"
            }
        ];
        await CareerPath.insertMany(paths);
        res.json({ success: true, message: "Seeded career paths" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const { suggestCareers } = require('../services/aiService');

// Analyze Profile and Suggest Careers
router.post('/analyze', isLoggedIn, async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found. Please complete onboarding first." });
        }

        console.log("Analyzing profile for:", profile.academicBaseline.techInterests);
        const recommendations = await suggestCareers(profile);
        console.log("Sending recommendations:", recommendations?.length || 0);
        res.json({ success: true, recommendations });

    } catch (error) {
        console.error("Analysis error:", error);
        res.status(500).json({ success: false, message: "AI Analysis Failed. Please try again." });
    }
});

router.get('/list', async (req, res) => {
    const paths = await CareerPath.find();
    res.json(paths);
});

module.exports = router;
