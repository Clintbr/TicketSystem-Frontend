import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import Snackbar from '../components/common/Snackbar';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        if (formData.username.trim().length < 3) {
            setNotification({ message: 'Username muss mindestens 3 Zeichen lang sein.', type: 'error' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setNotification({ message: 'Ungültiges E-Mail Format.', type: 'error' });
            return;
        }

        if (formData.password.length < 6) {
            setNotification({ message: 'Passwort zu kurz (min. 6 Zeichen).', type: 'error' });
            return;
        }

        try {
            await authApi.register(formData);
            setNotification({ message: 'Registrierung erfolgreich! Bitte einloggen.', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setNotification({ message: err.message, type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center underline decoration-blue-500 underline-offset-8">Registrierung</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text" placeholder="Username" required
                            className={`w-full p-3 rounded-lg border ${errors.username ? 'border-rose-500' : 'border-slate-200'} outline-none focus:ring-2 focus:ring-blue-500`}
                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                        />
                        {errors.username && <p className="text-rose-500 text-xs mt-1">{errors.username}</p>}
                    </div>

                    <div>
                        <input
                            type="text" placeholder="E-Mail" required
                            className={`w-full p-3 rounded-lg border ${errors.email ? 'border-rose-500' : 'border-slate-200'} outline-none focus:ring-2 focus:ring-blue-500`}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                        {errors.email && <p className="text-rose-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <input
                            type="password" placeholder="Passwort (min. 6 Zeichen)" required
                            className={`w-full p-3 rounded-lg border ${errors.password ? 'border-rose-500' : 'border-slate-200'} outline-none focus:ring-2 focus:ring-blue-500`}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        {errors.password && <p className="text-rose-500 text-xs mt-1">{errors.password}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 
                            ${isLoading
                            ? 'bg-slate-700 cursor-not-allowed opacity-70'
                            : 'bg-slate-900 hover:bg-slate-800 shadow-lg'
                        } text-white`}
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Erstelle Account...
                            </>
                        ) : (
                            'Account erstellen'
                        )}
                    </button>
                </form>
            </div>
            {notification && <Snackbar {...notification} onClose={() => setNotification(null)}/>}
        </div>
    );
};

export default Register;