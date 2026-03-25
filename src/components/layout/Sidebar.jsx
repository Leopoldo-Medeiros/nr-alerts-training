import navigation from '../../data/navigation.js';
import quizzes from '../../data/quizzes.js';

export default function Sidebar({ activeModule, onNavigate, visited, scores }) {
  const referenceModules = navigation.filter((m) => !m.highlight);
  const practiceModules  = navigation.filter((m) =>  m.highlight);

  const renderItem = (item) => {
    const isActive   = activeModule === item.id;
    const isVisited  = visited.has(item.id);
    const score      = scores?.[item.id];
    const hasQuiz    = !!quizzes[item.id];

    return (
      <div
        key={item.id}
        className={`nav-item${isActive ? ' active' : ''}`}
        onClick={() => onNavigate(item.id)}
      >
        <span className="nav-num">{item.index}</span>
        <span className="nav-item-label">{item.label}</span>

        {/* Quiz score badge */}
        {hasQuiz && score && !isActive && (
          <span className={`nav-score${score.passed ? ' nav-score--pass' : ' nav-score--fail'}`}>
            {score.score}/{score.total}
          </span>
        )}

        {/* Visited dot — only when no quiz score to show */}
        {isVisited && !isActive && !score && (
          <span className="nav-visited-dot" title="Visited" />
        )}
      </div>
    );
  };

  const totalWithQuiz  = Object.keys(quizzes).length;
  const passedCount    = Object.values(scores || {}).filter((s) => s.passed).length;

  return (
    <nav className="sidebar">
      <div className="nav-label">Reference</div>
      {referenceModules.map(renderItem)}

      <div className="nav-divider" />

      <div className="nav-label nav-label--highlight">Practice</div>
      {practiceModules.map(renderItem)}

      <div className="nav-progress">
        <div className="nav-progress-label">
          {visited.size} of {navigation.length} visited
          {passedCount > 0 && (
            <span className="nav-progress-quizzes"> · {passedCount}/{totalWithQuiz} passed</span>
          )}
        </div>
        <div className="nav-progress-bar">
          <div
            className="nav-progress-fill"
            style={{ width: `${(visited.size / navigation.length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
