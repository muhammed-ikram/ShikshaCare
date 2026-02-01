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
};

module.exports = { generateTasks, generateRoadmap, suggestCareers, generateQuiz };
