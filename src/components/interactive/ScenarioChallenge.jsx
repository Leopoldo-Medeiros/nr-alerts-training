import { useState } from 'react';

const difficultyConfig = {
  'Foundation': { color: 'var(--ok)',   bg: 'var(--ok-bg)',   border: 'var(--ok-dim)'   },
  'Applied':    { color: 'var(--warn)', bg: 'var(--warn-bg)', border: 'var(--warn-dim)' },
};

export default function ScenarioChallenge({ scenario, index, onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  const diff = difficultyConfig[scenario.difficulty] || difficultyConfig['Foundation'];
  const isCorrect = selected === scenario.correctIndex;

  const handleReveal = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="scenario-card">
      <div className="scenario-card-header">
        <div className="scenario-meta">
          <span className="scenario-index">Scenario {index + 1}</span>
          <span
            className="scenario-difficulty"
            style={{ color: diff.color, background: diff.bg, borderColor: diff.border }}
          >
            {scenario.difficulty}
          </span>
        </div>
        <div className="scenario-title">{scenario.title}</div>
      </div>

      <div className="scenario-setup">
        <div className="scenario-setup-label">Setup</div>
        <pre className="scenario-setup-text">{scenario.setup}</pre>
      </div>

      <div className="scenario-question">{scenario.question}</div>

      <div className="scenario-options">
        {scenario.options.map((opt, i) => {
          let cls = 'scenario-option';
          if (selected === i) cls += ' scenario-option--selected';
          if (revealed) {
            if (i === scenario.correctIndex) cls += ' scenario-option--correct';
            else if (selected === i && i !== scenario.correctIndex) cls += ' scenario-option--wrong';
          }

          return (
            <button
              key={i}
              className={cls}
              onClick={() => !revealed && setSelected(i)}
              disabled={revealed}
            >
              <span className="scenario-option-letter">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="scenario-option-text">{opt.label}</span>
              {revealed && i === scenario.correctIndex && (
                <svg className="scenario-option-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {revealed && selected === i && i !== scenario.correctIndex && (
                <svg className="scenario-option-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--crit)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <div className="scenario-actions">
          <button
            className={`scenario-submit${selected !== null ? ' scenario-submit--ready' : ''}`}
            onClick={handleReveal}
            disabled={selected === null}
          >
            Check answer
          </button>
          {selected !== null && (
            <span className="scenario-hint">Click to reveal explanation</span>
          )}
        </div>
      )}

      {revealed && (
        <div className={`scenario-explanation${isCorrect ? ' scenario-explanation--correct' : ' scenario-explanation--wrong'}`}>
          <div className="scenario-explanation-header">
            {isCorrect ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ok)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ color: 'var(--ok)' }}>Correct</span>
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--crit)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span style={{ color: 'var(--crit)' }}>Incorrect — see explanation</span>
              </>
            )}
          </div>
          <pre className="scenario-explanation-text">{scenario.explanation}</pre>
          <div className="scenario-explanation-footer">
            {scenario.relatedModule && (
              <button className="tf-reference-link" onClick={() => onNavigate(scenario.relatedModule)}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Review: {scenario.relatedLabel}
              </button>
            )}
            <button className="scenario-retry" onClick={handleReset}>Try again</button>
          </div>
        </div>
      )}
    </div>
  );
}
