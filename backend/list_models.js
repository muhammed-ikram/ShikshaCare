const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;

async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
        console.log("Written to models.json");

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
