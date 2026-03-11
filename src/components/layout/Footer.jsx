import React from 'react';
import { Github, Mail, Globe } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white border-t border-slate-200 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                    <div className="text-center md:text-left">
                        <h2 className="text-lg font-black text-slate-900 tracking-tighter">
                            Ticket<span className="text-blue-600">System</span>
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Entwickelt von <span className="font-bold text-slate-700 underline decoration-blue-300">Clint Bryan Nguena</span> <br/>
                            Engineer and Software-developer Junior <br/>
                            See my other Projects: <span className="font-bold text-blue-600  underline decoration-blue-300"><a
                            href="https://clintbr.github.io/mein_Portfolio/">Clint.Portfolio</a></span> <br/>
                            Want to collaborate? <span className="font-bold text-blue-600  underline decoration-blue-300"><a
                            href="https://clintbr.github.io/mein_Portfolio/kontakt.html">Contact me</a></span>
                        </p>
                    </div>

                    <div className="text-slate-400 text-xs font-medium">
                        &copy; {currentYear} Alle Rechte vorbehalten.
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="https://github.com/Clintbr" target={"_blank"} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                            <Github size={18} />
                        </a>
                        <a href="https://clintbr.github.io/mein_Portfolio/kontakt.html" target={"_blank"} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                            <Mail size={18} />
                        </a>
                        <a href="https://clintbr.github.io/mein_Portfolio/" target={"_blank"} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all">
                            <Globe size={18} />
                        </a>
                    </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-50 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                        Precision Engineering & UI Design <br/>
                        <span className="text-blue-400"> Version 1.0.0</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;