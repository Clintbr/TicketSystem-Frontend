import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { AuthContext } from '../context/AuthContext';
import Snackbar from '../components/common/Snackbar';

const SupportDashboard = ({ view = 'all' }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    const isAdmin = user?.role === 'ADMIN';
    const priorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

    useEffect(() => {
        fetchTickets();
    }, [view]);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const data = view === 'assigned'
                ? await ticketApi.getAssignedToMe()
                : await ticketApi.getAllTickets();
            setTickets(data);
        } catch (err) {
            setNotification({
                message: err.message,
                type: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePriorityChange = async (ticketId, newPrio) => {
        try {
            await ticketApi.updatePriority(ticketId, newPrio);
            setNotification({ message: `Priorität auf ${newPrio} aktualisiert`, type: 'success' });
            await fetchTickets();
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        }
    };

    const handleAssign = async (ticketId) => {
        try {
            await ticketApi.assignToSupport(ticketId, user.id);
            setNotification({ message: 'Ticket erfolgreich übernommen.', type: 'success' });
            await fetchTickets();
        } catch (err) {
            setNotification({
                message: err.message,
                type: 'error'
            });
        }
    };

    const handleUnassign = async (ticketId) => {
        try {
            await ticketApi.unassignTicket(ticketId);
            setNotification({ message: 'Zuweisung aufgehoben.', type: 'info' });
            await fetchTickets();
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'URGENT': return 'bg-red-100 text-red-700 border-red-200';
            case 'HIGH': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'MEDIUM': return 'bg-blue-100 text-blue-700 border-blue-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
        const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.createdByUsername?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                        {view === 'assigned' ? 'Meine Aufgaben' : 'Support Zentrale'}
                    </h1>
                    <p className="text-slate-500 text-sm">
                        {filteredTickets.length} Tickets gefunden
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <input
                        type="text"
                        placeholder="Suchen..."
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white outline-none"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="ALL">Alle Status</option>
                        <option value="OPEN">Offen</option>
                        <option value="IN_PROGRESS">In Bearbeitung</option>
                        <option value="CLOSED">Geschlossen</option>
                    </select>
                </div>
            </div>

            {/* desktop Ansicht */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
                    <tr>
                        <th className="px-6 py-4">Priorität</th>
                        <th className="px-6 py-4">Ticket / ID</th>
                        <th className="px-6 py-4">Kunde</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Aktionen</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                    {filteredTickets.map(ticket => (
                        <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                                {isAdmin && view !== 'assigned' ? (
                                    <select
                                        value={ticket.priority}
                                        onChange={(e) => handlePriorityChange(ticket.id, e.target.value)}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-black border cursor-pointer outline-none focus:ring-2 focus:ring-blue-400 ${getPriorityColor(ticket.priority)}`}
                                    >
                                        {priorities.map(p => (
                                            <option key={p} value={p}>{p}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span
                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-semibold text-slate-900">{ticket.title}</div>
                                <div className="text-[10px] text-slate-400 font-mono">{ticket.id.substring(0, 8)}</div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {ticket.createdByUsername}
                            </td>
                            <td className="px-6 py-4">
                                    <span
                                        className={`text-xs font-bold ${ticket.status === 'CLOSED' ? 'text-slate-400' : 'text-blue-600'}`}>
                                        {ticket.status}
                                    </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {!ticket.assignedToUsername && view !== 'assigned' && ticket.status !== 'CLOSED' && (
                                        <button
                                            onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        Öffnen
                                    </button>
                                    )}
                                    {!ticket.assignedToUsername && ticket.status !== 'CLOSED' && (
                                        <button
                                            onClick={() => handleAssign(ticket.id)}
                                            className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm transition-all"
                                        >
                                            Übernehmen
                                        </button>
                                    )}

                                    {ticket.assignedToUsername != null && view === 'assigned' && ticket.status !== 'CLOSED' && (
                                        <button
                                            onClick={() => handleUnassign(ticket.id)}
                                            className="px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 hover:bg-rose-50 rounded-lg transition-all"
                                        >
                                            Freigeben
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Ansicht*/}
            <div className="lg:hidden grid gap-4">
                {filteredTickets.map(ticket => (
                    <div key={ticket.id}
                         className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            {isAdmin && view !== 'assigned' ? (
                                <select
                                    value={ticket.priority}
                                    onChange={(e) => handlePriorityChange(ticket.id, e.target.value)}
                                    className={`px-2 py-1 rounded-lg text-[10px] font-black border ${getPriorityColor(ticket.priority)}`}
                                >
                                    {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            ) : (
                                <span
                                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getPriorityColor(ticket.priority)}`}>
                                    {ticket.priority}
                                </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-mono">#{ticket.id.substring(0, 6)}</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{ticket.title}</h3>
                            <p className="text-sm text-slate-500">Von: {ticket.createdByUsername}</p>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <span className="text-xs font-bold text-blue-600">{ticket.status}</span>
                            <div className="flex gap-2">
                                {!ticket.assignedToUsername && view !== 'assigned' && ticket.status !== 'CLOSED' && (
                                    <button
                                        onClick={() => navigate(`/tickets/${ticket.id}`)}
                                        className="p-2 text-slate-400 hover:text-blue-600"
                                    >
                                        Details
                                    </button>
                                )}
                                {!ticket.assignedToUsername && ticket.status !== 'CLOSED' && (
                                    <button
                                        onClick={() => handleAssign(ticket.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                                    >
                                        Zuweisen
                                    </button>
                                )}

                                {ticket.assignedToUsername != null && view === 'assigned' && ticket.status !== 'CLOSED' && (
                                    <button
                                        onClick={() => handleUnassign(ticket.id)}
                                        className="text-rose-600 border border-rose-200 hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-bold"
                                    >
                                        Freigeben
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredTickets.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium italic">Keine Tickets in dieser Ansicht vorhanden.</p>
                </div>
            )}

            {notification && <Snackbar {...notification} onClose={() => setNotification(null)}/>}
        </div>
    );
};

export default SupportDashboard;