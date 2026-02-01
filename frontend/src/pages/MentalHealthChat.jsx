import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Send, User, Bot, Loader2 } from "lucide-react";

const MentalHealthChat = () => {
    const [messages, setMessages] = useState([
        {
            role: "bot",
            text: "Hi there. I'm here to listen. How are you feeling today?",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setLoading(true);

        const lowercaseInput = input.toLowerCase().trim();
        if (lowercaseInput === "i am anxious") {
            const botMessage = {
                role: "bot",
                text: "I'm sorry to hear that. I suggest trying some deep breathing exercises, a short walk, or listening to some calming music. You're not alone in this."
            };
            setMessages((prev) => [...prev, botMessage]);
            setLoading(false);
            return;
        }

        if (lowercaseInput === "i am happy") {
            const botMessage = {
                role: "bot",
                text: "That's wonderful to hear! I'm so glad you're having a good day. It's great to appreciate these positive moments."
            };
            setMessages((prev) => [...prev, botMessage]);
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("https://shikshacare-5ke4.onrender.com/api/chat/analyze", {
                message: input,
            });

            const botMessage = { role: "bot", text: response.data.reply };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage = {
                role: "bot",
                text: "I'm having trouble connecting right now. Please try again later.",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
            <div className="flex-1 w-full max-w-4xl mx-auto p-4 flex flex-col">
                <header className="mb-6 text-center">
                    <h1 className="text-3xl font-bold text-gray-800">Peace of Mind</h1>
                    <p className="text-gray-600 mt-2">A safe space to share your thoughts.</p>
                </header>

                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`flex max-w-[80%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                        } items-start gap-2`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-indigo-600" : "bg-emerald-500"
                                            }`}
                                    >
                                        {msg.role === "user" ? (
                                            <User className="w-5 h-5 text-white" />
                                        ) : (
                                            <Bot className="w-5 h-5 text-white" />
                                        )}
                                    </div>
                                    <div
                                        className={`p-4 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                                            ? "bg-indigo-600 text-white rounded-tr-none"
                                            : "bg-gray-100 text-gray-800 rounded-tl-none"
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex flex-row items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="bg-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                                        <span className="text-gray-400 text-sm">Typing...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="How are you feeling today?"
                                className="w-full p-4 pr-12 rounded-xl bg-gray-50 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all outline-none text-gray-700 placeholder:text-gray-400"
                                disabled={loading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-2">
                            I am an AI assistant. For serious crises, please contact a professional immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MentalHealthChat;
