import { useAuth } from "../hooks/useAuth";

export function Settings() {
  const { user } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
      <p className="text-gray-500 mt-1">Account details</p>

      <div className="mt-6 max-w-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 space-y-4">
        <div>
          <p className="text-xs uppercase text-gray-500">Name</p>
          <p className="text-gray-900 dark:text-white mt-1">{user?.name || "—"}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Email</p>
          <p className="text-gray-900 dark:text-white mt-1">{user?.email}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">User ID</p>
          <p className="text-gray-900 dark:text-white mt-1">{user?.id}</p>
        </div>
        <div>
          <p className="text-xs uppercase text-gray-500">Plan</p>
          <p className="text-gray-900 dark:text-white mt-1 capitalize">
            {user?.subscription?.plan || "free"}
          </p>
        </div>
      </div>
    </div>
  );
}
