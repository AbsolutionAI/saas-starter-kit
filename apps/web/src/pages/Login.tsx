import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../lib/api';

export default function Login() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [error, setError] = useState('');
  const nav = useNavigate();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const data = await api<{ token: string }>(`/api/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      localStorage.setItem('token', data.token);
      nav('/');
    } catch (err: any) {
      setError(err.message || 'Failed');
    }
  }

  return (
    <div className="min-h-screen grid place-items-center p-4">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-2xl font-semibold mb-1">SaaS Starter Kit</h1>
        <p className="text-slate-400 text-sm mb-6">Sign in to your admin dashboard</p>
        {error && <p className="mb-3 text-sm text-rose-400">{error}</p>}
        <label className="block text-sm mb-1">Email</label>
        <input className="mb-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="block text-sm mb-1">Password</label>
        <input type="password" className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="w-full rounded-lg bg-indigo-600 py-2 font-medium hover:bg-indigo-500">{mode === 'login' ? 'Sign in' : 'Create account'}</button>
        <button type="button" className="mt-3 w-full text-sm text-slate-400 hover:text-white" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Sign in'}
        </button>
      </form>
    </div>
  );
}
