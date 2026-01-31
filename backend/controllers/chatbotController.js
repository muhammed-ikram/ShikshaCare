const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const mentalHealthPrompt = `
You are a compassionate and understanding mental health assistant for a student. Your goal is to listen to the user, validate their feelings, and offer calming advice or exercises.
User's input will be provided.

Guidelines:
1.  **Empathy & Validation**: Always start by validating the user's feelings. (e.g., "I hear you, and it's completely okay to feel this way.")
2.  **Calming Techniques**: Suggest simple, actionable calming exercises if the user seems stressed or anxious (e.g., box breathing, 5-4-3-2-1 grounding technique, progressive muscle relaxation).
3.  **Positive Reinforcement**: Remind the user of their strengths and that this feeling is temporary.
4.  **Tone**: Warm, non-judgmental, soothing, and professional.
5.  **Crisis Intervention**: If the user indicates severe distress, self-harm, or hopelessness, DONT be generic. Urge them to seek professional help immediately. 
    *   "I'm really concerned about you. Please reach out to a professional or a trusted adult immediately."
    *   Include generic helpline suggestions like "You can call 988 or your local emergency number."
6.  **Structure**: Keep responses concise and easy to read.
`;

exports.analyzeMood = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }


        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(mentalHealthPrompt + "\nUser Input: " + message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error with Gemini API:", error);

        if (error.status === 429 || error.message?.includes('429')) {
            return res.status(429).json({
                error: "I'm receiving too many messages right now. Please wait a moment and try again."
            });
        }

        res.status(500).json({ error: "Failed to process your request." });
    }
};

const roadmapPrompt = `
You are an expert tutor and career mentor specializing in {domain}.
The student is currently at the **{level}** level.

Your Goal:
1. Answer the student's specific question about this level.
2. Provide clear, concise explanations suitable for a {level} learner.
3. Suggest 1-2 actionable resources or practice ideas if asked.
4. Be encouraging and professional.

Context:
- Domain: {domain}
- Level: {level}
`;

exports.analyzeRoadmapQuery = async (req, res) => {
    try {
        const { message, domain, level } = req.body;

        if (!message || !domain || !level) {
            return res.status(400).json({ error: "Message, Domain, and Level are required" });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const filledPrompt = roadmapPrompt
            .replace(/{domain}/g, domain)
            .replace(/{level}/g, level);

        const result = await model.generateContent(filledPrompt + "\nStudent Question: " + message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error with Gemini API (Roadmap):", error);
        if (error.status === 429 || error.message?.includes('429')) {
            return res.status(429).json({
                error: "I'm receiving too many messages right now. Please wait a moment and try again."
            });
        }
        res.status(500).json({ error: "Failed to process your request." });
    }
};
