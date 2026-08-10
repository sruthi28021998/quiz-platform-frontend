import { useEffect, useState } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from 'recharts';
import api from '../../api/client';

const COLORS = ['#1E8A5A', '#C4432E'];

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => setData(data.data));
  }, []);

  if (!data) return <p className="text-ink/50 font-mono text-sm">Loading analytics...</p>;

  const passFailData = [
    { name: 'Passed', value: Number(data.pass_fail_ratio.passed) || 0 },
    { name: 'Failed', value: Number(data.pass_fail_ratio.failed) || 0 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-semibold">Analytics</h1>
        <p className="text-ink/50 mt-1">Platform trends over the last 30 days.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <p className="label-eyebrow mb-4">Quiz attempts over time</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.attempts_over_time}>
              <CartesianGrid strokeDasharray="3 3" stroke="#12131A10" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#2F5DFF" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <p className="label-eyebrow mb-4">Student registrations</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.registrations_over_time}>
              <CartesianGrid strokeDasharray="3 3" stroke="#12131A10" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#1E8A5A" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <p className="label-eyebrow mb-4">Most popular quizzes</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.most_popular_quizzes} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#12131A10" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="title" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="attempt_count" fill="#2F5DFF" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <p className="label-eyebrow mb-4">Most popular categories</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.most_popular_categories} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#12131A10" />
              <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
              <Tooltip />
              <Bar dataKey="attempt_count" fill="#C48A1E" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <p className="label-eyebrow mb-4">Pass / fail ratio</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={passFailData} dataKey="value" nameKey="name" outerRadius={80} label>
                {passFailData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-6">
          <p className="label-eyebrow mb-4">Average score by quiz</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.average_scores_by_quiz}>
              <CartesianGrid strokeDasharray="3 3" stroke="#12131A10" />
              <XAxis dataKey="title" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="avg_score" fill="#2F5DFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}