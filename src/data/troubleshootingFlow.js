/**
 * Troubleshooting decision tree.
 * Each node is either:
 *   type: 'question' — has `options` array, each option has { label, next }
 *   type: 'resolution' — terminal node with cause, fix, optional module reference
 */
const flow = {

  /* ── ROOT ─────────────────────────────────────────── */
  root: {
    type: 'question',
    question: 'What is the alert problem you are investigating?',
    context: 'Select the symptom that most closely describes the issue.',
    options: [
      { label: 'Not receiving notifications at all',             next: 'no-notif-q1' },
      { label: 'Receiving too many notifications',               next: 'too-many-q1' },
      { label: 'Alert condition never opens an incident',        next: 'never-fires-q1' },
      { label: 'Incident opens then closes immediately',         next: 'closes-early-q1' },
      { label: 'Notifications going to the wrong destination',   next: 'wrong-dest-q1' },
    ],
  },

  /* ══════════════════════════════════════════════════
     PATH A: Not receiving notifications
  ══════════════════════════════════════════════════ */
  'no-notif-q1': {
    type: 'question',
    question: 'Is there an open Issue visible in Alerts > Issues?',
    context: 'Navigate to one.newrelic.com → Alerts → Issues & Activity. Search for the entity or policy name. Check if an issue exists and is currently open.',
    options: [
      { label: 'Yes — an issue exists and is open',   next: 'no-notif-q2' },
      { label: 'No — no issue exists',               next: 'no-issue-q1' },
    ],
  },

  'no-notif-q2': {
    type: 'question',
    question: 'Does the issue display a "Muted" badge in the issue header?',
    context: 'Open the issue details page. A muted issue shows a "Muted" indicator near the issue title or status.',
    options: [
      { label: 'Yes — the issue is muted',            next: 'resolve-muted' },
      { label: 'No — no muted indicator',             next: 'no-notif-q3' },
    ],
  },

  'no-notif-q3': {
    type: 'question',
    question: 'Does a Workflow exist whose filter matches this issue?',
    context: 'Go to Alerts → Workflows. Review each workflow\'s filter expression. Check if any filter matches the issue\'s priority, policy name, or entity tags.',
    options: [
      { label: 'No workflow filter matches this issue',          next: 'resolve-no-workflow' },
      { label: 'A workflow exists and its filter matches',       next: 'no-notif-q4' },
    ],
  },

  'no-notif-q4': {
    type: 'question',
    question: 'Does the workflow\'s trigger include the correct issue state?',
    context: 'Open the matching workflow. Check which states trigger it: Issue Created, Issue Activated, Issue Acknowledged, Issue Resolved. The trigger must include the state the issue is currently in.',
    options: [
      { label: 'Trigger state does not match current issue state',  next: 'resolve-wrong-trigger' },
      { label: 'Trigger state is correct',                          next: 'no-notif-q5' },
    ],
  },

  'no-notif-q5': {
    type: 'question',
    question: 'Check the workflow\'s run history. Are there failed executions with errors?',
    context: 'In the workflow detail page, click "Run history." Look for red/failed executions and read the error message.',
    options: [
      { label: 'Yes — failed runs with error messages',     next: 'resolve-dest-error' },
      { label: 'No failed runs — or no runs at all',        next: 'resolve-no-runs' },
    ],
  },

  /* -- Sub-path: no issue exists -------------------- */
  'no-issue-q1': {
    type: 'question',
    question: 'Does the condition exist in Alerts > Alert Conditions?',
    context: 'Go to Alerts → Alert Conditions (Policies). Search for the expected condition. Verify it has not been deleted.',
    options: [
      { label: 'Condition does not exist (was deleted)',    next: 'resolve-deleted-condition' },
      { label: 'Condition exists',                          next: 'no-issue-q2' },
    ],
  },

  'no-issue-q2': {
    type: 'question',
    question: 'Does the NRQL query return data when run in the Query Builder?',
    context: 'Copy the condition\'s NRQL query. Run it in one.newrelic.com → Query your data. Verify it returns a numeric result — not null or empty.',
    options: [
      { label: 'Query returns no data (null / empty)',     next: 'resolve-no-signal' },
      { label: 'Query returns numeric data',               next: 'no-issue-q3' },
    ],
  },

  'no-issue-q3': {
    type: 'question',
    question: 'Does the current value returned by the query actually exceed the configured threshold?',
    context: 'Note the value returned by the NRQL query. Compare it against the Critical threshold in the condition settings.',
    options: [
      { label: 'Value is within the threshold (no breach)',     next: 'resolve-threshold-not-breached' },
      { label: 'Value clearly exceeds the threshold',          next: 'resolve-duration-check' },
    ],
  },

  /* ══════════════════════════════════════════════════
     PATH B: Too many notifications
  ══════════════════════════════════════════════════ */
  'too-many-q1': {
    type: 'question',
    question: 'Are you receiving many notifications from a single outage event?',
    context: 'Determine whether the flood happens all at once during one incident, or if notifications keep repeating over a period of time.',
    options: [
      { label: 'Yes — dozens of notifications from one event',     next: 'too-many-q2' },
      { label: 'Notifications keep repeating over time',           next: 'too-many-q3' },
    ],
  },

  'too-many-q2': {
    type: 'question',
    question: 'What is the policy\'s Incident Creation Preference?',
    context: 'Open the policy settings. Under "Incident creation preference," note which option is selected.',
    options: [
      { label: '"One issue per incident"',                         next: 'resolve-pref-per-incident' },
      { label: '"One issue per condition" or "One issue per policy"', next: 'too-many-q2b' },
    ],
  },

  'too-many-q2b': {
    type: 'question',
    question: 'Does the condition\'s NRQL query use a FACET clause?',
    context: 'Open the condition. In the NRQL query, check for a FACET keyword (e.g., FACET host, FACET service). FACET creates one incident per unique value.',
    options: [
      { label: 'Yes — NRQL uses FACET',              next: 'resolve-facet-noise' },
      { label: 'No FACET clause',                    next: 'resolve-multiple-workflows' },
    ],
  },

  'too-many-q3': {
    type: 'question',
    question: 'How many state triggers are enabled on the workflow?',
    context: 'Open the workflow. Check how many trigger states are active: Issue Created, Issue Activated, Issue Acknowledged, Issue Resolved.',
    options: [
      { label: 'All 4 states are enabled',           next: 'resolve-too-many-triggers' },
      { label: 'Only 1 or 2 states',                 next: 'resolve-workflow-loop' },
    ],
  },

  /* ══════════════════════════════════════════════════
     PATH C: Alert condition never fires
  ══════════════════════════════════════════════════ */
  'never-fires-q1': {
    type: 'question',
    question: 'Does the NRQL query return data in the Query Builder?',
    context: 'Run the condition\'s NRQL in one.newrelic.com → Query your data. The query must return a numeric result for the condition to evaluate.',
    options: [
      { label: 'Query returns null or no data',       next: 'resolve-no-signal' },
      { label: 'Query returns data',                  next: 'never-fires-q2' },
    ],
  },

  'never-fires-q2': {
    type: 'question',
    question: 'Is the current signal value actually exceeding the threshold?',
    context: 'Note the value returned by the query. Compare it against the condition\'s Critical threshold value.',
    options: [
      { label: 'No — value is below the threshold',  next: 'resolve-threshold-not-breached' },
      { label: 'Yes — value exceeds the threshold',  next: 'never-fires-q3' },
    ],
  },

  'never-fires-q3': {
    type: 'question',
    question: 'What is the condition\'s threshold duration set to?',
    context: 'In the condition settings, find the threshold duration — "at least X minutes." This is how long the signal must sustain a breach before an incident opens.',
    options: [
      { label: 'More than 10 minutes',                next: 'resolve-duration-too-long' },
      { label: '5 minutes or less',                   next: 'resolve-eval-window' },
    ],
  },

  /* ══════════════════════════════════════════════════
     PATH D: Incident opens then closes immediately
  ══════════════════════════════════════════════════ */
  'closes-early-q1': {
    type: 'question',
    question: 'Does the signal have data gaps around the time the incident opened?',
    context: 'In the incident details, look at the signal chart. Check for breaks or flat lines in the data around the incident open timestamp.',
    options: [
      { label: 'Yes — there are gaps or missing data points',   next: 'closes-early-q2' },
      { label: 'No — signal data is continuous',                next: 'closes-early-q3' },
    ],
  },

  'closes-early-q2': {
    type: 'question',
    question: 'What is the condition\'s Fill Option set to?',
    context: 'In the condition settings, find the Fill Option under advanced settings. Options: None, Last known value, Static value (0), or Close violation on data loss.',
    options: [
      { label: '"Close violation on data loss"',                 next: 'resolve-fill-close' },
      { label: 'Other fill option (None, last known, or static)', next: 'resolve-data-pipeline' },
    ],
  },

  'closes-early-q3': {
    type: 'question',
    question: 'What is the "Close incidents after" timeout configured to?',
    context: 'In the condition settings, check the "Close open incidents after" field. The default is 24 hours. Very short values force incidents to close prematurely.',
    options: [
      { label: 'Less than 1 hour',                              next: 'resolve-auto-close-short' },
      { label: '1 hour or more',                                next: 'resolve-signal-recovery' },
    ],
  },

  /* ══════════════════════════════════════════════════
     PATH E: Notifications to wrong destination
  ══════════════════════════════════════════════════ */
  'wrong-dest-q1': {
    type: 'question',
    question: 'Is there a Workflow routing notifications for this policy?',
    context: 'Go to Alerts → Workflows. Check if a workflow exists with a filter matching this policy or its issues.',
    options: [
      { label: 'Yes — a workflow is routing it',                     next: 'wrong-dest-q2' },
      { label: 'No — using legacy Notification Channel on policy',   next: 'resolve-legacy-channel' },
    ],
  },

  'wrong-dest-q2': {
    type: 'question',
    question: 'Is the workflow\'s filter too broad — matching more issues than intended?',
    context: 'Review the workflow filter. A missing filter or one that only checks priority (e.g., "priority = CRITICAL") will match issues from every policy in the account.',
    options: [
      { label: 'No filter, or filter is very broad',                 next: 'resolve-broad-filter' },
      { label: 'Filter looks correctly scoped',                      next: 'resolve-multiple-workflows-2' },
    ],
  },

  /* ══════════════════════════════════════════════════
     RESOLUTION NODES
  ══════════════════════════════════════════════════ */
  'resolve-muted': {
    type: 'resolution',
    severity: 'medium',
    title: 'Issue is suppressed by a Muting Rule',
    cause: 'A Muting Rule tag filter matches this issue. When an issue is muted, all workflow executions for that issue are suppressed — no notifications are delivered.',
    fix: '1. Go to Alerts → Muting Rules.\n2. Find the rule whose tag filter matches the entity or policy associated with this issue.\n3. Either disable the rule, adjust its tag filter to be more specific, or update its schedule so it does not cover the current time.',
    reference: 'M08MutingRules',
    referenceLabel: 'Module 08 — Muting Rules',
  },

  'resolve-no-workflow': {
    type: 'resolution',
    severity: 'high',
    title: 'No Workflow matches this issue',
    cause: 'Issues do not send notifications by themselves. A Workflow must exist whose filter matches the issue\'s properties. If no workflow matches, the issue is silently created but nothing is delivered.',
    fix: '1. Go to Alerts → Workflows → Create a new workflow.\n2. Set a trigger: at minimum "Issue Created."\n3. Add a filter matching the policy or priority. Example: policy.name = \'Production Services\'.\n4. Connect a Destination (Slack, PagerDuty, etc.).\n5. Save and test with a new issue.',
    reference: 'M06Workflows',
    referenceLabel: 'Module 06 — Workflows',
  },

  'resolve-wrong-trigger': {
    type: 'resolution',
    severity: 'medium',
    title: 'Workflow trigger state does not match the issue\'s current state',
    cause: 'Workflows fire only when an issue transitions to one of the states configured in the trigger. If a workflow only has "Issue Resolved" as a trigger but the issue was just created, the workflow never fires.',
    fix: '1. Open the workflow.\n2. In the Trigger section, enable the state(s) that apply: Issue Created and/or Issue Activated for new/escalating alerts.\n3. Save the workflow.',
    reference: 'M06Workflows',
    referenceLabel: 'Module 06 — Workflows',
  },

  'resolve-dest-error': {
    type: 'resolution',
    severity: 'high',
    title: 'Destination authentication failure',
    cause: 'The workflow is executing correctly, but delivery to the destination is failing. The most common cause is an expired API token, revoked OAuth access, or a Slack integration that was removed.',
    fix: '1. Go to Alerts → Destinations.\n2. Find the destination used by this workflow.\n3. Click "Test connection." Read the error message — it usually specifies whether it\'s a 401 (auth) or 404 (channel not found) error.\n4. Re-authenticate or update the credential.\n5. Re-run the workflow test.',
    reference: 'M07Destinations',
    referenceLabel: 'Module 07 — Destinations',
  },

  'resolve-no-runs': {
    type: 'resolution',
    severity: 'medium',
    title: 'Workflow has never executed for this issue',
    cause: 'If there are no runs at all, the workflow filter does not actually match the issue — even if it appears to. A common cause is a case-sensitive mismatch in the filter (e.g., "CRITICAL" vs "Critical") or a tag that is not present on the entity.',
    fix: '1. Open the issue and note every property: priority, policy name, all entity tags.\n2. Compare each property against the workflow filter expression exactly.\n3. Check for case sensitivity, whitespace, or missing tags on the monitored entity.\n4. Adjust the filter to match the actual issue properties.',
    reference: 'M06Workflows',
    referenceLabel: 'Module 06 — Workflows',
  },

  'resolve-deleted-condition': {
    type: 'resolution',
    severity: 'high',
    title: 'The alert condition was deleted',
    cause: 'The condition no longer exists. Deleting a condition stops new incidents from being created, but does not auto-close any open incidents or issues it had previously opened.',
    fix: 'If the condition was deleted intentionally:\n1. Manually close any remaining open incidents via Alerts → Issues.\n\nIf it was deleted by mistake:\n1. Recreate the condition from scratch in the appropriate policy.',
    reference: 'M04Incidents',
    referenceLabel: 'Module 04 — Incidents',
  },

  'resolve-no-signal': {
    type: 'resolution',
    severity: 'high',
    title: 'No signal data — the NRQL query returns nothing',
    cause: 'The condition cannot evaluate if the query returns no data. Possible causes: the agent is not reporting, the entity name or attribute changed, the time range has no data, or the WHERE clause is filtering out all results.',
    fix: '1. Run the query in Query Builder without the WHERE filter — check if data exists.\n2. Verify the agent is running and reporting data (check entity health in APM/Infrastructure).\n3. Check for attribute name changes — look at recent data samples.\n4. Adjust the WHERE clause or entity filter in the condition.',
    reference: 'M03Conditions',
    referenceLabel: 'Module 03 — Alert Conditions',
  },

  'resolve-threshold-not-breached': {
    type: 'resolution',
    severity: 'low',
    title: 'Signal is within threshold — no breach, no incident',
    cause: 'The condition is working correctly. The current signal value does not exceed the configured threshold, so no incident is opened. This is expected behavior.',
    fix: 'If you believe the threshold should have been crossed:\n1. Verify the threshold value matches the intended SLO (e.g., "above 2 seconds" vs "above 2000ms" — check units).\n2. Review the aggregation function — average() may smooth out spikes that percentile(95) would catch.\n3. Consider lowering the threshold or switching to anomaly detection.',
    reference: 'M03Conditions',
    referenceLabel: 'Module 03 — Alert Conditions',
  },

  'resolve-duration-check': {
    type: 'resolution',
    severity: 'medium',
    title: 'Signal exceeds threshold but duration not yet sustained',
    cause: 'The condition requires the signal to exceed the threshold for a minimum duration (e.g., "at least 5 minutes") before opening an incident. If the breach is transient, or you are looking too soon, the incident has not opened yet.',
    fix: 'Wait for the full threshold duration and monitor the condition\'s evaluation. If spikes are too brief to trigger:\n1. Reduce the threshold duration.\n2. Or consider using a shorter evaluation window to capture transient spikes.',
    reference: 'M03Conditions',
    referenceLabel: 'Module 03 — Alert Conditions',
  },

  'resolve-pref-per-incident': {
    type: 'resolution',
    severity: 'medium',
    title: 'Incident Creation Preference set to "One issue per incident"',
    cause: 'When the policy is set to "One issue per incident," every single incident becomes its own issue and triggers its own workflow execution. During an outage affecting many entities, this creates a storm of individual notifications.',
    fix: '1. Go to the policy settings.\n2. Change Incident Creation Preference to "One issue per condition" (groups all incidents from the same condition) or "One issue per policy" (maximum grouping).\n3. Consider which level of granularity your team actually needs during an outage.',
    reference: 'M02Policies',
    referenceLabel: 'Module 02 — Alert Policies',
  },

  'resolve-facet-noise': {
    type: 'resolution',
    severity: 'medium',
    title: 'FACET clause creating one incident per entity',
    cause: 'The NRQL condition uses FACET (e.g., FACET host or FACET service). This causes the condition to evaluate independently per entity and open a separate incident for each one that violates the threshold. Combined with "One issue per condition," multiple entities generate multiple issues.',
    fix: 'Two options:\n1. Change the policy Incident Creation Preference to "One issue per condition" — all incidents from this condition collapse into one issue.\n2. Or remove the FACET clause and use aggregate evaluation — the condition fires once when the average/sum across all entities crosses the threshold.',
    reference: 'M03Conditions',
    referenceLabel: 'Module 03 — Alert Conditions',
  },

  'resolve-multiple-workflows': {
    type: 'resolution',
    severity: 'medium',
    title: 'Multiple workflows matching the same issue',
    cause: 'More than one workflow has a filter that matches this issue. Each matching workflow fires independently, resulting in duplicate notifications across different destinations.',
    fix: '1. Audit all workflows and their filters.\n2. Make filters more specific — add policy name or team tag conditions.\n3. Merge duplicate workflows if they route to the same destination.',
    reference: 'M06Workflows',
    referenceLabel: 'Module 06 — Workflows',
  },

  'resolve-too-many-triggers': {
    type: 'resolution',
    severity: 'low',
    title: 'Workflow triggers on every state change',
    cause: 'The workflow is configured to fire on Issue Created, Activated, Acknowledged, and Resolved. A single issue transitioning through its lifecycle triggers 4 separate notifications.',
    fix: '1. Open the workflow and review the trigger configuration.\n2. Disable states you do not need. For most teams:\n   — Enable: Issue Created (or Activated)\n   — Enable: Issue Resolved (to confirm recovery)\n   — Disable: Issue Acknowledged (optional — for some teams)\n3. Save the workflow.',
    reference: 'M06Workflows',
    referenceLabel: 'Module 06 — Workflows',
  },

  'resolve-workflow-loop': {
    type: 'resolution',
    severity: 'low',
    title: 'Check enrichment query or escalation configuration',
    cause: 'If notifications repeat even with limited triggers, the issue may be re-activating (new incidents being added as entities go in and out of threshold). Alternatively, an escalation policy in PagerDuty or similar is sending repeat pages.',
    fix: '1. Review the issue timeline — check if new incidents are being added after the initial open.\n2. If the entity is flapping (repeatedly crossing the threshold), increase the threshold duration or use a wider evaluation window.\n3. If using PagerDuty, check escalation policies — they may re-page after a timeout independent of New Relic.',
    reference: 'M04Incidents',
    referenceLabel: 'Module 04 — Incidents',
  },

  'resolve-duration-too-long': {
    type: 'resolution',
    severity: 'low',
    title: 'Threshold duration is too long for the signal pattern',
    cause: 'The condition requires the signal to sustain the breach for a long time (10+ minutes). If the issue is transient (spikes that recover within minutes), the required duration is never reached and the incident never opens.',
    fix: '1. Reduce the threshold duration to match the expected spike pattern.\n2. As a guideline: use 1-2 minutes for critical services, 5 minutes for non-critical.\n3. Be aware that shorter durations increase sensitivity and may cause flapping on noisy signals.',
    reference: 'M03Conditions',
    referenceLabel: 'Module 03 — Alert Conditions',
  },

  'resolve-eval-window': {
    type: 'resolution',
    severity: 'low',
    title: 'Evaluation window may be smoothing the signal',
    cause: 'The evaluation window controls how much data NRQL aggregates. A 30-minute window uses average() over 30 minutes — a brief spike gets averaged out and may never push the result above the threshold.',
    fix: '1. Shorten the evaluation window (e.g., from 30m to 5m) to make the condition more sensitive to recent spikes.\n2. Or change the aggregation function from average() to percentile(duration, 95) to catch high-end outliers instead of the average.',
    reference: 'M03Conditions',
    referenceLabel: 'Module 03 — Alert Conditions',
  },

  'resolve-fill-close': {
    type: 'resolution',
    severity: 'medium',
    title: 'Fill option "Close violation on data loss" is closing the incident',
    cause: 'The condition\'s Fill Option is set to "Close violation on data loss." When the signal has even a brief gap (e.g., an agent restart, a network hiccup, or a deployment), the condition interprets missing data as recovery and closes the incident automatically.',
    fix: '1. Open the condition settings.\n2. Change the Fill Option to "Last known value" — the last observed value is used to fill gaps, keeping the incident open through brief outages.\n3. Only use "Close on data loss" when signal absence genuinely means the system is healthy (e.g., the service was intentionally shut down).',
    reference: 'M03Conditions',
    referenceLabel: 'Module 03 — Alert Conditions',
  },

  'resolve-data-pipeline': {
    type: 'resolution',
    severity: 'high',
    title: 'Data pipeline gap causing premature closure',
    cause: 'The signal is briefly disappearing and the Fill Option is set to something that causes the incident to close on the gap (e.g., Fill with 0, and the threshold is "above X"). When the gap fills with 0, the value drops below threshold and the incident closes.',
    fix: '1. Investigate why the signal has gaps — check agent health, network connectivity, or data ingestion pipeline.\n2. Change Fill Option to "Last known value" to prevent gap-induced closures.\n3. If the entity is being redeployed regularly, consider adding a brief pre-deploy muting rule.',
    reference: 'M08MutingRules',
    referenceLabel: 'Module 08 — Muting Rules',
  },

  'resolve-auto-close-short': {
    type: 'resolution',
    severity: 'medium',
    title: '"Close incidents after" timeout is too short',
    cause: 'The condition has a very short auto-close timeout (e.g., 15 or 30 minutes). Incidents are force-closed after that time regardless of whether the signal has recovered.',
    fix: '1. Open the condition settings.\n2. Increase "Close open incidents after" to a value that gives responders enough time to investigate (minimum 1-2 hours for critical services, 24 hours is the standard default).\n3. Avoid setting this too low unless you specifically need short incident windows.',
    reference: 'M04Incidents',
    referenceLabel: 'Module 04 — Incidents',
  },

  'resolve-signal-recovery': {
    type: 'resolution',
    severity: 'low',
    title: 'Signal genuinely recovered — incident correctly closed',
    cause: 'The signal returned below the threshold shortly after the incident opened. This is correct behavior. The condition closes the incident when the breach is no longer sustained.',
    fix: 'If you believe the closure was premature:\n1. Check the signal chart in the incident details — verify the value did return below threshold.\n2. If the signal is flapping (crossing threshold repeatedly), increase the threshold duration or smooth the evaluation window.\n3. If this is a known transient pattern, consider a wider evaluation window to prevent alert fatigue.',
    reference: 'M03Conditions',
    referenceLabel: 'Module 03 — Alert Conditions',
  },

  'resolve-legacy-channel': {
    type: 'resolution',
    severity: 'medium',
    title: 'Legacy Notification Channel routing to unintended destination',
    cause: 'The routing is done via a legacy Notification Channel attached directly to the policy (pre-2022 model). Legacy channels are not controlled by Workflows. If the channel was recently changed or its credentials are stale, it may route to the wrong place.',
    fix: '1. Go to the policy settings → Notification channels and review what is attached.\n2. The recommended fix is to migrate to Workflows: create a workflow with the correct destination, then detach or remove the legacy channel.\n3. Legacy channels cannot be filtered by priority, tags, or entity — Workflows provide full control.',
    reference: 'M06Workflows',
    referenceLabel: 'Module 06 — Workflows',
  },

  'resolve-broad-filter': {
    type: 'resolution',
    severity: 'medium',
    title: 'Workflow filter is too broad — matching unintended issues',
    cause: 'A workflow with no filter, or a filter that only checks priority, matches every issue of that priority in the entire account — not just the intended policy or team. This routes alerts from unrelated policies to the same destination.',
    fix: '1. Open the workflow and narrow the filter.\n2. Add a policy name condition: policy.name = \'My Service\'.\n3. Or use entity tags: tags.team = \'platform\'.\n4. Test the updated filter against sample issues to confirm scope.',
    reference: 'M06Workflows',
    referenceLabel: 'Module 06 — Workflows',
  },

  'resolve-multiple-workflows-2': {
    type: 'resolution',
    severity: 'low',
    title: 'Two or more workflows both match this issue',
    cause: 'Multiple workflows have overlapping filters. Both execute when the issue is created, sending notifications to both destinations — which may include an unintended one.',
    fix: '1. Audit all workflows. List their filters side by side.\n2. Identify which workflow is routing to the unintended destination.\n3. Either make that workflow\'s filter more specific (add policy name or team tag), or disable it if it is a duplicate.',
    reference: 'M06Workflows',
    referenceLabel: 'Module 06 — Workflows',
  },
};

export default flow;
