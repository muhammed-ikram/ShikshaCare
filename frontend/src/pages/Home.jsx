import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
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
                                    className="bg-indigo-50 text-indigo-600 px-6 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
                                >
                                    View Profile
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate("/student-profile")}
                                    className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 animate-pulse"
                                >
                                    Setup Profile
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Education Module</h2>
                        <div className="h-32 bg-blue-50 rounded-xl flex items-center justify-center text-blue-400 font-medium">
                            Coming Soon
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Health Module</h2>
                        <div className="h-32 bg-rose-50 rounded-xl flex items-center justify-center text-rose-400 font-medium">
                            Coming Soon
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
