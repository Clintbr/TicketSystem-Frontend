import React, { useEffect } from 'react';

const Snackbar = ({ message, type = 'info', onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const bgColors = {
        success: 'bg-emerald-600',
        error: 'bg-rose-600',
        info: 'bg-blue-600'
    };

    return (
        <div className={`fixed bottom-5 right-5 z-50 flex items-center px-6 py-3 rounded-xl shadow-2xl text-white transition-all transform animate-bounce-in ${bgColors[type]}`}>
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-4 hover:opacity-70 font-bold">✕</button>
        </div>
    );
};

export default Snackbar;