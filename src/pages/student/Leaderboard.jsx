import { useEffect, useState } from 'react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Leaderboard() {
  const { user } = useAuth();
  const [scope, setScope] = useState('overall');
  const [rankBy, setRankBy] = useState('average');
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get('/leaderboard', { params: { scope, rank_by: rankBy } })
      .then(({ data }) => setRows(data.data))
      .finally(() => setLoading(false));
  }, [scope, rankBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Leaderboard</h1>
        <p className="text-ink/50 mt-1">See how you stack up against other students.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <select className="input-field max-w-[160px]" value={scope} onChange={(e) => setScope(e.target.value)}>
          <option value="overall">Overall</option>
          <option value="monthly">Monthly</option>
          <option value="weekly">Weekly</option>
        </select>
        <select className="input-field max-w-[200px]" value={rankBy} onChange={(e) => setRankBy(e.target.value)}>
          <option value="average">Rank by average score</option>
          <option value="highest">Rank by highest score</option>
          <option value="count">Rank by quizzes completed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-ink/50 font-mono text-sm">Loading...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-ink/60">Rank</th>
                <th className="px-5 py-3 font-medium text-ink/60">Student</th>
                <th className="px-5 py-3 font-medium text-ink/60">Avg. Score</th>
                <th className="px-5 py-3 font-medium text-ink/60">Highest</th>
                <th className="px-5 py-3 font-medium text-ink/60">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {rows.map((r) => (
                <tr key={r.student_id} className={r.student_id === user?.id ? 'bg-signal-light' : ''}>
                  <td className="px-5 py-3 font-mono">#{r.rank}</td>
                  <td className="px-5 py-3 font-medium">{r.student_name}</td>
                  <td className="px-5 py-3">{r.average_score}%</td>
                  <td className="px-5 py-3">{r.highest_score}%</td>
                  <td className="px-5 py-3">{r.quizzes_completed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}