import { useState } from 'react';
import { api } from '../lib/api';

export default function Billing() {
  const [err, setErr] = useState('');
  async function checkout(plan: 'pro' | 'enterprise') {
    setErr('');
    try {
      const data = await api<{ url: string }>('/api/billing/checkout', { method: 'POST', body: JSON.stringify({ plan }) });
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e.message);
    }
  }
  async function portal() {
    setErr('');
    try {
      const data = await api<{ url: string }>('/api/billing/portal', { method: 'POST', body: '{}' });
      window.location.href = data.url;
    } catch (e: any) {
      setErr(e.message);
    }
  }
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-semibold">Billing</h1>
        <p className="text-slate-400 text-sm">Stripe Checkout + Customer Portal</p>
      </div>
      {err && <p className="text-rose-400 text-sm">{err}</p>}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="text-lg font-medium">Pro</div>
          <p className="mt-1 text-sm text-slate-400">For indie hackers shipping MVPs</p>
          <button onClick={() => checkout('pro')} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm">
            Upgrade to Pro
          </button>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <div className="text-lg font-medium">Enterprise</div>
          <p className="mt-1 text-sm text-slate-400">Higher limits & priority support</p>
          <button onClick={() => checkout('enterprise')} className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm">
            Upgrade to Enterprise
          </button>
        </div>
      </div>
      <button onClick={portal} className="text-sm text-slate-300 underline">
        Open Stripe billing portal
      </button>
    </div>
  );
}
