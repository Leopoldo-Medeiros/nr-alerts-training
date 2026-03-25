import '../../styles/diagrams.css';

const ArrowDown = () => (
  <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
    <line x1="7" y1="0" x2="7" y2="16" stroke="currentColor" strokeWidth="1.5"/>
    <polyline points="3,12 7,18 11,12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRight = () => (
  <svg width="24" height="14" viewBox="0 0 24 14" fill="none">
    <path d="M0 7h18M14 2l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function WorkflowDecisionDiagram() {
  return (
    <div className="workflow-decision">
      {/* Start node */}
      <div className="wdd-node wdd-node--start">Issue State Change</div>

      {/* Arrow down to decision */}
      <div className="wdd-arrow-down">
        <ArrowDown />
      </div>

      {/* Decision diamond */}
      <div className="wdd-node wdd-node--decision">
        Does issue match workflow filter?
      </div>

      {/* Arrow down from decision */}
      <div className="wdd-arrow-down">
        <ArrowDown />
      </div>

      {/* Two branches */}
      <div className="wdd-branches">
        {/* YES branch */}
        <div className="wdd-branch wdd-branch--yes">
          <div className="wdd-branch-label">YES</div>
          <div className="wdd-step">Run enrichment NRQL</div>
          <div className="wdd-step-arrow"><ArrowDown /></div>
          <div className="wdd-step">Build message from template</div>
          <div className="wdd-step-arrow"><ArrowDown /></div>
          <div className="wdd-step">POST to destination</div>
          <div className="wdd-step-arrow"><ArrowDown /></div>
          <div className="wdd-node wdd-node--delivered">Notification delivered</div>
        </div>

        {/* NO branch */}
        <div className="wdd-branch wdd-branch--no">
          <div className="wdd-branch-label">NO</div>
          <div className="wdd-step">Workflow skipped — no notification</div>
        </div>
      </div>
    </div>
  );
}
