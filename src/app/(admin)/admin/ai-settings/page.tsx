"use client";

import { useEffect, useState } from "react";

interface AISettings {
    enabled: boolean;
    model: string;
    temperature: number;
    maxTokens: number;
    systemAppend: string;
    logging: boolean;
}

interface ChatLog {
    _id: string;
    messages: { role: string; content: string }[];
    model: string;
    ipAddress: string;
    createdAt: string;
}

const MODELS = [
    { id: "mistral-small-latest", label: "Mistral Small", desc: "Fast, free tier — recommended" },
    { id: "mistral-medium-latest", label: "Mistral Medium", desc: "More capable, still free" },
    { id: "mistral-large-latest", label: "Mistral Large", desc: "Most capable, may be slower" },
    { id: "open-mistral-7b", label: "Mistral 7B", desc: "Smallest, fastest" },
];

export default function AISettingsPage() {
    const [settings, setSettings] = useState<AISettings>({
        enabled: true, model: "mistral-small-latest", temperature: 0.7,
        maxTokens: 300, systemAppend: "", logging: true,
    });
    const [logs, setLogs] = useState<ChatLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState("");
    const [activeTab, setActiveTab] = useState<"settings" | "logs">("settings");
    const [expanded, setExpanded] = useState<string | null>(null);

    useEffect(() => {
        Promise.all([
            fetch("/api/chat").then(r => r.json()),
            fetch("/api/chat-logs").then(r => r.json()),
        ]).then(([settingsData, logsData]) => {
            setSettings(s => ({ ...s, ...settingsData }));
            setLogs(logsData.logs || []);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    async function save() {
        setSaving(true);
        setSavedMsg("");
        const keys: (keyof AISettings)[] = ["enabled", "model", "temperature", "maxTokens", "systemAppend", "logging"];
        await Promise.all(keys.map(key =>
            fetch("/api/site-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ key: `ai${key.charAt(0).toUpperCase()}${key.slice(1)}`, value: settings[key] }),
            })
        ));
        setSaving(false);
        setSavedMsg("Settings saved!");
        setTimeout(() => setSavedMsg(""), 3000);
    }

    async function clearLogs() {
        if (!confirm("Delete all chat logs? This cannot be undone.")) return;
        await fetch("/api/chat-logs", { method: "DELETE" });
        setLogs([]);
    }

    if (loading) return <div className="text-gray-400 text-sm animate-pulse">Loading…</div>;

    const inputCls = "w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-primary text-sm focus:outline-none focus:border-accent transition-colors";
    const cardCls = "bg-gray-900/50 border border-gray-700/50 rounded-xl p-6";

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold text-primary">AI Settings</h1>
                <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded-full border ${settings.enabled ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-red-500/10 border-red-500/30 text-red-400"}`}>
                        <span className={`w-2 h-2 rounded-full ${settings.enabled ? "bg-green-500" : "bg-red-500"}`} />
                        {settings.enabled ? "Widget Active" : "Widget Disabled"}
                    </div>
                </div>
            </div>
            <p className="text-on-background text-sm mb-8">Control the AI chat widget that appears on your portfolio.</p>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-900/50 rounded-xl p-1 mb-8 w-fit">
                {(["settings", "logs"] as const).map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${activeTab === tab ? "bg-accent text-on-primary" : "text-gray-400 hover:text-on-background"}`}>
                        {tab} {tab === "logs" && `(${logs.length})`}
                    </button>
                ))}
            </div>

            {activeTab === "settings" && (
                <div className="max-w-2xl space-y-6">

                    {/* Enable/Disable */}
                    <div className={cardCls}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-primary font-semibold">Chat Widget</h2>
                                <p className="text-gray-500 text-sm mt-0.5">Show or hide the AI chat button on your site</p>
                            </div>
                            <button
                                onClick={() => setSettings(s => ({ ...s, enabled: !s.enabled }))}
                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${settings.enabled ? "bg-green-500" : "bg-gray-600"}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${settings.enabled ? "translate-x-8" : "translate-x-1"}`} />
                            </button>
                        </div>
                    </div>

                    {/* Model */}
                    <div className={cardCls}>
                        <h2 className="text-primary font-semibold mb-4">AI Model</h2>
                        <div className="space-y-2">
                            {MODELS.map(m => (
                                <button key={m.id} onClick={() => setSettings(s => ({ ...s, model: m.id }))}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all text-left ${settings.model === m.id ? "border-accent bg-accent/10" : "border-gray-700/50 hover:border-gray-600 bg-gray-800/30"}`}>
                                    <div>
                                        <p className={`font-medium text-sm ${settings.model === m.id ? "text-accent" : "text-primary"}`}>{m.label}</p>
                                        <p className="text-gray-500 text-xs mt-0.5">{m.desc}</p>
                                    </div>
                                    {settings.model === m.id && (
                                        <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className={cardCls}>
                        <h2 className="text-primary font-semibold mb-5">Generation Parameters</h2>
                        <div className="space-y-5">

                            {/* Temperature */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm text-on-background">Temperature</label>
                                    <span className="text-accent font-mono text-sm font-semibold">{settings.temperature.toFixed(1)}</span>
                                </div>
                                <input type="range" min="0" max="2" step="0.1" value={settings.temperature}
                                    onChange={e => setSettings(s => ({ ...s, temperature: parseFloat(e.target.value) }))}
                                    className="w-full accent-amber-400" />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>0.0 — Focused</span>
                                    <span>1.0 — Balanced</span>
                                    <span>2.0 — Creative</span>
                                </div>
                            </div>

                            {/* Max tokens */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm text-on-background">Max Tokens</label>
                                    <span className="text-accent font-mono text-sm font-semibold">{settings.maxTokens}</span>
                                </div>
                                <input type="range" min="50" max="1000" step="50" value={settings.maxTokens}
                                    onChange={e => setSettings(s => ({ ...s, maxTokens: parseInt(e.target.value) }))}
                                    className="w-full accent-amber-400" />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                    <span>50 — Brief</span>
                                    <span>300 — Normal</span>
                                    <span>1000 — Detailed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Custom instructions */}
                    <div className={cardCls}>
                        <h2 className="text-primary font-semibold mb-1">Custom Instructions</h2>
                        <p className="text-gray-500 text-xs mb-4">Additional instructions appended to the system prompt. Use this to add new info about yourself, change the tone, or give special instructions.</p>
                        <textarea
                            value={settings.systemAppend}
                            onChange={e => setSettings(s => ({ ...s, systemAppend: e.target.value }))}
                            rows={5}
                            placeholder={"e.g. Always respond in a very casual tone.\ne.g. I am currently looking for internships.\ne.g. My new project is XYZ, describe it as..."}
                            className={`${inputCls} resize-none font-mono text-xs`}
                        />
                        <p className="text-xs text-gray-600 mt-1.5 text-right">{settings.systemAppend.length} chars</p>
                    </div>

                    {/* Logging */}
                    <div className={cardCls}>
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-primary font-semibold">Conversation Logging</h2>
                                <p className="text-gray-500 text-sm mt-0.5">Save all chat conversations to MongoDB for review</p>
                            </div>
                            <button
                                onClick={() => setSettings(s => ({ ...s, logging: !s.logging }))}
                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors ${settings.logging ? "bg-accent" : "bg-gray-600"}`}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${settings.logging ? "translate-x-8" : "translate-x-1"}`} />
                            </button>
                        </div>
                    </div>

                    {/* Save */}
                    <button onClick={save} disabled={saving}
                        className="w-full bg-accent text-on-primary font-semibold py-3 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? (
                            <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>Saving…</>
                        ) : "Save Settings"}
                    </button>
                    {savedMsg && <p className="text-green-400 text-sm text-center font-medium">{savedMsg}</p>}
                </div>
            )}

            {activeTab === "logs" && (
                <div>
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-gray-500 text-sm">{logs.length} conversation{logs.length !== 1 ? "s" : ""} logged</p>
                        {logs.length > 0 && (
                            <button onClick={clearLogs} className="text-xs text-red-400 hover:text-red-300 border border-red-500/30 hover:border-red-400/50 rounded-lg px-3 py-1.5 transition-colors">
                                Clear all logs
                            </button>
                        )}
                    </div>

                    {logs.length === 0 ? (
                        <div className="text-center py-16 text-gray-500">
                            <p className="text-4xl mb-3">💬</p>
                            <p>No conversations logged yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {logs.map((log) => {
                                const userMessages = log.messages.filter(m => m.role === "user");
                                const firstMsg = userMessages[0]?.content ?? "(no message)";
                                const isExpanded = expanded === log._id;
                                return (
                                    <div key={log._id} className="bg-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden">
                                        <button onClick={() => setExpanded(isExpanded ? null : log._id)}
                                            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/30 transition-colors text-left">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-primary text-sm font-medium truncate">{firstMsg}</p>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-gray-500 text-xs">{new Date(log.createdAt).toLocaleString("tr-TR")}</span>
                                                    <span className="text-gray-600 text-xs font-mono">{log.model}</span>
                                                    <span className="text-gray-600 text-xs">{log.messages.length} messages</span>
                                                    {log.ipAddress && <span className="text-gray-600 text-xs font-mono">{log.ipAddress}</span>}
                                                </div>
                                            </div>
                                            <svg className={`w-4 h-4 text-gray-500 flex-shrink-0 ml-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isExpanded && (
                                            <div className="px-5 pb-4 border-t border-gray-700/30 pt-4 space-y-2">
                                                {log.messages.map((msg, i) => (
                                                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                                        <div className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-accent/20 text-accent border border-accent/30" : "bg-gray-800 text-on-background"}`}>
                                                            <span className="block text-[10px] opacity-50 mb-0.5 uppercase tracking-wider">{msg.role}</span>
                                                            {msg.content}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}