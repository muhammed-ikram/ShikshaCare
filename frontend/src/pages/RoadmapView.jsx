import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, BookOpen, Map, ArrowRight } from 'lucide-react';

const RoadmapView = () => {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRoadmap = async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/career/roadmap', { withCredentials: true });
                if (res.data.success) {
                    setRoadmap(res.data.data);
                }
            } catch (err) {
                console.error(err);
                setError("No roadmap found. Please run the career simulation first.");
            } finally {
                setLoading(false);
            }
        };

        fetchRoadmap();
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Roadmap...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                <header className="mb-12 text-center">
                    <span className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 inline-block">
                        Your Personalized Graph
                    </span>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{roadmap.selected_career_name} Roadmap</h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        A step-by-step guide tailored to your learning speed and available time.
                    </p>
                </header>

                <div className="relative border-l-4 border-indigo-200 ml-4 md:ml-12 space-y-12">
                    {roadmap.roadmap_content.map((phase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className="relative pl-8 md:pl-12"
                        >
                            {/* Timeline Dot */}
                            <div className="absolute -left-[14px] top-0 bg-indigo-600 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 border-b border-gray-50 pb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800">{phase.phase_name}</h3>
                                        <div className="flex items-center text-sm text-gray-500 mt-1 gap-4">
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {phase.duration}</span>
                                            {/* <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> 0% Complete</span> */}
                                        </div>
                                    </div>
                                    <div className="mt-2 md:mt-0 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                                        Goal: {phase.goal}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    {phase.topics.map((topic, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:bg-white hover:border-indigo-200 transition-colors">
                                            <div className="bg-white p-2 rounded-md shadow-sm text-indigo-500 group-hover:text-indigo-600">
                                                <BookOpen className="w-4 h-4" />
                                            </div>
                                            <span className="text-gray-700 font-medium">{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <button className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:bg-gray-800 transition transform hover:-translate-y-1">
                        Start Learning Phase 1
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoadmapView;
