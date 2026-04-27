"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
    const [openToWork, setOpenToWork] = useState(false);
    const [statusText, setStatusText] = useState("Open to Opportunities");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savedMsg, setSavedMsg] = useState("");

    useEffect(() => {
        fetch("/api/site-settings")
            .then(r => r.json())
            .then(d => {
                setOpenToWork(d.openToWork ?? false);
                setStatusText(d.statusText ?? "Open to Opportunities");
                setLoading(false);
            });
    }, []);

    async function save() {
        setSaving(true);
        setSavedMsg("");
        await Promise.all([
            fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "openToWork", value: openToWork }) }),
            fetch("/api/site-settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key: "statusText", value: statusText }) }),
        ]);
        setSaving(false);
        setSavedMsg("Settings saved!");
        setTimeout(() => setSavedMsg(""), 3000);
    }

    if (loading) return <div className="text-gray-400 text-sm">Loading…</div>;

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Site Settings</h1>
            <p className="text-on-background text-sm mb-10">Control what visitors see across your site.</p>

            <div className="max-w-lg space-y-6">

                {/* Availability card */}
                <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-6 space-y-5">
                    <div>
                        <h2 className="text-primary font-semibold mb-1">Availability Badge</h2>
                        <p className="text-gray-500 text-sm">Shows a pulsing green badge in the header next to your name on every page.</p>
                    </div>

                    {/* Toggle row */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-on-background">
                            {openToWork ? "Badge is visible" : "Badge is hidden"}
                        </span>
                        <button
                            type="button"
                            role="switch"
                            aria-checked={openToWork}
                            onClick={() => setOpenToWork(o => !o)}
                            className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-gray-900 ${openToWork ? "bg-green-500" : "bg-gray-600"}`}
                        >
                            <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-200 ${openToWork ? "translate-x-8" : "translate-x-1"}`}
                            />
                        </button>
                    </div>

                    {/* Badge text */}
                    <div>
                        <label className="text-xs text-gray-500 uppercase tracking-widest block mb-2">Badge text</label>
                        <input
                            type="text"
                            value={statusText}
                            onChange={e => setStatusText(e.target.value)}
                            maxLength={40}
                            placeholder="Open to Opportunities"
                            className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-primary text-sm focus:outline-none focus:border-accent transition-colors"
                        />
                        <p className="text-xs text-gray-600 mt-1 text-right">{statusText.length}/40</p>
                    </div>

                    {/* Live preview */}
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Live preview</p>
                        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl px-5 py-4 flex items-center gap-3">
                            <span className="text-primary font-bold text-sm">Uğurcan Yılmaz</span>
                            {openToWork && statusText && (
                                <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/25 rounded-full px-3 py-1">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                                    </span>
                                    <span className="text-green-400 text-xs font-medium">{statusText}</span>
                                </div>
                            )}
                        </div>
                        {!openToWork && (
                            <p className="text-xs text-gray-600 mt-2">Toggle on to see the preview</p>
                        )}
                    </div>
                </div>

                {/* Save */}
                <button
                    onClick={save}
                    disabled={saving}
                    className="w-full bg-accent text-on-primary font-semibold py-3 rounded-xl hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {saving ? (
                        <>
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Saving…
                        </>
                    ) : "Save Settings"}
                </button>

                {savedMsg && (
                    <p className="text-green-400 text-sm text-center font-medium">{savedMsg}</p>
                )}
            </div>
        </div>
    );
}