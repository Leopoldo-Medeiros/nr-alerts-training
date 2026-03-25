import ReviewQuiz from '../components/interactive/ReviewQuiz.jsx';
import quizzes from '../data/quizzes.js';

const TOTAL_QUIZZABLE = Object.keys(quizzes).length;

const SECTIONS = [
  {
    label: 'Reference',
    modules: [
      { id: 'M01Architecture',  label: 'Architecture & Data Flow', index: '01' },
      { id: 'M02Policies',      label: 'Alert Policies',           index: '02' },
      { id: 'M03Conditions',    label: 'Alert Conditions',         index: '03' },
      { id: 'M04Incidents',     label: 'Incidents',                index: '04' },
      { id: 'M05Issues',        label: 'Issues',                   index: '05' },
      { id: 'M06Workflows',     label: 'Workflows',                index: '06' },
      { id: 'M07Destinations',  label: 'Destinations',             index: '07' },
      { id: 'M08MutingRules',   label: 'Muting Rules',             index: '08' },
      { id: 'M09CommonMistakes',label: 'Common Mistakes',          index: '09' },
    ],
  },
  {
    label: 'Advanced',
    modules: [
      { id: 'M12StreamingAlerts', label: 'Streaming Alerts',       index: '12' },
      { id: 'M13Decisions',       label: 'Decisions & Correlation',index: '13' },
      { id: 'M14AlertQuality',    label: 'Alert Quality Mgmt',     index: '14' },
    ],
  },
  {
    label: 'Practice',
    modules: [
      { id: 'M10Troubleshooting', label: 'Troubleshooter',         index: '10' },
      { id: 'M11Scenarios',       label: 'Scenario Challenges',    index: '11', interactive: true },
    ],
  },
];

function MasteryRing({ pct }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const fill = circ * (pct / 100);

  return (
    <svg className="mastery-ring" width="96" height="96" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} className="mastery-ring-track" />
      <circle
        cx="48" cy="48" r={r}
        className="mastery-ring-fill"
        strokeDasharray={`${fill} ${circ}`}
        strokeDashoffset={circ * 0.25}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="48" y="44" className="mastery-ring-pct">{pct}%</text>
      <text x="48" y="60" className="mastery-ring-sub">mastery</text>
    </svg>
  );
}

function statusLabel(score) {
  if (!score) return { text: 'Not taken', cls: 'skill-status--none' };
  if (score.passed) return { text: `${score.score}/${score.total} ✓`, cls: 'skill-status--pass' };
  return { text: `${score.score}/${score.total} ✗`, cls: 'skill-status--fail' };
}

export default function M00Skills({ scores, wrongAnswers, onNavigate, onReviewComplete }) {
  const passedCount  = Object.values(scores || {}).filter((s) => s.passed).length;
  const masteryPct   = Math.round((passedCount / TOTAL_QUIZZABLE) * 100);
  const reviewQueue  = Object.values(wrongAnswers || {});
  const failedModules = SECTIONS.flatMap((s) => s.modules).filter(
    (m) => scores?.[m.id] && !scores[m.id].passed
  );

  let readiness;
  if (masteryPct === 100) readiness = { label: 'Expert', color: 'var(--teal)', msg: 'All modules mastered. You are ready for anything.' };
  else if (masteryPct >= 75) readiness = { label: 'Proficient', color: 'var(--ok)', msg: 'Strong foundation. Review the remaining modules to complete your expertise.' };
  else if (masteryPct >= 40) readiness = { label: 'Developing', color: 'var(--warn)', msg: 'Good progress. Keep working through the modules and quizzes.' };
  else readiness = { label: 'Beginner', color: 'var(--text-muted)', msg: 'Start with the Reference modules and work your way through.' };

  return (
    <article className="module-section fade-in">
      <p className="eyebrow">Skills Dashboard</p>
      <h1 className="section-title">My Progress</h1>
      <p className="section-lead">
        Track your mastery across all modules. A module is considered mastered when you score
        80% or higher on its knowledge check. Wrong answers are collected for focused review below.
      </p>

      {/* ── Hero ── */}
      <div className="skills-hero">
        <MasteryRing pct={masteryPct} />
        <div className="skills-hero-text">
          <div className="skills-hero-readiness" style={{ color: readiness.color }}>
            {readiness.label}
          </div>
          <div className="skills-hero-stats">
            <span className="skills-hero-stat">
              <span className="skills-hero-num">{passedCount}</span>
              <span className="skills-hero-denom">/{TOTAL_QUIZZABLE}</span>
              <span className="skills-hero-unit">modules mastered</span>
            </span>
            {failedModules.length > 0 && (
              <span className="skills-hero-stat skills-hero-stat--fail">
                <span className="skills-hero-num" style={{ color: 'var(--crit)' }}>{failedModules.length}</span>
                <span className="skills-hero-unit"> need a retake</span>
              </span>
            )}
            {reviewQueue.length > 0 && (
              <span className="skills-hero-stat skills-hero-stat--review">
                <span className="skills-hero-num" style={{ color: 'var(--warn)' }}>{reviewQueue.length}</span>
                <span className="skills-hero-unit"> in review queue</span>
              </span>
            )}
          </div>
          <p className="skills-hero-msg">{readiness.msg}</p>
        </div>
      </div>

      {/* ── Module grid by section ── */}
      {SECTIONS.map((section) => (
        <div key={section.label} className="skills-section">
          <div className="skills-section-label">{section.label}</div>
          <div className="skills-grid">
            {section.modules.map((mod) => {
              const score  = scores?.[mod.id];
              const status = mod.interactive
                ? { text: 'Interactive', cls: 'skill-status--interactive' }
                : statusLabel(score);

              return (
                <div
                  key={mod.id}
                  className={`skill-card${score?.passed ? ' skill-card--passed' : ''}${score && !score.passed ? ' skill-card--failed' : ''}`}
                  onClick={() => onNavigate(mod.id)}
                  title={`Go to ${mod.label}`}
                >
                  <div className="skill-card-top">
                    <span className="skill-card-index">{mod.index}</span>
                    <span className={`skill-status ${status.cls}`}>{status.text}</span>
                  </div>
                  <div className="skill-card-label">{mod.label}</div>
                  {score && !mod.interactive && (
                    <div className="skill-card-bar">
                      <div
                        className={`skill-card-bar-fill${score.passed ? ' skill-card-bar-fill--pass' : ' skill-card-bar-fill--fail'}`}
                        style={{ width: `${Math.round((score.score / score.total) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* ── Wrong answer review ── */}
      {reviewQueue.length > 0 ? (
        <div className="skills-review">
          <div className="skills-review-header">
            <div>
              <div className="skills-review-title">Review Queue</div>
              <div className="skills-review-sub">
                {reviewQueue.length} question{reviewQueue.length > 1 ? 's' : ''} you got wrong — answer them correctly to clear them.
              </div>
            </div>
          </div>
          <ReviewQuiz questions={reviewQueue} onComplete={onReviewComplete} />
        </div>
      ) : (
        passedCount > 0 && (
          <div className="skills-review skills-review--empty">
            <span className="skills-review-empty-icon">✓</span>
            <span>No questions in your review queue — all answered correctly.</span>
          </div>
        )
      )}
    </article>
  );
}
