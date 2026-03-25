import { useState } from 'react';

export default function ReviewQuiz({ questions, onComplete }) {
  const [answers, setAnswers]     = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone]           = useState(false);

  if (!questions || questions.length === 0) return null;

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleSelect = (questionId, index) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: index }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
    const correct = questions.filter((q) => answers[q.id] === q.correctIndex).map((q) => q.id);
    const wrong   = questions
      .filter((q) => answers[q.id] !== q.correctIndex)
      .map((q) => ({ id: q.id, question: q.question, options: q.options, correctIndex: q.correctIndex, explanation: q.explanation }));
    onComplete?.({ correct, wrong });
    setDone(true);
  };

  const score  = submitted ? questions.filter((q) => answers[q.id] === q.correctIndex).length : 0;

  return (
    <div className="quiz-wrap">
      <div className="quiz-header">
        <span className="quiz-label">Wrong Answer Review</span>
        <span className="quiz-count">{questions.length} questions</span>
      </div>

      {questions.map((q, qi) => {
        const selected  = answers[q.id];
        const isCorrect = submitted && selected === q.correctIndex;

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
        <div className={`quiz-result${score === questions.length ? ' quiz-result--pass' : ' quiz-result--fail'}`}>
          <div className="quiz-result-score">{score}/{questions.length} correct</div>
          <div className="quiz-result-label">
            {score === questions.length
              ? 'All reviewed — those questions cleared from your review queue.'
              : `${questions.length - score} question${questions.length - score > 1 ? 's' : ''} still need work — they stay in your review queue.`}
          </div>
        </div>
      )}
    </div>
  );
}
