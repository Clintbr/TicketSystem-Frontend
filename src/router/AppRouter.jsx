import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MainLayout from '../components/layout/Mainlayout';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Tickets from '../pages/Tickets';
import TicketDetails from '../pages/TicketDetails';
import SupportDashboard from '../pages/SupportDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import AdminStats from "../pages/AdminStats.jsx";


const AppRouter = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="flex h-screen items-center justify-center font-bold text-blue-600">Lade App-Daten...</div>;

    return (
            <Routes>
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />

                    <Route path="login" element={!user ? <Login /> : <Navigate to="/" />} />
                    <Route path="register" element={!user ? <Register /> : <Navigate to="/" />} />

                    <Route path="tickets" element={user ? <Tickets /> : <Navigate to="/login" />} />
                    <Route path="tickets/:id" element={user ? <TicketDetails /> : <Navigate to="/login" />} />

                    <Route
                        path="support"
                        element={user?.role === 'SUPPORT' || user?.role === 'ADMIN' ? <SupportDashboard view="all"/> : <Navigate to="/" />}
                    />
                    <Route
                        path="support/assigned"
                        element={user?.role === 'SUPPORT' || user?.role === 'ADMIN' ? <SupportDashboard view="assigned" /> : <Navigate to="/" />}
                    />

                    <Route
                        path="admin/users"
                        element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />}
                    />

                    <Route
                        path="admin/stats"
                        element={user?.role === 'ADMIN' ? <AdminStats /> : <Navigate to="/" />}
                    />

                    <Route path="*" element={<Navigate to="/" />} />
                </Route>
            </Routes>
    );
};

export default AppRouter;