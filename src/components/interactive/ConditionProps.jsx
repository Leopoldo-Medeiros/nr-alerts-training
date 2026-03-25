import { useState } from 'react';
import conditionProps from '../../data/conditionProps.js';
import '../../styles/interactive.css';

export default function ConditionProps() {
  const [selected, setSelected] = useState(null);

  const handleClick = (propId) => {
    setSelected(selected === propId ? null : propId);
  };

  const selectedProp = conditionProps.find((p) => p.id === selected);

  return (
    <div>
      <div className="cond-props">
        {conditionProps.map((prop) => (
          <div
            key={prop.id}
            className={`cond-prop${selected === prop.id ? ' cond-prop--sel' : ''}`}
            onClick={() => handleClick(prop.id)}
          >
            <div className="cond-prop-name">{prop.name}</div>
            <div className="cond-prop-val">{prop.value}</div>
            <div className="cond-prop-desc">{prop.desc}</div>
          </div>
        ))}
      </div>

      {selectedProp && (
        <div
          className="cond-explain"
          dangerouslySetInnerHTML={{ __html: selectedProp.explanation }}
        />
      )}
    </div>
  );
}
