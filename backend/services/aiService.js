const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const OpenAI = require("openai");

const GEMINI_KEY = process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.trim() : null;
const OPENAI_KEY = process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.trim() : null;

const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const openai = new OpenAI({ apiKey: OPENAI_KEY });

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
  safetySettings
});

console.log(`AI Service Initialized. Key Lengths - Gemini: ${GEMINI_KEY?.length || 0}, OpenAI: ${OPENAI_KEY?.length || 0}`);

const cleanAIResponse = (text) => {
  try {
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
  console.log(`AI: Running generateTasks for ${project.title} (MOCK MODE ENABLED)`);
  return [
    { module: "Project Management", title: "Initialize Development Environment", description: "Set up the local IDE, Git repository, and core dependencies.", priority: "High" },
    { module: "Frontend", title: "Build Core UI Components", description: "Implement the primary dashboard and navigation system.", priority: "High" },
    { module: "Backend", title: "API Endpoint Construction", description: "Develop the RESTful services for data persistence.", priority: "Medium" },
    { module: "DevOps", title: "Initial CI/CD Pipeline", description: "Configure automated testing and deployment triggers.", priority: "Low" }
  ];
};

const generateRoadmap = async (domain) => {
  console.log(`AI: Running generateRoadmap for ${domain} (MOCK MODE ENABLED)`);
  return [
    {
      level: "Beginner",
      title: "Foundations of " + domain,
      description: "Master the fundamental concepts and tools required for " + domain + ".",
      resources: [{ title: "Comprehensive Getting Started Guide", link: "https://youtube.com/results?search_query=" + domain + "+beginner+tutorial" }],
      subModules: [
        { title: "Introduction & Setup", description: "Configuring your development environment.", resources: [] },
        { title: "Syntax & Core Principles", description: "Understanding basic building blocks.", resources: [] }
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
          "resources": [{ "title": "Main Tutorial", "link": "https://youtube.com/results?search_query=..." }],
          "subModules": [
             {
               "title": "Granular Technical Topic", 
               "description": "Technical depth and real-world usage",
               "resources": [{ "title": "In-depth Guide", "link": "..." }]
             }
          ]
        }
      ]
    },
    {
      level: "Intermediate",
      title: "Advanced Implementation",
      description: "Building complex systems and optimizing performance.",
      resources: [{ title: "Deep Dive Series", link: "https://youtube.com/results?search_query=" + domain + "+intermediate+tutorial" }],
      subModules: [
        { title: "Pattern Architecture", description: "Applying industry-standard design patterns.", resources: [] },
        { title: "State Management", description: "Handling complex data flow.", resources: [] }
      ]
    },
    {
      level: "Advanced",
      title: "Mastery & Expertise",
      description: "Pushing the boundaries of " + domain + " with cutting-edge techniques.",
      resources: [{ title: "Expert Level Masterclass", link: "https://youtube.com/results?search_query=" + domain + "+advanced+tutorial" }],
      subModules: [
        { title: "Scalability & Security", description: "Preparing applications for production scale.", resources: [] },
        { title: "Future Trends", description: "Exploring upcoming features and innovations.", resources: [] }
      ]
    }
  ];
};

const suggestCareers = async (profile) => {
  console.log("AI: Running suggestCareers (MOCK MODE ENABLED)");
  return [
    {
      title: "AI Solutions Architect",
      description: "Designing the future of intelligent systems.",
      requiredSkills: ["React", "Python", "LLMs"],
      matchReasons: ["High analytical score", "Tech enthusiast"],
      averageSalary: "15-25 LPA",
      growthOutlook: "Exponential"
    },
    {
      title: "Full Stack Developer",
      description: "Building end-to-end modern web applications.",
      requiredSkills: ["Next.js", "Node.js", "MongoDB"],
      matchReasons: ["Practical builder", "Creative problem solver"],
      averageSalary: "10-18 LPA",
      growthOutlook: "High"
    }
  ];
};

const generateQuiz = async (topic, level) => {
  console.log(`AI: Running generateQuiz for ${topic} (MOCK MODE ENABLED)`);
  return [
    {
      question: `What is a primary concept in Beginner ${topic}?`,
      options: ["Syntactic Sugar", "Functional Programming", "Variable Declaration", "Memory Management"],
      correctAnswer: 2,
      explanation: "Variable declaration is a fundamental starting point in almost all technical domains."
    },
    {
      question: `How do we handle state in Intermediate ${topic}?`,
      options: ["Global Variables", "Stateless Functions", "State Management Libraries", "Local Storage Only"],
      correctAnswer: 2,
      explanation: "Libraries provide scalable ways to manage complex state transitions."
    },
    {
      question: `Which approach ensures high availability in Advanced ${topic}?`,
      options: ["Single Server", "Redundancy and Failover", "Manual Backups", "Low Traffic Only"],
      correctAnswer: 1,
      explanation: "Redundancy is critical for production-grade reliability."
    },
    {
      question: `What is the most effective way to optimize ${topic}?`,
      options: ["Adding more code", "Complexity increase", "Caching and Refactoring", "Ignoring errors"],
      correctAnswer: 2,
      explanation: "Caching improves speed while refactoring improves maintainability."
    },
    {
      question: `Future trends in ${topic} primarily focus on?`,
      options: ["Legacy systems", "Interoperability and AI", "Single-threaded execution", "Hardcoded values"],
      correctAnswer: 1,
      explanation: "Modern tech is moving towards integration and automation."
    }
  ];
  try {
    const prompt = `
      As a career guidance AI, analyze the following student profile and suggest the TOP 3 HIGH-POTENTIAL career paths.
      Be dynamic! If they like Blockchain, suggest Blockchain. If IOT, suggest IOT.

      Student Profile:
      - Interests: ${profile.academicBaseline.techInterests.join(', ')}
      - Languages: ${profile.academicBaseline.programmingLanguages.join(', ')}
      - Learning Style: ${profile.learningStyle.primaryStyle}
      - Current Education: ${profile.personalInfo.education}

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
    return [
      {
        title: profile.academicBaseline.techInterests[0] || "Software Engineer",
        description: "Focused on your primary interest.",
        requiredSkills: profile.academicBaseline.programmingLanguages,
        averageSalary: "6-12 LPA",
        growthOutlook: "High",
        matchScore: 80,
        matchReasons: ["Based on your interest in " + (profile.academicBaseline.techInterests[0] || "technology")]
      }
    ];
  }
};

const generateQuiz = async (topic, level) => {
  try {
    console.log(`Generating quiz for Topic: ${topic}, Level: ${level}`);
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
        temperature: 0.9,
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
    }

    return parsed;

  } catch (error) {
    console.error("Gemini Error (Quiz):", error);
    const pool = [
      { question: `In production, how should ${topic} be optimized for ${level} performance?`, options: ["Resource allocation", "Dependency minimization", "Efficient caching", "Complexity reduction"], correctAnswer: 2, explanation: "Caching is usually the first line of defense." },
      { question: `Which security vulnerability is most common in ${topic}?`, options: ["Injection", "Insecure Config", "Weak Auth", "All of the above"], correctAnswer: 3, explanation: "Multiple vectors exist." },
      { question: `What is the reliable way to handle ${topic} state?`, options: ["Local only", "Global management", "Prop drilling", "Static vars"], correctAnswer: 1, explanation: "Global state ensures consistency." },
      { question: `Standard tool for monitoring ${topic}?`, options: ["Prometheus", "Standard Logs", "Manual check", "Basic Alerts"], correctAnswer: 0, explanation: "Prometheus is an industry standard." },
      { question: `Key benefit of modular ${topic}?`, options: ["Debugging", "Execution speed", "File size", "Less code"], correctAnswer: 0, explanation: "Modularity improves maintainability." }
    ];
    return pool.sort(() => 0.5 - Math.random()).slice(0, 5);
  }
};

module.exports = { generateTasks, generateRoadmap, suggestCareers, generateQuiz };
