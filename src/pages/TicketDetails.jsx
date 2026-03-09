import React, { useEffect, useState, useContext } from 'react';
import { useParams , useNavigate} from 'react-router-dom';
import { ticketApi } from '../api/ticketApi';
import { commentApi } from '../api/commentApi';
import { AuthContext } from '../context/AuthContext';
import Snackbar from '../components/common/Snackbar';

const TicketDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [ticket, setTicket] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [notification, setNotification] = useState(null);

    const navigate = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ticketData, commentsData] = await Promise.all([
                    ticketApi.getById(id),
                    commentApi.getComments(id)
                ]);
                setTicket(ticketData);
                setComments(commentsData);
            } catch (err) {
                setNotification({ message: err.message, type: "error" });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleSendComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setSending(true);
        try {
            const addedComment = await commentApi.addComment(id, newComment);
            setComments([...comments, addedComment]);
            setNewComment('');
        } catch (err) {
            setNotification({ message: err.message, type: "error" });
        } finally {
            setSending(false);
        }
    };

    const handleCloseTicket = async () => {
        if (!window.confirm("Möchtest du dieses Ticket als 'Erledigt' markieren?")) return;

        try {
            const updatedTicket = await ticketApi.updateStatus(id, 'CLOSED');
            setTicket(updatedTicket); // UI aktualisiert sich sofort
            setNotification({ message: 'Ticket erfolgreich geschlossen.', type: 'success' });
        } catch (err) {
            setNotification({ message: err.message, type: "error" });
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Möchtest du diesen Kommentar wirklich löschen?')) return;

        try {
            await commentApi.deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
            setNotification({ message: 'Kommentar gelöscht.', type: 'info' });
        } catch (err) {
            setNotification({ message: err.message, type: "error" });
        }
    };

    const getPriorityStyle = (priority) => {
        switch (priority) {
            case 'LOW': return 'bg-slate-100 text-slate-600 border-slate-200';
            case 'MEDIUM': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'HIGH': return 'bg-orange-50 text-orange-600 border-orange-200';
            case 'URGENT': return 'bg-red-100 text-red-700 border-red-200 animate-pulse';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    if (loading) return <div className="p-10 text-center">Lade Ticket-Details...</div>;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <button
                onClick={() => navigate('/tickets')}
                className="text-slate-500 hover:text-blue-600 flex items-center gap-2 transition-colors"
            >
                ← Zurück zur Übersicht
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="flex items-center gap-3">

                    {ticket.status !== 'CLOSED' && (
                        <button
                            onClick={handleCloseTicket}
                            className="text-xs font-bold text-emerald-600 hover:bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            Ticket schließen
                        </button>
                    )}
                </div>
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-start">
                    <div>
                        <span
                            className="text-xs font-mono text-slate-400 uppercase tracking-widest">Ticket ID: {id.substring(0, 8)}...</span>
                        <h1 className="text-2xl font-bold text-slate-900 mt-1">{ticket.title}</h1>
                    </div>
                    <div className="flex gap-2">
                        <span
                            className={`px-3 py-1 rounded-lg text-xs font-black border ${getPriorityStyle(ticket.priority)}`}>
                            {ticket.priority}
                        </span>

                        <span className={`px-3 py-1 rounded-lg text-xs font-black border ${
                            ticket.status === 'OPEN' ? 'bg-blue-600 text-white border-blue-600' :
                                ticket.status === 'CLOSED' ? 'bg-slate-600 text-white border-slate-600' :
                                    'bg-amber-500 text-white border-amber-500'
                        }`}>
                            {ticket.status}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {ticket.description}
                    </p>
                    <div className="mt-6 pt-6 border-t border-slate-100 flex gap-6 text-sm text-slate-500">
                        <span>Erstellt von: <strong>{ticket.ownerUsername || 'Ich'}</strong></span>
                        <span>Am: {new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-6 mb-8">
                <h2 className="text-lg font-bold text-slate-800 px-2">Diskussionsverlauf</h2>

                <div className="flex flex-col gap-4">
                    {comments.map((comment) => {
                        console.log(comment.authorMail, user?.email);
                        const isMe = comment.authorMail === user.email;

                        return (
                            <div key={comment.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-2`}>
                                {/* WICHTIG: relative und group müssen hier stehen */}
                                <div className={`relative group max-w-[75%] p-4 rounded-2xl shadow-sm border ${
                                    isMe
                                        ? 'bg-blue-600 text-white border-blue-500 rounded-tr-none'
                                        : 'bg-white text-slate-800 border-slate-200 rounded-tl-none'
                                }`}>

                                    {isMe && (
                                        <button
                                            onClick={() => handleDeleteComment(comment.id)}
                                            /* Teste es erst mal OHNE opacity-0, um zu sehen ob er erscheint */
                                            className="absolute -top-3 -right-3 bg-rose-500 text-white p-1.5 rounded-full shadow-lg hover:bg-rose-600 transition-all z-10"
                                            title="Kommentar löschen"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    )}

                                    <div className={`flex items-center gap-2 mb-1 text-[10px] uppercase font-bold tracking-wider ${isMe ? 'text-blue-100' : 'text-slate-400'}`}>
                                        <span>{isMe ? 'Ich' : comment.authorUsername}</span>
                                        <span>•</span>
                                        <span>{new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {ticket.status === 'CLOSED' ? (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl text-center shadow-inner">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-200 rounded-full mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <p className="text-slate-600 font-medium">Dieses Ticket wurde geschlossen.</p>
                    <p className="text-slate-400 text-sm">Es können keine weiteren Kommentare hinzugefügt werden.</p>
                </div>
            ) : (
                <form onSubmit={handleSendComment} className="sticky bottom-4 bg-white p-4 rounded-2xl shadow-2xl border border-blue-50">
                    <div className="flex gap-3">
            <textarea
                className="flex-1 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none text-sm transition-all"
                placeholder="Schreiben Sie eine Nachricht..."
                rows="2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
                        <button
                            disabled={sending || !newComment.trim()}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white px-6 py-2 rounded-xl font-bold transition-all self-end shadow-lg shadow-blue-100"
                        >
                            {sending ? '...' : 'Senden'}
                        </button>
                    </div>
                </form>
            )}

            {notification && <Snackbar {...notification} onClose={() => setNotification(null)}/>}
        </div>
    );
};

export default TicketDetails;