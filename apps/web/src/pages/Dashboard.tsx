import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  useEffect(() => {
    api('/api/dashboard/stats').then(setStats).catch(console.error);
  }, []);

  const data = (stats?.labels || []).map((label: string, i: number) => ({ label, value: stats.usage[i] }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-slate-400 text-sm">Overview of your SaaS metrics</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ['Plan', stats?.plan ?? '—'],
          ['API keys', stats?.apiKeys ?? '—'],
          ['Active keys', stats?.activeApiKeys ?? '—'],
        ].map(([k, v]) => (
          <div key={k as string} className="rounded-xl border border-slate-800 bg-slate-900 p-4">
            <div className="text-slate-400 text-sm">{k}</div>
            <div className="mt-1 text-2xl font-semibold capitalize">{v}</div>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 h-72">
        <div className="mb-2 text-sm text-slate-400">API usage (demo)</div>
        <ResponsiveContainer width="100%" height="90%">
          <AreaChart data={data}>
            <XAxis dataKey="label" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#6366f1" fill="#6366f133" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
