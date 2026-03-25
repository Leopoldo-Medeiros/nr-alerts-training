import { useState } from 'react';
import Badge from '../ui/Badge.jsx';
import '../../styles/interactive.css';

const simData = {
  policy: {
    issues: [
      { variant: 'crit', title: 'Production Services', incidents: 'All 4 incidents (Condition A + B, all hosts)', notif: 1 },
    ],
  },
  condition: {
    issues: [
      { variant: 'crit', title: 'High Error Rate (Condition A)', incidents: 'Incidents: host-01, host-02 error rate', notif: 2 },
      { variant: 'warn', title: 'Slow Response Time (Condition B)', incidents: 'Incidents: host-01, host-03 response time', notif: 2 },
    ],
  },
  incident: {
    issues: [
      { variant: 'crit', title: 'host-01 error rate', incidents: '1 incident', notif: 4 },
      { variant: 'crit', title: 'host-02 error rate', incidents: '1 incident', notif: 4 },
      { variant: 'warn', title: 'host-01 response time', incidents: '1 incident', notif: 4 },
      { variant: 'warn', title: 'host-03 response time', incidents: '1 incident', notif: 4 },
    ],
  },
};

const preferences = [
  { id: 'policy',    title: 'One issue per policy',    desc: 'All incidents collapse into a single issue. Minimum noise.' },
  { id: 'condition', title: 'One issue per condition',  desc: 'Each condition gets its own issue. Moderate grouping.' },
  { id: 'incident',  title: 'One issue per incident',   desc: 'Every incident creates its own issue. Maximum granularity.' },
];

export default function PreferenceSimulator() {
  const [pref, setPref] = useState('policy');

  const data = simData[pref];
  const notifCount = data.issues[0].notif;

  return (
    <div>
      <div className="pref-group">
        {preferences.map((p) => (
          <label key={p.id} className={`pref-option${pref === p.id ? ' pref-option--sel' : ''}`}>
            <input
              type="radio"
              name="pref"
              value={p.id}
              checked={pref === p.id}
              onChange={() => setPref(p.id)}
            />
            <div>
              <div className="pref-title">{p.title}</div>
              <div className="pref-desc">{p.desc}</div>
            </div>
          </label>
        ))}
      </div>

      <div className="sim-wrap">
        <div className="sim-columns">
          {/* LEFT: incidents */}
          <div className="sim-col">
            <div className="sim-col-label">Incidents (4 open)</div>
            <div className="sim-condition-group">
              <div className="sim-condition-name">Condition A — High Error Rate</div>
              <div className="sim-incident">
                <div className="sim-inc-title">
                  <Badge variant="crit">CRITICAL</Badge>
                  &nbsp; host-01 error rate
                </div>
                <div className="sim-inc-sub">Condition A · host-01 · opened 14m ago</div>
              </div>
              <div className="sim-incident">
                <div className="sim-inc-title">
                  <Badge variant="crit">CRITICAL</Badge>
                  &nbsp; host-02 error rate
                </div>
                <div className="sim-inc-sub">Condition A · host-02 · opened 12m ago</div>
              </div>
            </div>
            <div className="sim-condition-group">
              <div className="sim-condition-name">Condition B — Slow Response Time</div>
              <div className="sim-incident">
                <div className="sim-inc-title">
                  <Badge variant="warn">WARNING</Badge>
                  &nbsp; host-01 response time
                </div>
                <div className="sim-inc-sub">Condition B · host-01 · opened 8m ago</div>
              </div>
              <div className="sim-incident">
                <div className="sim-inc-title">
                  <Badge variant="warn">WARNING</Badge>
                  &nbsp; host-03 response time
                </div>
                <div className="sim-inc-sub">Condition B · host-03 · opened 5m ago</div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="sim-arrow-col">
            <svg width="32" height="16" viewBox="0 0 32 16">
              <path d="M0 8h26M22 3l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* RIGHT: issues */}
          <div className="sim-col">
            <div className="sim-col-label">Issues (workflow acts on these)</div>
            {data.issues.map((issue, i) => (
              <div key={i} className={`sim-issue sim-issue--${issue.variant}`}>
                <div className="sim-issue-title">{issue.title}</div>
                <div className="sim-issue-incidents">{issue.incidents}</div>
              </div>
            ))}
            <div className="sim-notif">
              <span className="sim-notif-n">{notifCount}</span>
              workflow execution{notifCount !== 1 ? 's' : ''} &rarr; {notifCount} notification{notifCount !== 1 ? 's' : ''} sent
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
