import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HomeAttorneySplit from '../HomeAttorneySplit';
import { siteContent } from '@/data/site-content';
import { createAttorneyDecomposedNodes } from '@/lib/builder/canvas/decompose-attorney';
import { locales, siteLocales, type Locale, type SiteLocale } from '@/lib/locales';

const reviewedSummaries = {
  ko: '법원 소송 실무와 기업 법률고문 경험을 바탕으로, SBS 뉴스에 법률 의견과 해설을 제공하고 WEI Lawyer를 통해 법률정보를 꾸준히 발행하고 있습니다.',
  'zh-hant': '具備法院訴訟實務與企業法律顧問經驗，曾為 SBS 新聞提供法律意見與解說，並持續透過 WEI Lawyer 發布法律資訊。',
  en: 'With experience in court litigation and corporate legal advisory work, Attorney Wei Tseng has provided legal commentary and advice to SBS News and continues to publish legal information through WEI Lawyer.',
  ja: '裁判所での訴訟実務と企業の法律顧問としての経験を有し、SBSニュースに法律上の意見・解説を提供するとともに、WEI Lawyerを通じて法律情報を継続的に発信しています。',
} as const satisfies Record<SiteLocale, string>;

const canonicalAttorneyNames = {
  ko: '증준외 변호사',
  'zh-hant': '曾雋崴律師',
  en: 'Attorney Wei Tseng',
  ja: '曾雋崴弁護士',
} as const satisfies Record<SiteLocale, string>;

const forbiddenClaims = [
  /10\+/i,
  /10\s*년/u,
  /10\s*年/u,
  /\b\d+\s*\+?\s*(?:years?|yrs?)\b/i,
  /\d+\s*\+?\s*(?:년|年)/u,
  /success[\s-]*rate/i,
  /승소율|성공률/u,
  /勝訴率|成功率/u,
  /case[\s-]*count|number of cases/i,
  /사건\s*수|수임\s*건수/u,
  /案件數|案件件數/u,
  /取扱(?:事件)?件数/u,
  /\brank(?:ed|ing)?\b/i,
  /순위|랭킹/u,
  /排名|排行榜/u,
  /ランキング/u,
  /\bawards?\b/i,
  /수상|포상/u,
  /獲獎|得獎|受賞/u,
  /\bguarantee(?:d|s)?\b/i,
  /보장|장담/u,
  /保證|保障/u,
  /保証/u,
] as const;

const wrongAttorneyIdentities = [
  /曾俊瑋/u,
  /Tseng Jun-Wei/i,
  /Tseng Junwei/i,
] as const;

function getBuilderSummary(locale: Locale): string {
  const summaryNode = createAttorneyDecomposedNodes(0, locale, 0).find(
    ({ id }) => id === 'home-attorney-summary',
  );

  expect(summaryNode).toBeDefined();
  expect(summaryNode?.kind).toBe('text');
  if (summaryNode?.kind !== 'text') {
    throw new Error(`Expected home-attorney-summary to be a text node for ${locale}.`);
  }

  return summaryNode.content.text;
}

function expectNoUnsupportedClaims(serialized: string) {
  for (const forbidden of [...forbiddenClaims, ...wrongAttorneyIdentities]) {
    expect(serialized).not.toMatch(forbidden);
  }
}

describe('homepage attorney factual summary', () => {
  it.each(siteLocales)('matches reviewed site data for %s', (locale) => {
    expect(siteContent[locale].homeAttorney.summary).toBe(reviewedSummaries[locale]);
  });

  it.each(siteLocales)('renders reviewed copy, identity and profile link for %s', (locale) => {
    const html = renderToStaticMarkup(<HomeAttorneySplit locale={locale} />);

    expect(html).toContain(reviewedSummaries[locale]);
    expect(html).toContain(canonicalAttorneyNames[locale]);
    expect(html).toContain(`href="/${locale}/lawyers/wei-tseng"`);
  });

  it.each(locales)('keeps builder summary synchronized for %s', (locale) => {
    expect(getBuilderSummary(locale)).toBe(reviewedSummaries[locale]);
  });

  it('keeps builder authoring locales limited to Korean, Traditional Chinese and English', () => {
    expect(locales).toEqual(['ko', 'zh-hant', 'en']);
    expect(locales).not.toContain('ja');
  });

  it('excludes unsupported tenure, performance and identity claims from every summary surface', () => {
    const publicSurfaces = siteLocales.flatMap((locale) => [
      siteContent[locale].homeAttorney.summary,
      renderToStaticMarkup(<HomeAttorneySplit locale={locale} />),
    ]);
    const builderSurfaces = locales.map((locale) => getBuilderSummary(locale));

    expectNoUnsupportedClaims([...publicSurfaces, ...builderSurfaces].join('\n'));
  });
});
