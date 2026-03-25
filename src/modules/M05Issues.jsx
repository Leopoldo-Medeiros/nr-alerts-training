import DataTable from '../components/ui/DataTable.jsx';
import Card from '../components/ui/Card.jsx';
import Callout from '../components/ui/Callout.jsx';
import Badge from '../components/ui/Badge.jsx';
import ModuleQuiz from '../components/interactive/ModuleQuiz.jsx';

const issueStateColumns = [
  { key: 'state',   label: 'State' },
  { key: 'meaning', label: 'Meaning' },
  { key: 'trigger', label: 'Workflow trigger' },
];

const issueStateRows = [
  {
    state: '<span class="badge badge--crit"><span class="badge-dot" style="background:var(--crit)"></span>CREATED</span>',
    meaning: 'At least one incident is open and the issue has just been created',
    trigger: 'Issue Created',
  },
  {
    state: '<span class="badge badge--warn"><span class="badge-dot" style="background:var(--warn)"></span>ACTIVATED</span>',
    meaning: 'Issue has been acknowledged or new incidents have been added',
    trigger: 'Issue Activated',
  },
  {
    state: '<span class="badge badge--ok"><span class="badge-dot" style="background:var(--ok)"></span>CLOSED</span>',
    meaning: 'All underlying incidents are closed',
    trigger: 'Issue Resolved',
  },
];

export default function M05Issues({ onQuizComplete, quizScore }) {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 05</div>
      <div className="section-title">Issues</div>
      <p className="section-lead">
        Issues are the user-facing aggregation of incidents. They are what appears in the Alerts UI,
        what Workflows listen to, and what responders interact with during an incident response.
        Understanding how incidents become issues is the most frequently misunderstood concept in Alerts.
      </p>

      <h2>Issue States</h2>
      <DataTable columns={issueStateColumns} rows={issueStateRows} />

      <h2>Issue Priority</h2>
      <p>
        Issue priority is inherited from its highest-priority open incident. If a Warning incident and a Critical incident are grouped into the same issue, the issue is <strong>Critical</strong>. When the Critical incident closes but the Warning remains open, the issue priority <em>downgrades to Warning</em> automatically.
      </p>

      <h2>AIOps Correlation (formerly "Decisions")</h2>
      <Card title="Cross-policy issue correlation">
        New Relic can further merge issues from <em>different</em> policies when it detects they are likely related to the same underlying event. This is controlled by correlation rules (previously called "Decisions" in Incident Intelligence). During an outage, this prevents an alert storm of 30 separate issues — a database CPU spike, an API timeout, a failing health check — from all paging independently. They merge into one parent issue.
        <br /><br />
        Correlation rules can be:
        <ul>
          <li><strong>Machine learning–based</strong> — NR learns from historical co-occurrence of issues.</li>
          <li><strong>User-defined</strong> — You specify conditions like "correlate issues with the same <code>tags.service</code> within a 30-minute window."</li>
        </ul>
        <br />
        The "Decisions" label is deprecated in the current UI. Look for this feature under <strong>Alerts &gt; Settings &gt; Correlate</strong>.
      </Card>

      <Callout variant="info">
        <strong>Correlation vs. grouping:</strong> The Policy's Incident Creation Preference groups incidents <em>within</em> a policy into issues. Correlation merges issues <em>across</em> policies into a parent issue. These are two distinct mechanisms operating at different levels of the hierarchy.
      </Callout>
      <ModuleQuiz moduleId="M05Issues" onComplete={onQuizComplete} />
    </div>
  );
}
