import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar (Fixed width) */}
            <Sidebar />

            {/* Main Content Area */}
            {/* ml-64 to offset the fixed sidebar width */}
            <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
