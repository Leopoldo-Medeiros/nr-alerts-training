import WorkflowDecisionDiagram from '../components/diagrams/WorkflowDecisionDiagram.jsx';
import WorkflowPlayground from '../components/interactive/WorkflowPlayground.jsx';
import DataTable from '../components/ui/DataTable.jsx';
import Callout from '../components/ui/Callout.jsx';
import Card from '../components/ui/Card.jsx';

const comparisonColumns = [
  { key: 'aspect',  label: 'Aspect' },
  { key: 'legacy',  label: 'Legacy Channels (deprecated)' },
  { key: 'current', label: 'Workflows (current)' },
];

const comparisonRows = [
  { aspect: 'Attachment point',   legacy: 'Attached directly to a policy',                          current: 'Independent of policies; filter by issue properties' },
  { aspect: 'Routing logic',      legacy: 'All incidents in the policy notify the channel',          current: 'Filter by priority, tags, policy name, or any issue property' },
  { aspect: 'Enrichment',         legacy: 'Not available',                                          current: 'Attach live NRQL query results to notifications' },
  { aspect: 'Multi-destination',  legacy: 'One channel per notification',                           current: 'One workflow can route to multiple destinations' },
  { aspect: 'Reusability',        legacy: 'Per-policy configuration',                               current: 'One workflow can serve all policies' },
];

export default function M06Workflows() {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 06</div>
      <div className="section-title">Workflows</div>
      <p className="section-lead">
        A workflow is the routing and enrichment engine. It listens for issue state changes, evaluates
        a filter against the issue's properties, optionally enriches the payload, and sends a notification
        to a destination. Workflows are decoupled from policies.
      </p>

      <h2>How a Workflow Decides</h2>
      <p>Every time an issue changes state, every enabled workflow evaluates whether to act.</p>
      <WorkflowDecisionDiagram />

      <h2>Workflow Components</h2>
      <div className="card-grid">
        <Card title="1 — Trigger">
          Which issue state-change events activate this workflow: <em>Issue Created</em>, <em>Issue Activated</em>, <em>Issue Acknowledged</em>, <em>Issue Resolved</em>. You can select one or more.
        </Card>
        <Card title="2 — Filter">
          A conditional expression evaluated against the issue's properties. If the filter matches, the workflow proceeds. If not, the workflow is skipped for that issue entirely.
        </Card>
        <Card title="3 — Enrichment (optional)">
          Additional NRQL queries that run at notification time. Their results are attached to the notification payload — e.g., the last 10 error events or the current p99 latency.
        </Card>
        <Card title="4 — Destination & Message">
          The destination to send to and the Handlebars message template. Use <code>{'{{issueTitle}}'}</code>, <code>{'{{priority}}'}</code>, <code>{'{{issueUrl}}'}</code> and more.
        </Card>
      </div>

      <h2>Filter Playground</h2>
      <p>Select a filter below to see which issues it would match. This simulates how workflow routing works in practice.</p>
      <WorkflowPlayground />

      <h2>Workflows vs. Legacy Notification Channels</h2>
      <DataTable columns={comparisonColumns} rows={comparisonRows} />

      <Callout variant="critical">
        <strong>Silent alert failure pattern:</strong> A customer changes a legacy Notification Channel on their policy but continues to not receive notifications. The reason is that their actual notifications are routed via a Workflow — which is independent of the policy. The legacy channel change had no effect.
      </Callout>
    </div>
  );
}
