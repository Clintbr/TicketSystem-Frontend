import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="max-w-5xl mx-auto py-12 px-4">
            <section className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                    Support-Management <span className="text-blue-600 underline decoration-blue-200">neu gedacht.</span>
                </h1>
                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Ein effizientes Ticketsystem für blitzschnelle Kommunikation.
                    Erstellen Sie Anfragen, erhalten Sie Antworten von Experten und behalten Sie den Überblick über Ihre Threads.
                </p>
                <div className="flex justify-center gap-4">
                    <Link
                        to="/tickets"
                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-200 transition-all transform hover:-translate-y-1"
                    >
                        Jetzt Ticket erstellen
                    </Link>
                    <Link
                        to="/register"
                        className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-3 rounded-xl font-semibold transition-all"
                    >
                        Konto erstellen
                    </Link>
                </div>
            </section>

            {/* Feature Grid */}
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-lg mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Automatische Zuweisung</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Keine Wartezeit. Ihr Ticket wird sofort dem nächsten verfügbaren Support-Mitarbeiter zugewiesen.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-green-100 text-green-600 flex items-center justify-center rounded-lg mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Echtzeit-Diskussion</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Kommunizieren Sie direkt in einem Thread. Erhalten Sie Updates und klären Sie Rückfragen an einem Ort.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 flex items-center justify-center rounded-lg mb-6">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">Admin Dashboard</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Volle Kontrolle für Administratoren: User-Management, Rollenzuweisung und Systemübersicht.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;