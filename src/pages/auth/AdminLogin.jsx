import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await adminLogin(form.email, form.password);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-850 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display font-semibold text-2xl tracking-tight text-white">
            Quiz<span className="text-signal">Admin</span>
          </span>
          <p className="text-white/50 text-sm mt-2">Administrator access only.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-card p-6 space-y-4">
          {error && <div className="bg-fail/10 text-fail text-sm rounded-card px-3 py-2">{error}</div>}
          <div>
            <label className="label-eyebrow block mb-1.5">Admin email</label>
            <input
              type="email"
              required
              className="input-field"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@quizplatform.com"
            />
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Password</label>
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
            {loading ? 'Logging in...' : 'Log in as Admin'}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-6">
          <Link to="/login" className="hover:underline">Student login</Link>
        </p>
      </div>
    </div>
  );
}