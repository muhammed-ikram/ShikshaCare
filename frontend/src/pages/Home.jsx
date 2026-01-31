import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BookOpen, Heart, Activity, LineChart } from 'lucide-react';

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.username} 👋</h1>
                        <p className="text-gray-500">Your Uni-Dashboard: Learning & Wellness in sync.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/profile")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
                        >
                            Profile
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 px-5 py-2.5 rounded-xl hover:bg-red-100 transition-colors font-medium"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Left Column: Quick Actions */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* EduTech Card */}
                        <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full transform translate-x-12 -translate-y-12"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <div className="bg-white/20 p-2 rounded-lg w-fit mb-4">
                                        <BookOpen className="w-6 h-6 text-white" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-1">Career & Learning</h2>
                                    <p className="text-indigo-100 mb-6 max-w-sm">
                                        Discover your path and follow a personalized AI-generated roadmap.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate('/career-mapping')}
                                            className="bg-white text-indigo-700 px-5 py-2 rounded-xl font-bold hover:bg-indigo-50 transition shadow-sm"
                                        >
                                            Take Quiz
                                        </button>
                                        <button
                                            onClick={() => navigate('/roadmap')}
                                            className="bg-indigo-600 border border-white/30 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-500 transition"
                                        >
                                            View Roadmap
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* HealthTech Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-1">
                                <div className="bg-rose-100 p-2 rounded-lg w-fit mb-4">
                                    <Heart className="w-6 h-6 text-rose-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">Wellness Center</h2>
                                <p className="text-gray-500 mb-6">
                                    Feeling overwhelmed? Check your stress levels and get instant AI-guided relief.
                                </p>
                                <button
                                    onClick={() => navigate('/wellness')}
                                    className="bg-rose-500 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-rose-600 transition shadow-lg shadow-rose-200"
                                >
                                    Check Stress
                                </button>
                            </div>
                            <div className="w-full md:w-1/3 bg-rose-50 rounded-2xl p-6 flex flex-col items-center justify-center">
                                <Activity className="w-12 h-12 text-rose-400 mb-2" />
                                <span className="text-sm font-semibold text-rose-400">Daily Check-in</span>
                                <span className="text-xs text-rose-300">Pending today</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Unified Stats */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
                        <div className="flex items-center gap-2 mb-6">
                            <LineChart className="w-5 h-5 text-gray-400" />
                            <h2 className="text-lg font-bold text-gray-800">Unified Metrics</h2>
                        </div>

                        <div className="flex-1 space-y-8 flex flex-col justify-center">
                            {/* Skill Score */}
                            <div className="text-center">
                                <div className="relative w-32 h-32 mx-auto mb-3">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                        <circle
                                            cx="64" cy="64" r="56"
                                            stroke="#6366f1"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray="351"
                                            strokeDashoffset="200"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-gray-900">42%</span>
                                    </div>
                                </div>
                                <p className="font-semibold text-gray-700">Skill Score</p>
                                <p className="text-xs text-gray-400">Based on Roadmap</p>
                            </div>

                            {/* Divider with Connection */}
                            <div className="flex items-center justify-center gap-2">
                                <span className="h-px w-12 bg-gray-200"></span>
                                <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">VS</span>
                                <span className="h-px w-12 bg-gray-200"></span>
                            </div>

                            {/* Stress Index */}
                            <div className="text-center">
                                <div className="relative w-32 h-32 mx-auto mb-3">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="64" cy="64" r="56" stroke="#f3f4f6" strokeWidth="12" fill="none" />
                                        <circle
                                            cx="64" cy="64" r="56"
                                            stroke="#f43f5e"
                                            strokeWidth="12"
                                            fill="none"
                                            strokeDasharray="351"
                                            strokeDashoffset="100"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-3xl font-bold text-gray-900">72</span>
                                    </div>
                                </div>
                                <p className="font-semibold text-gray-700">Stress Index</p>
                                <p className="text-xs text-gray-400">Needs Attention</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
