import { useState, useEffect } from "react";
import api from "../api";
import { CheckCircle, Circle, PlayCircle, BookOpen, Trophy, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import RoadmapChatbot from "../components/RoadmapChatbot";
import QuizModal from "../components/QuizModal";


const RoadmapView = () => {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedSteps, setExpandedSteps] = useState({});
    const [chatbot, setChatbot] = useState({ isOpen: false, level: null });
    const [quiz, setQuiz] = useState({ isOpen: false, topic: "", level: "" });


    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            const res = await api.get("/api/roadmap");
            setRoadmap(res.data.roadmap);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStep = async (stepId) => {
        // Optimistic UI Update
        const updatedSteps = roadmap.steps.map(s =>
            s._id === stepId ? { ...s, isCompleted: !s.isCompleted } : s
        );
        const completedCount = updatedSteps.filter(s => s.isCompleted).length;
        const newProgress = Math.round((completedCount / updatedSteps.length) * 100);

        setRoadmap({ ...roadmap, steps: updatedSteps, overallProgress: newProgress });

        try {
            await api.put(`/api/roadmap/step/${stepId}`);
        } catch (error) {
            console.error("Failed to update step");
            fetchRoadmap(); // Revert
        }
    };

    const startModule = async (stepId) => {
        // Optimistic UI Update
        const updatedSteps = roadmap.steps.map(s =>
            s._id === stepId ? { ...s, isStarted: true } : s
        );
        setRoadmap({ ...roadmap, steps: updatedSteps });
        setExpandedSteps(prev => ({ ...prev, [stepId]: true }));

        try {
            await api.put(`/api/roadmap/step/${stepId}/start`);
        } catch (error) {
            console.error("Failed to start module");
            fetchRoadmap(); // Revert
        }
    };

    const toggleSubModule = async (stepId, subId) => {
        // Optimistic UI Update
        const updatedSteps = roadmap.steps.map(s => {
            if (s._id === stepId) {
                const updatedSubs = s.subModules.map(sub =>
                    sub._id === subId ? { ...sub, isCompleted: !sub.isCompleted } : sub
                );
                return { ...s, subModules: updatedSubs };
            }
            return s;
        });
        setRoadmap({ ...roadmap, steps: updatedSteps });

        try {
            await api.put(`/api/roadmap/step/${stepId}/submodule/${subId}`);
        } catch (error) {
            console.error("Failed to update submodule");
            fetchRoadmap(); // Revert
        }
    };

    const toggleExpand = (stepId) => {
        setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
    };

    const openChatbot = (level) => {
        setChatbot({ isOpen: true, level });
    };

    const openQuiz = (topic, level) => {
        setQuiz({ isOpen: true, topic, level });
    };


    if (loading) return <div className="p-10 text-center">Loading Roadmap...</div>;

    if (!roadmap) return (
        <div className="p-10 text-center">
            <h2 className="text-2xl font-bold text-gray-700">No Roadmap Found</h2>
            <p className="text-gray-500 mb-4">Generate one from the Career Results page.</p>
            <a href="/profile" className="text-primary hover:underline">Go to Profile</a>
        </div>
    );

    const levels = ['Beginner', 'Intermediate', 'Advanced'];

    return (
        <div className="min-h-screen bg-gray-50 p-8 pb-32">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl p-8 shadow-sm mb-8 border border-primary/10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{roadmap.domain} Roadmap</h1>
                            <p className="text-gray-500">Your personalized AI-generated learning path.</p>
                        </div>
                        <div className="text-right">
                            <div className="text-4xl font-bold text-primary">{roadmap.overallProgress}%</div>
                            <div className="text-sm text-gray-400">Completed</div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${roadmap.overallProgress}%` }}
                            className="bg-gradient-to-r from-primary to-accent h-full rounded-full"
                        />
                    </div>
                </div>

                {/* Timeline */}
                <div className="space-y-12">
                    {levels.map((level) => {
                        const levelSteps = roadmap.steps.filter(s => s.level === level);
                        if (levelSteps.length === 0) return null;

                        return (
                            <div key={level} className="relative">
                                <div className="sticky top-4 z-10 bg-gray-50/95 backdrop-blur py-3 mb-6 border-b border-gray-200 flex justify-between items-center rounded-lg px-2">
                                    <h2 className={`text-xl font-bold px-4 py-1 rounded-full inline-block ${level === 'Beginner' ? 'text-green-600 bg-green-50' :
                                        level === 'Intermediate' ? 'text-secondary bg-secondary/10' :
                                            'text-primary bg-primary/10'
                                        }`}>
                                        {level} Level
                                    </h2>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => openChatbot(level)}
                                            className="flex items-center gap-2 text-sm font-medium text-primary hover:bg-primary/5 px-3 py-1.5 rounded-lg transition-colors border border-primary/20"
                                        >
                                            <MessageSquare size={16} />
                                            Ask AI Tutor
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-6 pl-4 border-l-2 border-gray-200 ml-4">
                                    {levelSteps.map((step) => (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            key={step._id}
                                            className={`bg-white rounded-xl border transition-all overflow-hidden ${step.isCompleted ? 'border-green-200 shadow-sm' : 'border-gray-200 shadow-sm hover:shadow-md'
                                                }`}
                                        >
                                            <div className="p-6">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1 pr-4">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="text-gray-400">
                                                                {step.isCompleted ? <CheckCircle size={24} className="text-green-500" /> : <Circle size={24} />}
                                                            </div>
                                                            <h3 className={`text-xl font-bold ${step.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                                {step.title}
                                                            </h3>
                                                        </div>
                                                        <p className="text-gray-600 mb-4 ml-9 text-sm">{step.description}</p>

                                                        {/* Main Resources - Visible only if started */}
                                                        {step.isStarted && (
                                                            <div className="ml-9 flex flex-wrap gap-2 mb-4">
                                                                {step.resources.map((res, i) => (
                                                                    <a
                                                                        key={i}
                                                                        href={res.link}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="flex items-center gap-2 text-sm text-primary hover:text-accent bg-primary/5 px-3 py-1.5 rounded-lg transition-colors"
                                                                    >
                                                                        <PlayCircle size={16} />
                                                                        {res.title || "Watch Tutorial"}
                                                                    </a>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        {!step.isStarted ? (
                                                            <button
                                                                onClick={() => startModule(step._id)}
                                                                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors shadow-sm"
                                                            >
                                                                Start Now
                                                            </button>
                                                        ) : (
                                                            <div className="flex flex-col items-end gap-2">
                                                                <button
                                                                    onClick={() => toggleStep(step._id)}
                                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step.isCompleted
                                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                                        }`}
                                                                >
                                                                    {step.isCompleted ? "Completed" : "Mark Done"}
                                                                </button>
                                                                {step.subModules && step.subModules.length > 0 && (
                                                                    <button
                                                                        onClick={() => toggleExpand(step._id)}
                                                                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mt-2"
                                                                    >
                                                                        {expandedSteps[step._id] ? "Hide Topics" : "View Sub-Topics"}
                                                                        {expandedSteps[step._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                                    </button>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sub-Modules Section */}
                                            <AnimatePresence>
                                                {step.isStarted && step.subModules && step.subModules.length > 0 && (expandedSteps[step._id] || step.isStarted) && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="bg-gray-50 border-t border-gray-100 px-6 py-4 ml-9 border-l-4 border-l-primary/10"
                                                    >
                                                        <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Core Concepts</h4>
                                                        <div className="grid gap-3">
                                                            {step.subModules.map((sub, idx) => (
                                                                <div
                                                                    key={idx}
                                                                    className={`bg-white p-3 rounded-lg border flex justify-between items-center group transition-colors ${sub.isCompleted ? 'border-green-100 bg-green-50/30' : 'border-gray-200 hover:border-primary/30'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => toggleSubModule(step._id, sub._id)}
                                                                            className={`transition-colors ${sub.isCompleted ? 'text-green-500' : 'text-gray-300 hover:text-primary'
                                                                                }`}
                                                                        >
                                                                            {sub.isCompleted ? <CheckCircle size={18} /> : <Circle size={18} />}
                                                                        </button>
                                                                        <div>
                                                                            <div className={`font-semibold text-sm ${sub.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                                                {sub.title}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">{sub.description}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => openQuiz(sub.title, step.level)}
                                                                            className="px-2 py-1 text-[10px] font-bold bg-primary/10 text-primary rounded border border-primary/20 hover:bg-primary hover:text-white transition-all transform hover:scale-105"
                                                                        >
                                                                            Quiz
                                                                        </button>
                                                                        {sub.resources.map((r, ri) => (
                                                                            <a key={ri} href={r.link} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-primary transition-colors bg-gray-50 p-1.5 rounded-md">
                                                                                <BookOpen size={14} />
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Chatbot Portal */}
            <RoadmapChatbot
                isOpen={chatbot.isOpen}
                onClose={() => setChatbot({ ...chatbot, isOpen: false })}
                domain={roadmap.domain}
                level={chatbot.level}
            />
            {/* Quiz Portal */}
            <QuizModal
                isOpen={quiz.isOpen}
                onClose={() => setQuiz({ ...quiz, isOpen: false })}
                topic={quiz.topic}
                level={quiz.level}
            />
        </div>

    );
};

export default RoadmapView;
