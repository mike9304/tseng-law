import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderBreadcrumbsCanvasNode } from '@/lib/builder/canvas/types';

const SEPARATOR_GLYPH: Record<BuilderBreadcrumbsCanvasNode['content']['separator'], string> = {
  slash: '/',
  chevron: '›',
  dot: '·',
};

function BreadcrumbsRender({
  node,
}: {
  node: BuilderBreadcrumbsCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const items: Array<{ label: string; href?: string }> = [];
  if (c.showHome) items.push({ label: c.homeLabel, href: c.homeHref });
  items.push(...c.items);

  return (
    <nav
      className="builder-nav-breadcrumbs"
      data-builder-nav-widget="breadcrumbs"
      data-builder-breadcrumbs-separator={c.separator}
      aria-label="breadcrumb"
    >
      <ol>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}-${idx}`} data-active={isLast ? 'true' : 'false'}>
              {item.href && !isLast ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
              {!isLast ? (
                <em aria-hidden="true" className="builder-nav-breadcrumbs-sep">
                  {SEPARATOR_GLYPH[c.separator]}
                </em>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function itemsToText(items: BuilderBreadcrumbsCanvasNode['content']['items']): string {
  return items.map((it) => `${it.label} | ${it.href ?? ''}`).join('\n');
}

function parseItems(value: string): BuilderBreadcrumbsCanvasNode['content']['items'] {
  const out: BuilderBreadcrumbsCanvasNode['content']['items'] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [label, href] = line.split('|').map((part) => part.trim());
    if (!label) continue;
    const item: { label: string; href?: string } = { label: label.slice(0, 80) };
    if (href) item.href = href.slice(0, 2000);
    out.push(item);
  }
  return out.slice(0, 10);
}

function BreadcrumbsInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const bcNode = node as BuilderBreadcrumbsCanvasNode;
  const c = bcNode.content;
  return (
    <>
      <label>
        <span>항목 (label | href)</span>
        <textarea
          rows={4}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={itemsToText(c.items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label>
        <span>구분자</span>
        <select
          value={c.separator}
          disabled={disabled}
          onChange={(event) => onUpdate({ separator: event.target.value as BuilderBreadcrumbsCanvasNode['content']['separator'] })}
        >
          <option value="chevron">› (chevron)</option>
          <option value="slash">/ (slash)</option>
          <option value="dot">· (dot)</option>
        </select>
      </label>
      <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <input
          type="checkbox"
          checked={c.showHome}
          disabled={disabled}
          onChange={(event) => onUpdate({ showHome: event.target.checked })}
        />
        <span>홈 표시</span>
      </label>
      <label>
        <span>홈 라벨</span>
        <input
          type="text"
          value={c.homeLabel}
          disabled={disabled}
          onChange={(event) => onUpdate({ homeLabel: event.target.value })}
        />
      </label>
      <label>
        <span>홈 href</span>
        <input
          type="text"
          value={c.homeHref}
          disabled={disabled}
          onChange={(event) => onUpdate({ homeHref: event.target.value })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'breadcrumbs',
  displayName: '브레드크럼',
  category: 'advanced',
  icon: '›',
  defaultContent: {
    items: [
      { label: '서비스', href: '/ko/services' },
      { label: '기업 자문' },
    ],
    separator: 'chevron' as const,
    showHome: true,
    homeLabel: '홈',
    homeHref: '/',
  },
  defaultStyle: {},
  defaultRect: { width: 480, height: 32 },
  Render: BreadcrumbsRender,
  Inspector: BreadcrumbsInspector,
});
