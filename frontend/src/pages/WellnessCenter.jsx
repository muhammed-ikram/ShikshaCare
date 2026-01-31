import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Wind, Coffee, Music, Sun } from 'lucide-react';
import StressCheck from '../components/healthtech/StressCheck';
import { useNavigate } from 'react-router-dom';

const WellnessCenter = () => {
    const navigate = useNavigate();
    const [stressIndex, setStressIndex] = useState(null); // Null means check not done

    const tips = [
        { icon: <Wind className="w-5 h-5 text-blue-500" />, title: "Box Breathing", desc: "Inhale for 4s, hold for 4s, exhale for 4s.", color: "bg-blue-50 border-blue-100" },
        { icon: <Coffee className="w-5 h-5 text-amber-600" />, title: "Digital Detox", desc: "Take a 10 min break away from screens.", color: "bg-amber-50 border-amber-100" },
        { icon: <Music className="w-5 h-5 text-purple-500" />, title: "Lo-Fi Focus", desc: "Listen to calming binaural beats.", color: "bg-purple-50 border-purple-100" },
        { icon: <Sun className="w-5 h-5 text-orange-500" />, title: "Sunlight", desc: "Get 5 mins of natural light.", color: "bg-orange-50 border-orange-100" },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <Heart className="w-8 h-8 text-rose-500 fill-current" />
                        Wellness Center
                    </h1>
                    <button
                        onClick={() => navigate('/home')}
                        className="text-gray-500 hover:text-indigo-600 font-medium"
                    >
                        Back to Dashboard
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Left Column: Stress Check */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">How are you feeling today?</h2>
                            <StressCheck onComplete={(score) => setStressIndex(score)} />
                        </div>

                        {/* AI Insight (Shows after check) */}
                        {stressIndex !== null && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-indigo-600 rounded-2xl shadow-lg p-6 text-white"
                            >
                                <h3 className="text-lg font-semibold mb-2">AI Health Insight</h3>
                                <p className="opacity-90">
                                    {stressIndex < 30 ? "You're in a great state flows! Keep maintaining this balance." :
                                        stressIndex < 70 ? "Your stress levels are moderate. Consider a short break before your next study session." :
                                            "Your stress levels are high. We recommend stepping away for 15 minutes. Try the breathing exercise below."}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column: Visualizer & Tips */}
                    <div className="space-y-6">
                        {/* Stress Visualizer Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center min-h-[250px]">
                            <h3 className="text-gray-500 font-medium mb-4">Your Stress Index</h3>
                            <div className="relative w-40 h-40 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90">
                                    <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="15" fill="none" />
                                    <circle
                                        cx="80" cy="80" r="70" stroke={stressIndex > 60 ? "#ef4444" : stressIndex > 30 ? "#eab308" : "#22c55e"}
                                        strokeWidth="15" fill="none" strokeDasharray="440"
                                        strokeDashoffset={stressIndex !== null ? 440 - (440 * stressIndex) / 100 : 440}
                                        className="transition-all duration-1000 ease-out"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-4xl font-bold text-gray-800">{stressIndex !== null ? stressIndex : '--'}</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-wide">Score</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Tips */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-gray-800 mb-4">Quick Relief</h3>
                            <div className="space-y-3">
                                {tips.map((tip, idx) => (
                                    <div key={idx} className={`p-3 rounded-xl border flex items-start gap-3 ${tip.color} hover:shadow-md transition cursor-pointer`}>
                                        <div className="mt-1">{tip.icon}</div>
                                        <div>
                                            <h4 className="font-semibold text-sm text-gray-800">{tip.title}</h4>
                                            <p className="text-xs text-gray-600">{tip.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WellnessCenter;
