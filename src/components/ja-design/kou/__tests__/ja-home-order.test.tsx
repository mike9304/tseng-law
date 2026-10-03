import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/ja',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('next/image', () => ({ default: (props: { alt: string; src: string }) => <span data-img={props.alt} data-src={props.src} /> }));

import JaHomeBody from '../JaHomeBody';
import { JA_HERO_CTA_LABEL } from '../JaHero';
import { siteContent } from '@/data/site-content';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { mapColumnPostsToHomeInsights } from '@/lib/insights/home-insight-posts';
import { getAllColumnPosts } from '@/lib/columns';
import { faqContent } from '@/data/faq-content';

const html = renderToStaticMarkup(
  <JaHomeBody posts={mapColumnPostsToHomeInsights(getAllColumnPosts('ja'))} faqItems={faqContent.ja} />,
);

describe('ja home order and first screen (CONCEPT-V2 §4, §15.4)', () => {
  it('renders the chapters in the spec order', () => {
    const ids = ['hero', 'ja-sukashi', 'ja-needs', 'stats', 'practice', 'insights', 'about', 'results', 'ja-fees', 'ja-flow', 'faq', 'offices', 'contact'];
    const positions = ids.map((id) => html.search(new RegExp(`<section\\b[^>]*\\bid="${id}"`)));
    for (const [index, at] of positions.entries()) expect(at, ids[index]).toBeGreaterThan(-1);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  });

  it('has exactly one H1, with the existing title text', () => {
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '';
    expect(h1.replace(/<[^>]+>/g, '')).toBe(siteContent.ja.hero.title);
  });

  it('keeps the CTA text, aria-label and mailto', () => {
    const mailto = getConsultationPublicMailto('ja').replace(/&/g, '&amp;');
    expect(html).toContain(`href="${mailto}"`);
    expect(html).toContain(`aria-label="${JA_HERO_CTA_LABEL} — ${getConsultationCtaLabel('ja')}"`);
    expect(html).toContain(`>${JA_HERO_CTA_LABEL}</a>`);
  });

  it('keeps the closing copy, the FAQ items and the AI author labels', () => {
    expect(html).toContain(siteContent.ja.homeContactCta.title);
    expect(html).toContain(siteContent.ja.homeContactCta.description);
    for (const item of faqContent.ja) expect(html).toContain(item.question.replace(/&/g, '&amp;'));
    expect(html).toContain('法律AIアシスタント');
  });

  it('keeps the 透かし stage visual only: nothing focusable inside the aria-hidden term layer', () => {
    const stage = html.match(/<div[^>]*aria-hidden="true"[^>]*>(?:(?!<\/section>)[\s\S])*?<\/div>/g) ?? [];
    for (const block of stage) expect(block).not.toMatch(/<(a|button|input)\b/);
  });
});
