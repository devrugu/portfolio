"use client";

import { useEffect, useState } from "react";

interface ProjectStat {
    slug: string;
    views: number;
}

const PROJECT_NAMES: Record<string, string> = {
    "sonar-system": "Onboard Sonar System",
    "fir-filter": "FIR Band-Pass Filter",
    "digital-watermarking": "Fragile Digital Watermarking",
    "healthcare-system": "Healthcare Management System",
    "event-certificate": "Event & Certificate System",
    "regex-engine": "Regular Expression Engine",
    "histogram-analysis": "Histogram Analysis",
};

export default function ProjectViewsPage() {
    const [stats, setStats] = useState<ProjectStat[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch views for all projects in parallel
        const slugs = Object.keys(PROJECT_NAMES);
        Promise.all(
            slugs.map(slug =>
                fetch(`/api/project-views?slug=${slug}`)
                    .then(r => r.json())
                    .then(d => ({ slug, views: d.views ?? 0 }))
            )
        )
            .then(results => {
                setStats(results.sort((a, b) => b.views - a.views));
                setLoading(false);
            })
            .catch(() => { setError("Failed to load stats."); setLoading(false); });
    }, []);

    const totalViews = stats.reduce((s, p) => s + p.views, 0);
    const maxViews = Math.max(...stats.map(p => p.views), 1);

    return (
        <div>
            <h1 className="text-4xl font-bold text-primary mb-2">Project Views</h1>
            <p className="text-on-background text-sm mb-8">How many times each project page has been visited.</p>

            {loading && (
                <div className="flex items-center gap-3 text-gray-400 text-sm">
                    <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                    Loading…
                </div>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            {!loading && !error && (
                <>
                    {/* Total */}
                    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 mb-6 inline-flex items-center gap-4">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Total project views</p>
                            <p className="text-4xl font-bold text-accent mt-1">{totalViews.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Per project */}
                    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-900/60 text-gray-400 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-5 py-4 text-left">Project</th>
                                    <th className="px-5 py-4 text-right w-24">Views</th>
                                    <th className="px-5 py-4 w-48 hidden md:table-cell"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700/40">
                                {stats.map((p, i) => (
                                    <tr key={p.slug} className="hover:bg-gray-800/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gray-600 font-mono text-xs w-4">{i + 1}</span>
                                                <span className="text-primary font-medium">
                                                    {PROJECT_NAMES[p.slug] || p.slug}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-right text-accent font-semibold font-mono">
                                            {p.views.toLocaleString()}
                                        </td>
                                        <td className="px-5 py-4 hidden md:table-cell">
                                            <div className="w-full bg-gray-700/30 rounded-full h-1.5">
                                                <div
                                                    className="bg-accent h-1.5 rounded-full transition-all"
                                                    style={{ width: `${Math.round((p.views / maxViews) * 100)}%` }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}