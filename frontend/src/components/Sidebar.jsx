import { Link, useLocation } from "react-router-dom";
import { Home, User, Briefcase, Map, LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        { path: "/home", label: "Dashboard", icon: <Home size={20} /> },
        { path: "/career-results", label: "Career DNA", icon: <Briefcase size={20} /> },
        { path: "/projects", label: "Project Builder", icon: <LayoutDashboard size={20} /> },
        { path: "/roadmap", label: "My Roadmap", icon: <Map size={20} /> },
        { path: "/profile", label: "Profile", icon: <User size={20} /> },
        { path: "/mental-health-chat", label: "Mental Health Chat", icon: <User size={20} /> },
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-2xl font-bold text-{#1b5e5f}">
                    ShikshaCare
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? "bg-primary text-black shadow-md shadow-blue-500/30"
                                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
