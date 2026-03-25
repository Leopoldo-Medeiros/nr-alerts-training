import { useState } from 'react';
import quizzes from '../../data/quizzes.js';

const PASS_THRESHOLD = 0.8; // 80% to pass

export default function ModuleQuiz({ moduleId, onComplete }) {
  const questions = quizzes[moduleId];
  const [answers, setAnswers]   = useState({});   // { questionId: selectedIndex }
  const [submitted, setSubmitted] = useState(false);

  if (!questions || questions.length === 0) return null;

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSelect = (questionId, index) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    const score  = questions.filter((q) => answers[q.id] === q.correctIndex).length;
    const passed = score / questions.length >= PASS_THRESHOLD;
    onComplete?.({ moduleId, score, total: questions.length, passed });
  };

  const handleRetry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  const score  = submitted ? questions.filter((q) => answers[q.id] === q.correctIndex).length : 0;
  const passed = submitted && score / questions.length >= PASS_THRESHOLD;

  return (
    <div className="quiz-wrap">
      <div className="quiz-header">
        <span className="quiz-label">Knowledge Check</span>
        <span className="quiz-count">{questions.length} questions</span>
      </div>

      {questions.map((q, qi) => {
        const selected  = answers[q.id];
        const isCorrect = submitted && selected === q.correctIndex;
        const isWrong   = submitted && selected !== undefined && selected !== q.correctIndex;

        return (
          <div key={q.id} className={`quiz-question${submitted ? ' quiz-question--done' : ''}`}>
            <p className="quiz-q-text">
              <span className="quiz-q-num">{qi + 1}.</span> {q.question}
            </p>
            <div className="quiz-options">
              {q.options.map((opt, oi) => {
                let cls = 'quiz-option';
                if (selected === oi) cls += ' quiz-option--selected';
                if (submitted && oi === q.correctIndex) cls += ' quiz-option--correct';
                if (submitted && selected === oi && oi !== q.correctIndex) cls += ' quiz-option--wrong';
                return (
                  <button key={oi} className={cls} onClick={() => handleSelect(q.id, oi)}>
                    <span className="quiz-opt-letter">{String.fromCharCode(65 + oi)}</span>
                    <span className="quiz-opt-text">{opt}</span>
                  </button>
                );
              })}
            </div>
            {submitted && (
              <div className={`quiz-explanation${isCorrect ? ' quiz-explanation--correct' : ' quiz-explanation--wrong'}`}>
                <span className="quiz-explanation-icon">{isCorrect ? '✓' : '✗'}</span>
                {q.explanation}
              </div>
            )}
          </div>
        );
      })}

      {!submitted ? (
        <button
          className={`quiz-submit${allAnswered ? ' quiz-submit--ready' : ''}`}
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          {allAnswered ? 'Check answers' : `Answer all ${questions.length} questions to continue`}
        </button>
      ) : (
        <div className={`quiz-result${passed ? ' quiz-result--pass' : ' quiz-result--fail'}`}>
          <div className="quiz-result-score">
            {score}/{questions.length} correct
          </div>
          <div className="quiz-result-label">
            {passed
              ? 'Module passed — well done.'
              : `${Math.round((score / questions.length) * 100)}% — need 80% to pass.`}
          </div>
          {!passed && (
            <button className="quiz-retry" onClick={handleRetry}>Retry quiz</button>
          )}
        </div>
      )}
    </div>
  );
}
