import { Navigate, Route, Routes } from 'react-router-dom';
import { getToken } from './lib/api';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ApiKeys from './pages/ApiKeys';
import Billing from './pages/Billing';
import Layout from './components/Layout';

function Private({ children }: { children: React.ReactNode }) {
  if (!getToken()) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <Private>
            <Layout />
          </Private>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="keys" element={<ApiKeys />} />
        <Route path="billing" element={<Billing />} />
      </Route>
    </Routes>
  );
}
