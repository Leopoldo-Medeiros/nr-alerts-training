import Accordion from '../components/interactive/Accordion.jsx';

export default function M09CommonMistakes() {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 09</div>
      <div className="section-title">Common Mistakes &amp; TSE Reference</div>
      <p className="section-lead">
        The following patterns represent the most frequently misunderstood behaviors in Alerts.
        Each maps to a recurring support ticket category.
      </p>

      <Accordion />
    </div>
  );
}
