import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display font-semibold text-2xl tracking-tight">
            Quiz<span className="text-signal">Platform</span>
          </span>
          <p className="text-ink/50 text-sm mt-2">Log in to continue your learning.</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-6 space-y-4">
          {error && (
            <div className="bg-fail/10 text-fail text-sm rounded-card px-3 py-2">{error}</div>
          )}
          <div>
            <label className="label-eyebrow block mb-1.5">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="label-eyebrow">Password</label>
              <Link to="/forgot-password" className="text-xs text-signal hover:underline">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              required
              className="input-field"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          New here?{' '}
          <Link to="/register" className="text-signal font-medium hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-ink/40 mt-3">
          <Link to="/admin/login" className="hover:underline">Administrator login</Link>
        </p>
      </div>
    </div>
  );
}