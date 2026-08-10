import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/users', { params: { search } })
      .then(({ data }) => setStudents(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timeout = setTimeout(load, 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const toggleStatus = async (student) => {
    const newStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await api.patch(`/users/${student.id}/status`, { status: newStatus });
    load();
  };

  const handleDelete = async (student) => {
    if (!confirm(`Delete ${student.name}'s account? This cannot be undone.`)) return;
    await api.delete(`/users/${student.id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Students</h1>
        <p className="text-ink/50 mt-1">Manage registered students.</p>
      </div>

      <input
        className="input-field max-w-xs"
        placeholder="Search by name or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-ink/50 font-mono text-sm">Loading...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-ink/60">Name</th>
                <th className="px-5 py-3 font-medium text-ink/60">Email</th>
                <th className="px-5 py-3 font-medium text-ink/60">Attempted</th>
                <th className="px-5 py-3 font-medium text-ink/60">Avg. Score</th>
                <th className="px-5 py-3 font-medium text-ink/60">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="px-5 py-3 font-medium">
                    <Link to={`/admin/students/${s.id}`} className="hover:text-signal">{s.name}</Link>
                  </td>
                  <td className="px-5 py-3 text-ink/60">{s.email}</td>
                  <td className="px-5 py-3">{s.quizzes_attempted || 0}</td>
                  <td className="px-5 py-3">{s.average_score || 0}%</td>
                  <td className="px-5 py-3">
                    <span className={s.status === 'ACTIVE' ? 'text-pass' : 'text-fail'}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                    <button onClick={() => toggleStatus(s)} className="text-signal hover:underline">
                      {s.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(s)} className="text-fail hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-ink/50">No students found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}