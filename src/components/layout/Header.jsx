import quizzes from '../../data/quizzes.js';

const TOTAL_QUIZZABLE = Object.keys(quizzes).length;

export default function Header({ visited, total, scores }) {
  const passedCount = Object.values(scores || {}).filter((s) => s.passed).length;
  const masteryPct  = Math.round((passedCount / TOTAL_QUIZZABLE) * 100);
  const visitedPct  = Math.round(((visited?.size ?? 0) / total) * 100);

  return (
    <header className="app-header">
      <div className="nr-mark">NR</div>
      <span className="nr-name">New Relic</span>
      <div className="hdr-sep" />
      <span className="hdr-product">Alerts — Technical Reference</span>
      <div className="hdr-right">
        <div className="hdr-metrics">
          <span className="hdr-metric-mastery">
            {passedCount}/{TOTAL_QUIZZABLE} mastered
          </span>
          <span className="hdr-metric-sep">·</span>
          <span className="hdr-metric-visited">
            {visited?.size ?? 0}/{total} visited
          </span>
        </div>
        <div className="hdr-progress-bar" title={`${masteryPct}% mastered`}>
          {/* visited underlay */}
          <div className="hdr-progress-fill hdr-progress-fill--visited" style={{ width: `${visitedPct}%` }} />
          {/* mastery overlay */}
          <div className="hdr-progress-fill hdr-progress-fill--mastery" style={{ width: `${masteryPct}%` }} />
        </div>
        <span className="hdr-tag">TSE Edition · v1.0</span>
      </div>
    </header>
  );
}
