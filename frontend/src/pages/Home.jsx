import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { Award, BookOpen, Clock, Activity, ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import LearningChart from "../components/dashboard/LearningChart";
import QuizMasteryChart from "../components/dashboard/QuizMasteryChart";
import { motion } from "framer-motion";

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState(null);
    const [quizStats, setQuizStats] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [roadmapRes, statsRes] = await Promise.all([
                    api.get("/api/roadmap"),
                    api.get("/api/quiz/stats")
                ]);
                setRoadmap(roadmapRes.data.roadmap);
                setQuizStats(statsRes.data.stats);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="h-[80vh] flex items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"
            />
        </div>
    );

    return (
        <div className="space-y-10 max-w-7xl mx-auto">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-10 md:p-14 text-white shadow-2xl shadow-slate-900/20"
            >
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-500/30"
                        >
                            <Sparkles size={14} />
                            <span>System Active</span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-none mb-4">
                            Hello, <span className="text-indigo-400">{user?.username || "Learner"}</span>
                        </h1>
                        <p className="text-slate-400 text-lg font-medium max-w-xl">
                            Your Digital Twin is currently processing <span className="text-white font-bold">{roadmap?.modules?.length || 0} modules</span>. You're on track for your master goals.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <Link to="/roadmap" className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-indigo-50 transition-all flex items-center gap-2 active:scale-95">
                            Continue Learning <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
                {/* Abstract decoration */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px]" />
            </motion.div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Status */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-8 rounded-[2rem] glass flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                            <Activity size={28} />
                        </div>
                        <TrendingUp size={24} className="text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 mb-2">Digital Twin Status</h2>
                        <p className="text-slate-500 font-medium">Syncing real-time progress...</p>
                    </div>
                    <div className="space-y-4 pt-4">
                        <div className="flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mastery Level</span>
                            <span className="text-2xl font-black text-slate-900">72%</span>
                        </div>
                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "72%" }}
                                transition={{ duration: 1.5, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Education Module Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 p-8 rounded-[2rem] glass flex flex-col gap-6"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <BookOpen size={28} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Active Roadmap</h2>
                                <p className="text-slate-500 font-medium">Visualizing knowledge clusters</p>
                            </div>
                        </div>
                        <Link to="/roadmap" className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1">
                            Details <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="h-48 w-full">
                        <LearningChart roadmap={roadmap} />
                    </div>
                </motion.div>

                {/* Quiz Performance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="lg:col-span-3 p-10 rounded-[2.5rem] glass overflow-hidden relative"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                <Award size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 leading-tight">Technical Mastery</h2>
                                <p className="text-slate-500 text-lg font-medium pr-8 mt-2">
                                    Your radar chart shows real-time strength across core technical domains based on recent quiz scores.
                                </p>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex-1">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Avg Score</p>
                                    <p className="text-xl font-black text-indigo-600">88%</p>
                                </div>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex-1">
                                    <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Quizzes</p>
                                    <p className="text-xl font-black text-purple-600">{quizStats?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="h-64 md:h-80 w-full relative">
                            <div className="absolute inset-0 bg-indigo-500/5 rounded-full blur-[80px]" />
                            <QuizMasteryChart quizStats={quizStats} />
                        </div>
                    </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
                </motion.div>
>>>>>>> f3ea8fcabc04190cd446fe9d336c486de78e57b6

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-gray-800">Mental Health Module</h2>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate("/progress")}
                                    className="text-sm bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-100 font-medium transition-colors"
                                >
                                    View Analytics
                                </button>
                                <button
                                    onClick={() => navigate("/assess")}
                                    className="text-sm bg-rose-50 text-rose-600 px-4 py-2 rounded-lg hover:bg-rose-100 font-medium transition-colors"
                                >
                                    New Assessment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

<<<<<<< HEAD
=======
                </motion.div>
>>>>>>> animations
=======
>>>>>>> f3ea8fcabc04190cd446fe9d336c486de78e57b6
            </div>
        </div>
    );
};

export default Home;
