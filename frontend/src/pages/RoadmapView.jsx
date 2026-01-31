import { useState, useEffect } from "react";
import api from "../api";
import { CheckCircle, Circle, PlayCircle, BookOpen, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const RoadmapView = () => {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);

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
        <div className="min-h-screen bg-gray-50 p-8">
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
                <div className="space-y-8">
                    {levels.map((level) => {
                        const levelSteps = roadmap.steps.filter(s => s.level === level);
                        if (levelSteps.length === 0) return null;

                        return (
                            <div key={level} className="relative">
                                <div className="sticky top-4 z-10 bg-gray-50/95 backdrop-blur py-2 mb-4 border-b border-gray-200">
                                    <h2 className={`text-xl font-bold px-4 py-1 rounded-full inline-block ${level === 'Beginner' ? 'text-green-600 bg-green-50' :
                                        level === 'Intermediate' ? 'text-secondary bg-secondary/10' :
                                            'text-primary bg-primary/10'
                                        }`}>
                                        {level} Level
                                    </h2>
                                </div>

                                <div className="space-y-4 pl-4 border-l-2 border-gray-200 ml-4">
                                    {levelSteps.map((step) => (
                                        <motion.div
                                            key={step._id}
                                            whileHover={{ x: 5 }}
                                            className={`bg-white p-6 rounded-xl border transition-all relative ${step.isCompleted ? 'border-green-200 shadow-sm bg-green-50/30' : 'border-gray-200 shadow-sm hover:shadow-md'
                                                }`}
                                        >
                                            <div className="absolute -left-[25px] top-6 bg-white rounded-full p-1 border-2 border-gray-200">
                                                {step.isCompleted ? <CheckCircle size={20} className="text-green-500 fill-current bg-white rounded-full" /> : <Circle size={20} className="text-gray-300" />}
                                            </div>

                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <h3 className={`text-lg font-bold mb-1 ${step.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800'}`}>
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-gray-600 mb-4">{step.description}</p>

                                                    {/* Resources */}
                                                    <div className="space-y-2">
                                                        {step.resources.map((res, i) => (
                                                            <a
                                                                key={i}
                                                                href={res.link}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="flex items-center gap-2 text-sm text-primary hover:text-accent bg-primary/5 p-2 rounded-lg w-fit transition-colors"
                                                            >
                                                                <PlayCircle size={16} />
                                                                {res.title || "Watch Tutorial"}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => toggleStep(step._id)}
                                                    className={`ml-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${step.isCompleted
                                                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    {step.isCompleted ? "Completed" : "Mark Done"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoadmapView;
