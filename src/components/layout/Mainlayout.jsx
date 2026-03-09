import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import Footer from "./Footer.jsx";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden relative">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={closeSidebar}
                />
            )}

            <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

            <div className="flex-1 flex flex-col min-w-0">
                <Navbar onMenuClick={toggleSidebar} />

                <main className="flex-1 overflow-y-auto flex flex-col">
                    <div className="flex-1 p-4 md:p-8">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                    <Footer />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;