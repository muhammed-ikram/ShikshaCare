const express = require('express');
const router = express.Router();
const careerController = require('../controllers/careerController');
const isLoggedIn = require('../middlewares/isLoggedIn');

router.post('/simulate', isLoggedIn, careerController.simulateCareer);
router.post('/generate-roadmap', isLoggedIn, careerController.generateRoadmap);
router.get('/roadmap', isLoggedIn, careerController.getRoadmap);

module.exports = router;
