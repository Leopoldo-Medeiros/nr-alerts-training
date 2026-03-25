const scenarios = [
  {
    id: 'noisy-outage',
    title: 'The Noisy Deployment',
    difficulty: 'Foundation',
    setup: `An e-commerce platform team monitors response time across 30 microservices.
They have a single NRQL condition using FACET service to detect slow endpoints.
The policy's Incident Creation Preference is set to "One issue per incident."

During a database connection pool exhaustion event, all 30 services simultaneously
exceed the response time threshold. The workflow filter is set to catch all Critical issues.`,
    question: 'How many workflow executions — and therefore notifications — does the on-call engineer receive?',
    options: [
      { label: '1 — everything is grouped into one issue' },
      { label: '2 — one for the database, one for the services' },
      { label: '30 — one per service' },
      { label: '0 — the threshold is based on average so it may not trigger' },
    ],
    correctIndex: 2,
    explanation: `The answer is 30 notifications.

Here's why the chain produces this result:
— FACET service creates one incident per service in violation → 30 incidents open
— "One issue per incident" means each incident becomes its own issue → 30 issues
— The workflow matches every Critical issue → workflow fires once per issue → 30 notifications

The fix is to change the Incident Creation Preference to "One issue per condition." This collapses all 30 incidents from the same condition into a single issue → 1 workflow execution → 1 notification.`,
    relatedModule: 'M02Policies',
    relatedLabel: 'Module 02 — Alert Policies',
  },

  {
    id: 'silent-warning',
    title: 'The Silent Warning',
    difficulty: 'Foundation',
    setup: `A backend team has an APM alert condition on their API service with:
— Critical threshold: response time > 2,000ms for 5 minutes
— Warning threshold: response time > 1,200ms for 5 minutes

Their workflow is configured with the filter: priority = 'CRITICAL'

During a slow memory leak, the API response time rises to 1,350ms and stays there
for 20 minutes. No Critical threshold is crossed.`,
    question: 'Does the on-call engineer receive a notification?',
    options: [
      { label: 'Yes — the Warning threshold fired, so a notification is delivered' },
      { label: 'No — the workflow filter only matches Critical, Warning is silently ignored' },
      { label: 'Yes — but only after the issue is manually acknowledged' },
      { label: 'No — Warning incidents do not create issues' },
    ],
    correctIndex: 1,
    explanation: `The answer is No — no notification is delivered.

The chain breaks at the Workflow step:
— Warning threshold is exceeded → Warning-priority incident opens ✓
— Warning incident creates a Warning-priority issue ✓
— Workflow filter: priority = 'CRITICAL' → issue priority is WARNING → filter does not match
— Workflow is skipped → no notification is delivered ✗

Warning incidents are real and create real issues. They are simply not routed unless the workflow explicitly includes them.

The fix: update the workflow filter to: priority IN ('CRITICAL', 'WARNING')
Or create a separate workflow for Warning issues routing to a lower-urgency channel (e.g., Slack #alerts-low instead of PagerDuty).`,
    relatedModule: 'M06Workflows',
    relatedLabel: 'Module 06 — Workflows',
  },

  {
    id: 'phantom-issue',
    title: 'The Phantom Issue',
    difficulty: 'Foundation',
    setup: `A platform engineer has a noisy alert condition producing false positives.
To stop the noise immediately, they navigate to the condition and click Delete.

Ten minutes later, the Alerts > Issues page still shows an open issue from
that condition. The issue has been open for 3 hours.`,
    question: 'Why is the issue still open after the condition was deleted?',
    options: [
      { label: 'This is a display bug — the issue should have auto-closed on deletion' },
      { label: 'The workflow is keeping the issue open by querying enrichment data' },
      { label: 'Deleting a condition does not close its open incidents or issues — they remain until manually closed or the auto-close timeout fires' },
      { label: 'The policy is preventing the issue from closing because it has other conditions still active' },
    ],
    correctIndex: 2,
    explanation: `The answer is C — deleting a condition does not close anything.

New Relic's lifecycle rules are strict:
— Conditions detect. Incidents record. These are independent lifecycles.
— Deleting a condition removes future detection only.
— Open incidents from that condition remain in the state they were in.
— The issue remains open as long as any of its incidents remain open.

To resolve this:
1. Go to Alerts → Issues → find the open issue
2. Manually close the open incidents inside it
3. Or wait for the auto-close timeout (default 24 hours) to force-close them

Going forward: if the intention was to stop detections temporarily, use a Muting Rule instead of deleting the condition. Muting suppresses notifications without affecting the incident lifecycle.`,
    relatedModule: 'M04Incidents',
    relatedLabel: 'Module 04 — Incidents',
  },

  {
    id: 'maintenance-timezone',
    title: 'The Midnight Page',
    difficulty: 'Applied',
    setup: `A platform team in New York (EST, UTC−5) sets up a weekly maintenance window
for Sunday deployments. They create a Muting Rule with the following schedule:

  Repeat: Every Sunday
  Start: 02:00
  End: 04:00

They do not configure a timezone in the rule, so it defaults to UTC.
The team expects to work quietly from 2am–4am EST Sunday morning.`,
    question: 'At what local time (EST) will the muting rule actually activate?',
    options: [
      { label: '2:00am – 4:00am Sunday EST (as intended)' },
      { label: '9:00pm – 11:00pm Saturday EST' },
      { label: '7:00am – 9:00am Sunday EST' },
      { label: 'The rule will never activate because no timezone was set' },
    ],
    correctIndex: 1,
    explanation: `The answer is 9:00pm – 11:00pm Saturday EST.

UTC 02:00 Sunday = EST 21:00 Saturday (UTC−5 = subtract 5 hours)
UTC 04:00 Sunday = EST 23:00 Saturday

The muting rule activates on Saturday night, not Sunday morning. The team's actual deployment window — Sunday 2am–4am EST — is UTC 07:00–09:00 Sunday, which is completely outside the muting schedule.

This is one of the most common muting rule misconfigurations. The fix:
1. Edit the muting rule
2. Set the timezone explicitly to America/New_York
3. Set the schedule to 02:00–04:00 in that timezone

Always configure the timezone explicitly in Muting Rules. Never rely on the UTC default unless your entire team operates in UTC.`,
    relatedModule: 'M08MutingRules',
    relatedLabel: 'Module 08 — Muting Rules',
  },

  {
    id: 'workflow-migration',
    title: 'The Migration Gap',
    difficulty: 'Applied',
    setup: `A team migrates from legacy Notification Channels to Workflows.
Their original setup routed all alerts to Slack #platform-alerts via a legacy channel.

After migration, they:
1. Create a new Workflow that routes Critical issues to PagerDuty
2. Remove the legacy Notification Channel from the policy

One week later, they notice Warning-priority issues are no longer arriving in
any channel — not Slack, not PagerDuty, nowhere.`,
    question: 'What happened to Warning-priority issue notifications?',
    options: [
      { label: 'The legacy channel removal accidentally broke Critical routing too' },
      { label: 'Warning issues are routed to PagerDuty, same as Critical' },
      { label: 'Warning issues have no matching workflow and no legacy channel — they are silently dropped' },
      { label: 'Warning issues are held in a queue until manually released' },
    ],
    correctIndex: 2,
    explanation: `The answer is C — Warning issues are silently dropped.

Here's what happened step by step:
— Before migration: Legacy channel routed ALL issues (Critical + Warning) to Slack #platform-alerts
— After migration: New workflow routes only Critical issues to PagerDuty (filter: priority = 'CRITICAL')
— The legacy channel was removed — Warning notifications to Slack no longer exist
— No workflow matches Warning-priority issues → silently ignored

This is the migration gap. The team replaced their routing for Critical but forgot to handle Warning.

The fix:
1. Create a second workflow for Warning issues: priority = 'WARNING'
2. Route it to Slack #platform-alerts (or wherever low-urgency alerts should land)
3. Or update the existing workflow to use: priority IN ('CRITICAL', 'WARNING') with a single destination

Always audit what routing existed before migration and ensure every priority level has a destination after migration.`,
    relatedModule: 'M06Workflows',
    relatedLabel: 'Module 06 — Workflows',
  },
];

export default scenarios;
