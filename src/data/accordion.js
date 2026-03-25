const accordionItems = [
  {
    question: '"I updated the Notification Channel but still not getting alerts"',
    tag: { label: 'Routing', variant: 'mute' },
    answer: `<p><strong>Root cause:</strong> Notification Channels on policies are a legacy mechanism. Since 2022, notification routing is controlled by Workflows, which are completely independent of the policy.</p>
       <p><strong>What to check:</strong> Navigate to Alerts &gt; Workflows. Find the workflow responsible for this policy's notifications. The filter and destination are configured there — not on the policy itself.</p>
       <p><strong>Fix:</strong> Update the Workflow's destination or filter. Changes to the legacy Notification Channel have no effect if routing has been migrated to Workflows.</p>`,
  },
  {
    question: '"The condition is firing but I\'m receiving no notifications"',
    tag: { label: 'Silent failure', variant: 'crit' },
    answer: `<p>Check these in order:</p>
       <p><strong>1. Is there a matching workflow?</strong> Navigate to Alerts &gt; Workflows. Verify a workflow exists with a filter that matches the issue (priority, tags, policy name).</p>
       <p><strong>2. Is the issue muted?</strong> Open the issue in the Alerts UI. A muted badge indicates a Muting Rule is suppressing it.</p>
       <p><strong>3. Does the workflow trigger on the right state?</strong> If the workflow only triggers on "Issue Created" but the issue was already open before the workflow was created, it will not fire retroactively.</p>
       <p><strong>4. Is the destination healthy?</strong> Check the destination's test connection. Expired tokens are a very common silent failure mode.</p>
       <p><strong>5. Check workflow run history.</strong> Each workflow shows a run log. Look for failed executions with error messages.</p>`,
  },
  {
    question: '"There are 20 incidents but only 1 Slack message was sent"',
    tag: { label: 'Grouping', variant: 'warn' },
    answer: `<p><strong>This is expected behavior</strong> if the policy's Incident Creation Preference is set to "One issue per policy" or "One issue per condition." All incidents collapse into a single issue, so the workflow fires once.</p>
       <p>If the customer wants more granular notifications, they must change the Incident Creation Preference to "One issue per incident." Be sure to explain the trade-off: more granular = more notifications, especially during an outage with many entities in violation simultaneously.</p>`,
  },
  {
    question: '"Warning threshold fired but no Slack notification"',
    tag: { label: 'Priority filter', variant: 'warn' },
    answer: `<p><strong>Root cause:</strong> The workflow filter is almost certainly <code>priority = 'CRITICAL'</code>. Warning incidents open with Warning priority. If the issue that contains the Warning incident is not Critical, the workflow filter does not match and no notification fires.</p>
       <p><strong>Fix:</strong> Update the workflow filter to include Warning: <code>priority IN ('CRITICAL', 'WARNING')</code>. Or create a separate workflow for Warning-priority issues routed to a lower-urgency channel (e.g., a Slack #alerts-low channel vs. PagerDuty for critical).</p>`,
  },
  {
    question: '"I deleted the condition but the issue is still open"',
    tag: { label: 'Lifecycle', variant: 'crit' },
    answer: `<p><strong>Root cause:</strong> Deleting a condition does not close its open incidents or the issues that contain them. The issue remains open because the incidents it contains were never closed.</p>
       <p><strong>Fix:</strong> Manually close the open incidents from the Alerts UI (Issues &gt; find the issue &gt; close incidents). You can also use the NerdGraph API to close incidents programmatically if there are many.</p>`,
  },
  {
    question: '"Alerts fired during our maintenance window even though we set a muting rule"',
    tag: { label: 'Muting scope', variant: 'warn' },
    answer: `<p><strong>Check the muting rule filter.</strong> A muting rule only suppresses issues that <em>match its tag filter</em>. If the muting rule filters on <code>tags.environment = 'staging'</code> but the firing alert is from a production entity, it will not be muted.</p>
       <p>Also check the time zone configuration. Muting rule schedules are evaluated in the time zone set on the rule. A mismatch between the rule's time zone and the team's expected time zone is a common source of this issue.</p>`,
  },
  {
    question: '"Customer says the alert closed immediately after opening, without recovery"',
    tag: { label: 'Fill / auto-close', variant: 'mute' },
    answer: `<p>Two likely causes:</p>
       <p><strong>1. Fill option set to "Close violation on data loss."</strong> If the data pipeline had a brief gap after the incident opened, the condition immediately closes it. Check if the signal has gaps around the time the incident opened and closed.</p>
       <p><strong>2. The "close after X hours" setting is very short.</strong> If set to 1 hour and the condition's evaluation cycle takes time, an incident might open and auto-close rapidly. Check the condition's auto-close setting.</p>`,
  },
  {
    question: '"We have correlation (Decisions) enabled but issues are still not merging"',
    tag: { label: 'Correlation', variant: 'mute' },
    answer: `<p>Correlation rules (now under Alerts &gt; Settings &gt; Correlate) require that the issues being correlated share matching properties defined in the rule's filter. Check:</p>
       <p><strong>1. Do the issues share the expected tags?</strong> If the rule correlates by <code>tags.service</code>, both issues must have the same service tag value.</p>
       <p><strong>2. Are the issues within the correlation time window?</strong> If Issue A opened 90 minutes before Issue B, and the correlation window is 60 minutes, they will not be correlated.</p>
       <p><strong>3. Is the correlation rule enabled?</strong> Rules can be individually toggled off.</p>`,
  },
];

export default accordionItems;
