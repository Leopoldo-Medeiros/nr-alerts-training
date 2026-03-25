const quizzes = {
  M01Architecture: [
    {
      id: 'M01Q1',
      question: 'A condition fires and an incident opens, but no notification is ever received. Which layer should you investigate first?',
      options: [
        'The alert condition threshold settings',
        'The workflow filter logic',
        'The destination authentication credentials',
        'The issue creation preference on the policy',
      ],
      correctIndex: 1,
      explanation:
        'Workflows are the notification gate. Even if an incident opens and an issue is created, a workflow whose filter does not match will silently drop the notification. The condition and policy are already working correctly if an incident opened.',
    },
    {
      id: 'M01Q2',
      question: 'An entity completely stops reporting metrics. Your threshold condition monitoring it does not fire. What is the most likely reason?',
      options: [
        'The condition evaluation window is too long',
        'The policy has no workflow attached',
        'Threshold conditions require data to evaluate — absence of data produces no result',
        'The incident was automatically muted',
      ],
      correctIndex: 2,
      explanation:
        'Threshold conditions can only compare a value to a threshold. If no data arrives, there is nothing to compare — the condition never evaluates. You need signal loss detection configured separately to catch a silent entity.',
    },
    {
      id: 'M01Q3',
      question: 'In the alerting pipeline, what is the correct order of the first three stages after a signal breaches its threshold?',
      options: [
        'Incident → Issue → Workflow evaluation',
        'Issue → Incident → Workflow evaluation',
        'Workflow evaluation → Incident → Issue',
        'Incident → Workflow evaluation → Issue',
      ],
      correctIndex: 0,
      explanation:
        'The pipeline is: condition evaluates → incident opens → incident aggregates into an issue → workflow evaluates the issue → notification is dispatched to the destination.',
    },
    {
      id: 'M01Q4',
      question: 'You delete a workflow that was attached to an active issue. What happens to ongoing notifications for that issue?',
      options: [
        'The issue closes immediately',
        'Notifications continue using the last known destination',
        'No further notifications are sent — the issue remains open but silent',
        'The policy falls back to legacy notification channels',
      ],
      correctIndex: 2,
      explanation:
        'Workflows are evaluated at notification time. Deleting a workflow removes the notification path entirely. The issue stays open in the UI, but nothing will page your team until a matching workflow exists again.',
    },
    {
      id: 'M01Q5',
      question: 'Which component in the alerting stack is responsible for controlling how many issues are created from multiple incidents within the same policy?',
      options: [
        'The alert condition',
        'The workflow filter',
        'The issue creation preference on the policy',
        'The destination configuration',
      ],
      correctIndex: 2,
      explanation:
        'Issue creation preference lives on the policy and controls whether multiple incidents collapse into one issue or create separate issues. Conditions, workflows, and destinations have no influence over this behavior.',
    },
  ],

  M02Policies: [
    {
      id: 'M02Q1',
      question: 'You monitor 20 hosts with a single FACET condition. You want one PagerDuty page per affected host, not one for the whole policy. Which issue creation preference should you use?',
      options: [
        'One issue per policy',
        'One issue per condition',
        'One issue per condition and signal',
        'It depends on the workflow filter',
      ],
      correctIndex: 2,
      explanation:
        '"One issue per condition and signal" creates a separate issue for each unique facet value (each host). This means each host gets its own notification lifecycle. "One issue per condition" would merge all 20 hosts into a single issue.',
    },
    {
      id: 'M02Q2',
      question: 'A policy has two conditions but no workflow attached to it. Both conditions breach. What happens?',
      options: [
        'Notifications are sent using the account default destination',
        'Incidents and issues open, but no notifications are sent',
        'The conditions are disabled automatically',
        'An error is raised and the incidents are dropped',
      ],
      correctIndex: 1,
      explanation:
        'Policies do not send notifications directly — that is the workflow\'s job. Incidents will open and issues will be created, but without a matching workflow there is no notification path.',
    },
    {
      id: 'M02Q3',
      question: 'A policy is set to "One issue per policy". Three conditions breach simultaneously. How many issues are created?',
      options: ['3', '1', 'One per condition type', 'Depends on entity count'],
      correctIndex: 1,
      explanation:
        '"One issue per policy" collapses all incidents from all conditions in that policy into a single issue. This is the most aggressive noise-reduction setting but means all breaches look like one event.',
    },
    {
      id: 'M02Q4',
      question: 'An engineer who owned several alert policies leaves the company. No one updates ownership. What is the main operational risk?',
      options: [
        'The policies auto-delete after 30 days',
        'The conditions stop evaluating without an owner',
        'No one reviews thresholds or runbooks — alert quality silently degrades',
        'Notifications route to the departed engineer\'s email only',
      ],
      correctIndex: 2,
      explanation:
        'Policies without active owners are a leading cause of alert quality degradation. Thresholds drift, runbooks go stale, and no one deletes conditions that fire constantly. The conditions keep evaluating — the risk is operational neglect, not a technical failure.',
    },
    {
      id: 'M02Q5',
      question: 'You have a Critical condition and a Warning condition in the same policy set to "One issue per condition". Both breach. A workflow filters on priority = CRITICAL. How many notifications are sent?',
      options: [
        '2 — one per issue',
        '1 — only the Critical issue matches the workflow filter',
        '0 — both must match for either to notify',
        '1 — the Warning is upgraded to Critical automatically',
      ],
      correctIndex: 1,
      explanation:
        'Each condition creates its own issue (one issue per condition). The workflow filter evaluates each issue independently. The Critical issue matches → notification sent. The Warning issue does not match → no notification. Warning-only notifications require a separate workflow with no priority filter or a filter for MEDIUM priority.',
    },
  ],

  M03Conditions: [
    {
      id: 'M03Q1',
      question: 'You want to alert when average response time exceeds 500ms for at least 5 consecutive minutes. What two settings control this?',
      options: [
        'Threshold value + aggregation window',
        'Threshold value + "for at least X minutes" (violation duration)',
        'Evaluation offset + signal loss timer',
        'Threshold value + gap-filling strategy',
      ],
      correctIndex: 1,
      explanation:
        'The threshold value (500ms) determines what constitutes a breach. The "for at least X minutes" setting requires the signal to stay in breach for that duration before an incident opens, filtering out brief spikes.',
    },
    {
      id: 'M03Q2',
      question: 'A NRQL condition uses FACET host. The policy is set to "One issue per condition". Five hosts breach simultaneously. How many incidents open?',
      options: ['1', '5', 'Depends on the workflow', 'Depends on the evaluation window'],
      correctIndex: 1,
      explanation:
        'Incidents are created per signal — one per unique FACET value. Five hosts breaching = five incidents. The issue creation preference controls how those five incidents are grouped into issues, but the incident count is always one per facet value.',
    },
    {
      id: 'M03Q3',
      question: 'Your service has a strong daily traffic pattern — low at night, high during business hours. A static threshold of 200 errors/min fires every morning at peak. What condition type would eliminate this noise?',
      options: [
        'Static threshold with a higher value',
        'Baseline (anomaly) condition',
        'Signal loss condition',
        'A muting rule for business hours',
      ],
      correctIndex: 1,
      explanation:
        'Baseline conditions learn the normal behavior of your signal — including daily/weekly cycles. They alert on deviation from the learned norm rather than a fixed value, so a predictable morning peak does not trigger an incident.',
    },
    {
      id: 'M03Q4',
      question: 'You configure Warning: CPU > 80% and Critical: CPU > 90%. A workflow has the filter `issue.priority = \'CRITICAL\'`. CPU hits 85%. Does a notification get sent?',
      options: [
        'Yes — Warning and Critical both trigger the workflow',
        'No — the Warning threshold creates a MEDIUM priority issue which does not match the filter',
        'Yes — any threshold breach always sends a notification',
        'No — you need two separate workflows for Warning and Critical',
      ],
      correctIndex: 1,
      explanation:
        'A Warning threshold breach creates an incident with MEDIUM priority, resulting in a MEDIUM priority issue. The workflow filter requires CRITICAL priority. No match = no notification. To receive Warning notifications you need a workflow that matches MEDIUM priority (or no priority filter).',
    },
    {
      id: 'M03Q5',
      question: 'A condition queries `SELECT average(duration) FROM Transaction`. Traffic to the service drops to zero. What is the most likely outcome?',
      options: [
        'The condition fires a signal loss incident automatically',
        'The condition evaluates to 0 and closes any open incident',
        'No data → no evaluation result → the condition produces no incident',
        'The condition uses the last known value for evaluation',
      ],
      correctIndex: 2,
      explanation:
        'Without gap-filling, a window with no data produces no evaluation result — the engine has nothing to compare to the threshold. The condition neither opens nor closes an incident. To detect zero traffic you need signal loss detection or gap-filling with a static value.',
    },
  ],

  M04Incidents: [
    {
      id: 'M04Q1',
      question: 'You fix the root cause of an alert. The CPU drops back to normal immediately, but the incident stays open for another 8 minutes. Why?',
      options: [
        'The workflow has a retry delay configured',
        'The recovery window requires the signal to stay below threshold for a sustained period before closing',
        'The issue creation preference is delaying closure',
        'The incident requires manual acknowledgement before it can close',
      ],
      correctIndex: 1,
      explanation:
        'Incident recovery is not instantaneous. New Relic requires the signal to remain below the threshold for a recovery window (typically matching the evaluation window) before the incident closes. This prevents flapping from brief dips below the threshold.',
    },
    {
      id: 'M04Q2',
      question: 'You delete an alert condition while it has an open incident. What happens to that incident?',
      options: [
        'It closes immediately when the condition is deleted',
        'It closes after the standard recovery window',
        'It remains open indefinitely and must be closed manually',
        'It transfers ownership to the policy default condition',
      ],
      correctIndex: 2,
      explanation:
        'Deleting a condition orphans any incidents it created. Without an active condition to drive recovery, the incident has no mechanism to close automatically. You must close it manually from the issue UI.',
    },
    {
      id: 'M04Q3',
      question: 'A FACET condition monitors 10 service instances. Three instances breach their threshold. How many incidents open?',
      options: ['1', '3', '10', 'Depends on issue creation preference'],
      correctIndex: 1,
      explanation:
        'One incident opens per unique FACET value that breaches. Three instances breaching = three incidents. The other seven instances are below threshold and produce no incident. Issue creation preference affects how these three incidents become issues — not the incident count.',
    },
    {
      id: 'M04Q4',
      question: 'An incident opens, closes 3 minutes later, then opens again 2 minutes after that — repeating several times. What anti-pattern is this?',
      options: ['Signal loss', 'Flapping', 'Threshold drift', 'Alert shadowing'],
      correctIndex: 1,
      explanation:
        'Flapping is when an alert oscillates between open and closed rapidly because the signal hovers near the threshold. It is a leading cause of alert fatigue. Fix by raising the threshold, adding a consecutive evaluation requirement, or switching to a baseline condition.',
    },
    {
      id: 'M04Q5',
      question: 'You disable a condition that has an open incident, with "Close open incidents on condition disable" turned ON. What happens?',
      options: [
        'The incident stays open until the signal recovers naturally',
        'The incident closes immediately when the condition is disabled',
        'The incident closes after a 5-minute grace period',
        'The incident is transferred to the policy\'s other conditions',
      ],
      correctIndex: 1,
      explanation:
        'When "Close open incidents on condition disable" is enabled, disabling the condition immediately closes any incidents it owns. This is useful during maintenance when you want to suppress alerts without deleting the condition.',
    },
  ],

  M05Issues: [
    {
      id: 'M05Q1',
      question: 'Two incidents from two different policies open on the same entity at the same time. Without Decisions (correlation) enabled, how many issues are created?',
      options: [
        '1 — issues always merge on the same entity',
        '2 — one issue per policy by default',
        'Depends on the issue creation preference of each policy',
        '1 — New Relic auto-correlates same-entity incidents',
      ],
      correctIndex: 1,
      explanation:
        'Without Decisions, issues are scoped per policy. Two incidents from different policies create two separate issues even if they affect the same entity. Cross-policy merging requires the Decisions (AIOps correlation) engine.',
    },
    {
      id: 'M05Q2',
      question: 'An issue contains a CRITICAL incident and a WARNING incident. What is the issue\'s priority?',
      options: ['WARNING', 'CRITICAL', 'Average of the two', 'The most recently opened incident\'s priority'],
      correctIndex: 1,
      explanation:
        'Issue priority is always the highest priority among all constituent incidents. One CRITICAL incident in an issue makes the entire issue CRITICAL, regardless of how many WARNING incidents it also contains.',
    },
    {
      id: 'M05Q3',
      question: 'An issue has 3 incidents. You close 2 of them manually. What is the issue\'s state?',
      options: [
        'Resolved — majority closed',
        'Still open — all incidents must close before the issue closes',
        'Acknowledged',
        'Closed — manually closed incidents trigger issue closure',
      ],
      correctIndex: 1,
      explanation:
        'An issue remains open as long as at least one constituent incident is active. All incidents in an issue must close (naturally or manually) before the issue itself moves to resolved.',
    },
    {
      id: 'M05Q4',
      question: 'You acknowledge an issue at 2pm. At 3pm a new incident is added to the same issue by correlation. Is the new incident automatically acknowledged?',
      options: [
        'Yes — issue-level acknowledgement covers all incidents added later',
        'No — acknowledgement applies to the issue state at the time it was set; new incidents reset it',
        'Yes — but only if the new incident has equal or lower priority',
        'No — each incident must be acknowledged individually',
      ],
      correctIndex: 1,
      explanation:
        'Acknowledgement captures the state of the issue at a point in time. When a new incident is added, the issue state changes and acknowledgement no longer fully covers the new activity. This is intentional — it ensures engineers are aware of escalating issues.',
    },
    {
      id: 'M05Q5',
      question: 'What is the difference between a "Resolved" and a "Closed" issue?',
      options: [
        'They are the same state with different labels',
        'Resolved = all incidents closed naturally by recovery; Closed = manually closed or TTL expired',
        'Resolved = acknowledged; Closed = unacknowledged and timed out',
        'Resolved = closed by workflow; Closed = closed by operator',
      ],
      correctIndex: 1,
      explanation:
        'Resolved means all constituent incidents closed through their normal threshold-recovery lifecycle. Closed means the issue was manually closed by an operator or reached its maximum open duration (TTL). Both states mean the issue is inactive, but the distinction matters for post-incident reporting.',
    },
  ],

  M06Workflows: [
    {
      id: 'M06Q1',
      question: 'A workflow filter is set to `issue.priority = \'CRITICAL\'`. A Warning condition fires and creates a MEDIUM priority issue. Is a notification sent?',
      options: [
        'Yes — Warning conditions always bypass workflow filters',
        'No — the issue does not match the filter',
        'Yes — but with a 5-minute delay',
        'No — Warning issues never trigger workflows',
      ],
      correctIndex: 1,
      explanation:
        'Workflow filters are evaluated against the issue at notification time. A MEDIUM priority issue does not match `priority = CRITICAL`. No match = no notification. This is a common cause of "my Warning alerts stopped working after the workflows migration."',
    },
    {
      id: 'M06Q2',
      question: 'You want the same issue to notify both a Slack channel AND create a PagerDuty incident. What is the correct approach?',
      options: [
        'Create two separate workflows — one per destination',
        'Add both destinations to the same workflow',
        'Either approach works',
        'You must use a webhook to fan out to multiple destinations',
      ],
      correctIndex: 2,
      explanation:
        'Both approaches work. A single workflow can have multiple destinations — all destinations in the workflow receive the notification when the filter matches. Alternatively, two separate workflows with the same filter will both evaluate and both notify independently.',
    },
    {
      id: 'M06Q3',
      question: 'A workflow has no issue filter configured. Which issues will trigger it?',
      options: [
        'Only Critical issues',
        'Only issues from policies that explicitly reference the workflow',
        'All issues across the entire account',
        'Only issues that are not already matched by another workflow',
      ],
      correctIndex: 2,
      explanation:
        'A workflow with no filter is a catch-all — it matches every issue created in the account, regardless of policy, condition, priority, or entity. Multiple workflows can match the same issue simultaneously — they are not mutually exclusive.',
    },
    {
      id: 'M06Q4',
      question: 'What does workflow enrichment do?',
      options: [
        'It adds additional conditions to the issue filter',
        'It runs a NRQL query at notification time and appends the result to the notification payload',
        'It upgrades issue priority based on entity metadata',
        'It deduplicates notifications across multiple workflows',
      ],
      correctIndex: 1,
      explanation:
        'Enrichment runs a NRQL query when the notification is about to be sent, and attaches the query result to the notification. This lets you include live context — like recent deployment events or related error counts — directly in the alert message.',
    },
    {
      id: 'M06Q5',
      question: 'Workflow deduplication prevents re-notification for the same issue. When does a workflow send a notification again after the initial one?',
      options: [
        'Never — one notification per issue lifetime',
        'When the issue priority escalates, or when configured update conditions are met (e.g., new incident added)',
        'Every time the evaluation window completes',
        'Only when the issue is manually re-opened',
      ],
      correctIndex: 1,
      explanation:
        'Deduplication prevents duplicate notifications for the same issue state, but re-notification can be triggered by issue state changes: priority escalation, a new incident being added, or explicit "notify on update" settings in the workflow.',
    },
  ],

  M07Destinations: [
    {
      id: 'M07Q1',
      question: 'You rotate the API key used by a PagerDuty destination. Notifications start failing silently. What must you do?',
      options: [
        'Delete and recreate the destination',
        'Update the credentials in the existing destination configuration',
        'Restart the workflow that uses the destination',
        'Re-authenticate via the policy settings',
      ],
      correctIndex: 1,
      explanation:
        'Destinations store credentials that must be kept up to date. When an API key is rotated externally, you update it in Alerts > Destinations — the destination record itself stays the same. Deleting and recreating also works but breaks any workflow references.',
    },
    {
      id: 'M07Q2',
      question: 'You delete a destination that is referenced by three workflows. What happens to those workflows?',
      options: [
        'The workflows are also deleted automatically',
        'The workflows continue to run but skip that destination silently',
        'The workflows fail to send notifications via that channel — other destinations in the workflow are unaffected',
        'New Relic prevents deletion of destinations in use',
      ],
      correctIndex: 2,
      explanation:
        'Deleting a destination breaks only the notification path for that specific channel. Other destinations configured in the same workflow continue to work. The workflows themselves are not deleted. NR does not prevent you from deleting a destination that is in use.',
    },
    {
      id: 'M07Q3',
      question: 'A webhook destination returns HTTP 401 on every notification attempt. Where do you go to diagnose this?',
      options: [
        'The alert condition evaluation log',
        'The workflow execution history / notification log in Alerts > Destinations',
        'The NRDB NrAiNotification event type via NRQL',
        'Both B and C',
      ],
      correctIndex: 3,
      explanation:
        'Notification failures are visible in two places: the notification log in the Destinations UI shows per-attempt status and HTTP response codes, and the NrAiNotification event in NRDB can be queried with NRQL for programmatic alerting on delivery failures.',
    },
    {
      id: 'M07Q4',
      question: 'What is the purpose of a message template in a destination?',
      options: [
        'To filter which issues trigger the destination',
        'To transform and customize the payload sent to the external service using issue variables',
        'To set the authentication method for the channel',
        'To define the retry policy on failure',
      ],
      correctIndex: 1,
      explanation:
        'Message templates let you shape the notification payload using Handlebars-style variables from the issue (e.g., `{{issueTitle}}`, `{{priority}}`, `{{entityName}}`). This is how you create well-formatted Slack messages or properly structured webhook JSON payloads.',
    },
    {
      id: 'M07Q5',
      question: 'An OAuth2-authenticated destination stops delivering notifications after 60 days. No credentials were changed. What is the most likely cause?',
      options: [
        'The workflow filter changed automatically',
        'The OAuth2 access token expired and needs re-authentication',
        'New Relic deactivates destinations inactive for 60 days',
        'The destination was rate-limited by the external service',
      ],
      correctIndex: 1,
      explanation:
        'OAuth2 tokens have expiry times set by the external provider. When the token expires, authentication fails and notifications stop. You need to re-authenticate the destination in Alerts > Destinations to generate a fresh token.',
    },
  ],

  M08MutingRules: [
    {
      id: 'M08Q1',
      question: 'A muting rule is active when a Critical incident opens. What happens?',
      options: [
        'The incident is prevented from opening',
        'The incident and issue open normally, but notifications are suppressed',
        'The incident opens but is auto-acknowledged',
        'The condition is temporarily disabled',
      ],
      correctIndex: 1,
      explanation:
        'Muting does not prevent incidents or issues from being created — it only suppresses notifications. The full alert lifecycle still runs. This means muted incidents are still visible in the UI and still affect issue state.',
    },
    {
      id: 'M08Q2',
      question: 'Your maintenance window is 2:00am–4:00am EST (UTC-5). You configure a muting rule with a fixed time range. What UTC times should you enter?',
      options: ['2:00–4:00 UTC', '7:00–9:00 UTC', '21:00–23:00 UTC', '19:00–21:00 UTC'],
      correctIndex: 1,
      explanation:
        'EST is UTC-5, so 2:00am EST = 7:00am UTC and 4:00am EST = 9:00am UTC. Timezone mistakes are one of the most common muting rule errors — the rule silences alerts at the wrong time or fails to suppress during the actual maintenance window.',
    },
    {
      id: 'M08Q3',
      question: 'A muting rule targets `entity.name = \'prod-db-01\'`. During the muting window, prod-db-02 breaches its threshold. Is its notification suppressed?',
      options: [
        'Yes — muting rules apply to the entire account during their window',
        'No — the rule is attribute-specific and only matches prod-db-01',
        'Yes — if both entities are in the same policy',
        'No — but the incident is auto-acknowledged',
      ],
      correctIndex: 1,
      explanation:
        'Muting rules filter by attributes — only incidents whose attributes match the rule\'s conditions are muted. prod-db-02 does not match `entity.name = \'prod-db-01\'`, so its notification goes through normally.',
    },
    {
      id: 'M08Q4',
      question: 'A muting rule has no expiry date set. What is the operational risk?',
      options: [
        'New Relic auto-expires it after 7 days',
        'It silently suppresses notifications indefinitely — potentially masking real incidents long after the intended maintenance',
        'It becomes read-only and cannot be edited',
        'It causes the associated conditions to stop evaluating',
      ],
      correctIndex: 1,
      explanation:
        'A muting rule without an expiry runs forever. This is one of the most dangerous misconfigurations — a rule created for a one-time maintenance window can silently suppress production alerts for months. Always set an expiry, and include muting rule audits in your quarterly alert health review.',
    },
    {
      id: 'M08Q5',
      question: 'You want to suppress ALL notifications during a company-wide deploy affecting every service. What is the most efficient muting rule configuration?',
      options: [
        'Create one rule per service entity',
        'Create one rule per policy',
        'Create a single muting rule with no condition filters and a fixed expiry time',
        'Disable all workflows temporarily',
      ],
      correctIndex: 2,
      explanation:
        'A muting rule with no attribute filters matches every incident in the account. Combined with a fixed expiry time matching the deploy window, this is the most efficient way to suppress all notifications globally. Disabling workflows also works but is harder to audit and restore.',
    },
  ],

  M09CommonMistakes: [
    {
      id: 'M09Q1',
      question: 'An engineer sets up a threshold condition on CPU percentage for a host. The host\'s infrastructure agent crashes. No alert fires. What was the misconfiguration?',
      options: [
        'The threshold value was set too high',
        'Signal loss detection was not configured — a dead host reports no data, which threshold conditions cannot detect',
        'The policy had no workflow',
        'The condition evaluation window was too long',
      ],
      correctIndex: 1,
      explanation:
        'Threshold conditions require data to evaluate. A crashed agent sends no data, so the condition never runs. Signal loss detection is a separate configuration that fires when a signal goes silent — it is the correct tool for detecting host-down scenarios.',
    },
    {
      id: 'M09Q2',
      question: 'A team migrates from legacy notification channels to workflows. They configure the workflow filter as `issue.priority = \'CRITICAL\'`. Their Warning alerts now produce no notifications. Why?',
      options: [
        'Workflows do not support Warning priority',
        'Warning conditions create MEDIUM priority issues — the CRITICAL filter excludes them',
        'The legacy channels were suppressing Warning alerts too',
        'Workflow enrichment interferes with Warning notifications',
      ],
      correctIndex: 1,
      explanation:
        'This is the most common post-migration issue. Warning thresholds produce MEDIUM priority issues. A workflow filtering on CRITICAL priority will never match them. The fix is to add a second workflow for MEDIUM priority or remove the priority filter entirely.',
    },
    {
      id: 'M09Q3',
      question: 'A condition uses gap-filling with a static value of 0 to monitor error rate (alert when > 5%). The monitored service completely crashes and stops sending data. Does an alert fire?',
      options: [
        'Yes — the crash will cause a spike before silence',
        'No — gap-filling inserts 0% error rate, which is below the threshold',
        'Yes — gap-filling triggers signal loss automatically',
        'No — only if signal loss is also configured',
      ],
      correctIndex: 1,
      explanation:
        'Gap-filling with 0 means a period of silence is evaluated as 0% errors — which is healthy. The condition sees "everything fine" and does not fire. This is a dangerous anti-pattern for error rate conditions. Use signal loss detection alongside, or replace gap-filling with last-known-value.',
    },
    {
      id: 'M09Q4',
      question: 'A muting rule was created for a one-time deployment last quarter. It has no expiry date. What is the likely impact today?',
      options: [
        'No impact — muting rules auto-disable after 30 days',
        'Real production incidents may be silently suppressed with no notification sent',
        'The rule still runs but logs a warning in the audit trail',
        'The associated conditions were disabled along with the rule',
      ],
      correctIndex: 1,
      explanation:
        'Muting rules without expiry dates run indefinitely. A rule targeting a broad entity set or with no filters can silently suppress production incidents for months after its intended use. Regular muting rule audits are part of AQM best practice.',
    },
    {
      id: 'M09Q5',
      question: 'A high-cardinality FACET condition (FACET containerId) is set to "One issue per policy". A deployment causes 50 containers to breach simultaneously. What is the likely impact?',
      options: [
        '50 PagerDuty pages — one per container',
        '1 PagerDuty page with all 50 containers in one issue — but the issue is extremely noisy',
        'The condition is rate-limited and only 10 incidents open',
        '50 separate issues are created regardless of the preference setting',
      ],
      correctIndex: 1,
      explanation:
        '"One issue per policy" collapses all 50 incidents into one issue. You get one notification, but the issue contains 50 incidents all screaming at once — which makes it hard to triage. For high-cardinality FACET conditions, "one issue per condition and signal" with Decisions correlation is a better pattern.',
    },
  ],

  M12StreamingAlerts: [
    {
      id: 'M12Q1',
      question: 'Your alert condition uses a 5-minute aggregation window with a 3-minute evaluation offset. What is the minimum time before a notification can be received after a breach starts?',
      options: ['3 minutes', '5 minutes', '8 minutes', '15 minutes'],
      correctIndex: 2,
      explanation:
        'Total detection latency = aggregation window + evaluation offset. 5 minutes (window) + 3 minutes (offset) = 8 minutes minimum before evaluation completes and a notification can be dispatched.',
    },
    {
      id: 'M12Q2',
      question: 'You are alerting on a Lambda function that is invoked once every 10 minutes. Which evaluation method should you use?',
      options: ['Event Flow', 'Event Timer', 'Cadence', 'Any — they are equivalent for Lambda'],
      correctIndex: 1,
      explanation:
        'Event Timer is designed for sporadic/batched signals. It starts a configurable timer when data arrives and closes the window when the timer expires. Event Flow may leave windows open indefinitely between invocations; Cadence may evaluate empty windows.',
    },
    {
      id: 'M12Q3',
      question: 'A condition monitors `SELECT count(*) FROM Transaction` with gap-filling set to static value 0. Traffic goes to zero after a deploy. Does a "zero traffic" alert fire?',
      options: [
        'Yes — 0 count will breach most thresholds',
        'No — you need a separate signal loss condition for zero traffic',
        'Yes — gap-filling triggers signal loss automatically',
        'It depends on the evaluation method',
      ],
      correctIndex: 1,
      explanation:
        'Gap-filling inserts 0 as the value for empty windows. If your threshold is "count < 10 = alert", then yes. But if you are only alerting on error conditions, a count of 0 is below every threshold. Signal loss detection is the correct tool to detect complete traffic silence.',
    },
    {
      id: 'M12Q4',
      question: 'What is the purpose of signal loss detection\'s "Resolve existing incident" option?',
      options: [
        'It closes the signal loss incident when data returns',
        'It closes an existing threshold incident when the signal disappears — preventing stuck-open incidents after a service is decommissioned',
        'It resolves all incidents in the same policy',
        'It triggers a runbook to restart the service',
      ],
      correctIndex: 1,
      explanation:
        '"Resolve existing incident" closes an active threshold incident when the signal goes silent. This handles the decommission scenario: if a service is shut down intentionally, its threshold incident would otherwise stay open forever since the signal never recovers.',
    },
    {
      id: 'M12Q5',
      question: 'A sliding window condition uses a 5-minute window with a 1-minute slide interval. How often does evaluation occur?',
      options: ['Every 5 minutes', 'Every 1 minute', 'Every 30 seconds', 'Continuously'],
      correctIndex: 1,
      explanation:
        'The slide interval determines evaluation frequency. A 1-minute slide means the engine evaluates every minute, each time looking back at the last 5 minutes of data. This provides near-real-time evaluation while smoothing out brief spikes.',
    },
  ],

  M13Decisions: [
    {
      id: 'M13Q1',
      question: 'A database failure causes 8 upstream services to alert simultaneously, creating 8 separate issues. Decisions (correlation) is enabled. What is the expected outcome?',
      options: [
        '8 separate PagerDuty pages — one per issue',
        'All 8 issues are merged into one correlated issue with one notification',
        'The 7 lower-priority issues are suppressed',
        'Only the first issue notifies; the rest are deduplicated',
      ],
      correctIndex: 1,
      explanation:
        'Decisions merges related incidents/issues into a single correlated issue. Instead of 8 pages, on-call receives one notification for the correlated issue, which contains all 8 incidents as entries. This is the core value proposition of AIOps correlation.',
    },
    {
      id: 'M13Q2',
      question: 'A correlated issue contains a CRITICAL and a HIGH priority incident. The CRITICAL incident closes. What is the issue\'s priority now?',
      options: ['CRITICAL still', 'HIGH', 'MEDIUM', 'Resolved'],
      correctIndex: 1,
      explanation:
        'Issue priority dynamically reflects the highest priority among currently active incidents. When the CRITICAL incident closes, the highest remaining priority is HIGH, so the issue priority drops to HIGH. The issue itself remains open because the HIGH incident is still active.',
    },
    {
      id: 'M13Q3',
      question: 'What is the correlation grace period and why does it add notification latency?',
      options: [
        'The time NR waits for you to acknowledge before escalating — it adds latency by design',
        'The window after an incident opens during which related incidents can be merged — notifications are held until it expires',
        'The delay between incident open and issue creation',
        'The time ML models need to retrain after feedback',
      ],
      correctIndex: 1,
      explanation:
        'The grace period is a collection window that allows related incidents to arrive and be merged before notifications are sent. Without it, the first incident would notify immediately before related incidents arrive. The tradeoff is that all notifications are delayed by at least the grace period duration.',
    },
    {
      id: 'M13Q4',
      question: 'You accept a correlation in the "Was this correlation helpful?" prompt. What is the direct effect?',
      options: [
        'The correlated issue is closed',
        'The ML model is reinforced to correlate this pattern more confidently in future',
        'The rule is promoted to a user-defined decision',
        'The grace period is shortened for this incident type',
      ],
      correctIndex: 1,
      explanation:
        'Accepting/rejecting correlations directly feeds the ML training loop. Accept = the model increases confidence for this pattern. Reject = the model penalizes this pattern. Consistent rejection will eventually prevent the model from making this correlation at all.',
    },
    {
      id: 'M13Q5',
      question: 'What is required for topology-based correlation to work between two services?',
      options: [
        'Both services must be in the same New Relic account',
        'Both services must have established entity relationships in the NR entity graph',
        'Both services must share the same alert policy',
        'Applied Intelligence must be enabled on both services individually',
      ],
      correctIndex: 1,
      explanation:
        'Topology correlation uses the NR entity relationship graph to infer upstream/downstream causality. If entities don\'t have established relationships (via APM distributed tracing, infrastructure agent tagging, or manual configuration), the topology engine has no graph to traverse.',
    },
  ],

  M14AlertQuality: [
    {
      id: 'M14Q1',
      question: 'Your AQM dashboard shows 40% of incidents were open longer than 2 hours last week. What does this most likely indicate?',
      options: [
        'Your thresholds are set too low',
        'Alerts are chronic, unactionable, or have no owner/runbook — they fire but nothing gets done',
        'Your evaluation windows are too long',
        'Your workflow deduplication is not working',
      ],
      correctIndex: 1,
      explanation:
        'A high percentage of long-duration incidents indicates alerts that cannot be resolved quickly — either because there\'s no runbook, no owner, the condition monitors something that\'s permanently in a bad state, or the alert requires a manual ritual rather than a real fix.',
    },
    {
      id: 'M14Q2',
      question: 'An alert condition fires every day at 9am during peak traffic, closes by 9:15am, and has done so for 6 months. What anti-pattern is this?',
      options: [
        'Signal loss', 'Alert shadowing', 'Flapping', 'Toil alert',
      ],
      correctIndex: 2,
      explanation:
        'This is a flapping alert — specifically a threshold set too close to the normal peak value. Every morning peak pushes the metric over the line, then traffic normalizes and it closes. Six months of this means it was never reviewed. Fix: raise the threshold or switch to a baseline condition.',
    },
    {
      id: 'M14Q3',
      question: 'You launch a new microservice to production with no alert conditions configured. Six hours later it silently starts returning 500 errors at 30%. When did the on-call team find out?',
      options: [
        'Immediately — New Relic auto-creates conditions for new services',
        'After the next synthetic monitor check',
        'They didn\'t — there were no conditions to fire',
        'After the error budget was exhausted',
      ],
      correctIndex: 2,
      explanation:
        'Coverage gaps are as dangerous as noisy alerts. New Relic does not auto-create conditions. Without at least one Critical condition on the service, no amount of metric ingestion will produce an alert. This is why alert condition creation should be a required step in service launch checklists.',
    },
    {
      id: 'M14Q4',
      question: 'The AQM metric "% incidents not acknowledged" is at 35%. What does this most likely indicate?',
      options: [
        'Engineers are resolving incidents without acknowledging them first — process gap',
        'Alert fatigue — engineers are ignoring or muting pages rather than engaging with them',
        'The workflow is not delivering notifications to the right channel',
        'The incident acknowledgement button is broken',
      ],
      correctIndex: 1,
      explanation:
        'A high % not acknowledged is the clearest signal of alert fatigue. Engineers stop engaging with alerts when there are too many, too noisy, or consistently unactionable. Reducing incident volume, fixing flapping alerts, and adding runbooks are the primary remedies.',
    },
    {
      id: 'M14Q5',
      question: 'Which of the following is the BEST description of a "toil alert"?',
      options: [
        'An alert that fires for an unknown reason',
        'An alert that requires repeated manual intervention but never leads to a permanent fix',
        'An alert created by copying an existing condition without review',
        'An alert that fires too frequently due to a low threshold',
      ],
      correctIndex: 1,
      explanation:
        'Toil alerts demand a manual ritual every time they fire (restart this, clear that) but the underlying cause is never resolved. They mask product bugs, build bad habits, and erode on-call quality. The fix is either to automate the remediation or to track it as a bug and fix the root cause.',
    },
  ],
};

export default quizzes;
