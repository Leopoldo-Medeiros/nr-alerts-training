export default function M12StreamingAlerts() {
  return (
    <article className="module-section fade-in">
      <p className="eyebrow">Module 12</p>
      <h1 className="section-title">Streaming Alerts & Signal Evaluation</h1>
      <p className="section-lead">
        New Relic's alerting engine is a real-time streaming pipeline built on top of NRDB. Understanding
        how it evaluates data — and where it can be tricked — is essential for building conditions that
        fire when they should and stay quiet when they should.
      </p>

      <h2>How the Streaming Pipeline Works</h2>
      <p>
        Every alert condition is a continuous query that runs against the live data stream. When a data
        point arrives in NRDB it flows through the following stages:
      </p>
      <ol>
        <li><strong>Ingest & partition</strong> — data lands in NRDB partitioned by account and entity.</li>
        <li><strong>Aggregation window</strong> — the engine collects data points into fixed-duration buckets (e.g. 1 minute).</li>
        <li><strong>Evaluation</strong> — at the end of each window the aggregated value is compared to the threshold.</li>
        <li><strong>Incident lifecycle</strong> — a breach opens an incident; recovery closes it after the recovery window lapses.</li>
      </ol>
      <p>
        The key insight is that evaluation happens on <em>aggregated windows</em>, not individual data points.
        A single spike at second 3 of a 5-minute window will only matter if the aggregated value for that
        entire window crosses the threshold.
      </p>

      <h2>Aggregation Window</h2>
      <p>
        The aggregation window is the duration over which data is collected before evaluation occurs.
        Common values are <code>1 minute</code>, <code>5 minutes</code>, and <code>10 minutes</code>.
        Shorter windows react faster but are noisier. Longer windows are smoother but slower to fire.
      </p>
      <div className="callout callout--info">
        <div className="callout-title">Window size vs. detection latency</div>
        A 5-minute window will not fire until 5 minutes of data have been collected — plus the evaluation
        offset (see below). For latency-sensitive conditions (e.g., p99 response time), use 1-minute windows.
        For capacity conditions (e.g., disk usage), 10-minute windows are typically fine.
      </div>

      <h2>Evaluation Methods</h2>
      <p>
        New Relic provides three evaluation methods that control how the engine handles late-arriving or
        sparse data. Choosing the wrong method is one of the most common causes of phantom incidents and
        missed alerts.
      </p>

      <h3>Event Flow (default)</h3>
      <p>
        The engine closes and evaluates a window when it detects that data for the <em>next</em> window
        has begun arriving. This works well for high-throughput signals where data arrives continuously.
        If data is sparse, the window may stay open indefinitely.
      </p>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">Best for</span><span className="prop-val">High-frequency telemetry (metrics, APM, browser)</span></div>
        <div className="prop-row"><span className="prop-key">Risk</span><span className="prop-val">Sparse signals may never evaluate</span></div>
        <div className="prop-row"><span className="prop-key">Latency</span><span className="prop-val">Low — fires as soon as next window starts</span></div>
      </div>

      <h3>Event Timer</h3>
      <p>
        A configurable timer (1–20 minutes) starts when data arrives in a window. If no new data arrives
        before the timer expires, the window is closed and evaluated. Designed for sporadic or batched
        signals like Lambda invocations, cron jobs, or low-volume custom events.
      </p>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">Best for</span><span className="prop-val">Sporadic events, Lambda, scheduled jobs</span></div>
        <div className="prop-row"><span className="prop-key">Risk</span><span className="prop-val">Timer too short → premature evaluation; too long → slow detection</span></div>
        <div className="prop-row"><span className="prop-key">Latency</span><span className="prop-val">Timer duration after last data point</span></div>
      </div>

      <h3>Cadence</h3>
      <p>
        Windows are evaluated on a strict clock-based schedule regardless of data arrival. Every N minutes
        the engine evaluates whatever data arrived in that period. If no data arrived, the evaluation
        either uses gap-filling (see below) or produces no result.
      </p>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">Best for</span><span className="prop-val">Synthetic monitors, predictable heartbeats</span></div>
        <div className="prop-row"><span className="prop-key">Risk</span><span className="prop-val">Misses bursts that span window boundaries</span></div>
        <div className="prop-row"><span className="prop-key">Latency</span><span className="prop-val">Up to one full window period</span></div>
      </div>

      <h2>Evaluation Offset (Delay)</h2>
      <p>
        Even after a window closes, the engine waits an additional <strong>evaluation offset</strong>
        (also called evaluation delay) before running the NRQL query. This allows late-arriving data
        to land before evaluation. The default is typically 3 minutes for Event Flow conditions.
      </p>
      <div className="callout callout--warn">
        <div className="callout-title">Total detection latency = window + offset</div>
        A 1-minute window with a 3-minute offset means the earliest you can receive a notification is
        ~4 minutes after the bad data arrives. For critical production alerts, consider reducing the
        offset to 0–1 minute and accepting slightly higher false-positive rates from late data.
      </div>
      <p>
        The offset exists because telemetry pipelines are not instantaneous. APM agents batch and send
        data every few seconds; infrastructure agents flush on their own schedule; custom events from
        the Telemetry SDK may be delayed by network conditions. The default 3-minute offset covers the
        vast majority of legitimate late arrivals.
      </p>

      <h2>Signal Loss Detection</h2>
      <p>
        Signal loss (also called "lost signal") fires an incident when your signal <em>stops reporting</em>
        entirely — i.e., the query returns no data for a configured duration. This is distinct from a
        threshold breach: instead of "value &gt; X", it detects "no value at all."
      </p>
      <p>
        Common use cases for signal loss:
      </p>
      <ul>
        <li>A host stops reporting its infrastructure agent heartbeat</li>
        <li>A service's APM agent crashes and stops sending transactions</li>
        <li>A Synthetic monitor stops reporting check results</li>
        <li>A Lambda function goes silent (no invocations AND no errors)</li>
      </ul>

      <h3>Signal Loss Configuration</h3>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">Timer</span><span className="prop-val">Duration of silence before incident opens (e.g., 5 minutes)</span></div>
        <div className="prop-row"><span className="prop-key">Open new incident</span><span className="prop-val">Fires a new signal loss incident; useful for alerting when a host vanishes</span></div>
        <div className="prop-row"><span className="prop-key">Resolve existing incident</span><span className="prop-val">Closes an open threshold incident when signal disappears (prevents "stuck open" incidents after a service is decommissioned)</span></div>
        <div className="prop-row"><span className="prop-key">Both</span><span className="prop-val">Opens a signal loss incident AND closes the threshold incident simultaneously</span></div>
      </div>

      <h3>Signal Loss vs. Threshold Conditions</h3>
      <p>
        A common mistake is relying on a threshold condition to detect host down. If the host is dead,
        it reports no data — and a threshold condition on <code>cpuPercent</code> will simply produce
        no evaluation result, not an incident. You must configure signal loss explicitly, or use a
        separate heartbeat condition.
      </p>

      <h2>Gap-Filling</h2>
      <p>
        Gap-filling controls what value the engine uses when a window has no data. Without gap-filling,
        a sparse signal will produce "holes" in the evaluation timeline that may accidentally close
        incidents or prevent them from opening.
      </p>
      <div className="prop-table">
        <div className="prop-row"><span className="prop-key">None</span><span className="prop-val">No value is inserted; the window produces no result</span></div>
        <div className="prop-row"><span className="prop-key">Static value</span><span className="prop-val">A fixed number (e.g., 0) is used when no data is present</span></div>
        <div className="prop-row"><span className="prop-key">Last known value</span><span className="prop-val">The last reported value is carried forward</span></div>
      </div>
      <div className="callout callout--crit">
        <div className="callout-title">Gap-filling with static 0 is dangerous</div>
        If your condition fires when error rate &gt; 5% and you fill gaps with 0, a period of no data
        will look like 0% errors — which is below the threshold. This means an outage that silences all
        telemetry would <em>not</em> fire an alert. Use signal loss detection alongside or instead.
      </div>

      <h2>Sliding Window Aggregation</h2>
      <p>
        Sliding window aggregation is an advanced technique that overlaps consecutive aggregation windows
        to smooth out spiky data. Instead of non-overlapping 5-minute buckets, a sliding window might
        evaluate every 1 minute over the past 5 minutes (5-minute window, 1-minute slide interval).
      </p>
      <p>
        This reduces alert noise from brief spikes while maintaining sensitivity to sustained degradation.
        The tradeoff is increased computational cost — use sliding windows only when you have recurring
        false positives from brief spikes and confirmed sustained-degradation use cases.
      </p>

      <h2>NRQL Condition Evaluation vs. Baseline Conditions</h2>
      <p>
        Static threshold conditions compare the aggregated value to a fixed number you define.
        Baseline (anomaly) conditions use a machine-learned model of the signal's normal behavior and
        fire when the value deviates by a configured number of standard deviations.
      </p>
      <p>
        Baseline conditions have a warm-up period of at least 7 days before the model is trained.
        During warm-up, the condition evaluates but may produce more false positives. They are
        best suited for periodic or cyclical signals (daily/weekly patterns) where a static threshold
        would either miss real anomalies or fire constantly during peak hours.
      </p>

      <h2>Key Takeaways</h2>
      <ul>
        <li>Choose <strong>Event Flow</strong> for high-frequency metrics; <strong>Event Timer</strong> for sparse/batched events; <strong>Cadence</strong> for strict clock-based evaluation.</li>
        <li>Total detection latency = aggregation window duration + evaluation offset.</li>
        <li>Signal loss detection and threshold conditions are complementary — use both for complete coverage.</li>
        <li>Gap-filling with static 0 on an error-rate condition is a common footgun — pair with signal loss instead.</li>
        <li>Sliding windows smooth noise at the cost of evaluation frequency — use sparingly.</li>
      </ul>
    </article>
  );
}
