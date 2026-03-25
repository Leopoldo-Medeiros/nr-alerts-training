import ModuleQuiz from '../components/interactive/ModuleQuiz.jsx';
export default function M14AlertQuality({ onQuizComplete, quizScore }) {
  return (
    <article className="module-section fade-in">
      <p className="eyebrow">Module 14</p>
      <h1 className="section-title">Alert Quality Management</h1>
      <p className="section-lead">
        An alert configuration that fires constantly is worse than no alerts at all — engineers learn
        to ignore it. Alert Quality Management (AQM) is the practice of measuring, improving, and
        maintaining the signal-to-noise ratio of your alerting system so that every page is actionable.
      </p>

      <h2>Why Alert Quality Deteriorates</h2>
      <p>
        Alert quality degrades over time for predictable reasons:
      </p>
      <ul>
        <li><strong>Threshold drift</strong> — thresholds set at launch never get reviewed as system behavior evolves.</li>
        <li><strong>Ownership loss</strong> — conditions get orphaned when engineers leave or teams reorganize.</li>
        <li><strong>Copy-paste sprawl</strong> — conditions get duplicated across environments without review.</li>
        <li><strong>Fear of deletion</strong> — no one wants to delete an alert in case it was there for a reason.</li>
        <li><strong>Missing coverage</strong> — new services launch without corresponding alert conditions.</li>
      </ul>

      <h2>The AQM Methodology</h2>
      <p>
        New Relic's AQM methodology defines four core metrics to measure alert health:
      </p>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">Incident volume</span><span className="prop-val">Total number of incidents per week. High volume = noise or low thresholds.</span></div>
        <div className="prop-row"><span className="prop-key">Incident duration</span><span className="prop-val">Average time from incident open to close. Long duration = missing runbooks or no owner.</span></div>
        <div className="prop-row"><span className="prop-key">% over 2 hours</span><span className="prop-val">Fraction of incidents open longer than 2 hours. A high % indicates chronic, unactionable alerts.</span></div>
        <div className="prop-row"><span className="prop-key">% not acknowledged</span><span className="prop-val">Fraction of incidents that are never acknowledged. High % = alert fatigue, engineers ignoring pages.</span></div>
      </div>
      <p>
        These metrics are available natively in New Relic via the <code>NrAiIncident</code> and
        <code>NrAiIssue</code> event types. You can build an AQM dashboard by querying:
      </p>
      <pre className="code-block">{`-- Incident volume by week
SELECT count(*) FROM NrAiIncident
WHERE event = 'open'
TIMESERIES 1 week SINCE 8 weeks ago

-- Average incident duration (minutes)
SELECT average(durationSeconds) / 60 AS 'avg minutes'
FROM NrAiIncident WHERE event = 'close' SINCE 4 weeks ago

-- % incidents over 2 hours
SELECT percentage(count(*), WHERE durationSeconds > 7200)
FROM NrAiIncident WHERE event = 'close' SINCE 4 weeks ago

-- % not acknowledged
SELECT percentage(count(*), WHERE acknowledgedAt IS NULL)
FROM NrAiIncident WHERE event = 'close' SINCE 4 weeks ago`}</pre>

      <h2>Alert Noise Anti-Patterns</h2>

      <h3>Flapping Alerts</h3>
      <p>
        A flapping alert oscillates between open and closed repeatedly — often every few minutes — because
        the threshold is set too close to normal operating values. This generates rapid-fire incident
        cycles and is a leading cause of alert fatigue.
      </p>
      <p><strong>Fix:</strong> Raise the threshold, add a consecutive evaluation requirement (e.g., breach
        for 3 of 5 minutes), or switch to a baseline condition.</p>

      <h3>Always-On Incidents</h3>
      <p>
        Conditions where incidents are perpetually open — often for weeks. Either the threshold is
        unachievable, the system has a known baseline problem that's accepted, or no one owns the alert.
      </p>
      <p><strong>Fix:</strong> Adjust the threshold to reflect reality, add a muting rule if the issue
        is known and tracked elsewhere, or delete the condition if it provides no value.</p>

      <h3>Duplicate Conditions</h3>
      <p>
        Multiple conditions monitoring the same signal with slightly different thresholds. Common in
        organizations where each team creates their own alerts without a central registry.
      </p>
      <p><strong>Fix:</strong> Audit conditions by entity type and NRQL query fingerprint. Consolidate
        duplicates into a single condition with clear ownership.</p>

      <h3>Toil Alerts</h3>
      <p>
        Alerts that require manual human intervention every time they fire but never lead to a permanent
        fix. Toil alerts train engineers to perform rituals (restart this service, clear this queue) but
        mask the underlying root cause.
      </p>
      <p><strong>Fix:</strong> Track the recurring action in a runbook. If the fix can be automated,
        build a remediation workflow. If the alert fires &gt;2x per week for the same reason, it's a
        product bug, not an alert problem.</p>

      <h2>Coverage Gaps</h2>
      <p>
        Alert quality also means ensuring you have alerts where you need them. Common coverage gaps:
      </p>
      <ul>
        <li><strong>New services</strong> — freshly deployed services with no alert conditions until they break in production</li>
        <li><strong>Business transactions</strong> — pure infrastructure alerts but no alerts on revenue-critical user flows</li>
        <li><strong>External dependencies</strong> — no alerts on third-party API latency or error rates</li>
        <li><strong>Signal loss</strong> — conditions that threshold-alert but don't detect when the entity goes dark entirely</li>
        <li><strong>Warning-only conditions</strong> — conditions with only a Warning threshold but no Critical, meaning no paging</li>
      </ul>

      <h2>The Alert Health Checklist</h2>
      <p>
        Use this checklist to assess the health of your alert configuration:
      </p>
      <ul>
        <li>Every production service has at least one Critical condition with a defined owner.</li>
        <li>Every condition has a runbook URL pointing to actionable remediation steps.</li>
        <li>No condition has been firing for more than 7 consecutive days (review and fix or mute).</li>
        <li>Incident volume has not increased more than 20% week-over-week without a corresponding change event.</li>
        <li>% incidents not acknowledged is below 10%.</li>
        <li>Every muting rule has an expiry date set.</li>
        <li>All alert policies have at least one workflow configured (not using legacy notification channels).</li>
        <li>Signal loss is configured for all critical entity-monitoring conditions.</li>
      </ul>

      <h2>AQM Baseline Targets</h2>
      <p>
        These are community-derived targets from New Relic's AQM practice. Use them as starting points,
        not hard rules — the right target depends on your environment size and SLO requirements.
      </p>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">Incident volume</span><span className="prop-val">&lt; 10 incidents/entity/week for steady state</span></div>
        <div className="prop-row"><span className="prop-key">Average incident duration</span><span className="prop-val">&lt; 30 minutes for actionable alerts</span></div>
        <div className="prop-row"><span className="prop-key">% over 2 hours</span><span className="prop-val">&lt; 15%</span></div>
        <div className="prop-row"><span className="prop-key">% not acknowledged</span><span className="prop-val">&lt; 5%</span></div>
        <div className="prop-row"><span className="prop-key">Muting rule coverage</span><span className="prop-val">0 muting rules without an expiry date in production</span></div>
      </div>

      <h2>Operationalizing AQM</h2>
      <p>
        AQM is most effective when it becomes a regular operational practice, not a one-time audit:
      </p>
      <ol>
        <li><strong>Weekly review</strong> — review the AQM dashboard every Monday. Flag any metric that
          moved by more than 20% week-over-week.</li>
        <li><strong>Incident retrospectives</strong> — after every P1/P2 incident, check: did alerts fire
          when they should have? Did we get paged for things we shouldn't have?</li>
        <li><strong>Quarterly deep audit</strong> — review all conditions older than 90 days. Delete orphaned
          conditions. Review thresholds against current baselines.</li>
        <li><strong>Launch gates</strong> — make alert condition creation a required step in service launch
          checklists. Block deployment to production until Critical + signal loss conditions exist.</li>
      </ol>

      <h2>Using New Relic's Built-In AQM Features</h2>
      <p>
        New Relic provides several built-in features that support AQM:
      </p>
      <ul>
        <li><strong>Alerts coverage gaps</strong> (Alerts &gt; Alert quality) — surfaces entities with no alert conditions</li>
        <li><strong>Issue feed quality score</strong> — shows correlated vs. uncorrelated issue breakdown</li>
        <li><strong>Incident intelligence overview</strong> — aggregated view of incident volume, duration, and correlation effectiveness</li>
        <li><strong>NrAiIncident & NrAiIssue events</strong> — raw events you can query with NRQL to build custom AQM dashboards</li>
      </ul>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Alert quality degrades naturally over time — it requires active management, not just initial configuration.</li>
        <li>Track four core AQM metrics: incident volume, average duration, % over 2 hours, % not acknowledged.</li>
        <li>The four main noise anti-patterns are flapping, always-on, duplicate, and toil alerts — each has a specific fix.</li>
        <li>Coverage gaps (missing conditions) are as dangerous as noisy conditions — instrument new services before they break.</li>
        <li>Embed AQM into weekly operations and quarterly audits to prevent gradual drift.</li>
      </ul>
      <ModuleQuiz moduleId="M14AlertQuality" onComplete={onQuizComplete} />
    </article>
  );
}
