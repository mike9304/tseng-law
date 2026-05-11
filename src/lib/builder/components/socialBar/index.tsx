import { defineComponent, type BuilderComponentInspectorProps } from '../define';
import type { BuilderSocialBarCanvasNode } from '@/lib/builder/canvas/types';

const PROVIDER_GLYPHS: Record<string, string> = {
  instagram: 'IG',
  facebook: 'f',
  twitter: '𝕏',
  x: '𝕏',
  threads: '@',
  youtube: 'YT',
  linkedin: 'in',
  tiktok: 'TT',
  whatsapp: 'WA',
  line: 'LN',
  kakao: 'K',
  naver: 'N',
};

function SocialBarRender({
  node,
}: {
  node: BuilderSocialBarCanvasNode;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  return (
    <nav
      className="builder-social-bar"
      data-builder-social-widget="bar"
      data-builder-social-layout={c.layout}
      data-builder-social-style={c.style}
      aria-label="social links"
    >
      {c.items.map((it, idx) => (
        <a
          key={`${it.provider}-${idx}`}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          data-builder-social-provider={it.provider}
          style={{ width: c.size, height: c.size, color: c.color }}
          aria-label={it.label ?? it.provider}
        >
          <span>{PROVIDER_GLYPHS[it.provider] ?? it.provider.slice(0, 2).toUpperCase()}</span>
        </a>
      ))}
    </nav>
  );
}

function itemsToText(items: BuilderSocialBarCanvasNode['content']['items']): string {
  return items.map((it) => `${it.provider} | ${it.href}`).join('\n');
}

function parseItems(value: string): BuilderSocialBarCanvasNode['content']['items'] {
  const allowed = new Set(['instagram', 'facebook', 'twitter', 'threads', 'youtube', 'linkedin', 'tiktok', 'whatsapp', 'line', 'kakao', 'naver', 'x']);
  const out: BuilderSocialBarCanvasNode['content']['items'] = [];
  for (const rawLine of value.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const [provider, href] = line.split('|').map((p) => p.trim());
    if (!provider || !allowed.has(provider)) continue;
    out.push({
      provider: provider as BuilderSocialBarCanvasNode['content']['items'][number]['provider'],
      href: (href ?? '').slice(0, 2000),
    });
  }
  return out.slice(0, 20);
}

function SocialBarInspector({
  node,
  onUpdate,
  disabled = false,
}: BuilderComponentInspectorProps) {
  const sbNode = node as BuilderSocialBarCanvasNode;
  const c = sbNode.content;
  return (
    <>
      <label>
        <span>항목 (provider | href)</span>
        <textarea
          rows={5}
          style={{ fontFamily: 'inherit', resize: 'vertical' }}
          value={itemsToText(c.items)}
          disabled={disabled}
          onChange={(event) => onUpdate({ items: parseItems(event.target.value) })}
        />
      </label>
      <label>
        <span>배치</span>
        <select
          value={c.layout}
          disabled={disabled}
          onChange={(event) => onUpdate({ layout: event.target.value as BuilderSocialBarCanvasNode['content']['layout'] })}
        >
          <option value="row">Row</option>
          <option value="column">Column</option>
        </select>
      </label>
      <label>
        <span>스타일</span>
        <select
          value={c.style}
          disabled={disabled}
          onChange={(event) => onUpdate({ style: event.target.value as BuilderSocialBarCanvasNode['content']['style'] })}
        >
          <option value="plain">Plain</option>
          <option value="solid">Solid</option>
          <option value="outline">Outline</option>
        </select>
      </label>
      <label>
        <span>크기</span>
        <input
          type="number"
          min={24}
          max={80}
          value={c.size}
          disabled={disabled}
          onChange={(event) => onUpdate({ size: Number(event.target.value) })}
        />
      </label>
      <label>
        <span>색</span>
        <input
          type="text"
          value={c.color}
          disabled={disabled}
          onChange={(event) => onUpdate({ color: event.target.value })}
        />
      </label>
    </>
  );
}

export default defineComponent({
  kind: 'social-bar',
  displayName: '소셜 바',
  category: 'advanced',
  icon: 'SB',
  defaultContent: {
    items: [
      { provider: 'instagram' as const, href: 'https://instagram.com/' },
      { provider: 'youtube' as const, href: 'https://youtube.com/' },
      { provider: 'linkedin' as const, href: 'https://linkedin.com/' },
    ],
    layout: 'row' as const,
    style: 'plain' as const,
    size: 36,
    color: '#0f172a',
  },
  defaultStyle: {},
  defaultRect: { width: 200, height: 48 },
  Render: SocialBarRender,
  Inspector: SocialBarInspector,
});
