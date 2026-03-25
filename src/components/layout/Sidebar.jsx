import navigation from '../../data/navigation.js';
import quizzes from '../../data/quizzes.js';

export default function Sidebar({ activeModule, onNavigate, visited, scores }) {
  const dashboard      = navigation.find((m) => m.dashboard);
  const referenceModules = navigation.filter((m) => !m.highlight && !m.dashboard);
  const practiceModules  = navigation.filter((m) =>  m.highlight);

  const totalWithQuiz = Object.keys(quizzes).length;
  const passedCount   = Object.values(scores || {}).filter((s) => s.passed).length;

  const renderItem = (item) => {
    const isActive  = activeModule === item.id;
    const isVisited = visited.has(item.id);
    const score     = scores?.[item.id];
    const hasQuiz   = !!quizzes[item.id];

    return (
      <div
        key={item.id}
        className={`nav-item${isActive ? ' active' : ''}`}
        onClick={() => onNavigate(item.id)}
      >
        <span className="nav-num">{item.index}</span>
        <span className="nav-item-label">{item.label}</span>

        {hasQuiz && score && !isActive && (
          <span className={`nav-score${score.passed ? ' nav-score--pass' : ' nav-score--fail'}`}>
            {score.score}/{score.total}
          </span>
        )}

        {isVisited && !isActive && !score && (
          <span className="nav-visited-dot" title="Visited" />
        )}
      </div>
    );
  };

  return (
    <nav className="sidebar">
      {/* Dashboard pinned at top */}
      {dashboard && (
        <>
          <div
            className={`nav-item nav-item--dashboard${activeModule === dashboard.id ? ' active' : ''}`}
            onClick={() => onNavigate(dashboard.id)}
          >
            <span className="nav-num">◈</span>
            <span className="nav-item-label">{dashboard.label}</span>
            {passedCount > 0 && (
              <span className="nav-mastery-badge">{passedCount}/{totalWithQuiz}</span>
            )}
          </div>
          <div className="nav-divider" />
        </>
      )}

      <div className="nav-label">Reference</div>
      {referenceModules.map(renderItem)}

      <div className="nav-divider" />

      <div className="nav-label nav-label--highlight">Practice</div>
      {practiceModules.map(renderItem)}

      <div className="nav-progress">
        <div className="nav-progress-label">
          {visited.size} of {navigation.filter((m) => !m.dashboard).length} visited
          {passedCount > 0 && (
            <span className="nav-progress-quizzes"> · {passedCount}/{totalWithQuiz} mastered</span>
          )}
        </div>
        <div className="nav-progress-bar">
          <div
            className="nav-progress-fill"
            style={{ width: `${(visited.size / navigation.filter((m) => !m.dashboard).length) * 100}%` }}
          />
        </div>
      </div>
    </nav>
  );
}
