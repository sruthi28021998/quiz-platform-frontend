import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';

const emptyForm = {
  title: '',
  description: '',
  category_id: '',
  difficulty: 'BEGINNER',
  duration_minutes: 20,
  passing_score: 60,
  max_attempts: 1,
  questions_per_attempt: 10,
  thumbnail_url: '',
};

export default function AdminQuizForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data));
    if (isEdit) {
      api.get(`/quizzes/${id}`).then(({ data }) => {
        const q = data.data;
        setForm({
          title: q.title,
          description: q.description || '',
          category_id: q.category_id || '',
          difficulty: q.difficulty,
          duration_minutes: q.duration_minutes,
          passing_score: q.passing_score,
          max_attempts: q.max_attempts,
          questions_per_attempt: q.questions_per_attempt || 10,
          thumbnail_url: q.thumbnail_url || '',
        });
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/quizzes/${id}`, form);
        navigate('/admin/quizzes');
      } else {
        const { data } = await api.post('/quizzes', form);
        navigate(`/admin/quizzes/${data.data.id}/questions`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save quiz.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Link to="/admin/quizzes" className="text-sm text-signal hover:underline">← Back to quizzes</Link>
      <h1 className="text-2xl font-display font-semibold">{isEdit ? 'Edit Quiz' : 'Create Quiz'}</h1>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && <div className="bg-fail/10 text-fail text-sm rounded-card px-3 py-2">{error}</div>}

        <div>
          <label className="label-eyebrow block mb-1.5">Title</label>
          <input
            required
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="label-eyebrow block mb-1.5">Description</label>
          <textarea
            className="input-field"
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-eyebrow block mb-1.5">Category</label>
            <select
              className="input-field"
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Difficulty</label>
            <select
              className="input-field"
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label-eyebrow block mb-1.5">Duration (min)</label>
            <input
              type="number"
              min={1}
              required
              className="input-field"
              value={form.duration_minutes}
              onChange={(e) => setForm({ ...form, duration_minutes: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Passing score (%)</label>
            <input
              type="number"
              min={0}
              max={100}
              className="input-field"
              value={form.passing_score}
              onChange={(e) => setForm({ ...form, passing_score: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Max attempts</label>
            <input
              type="number"
              min={1}
              className="input-field"
              value={form.max_attempts}
              onChange={(e) => setForm({ ...form, max_attempts: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="label-eyebrow block mb-1.5">Questions shown per attempt</label>
          <input
            type="number"
            min={1}
            className="input-field max-w-[160px]"
            value={form.questions_per_attempt}
            onChange={(e) => setForm({ ...form, questions_per_attempt: Number(e.target.value) })}
          />
          <p className="text-xs text-ink/40 mt-1">
            Randomly picked from the full question bank each time - so repeat attempts see different questions.
          </p>
        </div>

        <div>
          <label className="label-eyebrow block mb-1.5">Thumbnail URL (optional)</label>
          <input
            className="input-field"
            value={form.thumbnail_url}
            onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Create & add questions'}
        </button>
      </form>
    </div>
  );
}