import NrqlAnatomy from '../components/interactive/NrqlAnatomy.jsx';
import ConditionProps from '../components/interactive/ConditionProps.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Callout from '../components/ui/Callout.jsx';
import ModuleQuiz from '../components/interactive/ModuleQuiz.jsx';

const conditionTypeColumns = [
  { key: 'type',   label: 'Type' },
  { key: 'source', label: 'Signal source' },
  { key: 'best',   label: 'Best used for' },
];

const conditionTypeRows = [
  { type: 'NRQL',           source: 'Any NRQL query',         best: 'Custom metrics, logs, events — maximum flexibility' },
  { type: 'APM / Services', source: 'APM agent metrics',      best: 'Response time, error rate, Apdex on instrumented apps' },
  { type: 'Browser',        source: 'Browser agent',          best: 'Page load performance, JavaScript errors' },
  { type: 'Mobile',         source: 'Mobile agent',           best: 'Crash rate, app launch time' },
  { type: 'Infrastructure', source: 'Infrastructure agent',   best: 'CPU, memory, disk, process-level metrics' },
  { type: 'Synthetic',      source: 'Synthetic monitors',     best: 'Uptime checks, scripted browser flows' },
];

export default function M03Conditions({ onQuizComplete, quizScore }) {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 03</div>
      <div className="section-title">Alert Conditions</div>
      <p className="section-lead">
        The condition is the detection engine. It defines what to watch, how to evaluate it, and when
        a violation becomes an incident. NRQL conditions are the most powerful and most commonly used type.
        Click any segment of the example below to learn what it does.
      </p>

      <h2>Condition Types</h2>
      <DataTable columns={conditionTypeColumns} rows={conditionTypeRows} />

      <h2>NRQL Condition Anatomy</h2>
      <p>Click any highlighted segment to see what it controls.</p>
      <NrqlAnatomy />

      <h2>Condition Configuration Properties</h2>
      <p>Click a property to understand its impact.</p>
      <ConditionProps />

      <Callout variant="info">
        <strong>FACET matters:</strong> If your NRQL uses <code>FACET host</code>, the condition creates a <em>separate incident per host</em> that violates the threshold. One condition querying 50 hosts can open 50 simultaneous incidents. Factor this into your Incident Creation Preference decision.
      </Callout>
      <ModuleQuiz moduleId="M03Conditions" onComplete={onQuizComplete} />
    </div>
  );
}
