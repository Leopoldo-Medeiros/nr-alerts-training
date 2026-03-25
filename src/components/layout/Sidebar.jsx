import navigation from '../../data/navigation.js';

export default function Sidebar({ activeModule, onNavigate, visited }) {
  const referenceModules = navigation.filter((m) => !m.highlight);
  const practiceModules  = navigation.filter((m) =>  m.highlight);

  const renderItem = (item) => {
    const isActive  = activeModule === item.id;
    const isVisited = visited.has(item.id);

    return (
      <div
        key={item.id}
        className={`nav-item${isActive ? ' active' : ''}`}
        onClick={() => onNavigate(item.id)}
      >
        <span className="nav-num">{item.index}</span>
        <span className="nav-item-label">{item.label}</span>
        {isVisited && !isActive && (
          <span className="nav-visited-dot" title="Visited" />
        )}
      </div>
    );
  };

  return (
    <nav className="sidebar">
      <div className="nav-label">Reference</div>
      {referenceModules.map(renderItem)}

      <div className="nav-divider" />

      <div className="nav-label nav-label--highlight">Practice</div>
      {practiceModules.map(renderItem)}

      <div className="nav-progress">
        <div className="nav-progress-label">
          {visited.size} of {navigation.length} modules visited
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
