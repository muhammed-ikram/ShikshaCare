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
      You are an expert technical curriculum lead. Create a DEEP-DIVE technical learning roadmap for: ${domain}.
      Divide into 3 levels: Beginner, Intermediate, Advanced.
      
      CRITICAL INSTRUCTIONS:
      - Use INDUSTRY-STANDARD technical terms (e.g., instead of "Web Basics", use "Semantic HTML5, CSS Grid/Flexbox, and ES6+ Fundamentals").
      - For each main module, you MUST break it down into 4-6 granular, real-world technical sub-topics (subModules).
      - Sub-modules should represent actual implementation concepts (e.g., "State Synchronization", "JWT Authentication flow", "Database Indexing Strategies").
      - Provide a specific YouTube tutorial link for each MAIN module.

      Return ONLY a JSON array of objects with this structure (no markdown):
      [
        { 
          "level": "Beginner", 
          "title": "Precise Technical Module Title", 
          "description": "Professional overview of the core competency", 
          "resources": [{ "title": "Main Tutorial", "link": "https://youtube.com/..." }],
          "subModules": [
             {
               "title": "Granular Technical Topic", 
               "description": "Technical depth and real-world usage",
               "resources": [{ "title": "In-depth Guide", "link": "..." }]
             }
          ]
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

        const isWeb = domain.toLowerCase().includes('web') || domain.toLowerCase().includes('stack');
        const isData = domain.toLowerCase().includes('data') || domain.toLowerCase().includes('ai');

        return [
            {
                level: 'Beginner',
                title: isWeb ? 'Frontend Foundations' : isData ? 'Python for Data Science' : 'Core Fundamentals',
                description: 'Build a strong professional foundation.',
                resources: [{ title: 'Main Guide', link: 'https://www.youtube.com/results?search_query=' + domain + '+beginner' }],
                subModules: [
                    { title: 'Core Syntax & Logic', description: 'Technical implementation details.', resources: [] },
                    { title: 'Environment Setup', description: 'Tooling and workflow.', resources: [] }
                ]
            },
            {
                level: 'Intermediate',
                title: isWeb ? 'Modern Frameworks' : isData ? 'Machine Learning Lifecycle' : 'Intermediate Concepts',
                description: 'Industry-standard tools and practices.',
                resources: [{ title: 'Deep Dive', link: 'https://www.youtube.com/results?search_query=' + domain + '+intermediate' }],
                subModules: [
                    { title: 'Advanced State Patterns', description: 'Data flow and optimization.', resources: [] },
                    { title: 'API & External Data', description: 'Connectivity and integration.', resources: [] }
                ]
            },
            {
                level: 'Advanced',
                title: isWeb ? 'Enterprise Scalability' : isData ? 'Deep Learning Systems' : 'Advanced Systems',
                description: 'Production-ready architecture.',
                resources: [{ title: 'The Masterclass', link: 'https://www.youtube.com/results?search_query=' + domain + '+advanced' }],
                subModules: [
                    { title: 'DevOps & Deployment', description: 'CI/CD and monitoring.', resources: [] },
                    { title: 'Security Architectures', description: 'Advanced protection strategies.', resources: [] }
                ]
            }
        ];
    }
};

const suggestCareers = async (profile) => {
    try {
        const prompt = `
      As a career guidance AI, analyze the following student profile and suggest the TOP 3 HIGH-POTENTIAL career paths.
      The suggestions must be DYNAMIC and based on their specific interests. 
      If they mentioned "Blockchain", suggest Blockchain roles. If "IOT", suggest IOT roles. 
      Do NOT default to "Web Developer" unless it matches their profile.

      Student Profile:
      - Interests: ${profile.academicBaseline.techInterests.join(', ')}
      - Programming Languages: ${profile.academicBaseline.programmingLanguages.join(', ')}
      - Learning Style: ${profile.learningStyle.primaryStyle}
      - Current Education: ${profile.personalInfo.education}

      Return ONLY a JSON array of 3 objects with this structure (no markdown):
      [
        {
          "title": "Career Title",
          "description": "Short explanation of the role",
          "requiredSkills": ["Skill 1", "Skill 2"],
          "averageSalary": "Expected Range (LPAs)",
          "growthOutlook": "High/Stable/Exponential",
          "matchScore": 95,
          "matchReasons": ["Why it matches interest X", "Why it matches style Y"]
        }
      ]
    `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a professional career advisor." }, { role: "user", content: prompt }],
            model: "gpt-3.5-turbo",
            max_tokens: 1500
        });

        const content = completion.choices[0].message.content;
        const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleanJson);

    } catch (error) {
        console.error("AI Profiling Error:", error);
        // Better fallback than just static names
        return [
            {
                title: profile.academicBaseline.techInterests[0] || "Software Engineer",
                description: "Focused on your primary interest.",
                requiredSkills: profile.academicBaseline.programmingLanguages,
                averageSalary: "6-12 LPA",
                growthOutlook: "High",
                matchScore: 80,
                matchReasons: ["Based on your interest in " + (profile.academicBaseline.techInterests[0] || "technology")]
            },
            {
                title: "Full Stack Developer",
                description: "Versatile role building end-to-end applications.",
                requiredSkills: ["JavaScript", "Node.js", "React"],
                averageSalary: "5-10 LPA",
                growthOutlook: "Stable",
                matchScore: 70,
                matchReasons: ["Matches general software interest"]
            },
            {
                title: "Specialist in " + (profile.academicBaseline.programmingLanguages[0] || "Development"),
                description: "Expertise in specific technical domain.",
                requiredSkills: profile.academicBaseline.programmingLanguages,
                averageSalary: "7-14 LPA",
                growthOutlook: "High",
                matchScore: 75,
                matchReasons: ["Matches your core skills"]
            }
        ];
    }
};

module.exports = { generateTasks, generateRoadmap, suggestCareers };
