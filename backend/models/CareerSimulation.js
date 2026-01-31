const mongoose = require('mongoose');

const careerSimulationSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    input_digital_twin: {
        type: Object, // Verification of snapshot at time of simulation
        required: true
    },
    simulated_careers: [{
        career_name: String,
        readiness_percent: Number, // 0-100
        predicted_stress_load: Number, // 1-10
        estimated_time_to_ready: String,
        market_demand_score: Number,
        top_3_skill_gaps: [String],
        reasoning: {
            readiness_logic: String,
            stress_logic: String,
            fit_logic: String
        }
    }]
});

module.exports = mongoose.model('CareerSimulation', careerSimulationSchema);
