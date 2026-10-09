import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('student@campus.local');
  const [password, setPassword] = useState('student123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex items-center justify-center py-16">
      <div className="card-surface w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-2 text-sm text-slate-600">Sign in to manage your campus events.</p>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500" type="email" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-indigo-500" type="password" required />
          </div>
          <button className="primary-button w-full" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Login'}</button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Need an account? <Link to="/register" className="font-semibold text-indigo-600">Create one</Link>
        </div>
        <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
          Demo accounts: admin@campus.local / admin123, organizer@campus.local / organizer123, student@campus.local / student123
        </div>
      </div>
    </div>
  );
}
