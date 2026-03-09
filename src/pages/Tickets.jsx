import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import Snackbar from '../components/common/Snackbar';
import CreateTicketModal from '../components/tickets/CreateTicketModal';

const Tickets = () => {
    const [tickets, setTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        loadTickets();
    }, []);

    const navigate = useNavigate();

    const loadTickets = async () => {
        try {
            const data = await ticketApi.getMyTickets();
            setTickets(data);
        } catch (err) {
            setNotification({ message: err.message, type: "error" });
        }finally {
            setLoading(false);
        }
    };

    const handleTicketCreated = (newTicket) => {
        setTickets([newTicket, ...tickets]);
        setNotification({ message: 'Ticket erfolgreich erstellt!', type: 'success' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Möchtest du dieses Ticket wirklich dauerhaft löschen?')) {
            return;
        }

        try {
            await ticketApi.delete(id);

            setTickets(tickets.filter(t => t.id !== id));

            setNotification({ message: 'Ticket wurde erfolgreich gelöscht.', type: 'success' });
        } catch (err) {
            setNotification({
                message: 'Fehler beim Löschen. Möglicherweise hast du nicht die erforderlichen Rechte.',
                type: 'error'
            });
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'OPEN': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'IN_PROGRESS': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'CLOSED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-slate-100 text-slate-700';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Meine Support-Anfragen</h1>
                <button
                    onClick={() => setIsModalOpen(true)} // Modal öffnen
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-blue-100 flex items-center gap-2 active:scale-95"
                >
                    <span className="text-xl">+</span> Neues Ticket
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : tickets.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
                <p className="text-slate-500">Du hast noch keine Tickets erstellt.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {tickets.map((ticket) => (
                        <div key={ticket.id} className="bg-white border border-slate-200 p-5 rounded-xl hover:shadow-md transition-shadow flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-slate-900">{ticket.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-1">{ticket.description}</p>
                                <span className="text-xs text-slate-400 mt-2 block">
                                    Erstellt am: {new Date(ticket.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(ticket.status)}`}>
                                    {ticket.status}
                                </span>
                                <button
                                    onClick={() => handleDelete(ticket.id)}
                                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                    title="Ticket löschen"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => navigate(`/tickets/${ticket.id}`)}
                                    className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1 rounded-md transition-colors"
                                >
                                    Details anzeigen
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <CreateTicketModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onTicketCreated={handleTicketCreated}
            />
            {notification && <Snackbar {...notification} onClose={() => setNotification(null)}/>}
        </div>
    );
};

export default Tickets;