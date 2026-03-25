import '../../styles/diagrams.css';

const layers = [
  {
    id: 'signal',
    title: 'SIGNAL LAYER',
    subtitle: 'Metrics · Events · Logs · Traces',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    id: 'detection',
    title: 'DETECTION LAYER',
    subtitle: 'Policy → Condition → Threshold evaluation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    ),
  },
  {
    id: 'incident',
    title: 'INCIDENT LAYER',
    subtitle: 'One incident per entity violation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  {
    id: 'issue',
    title: 'ISSUE LAYER',
    subtitle: 'Grouped by Incident Creation Preference',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    id: 'notification',
    title: 'NOTIFICATION LAYER',
    subtitle: 'Workflow → Destination → Message delivered',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
];

const connectorLabels = [
  'signal triggers evaluation',
  'evaluation breach opens incident',
  'incidents aggregate into issue',
  'issue triggers workflow',
];

const ArrowDown = () => (
  <svg width="14" height="20" viewBox="0 0 14 20" fill="none">
    <line x1="7" y1="0" x2="7" y2="16" stroke="currentColor" strokeWidth="1.5"/>
    <polyline points="3,12 7,18 11,12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HierarchyDiagram() {
  return (
    <div className="hierarchy-diagram">
      {layers.map((layer, idx) => (
        <div key={layer.id}>
          <div className={`hierarchy-layer hierarchy-layer--${layer.id}`}>
            <div className="hierarchy-layer-icon">
              {layer.icon}
            </div>
            <div className="hierarchy-layer-text">
              <div className="hierarchy-layer-title">{layer.title}</div>
              <div className="hierarchy-layer-subtitle">{layer.subtitle}</div>
            </div>
          </div>
          {idx < layers.length - 1 && (
            <div className="hierarchy-connector">
              <div className="hierarchy-connector-arrow">
                <ArrowDown />
              </div>
              <div className="hierarchy-connector-label">{connectorLabels[idx]}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
