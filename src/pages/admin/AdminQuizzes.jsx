import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function AdminQuizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get('/quizzes', { params: { all: true, limit: 100 } })
      .then(({ data }) => setQuizzes(data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handlePublishToggle = async (quiz) => {
    const nextStatus = quiz.status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED';
    try {
      await api.patch(`/quizzes/${quiz.id}/publish`, { status: nextStatus });
      load();
    } catch (err) {
      alert(err.response?.data?.message || 'Unable to update publish status.');
    }
  };

  const handleDelete = async (quiz) => {
    if (!confirm(`Delete quiz "${quiz.title}"? This removes all its questions and attempts.`)) return;
    await api.delete(`/quizzes/${quiz.id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-semibold">Quizzes</h1>
          <p className="text-ink/50 mt-1">Create and manage quizzes.</p>
        </div>
        <Link to="/admin/quizzes/new" className="btn-primary">+ New Quiz</Link>
      </div>

      {loading ? (
        <p className="text-ink/50 font-mono text-sm">Loading...</p>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-ink/5 text-left">
              <tr>
                <th className="px-5 py-3 font-medium text-ink/60">Title</th>
                <th className="px-5 py-3 font-medium text-ink/60">Category</th>
                <th className="px-5 py-3 font-medium text-ink/60">Questions</th>
                <th className="px-5 py-3 font-medium text-ink/60">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/8">
              {quizzes.map((q) => (
                <tr key={q.id}>
                  <td className="px-5 py-3 font-medium">{q.title}</td>
                  <td className="px-5 py-3 text-ink/60">{q.category_name || '—'}</td>
                  <td className="px-5 py-3">{q.question_count}</td>
                  <td className="px-5 py-3">
                    <span
                      className={
                        q.status === 'PUBLISHED' ? 'text-pass' : q.status === 'DRAFT' ? 'text-warn' : 'text-ink/50'
                      }
                    >
                      {q.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                    <Link to={`/admin/quizzes/${q.id}/questions`} className="text-signal hover:underline">Questions</Link>
                    <Link to={`/admin/quizzes/${q.id}/edit`} className="text-signal hover:underline">Edit</Link>
                    <button onClick={() => handlePublishToggle(q)} className="text-signal hover:underline">
                      {q.status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                    </button>
                    <button onClick={() => handleDelete(q)} className="text-fail hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {quizzes.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-8 text-center text-ink/50">No quizzes yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}