import { useState, useRef } from 'react';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

import M01Architecture   from './modules/M01Architecture.jsx';
import M02Policies       from './modules/M02Policies.jsx';
import M03Conditions     from './modules/M03Conditions.jsx';
import M04Incidents      from './modules/M04Incidents.jsx';
import M05Issues         from './modules/M05Issues.jsx';
import M06Workflows      from './modules/M06Workflows.jsx';
import M07Destinations   from './modules/M07Destinations.jsx';
import M08MutingRules    from './modules/M08MutingRules.jsx';
import M09CommonMistakes from './modules/M09CommonMistakes.jsx';
import M10Troubleshooting from './modules/M10Troubleshooting.jsx';
import M11Scenarios      from './modules/M11Scenarios.jsx';
import M12StreamingAlerts from './modules/M12StreamingAlerts.jsx';
import M13Decisions       from './modules/M13Decisions.jsx';
import M14AlertQuality    from './modules/M14AlertQuality.jsx';

const MODULE_MAP = {
  M01Architecture,
  M02Policies,
  M03Conditions,
  M04Incidents,
  M05Issues,
  M06Workflows,
  M07Destinations,
  M08MutingRules,
  M09CommonMistakes,
  M10Troubleshooting,
  M11Scenarios,
  M12StreamingAlerts,
  M13Decisions,
  M14AlertQuality,
};

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem('nr_quiz_scores') || '{}');
  } catch {
    return {};
  }
}

function saveScores(scores) {
  localStorage.setItem('nr_quiz_scores', JSON.stringify(scores));
}

export default function App() {
  const [activeModule, setActiveModule] = useState('M01Architecture');
  const [visited, setVisited]   = useState(new Set(['M01Architecture']));
  const [scores, setScores]     = useState(loadScores);
  const mainRef = useRef(null);

  const handleNavigate = (moduleId) => {
    setActiveModule(moduleId);
    setVisited((prev) => new Set([...prev, moduleId]));
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const handleQuizComplete = ({ moduleId, score, total, passed }) => {
    const updated = { ...scores, [moduleId]: { score, total, passed } };
    setScores(updated);
    saveScores(updated);
  };

  const ActiveModule = MODULE_MAP[activeModule];

  return (
    <div className="layout">
      <Header visited={visited} total={Object.keys(MODULE_MAP).length} scores={scores} />
      <Sidebar
        activeModule={activeModule}
        onNavigate={handleNavigate}
        visited={visited}
        scores={scores}
      />
      <main className="main-content" ref={mainRef}>
        {ActiveModule && (
          <ActiveModule
            onNavigate={handleNavigate}
            onQuizComplete={handleQuizComplete}
            quizScore={scores[activeModule]}
          />
        )}
      </main>
    </div>
  );
}
