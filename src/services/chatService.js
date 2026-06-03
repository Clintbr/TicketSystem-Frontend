import { GoogleGenAI } from '@google/genai';


// API-Key wird sicher aus den Netlify-Umgebungsvariablen geladen
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY});

export const askBot = async (userMessage) => {
    try {
        // 1. Lade die info.txt aus dem public-Ordner
        const response = await fetch('/bot-info.txt');
        const siteContext = await response.text();

        // 2. Gemini 1.5 Flash aufrufen (das schnellste und kostenlose Modell)
        const aiResponse = await ai.models.generateContent({
            model: 'gemini-3.5-flash',
            contents: userMessage,
            config: {
                systemInstruction: `Du bist ein hilfreicher Support-Assistent für diese Webseite. 
                Nutze AUSSCHLIESSLICH die folgenden Informationen, um die Frage des Nutzers zu beantworten. 
                Wenn die Antwort nicht in den Informationen steht, sag höflich, dass du das nicht weißt.
                
                Hier sind die Informationen:
                ${siteContext}`,
                temperature: 0.3, // Niedrige Kreativität = weniger Erfindungen (Halluzinationen)
            }
        });

        return aiResponse.text;
    } catch (error) {
        console.error("Fehler beim Chatbot-Aufruf:", error);
        return "Entschuldigung, ich habe gerade Verbindungsprobleme. Bitte versuche es später noch einmal.";
    }
};