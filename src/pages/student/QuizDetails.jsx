import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';

export default function QuizDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/quizzes/${id}`)
      .then(({ data }) => setQuiz(data.data))
      .catch(() => setError('This quiz could not be loaded.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStart = async () => {
    setStarting(true);
    setError('');
    try {
      const { data } = await api.post(`/quizzes/${id}/start`);
      navigate(`/attempt/${data.data.attempt_id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to start this quiz.');
      setStarting(false);
    }
  };

  if (loading) return <p className="text-ink/50 font-mono text-sm">Loading...</p>;
  if (!quiz) return <p className="text-fail text-sm">{error || 'Quiz not found.'}</p>;

  const attemptsLeft = quiz.max_attempts - quiz.attempts_used;
  const canAttempt = attemptsLeft > 0;

  return (
    <div className="max-w-2xl">
      <Link to="/quizzes" className="text-sm text-signal hover:underline">← Back to quizzes</Link>

      <div className="card p-8 mt-4">
        <p className="label-eyebrow">{quiz.category_name || 'Uncategorized'}</p>
        <h1 className="text-2xl font-display font-semibold mt-1">{quiz.title}</h1>
        <p className="text-ink/60 mt-3">{quiz.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
          <div>
            <p className="label-eyebrow">Difficulty</p>
            <p className="font-medium mt-1">{quiz.difficulty}</p>
          </div>
          <div>
            <p className="label-eyebrow">Questions</p>
            <p className="font-medium mt-1">
              {quiz.questions_per_attempt || quiz.question_count} of {quiz.question_count} pool
            </p>
          </div>
          <div>
            <p className="label-eyebrow">Duration</p>
            <p className="font-medium mt-1">{quiz.duration_minutes} minutes</p>
          </div>
          <div>
            <p className="label-eyebrow">Passing score</p>
            <p className="font-medium mt-1">{quiz.passing_score}%</p>
          </div>
          <div>
            <p className="label-eyebrow">Attempts</p>
            <p className="font-medium mt-1">{attemptsLeft} of {quiz.max_attempts} left</p>
          </div>
        </div>
         <div className="flex items-start gap-2 bg-warn/10 text-warn text-sm rounded-card px-4 py-3 mt-6">
          <span className="shrink-0">⚠</span>
          <p>
            <strong>This quiz uses negative marking.</strong> Incorrect answers deduct marks from your score.
            Unanswered questions are not penalized, so an educated guess only makes sense if you can rule out at
            least one option. Some questions may require selecting more than one correct option.
          </p>
        </div>

        {error && <div className="bg-fail/10 text-fail text-sm rounded-card px-3 py-2 mt-4">{error}</div>}

        <button
          onClick={handleStart}
          disabled={!canAttempt || starting}
          className="btn-primary mt-8 w-full sm:w-auto"
        >
          {starting ? 'Starting...' : canAttempt ? 'Start Quiz' : 'No attempts remaining'}
        </button>
      </div>
    </div>
  );
}