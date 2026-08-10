import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminAttempts() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/attempts', { params: { limit: 50 } })
      .then(({ data }) => setAttempts(data.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">All Attempts</h1>
        <p className="text-ink/50 mt-1">Every completed quiz attempt across the platform.</p>
      </div>

      {loading ? (
        <p className="text-ink/50 font-mono text-sm">Loading...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-ink/60">Student</th>
                <th className="px-5 py-3 font-medium text-ink/60">Quiz</th>
                <th className="px-5 py-3 font-medium text-ink/60">Score</th>
                <th className="px-5 py-3 font-medium text-ink/60">Status</th>
                <th className="px-5 py-3 font-medium text-ink/60">Date</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-3 font-medium">{a.student_name}</td>
                  <td className="px-5 py-3 text-ink/60">{a.quiz_title}</td>
                  <td className="px-5 py-3">{a.percentage}%</td>
                  <td className="px-5 py-3">
                    <span className={a.status === 'PASSED' ? 'text-pass' : 'text-fail'}>{a.status}</span>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{new Date(a.completed_at).toLocaleDateString()}</td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/admin/attempts/${a.id}`} className="text-signal hover:underline">View</Link>
                  </td>
                </tr>
              ))}
              {attempts.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-ink/50">No attempts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}