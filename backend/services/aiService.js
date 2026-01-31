const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTasks = async (project) => {
    try {
        const prompt = `
      You are a senior technical project manager. 
      Break down the following software project into 8-12 actionable development tasks.
      
      Project Title: ${project.title}
      Description: ${project.description}
      Tech Stack: ${project.techStack.join(', ')}
      
      Return ONLY a JSON array of objects with the following structure (no markdown, just raw json):
      [
        { "title": "Task Title", "description": "Brief actionable description", "priority": "High/Medium/Low" }
      ]
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
        });

        const content = completion.choices[0].message.content;
        // Clean up potential markdown code blocks if any
        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("OpenAI Error:", error);
        // Fallback if API fails or key is missing
        return [
            { title: "Initialize Project", description: "Setup the repository and base structure", priority: "High" },
            { title: "Design Database", description: "Create schema diagrams", priority: "High" },
            { title: "Setup Backend", description: "Initialize server and routes", priority: "Medium" },
            { title: "Setup Frontend", description: "Initialize UI framework", priority: "Medium" }
        ];
    }
};

module.exports = { generateTasks };
