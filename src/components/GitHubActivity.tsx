"use client";

import { useState, useEffect } from "react";

const GITHUB_USERNAME = "devrugu";

interface GitHubStats {
    public_repos: number;
    followers: number;
    following: number;
    created_at: string;
}

export default function GitHubActivity() {
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [imgError, setImgError] = useState(false);
    const [imgLoaded, setImgLoaded] = useState(false);

    useEffect(() => {
        fetch(`https://api.github.com/users/${GITHUB_USERNAME}`)
            .then(r => r.json())
            .then(d => {
                if (!d.message) setStats(d);
            })
            .catch(() => { });
    }, []);

    // github-readme-stats — most reliable free GitHub stats service
    const statsCardUrl = `https://github-readme-stats.vercel.app/api?username=${GITHUB_USERNAME}&show_icons=true&hide_border=true&bg_color=1a1a1a&title_color=FFC107&text_color=E0E0E0&icon_color=FFC107&hide=contribs,prs,issues&count_private=true`;
    const topLangsUrl = `https://github-readme-stats.vercel.app/api/top-langs/?username=${GITHUB_USERNAME}&layout=compact&hide_border=true&bg_color=1a1a1a&title_color=FFC107&text_color=E0E0E0&langs_count=6`;

    return (
        <div className="space-y-4">
            {/* Stats row */}
            {stats && (
                <div className="flex flex-wrap gap-4">
                    {[
                        { label: "Public Repos", value: stats.public_repos },
                        { label: "Followers", value: stats.followers },
                        { label: "Following", value: stats.following },
                        { label: "Member Since", value: new Date(stats.created_at).getFullYear() },
                    ].map(stat => (
                        <div key={stat.label} className="bg-gray-800/40 border border-gray-700/40 rounded-xl px-5 py-3 text-center min-w-[90px]">
                            <p className="text-xl font-bold text-accent">{stat.value}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Stats cards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Commit stats card */}
                <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-semibold text-primary">GitHub Stats</p>
                        <a href={`https://github.com/${GITHUB_USERNAME}`} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-accent hover:underline">View on GitHub →</a>
                    </div>
                    <div className="relative min-h-[120px] flex items-center justify-center">
                        {!imgLoaded && (
                            <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                        )}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={statsCardUrl}
                            alt="GitHub stats"
                            className={`w-full rounded-lg transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
                            onLoad={() => setImgLoaded(true)}
                            onError={() => setImgError(true)}
                        />
                    </div>
                </div>

                {/* Top languages card */}
                <div className="bg-gray-800/40 border border-gray-700/40 rounded-xl p-4">
                    <p className="text-sm font-semibold text-primary mb-3">Top Languages</p>
                    <div className="relative min-h-[120px] flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={topLangsUrl}
                            alt="Top languages"
                            className="w-full rounded-lg"
                            onError={e => (e.currentTarget.style.display = 'none')}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}