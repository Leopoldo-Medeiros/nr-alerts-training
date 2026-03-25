import { useState } from 'react';
import accordionItems from '../../data/accordion.js';
import Badge from '../ui/Badge.jsx';
import '../../styles/interactive.css';

export default function Accordion() {
  const [openItems, setOpenItems] = useState(new Set());

  const toggle = (idx) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div>
      {accordionItems.map((item, idx) => {
        const isOpen = openItems.has(idx);
        return (
          <div key={idx} className={`accordion-item${isOpen ? ' accordion-item--open' : ''}`}>
            <div className="accordion-hdr" onClick={() => toggle(idx)}>
              <svg
                className="accordion-chevron"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"/>
              </svg>
              {item.question}
              <span className="accordion-badge">
                <Badge variant={item.tag.variant}>{item.tag.label}</Badge>
              </span>
            </div>
            {isOpen && (
              <div
                className="accordion-body"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
