import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
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
          <p className="text-ink/50 text-sm mt-2">Reset your password.</p>
        </div>

        <div className="card p-6">
          {sent ? (
            <p className="text-sm text-ink/70">
              If an account exists for <strong>{email}</strong>, we've sent a link to reset the password. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-fail/10 text-fail text-sm rounded-card px-3 py-2">{error}</div>}
              <div>
                <label className="label-eyebrow block mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-ink/60 mt-6">
          <Link to="/login" className="text-signal font-medium hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}