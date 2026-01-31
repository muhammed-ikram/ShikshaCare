const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateTasks = async (project) => {
    try {
        const prompt = `
      You are a senior technical project manager. 
      Break down the following software project into a COMPREHENSIVE list of actionable development tasks.
      Organize the tasks by MODULES (e.g., Authentication, Database, Frontend, Backend, Deployment).
      
      Project Title: ${project.title}
      Description: ${project.description}
      Tech Stack: ${project.techStack.join(', ')}
      
      Return ONLY a JSON array of objects with the following structure (no markdown, just raw json):
      [
        { "module": "Module Name", "title": "Task Title", "description": "Brief actionable description", "priority": "High/Medium/Low" }
      ]
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 2000 // Increase token limit for longer plans
        });

        const content = completion.choices[0].message.content;
        // Clean up potential markdown code blocks if any
        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanJson);
    } catch (error) {
        console.error("OpenAI Error:", error);

        // Smart Fallback based on tech stack (mimics AI behavior without quota)
        const stack = project.techStack.map(t => t.toLowerCase().trim());
        const tasks = [
            { module: "Project Management", title: "Initialize Repository", description: "Set up Git, .gitignore, and README.md", priority: "High" },
            { module: "Database", title: "Design Database Schema", description: "Define models and relationships", priority: "High" },
            { module: "Backend", title: "Setup Server Architecture", description: "Initialize Node.js/Express server structure", priority: "High" },
            { module: "Backend", title: "Implement Auth Routes", description: "Login, Register, and JWT handling", priority: "High" },
        ];

        if (stack.some(t => t.includes('react') || t.includes('vue') || t.includes('next'))) {
            tasks.push(
                { module: "Frontend", title: "Setup UI Framework", description: "Initialize React/Vue project and install dependencies", priority: "High" },
                { module: "Frontend", title: "Create Reusable Components", description: "Button, Input, and Layout components", priority: "Medium" },
                { module: "Frontend", title: "Implement State Management", description: "Setup Redux or Context API", priority: "Medium" }
            );
        }

        if (stack.some(t => t.includes('mongo'))) {
            tasks.push({ module: "Database", title: "Connect MongoDB", description: "Setup Mongoose connection and env variables", priority: "High" });
        }

        // Add general completion tasks
        tasks.push(
            { module: "Testing", title: "Test API Endpoints", description: "Verify all backend routes with Postman", priority: "Medium" },
            { module: "Deployment", title: "Dockerize Application", description: "Create Dockerfile and docker-compose.yml", priority: "Low" }
        );

        return tasks;
    }
};

module.exports = { generateTasks };
