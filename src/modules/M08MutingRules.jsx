import MutingVisualizer from '../components/interactive/MutingVisualizer.jsx';
import Card from '../components/ui/Card.jsx';
import CodeBlock from '../components/ui/CodeBlock.jsx';
import Callout from '../components/ui/Callout.jsx';

export default function M08MutingRules() {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 08</div>
      <div className="section-title">Muting Rules</div>
      <p className="section-lead">
        Muting rules suppress notification delivery without disabling conditions. Incidents still open,
        issues still create — they are simply marked as muted and workflows do not fire for them.
        This is the correct approach for maintenance windows and known, in-progress issues.
      </p>

      <h2>What Muting Does and Does Not Do</h2>
      <div className="card-grid">
        <Card title="Does suppress">
          Notification delivery via workflows. Muted issues are visible in the Alerts UI with a muted indicator but do not page anyone.
        </Card>
        <Card title="Does not suppress">
          Incident creation. Data collection. Issue creation. Condition evaluation. All of these continue normally. If muting is removed while a violation is active, notifications will fire immediately.
        </Card>
      </div>

      <h2>Muting Rule Visualizer</h2>
      <p>Toggle a muting rule to see how it silences a weekly maintenance window. The darker cells represent the active muted period.</p>
      <MutingVisualizer />

      <h2>Muting Rule Scope</h2>
      <p>Rules are scoped by tag-based filters. Example rule definition:</p>
      <CodeBlock>
        <span className="kw">Rule name:</span> <span className="str">Weekly Sunday maintenance — staging</span><br />
        <span className="kw">Schedule:</span> <span className="str">Every Sunday, 02:00–04:00 UTC</span><br />
        <span className="kw">Filter:</span>{'  '}tags.environment <span className="kw">=</span> <span className="str">'staging'</span>
        <span className="kw"> AND </span>tags.team <span className="kw">=</span> <span className="str">'platform'</span>
      </CodeBlock>

      <Callout variant="warning">
        <strong>Common confusion:</strong> Customers expect that muting a rule "turns off" the alert condition. It does not. If they need to stop incidents from opening entirely, they must disable or delete the condition. Muting only suppresses the notification delivery step.
      </Callout>
    </div>
  );
}
