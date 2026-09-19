import fs from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import HeroSearch from '@/components/HeroSearch';
import GuidanceHomeBody from '@/components/GuidanceHomeBody';
import { InternationalInquiryNotice } from '@/components/InternationalInquiryForm';
import LocaleHomePathNav from '@/components/LocaleHomePathNav';
import CivilCommercialBlock from '@/components/CivilCommercialBlock';
import { guideContent } from '@/app/[locale]/guides/taiwan-company-setup/content';
import TaiwanDebtRecoveryLawyerPage, {
  generateMetadata as generateDebtMetadata,
} from '@/app/[locale]/taiwan-debt-recovery-lawyer/page';
import { debtRecoveryByLocale } from '@/app/[locale]/taiwan-debt-recovery-lawyer/content';
import { getIntentPage } from '@/data/intent-pages';
import { internationalInquiryCopy } from '@/data/international-inquiry-copy';
import { siteContent } from '@/data/site-content';
import {
  CIVIL_COMMERCIAL_COPY,
  CONSULTATION_LANGUAGE_CODES,
  CORE_HOME_PATHS,
  DEBT_RECOVERY_SITUATION_IDS,
  FORBIDDEN_GUARANTEE_PATTERNS,
  GUIDANCE_HOME_PATHS,
  ML_INTERNATIONAL_REVIEW,
} from '@/data/multilingual-international-v2';
import { GUIDANCE_LOCALES_4 } from '@/lib/public-guidance';
import { siteLocales } from '@/lib/locales';
import { buildSeoMetadata, getLocaleLanguageTag } from '@/lib/seo';
import { isGloballyNoindexPath } from '@/lib/seo-visibility';

const JA_COLUMN_001 = path.join(
  process.cwd(),
  'src/content/columns-ja/001-taiwan-company-establishment-basics.md',
);

const EMPTY_GUIDANCE_COLUMNS = {
  sourceLocale: 'en' as const,
  isOriginalLanguage: true,
  posts: [],
};

describe('MULTILINGUAL-INTERNATIONAL-v2 unpublished candidate', () => {
  it('ships the v2 nav, civil block, path module, and this test file', () => {
    const root = process.cwd();
    for (const rel of [
      'src/components/LocaleHomePathNav.tsx',
      'src/components/CivilCommercialBlock.tsx',
      'src/data/multilingual-international-v2.ts',
      'src/components/__tests__/multilingual-international-v2.test.tsx',
    ]) {
      expect(fs.existsSync(path.join(root, rel)), rel).toBe(true);
    }
  });

  it('keeps consultation languages at the four office languages', () => {
    expect([...CONSULTATION_LANGUAGE_CODES]).toEqual(['en', 'zh-hant', 'ja', 'ko']);
    expect(ML_INTERNATIONAL_REVIEW).toEqual({
      review_status: 'NEEDS_LAWYER_REVIEW',
      human_review_required: true,
      publish: false,
    });
    // Every guidance locale must name English as one of the four consultation
    // languages in its own words. A regex union silently passes a locale whose
    // word is missing, so each locale carries its own expected token.
    const englishWordByLocale: Record<(typeof GUIDANCE_LOCALES_4)[number], RegExp> = {
      vi: /tiếng Anh/i,
      id: /Inggris/i,
      th: /อังกฤษ/,
      fil: /Ingles/i,
      ar: /الإنجليزية/,
      de: /Englisch/i,
      es: /inglés/i,
      fr: /anglais/i,
      pt: /inglês/i,
      'zh-hans': /英语/,
      ms: /Inggeris/i,
      ru: /английск/i,
      tr: /İngilizce/i,
      it: /inglese/i,
      nl: /Engels/i,
      pl: /angielsk/i,
      cs: /anglick/i,
      hu: /angolul|angol/i,
      ro: /engleză/i,
      uk: /англійськ/i,
      el: /αγγλικ/i,
      he: /אנגלית/,
      hi: /अंग्रेज़ी/,
      sv: /engelska/i,
      da: /engelsk/i,
      nb: /engelsk/i,
      fi: /englanniksi/i,
    };
    for (const locale of GUIDANCE_LOCALES_4) {
      const notice = internationalInquiryCopy[locale].consultationNotice;
      expect(notice, `${locale} consultation notice`).toMatch(englishWordByLocale[locale]);
      expect(notice).not.toMatch(/9 language|chín ngôn ngữ|sembilan bahasa/i);
    }
  });

  it('does not treat Korean companies as the default Japanese general intro', () => {
    const source = fs.readFileSync(JA_COLUMN_001, 'utf8');
    const introStart = source.indexOf(
      '![](../images/001-taiwan-company-establishment-basics/img-01.jpg)\n\n',
    );
    const introEnd = source.indexOf('\n\n## 1. 台湾への進出形態：子会社・支店・代表者事務所');
    const intro = source.slice(
      introStart + '![](../images/001-taiwan-company-establishment-basics/img-01.jpg)\n\n'.length,
      introEnd,
    );
    expect(intro).not.toMatch(/韓国企業や個人事業者の台湾市場への進出/);
    expect(intro).toMatch(/日本企業や個人事業者/);
    expect(source).toContain('台湾・韓国所得税協定');
    expect(source).not.toContain('台湾・日本所得税協定');
  });

  it('places two first-screen consult paths on each core homepage', () => {
    for (const locale of siteLocales) {
      const html = renderToStaticMarkup(<HeroSearch locale={locale} />);
      const paths = CORE_HOME_PATHS[locale];
      expect(html).toContain(paths.companySetup.label);
      expect(html).toContain(paths.dispute.label);
      expect(html).toContain(`href="${paths.companySetup.href}"`);
      expect(html).toContain(`href="${paths.dispute.href}"`);
      expect(html).toContain(`href="${paths.guide.href}"`);
    }
  });

  it('separates information copy from engagement copy on core company-setup surfaces', () => {
    for (const locale of siteLocales) {
      const guide = guideContent[locale];
      const lawyer = getIntentPage(locale, 'taiwan-company-setup-lawyer');
      expect(guide.planHeading).toBeTruthy();
      expect(guide.lawyerLink?.href).toBe(`/${locale}/taiwan-company-setup-lawyer`);
      expect(lawyer?.title).toBeTruthy();
      expect(guide.title).not.toBe(lawyer?.title);
      expect(guide.planHeading).not.toBe(lawyer?.title);
    }
  });

  it('keeps Korean-client strengths and does not collapse ZH-Hant into foreign-only copy', () => {
    expect(siteContent.ko.hero.typingPhrases.join(' ')).toMatch(/한국/);
    expect(guideContent.ko.steps[2]?.text).toMatch(/한국 은행/);
    expect(guideContent['zh-hant'].description).not.toMatch(/以韓語整理/);
    expect(guideContent['zh-hant'].planIntro).toMatch(/台灣|国内|本地|外國/);
    expect(JSON.stringify(guideContent.ja.costRows)).not.toMatch(/韓国・台湾二重課税協定/);
    expect(JSON.stringify(guideContent.ja.countrySpecificItems)).toMatch(/台湾・韓国所得税協定|韓国/);
  });

  it('renders five unpublished commercial-dispute situations per core locale', async () => {
    for (const locale of siteLocales) {
      const html = renderToStaticMarkup(
        await TaiwanDebtRecoveryLawyerPage({
          params: Promise.resolve({ locale }),
        }),
      );
      const copy = debtRecoveryByLocale[locale];
      expect(copy.situations.map((item) => item.id)).toEqual([...DEBT_RECOVERY_SITUATION_IDS]);
      for (const situation of copy.situations) {
        expect(html).toContain(situation.heading);
        expect(situation.documents.length).toBeGreaterThan(0);
        expect(situation.questions.length).toBeGreaterThan(0);
      }
      expect(html).toMatch(/mailto:/);
      expect(html).toContain(`/${locale}/services/civil`);
      const blob = `${html}${JSON.stringify(copy)}`;
      for (const pattern of FORBIDDEN_GUARANTEE_PATTERNS) {
        expect(blob).not.toMatch(pattern);
      }
      const metadata = await generateDebtMetadata({
        params: Promise.resolve({ locale }),
      });
      expect(metadata.robots).toMatchObject({ index: false });
      expect(metadata.alternates?.languages ?? {}).toEqual({});
    }
    expect(isGloballyNoindexPath('/taiwan-debt-recovery-lawyer')).toBe(true);
  });

  it('describes commercial contract disputes on the shipped civil block without dropping injury copy', () => {
    for (const locale of siteLocales) {
      const html = renderToStaticMarkup(<CivilCommercialBlock locale={locale} />);
      const copy = CIVIL_COMMERCIAL_COPY[locale];
      expect(html).toContain(copy.heading);
      expect(html).toContain(copy.body);
      expect(html).toContain(`href="/${locale}/taiwan-debt-recovery-lawyer"`);
      expect(html).toContain(copy.injuryHeading);
    }
  });

  it('keeps injury and traffic materials reachable on core civil copy', () => {
    expect(JSON.stringify(siteContent.ko)).toMatch(/교통사고|상해/);
    const jaCivil = fs.readFileSync(
      path.join(process.cwd(), 'src/data/service-details-ja.ts'),
      'utf8',
    );
    expect(jaCivil).toContain('交通事故');
    expect(jaCivil).toContain('消費者保護法');
  });

  it('places two information paths on each guidance homepage', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const html = renderToStaticMarkup(
        <GuidanceHomeBody locale={locale} columns={EMPTY_GUIDANCE_COLUMNS} />,
      );
      const paths = GUIDANCE_HOME_PATHS[locale];
      expect(html).toContain(paths.setup.label);
      expect(html).toContain(paths.legal.label);
      expect(html).toContain(`href="${paths.setup.href}"`);
      expect(html).toContain(`href="${paths.legal.href}"`);
      expect(html).toContain('data-ml-path="setup-info"');
      expect(html).toContain('data-ml-path="legal-info"');
    }
  });

  it('states the four consultation languages before inquiry, without interpretation or booking promises', () => {
    for (const locale of GUIDANCE_LOCALES_4) {
      const html = renderToStaticMarkup(<InternationalInquiryNotice locale={locale} />);
      const copy = internationalInquiryCopy[locale];
      expect(html).toContain(copy.consultationNotice);
      const blob = `${html}${copy.consultationNotice}${copy.methodConfirmationNotice}`;
      expect(blob).not.toMatch(/interpreter guaranteed|cam kết phiên dịch|menjamin juru bahasa/i);
      expect(blob).not.toMatch(/24 hours|dalam 1 jam|ตอบภายใน/i);
      expect(blob).not.toMatch(/appointment is confirmed|lịch hẹn đã được xác nhận/i);
    }
  });

  it('uses supported hreflang codes and does not invent jp or tl', () => {
    expect(getLocaleLanguageTag('ja')).toBe('ja');
    expect(getLocaleLanguageTag('fil')).toBe('fil');
    expect(getLocaleLanguageTag('zh-hant')).toBe('zh-Hant');
    expect(getLocaleLanguageTag('ar')).toBe('ar');
  });

  it('gives independently localized pages their own canonical and leaves P07 out of hreflang', async () => {
    for (const locale of siteLocales) {
      const guide = buildSeoMetadata({
        locale,
        title: guideContent[locale].metaTitle,
        description: guideContent[locale].description,
        path: '/guides/taiwan-company-setup',
      });
      expect(String(guide.alternates?.canonical)).toBe(
        `https://tseng-law.com/${locale}/guides/taiwan-company-setup`,
      );
      const p07 = await generateDebtMetadata({
        params: Promise.resolve({ locale }),
      });
      expect(p07.robots).toMatchObject({ index: false });
      expect(p07.alternates?.languages ?? {}).toEqual({});
    }
  });

  it('renders locale path nav from the shipped component for ja and vi', () => {
    const ja = renderToStaticMarkup(<LocaleHomePathNav locale="ja" tone="dark" />);
    expect(ja).toContain(CORE_HOME_PATHS.ja.companySetup.label);
    expect(ja).toContain('href="/ja/taiwan-company-setup-lawyer"');
    const vi = renderToStaticMarkup(<LocaleHomePathNav locale="vi" tone="dark" />);
    expect(vi).toContain(GUIDANCE_HOME_PATHS.vi.setup.label);
    expect(vi).toContain('href="/vi/services"');
  });
});
