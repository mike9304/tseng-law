/**
 * Inline chevrons for en-owned links (CONCEPT-V2 8.3). Inter and Inter Tight have no U+2192, so a typed
 * arrow fell back to Noto Sans KR; these SVGs follow the text colour and size instead. Decorative only:
 * the link text carries the meaning. `EN Glyphs` draws the same paths for arrows typed by shared components.
 */
const base = {
  viewBox: '0 0 12 20',
  width: '0.42em',
  height: '0.7em',
  'aria-hidden': true,
  focusable: false,
} as const;

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.4,
  strokeLinecap: 'square',
  strokeLinejoin: 'miter',
} as const;

export function EnChevron({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} data-en-chevron="right" style={{ verticalAlign: '-0.105em', marginLeft: '0.3em', flex: 'none' }}>
      <path d="M3.5 3 9 10l-5.5 7" {...strokeProps} />
    </svg>
  );
}

export function EnChevronLeft({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} data-en-chevron="left" style={{ verticalAlign: '-0.105em', marginRight: '0.3em', flex: 'none' }}>
      <path d="M8.5 3 3 10l5.5 7" {...strokeProps} />
    </svg>
  );
}

export function EnArrowUpRight({ className }: { className?: string }) {
  return (
    <svg {...base} className={className} data-en-chevron="up-right" style={{ verticalAlign: '-0.105em', marginLeft: '0.3em', flex: 'none' }}>
      <path d="M2.5 15.5 10 8 M3.8 6.5H10v6.2" {...strokeProps} />
    </svg>
  );
}

export function EnChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 12" width="0.7em" height="0.42em" aria-hidden focusable={false} className={className} data-en-chevron="down" style={{ verticalAlign: '0.08em', marginLeft: '0.35em', flex: 'none' }}>
      <path d="M3 3.5 10 9l7-5.5" {...strokeProps} />
    </svg>
  );
}
