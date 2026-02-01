const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function check() {
    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-2.0-flash-exp"];

    if (!process.env.GEMINI_API_KEY) {
        console.log("ERROR: GEMINI_API_KEY is missing from .env");
        return;
    }

    for (const m of models) {
        try {
            const model = genAI.getGenerativeModel({ model: m });
            await model.generateContent("test");
            console.log(`PASS: ${m}`);
        } catch (e) {
            console.log(`FAIL: ${m} - ${e.message.split(' ')[0]}...`);
        }
    }
}
check();
