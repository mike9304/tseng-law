'use client';

import { defineComponent } from '../define';
import type { BuilderCompositeCanvasNode } from '@/lib/builder/canvas/types';
import HeroSearch from '@/components/HeroSearch';
import ServicesBento from '@/components/ServicesBento';
import HomeContactCta from '@/components/HomeContactCta';
import type { Locale } from '@/lib/locales';

function resolveLocale(config: Record<string, unknown> | undefined): Locale {
  const raw = config?.locale;
  if (raw === 'ko' || raw === 'zh-hant' || raw === 'en') return raw;
  return 'ko';
}

function CompositeRender({ node }: { node: BuilderCompositeCanvasNode }) {
  const { componentKey, config } = node.content;
  const locale = resolveLocale(config);

  const body = (() => {
    switch (componentKey) {
      case 'hero-search':
        return <HeroSearch locale={locale} />;
      case 'services-bento':
        return <ServicesBento locale={locale} />;
      case 'home-contact-cta':
        return <HomeContactCta locale={locale} />;
      default:
        return (
          <div style={{ padding: 24, color: '#94a3b8', fontSize: 13 }}>
            Unknown composite: {componentKey}
          </div>
        );
    }
  })();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {body}
    </div>
  );
}

export default defineComponent({
  kind: 'composite',
  displayName: '사이트 블록',
  category: 'domain',
  icon: '◨',
  defaultContent: {
    componentKey: 'hero-search' as const,
    config: {},
  },
  defaultStyle: {},
  defaultRect: { width: 1280, height: 620 },
  Render: CompositeRender,
});
