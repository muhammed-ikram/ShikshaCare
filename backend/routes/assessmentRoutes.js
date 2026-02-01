const express = require('express');
const router = express.Router();
const assessmentController = require('../controllers/assessmentController');
const isLoggedIn = require('../middlewares/isLoggedIn');

// Middleware to protect routes (ensure user is logged in)
router.post('/submit', isLoggedIn, assessmentController.submitAssessment);
router.get('/history', isLoggedIn, assessmentController.getAssessmentHistory);

module.exports = router;
