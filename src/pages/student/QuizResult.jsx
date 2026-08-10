import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';

function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export default function QuizResult() {
  const { attemptId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/attempts/${attemptId}`)
      .then(({ data }) => setResult(data.data))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <p className="text-ink/50 font-mono text-sm">Loading result...</p>;
  if (!result) return <p className="text-fail text-sm">Result not found.</p>;

  const passed = result.status === 'PASSED';

  return (
    <div className="max-w-3xl space-y-6">
      <div className="card p-8 text-center">
        <p className="label-eyebrow">{result.quiz_title}</p>
        <p className={`text-5xl font-display font-semibold mt-3 ${passed ? 'text-pass' : 'text-fail'}`}>
          {result.percentage}%
        </p>
        <p className={`inline-block mt-3 px-3 py-1 rounded-card text-sm font-medium ${passed ? 'bg-pass/10 text-pass' : 'bg-fail/10 text-fail'}`}>
          {passed ? 'PASSED' : 'FAILED'}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 text-left">
          <div>
            <p className="label-eyebrow">Correct</p>
            <p className="font-medium text-lg mt-1 text-pass">{result.correct_answers}</p>
          </div>
          <div>
            <p className="label-eyebrow">Incorrect</p>
            <p className="font-medium text-lg mt-1 text-fail">{result.incorrect_answers}</p>
          </div>
          <div>
            <p className="label-eyebrow">Unanswered</p>
            <p className="font-medium text-lg mt-1">{result.unanswered}</p>
          </div>
          <div>
            <p className="label-eyebrow">Time taken</p>
            <p className="font-medium text-lg mt-1">{formatDuration(result.time_taken_seconds)}</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <p className="label-eyebrow mb-4">Answer review</p>
        <div className="space-y-6">
          {result.review.map((q, idx) => (
            <div key={q.question_id} className="pb-6 border-b border-ink/8 last:border-0 last:pb-0">
              <p
                className={`font-medium whitespace-pre-wrap ${
                  q.question_text.includes('\n') ? 'font-mono text-sm bg-ink/5 rounded-card p-3' : ''
                }`}
              >
                {idx + 1}. {q.question_text}
                {q.question_type === 'MULTIPLE' && (
                  <span className="ml-2 text-xs font-medium text-signal-dark bg-signal-light px-2 py-0.5 rounded-card align-middle">
                    Select all that apply
                  </span>
                )}
              </p>
              <div className="mt-3 space-y-2">
                {q.options.map((opt) => {
                  const isSelected = q.selected_option_ids.includes(opt.id);
                  const isCorrectOpt = q.correct_option_ids.includes(opt.id);
                  let style = 'border-ink/12';
                  if (isCorrectOpt) style = 'border-pass bg-pass/5';
                  else if (isSelected && !isCorrectOpt) style = 'border-fail bg-fail/5';

                  return (
                    <div key={opt.id} className={`px-3 py-2 rounded-card border text-sm ${style}`}>
                      {opt.option_text}
                      {isCorrectOpt && <span className="text-pass text-xs font-medium ml-2">(Correct answer)</span>}
                      {isSelected && !isCorrectOpt && <span className="text-fail text-xs font-medium ml-2">(Your answer)</span>}
                      {isSelected && isCorrectOpt && <span className="text-pass text-xs font-medium ml-2">(Your answer)</span>}
                    </div>
                  );
                })}
              </div>
              {q.explanation && (
                <p className="text-sm text-ink/60 mt-3 bg-ink/5 rounded-card px-3 py-2">
                  <strong>Explanation:</strong> {q.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Link to="/history" className="btn-secondary">View all attempts</Link>
        <Link to="/quizzes" className="btn-primary">Browse more quizzes</Link>
      </div>
    </div>
  );
}