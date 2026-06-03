import { useState, useRef, useEffect } from 'react';
import { askBot } from '../../services/chatService';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hallo! Ich bin dein Support-Assistent. Wie kann ich dir heute helfen?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Automatisch nach unten scrollen bei neuen Nachrichten
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput("");
        setMessages(prev => [...prev, { text: userText, isBot: false }]);
        setIsLoading(true);

        // Antwort vom Service holen
        const botReply = await askBot(userText);

        setMessages(prev => [...prev, { text: botReply, isBot: true }]);
        setIsLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* 1. FLOATING BUTTON (Wird angezeigt, wenn Chat zu ist) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                >
                    {/* Chat-Icon (SVG) */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 0 1-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
                    </svg>
                </button>
            )}

            {/* 2. CHAT FENSTER (Wird angezeigt, wenn isOpen === true) */}
            {isOpen && (
                <div className="flex h-[450px] w-80 flex-col rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden sm:w-96 transition-all">
                    {/* Header */}
                    <div className="flex items-center justify-between bg-blue-600 p-4 text-white">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                            <h3 className="font-semibold text-sm">Support Assistent</h3>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="rounded p-1 hover:bg-blue-700 transition-colors"
                        >
                            {/* Schließen-Icon (X) */}
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Nachrichten-Bereich */}
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        msg.isBot
                                            ? 'bg-white text-gray-800 rounded-bl-none'
                                            : 'bg-blue-600 text-white rounded-br-none'
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-400 rounded-2xl rounded-bl-none px-4 py-2 text-sm shadow-sm flex gap-1 items-center">
                                    <span className="animate-bounce">●</span>
                                    <span className="animate-bounce [animation-delay:0.2s]">●</span>
                                    <span className="animate-bounce [animation-delay:0.4s]">●</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Eingabe-Formular */}
                    <form onSubmit={handleSend} className="flex border-t border-gray-100 p-3 bg-white">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Frage stellen..."
                            disabled={isLoading}
                            className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-50"
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                        >
                            Senden
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ChatBot;