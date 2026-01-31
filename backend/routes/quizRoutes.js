const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const { generateQuiz } = require('../services/aiService');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Generate Quiz for a topic
router.post('/generate', isLoggedIn, async (req, res) => {
    try {
        const { topic, level } = req.body;
        if (!topic) return res.status(400).json({ message: "Topic is required" });

        const questions = await generateQuiz(topic, level || 'Beginner');
        res.json({ success: true, questions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Submit Quiz Results
router.post('/submit', isLoggedIn, async (req, res) => {
    try {
        const { topic, level, answers, questions } = req.body;

        // Simple scoring
        let score = 0;
        questions.forEach((q, idx) => {
            if (answers[idx] === q.correctAnswer) {
                score++;
            }
        });

        const quizAttempt = await Quiz.create({
            student: req.user.id,
            topic,
            level,
            questions,
            score,
            totalQuestions: questions.length,
            isPassed: (score / questions.length) >= 0.6
        });

        res.json({
            success: true,
            attempt: quizAttempt,
            percentage: Math.round((score / questions.length) * 100)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get Progress Stats for Graphs
router.get('/stats', isLoggedIn, async (req, res) => {
    try {
        const stats = await Quiz.find({ student: req.user.id }).sort({ attemptDate: 1 });

        // Group by topic and take the latest score for each
        const conceptStrength = {};
        stats.forEach(s => {
            conceptStrength[s.topic] = Math.round((s.score / s.totalQuestions) * 100);
        });

        const formattedStats = Object.keys(conceptStrength).map(topic => ({
            topic,
            strength: conceptStrength[topic]
        }));

        res.json({ success: true, stats: formattedStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
