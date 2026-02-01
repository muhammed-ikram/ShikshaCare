const Assessment = require('../models/Assessment');

exports.submitAssessment = async (req, res) => {
    try {
        const { stressLevel, sleepQuality, mood, socialInteraction, academicPressure } = req.body;
        const userId = req.user._id; // Assuming auth middleware adds user to req

        // Convert string inputs to numbers
        const scores = {
            stressLevel: parseInt(stressLevel),
            sleepQuality: parseInt(sleepQuality),
            mood: parseInt(mood),
            socialInteraction: parseInt(socialInteraction),
            academicPressure: parseInt(academicPressure)
        };

        // Calculate average score
        // Only values 1-5 are allowed. Higher is generally "Better" based on the user's mapping?
        // Let's re-verify the mapping provided in the user's exercises component code.
        // Stress: 5=Very Low (Good), 1=Very High (Bad) -> High score = Good
        // Sleep: 5=Excellent (Good), 1=Very Poor (Bad) -> High score = Good
        // Mood: 5=Very Positive (Good) -> High score = Good
        // Social: 5=Very Comfortable -> High score = Good
        // Academic: 5=Very Light (Good/Easy), 1=Overwhelming (Bad) -> High score = Good

        // So higher average = better mental health.
        const total = Object.values(scores).reduce((a, b) => a + b, 0);
        const average = total / 5;

        let exerciseType = '';

        if (average >= 4.5) {
            exerciseType = 'congratulations';
        } else if (average >= 3.8) {
            exerciseType = 'low'; // Low Stress / Good state
        } else if (average >= 3.0) {
            exerciseType = 'moderate';
        } else if (average >= 2.0) {
            exerciseType = 'improvement'; // Needs improvement
        } else {
            exerciseType = 'confidence'; // Needs significant help/confidence
        }

        const newAssessment = new Assessment({
            user: userId,
            ...scores,
            recommendation: exerciseType,
            averageScore: average
        });

        await newAssessment.save();

        res.status(201).json({
            message: 'Assessment submitted successfully',
            exerciseType,
            recommendation: exerciseType,
            averageScore: average
        });

    } catch (error) {
        console.error('Error submitting assessment:', error);
        res.status(500).json({ error: 'Failed to submit assessment' });
    }
};

exports.getAssessmentHistory = async (req, res) => {
    try {
        const userId = req.user._id;
        const history = await Assessment.find({ user: userId })
            .sort({ createdAt: 1 }) // Ascending for chart
            .select('stressLevel averageScore createdAt');

        // Map stressLevel back to "High Stress = High Value" for visualization if requested?
        // User asked for "Stress Score".
        // In our DB: 5 = Very Low Stress, 1 = Very High Stress.
        // For a chart, usually "Higher Bar = Higher Stress" makes sense intuitively.
        // But if we stick to the stored values, the chart will show "Mental Wellness Score" (High = Good).
        // Let's send the raw data and let the frontend decide labels. 
        // Or, I can invert it for "Stress Level" specifically? 
        // Let's stick to raw data to avoid confusion with the input form.

        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
};
