import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api from '../../api/client';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { uid, token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !uid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper px-4">
        <div className="card p-6 max-w-sm text-center">
          <p className="text-sm text-ink/70">
            This reset link is missing required information. Please request a new one.
          </p>
          <Link to="/forgot-password" className="text-signal text-sm font-medium hover:underline mt-3 inline-block">
            Request new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="font-display font-semibold text-2xl tracking-tight">
            Quiz<span className="text-signal">Platform</span>
          </span>
          <p className="text-ink/50 text-sm mt-2">Choose a new password.</p>
        </div>

        <div className="card p-6">
          {success ? (
            <p className="text-sm text-pass">Password reset. Redirecting you to login...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-fail/10 text-fail text-sm rounded-card px-3 py-2">{error}</div>}
              <div>
                <label className="label-eyebrow block mb-1.5">New password</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  className="input-field"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Resetting...' : 'Reset password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}