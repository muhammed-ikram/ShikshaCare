import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Code, Layers, Server, Cpu } from 'lucide-react';

const questions = [
    {
        id: 1,
        question: "What interests you the most?",
        options: [
            { text: "Building visual interfaces users interact with", role: "Frontend" },
            { text: "Designing backend logic and databases", role: "Backend" },
            { text: "Analyzing data to find patterns", role: "Data Science" },
            { text: "Connecting devices and sensors", role: "IoT" },
        ]
    },
    {
        id: 2,
        question: "Which type of problem do you enjoy solving?",
        options: [
            { text: "Fixing layout alignment issues", role: "Frontend" },
            { text: "Optimizing API response times", role: "Backend" },
            { text: "Cleaning and processing large datasets", role: "Data Science" },
            { text: "Optimizing power consumption in devices", role: "IoT" },
        ]
    },
    {
        id: 3,
        question: "Pick a technology stack that sounds cool:",
        options: [
            { text: "React, Tailwind, Figma", role: "Frontend" },
            { text: "Node.js, Express, MongoDB", role: "Backend" },
            { text: "Python, Pandas, TensorFlow", role: "Data Science" },
            { text: "C++, Arduino, Raspberry Pi", role: "IoT" },
        ]
    },
    {
        id: 4,
        question: "What's your preferred work style?",
        options: [
            { text: "Visual and creative", role: "Frontend" },
            { text: "Logical and structural", role: "Backend" },
            { text: "Analytical and mathematical", role: "Data Science" },
            { text: "Hardware-oriented and experimental", role: "IoT" },
        ]
    },
    {
        id: 5,
        question: "What would you like to build right now?",
        options: [
            { text: "A beautiful portfolio website", role: "Frontend" },
            { text: "A secure authentication system", role: "Backend" },
            { text: "A stock price predictor", role: "Data Science" },
            { text: "A smart home automation system", role: "IoT" },
        ]
    }
];

const CareerQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState([]);
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        const newAnswers = [...answers, option];
        setAnswers(newAnswers);

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            // Logic to determine result would go here (mocked for now)
            // For static demo, we'll assume a fixed path or just pass the most frequent
            navigate('/roadmap', { state: { result: "Full Stack Developer" } });
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-indigo-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Career Mapping AI</h2>
                    <p className="text-indigo-100 mt-2">Discover your ideal tech career path in 5 questions.</p>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 h-2">
                    <motion.div
                        className="bg-indigo-500 h-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Question Area */}
                <div className="p-8">
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h3 className="text-xl font-semibold text-gray-800 mb-6">
                            {currentQuestion + 1}. {questions[currentQuestion].question}
                        </h3>

                        <div className="grid gap-4">
                            {questions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionClick(option)}
                                    className="p-4 border-2 border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left flex items-center group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                        <span className="font-semibold">{String.fromCharCode(65 + index)}</span>
                                    </div>
                                    <span className="text-gray-700 font-medium group-hover:text-indigo-700">{option.text}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                <div className="p-6 bg-gray-50 border-t flex justify-between text-sm text-gray-500">
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>ShikshaCare AI</span>
                </div>
            </div>
        </div>
    );
};

export default CareerQuiz;
