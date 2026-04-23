"use client";

import { useEffect, useState } from "react";

interface AnalyticsData {
  overview: {
    users: number;
    sessions: number;
    pageViews: number;
    avgSessionDuration: number;
    bounceRate: number;
  };
  topPages: { path: string; title: string; views: number }[];
  countries: { country: string; users: number }[];
  daily: { date: string; users: number; pageViews: number }[];
  devices: { device: string; users: number }[];
  referrers: { source: string; sessions: number }[];
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5">
      <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-2">{label}</p>
      <p className="text-3xl font-bold text-primary">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

function MiniBar({ value, max, color = "bg-accent" }: { value: number; max: number; color?: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="w-full bg-gray-700/40 rounded-full h-1.5 mt-1">
      <div className={`${color} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function SparkLine({ data, valueKey }: { data: any[]; valueKey: string }) {
  if (!data.length) return null;
  const values = data.map(d => d[valueKey]);
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 300;
  const h = 60;
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-16" preserveAspectRatio="none">
      <polyline
        points={pts}
        fill="none"
        stroke="#FFC107"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fill under the line */}
      <polyline
        points={`0,${h} ${pts} ${w},${h}`}
        fill="rgba(255,193,7,0.08)"
        stroke="none"
      />
    </svg>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/analytics")
      .then(r => r.json())
      .then(d => {
        if (d.message) throw new Error(d.message);
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Loading analytics…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <p className="text-red-400 text-lg font-semibold mb-2">Failed to load analytics</p>
        <p className="text-gray-500 text-sm">{error}</p>
      </div>
    </div>
  );

  if (!data) return null;

  const { overview, topPages, countries, daily, devices, referrers } = data;
  const maxPageViews = Math.max(...topPages.map(p => p.views));
  const maxCountryUsers = Math.max(...countries.map(c => c.users));
  const maxReferrerSessions = Math.max(...referrers.map(r => r.sessions));
  const totalDeviceUsers = devices.reduce((s, d) => s + d.users, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Last 30 days · ugurcanyilmaz.com</p>
        </div>
        <a
          href="https://analytics.google.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border border-gray-600 text-on-background text-sm px-4 py-2 rounded-lg hover:border-accent hover:text-accent transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 6v2H5v11h11v-5h2v6a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1h6zm11-3v8h-2V6.413l-7.293 7.294-1.414-1.414L17.585 5H13V3h8z"/>
          </svg>
          Full GA Report
        </a>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="Users" value={overview.users.toLocaleString()} sub="unique visitors" />
        <StatCard label="Sessions" value={overview.sessions.toLocaleString()} sub="total sessions" />
        <StatCard label="Page Views" value={overview.pageViews.toLocaleString()} sub="total views" />
        <StatCard label="Avg. Duration" value={formatDuration(overview.avgSessionDuration)} sub="per session" />
        <StatCard label="Bounce Rate" value={`${(overview.bounceRate * 100).toFixed(1)}%`} sub="single-page visits" />
      </div>

      {/* Sparkline chart */}
      <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-widest">Daily Visitors — Last 14 Days</h2>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-accent inline-block rounded" /> Users</span>
          </div>
        </div>
        <SparkLine data={daily} valueKey="users" />
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          {daily.filter((_, i) => i % 3 === 0).map(d => (
            <span key={d.date}>{d.date}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

        {/* Top pages */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-5">Top Pages</h2>
          <div className="space-y-4">
            {topPages.map((page, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-background truncate max-w-[200px]" title={page.path}>
                    {page.path === '/' ? 'Home' : page.path}
                  </span>
                  <span className="text-accent font-semibold ml-2">{page.views.toLocaleString()}</span>
                </div>
                <MiniBar value={page.views} max={maxPageViews} />
              </div>
            ))}
          </div>
        </div>

        {/* Countries */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-5">Top Countries</h2>
          <div className="space-y-4">
            {countries.map((c, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-background">{c.country}</span>
                  <span className="text-accent font-semibold">{c.users.toLocaleString()}</span>
                </div>
                <MiniBar value={c.users} max={maxCountryUsers} color="bg-blue-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Referrers */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-5">Traffic Sources</h2>
          <div className="space-y-4">
            {referrers.map((r, i) => (
              <div key={i}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-background capitalize">
                    {r.source === '(direct)' ? 'Direct' : r.source}
                  </span>
                  <span className="text-accent font-semibold">{r.sessions.toLocaleString()}</span>
                </div>
                <MiniBar value={r.sessions} max={maxReferrerSessions} color="bg-green-400" />
              </div>
            ))}
          </div>
        </div>

        {/* Devices */}
        <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-primary uppercase tracking-widest mb-5">Device Breakdown</h2>
          <div className="space-y-5">
            {devices.map((d, i) => {
              const icon = d.device === 'mobile' ? '📱' : d.device === 'tablet' ? '📟' : '🖥️';
              const pct = totalDeviceUsers > 0 ? Math.round((d.users / totalDeviceUsers) * 100) : 0;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-on-background capitalize flex items-center gap-2">
                      <span>{icon}</span>{d.device}
                    </span>
                    <span className="text-accent font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-700/40 rounded-full h-2">
                    <div
                      className="bg-purple-400 h-2 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{d.users.toLocaleString()} users</p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}