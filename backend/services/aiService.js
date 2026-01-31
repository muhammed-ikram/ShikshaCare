const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

console.log("AI Service Initialized. API Key present:", !!process.env.OPENAI_API_KEY);

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



const generateRoadmap = async (domain) => {
    try {
        const prompt = `
      You are a career coach. Create a step-by-step learning roadmap for: ${domain}.
      Divide into 3 levels: Beginner, Intermediate, Advanced.
      For each step, provide a topic, brief description, and ONE free YouTube resource link (real or search query format).
      
      Return ONLY a JSON array of objects with this structure:
      [
        { 
          "level": "Beginner", 
          "title": "Topic Title", 
          "description": "What to learn", 
          "resources": [{ "title": "Resource Name", "link": "https://youtube.com/results?search_query=topic" }] 
        }
      ]
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a helpful assistant that outputs JSON." }, { role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 2500
        });

        const content = completion.choices[0].message.content;
        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("OpenAI Error (Roadmap):", error);

        // Smart Fallback
        const isWeb = domain.toLowerCase().includes('web') || domain.toLowerCase().includes('stack');
        const isData = domain.toLowerCase().includes('data') || domain.toLowerCase().includes('ai');

        const steps = [];

        // Beginner
        steps.push({
            level: 'Beginner',
            title: isWeb ? 'HTML/CSS/JS Basics' : isData ? 'Python Basics' : 'Core Fundamentals',
            description: 'Master the building blocks of the language and environment.',
            resources: [{ title: 'Crash Course', link: 'https://www.youtube.com/results?search_query=crash+course+' + domain }]
        });

        // Intermediate
        steps.push({
            level: 'Intermediate',
            title: isWeb ? 'Frontend Frameworks (React)' : isData ? 'Pandas & NumPy' : 'Intermediate Concepts',
            description: 'Learn standard libraries and frameworks used in industry.',
            resources: [{ title: 'Deep Dive', link: 'https://www.youtube.com/results?search_query=intermediate+' + domain }]
        });

        // Advanced
        steps.push({
            level: 'Advanced',
            title: isWeb ? 'Backend & Deployment' : isData ? 'Machine Learning Models' : 'Advanced Architecture',
            description: 'Build complex systems and deploy them.',
            resources: [{ title: 'Advanced Tutorial', link: 'https://www.youtube.com/results?search_query=advanced+' + domain }]
        });

        return steps;
    }
};

module.exports = { generateTasks, generateRoadmap };
