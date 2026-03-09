import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import Snackbar from '../components/common/Snackbar';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        localStorage.clear()
        e.preventDefault();

        if (formData.password.length < 6) {
            setNotification({ message: 'Das Passwort muss mindestens 6 Zeichen lang sein.', type: 'error' });
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setNotification({ message: 'Bitte eine gültige E-Mail Adresse eingeben.', type: 'error' });
            return;
        }

        setIsLoading(true);

        try {
            const data = await authApi.login(formData);
            const {token, ...user} = data;
            login(user, token);
            setNotification({ message: 'Erfolgreich angemeldet!', type: 'success' });
            setTimeout(() => navigate('/'), 1000);
        } catch (err) {
            setNotification({ message: err.message, type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh]">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
                <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center underline decoration-blue-500 underline-offset-8">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text" placeholder="E-Mail" required
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                    <input
                        type="password" placeholder="Passwort" required
                        className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <button
                        type="submit"
                        disabled={isLoading} // Deaktiviert Button während des Ladens
                        className={`w-full py-3 rounded-lg font-bold transition-all shadow-lg flex items-center justify-center gap-2
                            ${isLoading
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
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
                                Wird geprüft...
                            </>
                        ) : 'Anmelden'}
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-500 text-sm">
                    Noch kein Konto? <Link to="/register" className="text-blue-600 hover:underline">Hier
                    registrieren</Link>
                </p>
            </div>
            {notification && <Snackbar {...notification} onClose={() => setNotification(null)}/>}
        </div>
    );
};

export default Login;