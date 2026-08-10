import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AttemptHistory() {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/attempts').then(({ data }) => setAttempts(data.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">My Attempts</h1>
        <p className="text-ink/50 mt-1">Your full quiz attempt history.</p>
      </div>

      {loading ? (
        <p className="text-ink/50 font-mono text-sm">Loading...</p>
      ) : attempts.length === 0 ? (
        <p className="text-ink/50 text-sm">
          No attempts yet. <Link to="/quizzes" className="text-signal hover:underline">Browse quizzes</Link>.
        </p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-ink/60">Quiz</th>
                <th className="px-5 py-3 font-medium text-ink/60">Date</th>
                <th className="px-5 py-3 font-medium text-ink/60">Score</th>
                <th className="px-5 py-3 font-medium text-ink/60">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {attempts.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-3 font-medium">{a.quiz_title}</td>
                  <td className="px-5 py-3 text-ink/60">
                    {new Date(a.completed_at || a.started_at).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-3">{a.percentage}%</td>
                  <td className="px-5 py-3">
                    <span className={a.status === 'PASSED' ? 'text-pass' : 'text-fail'}>{a.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link to={`/results/${a.id}`} className="text-signal hover:underline">Review</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}