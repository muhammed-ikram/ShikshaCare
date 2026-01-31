const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  safetySettings
});

console.log("AI Service (Gemini) Initialized with Safety Settings.");

const cleanAIResponse = (text) => {
  try {
    // Robustly find JSON array or object
    const jsonStart = text.indexOf('[');
    const jsonEnd = text.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      return text.substring(jsonStart, jsonEnd + 1);
    }
    return text.replace(/```json/g, '').replace(/```/g, '').trim();
  } catch (e) {
    return text;
  }
};

const generateTasks = async (project) => {
  try {
    const prompt = `
      You are a senior technical project manager. 
      Break down the following software project into a COMPREHENSIVE list of actionable development tasks.
      Organize the tasks by MODULES (e.g., Authentication, Database, Frontend, Backend, Deployment).
      
      Project Title: ${project.title}
      Description: ${project.description}
      Tech Stack: ${project.techStack.join(', ')}
      
      Return ONLY a JSON array of objects with the following structure:
      [
        { "module": "Module Name", "title": "Task Title", "description": "Brief actionable description", "priority": "High/Medium/Low" }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanJson = cleanAIResponse(response.text());
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Error (Tasks):", error);
    // Fallback
    const stack = project.techStack.map(t => t.toLowerCase().trim());
    const tasks = [
      { module: "Project Management", title: "Initialize Repository", description: "Set up Git, .gitignore, and README.md", priority: "High" },
      { module: "Database", title: "Design Database Schema", description: "Define models and relationships", priority: "High" },
      { module: "Backend", title: "Setup Server Architecture", description: "Initialize Node.js/Express server structure", priority: "High" },
      { module: "Backend", title: "Implement Auth Routes", description: "Login, Register, and JWT handling", priority: "High" },
    ];
    if (stack.some(t => t.includes('react'))) tasks.push({ module: "Frontend", title: "Setup UI Framework", description: "Initialize React", priority: "High" });
    return tasks;
  }
};

const generateRoadmap = async (domain) => {
  try {
    const prompt = `
    try {
        const prompt = `
      You are an expert technical curriculum lead. Create a DEEP-DIVE technical learning roadmap for: ${domain}.
      Divide into 3 levels: Beginner, Intermediate, Advanced.
      
      CRITICAL INSTRUCTIONS:
      - Use INDUSTRY-STANDARD technical terms.
      - Each level should have 3-5 main modules (steps).
      - For each main module, break it down into 4-6 granular, real-world technical sub-topics (subModules).
      - Sub-modules should represent actual implementation concepts.
      - Provide a specific YouTube tutorial link for each MAIN module.

      Return ONLY a JSON array of objects with this structure:
      - Use INDUSTRY-STANDARD technical terms (e.g., instead of "Web Basics", use "Semantic HTML5, CSS Grid/Flexbox, and ES6+ Fundamentals").
      - For each main module, you MUST break it down into 4-6 granular, real-world technical sub-topics (subModules).
      - Sub-modules should represent actual implementation concepts (e.g., "State Synchronization", "JWT Authentication flow", "Database Indexing Strategies").
      - Provide a specific YouTube tutorial link for each MAIN module.

      Return ONLY a JSON array of objects with this structure (no markdown):
      [
        { 
          "level": "Beginner", 
          "title": "Precise Technical Module Title", 
          "description": "Professional overview", 
          "description": "Professional overview of the core competency", 
          "resources": [{ "title": "Main Tutorial", "link": "https://youtube.com/..." }],
          "subModules": [
             {
               "title": "Granular Technical Topic", 
               "description": "Technical depth",
               "description": "Technical depth and real-world usage",
               "resources": [{ "title": "In-depth Guide", "link": "..." }]
             }
          ]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanJson = cleanAIResponse(response.text());
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Error (Roadmap):", error);
    return [
      {
        level: 'Beginner',
        title: 'Core Fundamentals',
        description: 'Build a strong foundation.',
        resources: [{ title: 'Intro', link: 'https://youtube.com' }],
        subModules: [{ title: 'Basic Syntax', description: 'Getting started', resources: [] }]
      }
    ];
  }
};

const suggestCareers = async (profile) => {
  try {
    const prompt = `
      As a career guidance AI, analyze the following student profile and suggest the TOP 3 HIGH-POTENTIAL career paths.
      Be dynamic! If they like Blockchain, suggest Blockchain. If IOT, suggest IOT.

      Student Profile:
      - Interests: ${profile.academicBaseline.techInterests.join(', ')}
      - Languages: ${profile.academicBaseline.programmingLanguages.join(', ')}
      - Learning Style: ${profile.learningStyle.primaryStyle}

      Return ONLY a JSON array of 3 objects:
      [
        {
          "title": "Career Title",
          "description": "Explanation",
          "requiredSkills": ["Skill 1", "Skill 2"],
          "averageSalary": "Range",
          "growthOutlook": "Outlook",
          "matchScore": 95,
          "matchReasons": ["Reason 1", "Reason 2"]
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const cleanJson = cleanAIResponse(response.text());
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Gemini Error (Careers):", error);
    return [];
  }
};

const generateQuiz = async (topic, level) => {
  try {
    console.log(`Generating quiz for Topic: ${topic}, Level: ${level}`);
    // Add a random seed element to ensure variety even with same parameters
    const seed = Math.random().toString(36).substring(7);
    const twists = ["security and vulnerabilities", "performance optimization", "real-world debugging", "architecture and design patterns", "edge-case handling"];
    const twist = twists[Math.floor(Math.random() * twists.length)];

    const prompt = `
      You are a senior technical interviewer. Create a challenging, UNIQUE 5-question multiple-choice quiz (MCQ) for the topic: "${topic}" at the ${level} level.
      Variation Focus: ${twist}
      Variation ID: ${seed}
      
      CRITICAL REQUIREMENTS:
      1. Each question MUST be different from previous sessions. Focus HEAVILY on the '${twist}' aspect of ${topic}.
      2. No generic questions. Use complex technical scenarios.
      3. Provide 4 distinct options with exactly one correct answer.
      4. Ensure you return exactly 5 questions.

      Return ONLY a JSON array of 5 objects (no markdown blocks):
      [
        {
          "question": "The question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": 0,
          "explanation": "Technical reasoning for the correct answer."
        }
      ]
    `;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9, // Higher temperature for more variety
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2000,
      }
    });

    const response = await result.response;
    const text = response.text();
    console.log("Raw AI Response received");

    const cleanJson = cleanAIResponse(text);
    const parsed = JSON.parse(cleanJson);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      throw new Error("Invalid format: Not an array or empty");
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

    console.log(`Successfully generated ${parsed.length} questions`);
    return parsed;

  } catch (error) {
    console.error("Gemini Error (Quiz):", error);
    // Robust randomized 5-question fallback
    const pool = [
      { question: `In production, how should ${topic} be optimized for ${level} performance?`, options: ["Resource allocation", "Dependency minimization", "Efficient caching", "Complexity reduction"], correctAnswer: 2, explanation: "Caching is usually the first line of defense." },
      { question: `Which security vulnerability is most common in ${topic}?`, options: ["Injection", "Insecure Config", "Weak Auth", "All of the above"], correctAnswer: 3, explanation: "Multiple vectors exist." },
      { question: `What is the reliable way to handle ${topic} state?`, options: ["Local only", "Global management", "Prop drilling", "Static vars"], correctAnswer: 1, explanation: "Global state ensures consistency." },
      { question: `Standard tool for monitoring ${topic}?`, options: ["Prometheus", "Standard Logs", "Manual check", "Basic Alerts"], correctAnswer: 0, explanation: "Prometheus is an industry standard." },
      { question: `Key benefit of modular ${topic}?`, options: ["Debugging", "Execution speed", "File size", "Less code"], correctAnswer: 0, explanation: "Modularity improves maintainability." },
      { question: `In ${level} level ${topic}, how do we handle concurrency?`, options: ["Locking", "Queueing", "Isolated instances", "Depends on platform"], correctAnswer: 2, explanation: "Isolation allows scale." },
      { question: `Best practice for ${topic} versioning?`, options: ["Semantic versioning", "Sequential", "Random", "Date-based"], correctAnswer: 0, explanation: "SemVer is the industry standard." },
      { question: `Primary risk of not updating ${topic} dependencies?`, options: ["Security flaws", "Minor bugs", "Slow speed", "Style issues"], correctAnswer: 0, explanation: "Outdated packages are major security risks." }
    ];
    // Shuffle and take 5
    return pool.sort(() => 0.5 - Math.random()).slice(0, 5);
  }
};

module.exports = { generateTasks, generateRoadmap, suggestCareers, generateQuiz };
module.exports = { generateTasks, generateRoadmap, suggestCareers };
