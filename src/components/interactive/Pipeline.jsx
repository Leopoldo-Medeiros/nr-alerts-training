import { useState } from 'react';
import pipelineNodes from '../../data/pipeline.js';
import '../../styles/interactive.css';

const ArrowIcon = () => (
  <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
    <path d="M0 6h16M12 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function NodeIcon({ node }) {
  if (node.id === 'signal') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    );
  }
  if (node.id === 'condition') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </svg>
    );
  }
  if (node.id === 'incident') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    );
  }
  if (node.id === 'issue') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    );
  }
  if (node.id === 'workflow') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/>
        <path d="M13 6h3a2 2 0 0 1 2 2v7"/><line x1="6" y1="9" x2="6" y2="21"/>
      </svg>
    );
  }
  if (node.id === 'destination') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/>
        <line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>
      </svg>
    );
  }
  if (node.id === 'notification') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    );
  }
  return null;
}

export default function Pipeline() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (nodeId) => {
    setSelected(selected === nodeId ? null : nodeId);
  };

  const selectedNode = pipelineNodes.find((n) => n.id === selected);

  return (
    <div className="pipeline-wrap">
      <div className="pipeline">
        {pipelineNodes.map((node, idx) => (
          <div key={node.id} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`pipe-node${selected === node.id ? ' pipe-node--sel' : ''}`}
              onClick={() => handleSelect(node.id)}
            >
              <div className="pipe-box">
                <NodeIcon node={node} />
                <div className="pipe-box-label">{node.label}</div>
              </div>
              <div className="pipe-step-label">{node.stepLabel}</div>
            </div>
            {idx < pipelineNodes.length - 1 && (
              <div className="pipe-arrow">
                <ArrowIcon />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedNode && (
        <div className="pipe-detail">
          <div className="pipe-detail-title">
            <NodeIcon node={selectedNode} />
            {selectedNode.title}
          </div>
          <div className="pipe-detail-body">
            <p>{selectedNode.description}</p>
            {selectedNode.bullets && (
              <ul>
                {selectedNode.bullets.map((b, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: b }} />
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
