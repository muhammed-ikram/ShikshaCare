const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testKey() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        console.log("Testing model: gemini-1.5-flash");
        const result = await model.generateContent("Hello");
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("Test gemini-1.5-flash Failed:", error.message);
        if (error.status) console.error("Status Code:", error.status);
    }

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        console.log("\nTesting model: gemini-2.0-flash");
        const result = await model.generateContent("Hello");
        console.log("Response:", result.response.text());
    } catch (error) {
        console.error("Test gemini-2.0-flash Failed:", error.message);
    }
}

testKey();
