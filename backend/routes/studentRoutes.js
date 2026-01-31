const express = require('express');
const router = express.Router();
const StudentProfile = require('../models/StudentProfile');
const User = require('../models/user');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Create or Update Profile
router.post('/profile', isLoggedIn, async (req, res) => {
    try {
        const { personalInfo, academicBaseline, learningStyle, digitalTwinAttributes, careerAspirations } = req.body;

        // Check if profile exists
        let profile = await StudentProfile.findOne({ user: req.user.id });

        if (profile) {
            // Update existing
            profile.personalInfo = personalInfo;
            profile.academicBaseline = academicBaseline;
            profile.learningStyle = learningStyle;
            profile.digitalTwinAttributes = digitalTwinAttributes;
            profile.careerAspirations = careerAspirations;
            await profile.save();
        } else {
            // Create new
            profile = new StudentProfile({
                user: req.user.id,
                personalInfo,
                academicBaseline,
                learningStyle,
                digitalTwinAttributes,
                careerAspirations
            });
            await profile.save();

            // Update user status
            await User.findByIdAndUpdate(req.user.id, { profileCompleted: true });
        }

        res.status(200).json({ success: true, profile });
    } catch (error) {
        console.error("Error saving profile:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Get Profile
router.get('/profile', isLoggedIn, async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id }).populate('user', 'username email profilepic');
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
