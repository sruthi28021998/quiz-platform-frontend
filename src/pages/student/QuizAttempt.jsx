import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';

function formatTime(seconds) {
  if (seconds < 0) seconds = 0;
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function QuizAttempt() {
  const { attemptId } = useParams();
  const navigate = useNavigate();

  const [state, setState] = useState(null); // { attempt_id, quiz_title, expires_at, server_time, questions }
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // question_id -> array of selected option ids
  const [secondsLeft, setSecondsLeft] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const hasSubmitted = useRef(false);

  // Load attempt state. Since /start is idempotent while in-progress, re-hitting it on refresh resumes cleanly.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const { data } = await api.get(`/attempts/${attemptId}`);
        if (cancelled) return;
        // getAttemptById returns a result-shaped object; if still in progress we need the start payload instead.
        if (data.data.status === 'IN_PROGRESS') {
          // Re-derive the taking-a-quiz payload via quiz start (idempotent for in-progress attempts)
          const startResp = await api.post(`/quizzes/${data.data.quiz_id}/start`);
          const payload = startResp.data.data;
          setState(payload);
          const initialAnswers = {};
          payload.questions.forEach((q) => {
            if (q.selected_option_ids && q.selected_option_ids.length > 0) {
              initialAnswers[q.id] = q.selected_option_ids;
            }
          });
          setAnswers(initialAnswers);
          const drift = (new Date(payload.expires_at) - new Date(payload.server_time)) / 1000;
          setSecondsLeft(Math.max(0, Math.round(drift)));
        } else {
          navigate(`/results/${attemptId}`, { replace: true });
        }
      } catch (err) {
        setError('This attempt could not be loaded. It may have expired or already been submitted.');
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [attemptId, navigate]);

  const handleSubmit = useCallback(async () => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;
    setSubmitting(true);
    try {
      await api.post('/quizzes/submit', { attempt_id: attemptId });
    } catch {
      // Even if this fails (e.g. already auto-expired server-side), still route to results
    } finally {
      navigate(`/results/${attemptId}`, { replace: true });
    }
  }, [attemptId, navigate]);

  // Countdown timer - purely visual; backend independently enforces expiry on submit
  useEffect(() => {
    if (secondsLeft === null) return;
    if (secondsLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timer);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft === null]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (secondsLeft === 0) handleSubmit();
  }, [secondsLeft, handleSubmit]);

  const syncAnswer = async (questionId, selectedIds) => {
    try {
      await api.put(`/attempts/${attemptId}/answer`, {
        question_id: questionId,
        selected_option_ids: selectedIds,
      });
    } catch {
      // Non-fatal - the final submit still scores off whatever made it to the backend.
    }
  };

  // Single-answer questions: picking an option replaces the whole selection.
  const handleSelectSingle = (questionId, optionId) => {
    const next = [optionId];
    setAnswers((prev) => ({ ...prev, [questionId]: next }));
    syncAnswer(questionId, next);
  };

  // Multi-answer questions: toggle one option in/out of the selection.
  const handleToggleMultiple = (questionId, optionId) => {
    const current = answers[questionId] || [];
    const next = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    setAnswers((prev) => ({ ...prev, [questionId]: next }));
    if (next.length > 0) {
      syncAnswer(questionId, next);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card p-6 max-w-sm text-center">
          <p className="text-fail text-sm">{error}</p>
          <button onClick={() => navigate('/quizzes')} className="btn-secondary mt-4">Back to quizzes</button>
        </div>
      </div>
    );
  }

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-ink/50 font-mono text-sm">Loading quiz...</p>
      </div>
    );
  }

  const question = state.questions[currentIndex];
  const isMultiple = question.question_type === 'MULTIPLE';
  const selectedForQuestion = answers[question.id] || [];
  const answeredCount = Object.values(answers).filter((ids) => ids && ids.length > 0).length;
  const isLow = secondsLeft !== null && secondsLeft <= 60;

  return (
    <div className="min-h-screen bg-paper">
      <header className="bg-white border-b border-ink/8 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div>
            <p className="font-display font-semibold">{state.quiz_title}</p>
            <p className="text-xs text-ink/50">Question {currentIndex + 1} of {state.questions.length}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-warn bg-warn/10 px-3 py-1.5 rounded-card">
              ⚠ Negative marking applies
            </span>
            <div className={`font-mono text-lg font-medium px-4 py-1.5 rounded-card ${isLow ? 'bg-fail/10 text-fail' : 'bg-signal-light text-signal-dark'}`}>
              {formatTime(secondsLeft)}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8 grid md:grid-cols-[1fr_220px] gap-8">
        <div>
          <div className="card p-8">
            <div className="flex items-start justify-between gap-3 mb-1">
              {isMultiple && (
                <span className="text-xs font-medium text-signal-dark bg-signal-light px-2.5 py-1 rounded-card shrink-0">
                  Select all that apply
                </span>
              )}
            </div>
            <p
              className={`text-lg font-medium leading-relaxed whitespace-pre-wrap ${
                question.question_text.includes('\n') ? 'font-mono text-base bg-ink/5 rounded-card p-4' : ''
              }`}
            >
              {question.question_text}
            </p>
            <div className="mt-6 space-y-3">
              {question.options.map((opt) => {
                const isChecked = selectedForQuestion.includes(opt.id);
                return (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-card border cursor-pointer transition-colors ${
                      isChecked ? 'border-signal bg-signal-light' : 'border-ink/12 hover:border-ink/30'
                    }`}
                  >
                    <input
                      type={isMultiple ? 'checkbox' : 'radio'}
                      name={isMultiple ? undefined : question.id}
                      checked={isChecked}
                      onChange={() =>
                        isMultiple
                          ? handleToggleMultiple(question.id, opt.id)
                          : handleSelectSingle(question.id, opt.id)
                      }
                      className="accent-signal"
                    />
                    <span>{opt.option_text}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="btn-secondary"
            >
              Previous
            </button>
            {currentIndex < state.questions.length - 1 ? (
              <button onClick={() => setCurrentIndex((i) => i + 1)} className="btn-primary">
                Next
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary">
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>

        <aside className="card p-5 h-fit">
          <p className="label-eyebrow mb-3">Progress: {answeredCount}/{state.questions.length}</p>
          <div className="grid grid-cols-5 gap-2">
            {state.questions.map((q, idx) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-9 rounded-card text-sm font-medium transition-colors ${
                  idx === currentIndex
                    ? 'bg-signal text-white'
                    : (answers[q.id] || []).length > 0
                    ? 'bg-pass/15 text-pass'
                    : 'bg-ink/5 text-ink/50'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <p className="text-xs text-warn bg-warn/10 rounded-card px-3 py-2 mt-4">
            ⚠ Negative marking: wrong answers deduct marks. Unanswered questions score zero.
          </p>
          <button onClick={handleSubmit} disabled={submitting} className="btn-primary w-full mt-4">
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </aside>
      </div>
    </div>
  );
}