import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext.jsx';

function StatCard({ label, value, accent }) {
  return (
    <div className="card p-5">
      <p className="label-eyebrow">{label}</p>
      <p className={`text-3xl font-display font-semibold mt-2 ${accent || 'text-ink'}`}>{value}</p>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/student/dashboard')
      .then(({ data }) => setData(data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-ink/50 font-mono text-sm">Loading dashboard...</p>;

  const stats = data?.stats || {};

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-ink/50 mt-1">Here's how your quiz activity is looking.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Attempted" value={stats.total_attempted || 0} />
        <StatCard label="Passed" value={stats.total_passed || 0} accent="text-pass" />
        <StatCard label="Failed" value={stats.total_failed || 0} accent="text-fail" />
        <StatCard label="Avg. Score" value={`${stats.average_score || 0}%`} />
        <StatCard label="Highest Score" value={`${stats.highest_score || 0}%`} />
      </div>

      {data?.score_trend?.length > 1 && (
        <div className="card p-6">
          <p className="label-eyebrow mb-4">Score trend (last 30 days)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.score_trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#12131A10" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="avg_score" stroke="#2F5DFF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="label-eyebrow">Recent attempts</p>
          <Link to="/history" className="text-signal text-sm font-medium hover:underline">View all</Link>
        </div>
        {data?.recent_attempts?.length ? (
          <div className="divide-y divide-ink/8">
            {data.recent_attempts.map((a) => (
              <div key={a.id} className="flex items-center justify-between py-3">
                <span className="font-medium">{a.quiz_title}</span>
                <div className="flex items-center gap-3">
                  <span className={a.status === 'PASSED' ? 'text-pass' : 'text-fail'}>{a.percentage}%</span>
                  <Link to={`/results/${a.id}`} className="text-sm text-signal hover:underline">Review</Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink/50 text-sm">
            No quizzes attempted yet. <Link to="/quizzes" className="text-signal hover:underline">Browse quizzes</Link> to get started.
          </p>
        )}
      </div>
    </div>
  );
}