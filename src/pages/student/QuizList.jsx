import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';

export default function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { search, category, difficulty, sort };
    api
      .get('/quizzes', { params })
      .then(({ data }) => setQuizzes(data.data))
      .finally(() => setLoading(false));
  }, [search, category, difficulty, sort]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-semibold">Browse Quizzes</h1>
        <p className="text-ink/50 mt-1">Find a quiz by title, category, or difficulty.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <input
          className="input-field max-w-xs"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input-field max-w-[180px]" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <select className="input-field max-w-[180px]" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="">All difficulties</option>
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
        <select className="input-field max-w-[180px]" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Recently added</option>
          <option value="popularity">Most popular</option>
        </select>
      </div>

      {loading ? (
        <p className="text-ink/50 font-mono text-sm">Loading quizzes...</p>
      ) : quizzes.length === 0 ? (
        <p className="text-ink/50 text-sm">No quizzes match your filters.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((q) => (
            <Link to={`/quizzes/${q.id}`} key={q.id} className="card p-5 hover:border-signal/40 transition-colors">
              <p className="label-eyebrow">{q.category_name || 'Uncategorized'}</p>
              <h3 className="font-display font-semibold text-lg mt-1">{q.title}</h3>
              <p className="text-ink/50 text-sm mt-1 line-clamp-2">{q.description}</p>
              <div className="flex items-center gap-3 mt-4 text-xs text-ink/50 font-mono">
                <span>{q.difficulty}</span>
                <span>·</span>
                <span>{q.duration_minutes} min</span>
                <span>·</span>
                <span>{q.question_count} questions</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}