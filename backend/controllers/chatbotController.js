const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null);
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : null });

const mentalHealthPrompt = `
You are a compassionate and understanding mental health assistant for a student. Your goal is to listen to the user, validate their feelings, and offer calming advice or exercises.
User's input will be provided.

Guidelines:
1.  **Empathy & Validation**: Always start by validating the user's feelings.
2.  **Calming Techniques**: Suggest simple, actionable calming exercises if the user seems stressed or anxious (e.g., box breathing, 5-4-3-2-1 technique).
3.  **Positive Reinforcement**: Remind the user of their strengths.
4.  **Tone**: Warm, non-judgmental, soothing, and professional.
`;

exports.analyzeMood = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        try {
            console.log("Chatbot: Attempting OpenAI (Mood)...");
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: mentalHealthPrompt },
                    { role: "user", content: message }
                ]

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
            res.json({ reply: response.choices[0].message.content });
        } catch (oaError) {
            console.warn("OpenAI Failed (Mood), falling back to Gemini:", oaError.message);
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const result = await model.generateContent(mentalHealthPrompt + "\nUser Input: " + message);
                const response = await result.response;
                res.json({ reply: response.text() });
            } catch (geminiError) {
                console.warn("Gemini Failed (Mood), using MOCK response:", geminiError.message);
                res.json({
                    reply: "I hear that you're going through a lot right now, and I want you to know that your feelings are completely valid. It's okay to feel overwhelmed sometimes. Try to take a few deep breaths—inhale for four counts, hold for four, and exhale for four. You've handled tough days before, and I believe in your resilience. How are you feeling after those breaths?"
                });
            }
        }
    } catch (error) {
        console.error("All AI Failed (Mood):", error);
        res.status(500).json({ error: "Failed to process your request." });
    }
};

const roadmapPrompt = `
You are an expert tutor and career mentor specializing in {domain}.
The student is currently at the **{level}** level.
Answer the student's specific question about this level.
`;

exports.analyzeRoadmapQuery = async (req, res) => {
    try {
        const { message, domain, level } = req.body;
        if (!message || !domain || !level) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const filledPrompt = roadmapPrompt
            .replace(/{domain}/g, domain)
            .replace(/{level}/g, level);

        try {
            console.log("Chatbot: Attempting OpenAI (Roadmap Query)...");
            const response = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    { role: "system", content: filledPrompt },
                    { role: "user", content: message }
                ]
            });
            res.json({ reply: response.choices[0].message.content });
        } catch (oaError) {
            console.warn("OpenAI Failed (Roadmap Query), falling back to Gemini:", oaError.message);
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
                const result = await model.generateContent(filledPrompt + "\nStudent Question: " + message);
                const response = await result.response;
                res.json({ reply: response.text() });
            } catch (geminiError) {
                console.warn("Gemini Failed (Roadmap), using MOCK roadmap help:");
                res.json({
                    reply: `That's a great question about ${domain} at the ${level} level! In general, focus on mastering the core syntax and understanding the logic flow before moving to advanced frameworks. Consistency is key in learning ${domain}. Keep practicing!`
                });
            }
        }
    } catch (error) {
        console.error("All AI Failed (Roadmap Query):", error);
        res.status(500).json({ error: "Failed to process your request." });
    }
};
