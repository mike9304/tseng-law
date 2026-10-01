import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { Children, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/ja',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('next/image', () => ({
  default: (props: { alt: string; src: string }) => <span data-img={props.alt} data-src={props.src} />,
}));

import HeroSearch from '@/components/HeroSearch';
import { LegacyHomePageBody } from '@/app/[locale]/(legacy)/home-legacy';
import JaHeroMedia, { JA_HERO_MEDIA } from '@/components/ja-design/JaHeroMedia';
import JaHeroTrust, { JA_HERO_READ_LABEL } from '@/components/ja-design/JaHeroTrust';
import { heroTrustCopy } from '@/components/HeroTrustStrip';

const pub = (file: string) => path.join(process.cwd(), 'public', file);

describe('ja home first screen (Apple pass)', () => {
  it('ships its generated plate within the media budgets', () => {
    for (const key of ['poster', 'mobilePoster', 'mp4', 'webm'] as const) {
      expect(existsSync(pub(JA_HERO_MEDIA[key])), JA_HERO_MEDIA[key]).toBe(true);
    }
    expect(statSync(pub(JA_HERO_MEDIA.poster)).size).toBeLessThanOrEqual(150 * 1024);
    expect(statSync(pub(JA_HERO_MEDIA.mobilePoster)).size).toBeLessThanOrEqual(150 * 1024);
    expect(statSync(pub(JA_HERO_MEDIA.mp4)).size).toBeLessThanOrEqual(900 * 1024);
    expect(statSync(pub(JA_HERO_MEDIA.webm)).size).toBeLessThanOrEqual(400 * 1024);
  });

  it('renders the media decoratively (empty alt, Japanese pause control only after the video is ready)', () => {
    const html = renderToStaticMarkup(<JaHeroMedia />);
    expect(html).toContain('data-img=""');
    expect(html).not.toContain('<video');
  });

  it('adds one reading path under the email action and keeps the shared trust facts unchanged', () => {
    const html = renderToStaticMarkup(<JaHeroTrust />);
    expect(html).toContain('href="/ja/columns"');
    expect(html).toContain(JA_HERO_READ_LABEL);
    expect(html).toContain(heroTrustCopy.ja.reviewsLink);
    for (const fact of heroTrustCopy.ja.facts) expect(html).toContain(fact);
  });

  it('passes media, trust and six search chips to HeroSearch without changing its locale or presentation', () => {
    const body = LegacyHomePageBody({ locale: 'ja', posts: [], faqItems: [] }) as ReactElement<{ children: ReactElement[] }>;
    const first = Children.toArray(body.props.children)[0] as ReactElement<{ children: ReactElement }>;
    const hero = first.props.children as ReactElement<{
      locale: string;
      presentation: string;
      persistentQuickMenus?: boolean;
      quickMenus?: { label: string; href: string }[];
      media?: ReactElement;
      trustContent?: ReactElement;
    }>;
    expect(hero.type).toBe(HeroSearch);
    expect(hero.props).toMatchObject({ locale: 'ja', presentation: 'editorial', persistentQuickMenus: true });
    expect(hero.props.media?.type).toBe(JaHeroMedia);
    expect(hero.props.trustContent?.type).toBe(JaHeroTrust);
    expect(hero.props.quickMenus).toHaveLength(6);
    for (const chip of hero.props.quickMenus ?? []) {
      expect(chip.href).toBe(`/ja/search?q=${encodeURIComponent(chip.label)}`);
    }
  });
});
