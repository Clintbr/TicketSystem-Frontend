import React, { useState } from 'react';
import { ticketApi } from '../../api/ticketApi';

const CreateTicketModal = ({ isOpen, onClose, onTicketCreated }) => {
    const [formData, setFormData] = useState({ title: '', description: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.title.trim().length < 5) {
            setError('Der Titel muss mindestens 5 Zeichen lang sein.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const newTicket = await ticketApi.create(formData);
            onTicketCreated(newTicket); // Aktualisiert die Liste im Hintergrund
            setFormData({ title: '', description: '' }); // Reset
            onClose(); // Schließen
        } catch (err) {
            setError('Fehler beim Erstellen des Tickets. Versuche es erneut.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-xl font-bold text-slate-900">Neues Ticket erstellen</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Titel / Betreff</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="z.B. Login funktioniert nicht"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Beschreibung</label>
                        <textarea
                            required
                            rows="4"
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Beschreibe dein Problem so genau wie möglich..."
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white shadow-lg transition-all flex items-center justify-center gap-2
                                ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                        >
                            {isLoading ? 'Wird erstellt...' : 'Ticket absenden'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketModal;