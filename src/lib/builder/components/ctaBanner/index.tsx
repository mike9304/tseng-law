import { defineComponent } from '../define';
import CtaBannerInspector from './Inspector';

interface CtaBannerContent {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
  backgroundColor: string;
}

function CtaBannerRender({ node }: { node: { content: CtaBannerContent } }) {
  const {
    title = '',
    description = '',
    buttonLabel = '',
    buttonHref = '#',
    backgroundColor = '#0b3b2e',
  } = node.content;

  if (!title && !description && !buttonLabel) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#f1f5f9',
          border: '2px dashed #cbd5e1',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#94a3b8',
          fontSize: 13,
        }}
      >
        CTA Banner
      </div>
    );
  }

  // Support gradient backgrounds (e.g. "linear-gradient(135deg, #123b63, #1e5a96)")
  const isGradient = backgroundColor.includes('gradient');
  const isLight = !isGradient && (backgroundColor.toLowerCase() === '#ffffff' || backgroundColor.toLowerCase() === 'white' || backgroundColor === 'transparent');
  const textColor = isLight ? '#0f172a' : '#ffffff';
  const btnBg = isLight ? '#0b3b2e' : '#ffffff';
  const btnColor = isLight ? '#ffffff' : '#0f172a';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: backgroundColor,
        borderRadius: 12,
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        textAlign: 'center',
      }}
    >
      {title && (
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: textColor, lineHeight: 1.3 }}>
          {title}
        </h2>
      )}
      {description && (
        <p style={{ margin: 0, fontSize: 16, color: textColor, opacity: 0.85, lineHeight: 1.5, maxWidth: 540 }}>
          {description}
        </p>
      )}
      {buttonLabel && (
        <a
          href={buttonHref}
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            fontSize: 15,
            fontWeight: 600,
            color: btnColor,
            background: btnBg,
            borderRadius: 6,
            textDecoration: 'none',
            marginTop: 4,
          }}
        >
          {buttonLabel}
        </a>
      )}
    </div>
  );
}

export default defineComponent({
  kind: 'ctaBanner',
  displayName: 'ctaBanner',
  category: 'domain',
  icon: '◻',
  defaultContent: {
    title: '',
    description: '',
    buttonLabel: '',
    buttonHref: '#',
    backgroundColor: '#0b3b2e',
  },
  defaultStyle: {},
  defaultRect: { width: 400, height: 250 },
  Render: CtaBannerRender,
  Inspector: CtaBannerInspector,
});
