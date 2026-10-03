import { existsSync, statSync } from 'node:fs';
import path from 'node:path';
import type { ReactElement } from 'react';
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

import { LegacyHomePageBody } from '@/app/[locale]/(legacy)/home-legacy';
import JaHeroMedia, { JA_HERO_MEDIA } from '@/components/ja-design/JaHeroMedia';
import JaHeroTrust, { JA_HERO_READ_LABEL } from '@/components/ja-design/JaHeroTrust';
import { heroTrustCopy } from '@/components/HeroTrustStrip';
import JaHomeBody from '@/components/ja-design/kou/JaHomeBody';
import JaHero, { JA_HERO_CTA_LABEL, splitJaHeroTitle } from '@/components/ja-design/kou/JaHero';
import { siteContent } from '@/data/site-content';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';

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

  it('renders the 昊 hero with the existing H1, sub, byline, email action and reading path (ja home V2)', () => {
    const body = LegacyHomePageBody({ locale: 'ja', posts: [], faqItems: [] }) as ReactElement;
    expect(body.type).toBe(JaHomeBody);
    const html = renderToStaticMarkup(<JaHero />);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    expect(h1.replace(/<[^>]+>/g, '')).toBe(siteContent.ja.hero.title);
    expect(splitJaHeroTitle(siteContent.ja.hero.title)).toEqual(['台湾の会社設立・労務・紛争を、', '日本語で。']);
    expect(html).toContain(`href="${getConsultationPublicMailto('ja').replace(/&/g, '&amp;')}"`);
    expect(html).toContain(`aria-label="${JA_HERO_CTA_LABEL} — ${getConsultationCtaLabel('ja')}"`);
    expect(html).toContain('href="/ja/columns"');
    expect(html).toContain(JA_HERO_READ_LABEL);
    expect(html).toContain('href="/ja/lawyers/wei-tseng"');
    expect(html).not.toMatch(/<(b|strong)\b/);
    expect(html).not.toContain('下へスクロール');
    // The first screen keeps the hero media decorative; the film is a client child with the ja stills.
    expect(html).toContain('/images/editorial/ja-kou-hero-light.webp');
    expect(html).toContain('/images/editorial/ja-kou-hero-light-mobile.webp');
  });
});
