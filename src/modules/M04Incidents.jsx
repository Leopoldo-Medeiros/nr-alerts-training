import StateMachineDiagram from '../components/diagrams/StateMachineDiagram.jsx';
import Card from '../components/ui/Card.jsx';
import Callout from '../components/ui/Callout.jsx';
import ModuleQuiz from '../components/interactive/ModuleQuiz.jsx';

export default function M04Incidents({ onQuizComplete, quizScore }) {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 04</div>
      <div className="section-title">Incidents</div>
      <p className="section-lead">
        An incident is the internal record of a threshold breach. It has a three-state lifecycle.
        Incidents are not the unit workflows act on — that is the Issue. Understanding this distinction
        resolves a large number of support tickets.
      </p>

      <h2>Incident Lifecycle</h2>
      <p>Click any state to see what triggers it and what it means.</p>
      <StateMachineDiagram />

      <h2>Key Properties</h2>
      <div className="card-grid">
        <Card title="One condition → many incidents">
          If a condition uses FACET, it creates one incident per entity in violation. A condition monitoring 20 hosts can have 20 open incidents simultaneously.
        </Card>
        <Card title="Incidents ≠ notifications">
          An incident does not directly send a notification. The incident updates an issue. The issue triggers a workflow. The workflow sends to a destination. All three must be configured correctly.
        </Card>
        <Card title="Deletion does not close">
          Deleting a condition leaves its open incidents in an open state indefinitely. You must manually close them or wait for the auto-close timeout.
        </Card>
      </div>

      <Callout variant="warning">
        <strong>Warning threshold behavior:</strong> Warning incidents open with Warning priority. By default, most workflows are configured to trigger only on Critical-priority issues. If your workflow filter is <code>issue.priority = 'CRITICAL'</code>, Warning incidents will never trigger a notification — even if they are open and the customer expects one.
      </Callout>
      <ModuleQuiz moduleId="M04Incidents" onComplete={onQuizComplete} />
    </div>
  );
}
