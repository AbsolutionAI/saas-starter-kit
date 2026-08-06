import { useEffect, useState } from "react";
import { keysApi } from "../lib/api";

export function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      setKeys(await keysApi.list());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function createKey(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const key = await keysApi.create(name || "Untitled");
      setCreated(key);
      setName("");
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function removeKey(id) {
    setError("");
    try {
      await keysApi.remove(id);
      await refresh();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">API Keys</h2>
      <p className="text-gray-500 mt-1">Create and revoke keys for your API</p>

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      {created && (
        <div className="mt-4 text-sm bg-green-50 dark:bg-green-950/40 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg break-all">
          New key created (copy now): <code>{created.key}</code>
        </div>
      )}

      <form onSubmit={createKey} className="mt-6 flex gap-2">
        <input
          type="text"
          placeholder="Key name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium"
        >
          {loading ? "Creating…" : "Create key"}
        </button>
      </form>

      <div className="mt-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-left text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Key</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {keys.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  No API keys yet
                </td>
              </tr>
            )}
            {keys.map((k) => (
              <tr key={k.id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3 text-gray-900 dark:text-white">{k.name}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  {k.key?.slice(0, 12)}…
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {k.createdAt ? new Date(k.createdAt).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeKey(k.id)}
                    className="text-red-600 hover:underline text-xs"
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
