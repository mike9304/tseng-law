import { useEffect, useState } from 'react';
import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderAnchorMenuCanvasNode } from '@/lib/builder/canvas/types';

function AnchorMenuRender({
  node,
  mode = 'edit',
}: {
  node: BuilderAnchorMenuCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const [activeId, setActiveId] = useState<string>(c.items[0]?.anchorId ?? '');

  useEffect(() => {
    if (mode === 'edit' || c.items.length === 0) return undefined;
    function onScroll() {
      const top = window.scrollY + c.offsetTopPx + 8;
      let candidate = c.items[0]?.anchorId ?? '';
      for (const item of c.items) {
        const target = document.getElementById(item.anchorId);
        if (!target) continue;
        const rect = target.getBoundingClientRect();
        const absoluteTop = window.scrollY + rect.top;
        if (absoluteTop <= top) candidate = item.anchorId;
      }
      setActiveId(candidate);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [c.items, c.offsetTopPx, mode]);

  function handleClick(anchorId: string) {
    if (mode === 'edit') return;
    const target = document.getElementById(anchorId);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - c.offsetTopPx;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <nav
      className="builder-nav-anchor-menu"
      data-builder-nav-widget="anchor-menu"
      data-builder-anchor-sticky={c.sticky ? 'true' : 'false'}
      aria-label="section navigation"
    >
      <ul>
        {c.items.length === 0 && mode === 'edit' ? (
          <li className="builder-nav-anchor-empty">
            <em>섹션 anchor를 인스펙터에서 추가하세요</em>
          </li>
        ) : (
          c.items.map((item, idx) => (
            <li
              key={`${item.anchorId}-${idx}`}
              data-builder-anchor-active={activeId === item.anchorId ? 'true' : 'false'}
              style={activeId === item.anchorId ? { color: c.activeColor } : undefined}
            >
              <button type="button" onClick={() => handleClick(item.anchorId)}>
                {item.label}
              </button>
            </li>
          ))
        )}
      </ul>
    </nav>
  );
}

function itemsToText(items: BuilderAnchorMenuCanvasNode['content']['items']): string {
  return items.map((it) => `${it.label} | ${it.anchorId}`).join('\n');
}

function parseItems(value: string): BuilderAnchorMenuCanvasNode['content']['items'] {
  const out: BuilderAnchorMenuCanvasNode['content']['items'] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [label, anchorId] = line.split('|').map((part) => part.trim());
    if (!label || !anchorId) continue;
    out.push({ label: label.slice(0, 60), anchorId: anchorId.slice(0, 120) });
  }
  return out.slice(0, 20);
}

function AnchorMenuInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const anchorNode = node as BuilderAnchorMenuCanvasNode;
  const c = anchorNode.content;
  return (
    <>
      <label>
        <span>항목 (label | anchorId)</span>
        <textarea
          rows={5}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={itemsToText(c.items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={c.sticky}
          disabled={disabled}
          onChange={(event) => onUpdate({ sticky: event.target.checked })}
        />
        <span>Sticky</span>
      </label>
      <label>
        <span>Offset top (px)</span>
        <input
          type="number"
          min={0}
          max={400}
          value={c.offsetTopPx}
          disabled={disabled}
          onChange={(event) => onUpdate({ offsetTopPx: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>Active 색</span>
        <input
          type="text"
          value={c.activeColor}
          disabled={disabled}
          onChange={(event) => onUpdate({ activeColor: event.target.value })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'anchor-menu',
  displayName: '앵커 메뉴',
  category: 'advanced',
  icon: '⚓',
  defaultContent: {
    items: [
      { label: '소개', anchorId: 'about' },
      { label: '서비스', anchorId: 'services' },
      { label: '문의', anchorId: 'contact' },
    ],
    sticky: true,
    offsetTopPx: 80,
    activeColor: '#0f172a',
  },
  defaultStyle: {},
  defaultRect: { width: 360, height: 48 },
  Render: AnchorMenuRender,
  Inspector: AnchorMenuInspector,
});
