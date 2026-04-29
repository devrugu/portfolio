"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React from "react";

// ── Lightweight Markdown Renderer ────────────────────────────────────────────
function renderInline(str: string, keyPrefix: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    // bold **text**, italic *text*, code `text`, link [text](url)
    const regex = /\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`|\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    let last = 0;
    let idx = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(str)) !== null) {
        if (match.index > last) {
            parts.push(str.slice(last, match.index));
        }
        const key = `${keyPrefix}-${idx++}`;
        if (match[1] !== undefined) {
            parts.push(<strong key={key} className="font-bold text-accent">{match[1]}</strong>);
        } else if (match[2] !== undefined) {
            parts.push(<em key={key} className="italic opacity-90">{match[2]}</em>);
        } else if (match[3] !== undefined) {
            parts.push(<code key={key} className="bg-gray-900 px-1 py-0.5 rounded text-xs font-mono text-green-300">{match[3]}</code>);
        } else if (match[4] !== undefined && match[5] !== undefined) {
            parts.push(
                <a key={key} href={match[5]} target="_blank" rel="noopener noreferrer"
                    className="text-accent underline underline-offset-2 hover:opacity-80 break-all">
                    {match[4]}
                </a>
            );
        }
        last = regex.lastIndex;
    }
    if (last < str.length) parts.push(str.slice(last));
    return parts;
}

function MarkdownText({ text }: { text: string }) {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let keyIdx = 0;
    let listItems: React.ReactNode[] = [];

    function flushList() {
        if (listItems.length > 0) {
            elements.push(
                <ul key={keyIdx++} className="list-disc list-inside space-y-0.5 my-1 pl-1">
                    {listItems}
                </ul>
            );
            listItems = [];
        }
    }

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed) {
            flushList();
            elements.push(<div key={keyIdx++} className="h-1.5" />);
            continue;
        }

        if (/^### (.+)/.test(trimmed)) {
            flushList();
            elements.push(<p key={keyIdx++} className="font-semibold text-accent mt-1.5 mb-0.5 text-sm">{renderInline(trimmed.replace(/^### /, ""), String(keyIdx))}</p>);
        } else if (/^## (.+)/.test(trimmed)) {
            flushList();
            elements.push(<p key={keyIdx++} className="font-bold text-sm mt-2 mb-1 text-primary">{renderInline(trimmed.replace(/^## /, ""), String(keyIdx))}</p>);
        } else if (/^# (.+)/.test(trimmed)) {
            flushList();
            elements.push(<p key={keyIdx++} className="font-bold text-base mt-2 mb-1 text-primary">{renderInline(trimmed.replace(/^# /, ""), String(keyIdx))}</p>);
        } else if (/^[-*] (.+)/.test(trimmed)) {
            listItems.push(<li key={keyIdx++} className="text-sm leading-relaxed">{renderInline(trimmed.replace(/^[-*] /, ""), String(keyIdx))}</li>);
        } else if (/^\d+\. (.+)/.test(trimmed)) {
            flushList();
            elements.push(<p key={keyIdx++} className="mb-1 leading-relaxed">{renderInline(trimmed, String(keyIdx))}</p>);
        } else if (/^> (.+)/.test(trimmed)) {
            flushList();
            elements.push(<blockquote key={keyIdx++} className="border-l-2 border-accent/50 pl-3 italic opacity-80 my-1">{renderInline(trimmed.replace(/^> /, ""), String(keyIdx))}</blockquote>);
        } else if (trimmed === "---") {
            flushList();
            elements.push(<hr key={keyIdx++} className="border-gray-600/50 my-2" />);
        } else {
            flushList();
            elements.push(<p key={keyIdx++} className="mb-1.5 leading-relaxed">{renderInline(trimmed, String(keyIdx))}</p>);
        }
    }
    flushList();
    return <div>{elements}</div>;
}

// ── Constants ─────────────────────────────────────────────────────────────────
interface Message {
    role: "user" | "assistant";
    content: string;
}

const SUGGESTED = [
    "What does Uğurcan work on?",
    "What are his technical skills?",
    "Tell me about his projects",
    "How can I contact him?",
];

const FUN_MODES = [
    { id: "roast", label: "🔥 Roast Mode", prompt: "Roast Uğurcan's CV in a funny but friendly way. Be humorous, not mean." },
    { id: "eli5", label: "👶 ELI5 Mode", prompt: "Explain what Uğurcan does as if I'm 5 years old. Use simple words and fun analogies." },
    { id: "hype", label: "🚀 Hype Mode", prompt: "Hype up Uğurcan like he's the greatest software engineer who ever lived. Be dramatic and enthusiastic." },
    { id: "haiku", label: "🎋 Write a Haiku", prompt: "Write a haiku about Uğurcan's work and skills." },
    { id: "job", label: "💼 Write Cover Letter", prompt: "Write a short, professional cover letter for Uğurcan applying for a senior C++ engineer position." },
];

const GREETING: Message = {
    role: "assistant",
    content: "Hi! 👋 I'm an AI assistant trained on Uğurcan's background. Ask me anything about his work, skills, or projects!",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const bottomRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, loading]);

    useEffect(() => {
        if (open && messages.length === 0) {
            setMessages([GREETING]);
        }
        if (open) setTimeout(() => inputRef.current?.focus(), 100);
    }, [open]);

    function clearChat() {
        setMessages([{ role: "assistant", content: "Chat cleared! Ask me anything about Uğurcan. 😊" }]);
        setError("");
    }

    async function sendMessage(text: string) {
        if (!text.trim() || loading) return;
        setError("");

        const userMsg: Message = { role: "user", content: text };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to get response.");
            setMessages(m => [...m, { role: "assistant", content: data.reply }]);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        sendMessage(input);
    }

    const showSuggestions = messages.length === 1 && !loading;

    return (
        <>
            {/* Floating button */}
            <motion.button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-20 right-6 z-50 w-12 h-12 rounded-full bg-accent hover:bg-accent-hover shadow-lg flex items-center justify-center transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Chat with AI"
            >
                <AnimatePresence mode="wait">
                    {open ? (
                        <motion.svg key="close"
                            initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.15 }} xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </motion.svg>
                    ) : (
                        <motion.svg key="chat"
                            initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.15 }} xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </motion.svg>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat window */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 16 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed bottom-36 right-6 z-50 w-[380px] sm:w-[440px]"
                    >
                        <div className="bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                            style={{ height: "580px" }}>

                            {/* Header */}
                            <div className="flex items-center gap-3 px-4 py-3.5 bg-gray-900 border-b border-gray-700/50 flex-shrink-0">
                                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-sm flex-shrink-0">
                                    🤖
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-primary font-semibold text-sm">Ask about Uğurcan</p>
                                    <p className="text-gray-500 text-xs">AI assistant · Powered by Mistral</p>
                                </div>
                                {messages.length > 1 && (
                                    <button onClick={clearChat} title="Clear chat"
                                        className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0 mr-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                )}
                                <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-on-background transition-colors flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm ${msg.role === "user"
                                                ? "bg-accent text-on-primary rounded-br-sm"
                                                : "bg-gray-800/80 text-on-background rounded-bl-sm"
                                            }`}>
                                            {msg.role === "user" ? msg.content : <MarkdownText text={msg.content} />}
                                        </div>
                                    </div>
                                ))}

                                {/* Typing indicator */}
                                {loading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-800/80 rounded-2xl rounded-bl-sm px-4 py-3">
                                            <div className="flex gap-1.5 items-center">
                                                {[0, 1, 2].map(i => (
                                                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400"
                                                        animate={{ y: [0, -4, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                                {/* Suggestions */}
                                {showSuggestions && (
                                    <div className="space-y-1.5 pt-1">
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold px-1">Quick questions</p>
                                        {SUGGESTED.map(q => (
                                            <button key={q} onClick={() => sendMessage(q)}
                                                className="w-full text-left text-xs text-gray-400 hover:text-accent bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-accent/30 rounded-xl px-3 py-2 transition-all">
                                                {q}
                                            </button>
                                        ))}
                                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold px-1 pt-2">Fun stuff ✨</p>
                                        {FUN_MODES.map(m => (
                                            <button key={m.id} onClick={() => sendMessage(m.prompt)}
                                                className="w-full text-left text-xs text-gray-400 hover:text-accent bg-gray-800/40 hover:bg-gray-800/70 border border-gray-700/40 hover:border-accent/30 rounded-xl px-3 py-2 transition-all">
                                                {m.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <div className="border-t border-gray-700/50 p-3 flex-shrink-0">
                                <form onSubmit={handleSubmit} className="flex gap-2">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder="Ask me anything…"
                                        disabled={loading}
                                        className="flex-1 bg-gray-800/60 border border-gray-700 rounded-xl px-3 py-2 text-sm text-primary placeholder-gray-500 focus:outline-none focus:border-accent transition-colors disabled:opacity-50"
                                    />
                                    <button type="submit" disabled={loading || !input.trim()}
                                        className="w-9 h-9 rounded-xl bg-accent hover:bg-accent-hover disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-on-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </button>
                                </form>
                                <p className="text-[10px] text-gray-600 text-center mt-2">
                                    Powered by Mistral AI · May make mistakes
                                </p>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}