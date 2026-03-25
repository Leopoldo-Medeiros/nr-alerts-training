import HierarchyDiagram from '../components/diagrams/HierarchyDiagram.jsx';
import Pipeline from '../components/interactive/Pipeline.jsx';
import Callout from '../components/ui/Callout.jsx';

export default function M01Architecture() {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 01</div>
      <div className="section-title">Architecture &amp; Data Flow</div>
      <p className="section-lead">
        New Relic Alerts is a pipeline, not a single feature. Each stage has a distinct responsibility.
        Understanding where each component lives prevents the most common support mistakes.
        Click any node below to explore its role.
      </p>

      <h2>Signal-to-Notification Hierarchy</h2>
      <p>Each layer depends on the one above it. A failure at any layer silently stops the pipeline downstream.</p>
      <HierarchyDiagram />

      <h2>Pipeline Walkthrough</h2>
      <p>Click any node below to explore its role in the pipeline.</p>
      <Pipeline />

      <Callout variant="info">
        <strong>Key mental model:</strong> Conditions detect. Incidents record. Issues aggregate. Workflows route. Destinations deliver. Each stage is independently configurable — changing a workflow does not affect conditions, and vice versa.
      </Callout>
    </div>
  );
}
