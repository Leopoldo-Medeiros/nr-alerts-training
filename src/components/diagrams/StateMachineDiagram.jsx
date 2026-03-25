import { useState } from 'react';
import '../../styles/diagrams.css';

const states = [
  {
    id: 'open',
    label: 'OPEN',
    variant: 'open',
    detail: '<strong>OPEN</strong> — The condition\'s threshold has been sustained for the configured duration. The incident record has been created. An issue is created or updated (depending on the policy\'s Incident Creation Preference). The associated workflow is triggered if a matching workflow exists and its trigger includes "Issue Created" or "Issue Activated."',
  },
  {
    id: 'ack',
    label: 'ACKNOWLEDGED',
    variant: 'ack',
    detail: '<strong>ACKNOWLEDGED</strong> — A responder has seen the issue and confirmed they are working on it. Acknowledging an incident does <em>not</em> close it. It signals to the team that someone owns the remediation. Some workflow configurations suppress repeat notifications when a corresponding issue is acknowledged.',
  },
  {
    id: 'closed',
    label: 'CLOSED',
    variant: 'closed',
    detail: '<strong>CLOSED</strong> — The incident closes when the monitored signal recovers below the threshold for a sustained period, when the "close after X hours" timeout fires, or when it is manually closed via the UI or API. When all incidents within an issue are closed, the issue itself closes and workflows configured to trigger on "Issue Closed" fire.',
  },
];

const ArrowRight = () => (
  <svg width="40" height="14" viewBox="0 0 40 14" fill="none">
    <path d="M0 7h34M30 2l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function StateMachineDiagram() {
  const [selected, setSelected] = useState('open');

  const selectedState = states.find((s) => s.id === selected);

  return (
    <div className="state-machine-wrap">
      <div className="state-machine-states">
        {/* OPEN state */}
        <div className="sm-node">
          <div
            className={`sm-box sm-box--open${selected === 'open' ? ' sm-box--sel' : ''}`}
            onClick={() => setSelected('open')}
          >
            OPEN
          </div>
        </div>

        {/* Arrow: OPEN → ACK */}
        <div className="sm-arrow">
          <ArrowRight />
          <div className="sm-arrow-label">human acknowledges</div>
        </div>

        {/* ACK state */}
        <div className="sm-node">
          <div
            className={`sm-box sm-box--ack${selected === 'ack' ? ' sm-box--sel' : ''}`}
            onClick={() => setSelected('ack')}
          >
            ACKNOWLEDGED
          </div>
        </div>

        {/* Arrow: ACK → CLOSED */}
        <div className="sm-arrow">
          <ArrowRight />
          <div className="sm-arrow-label">signal recovers or timeout</div>
        </div>

        {/* CLOSED state */}
        <div className="sm-node">
          <div
            className={`sm-box sm-box--closed${selected === 'closed' ? ' sm-box--sel' : ''}`}
            onClick={() => setSelected('closed')}
          >
            CLOSED
          </div>
        </div>
      </div>

      {selectedState && (
        <div
          className="sm-detail"
          dangerouslySetInnerHTML={{ __html: selectedState.detail }}
        />
      )}
    </div>
  );
}
