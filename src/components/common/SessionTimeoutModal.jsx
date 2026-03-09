import React, {useContext} from 'react';
import {AuthContext} from "../../context/AuthContext.jsx";

const SessionTimeoutModal = ({ isOpen, onLogin }) => {
    const { logout } = useContext(AuthContext);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>

            <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                </div>

                <h2 className="text-2xl font-bold text-slate-900 mb-2">Sitzung abgelaufen</h2>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Ihre Sicherheits-Sitzung ist abgelaufen. Bitte melden Sie sich erneut an, um fortzufahren.
                </p>

                <button
                    onClick={logout}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-2xl transition-all shadow-lg shadow-blue-200"
                >
                    Jetzt neu anmelden
                </button>
            </div>
        </div>
    );
};

export default SessionTimeoutModal;