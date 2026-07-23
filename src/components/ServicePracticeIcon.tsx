/**
 * Code-native practice icons for home `#practice` and builder services preview.
 * Shared so public and builder surfaces cannot drift.
 *
 * Mapping (index → practice):
 * 0 투자·법인설립 — architectural elevation
 * 1 민사소송·손해배상 — document + progress arrow
 * 2 가사소송 — facing openings
 * 3 노동법·고용분쟁 — two independent structures
 * 4 형사소송 — parallel lines + center diamond
 * 5 지적재산·금융분쟁 — 3×3 node grid
 */
export default function ServicePracticeIcon({ index }: { index: number }) {
  const common = {
    fill: 'none' as const,
    stroke: 'currentColor',
    strokeWidth: 1.55,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  // 0 — investment / incorporation: compact building elevation
  if (index === 0) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="service-practice-icon" data-practice-icon="0">
        <path d="M5 19V7.5h14V19" {...common} />
        <path d="M5 10.5h14" {...common} />
        <path d="M9 7.5V5.5h6V7.5" {...common} />
        <path d="M8 13.5v3M12 13.5v3M16 13.5v3" {...common} />
        <path d="M4 19h16" {...common} />
      </svg>
    );
  }

  // 1 — civil / damages: vertical document + short progress arrow
  if (index === 1) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="service-practice-icon" data-practice-icon="1">
        <path d="M7 4.5h7.2L17 7.3V19.5H7z" {...common} />
        <path d="M14.2 4.5v2.8H17" {...common} />
        <path d="M9.5 11h5M9.5 14h3.5" {...common} />
        <path d="M14.2 16.8h2.6M15.8 15.4l1.4 1.4-1.4 1.4" {...common} />
      </svg>
    );
  }

  // 2 — family law: two facing door openings
  if (index === 2) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="service-practice-icon" data-practice-icon="2">
        <path d="M4.5 6.5v11h5.2V6.5z" {...common} />
        <path d="M14.3 6.5v11h5.2V6.5z" {...common} />
        <path d="M9.7 9.5H14.3M9.7 14.5H14.3" {...common} />
        <path d="M8.2 12h1M14.8 12h1" {...common} />
      </svg>
    );
  }

  // 3 — labor / employment: two independent rectangular structures
  if (index === 3) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="service-practice-icon" data-practice-icon="3">
        <path d="M4.5 7h6.2v10H4.5z" {...common} />
        <path d="M13.3 7h6.2v10H13.3z" {...common} />
        <path d="M6.2 10h2.8M15 10h2.8" {...common} />
        <path d="M6.2 13.5h2.8M15 13.5h2.8" {...common} />
      </svg>
    );
  }

  // 4 — criminal: parallel lines + center diamond
  if (index === 4) {
    return (
      <svg viewBox="0 0 24 24" aria-hidden className="service-practice-icon" data-practice-icon="4">
        <path d="M4 8.2h16M4 12h4.2M15.8 12H20M4 15.8h16" {...common} />
        <path d="M12 8.8l3.2 3.2L12 15.2 8.8 12z" {...common} />
      </svg>
    );
  }

  // 5 — IP / finance: 3×3 node grid
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="service-practice-icon" data-practice-icon="5">
      <path d="M7 7h.01M12 7h.01M17 7h.01M7 12h.01M12 12h.01M17 12h.01M7 17h.01M12 17h.01M17 17h.01" {...common} strokeWidth={2.4} />
      <path d="M7 7h10M7 12h10M7 17h10M7 7v10M12 7v10M17 7v10" {...common} />
    </svg>
  );
}
