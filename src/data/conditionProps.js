const conditionProps = [
  {
    id: 'window',
    name: 'Evaluation Window',
    value: '5 minutes',
    desc: 'Rolling window NRQL evaluates over',
    explanation: '<strong>Evaluation Window (1–120 minutes):</strong> The rolling window of time over which NRQL aggregates data. A 5-minute window means "evaluate the average of the last 5 minutes on each evaluation cycle." Shorter windows catch transient spikes but can be noisy. Longer windows smooth out noise but detect issues later.',
  },
  {
    id: 'threshold-type',
    name: 'Threshold Type',
    value: 'Static',
    desc: 'How the breach value is determined',
    explanation: `<strong>Threshold Type:</strong><br><br>
    <strong>Static</strong> — A fixed numeric value. Alert when <code>average(duration)</code> exceeds 2.5 seconds. Simple and predictable.<br><br>
    <strong>Anomaly</strong> — New Relic builds a baseline from historical data and alerts when the signal deviates by N standard deviations. Good for signals with natural seasonality (e.g., traffic patterns) where a fixed threshold would produce false positives.`,
  },
  {
    id: 'critical',
    name: 'Critical Threshold',
    value: '> 2.5 seconds for 5 min',
    desc: 'Opens a Critical-priority incident',
    explanation: '<strong>Critical Threshold:</strong> The threshold that, when sustained for the configured duration, opens a Critical-priority incident. Critical is required. The value you set depends entirely on your SLA or SLO. Common pattern: set Critical at the level that requires immediate human response.',
  },
  {
    id: 'warning',
    name: 'Warning Threshold',
    value: '> 1.2 seconds for 5 min',
    desc: 'Opens a Warning-priority incident',
    explanation: '<strong>Warning Threshold (optional):</strong> A less severe threshold that opens a Warning-priority incident. Warning incidents <em>do not</em> trigger most workflows by default — only if the workflow filter explicitly includes Warning-priority issues. Use Warning for early signals that need monitoring but not immediate paging.',
  },
  {
    id: 'fill',
    name: 'Fill Option',
    value: 'Last known value',
    desc: 'Behavior when signal data is absent',
    explanation: `<strong>Fill Option — behavior when data is absent:</strong><br><br>
    <strong>None (gap)</strong> — No evaluation occurs during the gap. The incident neither opens nor closes based on missing data.<br>
    <strong>Last known value</strong> — Carries the last observed value forward. If the last value violated the threshold, the incident remains open through the gap.<br>
    <strong>Static (0)</strong> — Substitutes zero. Useful for count-based metrics where no data means no events.<br>
    <strong>Close violation on data loss</strong> — Automatically closes open incidents when the signal disappears. Use when signal absence means the system is healthy (e.g., the service is shut down).`,
  },
  {
    id: 'auto-close',
    name: 'Auto-close After',
    value: '24 hours',
    desc: 'Force-closes incidents regardless of signal',
    explanation: '<strong>Auto-close After:</strong> Forces all open incidents from this condition to close after the specified time, regardless of whether the signal has recovered. Prevents "zombie incidents" — incidents that should have closed but were stuck due to a data gap or configuration issue. Default is 24 hours. Can be set to up to 30 days.',
  },
];

export default conditionProps;
