const StudentProfile = require('../models/StudentProfile');
const CareerSimulation = require('../models/CareerSimulation');
const Roadmap = require('../models/Roadmap');
const aiService = require('../services/aiService');

exports.simulateCareer = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await StudentProfile.findOne({ user: userId });

    if (!profile) {
      return res.status(404).json({ message: "Student profile not found. Please complete profiling first." });
    }

    // Construct Prompt with safe access
    const education = profile.personalInfo ? `${profile.personalInfo.degree || 'Degree'} in ${profile.personalInfo.branch || 'Branch'} (Year: ${profile.personalInfo.year || 'N/A'})` : 'Education not specified';
    const skills = profile.academicBaseline?.skills ? profile.academicBaseline.skills.join(', ') : 'None';
    const interests = profile.academicBaseline?.interests ? profile.academicBaseline.interests.join(', ') : 'None';
    const cgpa = profile.academicBaseline?.cgpa || 'N/A';
    const studyHours = profile.academicBaseline?.studyHoursPerDay || 0;
    const learningStyle = profile.learningStyle?.primaryStyle || 'N/A';
    const curiosity = profile.digitalTwinAttributes?.curiosityLevel || 5;
    const adaptability = profile.digitalTwinAttributes?.adaptability || 5;
    const stressLevel = profile.digitalTwinAttributes?.stressLevel || 5;

    console.log("Generating Career Simulation for User:", userId);
    console.log("Profile Snapshot:", { education, skills, interests });

    const prompt = `
      You are an expert AI Career Counselor. Analyze the following student profile and suggest 3-5 distinct career paths.
      
      Student Profile:
      - Education: ${education}
      - Key Skills: ${skills}
      - Interests: ${interests}
      - CGPA: ${cgpa}
      - Study Hours/Day: ${studyHours}
      - Learning Style: ${learningStyle}
      - Attributes: Curiosity ${curiosity}/10, Adaptability ${adaptability}/10, Stress Level ${stressLevel}/10

      For each career path, provide:
      1. Career Name
      2. Readiness % (0-100) based on current skills vs requirements
      3. Predicted Stress Load (1-10) considering their current stress level
      4. Estimated Time to Ready (e.g. "6 months")
      5. Top 3 Skill Gaps
      6. Market Demand Score (1-10)
      7. Reasoning for Readiness, Stress, and Fit.

      Return Strict JSON format as follows:
      {
        "simulated_careers": [
          {
            "career_name": "string",
            "readiness_percent": number,
            "predicted_stress_load": number,
            "estimated_time_to_ready": "string",
            "market_demand_score": number,
            "top_3_skill_gaps": ["string"],
            "reasoning": {
              "readiness_logic": "string",
              "stress_logic": "string",
              "fit_logic": "string"
            }
          }
        ]
      }
    `;

    // Call AI
    console.log("Sending prompt to AI...");
    const aiResponse = await aiService.generateContent(prompt);
    console.log("AI Response Received:", JSON.stringify(aiResponse).substring(0, 100) + "...");

    // Save to DB
    console.log("Saving simulation to DB...");
    const simulation = new CareerSimulation({
      user: userId,
      input_digital_twin: profile.toObject(), // Convert Mongoose doc to plain object
      simulated_careers: aiResponse.simulated_careers
    });

    await simulation.save();
    console.log("Simulation saved successfully");

    res.json({ success: true, data: simulation });
  } catch (error) {
    console.error("FULL ERROR DETAILS:", error); // Log the entire error object
    if (error.name === 'ValidationError') {
      console.error("Validation Error Details:", error.errors);
    }
    res.status(500).json({ message: "Server Error during simulation", error: error.message });
  }
};

exports.generateRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const { career_name } = req.body;

    // Construct Prompt
    const prompt = `
      Create a detailed step-by-step learning roadmap for a student aspiring to be a "${career_name}".
      The roadmap should be broken down into ordered "Phases".
      
      Return Strict JSON format:
      [
        {
          "phase_name": "string (e.g. Phase 1: Foundations)",
          "duration": "string (e.g. 4 weeks)",
          "topics": ["string", "string"],
          "goal": "string"
        }
      ]
    `;

    const aiResponse = await aiService.generateContent(prompt);

    const roadmap = new Roadmap({
      user: userId,
      selected_career_name: career_name,
      roadmap_content: aiResponse
    });
    await roadmap.save();

    res.json({ success: true, data: roadmap });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error during roadmap generation" });
  }
};

exports.getRoadmap = async (req, res) => {
  try {
    const userId = req.user.id;
    const roadmap = await Roadmap.findOne({ user: userId }).sort({ generated_at: -1 });
    if (!roadmap) return res.status(404).json({ message: "No roadmap found" });
    res.json({ success: true, data: roadmap });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
