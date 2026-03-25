export default function Header({ visited, total }) {
  const pct = Math.round(((visited?.size ?? 0) / total) * 100);

  return (
    <header className="app-header">
      <div className="nr-mark">NR</div>
      <span className="nr-name">New Relic</span>
      <div className="hdr-sep" />
      <span className="hdr-product">Alerts — Technical Reference</span>
      <div className="hdr-right">
        <span className="hdr-progress-label">{pct}% complete</span>
        <div className="hdr-progress-bar">
          <div className="hdr-progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <span className="hdr-tag">TSE Edition · v1.0</span>
      </div>
    </header>
  );
}
