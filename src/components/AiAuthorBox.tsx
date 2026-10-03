import { getColumnDisclaimer } from '@/lib/ai-authored-columns';

/** Retains the general-information notice without a public author attribution. */
export default function AiAuthorBox({ locale }: { locale: string }) {
  return (
    <p
      className="column-disclaimer"
      data-column-disclaimer="true"
      style={{ marginTop: '2.5rem', fontSize: '0.9rem', lineHeight: 1.55, color: '#4b5563' }}
    >
      {getColumnDisclaimer(locale)}
    </p>
  );
}
