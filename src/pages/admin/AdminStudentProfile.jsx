import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminStudentProfile() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    api.get(`/users/${id}`).then(({ data }) => setStudent(data.data));
  }, [id]);

  if (!student) return <p className="text-ink/50 font-mono text-sm">Loading...</p>;

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/admin/students" className="text-sm text-signal hover:underline">← Back to students</Link>

      <div className="card p-6">
        <h1 className="text-xl font-display font-semibold">{student.name}</h1>
        <p className="text-ink/50">{student.email}</p>
        <p className="text-xs text-ink/40 mt-1">
          Registered {new Date(student.created_at).toLocaleDateString()} · {student.status}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4">
          <p className="label-eyebrow">Attempted</p>
          <p className="text-2xl font-display font-semibold mt-1">{student.stats.total_attempted || 0}</p>
        </div>
        <div className="card p-4">
          <p className="label-eyebrow">Passed</p>
          <p className="text-2xl font-display font-semibold mt-1 text-pass">{student.stats.total_passed || 0}</p>
        </div>
        <div className="card p-4">
          <p className="label-eyebrow">Failed</p>
          <p className="text-2xl font-display font-semibold mt-1 text-fail">{student.stats.total_failed || 0}</p>
        </div>
        <div className="card p-4">
          <p className="label-eyebrow">Avg. Score</p>
          <p className="text-2xl font-display font-semibold mt-1">{student.stats.average_score || 0}%</p>
        </div>
      </div>

      <div className="card overflow-hidden">
        <p className="label-eyebrow px-5 pt-5 pb-3">Quiz history</p>
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-5 py-3 font-medium text-ink/60">Quiz</th>
              <th className="px-5 py-3 font-medium text-ink/60">Score</th>
              <th className="px-5 py-3 font-medium text-ink/60">Status</th>
              <th className="px-5 py-3 font-medium text-ink/60">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {student.history.map((h) => (
              <tr key={h.id}>
                <td className="px-5 py-3 font-medium">{h.quiz_title}</td>
                <td className="px-5 py-3">{h.percentage}%</td>
                <td className="px-5 py-3">
                  <span className={h.status === 'PASSED' ? 'text-pass' : 'text-fail'}>{h.status}</span>
                </td>
                <td className="px-5 py-3 text-ink/60">{new Date(h.started_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {student.history.length === 0 && (
              <tr><td colSpan={4} className="px-5 py-8 text-center text-ink/50">No attempts yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}