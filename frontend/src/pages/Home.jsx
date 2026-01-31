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
                    <button
                        onClick={handleLogout}
                        className="bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors font-medium border border-red-100"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
