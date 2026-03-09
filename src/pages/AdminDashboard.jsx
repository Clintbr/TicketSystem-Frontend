import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { userApi } from '../api/userApi';
import Snackbar from '../components/common/Snackbar';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    const roles = ['USER', 'SUPPORT', 'ADMIN'];

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await userApi.getAllUsers();
            setUsers(data);
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm("Nutzer permanent löschen?")) return;
        try {
            await userApi.deleteUser(userId);
            setUsers(users.filter(u => u.id !== userId));
            setNotification({ message: 'Nutzer gelöscht', type: 'success' });
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
        }
    };

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;
        if (destination.droppableId === source.droppableId) return;

        const newRole = destination.droppableId;
        const userId = draggableId;

        const updatedUsers = users.map(u =>
            u.id === userId ? { ...u, role: newRole } : u
        );
        setUsers(updatedUsers);

        try {
            await userApi.updateRole(userId, newRole);
            setNotification({ message: `Rolle zu ${newRole} geändert`, type: 'success' });
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
            await loadUsers();
        }
    };

    const handleChangeRole = async (userId, newRole) => {
        try {
            await userApi.updateRole(userId, newRole);
            setNotification({ message: `Rolle zu ${newRole} geändert`, type: 'success' });
            await loadUsers()
        } catch (err) {
            setNotification({ message: err.message, type: 'error' });
            await loadUsers();
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center animate-pulse">Lade Benutzerverwaltung...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Benutzerverwaltung</h1>
                    <p className="text-slate-500">Rollen per Drag & Drop verwalten</p>
                </div>
                <input
                    type="text"
                    placeholder="Nutzer suchen..."
                    className="w-full md:w-80 px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Desktop:*/}
            <div className="hidden lg:block">
                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-3 gap-6">
                        {roles.map(role => (
                            <div key={role} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 flex flex-col min-h-[500px]">
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4 px-2 flex justify-between">
                                    {role}s
                                    <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md text-[10px]">
                                        {filteredUsers.filter(u => u.role === role).length}
                                    </span>
                                </h3>

                                <Droppable droppableId={role}>
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 transition-colors rounded-xl ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}
                                        >
                                            {filteredUsers.filter(u => u.role === role).map((user, index) => (
                                                <Draggable key={user.id} draggableId={user.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`bg-white p-4 mb-3 rounded-xl border border-slate-200 shadow-sm group hover:border-blue-300 transition-all ${snapshot.isDragging ? 'shadow-2xl border-blue-500 rotate-2' : ''}`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="truncate pr-4">
                                                                    <p className="font-bold text-slate-800 truncate">{user.username || 'Kein Name'}</p>
                                                                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDelete(user.id)}
                                                                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-all"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        ))}
                    </div>
                </DragDropContext>
            </div>

            {/* Mobile View:*/}
            <div className="lg:hidden space-y-4">
                {filteredUsers.map(user => (
                    <div key={user.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex justify-between mb-3">
                            <div>
                                <p className="font-bold text-slate-900">{user.username}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                            <button onClick={() => handleDelete(user.id)} className="text-rose-500">Löschen</button>
                        </div>
                        <div className="flex gap-2">
                            {roles.map(r => (
                                <button
                                    key={r}
                                    onClick={() => handleChangeRole(user.id, r)}
                                    className={`flex-1 py-2 text-[10px] font-bold rounded-lg border transition-all ${
                                        user.role === r ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-500 border-slate-200'
                                    }`}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {notification && <Snackbar {...notification} onClose={() => setNotification(null)} />}
        </div>
    );
};

export default AdminDashboard;