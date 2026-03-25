import { useState } from 'react';
import ScenarioChallenge from '../components/interactive/ScenarioChallenge.jsx';
import scenarios from '../data/scenarios.js';

export default function M11Scenarios({ onNavigate }) {
  const [scores, setScores] = useState({});

  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 11</div>
      <div className="section-title">Scenario Challenges</div>
      <p className="section-lead">
        Five realistic scenarios based on actual support ticket patterns. Each presents a customer's
        configuration and a specific outcome — select the correct answer, then read the full explanation
        of why the configuration behaves that way.
      </p>

      <div className="scenarios-list">
        {scenarios.map((scenario, i) => (
          <ScenarioChallenge
            key={scenario.id}
            scenario={scenario}
            index={i}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </div>
  );
}
