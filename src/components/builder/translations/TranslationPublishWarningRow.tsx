import type { TranslationPublishWarning } from '@/lib/builder/translations/publish-warning-types';

const SEVERITY_PALETTE: Record<
  TranslationPublishWarning['severity'],
  { chipBg: string; chipFg: string; actionBorder: string; actionFg: string }
> = {
  error: {
    chipBg: '#dc2626',
    chipFg: '#fff',
    actionBorder: '#fecaca',
    actionFg: '#991b1b',
  },
  warning: {
    chipBg: '#b45309',
    chipFg: '#fff',
    actionBorder: '#fde68a',
    actionFg: '#92400e',
  },
};

interface TranslationPublishWarningRowProps {
  warning: TranslationPublishWarning;
  kindLabel: string;
  reviewHref: string;
  reviewLabel: string;
}

export default function TranslationPublishWarningRow({
  warning,
  kindLabel,
  reviewHref,
  reviewLabel,
}: TranslationPublishWarningRowProps) {
  const palette = SEVERITY_PALETTE[warning.severity];

  return (
    <li
      style={{
        display: 'flex',
        alignItems: 'baseline',
        flexWrap: 'wrap',
        gap: 8,
        fontSize: 12,
        color: '#1f2937',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          background: palette.chipBg,
          color: palette.chipFg,
          borderRadius: 999,
          fontSize: 10,
          fontWeight: 600,
          padding: '2px 8px',
          textTransform: 'uppercase',
          letterSpacing: 0.4,
        }}
      >
        {kindLabel}
      </span>
      <span style={{ flex: '1 1 260px' }}>{warning.message}</span>
      <span style={{ color: '#64748b', fontSize: 11 }}>{warning.locale}</span>
      <a
        data-translation-publish-warning-action={`${warning.kind}:${warning.locale}:${warning.pageId}`}
        href={reviewHref}
        style={{
          border: `1px solid ${palette.actionBorder}`,
          borderRadius: 6,
          color: palette.actionFg,
          flex: '0 0 auto',
          fontSize: 11,
          fontWeight: 700,
          lineHeight: 1,
          padding: '6px 8px',
          textDecoration: 'none',
        }}
      >
        {reviewLabel}
      </a>
    </li>
  );
}
