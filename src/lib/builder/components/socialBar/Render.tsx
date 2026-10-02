import type { BuilderSocialBarCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import { getSocialWidgetsCopy } from '../social-widgets-copy';

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
  locale = 'ko',
}: {
  node: BuilderSocialBarCanvasNode;
  locale?: Locale;
  mode?: 'edit' | 'preview' | 'published';
}) {
  const c = node.content;
  const copy = getSocialWidgetsCopy(locale);
  return (
    <nav
      className="builder-social-bar"
      data-builder-social-widget="bar"
      data-builder-social-layout={c.layout}
      data-builder-social-style={c.style}
      aria-label={copy.socialBar.navLabel}
    >
      {c.items.map((it, idx) => (
        <a
          key={`${it.provider}-${idx}`}
          href={it.href}
          target="_blank"
          rel="noopener noreferrer"
          data-builder-social-provider={it.provider}
          style={{ width: c.size, height: c.size, color: c.color }}
          aria-label={it.label ?? copy.providers[it.provider]}
        >
          <span>{PROVIDER_GLYPHS[it.provider] ?? it.provider.slice(0, 2).toUpperCase()}</span>
        </a>
      ))}
    </nav>
  );
}

export default SocialBarRender;
