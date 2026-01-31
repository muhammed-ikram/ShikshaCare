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

// Analyze Profile and Suggest Careers
router.post('/analyze', isLoggedIn, async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found. Please complete onboarding first." });
        }

        // Simple Heuristic Logic for Recommendations
        const allPaths = await CareerPath.find();
        const recommendations = allPaths.map(path => {
            let score = 0;
            const reasons = [];

            // 1. Skill Match from 'Academic Baseline' (if implemented strictly, but here we use interests)
            // Assuming academicBaseline.techInterests contains broadly related terms
            const userInterests = [...profile.academicBaseline.programmingLanguages, ...profile.academicBaseline.techInterests];

            // Check for skill overlaps
            const commonSkills = path.requiredSkills.filter(skill =>
                userInterests.some(interest => interest.toLowerCase().includes(skill.toLowerCase()))
            );
            if (commonSkills.length > 0) {
                score += commonSkills.length * 10;
                reasons.push(`Matches skills: ${commonSkills.join(', ')}`);
            }

            // 2. Trait Match
            if (path.matchCriteria.keyTraits.includes(profile.learningStyle.primaryStyle)) {
                score += 5;
                reasons.push(`Alignment with ${profile.learningStyle.primaryStyle} learning style`);
            }

            // 3. Coding Hours
            if (profile.academicBaseline.codingHoursPerDay >= path.matchCriteria.minCodingHours) {
                score += 5;
                reasons.push("Sufficient daily coding practice");
            }

            return {
                ...path.toObject(),
                matchScore: score,
                matchReasons: reasons
            };
        });

        // Sort by score
        recommendations.sort((a, b) => b.matchScore - a.matchScore);

        // Return top 3
        res.json({ success: true, recommendations: recommendations.slice(0, 3) });

    } catch (error) {
        console.error("Analysis error:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

router.get('/list', async (req, res) => {
    const paths = await CareerPath.find();
    res.json(paths);
});

module.exports = router;
