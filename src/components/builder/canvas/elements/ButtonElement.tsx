import type { BuilderButtonCanvasNode } from '@/lib/builder/canvas/types';

export default function ButtonElement({
  node,
}: {
  node: BuilderButtonCanvasNode;
}) {
  const primary = node.content.style === 'primary';

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
        background: primary ? '#0b3b2e' : '#ffffff',
        color: primary ? '#ffffff' : '#0f172a',
        border: primary ? '1px solid #0b3b2e' : '1px solid #cbd5e1',
        fontWeight: 700,
        fontSize: 15,
        boxShadow: primary
          ? '0 14px 30px rgba(11, 59, 46, 0.18)'
          : '0 8px 18px rgba(15, 23, 42, 0.08)',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
    >
      {node.content.label}
    </div>
  );
}

