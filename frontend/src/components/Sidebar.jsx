import { Link, useLocation } from "react-router-dom";
<<<<<<< HEAD
import { Home, User, Briefcase, Map, LayoutDashboard, LogOut, Activity, MessageSquareHeart } from "lucide-react";
=======
import { Home, User, Briefcase, Map, LayoutDashboard, LogOut, Sparkles, Brain, Activity } from "lucide-react";
>>>>>>> animations
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: "/home", label: "Dashboard", icon: <Home size={20} /> },
        { path: "/career-results", label: "Career DNA", icon: <Briefcase size={20} /> },
        { path: "/roadmap", label: "My Roadmap", icon: <Map size={20} /> },
<<<<<<< HEAD
        { path: "/profile", label: "Profile", icon: <User size={20} /> },
        { path: "/progress", label: "Mental Wellness", icon: <Activity size={20} /> },
        { path: "/mental-health-chat", label: "Mental Health Chat", icon: <MessageSquareHeart size={20} /> },
=======
        { path: "/projects", label: "Project Builder", icon: <LayoutDashboard size={20} /> },
        { path: "/profile", label: "My Digital Twin", icon: <Activity size={20} /> },
        { path: "/mental-health-chat", label: "AI Wellness", icon: <Sparkles size={20} /> },
>>>>>>> animations
    ];

    return (
        <div className="h-screen w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100 flex flex-col fixed left-0 top-0 z-50 shadow-2xl shadow-indigo-500/5">
            <div className="p-8">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/40">
                        <Brain className="text-white w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black tracking-tight text-slate-900">
                        Shiksha<span className="text-indigo-600">Care</span>
                    </span>
                </div>
            </div>

            <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative group flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold text-sm ${isActive
                                ? "text-white"
                                : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="sidebar-active"
                                    className="absolute inset-0 bg-indigo-600 rounded-2xl -z-10 shadow-lg shadow-indigo-500/30"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className={`${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"} transition-colors`}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-slate-50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-6 py-4 text-rose-500 hover:bg-rose-50 rounded-2xl w-full transition-all font-black text-sm active:scale-95"
                >
                    <LogOut size={20} />
                    SYSTEM_LOGOUT
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
