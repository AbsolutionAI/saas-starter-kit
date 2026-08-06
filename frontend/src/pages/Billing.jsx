import { useEffect, useState } from "react";
import { billingApi } from "../lib/api";

export function Billing() {
  const [plans, setPlans] = useState(null);
  const [current, setCurrent] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  useEffect(() => {
    billingApi.plans().then(setPlans).catch(() => setPlans({}));
    billingApi.current().then(setCurrent).catch(() => setCurrent(null));
  }, []);

  async function checkout(priceId) {
    setError("");
    setLoading(priceId);
    try {
      const { url } = await billingApi.checkout(priceId);
      if (url) window.location.href = url;
      else setError("No checkout URL returned. Check Stripe configuration.");
    } catch (err) {
      setError(err.message || "Checkout failed — set STRIPE_SECRET_KEY and price IDs");
    } finally {
      setLoading("");
    }
  }

  async function openPortal() {
    setError("");
    setLoading("portal");
    try {
      const { url } = await billingApi.portal();
      if (url) window.location.href = url;
    } catch (err) {
      setError(err.message || "Billing portal unavailable");
    } finally {
      setLoading("");
    }
  }

  const planList = plans
    ? Object.entries(plans).map(([id, p]) => ({ id, ...p }))
    : [];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Billing</h2>
      <p className="text-gray-500 mt-1">Manage your subscription</p>

      {error && (
        <div className="mt-4 text-sm text-amber-700 bg-amber-50 dark:bg-amber-950/40 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
        <p className="text-sm text-gray-500">Current plan</p>
        <p className="text-lg font-semibold capitalize text-gray-900 dark:text-white">
          {current?.plan || "free"}{" "}
          <span className="text-sm font-normal text-gray-500">({current?.status || "active"})</span>
        </p>
        <button
          onClick={openPortal}
          disabled={loading === "portal"}
          className="mt-3 text-sm text-primary-600 hover:underline disabled:opacity-50"
        >
          Open Stripe billing portal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {planList.map((plan) => (
          <div
            key={plan.id}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-5"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">{plan.name}</h3>
            <p className="text-xs text-gray-500 mt-1 capitalize">{plan.id}</p>
            {plan.priceId ? (
              <button
                onClick={() => checkout(plan.priceId)}
                disabled={!!loading}
                className="mt-4 w-full py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white text-sm rounded-lg"
              >
                {loading === plan.priceId ? "Redirecting…" : "Upgrade"}
              </button>
            ) : (
              <p className="mt-4 text-sm text-gray-400">Default plan</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
