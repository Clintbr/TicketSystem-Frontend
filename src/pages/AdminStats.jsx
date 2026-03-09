import React, { useEffect, useState } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { statsApi } from '../api/statsApi';
import { Users, Ticket, CheckCircle, Clock } from 'lucide-react';

const AdminStats = () => {
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsData, historyData] = await Promise.all([
                    statsApi.getDashboardStats(),
                    statsApi.getTicketHistory()
                ]);
                setStats(statsData);
                setHistory(historyData);
            } catch (err) {
                console.error("Fehler beim Laden der Statistiken", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="p-10 text-center animate-pulse text-slate-500">Analysiere Systemdaten...</div>;

    const statCards = [
        { label: 'Gesamt benutzer', value: stats?.totalUsers, icon: <Users />, color: 'bg-blue-500' },
        { label: 'Offene Tickets', value: stats?.openTickets, icon: <Clock />, color: 'bg-amber-500' },
        { label: 'Gelöste Tickets', value: stats?.closedTickets, icon: <CheckCircle />, color: 'bg-emerald-500' },
        { label: 'Tickets Gesamt', value: stats?.totalTickets, icon: <Ticket />, color: 'bg-indigo-500' },
    ];

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900">System Statistiken</h1>
                <p className="text-slate-500 text-sm">Echtzeit-Übersicht der Plattform-Aktivität</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card, i) => (
                    <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
                        <div className={`${card.color} p-4 rounded-2xl text-white shadow-lg`}>
                            {card.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{card.label}</p>
                            <p className="text-2xl font-black text-slate-900">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Chart Section */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Ticketaufkommen im Zeitverlauf</h3>
                    <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-500 uppercase font-bold">Wische für mehr Details →</span>
                </div>

                {/* Container für horizontales Scrollen auf kleinen Screens */}
                <div className="w-full overflow-x-auto pb-4 scrollbar-hide">
                    <div className="min-w-[800px] h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={history}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fill: '#94a3b8'}}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{fontSize: 12, fill: '#94a3b8'}}
                                />
                                <Tooltip
                                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={4}
                                    fillOpacity={1}
                                    fill="url(#colorCount)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Statusverteilung (Einfache Übersicht) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-8 rounded-3xl text-white">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-slate-500 mb-6">Effizienz-Check</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span>Lösungsquote</span>
                            <span className="font-bold">
                                {stats ? Math.round((stats.closedTickets / stats.totalTickets) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-blue-500 h-full transition-all duration-1000"
                                style={{ width: `${stats ? (stats.closedTickets / stats.totalTickets) * 100 : 0}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-slate-500 italic mt-4">
                            Dieser Wert basiert auf dem Verhältnis von geschlossenen zu Gesamttickets.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStats;