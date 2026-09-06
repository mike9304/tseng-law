import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import { landingContent } from '@/app/[locale]/korean-lawyer-in-taiwan/content';
import { faqContent } from '@/data/faq-content';
import { getAttorneyProfile } from '@/data/attorney-profiles';
import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
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

describe('English and Japanese general-page copy residue', () => {
  it('retargets About and lawyers page chrome away from Korea-Taiwan framing', () => {
    expect(pageCopy.en.about.description).toBe(
      'Learn our story and meet the international legal team.',
    );
    expect(pageCopy.en.lawyers.title).toBe('Hovering International Team');
    expect(pageCopy.ja.about.description).toBe(
      '事務所の概要と国際法務チームをご紹介します。',
    );
    expect(pageCopy.ja.lawyers.title).toBe('昊鼎 日本・国際法務チーム');
    expect(JSON.stringify({ en: pageCopy.en, ja: pageCopy.ja })).not.toMatch(
      /Korea-Taiwan|韓国・台湾業務チーム/,
    );
  });

  it('widens general EN/JA divorce FAQ subjects without dropping Article 1050 elements', () => {
    const enDivorce = faqContent.en.find((item) =>
      item.question.includes('cross-border divorce'),
    );
    const jaDivorce = faqContent.ja.find((item) =>
      item.question.includes('国際離婚'),
    );

    expect(enDivorce?.question).not.toMatch(/Korean national/i);
    expect(jaDivorce?.question).not.toBe(
      '韓国人が台湾で離婚するには、どのような手続きが必要ですか？',
    );
    expect(enDivorce?.answer).toContain('in writing');
    expect(jaDivorce?.answer).toContain('戸政機関で離婚登記');
    expect(faqContent.ja.find((item) => item.question === '相談はどのような方式で行われますか？')?.answer).toContain(
      '日本語・英語・中国語・韓国語',
    );
  });

  it('keeps the dedicated Korean landing and Korea operations role intact', () => {
    expect(JSON.stringify(landingContent.en)).toContain('Korean clients');
    expect(teamContent.en.members.find((member) => member.id === 'son-jungmin')?.intro[0]).toContain(
      'Korean clients',
    );
    expect(siteContent.en.stats.description).toContain('three working languages');
    expect(siteContent.en.stats.description).toContain('Consultations are also available in English.');
    expect(siteContent.ja.stats.description).toContain('3言語');
    expect(siteContent.ja.stats.description).toContain('英語でのご相談にも対応しています。');
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
