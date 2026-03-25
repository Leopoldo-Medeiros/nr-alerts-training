import { useState } from 'react';
import { workflowIssues, workflowFilters } from '../../data/workflowData.js';
import '../../styles/interactive.css';

export default function WorkflowPlayground() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterDef = workflowFilters.find((f) => f.id === activeFilter);
  const matched = workflowIssues.filter(filterDef.fn);

  return (
    <div className="wf-play">
      <div className="wf-play-label">Select a workflow filter</div>

      <div className="wf-filters">
        {workflowFilters.map((f) => (
          <button
            key={f.id}
            className={`wf-filter-btn${activeFilter === f.id ? ' wf-filter-btn--active' : ''}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="wf-active-filter">
        <span>{filterDef.filterLabel}</span>
      </div>

      <div className="wf-issues">
        {workflowIssues.map((issue, i) => {
          const isMatch = filterDef.fn(issue);
          return (
            <div key={i} className={`wf-issue${isMatch ? ' wf-issue--matched' : ' wf-issue--excluded'}`}>
              <div className={`wf-dot wf-dot--${issue.dotVariant}`}></div>
              <div className="wf-iname">{issue.name}</div>
              <div className="wf-itags">
                <span className="wf-tag">priority:{issue.priority}</span>
                <span className="wf-tag">env:{issue.env}</span>
                <span className="wf-tag">team:{issue.team}</span>
              </div>
              <div className={`wf-match wf-match--${isMatch ? 'yes' : 'no'}`}>
                {isMatch ? '✓ MATCH' : 'no match'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="wf-summary">
        <strong>{matched.length} of {workflowIssues.length}</strong> issues match this filter — workflow fires {matched.length} time{matched.length !== 1 ? 's' : ''}.
      </div>
    </div>
  );
}
