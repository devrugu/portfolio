"use client";

import { useEffect, useState } from "react";

interface Viewer {
    _id: string;
    firstName: string;
    lastName: string;
    phone: string;
    ip?: string;
    country?: string;
    viewedAt: string;
}

export default function PhoneViewersPage() {
    const [viewers, setViewers] = useState<Viewer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetch("/api/phone-viewers")
            .then(r => r.json())
            .then(d => { setViewers(d.viewers || []); setLoading(false); })
            .catch(() => { setError("Failed to load data."); setLoading(false); });
    }, []);

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Phone Number Viewers</h1>
            <p className="text-on-background mb-8 text-sm">
                People who verified their phone number to see your contact number.
            </p>

            {loading && <p className="text-on-background">Loading…</p>}
            {error && <p className="text-red-400">{error}</p>}

            {!loading && !error && viewers.length === 0 && (
                <p className="text-gray-500">No verified viewers yet.</p>
            )}

            {!loading && viewers.length > 0 && (
                <div className="overflow-x-auto rounded-xl border border-gray-700/50">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-900/60 text-gray-400 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-5 py-4">#</th>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">Phone</th>
                                <th className="px-5 py-4">Country</th>
                                <th className="px-5 py-4">IP</th>
                                <th className="px-5 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/40">
                            {viewers.map((v, i) => (
                                <tr key={v._id} className="hover:bg-gray-800/30 transition-colors">
                                    <td className="px-5 py-4 text-gray-500">{i + 1}</td>
                                    <td className="px-5 py-4 text-primary font-medium">
                                        {v.firstName} {v.lastName}
                                    </td>
                                    <td className="px-5 py-4 text-accent font-mono">{v.phone}</td>
                                    <td className="px-5 py-4 text-on-background">{v.country || "—"}</td>
                                    <td className="px-5 py-4 text-gray-500 font-mono text-xs">{v.ip || "—"}</td>
                                    <td className="px-5 py-4 text-gray-400">
                                        {new Date(v.viewedAt).toLocaleString("tr-TR", {
                                            day: "2-digit", month: "short", year: "numeric",
                                            hour: "2-digit", minute: "2-digit",
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="px-5 py-3 bg-gray-900/30 border-t border-gray-700/50 text-xs text-gray-500">
                        {viewers.length} record{viewers.length !== 1 ? "s" : ""} total
                    </div>
                </div>
            )}
        </div>
    );
}