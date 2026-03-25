import { useState } from 'react';
import flow from '../../data/troubleshootingFlow.js';

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 .49-4.5" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const severityConfig = {
  high:   { label: 'High impact',   color: 'var(--crit)',  bg: 'var(--crit-bg)',  border: 'var(--crit-dim)' },
  medium: { label: 'Medium impact', color: 'var(--warn)',  bg: 'var(--warn-bg)',  border: 'var(--warn-dim)' },
  low:    { label: 'Low impact',    color: 'var(--ok)',    bg: 'var(--ok-bg)',    border: 'var(--ok-dim)'   },
};

function Breadcrumbs({ history, onJump }) {
  if (history.length === 0) return null;
  const labels = history.map((id) => {
    const node = flow[id];
    if (!node) return null;
    if (node.type === 'question') return node.question.length > 40 ? node.question.slice(0, 40) + '…' : node.question;
    return node.title;
  });

  return (
    <div className="tf-breadcrumbs">
      {labels.map((label, i) => (
        <span key={i} className="tf-breadcrumb-item">
          <button className="tf-breadcrumb-btn" onClick={() => onJump(i)}>{label}</button>
          {i < labels.length - 1 && <ChevronRight />}
        </span>
      ))}
      <span className="tf-breadcrumb-item">
        <ChevronRight />
        <span className="tf-breadcrumb-current">current</span>
      </span>
    </div>
  );
}

function QuestionNode({ node, onSelect, onBack, onReset, history }) {
  return (
    <div className="tf-question-wrap">
      <div className="tf-question-header">
        <div className="tf-step-label">
          {history.length === 0 ? 'Start' : `Step ${history.length}`}
        </div>
        <p className="tf-question-text">{node.question}</p>
        {node.context && (
          <div className="tf-question-context">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{node.context}</span>
          </div>
        )}
      </div>

      <div className="tf-options">
        {node.options.map((opt, i) => (
          <button key={i} className="tf-option" onClick={() => onSelect(opt.next)}>
            <span className="tf-option-label">{opt.label}</span>
            <ChevronRight />
          </button>
        ))}
      </div>

      <div className="tf-nav">
        {history.length > 0 && (
          <button className="tf-nav-btn" onClick={onBack}>
            <ArrowLeft /> Back
          </button>
        )}
        {history.length > 0 && (
          <button className="tf-nav-btn tf-nav-btn--ghost" onClick={onReset}>
            <RefreshIcon /> Start over
          </button>
        )}
      </div>
    </div>
  );
}

function ResolutionNode({ node, onBack, onReset, onNavigate }) {
  const sev = severityConfig[node.severity] || severityConfig.medium;

  return (
    <div className="tf-resolution-wrap">
      <div className="tf-resolution-header" style={{ borderColor: sev.border, background: sev.bg }}>
        <div className="tf-resolution-severity" style={{ color: sev.color }}>
          <CheckIcon />
          Root cause identified · {sev.label}
        </div>
        <div className="tf-resolution-title" style={{ color: sev.color }}>{node.title}</div>
      </div>

      <div className="tf-resolution-body">
        <div className="tf-resolution-section">
          <div className="tf-resolution-section-label">Cause</div>
          <p className="tf-resolution-text">{node.cause}</p>
        </div>

        <div className="tf-resolution-section">
          <div className="tf-resolution-section-label">Fix</div>
          <div className="tf-resolution-fix">
            {node.fix.split('\n').map((line, i) => (
              <p key={i} className="tf-resolution-text">{line}</p>
            ))}
          </div>
        </div>

        {node.reference && (
          <button
            className="tf-reference-link"
            onClick={() => onNavigate(node.reference)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            Review: {node.referenceLabel}
          </button>
        )}
      </div>

      <div className="tf-nav">
        <button className="tf-nav-btn" onClick={onBack}>
          <ArrowLeft /> Back
        </button>
        <button className="tf-nav-btn tf-nav-btn--ghost" onClick={onReset}>
          <RefreshIcon /> Diagnose another problem
        </button>
      </div>
    </div>
  );
}

export default function TroubleshootingFlow({ onNavigate }) {
  const [currentId, setCurrentId] = useState('root');
  const [history, setHistory] = useState([]);

  const navigate = (nextId) => {
    setHistory((h) => [...h, currentId]);
    setCurrentId(nextId);
  };

  const goBack = () => {
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setCurrentId(prev);
  };

  const jumpTo = (historyIndex) => {
    setCurrentId(history[historyIndex]);
    setHistory((h) => h.slice(0, historyIndex));
  };

  const reset = () => {
    setCurrentId('root');
    setHistory([]);
  };

  const current = flow[currentId];
  if (!current) return null;

  return (
    <div className="tf-wrap">
      <Breadcrumbs history={history} onJump={jumpTo} />
      {current.type === 'question' ? (
        <QuestionNode
          node={current}
          onSelect={navigate}
          onBack={goBack}
          onReset={reset}
          history={history}
        />
      ) : (
        <ResolutionNode
          node={current}
          onBack={goBack}
          onReset={reset}
          onNavigate={onNavigate}
        />
      )}
    </div>
  );
}
