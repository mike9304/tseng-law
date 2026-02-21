export default function OrnamentDivider() {
  return (
    <div className="ornament-divider" aria-hidden>
      <svg className="ornament" viewBox="0 0 120 24" role="presentation" focusable="false">
        <line x1="0" y1="12" x2="40" y2="12" stroke="currentColor" strokeWidth="1" />
        <circle cx="60" cy="12" r="3" fill="currentColor" />
        <line x1="80" y1="12" x2="120" y2="12" stroke="currentColor" strokeWidth="1" />
      </svg>
    </div>
  );
}
