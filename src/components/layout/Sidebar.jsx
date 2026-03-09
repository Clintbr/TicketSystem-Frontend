import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { X } from 'lucide-react'; // Optional für das Schließen-Icon

const Sidebar = ({ isOpen, closeSidebar }) => {
    const { user, logout } = useContext(AuthContext);

    const hasRole = (requiredRoles) => {
        if (requiredRoles.includes('ANY')) return true;
        if (!user) return false;
        const userRole = user.role?.replace('ROLE_', '');
        return requiredRoles.includes(userRole);
    };

    const navItems = [
        { name: 'Startseite', path: '/', roles: ['ANY'] },
        { name: 'Meine Tickets', path: '/tickets', roles: ['USER', 'SUPPORT', 'ADMIN'] },
    ];

    const supportItems = [
        { name: 'Alle Tickets', path: '/support', roles: ['SUPPORT', 'ADMIN'] },
        { name: 'Mir zugewiesen', path: '/support/assigned', roles: ['SUPPORT', 'ADMIN'] },
    ];

    const adminItems = [
        { name: 'Benutzerverwaltung', path: '/admin/users', roles: ['ADMIN'] },
        { name: 'System-Status', path: '/admin/stats', roles: ['ADMIN'] },
    ];

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col h-screen 
            transition-transform duration-300 ease-in-out border-r border-slate-800
            lg:relative lg:translate-x-0 
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
            <div className="p-6 text-2xl font-bold border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-sm font-black text-white">T</div>
                    <span>Ticket<span className="text-blue-500">System</span></span>
                </div>
                <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    hasRole(item.roles) && (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeSidebar} // Schließt Sidebar nach Klick auf Mobile
                            className={({ isActive }) =>
                                `flex items-center px-4 py-2.5 rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            {item.name}
                        </NavLink>
                    )
                ))}

                {hasRole(['SUPPORT', 'ADMIN']) && (
                    <div className="pt-6">
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Support Board
                        </p>
                        {supportItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2.5 rounded-xl transition-all ${
                                        isActive
                                            ? 'bg-slate-800 text-blue-400 border border-slate-700'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                )}

                {hasRole(['ADMIN']) && (
                    <div className="pt-6">
                        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                            Administration
                        </p>
                        {adminItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                onClick={closeSidebar}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2.5 rounded-xl transition-all ${
                                        isActive
                                            ? 'bg-rose-900/20 text-rose-400 border border-rose-900/30'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                )}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                {!user ? (
                    <div className="space-y-2">
                        <NavLink to="/login" onClick={closeSidebar}
                                 className="block w-full text-center py-2 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold transition">
                            Anmelden
                        </NavLink>
                        <NavLink to="/register" onClick={closeSidebar}
                                 className="block w-full text-center py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition">
                            Registrieren
                        </NavLink>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="px-4 py-2 bg-slate-800/50 rounded-xl">
                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                            <p className="text-[10px] font-bold text-blue-500 uppercase">{user.role}</p>
                        </div>
                        <button
                            onClick={() => { logout(); closeSidebar(); }}
                            className="w-full flex items-center justify-center gap-2 py-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-xl transition-all font-medium text-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Abmelden
                        </button>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;