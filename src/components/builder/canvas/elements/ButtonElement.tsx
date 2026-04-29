import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderTheme } from '@/lib/builder/site/types';
import { resolveThemeColor } from '@/lib/builder/site/theme';

type ButtonVariant = BuilderButtonCanvasNode['content']['style'];

function resolveVariantStyles(
  variant: ButtonVariant,
  s: BuilderButtonCanvasNode['style'],
  theme?: BuilderTheme,
) {
  const backgroundColor = resolveThemeColor(s.backgroundColor, theme);
  const borderColor = resolveThemeColor(s.borderColor, theme);
  const shadowColor = resolveThemeColor(s.shadowColor, theme);
  const hasCustomBg = backgroundColor !== 'transparent';
  const hasCustomBorder =
    s.borderWidth > 0;
  const hasShadow =
    s.shadowX !== 0 || s.shadowY !== 0 || s.shadowBlur !== 0 || s.shadowSpread !== 0;

  const base = {
    background: hasCustomBg ? backgroundColor : 'transparent',
    color: '#0f172a',
    border: hasCustomBorder
      ? `${s.borderWidth}px ${s.borderStyle} ${borderColor}`
      : 'none',
    boxShadow: hasShadow
      ? `${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${s.shadowSpread}px ${shadowColor}`
      : 'none',
    textDecoration: 'none' as const,
  };

  switch (variant) {
    case 'primary':
      return {
        ...base,
        background: hasCustomBg ? backgroundColor : '#0b3b2e',
        color: '#ffffff',
        border: hasCustomBorder
          ? base.border
          : '1px solid #0b3b2e',
        boxShadow: hasShadow
          ? base.boxShadow
          : '0 14px 30px rgba(11, 59, 46, 0.18)',
      };
    case 'secondary':
      return {
        ...base,
        background: hasCustomBg ? backgroundColor : '#ffffff',
        color: '#0f172a',
        border: hasCustomBorder
          ? base.border
          : '1px solid #cbd5e1',
        boxShadow: hasShadow
          ? base.boxShadow
          : '0 8px 18px rgba(15, 23, 42, 0.08)',
      };
    case 'outline':
      return {
        ...base,
        background: 'transparent',
        color: hasCustomBg ? backgroundColor : '#0b3b2e',
        border: hasCustomBorder
          ? base.border
          : '2px solid #0b3b2e',
      };
    case 'ghost':
      return {
        ...base,
        background: hasCustomBg ? backgroundColor : 'rgba(11, 59, 46, 0.06)',
        color: '#0b3b2e',
        border: 'none',
      };
    case 'link':
      return {
        ...base,
        background: 'transparent',
        color: '#0b3b2e',
        border: 'none',
        textDecoration: 'underline' as const,
      };
    default:
      return base;
  }
}

export default function ButtonElement({
  node,
  theme,
  mode = 'edit',
}: {
  node: BuilderButtonCanvasNode;
  theme?: BuilderTheme;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const s = node.style;
  const { className, as, href, label } = node.content;
  const interactive = mode === 'published';

  if (className) {
    const Tag = (as ?? (href ? 'a' : 'button')) as keyof JSX.IntrinsicElements;
    const props: Record<string, unknown> = {
      className,
      style: { display: 'inline-flex', alignItems: 'center', margin: 0 },
    };
    if (Tag === 'a') {
      props.href = interactive ? href : undefined;
      if (node.content.target) props.target = node.content.target;
      if (node.content.rel) props.rel = node.content.rel;
    } else if (Tag === 'button') {
      props.type = 'button';
    }
    if (!interactive) {
      (props.style as React.CSSProperties).pointerEvents = 'none';
    }
    return (
      <Tag {...(props as Record<string, never>)}>
        {label}
      </Tag>
    );
  }

  const variantStyles = resolveVariantStyles(node.content.style, s, theme);

  return (
    <div
      className="builder-button-element"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: s.borderRadius,
        background: variantStyles.background,
        color: variantStyles.color,
        border: variantStyles.border,
        boxShadow: variantStyles.boxShadow,
        textDecoration: variantStyles.textDecoration,
        fontWeight: 700,
        fontSize: 15,
        opacity: s.opacity < 100 ? s.opacity / 100 : undefined,
        pointerEvents: 'none',
        userSelect: 'none',
        transition: 'transform 150ms ease, box-shadow 150ms ease, opacity 150ms ease',
      }}
    >
      {node.content.label}
      <style>{`
        .builder-button-element:hover {
          transform: translateY(-1px) !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .builder-button-element:active {
          transform: scale(0.97) !important;
        }
      `}</style>
    </div>
  );
}
