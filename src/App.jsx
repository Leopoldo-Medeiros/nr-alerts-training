import { useState, useRef } from 'react';
import Header from './components/layout/Header.jsx';
import Sidebar from './components/layout/Sidebar.jsx';

import M00Skills         from './modules/M00Skills.jsx';
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
  M00Skills,
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

// M00Skills is the dashboard — not counted as a content module
const CONTENT_MODULES = Object.keys(MODULE_MAP).filter((k) => k !== 'M00Skills');

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key) || fallback); } catch { return JSON.parse(fallback); }
}
function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

export default function App() {
  const [activeModule, setActiveModule] = useState('M01Architecture');
  const [visited, setVisited]     = useState(() => new Set(load('nr_visited', '["M01Architecture"]')));
  const [scores, setScores]       = useState(() => load('nr_quiz_scores', '{}'));
  const [wrongAnswers, setWrong]  = useState(() => load('nr_wrong_answers', '{}'));
  const mainRef = useRef(null);

  const handleNavigate = (moduleId) => {
    setActiveModule(moduleId);
    if (moduleId !== 'M00Skills') {
      setVisited((prev) => {
        const next = new Set([...prev, moduleId]);
        save('nr_visited', JSON.stringify([...next]));
        return next;
      });
    }
    if (mainRef.current) mainRef.current.scrollTop = 0;
  };

  const handleQuizComplete = ({ moduleId, score, total, passed, wrong }) => {
    // Update scores
    const updatedScores = { ...scores, [moduleId]: { score, total, passed } };
    setScores(updatedScores);
    save('nr_quiz_scores', updatedScores);

    // Replace this module's wrong answers
    const updatedWrong = Object.fromEntries(
      Object.entries(wrongAnswers).filter(([, v]) => v.moduleId !== moduleId)
    );
    wrong.forEach((q) => { updatedWrong[q.id] = { ...q, moduleId }; });
    setWrong(updatedWrong);
    save('nr_wrong_answers', updatedWrong);
  };

  const handleReviewComplete = ({ correct, wrong }) => {
    // Remove correctly answered questions from the wrong answers store
    const updatedWrong = { ...wrongAnswers };
    correct.forEach((id) => delete updatedWrong[id]);
    // Keep still-wrong ones (they're already there)
    setWrong(updatedWrong);
    save('nr_wrong_answers', updatedWrong);
  };

  const ActiveModule = MODULE_MAP[activeModule];

  return (
    <div className="layout">
      <Header
        visited={visited}
        total={CONTENT_MODULES.length}
        scores={scores}
      />
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
            onReviewComplete={handleReviewComplete}
            quizScore={scores[activeModule]}
            scores={scores}
            wrongAnswers={wrongAnswers}
          />
        )}
      </main>
    </div>
  );
}
