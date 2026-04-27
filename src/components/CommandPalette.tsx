"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Command {
    id: string;
    label: string;
    description?: string;
    icon: string;
    action: () => void;
    keywords?: string[];
    group: string;
}

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [active, setActive] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const go = useCallback((path: string) => {
        setOpen(false);
        setQuery("");
        router.push(path);
    }, [router]);

    const commands: Command[] = [
        // Navigation
        { id: "home", group: "Navigation", icon: "🏠", label: "Home", action: () => go("/") },
        { id: "about", group: "Navigation", icon: "👤", label: "About", action: () => go("/about") },
        { id: "resume", group: "Navigation", icon: "📄", label: "Resume", action: () => go("/resume") },
        { id: "blog", group: "Navigation", icon: "✍️", label: "Blog", action: () => go("/blog") },
        { id: "contact", group: "Navigation", icon: "✉️", label: "Contact", action: () => go("/contact") },
        { id: "now", group: "Navigation", icon: "⚡", label: "Now", action: () => go("/now") },
        // Projects
        { id: "sonar", group: "Projects", icon: "📡", label: "Onboard Sonar System", keywords: ["tubitak", "bilgem", "qt", "cpp"], action: () => go("/projects/sonar-system") },
        { id: "fir", group: "Projects", icon: "📊", label: "FIR Band-Pass Filter", keywords: ["signal", "dsp", "c"], action: () => go("/projects/fir-filter") },
        { id: "watermark", group: "Projects", icon: "🖼️", label: "Digital Watermarking", keywords: ["python", "image"], action: () => go("/projects/digital-watermarking") },
        { id: "healthcare", group: "Projects", icon: "🏥", label: "Healthcare Management System", keywords: ["php", "mysql", "lamp"], action: () => go("/projects/healthcare-system") },
        { id: "event", group: "Projects", icon: "🎓", label: "Event & Certificate System", keywords: ["php", "mysql", "pdf"], action: () => go("/projects/event-certificate") },
        { id: "regex", group: "Projects", icon: "🔤", label: "Regular Expression Engine", keywords: ["javascript", "js"], action: () => go("/projects/regex-engine") },
        { id: "histogram", group: "Projects", icon: "📈", label: "Histogram Analysis", keywords: ["image", "c", "grayscale"], action: () => go("/projects/histogram-analysis") },
        // Actions
        { id: "download-cv", group: "Actions", icon: "⬇️", label: "Download CV as PDF", keywords: ["resume", "pdf", "download"], action: () => { setOpen(false); window.open("/resume/print", "_blank"); } },
        { id: "github", group: "Actions", icon: "🐙", label: "Open GitHub Profile", keywords: ["code", "repos"], action: () => { setOpen(false); window.open("https://github.com/devrugu", "_blank"); } },
        { id: "linkedin", group: "Actions", icon: "💼", label: "Open LinkedIn Profile", keywords: ["job", "work", "career"], action: () => { setOpen(false); window.open("https://tr.linkedin.com/in/kazuhira", "_blank"); } },
        { id: "theme", group: "Actions", icon: "🌙", label: "Toggle Dark / Light Mode", keywords: ["theme", "dark", "light"], action: () => { setOpen(false); document.querySelector<HTMLButtonElement>('[aria-label="Toggle theme"]')?.click(); } },
    ];

    // Filter commands by query
    const filtered = query.trim() === ""
        ? commands
        : commands.filter(c => {
            const q = query.toLowerCase();
            return (
                c.label.toLowerCase().includes(q) ||
                c.group.toLowerCase().includes(q) ||
                c.keywords?.some(k => k.includes(q))
            );
        });

    // Group filtered results
    const groups = filtered.reduce((acc: Record<string, Command[]>, cmd) => {
        if (!acc[cmd.group]) acc[cmd.group] = [];
        acc[cmd.group].push(cmd);
        return acc;
    }, {});

    const flatFiltered = Object.values(groups).flat();

    // Keyboard shortcuts
    useEffect(() => {
        function onKeyDown(e: KeyboardEvent) {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen(o => !o);
                setQuery("");
                setActive(0);
            }
            if (!open) return;
            if (e.key === "Escape") { setOpen(false); setQuery(""); }
            if (e.key === "ArrowDown") { e.preventDefault(); setActive(a => Math.min(a + 1, flatFiltered.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
            if (e.key === "Enter") { e.preventDefault(); flatFiltered[active]?.action(); }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, flatFiltered, active]);

    // Focus input when opened
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    // Reset active on query change
    useEffect(() => { setActive(0); }, [query]);

    // Scroll active item into view
    useEffect(() => {
        const el = listRef.current?.querySelector(`[data-index="${active}"]`);
        el?.scrollIntoView({ block: "nearest" });
    }, [active]);

    let globalIndex = 0;

    return (
        <>
            {/* Trigger button — visible on desktop */}
            <button
                onClick={() => { setOpen(true); setQuery(""); setActive(0); }}
                className="hidden md:flex items-center gap-2 text-xs text-gray-500 hover:text-on-background border border-gray-700/50 hover:border-gray-600 rounded-lg px-3 py-1.5 transition-colors bg-gray-800/30"
                aria-label="Open command palette"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search…</span>
                <kbd className="ml-1 text-[10px] bg-gray-700/50 px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                            onClick={() => { setOpen(false); setQuery(""); }}
                        />

                        {/* Palette */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96, y: -8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96, y: -8 }}
                            transition={{ duration: 0.15 }}
                            className="fixed top-[15vh] left-1/2 -translate-x-1/2 w-full max-w-xl z-[101] px-4"
                        >
                            <div className="bg-gray-900 border border-gray-700/60 rounded-2xl shadow-2xl overflow-hidden">

                                {/* Search input */}
                                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-700/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Search pages, projects, actions…"
                                        value={query}
                                        onChange={e => setQuery(e.target.value)}
                                        className="flex-1 bg-transparent text-primary placeholder-gray-500 text-sm focus:outline-none"
                                    />
                                    <kbd className="text-[10px] text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded font-mono">ESC</kbd>
                                </div>

                                {/* Results */}
                                <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
                                    {filtered.length === 0 ? (
                                        <p className="text-center text-gray-500 text-sm py-8">No results for "{query}"</p>
                                    ) : (
                                        Object.entries(groups).map(([group, cmds]) => (
                                            <div key={group}>
                                                <p className="text-[10px] text-gray-600 uppercase tracking-widest font-semibold px-4 py-2">
                                                    {group}
                                                </p>
                                                {cmds.map(cmd => {
                                                    const idx = globalIndex++;
                                                    const isActive = idx === active;
                                                    return (
                                                        <button
                                                            key={cmd.id}
                                                            data-index={idx}
                                                            onClick={cmd.action}
                                                            onMouseEnter={() => setActive(idx)}
                                                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors ${isActive ? "bg-accent/15 text-primary" : "text-on-background hover:bg-gray-800/50"}`}
                                                        >
                                                            <span className="text-base w-5 flex-shrink-0 text-center">{cmd.icon}</span>
                                                            <span className="flex-1">{cmd.label}</span>
                                                            {isActive && (
                                                                <kbd className="text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded font-mono">↵</kbd>
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-700/50 text-[10px] text-gray-600">
                                    <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1 py-0.5 rounded font-mono">↑↓</kbd> navigate</span>
                                    <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1 py-0.5 rounded font-mono">↵</kbd> open</span>
                                    <span className="flex items-center gap-1"><kbd className="bg-gray-800 px-1 py-0.5 rounded font-mono">ESC</kbd> close</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}