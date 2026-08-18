import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import ContactBlocks from '@/components/ContactBlocks';
import HeroSearch from '@/components/HeroSearch';
import HomeContactCta from '@/components/HomeContactCta';
import { createContactDecomposedNodes } from '@/lib/builder/canvas/decompose-contact';
import { createHeroDecomposedNodes } from '@/lib/builder/canvas/decompose-hero';
import { decomposeContactCta } from '@/lib/builder/decompose/contact-cta';
import { decomposeHero } from '@/lib/builder/decompose/hero';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

const EMAIL = 'wei@hoveringlaw.com.tw';
const STALE_KO_SHORT_SUBJECT = ['subject=상담', '%20문의드립니다'].join('');
const STALE_KO_SHORT_SUBJECT_ENCODED = [
  'subject=%EC%83%81%EB%8B%B4',
  '%20%EB%AC%B8%EC%9D%98%EB%93%9C%EB%A6%BD%EB%8B%88%EB%8B%A4',
].join('');
const OWNED_CONSULTATION_CTA_PATHS = [
  'src/components/HeroSearch.tsx',
  'src/components/HomeContactCta.tsx',
  'src/components/YearEndEventPopup.tsx',
  'src/data/contact-page-content.ts',
  'src/data/site-content.ts',
  'src/lib/builder/canvas/decompose-contact.ts',
  'src/lib/builder/canvas/decompose-hero.ts',
  'src/lib/builder/decompose/hero.ts',
  'src/lib/builder/decompose/contact-cta.ts',
] as const;

function linkContent(nodes: ReturnType<typeof createHeroDecomposedNodes>, id: string) {
  const node = nodes.find((candidate) => candidate.id === id);
  return node?.content && 'href' in node.content ? node.content : undefined;
}

describe('consultation email CTAs', () => {
  it('renders the Korean hero primary email CTA before the columns link', () => {
    const html = renderToStaticMarkup(createElement(HeroSearch, { locale: 'ko' }));
    const href = getConsultationPublicMailto('ko').replace(/&/g, '&amp;');

    expect(html).toContain('이메일 상담 신청');
    expect(html).toContain(`href="${href}"`);
    expect(html.indexOf('이메일 상담 신청')).toBeLessThan(html.indexOf('호정칼럼 보기'));
    expect(html).not.toContain('/images/hero-bg-01.webp');
    expect(html).toContain(
      encodeURIComponent(
        '/images/editorial/taichung-courthouse-civic-daylight-v2.webp',
      ),
    );
  });

  it('uses email links instead of consultation phone links on contact surfaces', () => {
    const homeHtml = renderToStaticMarkup(createElement(HomeContactCta, { locale: 'ko' }));
    const contactHtml = renderToStaticMarkup(createElement(ContactBlocks, { locale: 'ko' }));
    const href = getConsultationPublicMailto('ko').replace(/&/g, '&amp;');

    expect(homeHtml).toContain(`이메일 상담: ${EMAIL}`);
    expect(homeHtml).toContain(`href="${href}"`);
    expect(homeHtml).not.toContain('href="tel:');
    expect(contactHtml).toContain(
      `href="${getConsultationPublicMailto('ko').replace(/&/g, '&amp;')}"`,
    );
    expect(contactHtml).toContain('공식 상담 이메일');
    expect(contactHtml).toContain('이메일 주소 복사');
    expect(contactHtml).toContain('초기 문의에는 사건 또는 업무의 개요와 연락처만');
    expect(contactHtml).toContain('증준외 대만 변호사에게 이메일 상담');
    expect(contactHtml).not.toContain('href="tel:');
  });

  it('seeds the decomposed builder hero and contact surfaces with email CTAs', () => {
    const heroNodes = createHeroDecomposedNodes(0, 'ko', 0);
    const genericHeroNodes = decomposeHero('ko', 'hero', {
      x: 0,
      y: 0,
      width: 1280,
      height: 720,
    });
    const contactNodes = createContactDecomposedNodes(0, 'ko', 0);
    const contactCtaNodes = decomposeContactCta('ko', 'contact-cta', {
      x: 0,
      y: 0,
      width: 1280,
      height: 520,
    });

    expect(linkContent(heroNodes, 'home-hero-email-consultation-link')).toMatchObject({
      label: '이메일 상담 신청',
      href: getConsultationPublicMailto('ko'),
    });
    expect(linkContent(heroNodes, 'home-hero-columns-link')).toMatchObject({
      label: '호정칼럼 보기',
      href: '/ko/columns',
    });
    expect(genericHeroNodes.find((node) => node.id === 'hero-background')?.content).toMatchObject({
      src: '/images/hero-taiwan-modern-city-opening.webp',
    });
    expect(linkContent(contactNodes, 'home-contact-email')).toMatchObject({
      label: `이메일 상담: ${EMAIL}`,
      href: getConsultationPublicMailto('ko'),
    });
    expect(linkContent(contactCtaNodes, 'contact-cta-email-button')).toMatchObject({
      label: `이메일 상담: ${EMAIL}`,
      href: getConsultationPublicMailto('ko'),
    });
    expect(JSON.stringify([...contactNodes, ...contactCtaNodes])).not.toContain('tel:');
  });

  it('uses the long localized public mailto template on every owned public CTA surface', () => {
    for (const locale of ['ko', 'zh-hant', 'en', 'ja'] as const) {
      const href = getConsultationPublicMailto(locale);
      const html = renderToStaticMarkup(createElement(HeroSearch, { locale }));

      expect(html).toContain(`href="${href.replace(/&/g, '&amp;')}"`);
      expect(href).toContain('&body=');
      expect(decodeURIComponent(href)).toContain('tseng-law.com');
    }

    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const href = getConsultationPublicMailto(locale);
      const heroNodes = createHeroDecomposedNodes(0, locale, 0);
      const contactCtaNodes = decomposeContactCta(locale, `contact-cta-${locale}`, {
        x: 0,
        y: 0,
        width: 1280,
        height: 520,
      });

      expect(linkContent(heroNodes, 'home-hero-email-consultation-link')?.href).toBe(href);
      expect(linkContent(contactCtaNodes, `contact-cta-${locale}-contact-button`)?.href).toBe(href);
      expect(linkContent(contactCtaNodes, `contact-cta-${locale}-email-button`)?.href).toBe(href);
    }
  });

  it('contains no stale short consultation subject in the owned source paths', () => {
    for (const relativePath of OWNED_CONSULTATION_CTA_PATHS) {
      const source = readFileSync(path.join(process.cwd(), relativePath), 'utf8');

      expect(source).not.toContain(STALE_KO_SHORT_SUBJECT);
      expect(source).not.toContain(STALE_KO_SHORT_SUBJECT_ENCODED);
    }
  });
});
