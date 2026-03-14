import React, { useContext, useEffect, useState } from 'react';
import api from './axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SessionTimeoutModal from '../components/common/SessionTimeoutModal';

const AxiosInterceptor = ({ children }) => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const resInterceptor = (response) => response;

        const errInterceptor = (error) => {
            if (error.response && error.response?.data?.message.startsWith("Token abgelaufen")) {
                setIsModalOpen(true);
                return Promise.reject(new Error("Sitzung abgelaufen"));
            }
            const backendMessage = error.response?.data?.message.toString() || 'Ein unerwarteter Fehler ist aufgetreten';
            const errorMessage = (backendMessage.includes('JDBC') || backendMessage.includes('?')) ? 'Unerwarteter Fehler beim Server' : backendMessage;
            return Promise.reject(new Error(errorMessage));
        };

        const interceptor = api.interceptors.response.use(resInterceptor, errInterceptor);
        return () => api.interceptors.response.eject(interceptor);
    }, [logout]);

    const handleRedirectToLogin = () => {
        setIsModalOpen(false);
        navigate('/login');
    };

    return (
        <>
            <SessionTimeoutModal
                isOpen={isModalOpen}
                onLogin={handleRedirectToLogin}
            />
            {children}
        </>
    );
};

export default AxiosInterceptor;