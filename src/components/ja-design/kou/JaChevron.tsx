/** Inline chevron for text links (CONCEPT-V2 §7.1): 10 x 16, 2 px stroke in currentColor of its class (朱 by default). */
export default function JaChevron({ className }: { className?: string }) {
  return (
    <svg className={className} width="10" height="16" viewBox="0 0 10 16" aria-hidden="true" focusable="false">
      <path d="M2 2l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
