import { useState } from 'react';
import nrqlSegments from '../../data/nrql.js';
import '../../styles/interactive.css';

export default function NrqlAnatomy() {
  const [selected, setSelected] = useState(null);

  const handleClick = (segId) => {
    setSelected(selected === segId ? null : segId);
  };

  const selectedSeg = nrqlSegments.find((s) => s.id === selected);

  return (
    <div>
      <div className="nrql-wrap">
        <div className="nrql-hint">Click a segment to learn what it does &rarr;</div>
        <div className="nrql-line">
          {nrqlSegments.map((seg, idx) => (
            <span key={seg.id}>
              <span
                className={`${seg.className}${selected === seg.id ? ' seg--active' : ''}`}
                onClick={() => handleClick(seg.id)}
              >
                {seg.text}
              </span>
              {idx < nrqlSegments.length - 1 && <span style={{ color: 'var(--text-secondary)' }}> </span>}
            </span>
          ))}
        </div>
      </div>

      {selectedSeg && (
        <div className="nrql-explain">
          <div className="nrql-explain-label">{selectedSeg.label}</div>
          <div dangerouslySetInnerHTML={{ __html: selectedSeg.body }} />
        </div>
      )}
    </div>
  );
}
