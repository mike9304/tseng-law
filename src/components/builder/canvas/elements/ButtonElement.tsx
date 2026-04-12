import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';

export default function ButtonElement({
  node,
}: {
  node: BuilderButtonCanvasNode;
}) {
  const primary = node.content.style === 'primary';
  const s = node.style;

  const defaultBg = primary ? '#0b3b2e' : '#ffffff';
  const background = s.backgroundColor !== 'transparent' ? s.backgroundColor : defaultBg;

  const defaultBorder = primary ? '1px solid #0b3b2e' : '1px solid #cbd5e1';
  const border = s.borderWidth > 0
    ? `${s.borderWidth}px ${s.borderStyle} ${s.borderColor}`
    : defaultBorder;

  const hasShadow = s.shadowX !== 0 || s.shadowY !== 0 || s.shadowBlur !== 0 || s.shadowSpread !== 0;
  const defaultShadow = primary
    ? '0 14px 30px rgba(11, 59, 46, 0.18)'
    : '0 8px 18px rgba(15, 23, 42, 0.08)';
  const boxShadow = hasShadow
    ? `${s.shadowX}px ${s.shadowY}px ${s.shadowBlur}px ${s.shadowSpread}px ${s.shadowColor}`
    : defaultShadow;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: s.borderRadius,
        background,
        color: primary ? '#ffffff' : '#0f172a',
        border,
        fontWeight: 700,
        fontSize: 15,
        boxShadow,
        opacity: s.opacity < 100 ? s.opacity / 100 : undefined,
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {node.content.label}
    </div>
  );
}

