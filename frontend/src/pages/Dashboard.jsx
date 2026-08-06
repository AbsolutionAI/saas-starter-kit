import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { billingApi, keysApi } from "../lib/api";

export function Dashboard() {
  const { user } = useAuth();
  const [sub, setSub] = useState(null);
  const [keyCount, setKeyCount] = useState(0);

  useEffect(() => {
    billingApi.current().then(setSub).catch(() => setSub(null));
    keysApi.list().then((k) => setKeyCount(k.length)).catch(() => setKeyCount(0));
  }, []);

  const cards = [
    { label: "Plan", value: sub?.plan || user?.subscription?.plan || "free" },
    { label: "Status", value: sub?.status || user?.subscription?.status || "—" },
    { label: "API Keys", value: String(keyCount) },
    { label: "Account", value: user?.email || "—" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
      <p className="text-gray-500 mt-1">Overview of your SaaS account</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {cards.map((c) => (
          <div
            key={c.label}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
          >
            <p className="text-xs uppercase tracking-wide text-gray-500">{c.label}</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white mt-2 capitalize">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 dark:text-white">Next steps</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300 list-disc list-inside">
          <li>Create an API key under API Keys</li>
          <li>Upgrade your plan under Billing (requires Stripe keys)</li>
          <li>Wire your product logic to the JWT-protected API</li>
        </ul>
      </div>
    </div>
  );
}
