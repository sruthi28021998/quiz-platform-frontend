import { useEffect, useState } from 'react';
import api from '../../api/client';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  const load = () => api.get('/categories').then(({ data }) => setCategories(data.data));

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingId) {
        await api.put(`/categories/${editingId}`, form);
      } else {
        await api.post('/categories', form);
      }
      setForm({ name: '', description: '' });
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save category.');
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '' });
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Delete category "${cat.name}"?`)) return;
    await api.delete(`/categories/${cat.id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Categories</h1>
        <p className="text-ink/50 mt-1">Organize quizzes into categories.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-5 flex flex-wrap gap-3 items-end">
        {error && <div className="w-full bg-fail/10 text-fail text-sm rounded-card px-3 py-2">{error}</div>}
        <div className="flex-1 min-w-[160px]">
          <label className="label-eyebrow block mb-1.5">Name</label>
          <input
            required
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Python"
          />
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="label-eyebrow block mb-1.5">Description</label>
          <input
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional"
          />
        </div>
        <button type="submit" className="btn-primary">{editingId ? 'Update' : 'Add category'}</button>
        {editingId && (
          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ name: '', description: '' });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-ink/5 text-left">
            <tr>
              <th className="px-5 py-3 font-medium text-ink/60">Name</th>
              <th className="px-5 py-3 font-medium text-ink/60">Description</th>
              <th className="px-5 py-3 font-medium text-ink/60">Published Quizzes</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-ink/60">{c.description}</td>
                <td className="px-5 py-3">{c.published_quiz_count}</td>
                <td className="px-5 py-3 text-right space-x-3 whitespace-nowrap">
                  <button onClick={() => handleEdit(c)} className="text-signal hover:underline">Edit</button>
                  <button onClick={() => handleDelete(c)} className="text-fail hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}