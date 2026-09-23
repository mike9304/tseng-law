import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HomeAttorneySplit from '@/components/HomeAttorneySplit';
import IntentLandingPage from '@/components/IntentLandingPage';
import { landingContent } from '@/app/[locale]/korean-lawyer-in-taiwan/content';
import { faqContent } from '@/data/faq-content';
import { getAttorneyProfile } from '@/data/attorney-profiles';
import { pageCopy } from '@/data/page-copy';
import { getServiceArea } from '@/data/service-details';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';
import { createAttorneyDecomposedNodes } from '@/lib/builder/canvas/decompose-attorney';
import { buildLegalServiceJsonLd } from '@/lib/seo';

const approvedEnglishHomeTitle =
  'Attorney Wei Tseng, Taiwan Legal Partner for International Clients';
// WO-X1 (EN-01, user decision 2026-09-23): the attorney consults directly in English.
const approvedHomeConsultationPhrase =
  'Consults directly in English, Chinese, Korean, and Japanese — in person in Taipei or by video.';

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
      'Consultations are available in English, Chinese, Korean, and Japanese.',
    );
  });
});

describe('English and Japanese attorney profile audience targeting', () => {
  it('prioritizes Japanese consultation in the Japanese attorney profile', () => {
    const profile = getAttorneyProfile('ja', 'wei-tseng');

    expect(profile).toBeDefined();
    // WO-X1 (J04/J05): Japanese first, English added per the 2026-09-23 decision.
    expect(profile?.description).toContain('日本語・中国語・英語・韓国語でご相談いただけます');
    expect(profile?.description).not.toContain('韓国のクライアント');
    expect(profile?.summary.join('\n')).toContain('日本語・中国語・英語・韓国語で直接ご相談に対応');
    expect(profile?.summary.join('\n')).not.toContain('韓国・日本のクライアント');
    expect(profile?.languages).toEqual(['日本語', '中国語', '英語', '韓国語']);
  });

  it('retargets English profile search terms while preserving the dedicated Korean landing', () => {
    const profile = getAttorneyProfile('en', 'wei-tseng');
    const keywordSurface = JSON.stringify([profile?.keywords, profile?.searchTerms]);
    const dedicatedLanding = JSON.stringify(landingContent.en);

    expect(profile).toBeDefined();
    expect(profile?.keywords).toContain('Wei Tseng Taiwan attorney');
    expect(keywordSurface).toMatch(/Korean clients/i);
    expect(dedicatedLanding).toContain('Korean clients');
    expect(
      faqContent.en.find((item) => item.question === 'How are consultations conducted?'),
    ).toBeDefined();
  });
});

describe('Indexed EN/JA landings crawl to attorney profile', () => {
  it.each(['en', 'ja'] as const)(
    '%s intent landings expose a body link to the attorney profile and no Korean-speaker landing link (WO-X1 EN-15/J21)',
    (locale) => {
      const html = renderToStaticMarkup(
        createElement(IntentLandingPage, { locale, slug: 'taiwan-lawyer' }),
      );
      const profileHref = `href="/${locale}/lawyers/wei-tseng"`;
      const koreanHref = `href="/${locale}/korean-lawyer-in-taiwan"`;

      expect(html.indexOf(profileHref)).toBeGreaterThan(-1);
      expect(html).not.toContain(koreanHref);
    },
  );
});

describe('English and Japanese general-page copy residue', () => {
  it('retargets About and lawyers page chrome away from Korea-Taiwan framing', () => {
    // WO-X1 (EN-12/J04): team pages are named after the nav labels.
    expect(pageCopy.en.about.description).toBe(
      "Learn about Hovering's background and meet our team.",
    );
    expect(pageCopy.en.lawyers.title).toBe('Our Team');
    expect(pageCopy.ja.about.description).toBe(
      '台湾を拠点とする国際的な法律実務と、弁護士・スタッフをご紹介します。',
    );
    expect(pageCopy.ja.lawyers.title).toBe('チーム紹介');
    expect(JSON.stringify({ en: pageCopy.en, ja: pageCopy.ja })).not.toMatch(
      /Korea-Taiwan|韓国・台湾業務チーム/,
    );
  });

  it('widens general EN/JA divorce FAQ subjects without dropping Article 1050 elements', () => {
    const enDivorce = faqContent.en.find((item) =>
      item.question.includes('divorce in Taiwan'),
    );
    const jaDivorce = faqContent.ja.find((item) =>
      item.question.includes('離婚'),
    );

    // WO-X1 (EN-03/J03): nationality-neutral subject, same Article 1050 facts.
    expect(enDivorce?.question).toBe('What is the process for a foreign national to divorce in Taiwan?');
    expect(enDivorce?.question).not.toMatch(/Korean national/i);
    expect(jaDivorce?.question).toBe(
      '外国籍の方が台湾で離婚する場合、どのような手続きが必要ですか？',
    );
    expect(enDivorce?.answer).toContain('in writing');
    expect(enDivorce?.answer).not.toMatch(/Korea/);
    expect(jaDivorce?.answer).toContain('戸政機関で離婚登記');
    expect(jaDivorce?.answer).not.toContain('韓国');
    expect(faqContent.ja.find((item) => item.question === '相談はどのような方式で行われますか？')?.answer).toContain(
      '日本語・中国語・英語・韓国語',
    );
  });

  it('does not single out Japanese businesses on the general EN investment intro', () => {
    const intro = getServiceArea('investment')?.intro.en ?? '';

    expect(intro).toContain('overseas companies and investors');
    expect(intro).not.toMatch(/international and Japanese businesses/i);
  });

  it('does not single out Japanese businesses on the general EN IP intro or labor card', () => {
    expect(getServiceArea('ip')?.intro.en).toContain('international businesses entering Taiwan');
    expect(getServiceArea('ip')?.intro.en).not.toMatch(/international and Japanese businesses/i);
    expect(siteContent.en.services.items.find((item) => item.title === 'Labor & Employment')?.details).toContain(
      'Taiwan employment-law advice for international employers',
    );
    expect(
      JSON.stringify(siteContent.en.services.items.find((item) => item.title === 'Labor & Employment')?.details),
    ).not.toMatch(/Korean businesses/);
    expect(
      JSON.stringify({
        ip: getServiceArea('ip')?.intro.en,
        labor: siteContent.en.services.items.find((item) => item.title === 'Labor & Employment')?.details,
      }),
    ).not.toMatch(/international and Japanese businesses/i);
  });

  it('does not address the general EN labor service page to Korean employers only', () => {
    const laborIntro = getServiceArea('labor')?.intro.en ?? '';

    expect(laborIntro).toContain('We advise employers and employees');
    expect(laborIntro).not.toMatch(/differ from Korea/i);
    expect(laborIntro).not.toMatch(/Korean employers/i);
  });

  it('does not present Korean-bank remittance as the general EN investment rule', () => {
    const remittance = getServiceArea('investment')?.keyPoints.en.find((point) =>
      point.startsWith('Capital-remittance requirements'),
    );

    expect(remittance).toContain('origin country');
    expect(remittance).not.toMatch(/Korean bank branch/i);
    expect(getServiceArea('investment')?.keyPoints.en.join('\n')).not.toMatch(
      /Korean bank branch/i,
    );
  });

  it('does not lead general English chrome with a Korea-first language list', () => {
    expect(siteContent.en.nav.servicesMenu.featured[1]?.description).toBe(
      'Attorney Wei Tseng consults directly in English, Chinese, Korean, and Japanese.',
    );
    expect(siteContent.en.footer.note).toBe(
      'Taiwan legal support for cross-border advisory work and disputes in English, Chinese, Korean, and Japanese.',
    );
    const civil = siteContent.en.services.items.find(
      (item) => item.title === 'Civil Litigation & Damages',
    );
    const criminal = siteContent.en.services.items.find(
      (item) => item.title === 'Criminal Litigation',
    );

    expect(civil?.details).toContain(
      'Litigation support for foreign clients, with client communication in English, Chinese, Korean, or Japanese',
    );
    expect(criminal?.details).toContain(
      'Support for foreign defendants, with firm consultations available in English, Chinese, Korean, and Japanese',
    );
    expect(JSON.stringify({ featured: siteContent.en.nav.servicesMenu.featured, footer: siteContent.en.footer.note, civil: civil?.details, criminal: criminal?.details })).not.toMatch(
      /Korean, Japanese, and English|English- and Korean-language/,
    );
  });

  it('keeps the dedicated Korean landing and the Korea office role, neutrally worded (WO-X1 EN-12)', () => {
    expect(JSON.stringify(landingContent.en)).toContain('Korean clients');
    const son = teamContent.en.members.find((member) => member.id === 'son-jungmin');
    expect(son?.role).toBe('Operations Manager, Korea Office');
    expect(son?.intro[0]).toContain('Korea office');
    expect(son?.intro[0]).not.toContain('Korean clients');
    expect(siteContent.en.stats.description).toContain('four languages');
    expect(siteContent.en.stats.description).toContain(
      'English, Chinese, Korean, and Japanese',
    );
    expect(siteContent.ja.stats.description).toContain('4言語');
    // WO-X1 (J28): Japanese first.
    expect(siteContent.ja.stats.description).toContain(
      '日本語・中国語・英語・韓国語',
    );
  });
});

describe('LegalService JSON-LD audience coverage', () => {
  it('keeps the four language tags (EN page first) and serves Taiwan, the US, Korea and Japan', () => {
    const payload = buildLegalServiceJsonLd('en');

    // WO-X4: United States added; the page language leads the fixed set of four.
    expect(payload.areaServed).toEqual(['Taiwan', 'United States', 'South Korea', 'Japan']);
    expect(payload.knowsLanguage).toEqual(['en', 'ko', 'zh-Hant', 'ja']);
    expect(payload.contactPoint[0]?.availableLanguage).toEqual(['en', 'ko', 'zh-Hant', 'ja']);
  });
});
