import '../../styles/components.css';

export default function Badge({ variant = 'mute', children }) {
  return (
    <span className={`badge badge--${variant}`}>
      <span
        className="badge-dot"
        style={{ background: `var(--${variant === 'mute' ? 'text-muted' : variant})` }}
      />
      {children}
    </span>
  );
}
