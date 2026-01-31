const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

exports.generateContent = async (prompt) => {
    try {
        const response = await axios.post(URL, {
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                response_mime_type: "application/json"
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.data && response.data.candidates && response.data.candidates.length > 0) {
            const text = response.data.candidates[0].content.parts[0].text;
            console.log("Raw AI Response (Gemini):", text);

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
            return JSON.parse(text);
        } else {
            throw new Error("No response from Gemini");
        }
    } catch (error) {
        console.error("Gemini Error:", error.response ? error.response.data : error.message);
        console.log("Switching to OpenAI Fallback...");
        return await generateOpenAI(prompt);
    }
};

const generateOpenAI = async (prompt) => {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    const URL = 'https://api.openai.com/v1/chat/completions';

    try {
        const response = await axios.post(URL, {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful career counselor. Output strict JSON." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const text = response.data.choices[0].message.content;
            console.log("Raw AI Response (OpenAI):", text);

            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) return JSON.parse(jsonMatch[0]);
            return JSON.parse(text);
        } else {
            throw new Error("No response from OpenAI");
        }
    } catch (err) {
        console.error("OpenAI Error:", err.response ? err.response.data : err.message);
        throw new Error("Both AI services failed. Please try again later.");
    }
};
