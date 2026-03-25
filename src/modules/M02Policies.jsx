import PreferenceSimulator from '../components/interactive/PreferenceSimulator.jsx';
import Callout from '../components/ui/Callout.jsx';
import Card from '../components/ui/Card.jsx';
import ModuleQuiz from '../components/interactive/ModuleQuiz.jsx';

export default function M02Policies({ onQuizComplete, quizScore }) {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 02</div>
      <div className="section-title">Alert Policies</div>
      <p className="section-lead">
        A policy is an organizational container for alert conditions. Its only behavioral setting — the{' '}
        <strong>Incident Creation Preference</strong> — determines how incidents produced by its conditions
        are grouped into issues. This single setting has a large impact on notification volume.
      </p>

      <h2>What a Policy Does</h2>
      <div className="card-grid">
        <Card title="Contains conditions">
          One or more alert conditions live inside a policy. The policy is not the detector — conditions are. The policy provides the grouping context.
        </Card>
        <Card title="Controls incident grouping">
          The Incident Creation Preference governs how incidents from this policy's conditions become issues. This is the policy's only meaningful behavioral setting.
        </Card>
        <Card title="Does not control routing">
          Notification routing is the Workflow's responsibility. A policy does not send notifications — it creates issues. Workflows route those issues to destinations.
        </Card>
      </div>

      <h2>Incident Creation Preference — Interactive Simulator</h2>
      <p>Select a preference to see how 4 incidents from 2 conditions would be grouped into issues and how many notifications fire.</p>
      <PreferenceSimulator />

      <Callout variant="warning">
        <strong>Common TSE scenario:</strong> A customer reports they received 40 Slack notifications during an outage. The root cause is almost always Incident Creation Preference set to "One issue per incident" while a condition is querying many entities simultaneously.
      </Callout>

      <h2>Best Practices</h2>
      <ul>
        <li>Organize policies by <strong>service or team</strong>, not by severity. Severity is expressed in conditions.</li>
        <li>Consider "One issue per condition" as the default — it balances visibility and noise well.</li>
        <li>A policy with a single condition is perfectly valid and common.</li>
        <li>Avoid putting unrelated services in the same policy — the Incident Creation Preference applies to all conditions equally.</li>
      </ul>
      <ModuleQuiz moduleId="M02Policies" onComplete={onQuizComplete} />
    </div>
  );
}
