import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Lock, ArrowRight, Play, Book, Code } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roadmapSteps = [
    {
        id: 1,
        title: "Introduction to HTML & CSS",
        description: "Learn the building blocks of the web.",
        status: "completed",
        type: "foundation",
        duration: "2 Days"
    },
    {
        id: 2,
        title: "JavaScript Basics",
        description: "Understand variables, loops, and functions.",
        status: "current",
        type: "core",
        duration: "4 Days"
    },
    {
        id: 3,
        title: "DOM Manipulation",
        description: "Learn how to make pages interactive.",
        status: "locked",
        type: "practice",
        duration: "3 Days"
    },
    {
        id: 4,
        title: "React Fundamentals",
        description: "Components, Props, and State.",
        status: "locked",
        type: "framework",
        duration: "1 Week"
    },
    {
        id: 5,
        title: "Build a Portfolio Project",
        description: "Create a personal portfolio website.",
        status: "locked",
        type: "project",
        duration: "1 Week"
    }
];

const RoadmapView = () => {
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(2); // Mocking active step

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Your Learning Roadmap</h1>
                        <p className="text-gray-600 mt-2">Target Career: <span className="font-semibold text-indigo-600">Frontend Developer</span></p>
                    </div>
                    <button
                        onClick={() => navigate('/home')}
                        className="text-gray-500 hover:text-indigo-600 font-medium"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <div className="space-y-8 relative">
                        {/* Vertical Line */}
                        <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gray-200 z-0"></div>

                        {roadmapSteps.map((step, index) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative z-10 flex items-start group"
                            >
                                {/* Status Icon */}
                                <div className={`
                            w-16 h-16 rounded-full flex items-center justify-center border-4 flex-shrink-0 z-10 bg-white
                            ${step.status === 'completed' ? 'border-green-500 text-green-500' :
                                        step.status === 'current' ? 'border-indigo-500 text-indigo-500' : 'border-gray-200 text-gray-300'}
                        `}>
                                    {step.status === 'completed' ? <CheckCircle className="w-8 h-8" /> :
                                        step.status === 'current' ? <Play className="w-8 h-8 fill-current" /> :
                                            <Lock className="w-8 h-8" />}
                                </div>

                                {/* Content Card */}
                                <div className={`
                            ml-6 flex-1 rounded-xl p-6 border-2 transition-all cursor-pointer
                            ${step.status === 'current' ? 'border-indigo-500 shadow-md bg-indigo-50' :
                                        step.status === 'locked' ? 'border-gray-100 bg-gray-50 opacity-70' : 'border-green-100 bg-green-50'}
                        `}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`text-xl font-bold ${step.status === 'locked' ? 'text-gray-500' : 'text-gray-900'}`}>{step.title}</h3>
                                        <span className="text-xs font-semibold px-2 py-1 rounded bg-white border text-gray-500">{step.duration}</span>
                                    </div>
                                    <p className="text-gray-600 mb-4">{step.description}</p>

                                    {step.status === 'current' && (
                                        <div className="flex gap-3 mt-4">
                                            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                                                <BookOpen className="w-4 h-4" /> Start Lesson
                                            </button>
                                            <button className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:border-indigo-500 transition">
                                                <Code className="w-4 h-4" /> Practice Quiz
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadmapView;
