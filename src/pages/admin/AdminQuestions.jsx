import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';

const emptyQuestion = {
  question_text: '',
  marks: 1,
  negative_marks: 0.25,
  explanation: '',
  difficulty: 'BEGINNER',
  question_type: 'SINGLE',
  options: [
    { option_text: '', is_correct: true },
    { option_text: '', is_correct: false },
  ],
};

export default function AdminQuestions() {
  const { id: quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [form, setForm] = useState(emptyQuestion);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => {
    api.get(`/quizzes/${quizId}/questions`).then(({ data }) => setQuestions(data.data));
    api.get(`/quizzes/${quizId}`).then(({ data }) => setQuizTitle(data.data.title));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  const isMultiple = form.question_type === 'MULTIPLE';

  const handleTypeChange = (type) => {
    // Reset correctness when switching type, since SINGLE needs exactly one
    // correct option and MULTIPLE needs at least two.
    const options = form.options.map((o, i) => ({ ...o, is_correct: type === 'SINGLE' ? i === 0 : i < 2 }));
    setForm({ ...form, question_type: type, options });
  };

  const updateOption = (idx, field, value) => {
    const options = [...form.options];
    if (field === 'is_correct') {
      if (isMultiple) {
        options[idx] = { ...options[idx], is_correct: value };
      } else {
        options.forEach((o, i) => (o.is_correct = i === idx));
      }
    } else {
      options[idx] = { ...options[idx], [field]: value };
    }
    setForm({ ...form, options });
  };

  const addOption = () => setForm({ ...form, options: [...form.options, { option_text: '', is_correct: false }] });
  const removeOption = (idx) => {
    if (form.options.length <= 2) return;
    setForm({ ...form, options: form.options.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const correctCount = form.options.filter((o) => o.is_correct).length;
    if (isMultiple && correctCount < 2) {
      setError('A "select multiple" question needs at least 2 correct options checked.');
      return;
    }
    if (!isMultiple && correctCount !== 1) {
      setError('A single-answer question needs exactly 1 correct option selected.');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/questions/${editingId}`, form);
      } else {
        await api.post(`/quizzes/${quizId}/questions`, form);
      }
      setForm(emptyQuestion);
      setEditingId(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save question.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (q) => {
    setEditingId(q.id);
    setForm({
      question_text: q.question_text,
      marks: q.marks,
      negative_marks: q.negative_marks,
      explanation: q.explanation || '',
      difficulty: q.difficulty,
      question_type: q.question_type || 'SINGLE',
      options: q.options.map((o) => ({ option_text: o.option_text, is_correct: o.is_correct })),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyQuestion);
  };

  const handleDelete = async (qId) => {
    if (!confirm('Delete this question?')) return;
    await api.delete(`/questions/${qId}`);
    load();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Link to="/admin/quizzes" className="text-sm text-signal hover:underline">← Back to quizzes</Link>
      <div>
        <h1 className="text-2xl font-display font-semibold">Questions</h1>
        <p className="text-ink/50 mt-1">{quizTitle}</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && <div className="bg-fail/10 text-fail text-sm rounded-card px-3 py-2">{error}</div>}

        <div>
          <label className="label-eyebrow block mb-1.5">Question text</label>
          <textarea
            required
            rows={2}
            className="input-field"
            value={form.question_text}
            onChange={(e) => setForm({ ...form, question_text: e.target.value })}
          />
        </div>

        <div>
          <label className="label-eyebrow block mb-1.5">Answer type</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTypeChange('SINGLE')}
              className={`px-3 py-2 rounded-card text-sm font-medium border transition-colors ${
                !isMultiple ? 'border-signal bg-signal-light text-signal-dark' : 'border-ink/12 text-ink/60'
              }`}
            >
              Single correct answer
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('MULTIPLE')}
              className={`px-3 py-2 rounded-card text-sm font-medium border transition-colors ${
                isMultiple ? 'border-signal bg-signal-light text-signal-dark' : 'border-ink/12 text-ink/60'
              }`}
            >
              Multiple correct answers
            </button>
          </div>
        </div>

        <div>
          <label className="label-eyebrow block mb-2">
            {isMultiple ? 'Options (check all correct answers)' : 'Options (select the correct one)'}
          </label>
          <div className="space-y-2">
            {form.options.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type={isMultiple ? 'checkbox' : 'radio'}
                  name={isMultiple ? undefined : 'correct-option'}
                  checked={opt.is_correct}
                  onChange={(e) => updateOption(idx, 'is_correct', isMultiple ? e.target.checked : true)}
                  className="accent-signal shrink-0"
                />
                <input
                  required
                  className="input-field"
                  placeholder={`Option ${idx + 1}`}
                  value={opt.option_text}
                  onChange={(e) => updateOption(idx, 'option_text', e.target.value)}
                />
                {form.options.length > 2 && (
                  <button type="button" onClick={() => removeOption(idx)} className="text-fail text-sm shrink-0">
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
          <button type="button" onClick={addOption} className="text-signal text-sm font-medium mt-2 hover:underline">
            + Add option
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label-eyebrow block mb-1.5">Marks</label>
            <input
              type="number"
              min={0}
              step="0.5"
              className="input-field"
              value={form.marks}
              onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className="label-eyebrow block mb-1.5">Negative marks</label>
            <input
              type="number"
              min={0}
              step="0.25"
              className="input-field"
              value={form.negative_marks}
              onChange={(e) => setForm({ ...form, negative_marks: Number(e.target.value) })}
            />
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

        <div>
          <label className="label-eyebrow block mb-1.5">Explanation (optional)</label>
          <textarea
            rows={2}
            className="input-field"
            value={form.explanation}
            onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : editingId ? 'Update question' : 'Add question'}
          </button>
          {editingId && (
            <button type="button" onClick={handleCancelEdit} className="btn-secondary">Cancel</button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <p className="label-eyebrow">{questions.length} question{questions.length !== 1 ? 's' : ''} added</p>
        {questions.map((q, idx) => (
          <div key={q.id} className="card p-5">
            <div className="flex items-start justify-between gap-4">
              <p className="font-medium whitespace-pre-wrap">
                {idx + 1}. {q.question_text}
                {q.question_type === 'MULTIPLE' && (
                  <span className="ml-2 text-xs font-medium text-signal-dark bg-signal-light px-2 py-0.5 rounded-card align-middle">
                    Multiple answers
                  </span>
                )}
              </p>
              <div className="flex gap-3 shrink-0 text-sm">
                <button onClick={() => handleEdit(q)} className="text-signal hover:underline">Edit</button>
                <button onClick={() => handleDelete(q.id)} className="text-fail hover:underline">Delete</button>
              </div>
            </div>
            <ul className="mt-2 space-y-1 text-sm">
              {q.options.map((o) => (
                <li key={o.id} className={o.is_correct ? 'text-pass font-medium' : 'text-ink/60'}>
                  {o.is_correct ? '✓ ' : '· '}{o.option_text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}