import { useEffect, useState } from 'react';
import { api } from '../lib/api';

type Key = { id: string; name: string; prefix: string; createdAt: string; revokedAt?: string | null };

export default function ApiKeys() {
  const [keys, setKeys] = useState<Key[]>([]);
  const [created, setCreated] = useState<string | null>(null);
  const [name, setName] = useState('production');

  async function load() {
    const data = await api<{ keys: Key[] }>('/api/keys');
    setKeys(data.keys);
  }
  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function createKey() {
    const data = await api<{ key: string }>('/api/keys', { method: 'POST', body: JSON.stringify({ name }) });
    setCreated(data.key);
    await load();
  }

  async function revoke(id: string) {
    await api(`/api/keys/${id}`, { method: 'DELETE' });
    await load();
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <p className="text-slate-400 text-sm">Generate and revoke keys for your public API</p>
      </div>
      {created && (
        <div className="rounded-lg border border-amber-700/50 bg-amber-950/40 p-3 text-sm">
          Copy now — shown once: <code className="break-all">{created}</code>
        </div>
      )}
      <div className="flex gap-2">
        <input className="rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={createKey} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500">
          Create key
        </button>
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="w-full text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-3 py-2 text-left">Name</th>
              <th className="px-3 py-2 text-left">Prefix</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id} className="border-t border-slate-800">
                <td className="px-3 py-2">{k.name}</td>
                <td className="px-3 py-2 font-mono">{k.prefix}…</td>
                <td className="px-3 py-2">{k.revokedAt ? 'revoked' : 'active'}</td>
                <td className="px-3 py-2 text-right">
                  {!k.revokedAt && (
                    <button className="text-rose-400 hover:underline" onClick={() => revoke(k.id)}>
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
