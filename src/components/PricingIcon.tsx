export type PricingIconName = 'consultation' | 'litigation' | 'company' | 'retainer';

const iconProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function ConsultationIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <path d="M8.5 8.5h9a5.5 5.5 0 0 1 0 11h-2.8l-3.8 3v-3H8.5A4.5 4.5 0 0 1 4 15V13a4.5 4.5 0 0 1 4.5-4.5Z" {...iconProps} />
      <path d="M18 11.5h5.5A4.5 4.5 0 0 1 28 16v1.2a4.3 4.3 0 0 1-4.3 4.3h-1.6v3l-3.5-3" {...iconProps} />
      <path d="M10.5 13h5M10.5 16h3.4" {...iconProps} />
      <circle cx="22.3" cy="11.1" r="1.2" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

function LitigationIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <path d="M16 6v18" {...iconProps} />
      <path d="M8 11.5h16" {...iconProps} />
      <path d="M11 11.5 8.3 17a2.8 2.8 0 0 0 2.5 1.6h.4a2.8 2.8 0 0 0 2.5-1.6l-2.7-5.5Z" {...iconProps} />
      <path d="M21 11.5 18.3 17a2.8 2.8 0 0 0 2.5 1.6h.4a2.8 2.8 0 0 0 2.5-1.6L21 11.5Z" {...iconProps} />
      <path d="M11 23.5h10" {...iconProps} />
      <path d="M13.2 6.8 16 4l2.8 2.8" {...iconProps} />
    </svg>
  );
}

function CompanyIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <path d="M6.5 25.5V11.8L15.5 8v17.5" {...iconProps} />
      <path d="M15.5 25.5V13.8L25.5 10v15.5" {...iconProps} />
      <path d="M10.3 15.5h1.8M10.3 19.2h1.8M19.5 15.5h1.8M19.5 19.2h1.8" {...iconProps} />
      <path d="M4.5 25.5h23" {...iconProps} />
      <path d="M21.5 6.5h4.2M23.6 4.4v4.2" {...iconProps} />
    </svg>
  );
}

function RetainerIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden>
      <rect x="8" y="6.5" width="16" height="20" rx="3.4" {...iconProps} />
      <path d="M12 6.5h8v3.2h-8z" {...iconProps} />
      <path d="M12.2 14.2h7.6M12.2 18h7.6M12.2 21.8h4.4" {...iconProps} />
      <path d="m21.7 20.7 1.6 1.6 3.2-3.6" {...iconProps} />
      <circle cx="23.4" cy="9.6" r="1.2" fill="currentColor" stroke="none" opacity="0.9" />
    </svg>
  );
}

export default function PricingIcon({ name }: { name: PricingIconName }) {
  if (name === 'consultation') return <ConsultationIcon />;
  if (name === 'litigation') return <LitigationIcon />;
  if (name === 'company') return <CompanyIcon />;
  return <RetainerIcon />;
}
