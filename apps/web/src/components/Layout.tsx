import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, KeyRound, CreditCard, LogOut } from 'lucide-react';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`;

export default function Layout() {
  const nav = useNavigate();
  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r border-slate-800 bg-slate-900 p-4 flex flex-col gap-2">
        <Link to="/" className="mb-4 text-lg font-semibold tracking-tight">
          SaaS Starter
        </Link>
        <NavLink to="/" end className={linkClass}>
          <LayoutDashboard size={16} /> Dashboard
        </NavLink>
        <NavLink to="/keys" className={linkClass}>
          <KeyRound size={16} /> API Keys
        </NavLink>
        <NavLink to="/billing" className={linkClass}>
          <CreditCard size={16} /> Billing
        </NavLink>
        <button
          className="mt-auto flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-slate-800"
          onClick={() => {
            localStorage.removeItem('token');
            nav('/login');
          }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
