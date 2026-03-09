import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Menu } from 'lucide-react'; // Nutzt die Luicde-Icons für Konsistenz

const Navbar = ({ onMenuClick }) => {
    const { user } = useContext(AuthContext);

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-30">
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuClick}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden transition-colors"
                    aria-label="Menü öffnen"
                >
                    <Menu size={24} />
                </button>

                <div className="text-sm text-slate-500 hidden sm:block">
                    Übersicht / <span className="text-slate-900 font-medium">Dashboard</span>
                </div>
            </div>

            <div className="flex items-center space-x-4">
                {user ? (
                    <div className="flex items-center space-x-3">
                        <div className="text-right hidden xs:block">
                            <p className="text-sm font-semibold text-slate-900 leading-tight">
                                {user.username}
                            </p>
                            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-tighter">
                                {user.role?.replace('ROLE_', '')}
                            </p>
                        </div>
                        <div className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-2xl font-bold shadow-sm shadow-blue-200">
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                ) : (
                    <span className="text-sm text-slate-400 italic">Gast-Modus</span>
                )}
            </div>
        </header>
    );
};

export default Navbar;