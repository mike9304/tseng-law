import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';

type ButtonVariant = BuilderButtonCanvasNode['content']['style'];

function resolveVariantStyles(variant: ButtonVariant, s: BuilderButtonCanvasNode['style']) {
  const hasCustomBg = s.backgroundColor !== 'transparent';
  const hasCustomBorder =
    s.borderWidth > 0;
  const hasShadow =
    s.shadowX !== 0 || s.shadowY !== 0 || s.shadowBlur !== 0 || s.shadowSpread !== 0;

  const base = {
    background: hasCustomBg ? s.backgroundColor : 'transparent',
    color: '#0f172a',
    border: hasCustomBorder
      ? `${s.borderWidth}px ${s.borderStyle} ${s.borderColor}`
      : 'none',
    boxShadow: hasShadow
      ? `${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${s.shadowSpread}px ${s.shadowColor}`
      : 'none',
    textDecoration: 'none' as const,
  };

  switch (variant) {
    case 'primary':
      return {
        ...base,
        background: hasCustomBg ? s.backgroundColor : '#0b3b2e',
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
        background: hasCustomBg ? s.backgroundColor : '#ffffff',
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
        color: hasCustomBg ? s.backgroundColor : '#0b3b2e',
        border: hasCustomBorder
          ? base.border
          : '2px solid #0b3b2e',
      };
    case 'ghost':
      return {
        ...base,
        background: hasCustomBg ? s.backgroundColor : 'rgba(11, 59, 46, 0.06)',
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
}: {
  node: BuilderButtonCanvasNode;
}) {
  const s = node.style;
  const variantStyles = resolveVariantStyles(node.content.style, s);

  return (
    <div
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
      }}
    >
      {node.content.label}
    </div>
  );
}
