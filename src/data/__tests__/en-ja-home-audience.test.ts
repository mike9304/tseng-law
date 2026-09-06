import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import { landingContent } from '@/app/[locale]/korean-lawyer-in-taiwan/content';
import { faqContent } from '@/data/faq-content';
import { getAttorneyProfile } from '@/data/attorney-profiles';
import { siteContent } from '@/data/site-content';
import { createAttorneyDecomposedNodes } from '@/lib/builder/canvas/decompose-attorney';
import { buildLegalServiceJsonLd } from '@/lib/seo';

const approvedEnglishHomeTitle =
  'Attorney Wei Tseng, Taiwan Legal Partner for International Clients';
const approvedHomeConsultationPhrase =
  'Consultations in English, Japanese, Korean, and Mandarin';

function getEnglishBuilderAttorneyTitle(): string {
  const titleNode = createAttorneyDecomposedNodes(0, 'en', 0).find(
    ({ id }) => id === 'home-attorney-title',
  );

  expect(titleNode).toBeDefined();
  expect(titleNode?.kind).toBe('text');
  if (titleNode?.kind !== 'text') {
    throw new Error('Expected home-attorney-title to be a text node.');
  }

  return titleNode.content.text;
}

describe('English and Japanese general-audience home retargeting', () => {
  it('retargets duplicated English homepage attorney titles away from Korean-client audience', () => {
    const renderedHome = renderToStaticMarkup(createElement(HomeAttorneySplit, { locale: 'en' }));

    expect(siteContent.en.homeAttorney.title).toBe(approvedEnglishHomeTitle);
    expect(getEnglishBuilderAttorneyTitle()).toBe(approvedEnglishHomeTitle);
    expect(renderedHome).toContain(approvedEnglishHomeTitle);
    expect(renderedHome).not.toContain('Korean Clients');
    expect(siteContent.en.homeAttorney.title).not.toContain('Korean Clients');
  });

  it('surfaces approved English consultation availability on general English pages', () => {
    const renderedHome = renderToStaticMarkup(createElement(HomeAttorneySplit, { locale: 'en' }));
    const consultation = faqContent.en.find(
      (item) => item.question === 'How are consultations conducted?',
    );

    expect(renderedHome).toContain(approvedHomeConsultationPhrase);
    expect(consultation).toBeDefined();
    expect(consultation?.answer).toContain(
      'Consultations are available in English, Korean, Chinese, and Japanese.',
    );
  });
});

describe('English and Japanese attorney profile audience targeting', () => {
  it('prioritizes Japanese consultation in the Japanese attorney profile', () => {
    const profile = getAttorneyProfile('ja', 'wei-tseng');

    expect(profile).toBeDefined();
    expect(profile?.description).toContain('日本企業・在台日本人');
    expect(profile?.description).not.toContain('韓国のクライアント');
    expect(profile?.summary.join('\n')).toContain('日本語・英語・中国語・韓国語');
    expect(profile?.languages).toEqual(['日本語', '英語', '中国語', '韓国語']);
  });

  it('retargets English profile search terms while preserving the dedicated Korean landing', () => {
    const profile = getAttorneyProfile('en', 'wei-tseng');
    const keywordSurface = JSON.stringify([profile?.keywords, profile?.searchTerms]);
    const dedicatedLanding = JSON.stringify(landingContent.en);

    expect(profile).toBeDefined();
    expect(profile?.keywords).toContain('English speaking Taiwan lawyer');
    expect(keywordSurface).not.toMatch(/Korean clients/i);
    expect(dedicatedLanding).toContain('Korean clients');
    expect(
      faqContent.en.find((item) => item.question === 'How are consultations conducted?'),
    ).toBeDefined();
  });
});

describe('LegalService JSON-LD audience coverage', () => {
  it('keeps language tags stable while adding Japan to the served-area list', () => {
    const payload = buildLegalServiceJsonLd('en');

    expect(payload.areaServed).toEqual(['Taiwan', 'South Korea', 'Japan']);
    expect(payload.knowsLanguage).toEqual(['ko', 'zh-Hant', 'en', 'ja']);
    expect(payload.contactPoint[0]?.availableLanguage).toEqual(['ko', 'zh-Hant', 'en', 'ja']);
  });
});
