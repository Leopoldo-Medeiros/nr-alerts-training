import ModuleQuiz from '../components/interactive/ModuleQuiz.jsx';
export default function M13Decisions({ onQuizComplete, quizScore }) {
  return (
    <article className="module-section fade-in">
      <p className="eyebrow">Module 13</p>
      <h1 className="section-title">Decisions & Correlation (AIOps)</h1>
      <p className="section-lead">
        In a large environment, a single infrastructure failure can trigger dozens or hundreds of
        individual incidents. New Relic's Decisions engine (part of Applied Intelligence / AIOps) groups
        related incidents into a single issue — dramatically reducing notification noise and letting
        on-call engineers see the root cause instead of a flood of symptoms.
      </p>

      <h2>The Problem Decisions Solves</h2>
      <p>
        Without correlation, every alert condition produces its own incident and its own issue. A single
        database failure might produce:
      </p>
      <ul>
        <li>An incident from the DB CPU condition</li>
        <li>An incident from the DB connection pool condition</li>
        <li>An incident from each of the 6 upstream services reporting high error rates</li>
        <li>An incident from the synthetic monitors failing</li>
      </ul>
      <p>
        That's potentially 9+ separate PagerDuty pages for one root cause. Decisions merges these into
        a single issue with one notification, giving on-call engineers a consolidated view.
      </p>

      <h2>Architecture: Incidents → Issues → Decisions</h2>
      <p>
        Recall from Module 5 that issues are created from incidents. Without Decisions, each new incident
        either merges into an existing open issue (if it shares the same policy) or creates a new one.
        Decisions adds a cross-policy correlation layer:
      </p>
      <ol>
        <li>An incident opens and is evaluated against all active Decision rules.</li>
        <li>If a rule matches, the incident is merged into an existing issue (or a new merged issue is created).</li>
        <li>The merged issue receives one consolidated notification instead of one per incident.</li>
        <li>The merged issue's priority is the highest severity among all constituent incidents.</li>
      </ol>

      <h2>Types of Decisions</h2>

      <h3>ML-Based Correlation (Automatic)</h3>
      <p>
        New Relic's machine learning model analyzes the historical co-occurrence of incidents to identify
        which conditions tend to fire together. When its confidence is high enough, it automatically
        correlates new incidents without any configuration.
      </p>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">How it learns</span><span className="prop-val">Incident co-occurrence patterns over 13 weeks of history</span></div>
        <div className="prop-row"><span className="prop-key">Confidence threshold</span><span className="prop-val">NR does not publish the exact threshold; it adjusts automatically</span></div>
        <div className="prop-row"><span className="prop-key">Feedback loop</span><span className="prop-val">You can accept or reject correlations — this retrains the model</span></div>
        <div className="prop-row"><span className="prop-key">Requires</span><span className="prop-val">Applied Intelligence add-on; sufficient incident history</span></div>
      </div>

      <h3>User-Defined Decisions (Rules)</h3>
      <p>
        You can create explicit correlation rules in <strong>Alerts &gt; Correlate &gt; Decisions</strong>.
        Each rule defines a set of conditions under which incidents should be merged. Rules consist of:
      </p>
      <ul>
        <li><strong>Input filters</strong> — which incidents to consider (by policy, condition, entity type, tags, etc.)</li>
        <li><strong>Correlation logic</strong> — what constitutes a match (time window, shared attributes, topology)</li>
        <li><strong>Priority</strong> — rules are evaluated in order; first match wins</li>
      </ul>

      <h3>Topology Correlation</h3>
      <p>
        New Relic's service map and entity relationship graph enable topology-based correlation. If a
        downstream service and its upstream dependencies are all alerting simultaneously, the Decisions
        engine can infer that the downstream failure caused the upstream symptoms and merge them.
      </p>
      <div className="callout callout--info">
        <div className="callout-title">Requires entity relationships</div>
        Topology correlation only works when your entities have established relationships in the NR entity
        model. This is automatic for APM services instrumented with NR agents (they trace service-to-service
        calls), but infrastructure entities may need manual tagging or integration-specific setup.
      </div>

      <h2>The Correlation Window (Grace Period)</h2>
      <p>
        When an incident opens, the Decisions engine does not immediately send a notification. It waits
        for a configurable <strong>correlation window</strong> (also called grace period) — typically
        1–5 minutes — to allow related incidents to arrive and be merged into the same issue.
      </p>
      <p>
        After the grace period, if no further merges occur, the issue is finalized and notifications
        are sent. This means there is a built-in notification delay equal to the grace period even for
        the first incident in a new issue.
      </p>
      <div className="callout callout--warn">
        <div className="callout-title">Grace period trades speed for noise reduction</div>
        A 5-minute grace period means your on-call engineer won't hear about a P1 incident for at least
        5 minutes. For organizations that require sub-minute alerting, consider disabling correlation on
        your most critical conditions or setting a short grace period (30–60 seconds) for critical policies.
      </div>

      <h2>What Gets Merged Into a Correlated Issue</h2>
      <p>
        When two incidents are correlated:
      </p>
      <ul>
        <li>They appear as separate incident entries within the same issue</li>
        <li>The issue's priority = highest priority among all constituent incidents</li>
        <li>The issue's start time = earliest incident start time</li>
        <li>A single workflow evaluation runs against the merged issue</li>
        <li>A single notification is sent per workflow match</li>
      </ul>
      <p>
        Importantly, each incident still independently follows its own threshold-recovery logic. An
        incident in a correlated issue can close on its own while the issue remains open because other
        constituent incidents are still active.
      </p>

      <h2>Accepting and Rejecting Correlations</h2>
      <p>
        Every correlated issue shows a <strong>"Was this correlation helpful?"</strong> prompt. Your
        feedback directly retrains the ML model:
      </p>
      <ul>
        <li><strong>Accept</strong> — reinforces this correlation pattern for future similar incidents</li>
        <li><strong>Reject</strong> — penalizes this correlation pattern; if rejected consistently the model stops merging these incident types</li>
      </ul>
      <p>
        This feedback loop is valuable but under-used. Assigning a team member to review correlations
        after each major incident is one of the highest-ROI AIOps practices.
      </p>

      <h2>Decisions vs. Issue Merging by Policy</h2>
      <p>
        Don't confuse Decisions correlation with the basic issue merging behavior controlled by
        <strong>issue creation preference</strong> in a policy (covered in Module 2 and Module 5).
        They operate at different layers:
      </p>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">Policy issue preference</span><span className="prop-val">Merges incidents within the same policy into fewer issues</span></div>
        <div className="prop-row"><span className="prop-key">Decisions</span><span className="prop-val">Merges incidents across different policies and accounts</span></div>
        <div className="prop-row"><span className="prop-key">Scope</span><span className="prop-val">Policy: same policy only. Decisions: cross-policy, cross-account</span></div>
        <div className="prop-row"><span className="prop-key">Configuration</span><span className="prop-val">Policy: dropdown in policy settings. Decisions: separate UI + ML</span></div>
      </div>

      <h2>Correlation in Practice: Common Patterns</h2>

      <h3>Pattern 1: Shared Infrastructure Tags</h3>
      <p>
        Rule: correlate incidents where <code>aws.region</code> = <code>us-east-1</code> and incident
        opens within 2 minutes of another incident with the same tag. Useful for regional outages.
      </p>

      <h3>Pattern 2: Service + Its Dependencies</h3>
      <p>
        Rule: correlate incidents on service "payment-api" with incidents on any entity it calls
        (via topology). This surfaces the dependency failure as the likely root cause.
      </p>

      <h3>Pattern 3: Deployment Correlation</h3>
      <p>
        Rule: correlate all incidents that open within 10 minutes of a deployment event (via change
        tracking) on the same entity. This makes post-deployment regressions easy to spot and roll back.
      </p>

      <h2>Limitations to Know</h2>
      <ul>
        <li>Decisions requires the Applied Intelligence add-on — it is not included in base New Relic One pricing for all tiers.</li>
        <li>The ML model requires at least several weeks of incident history to produce confident correlations.</li>
        <li>Cross-account correlation requires a parent account with Applied Intelligence enabled.</li>
        <li>User-defined rules run in order; a rule that is too broad will match everything and prevent downstream rules from ever firing.</li>
        <li>The grace period adds unavoidable latency — this is a feature, not a bug, but it surprises engineers who expect instant notifications.</li>
      </ul>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Decisions merges related incidents from different policies/accounts into one issue, reducing notification noise.</li>
        <li>Both ML-based (automatic) and user-defined (rule-based) correlation are available.</li>
        <li>The correlation grace period is the source of post-Decision notification latency.</li>
        <li>Your feedback (accept/reject) directly trains the ML model — use it after major incidents.</li>
        <li>Topology correlation is the most powerful pattern but requires a well-instrumented entity graph.</li>
      </ul>
      <ModuleQuiz moduleId="M13Decisions" onComplete={onQuizComplete} />
    </article>
  );
}
