import Image from 'next/image';
import { getAiAuthorCopy, LEGAL_AI_ASSISTANT_AVATAR } from '@/lib/ai-authored-columns';

/** Author box shown at the end of AI-written columns. */
export default function AiAuthorBox({ locale }: { locale: string }) {
  const copy = getAiAuthorCopy(locale);
  return (
    <aside
      className="column-ai-author"
      data-column-ai-author="true"
      aria-label={`${copy.heading} ${copy.label}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2.5rem',
        padding: '1.25rem 1.5rem',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        background: '#faf8f4',
      }}
    >
      <Image
        src={LEGAL_AI_ASSISTANT_AVATAR}
        alt={copy.label}
        width={64}
        height={64}
        style={{ borderRadius: '50%', flexShrink: 0, border: '1px solid #e5e7eb' }}
      />
      <div>
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280' }}>{copy.heading}</p>
        <p style={{ margin: '0.1rem 0 0.35rem', fontWeight: 700, color: '#1f2937' }}>{copy.label}</p>
        <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: 1.55, color: '#4b5563' }}>{copy.note}</p>
      </div>
    </aside>
  );
}
