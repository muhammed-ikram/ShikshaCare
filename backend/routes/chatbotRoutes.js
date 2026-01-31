const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');

router.post('/analyze', chatbotController.analyzeMood);
router.post('/analyze-roadmap', chatbotController.analyzeRoadmapQuery);

module.exports = router;
