import DestinationGrid from '../components/interactive/DestinationGrid.jsx';
import Card from '../components/ui/Card.jsx';
import ModuleQuiz from '../components/interactive/ModuleQuiz.jsx';

export default function M07Destinations({ onQuizComplete, quizScore }) {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 07</div>
      <div className="section-title">Destinations</div>
      <p className="section-lead">
        A destination is a reusable, authenticated connection to an external system. It is defined once
        and can be referenced by any number of workflows. Click a destination type to learn about
        its connection method and common issues.
      </p>

      <DestinationGrid />

      <h2>Authentication &amp; Reliability</h2>
      <div className="card-grid">
        <Card title="Credential storage">
          API keys and OAuth tokens are stored encrypted at rest. They are never exposed in the workflow configuration — you reference the destination by name.
        </Card>
        <Card title="Silent failure risk">
          If a destination's credentials expire or are revoked, notifications fail silently from the customer's perspective. Check the workflow run history for delivery errors. This is a common TSE investigation point.
        </Card>
        <Card title="Test connection">
          Every destination has a "Test connection" button. Use this first when troubleshooting delivery failures before debugging the workflow filter or message template.
        </Card>
      </div>
      <ModuleQuiz moduleId="M07Destinations" onComplete={onQuizComplete} />
    </div>
  );
}
