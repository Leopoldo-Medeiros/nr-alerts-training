import { useState, Fragment } from 'react';
import '../../styles/interactive.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

export default function MutingVisualizer() {
  const [muteEnabled, setMuteEnabled] = useState(false);
  const [nowInWindow, setNowInWindow] = useState(false);

  const toggleMute = () => {
    const next = !muteEnabled;
    setMuteEnabled(next);
    if (!next) setNowInWindow(false);
  };

  const toggleNow = () => {
    if (!muteEnabled) return;
    setNowInWindow(!nowInWindow);
  };

  const getCellClass = (hourIdx, dayIdx) => {
    const isSunday = dayIdx === 6;
    const isMuteHour = hourIdx === 1 || hourIdx === 2;
    if (muteEnabled && isSunday && isMuteHour) {
      return nowInWindow ? 'wk-cell wk-cell--muted-hi' : 'wk-cell wk-cell--muted';
    }
    return 'wk-cell';
  };

  return (
    <div>
      <div className="mute-controls">
        <button
          className={`mute-btn${muteEnabled ? ' mute-btn--active' : ''}`}
          onClick={toggleMute}
        >
          {muteEnabled ? 'Disable maintenance window' : 'Enable maintenance window'}
        </button>
        <button
          className={`mute-btn${nowInWindow ? ' mute-btn--active' : ''}`}
          onClick={toggleNow}
          style={{ opacity: muteEnabled ? 1 : 0.4 }}
        >
          {nowInWindow ? 'Simulate: current time is outside window' : 'Simulate: current time is inside window'}
        </button>
      </div>

      <div className="week-grid">
        <div className="wk-hdr"></div>
        {DAYS.map((d) => (
          <div key={d} className="wk-hdr">{d}</div>
        ))}
        {HOURS.map((h, hi) => (
          <Fragment key={h}>
            <div className="wk-time">{h}</div>
            {DAYS.map((d, di) => (
              <div key={`${hi}-${di}`} className={getCellClass(hi, di)}></div>
            ))}
          </Fragment>
        ))}
      </div>

      <div className="mute-legend">
        <div className="mute-legend-item">
          <div className="mute-legend-swatch mute-legend-swatch--normal"></div>
          Normal — notifications fire
        </div>
        <div className="mute-legend-item">
          <div className="mute-legend-swatch mute-legend-swatch--muted"></div>
          Muted — notifications suppressed
        </div>
      </div>

      {muteEnabled && (
        <div className={`mute-status mute-status--${nowInWindow ? 'muted' : 'live'}`}>
          {nowInWindow ? (
            <span><strong>Currently muted.</strong> The maintenance window is active. Incidents are opening normally and issues are being created, but workflows are suppressed. No notifications are being delivered to any destination.</span>
          ) : (
            <span><strong>Muting rule is configured</strong> but the maintenance window is not currently active. Notifications are firing normally. The rule will activate Sunday 02:00–04:00 UTC.</span>
          )}
        </div>
      )}
    </div>
  );
}
