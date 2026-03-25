import TroubleshootingFlow from '../components/interactive/TroubleshootingFlow.jsx';
import ModuleQuiz from '../components/interactive/ModuleQuiz.jsx';
import Callout from '../components/ui/Callout.jsx';

export default function M10Troubleshooting({ onNavigate, onQuizComplete, quizScore }) {
  return (
    <div className="module-section fade-in">
      <div className="eyebrow">Module 10</div>
      <div className="section-title">Interactive Troubleshooter</div>
      <p className="section-lead">
        Use this diagnostic tool when investigating a customer's alert problem.
        Answer each question based on what you observe in the customer's account.
        The flowchart will identify the root cause and provide the exact remediation steps.
      </p>

      <Callout variant="info">
        This tool covers the five most common alert failure patterns seen in support tickets.
        Each resolution links back to the relevant reference module for deeper reading.
      </Callout>

      <TroubleshootingFlow onNavigate={onNavigate} />
      <ModuleQuiz moduleId="M10Troubleshooting" onComplete={onQuizComplete} />
    </div>
  );
}
