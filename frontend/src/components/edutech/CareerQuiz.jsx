import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Users, PenTool, BarChart2, Zap } from 'lucide-react';

// General Aptitude Questions (RIASEC simplified)
const questions = [
    {
        id: 1,
        question: "What kind of problems do you enjoy solving?",
        options: [
            { text: "Helping people resolve personal or social issues", type: "Social" },
            { text: "Fixing broken objects or understanding how things work", type: "Realistic" },
            { text: "Analyzing data and finding logical patterns", type: "Investigative" },
            { text: "Creating beautiful designs or artistic expressions", type: "Artistic" },
        ]
    },
    {
        id: 2,
        question: "In a group project, what role do you naturally take?",
        options: [
            { text: "The Presenter - communicating ideas", type: "Social" },
            { text: "The Builder - making the prototype", type: "Realistic" },
            { text: "The Researcher - gathering facts", type: "Investigative" },
            { text: "The Designer - making it look good", type: "Artistic" },
        ]
    },
    {
        id: 3,
        question: "What subject topics interest you most?",
        options: [
            { text: "Psychology, History, or Literature", type: "Social" },
            { text: "Engineering, Mechanics, or Sports", type: "Realistic" },
            { text: "Math, Physics, or Economics", type: "Investigative" },
            { text: "Art, Music, or Creative Writing", type: "Artistic" },
        ]
    },
    {
        id: 4,
        question: "How do you prefer to work?",
        options: [
            { text: "Collaborating in a team discussion", type: "Social" },
            { text: "Hands-on with tools or equipment", type: "Realistic" },
            { text: "Quietly analyzing complex problems", type: "Investigative" },
            { text: "Unstructured and free-flowing", type: "Artistic" },
        ]
    },
    {
        id: 5,
        question: "Pick a potential career activity:",
        options: [
            { text: "Teaching or Counseling others", type: "Social" },
            { text: "Building structures or repairing systems", type: "Realistic" },
            { text: "Conducting scientific experiments", type: "Investigative" },
            { text: "Writing a novel or directing a play", type: "Artistic" },
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
            // Logic to determine result (Simple majority)
            // For static demo, we'll map the last answer or dominant type to a generic role
            const type = option.type;
            let role = "General Strategist";
            if (type === "Social") role = "Human Relations Specialist";
            if (type === "Realistic") role = "Structural Engineer / Technician";
            if (type === "Investigative") role = "Research Analyst";
            if (type === "Artistic") role = "Creative Director";

            navigate('/roadmap', { state: { result: role } });
        }
    };

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center">
                    <h2 className="text-2xl font-bold">Career Discovery Engine</h2>
                    <p className="text-indigo-100 mt-2">Uncover your strengths, no matter your field.</p>
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
