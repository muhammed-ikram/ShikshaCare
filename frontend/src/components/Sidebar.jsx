import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    User,
    Briefcase,
    Map,
    Heart,
    LogOut,
    Menu
} from 'lucide-react';

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/home', label: 'Dashboard', icon: <Home size={20} /> },
        { path: '/student-profile', label: 'My Profile', icon: <User size={20} /> },
        { path: '/career-simulation', label: 'Career Sim', icon: <Briefcase size={20} /> },
        { path: '/roadmap', label: 'My Roadmap', icon: <Map size={20} /> },
        // { path: '/wellness', label: 'Wellness', icon: <Heart size={20} /> }, // Uncomment when route exists
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0 z-50">
            {/* Brand */}
            <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                    S
                </div>
                <span className="text-xl font-bold text-gray-800">ShikshaCare</span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive
                                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
