import { useEffect, useState } from 'react';
import api from '../../api/client';

function StatCard({ label, value }) {
  return (
    <div className="card p-5">
      <p className="label-eyebrow">{label}</p>
      <p className="text-3xl font-display font-semibold mt-2">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => setStats(data.data));
  }, []);

  if (!stats) return <p className="text-ink/50 font-mono text-sm">Loading...</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold">Admin Dashboard</h1>
        <p className="text-ink/50 mt-1">Platform-wide statistics at a glance.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats.total_students} />
        <StatCard label="Total Quizzes" value={stats.total_quizzes} />
        <StatCard label="Published Quizzes" value={stats.published_quizzes} />
        <StatCard label="Draft Quizzes" value={stats.draft_quizzes} />
        <StatCard label="Total Questions" value={stats.total_questions} />
        <StatCard label="Total Attempts" value={stats.total_attempts} />
        <StatCard label="Average Score" value={`${stats.average_score || 0}%`} />
        <StatCard label="Passed / Failed" value={`${stats.total_passed} / ${stats.total_failed}`} />
      </div>
    </div>
  );
}