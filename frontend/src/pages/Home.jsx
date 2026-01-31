import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../api";
import LearningChart from "../components/dashboard/LearningChart";
import QuizMasteryChart from "../components/dashboard/QuizMasteryChart";
import "./Home.css";


const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState(null);
    const [quizStats, setQuizStats] = useState([]);


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
                console.error("Failed to fetch dashboard data", error);
            }
        };
        fetchData();
    }, []);


    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="home-container min-h-screen p-8">
            <div className="max-w-5xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.username} 👋</h1>
                        <p className="text-gray-500">Welcome to your dashboard</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/profile")}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <span className="hidden md:inline">Profile</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-100"
                        >
                            Sign Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Status Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-1 md:col-span-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">Your Digital Twin</h2>
                                <p className="text-gray-500">
                                    {user?.profileCompleted
                                        ? "Your student profile is active and personalized."
                                        : "Complete your profile to unlock AI personalization."}
                                </p>
                            </div>
                            {user?.profileCompleted ? (
                                <button
                                    onClick={() => navigate("/profile")}
                                    className="bg-primary/10 text-primary px-6 py-2 rounded-lg font-medium hover:bg-primary/20 transition-colors"
                                >
                                    View Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/student-profile")}
                                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-accent transition-colors shadow-lg shadow-primary/30 animate-pulse"
                                >
                                    Setup Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Education Module</h2>
                            {roadmap && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">{roadmap.overallProgress}% Done</span>}
                        </div>
                        <LearningChart roadmap={roadmap} />
                        {!roadmap && (
                            <div className="text-center mt-4">
                                <button onClick={() => navigate("/career-results")} className="text-sm text-primary hover:underline">
                                    Generate Roadmap
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Quiz Performance</h2>
                        <div className="h-48">
                            <QuizMasteryChart quizStats={quizStats} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Home;
