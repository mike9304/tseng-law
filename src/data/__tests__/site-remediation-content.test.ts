import { createHash } from 'node:crypto';
import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { faqContent } from '@/data/faq-content';
import { insightsArchive } from '@/data/insights-archive';
import { consultationEmail, consultationMailto, siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';

const root = process.cwd();
const expectedPingtungAddress = {
  ko: '90443屏東縣九如鄉九如路三段46號',
  'zh-hant': '90443屏東縣九如鄉九如路三段46號',
  en: 'No. 46, Sec. 3, Jiuru Rd., Jiuru Township, Pingtung County 90443',
  ja: '90443 屏東県九如郷九如路三段46号',
} as const;

describe('consultation email and four-office content contracts', () => {
  const expectedHero = {
    ko: [
      { label: '이메일 상담 신청', href: consultationMailto.ko },
      { label: '호정칼럼 보기', href: '/ko/columns' },
    ],
    'zh-hant': [
      { label: '電子郵件諮詢', href: consultationMailto['zh-hant'] },
      { label: '查看專欄', href: '/zh-hant/columns' },
    ],
    en: [
      { label: 'Email Consultation', href: consultationMailto.en },
      { label: 'View Columns', href: '/en/columns' },
    ],
    ja: [
      { label: 'メールで相談', href: consultationMailto.ja },
      { label: 'コラムを見る', href: '/ja/columns' },
    ],
  } as const;

  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)(
    'uses email as the public consultation channel for %s',
    (locale) => {
      const content = siteContent[locale];
      const consultationHref = consultationMailto[locale];

      expect(content.hero.secondaryLinks).toEqual(expectedHero[locale]);
      expect(content.nav.cta.href).toBe(consultationHref);
      expect(content.quickContact.cta.href).toBe(consultationHref);
      expect(content.contact.cta.href).toBe(consultationHref);
      expect(content.quickContact.actions).toContainEqual(
        expect.objectContaining({ value: consultationEmail, href: consultationHref }),
      );
      expect(content.quickContact.actions.every((action) => action.href === consultationHref)).toBe(
        true,
      );
      expect(content.footer.columns.flatMap((column) => column.links)).toContainEqual(
        expect.objectContaining({ href: consultationHref }),
      );

      const consultationSurface = JSON.stringify({
        navCta: content.nav.cta,
        hero: content.hero.secondaryLinks,
        quickContact: content.quickContact,
        inquiries: content.contact.inquiries,
        contactCta: content.contact.cta,
      });
      expect(consultationSurface).not.toMatch(/010-2992-9304|tel:\+821029929304/);
    },
  );

  it.each(['ko', 'zh-hant', 'en', 'ja'] as const)(
    'lists Pingtung as the fourth Taiwan office for %s',
    (locale) => {
      const locations = siteContent[locale].contact.locations;

      expect(locations).toHaveLength(4);
      expect(locations.at(-1)?.title).toMatch(/핑둥|屏東|Pingtung/);
      expect(locations.at(-1)?.details[0]).toBe(expectedPingtungAddress[locale]);
    },
  );

  it('uses the exact ordered Japanese office addresses', () => {
    expect(siteContent.ja.contact.locations.map((location) => location.details[0])).toEqual([
      '103 台北市大同区承徳路一段35号7F-2',
      '40453 台中市北区館前路19号6F-1',
      '81358 高雄市左営区安吉街233号',
      '90443 屏東県九如郷九如路三段46号',
    ]);
  });
});

describe('WO-1 trust, localization, and performance content contracts', () => {
  it('1-1 removes incorrect Taipei 04 numbers and preserves Taichung 04 / Kaohsiung 07', () => {
    const officeTabs = readFileSync(path.join(root, 'src/components/OfficeMapTabs.tsx'), 'utf8');
    expect(officeTabs).not.toContain("phoneLabel: '대표전화(타이중 본소)'");
    expect(officeTabs).not.toContain("phoneLabel: '代表電話（台中本所）'");
    expect(officeTabs).not.toContain("phoneLabel: 'Main line (Taichung headquarters)'");

    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const locations = siteContent[locale].contact.locations;
      const kaohsiung = locations.find((location) => /가오슝|高雄|Kaohsiung/.test(location.title));
      const taipei = locations.find((location) => /타이베이|台北|Taipei/.test(location.title));
      const taichung = locations.find((location) => /타이중|台中|Taichung/.test(location.title));
      expect(kaohsiung?.details.join(' ')).toContain('07-557-9797');
      expect(taipei?.details.join(' ')).not.toContain('04-2326-1862');
      expect(taipei?.details.join(' ')).not.toContain('04-2326-1863');
      expect(taichung?.details.join(' ')).toContain('04-2326-1862');
    }
  });

  it('1-2 keeps the audited English regions free of inherited Korean copy', () => {
    const korean = /[\uac00-\ud7af]/;
    expect(siteContent.en.stats.items.every((item) => !korean.test(item.label))).toBe(true);
    expect(korean.test(siteContent.en.videos.featured.title)).toBe(false);
    expect(siteContent.en.services.items.every((item) => item.details && item.details.length > 0)).toBe(true);
    expect(insightsArchive.en.posts).toHaveLength(17);
    expect(insightsArchive.en.posts.every((post) => post.keywords.length > 0)).toBe(true);
    expect(insightsArchive.en.posts.every((post) => post.keywords.every((keyword) => !korean.test(keyword)))).toBe(true);
  });

  it('1-3 limits the English consultation language claim to Korean, Chinese, and Japanese', () => {
    const consultation = faqContent.en.find((item) => item.question === 'How are consultations conducted?');
    expect(consultation?.answer).toContain('Korean, Chinese, and Japanese');
    expect(consultation?.answer).not.toContain('English');
  });

  it('1-4 hides Jungmin Son email in every locale while preserving the managing attorney email', () => {
    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      expect(teamContent[locale].members.find((member) => member.id === 'son-jungmin')?.email).toBe('');
      expect(teamContent[locale].members.find((member) => member.id === 'tseng-junwei')?.email).toBe('wei@hoveringlaw.com.tw');
    }
    const renderer = readFileSync(path.join(root, 'src/components/AttorneyProfileSection.tsx'), 'utf8');
    expect(renderer).toContain('{member.email ? (');
  });

  it('1-5 and 1-6 wire request-aware SSR language and localized error boundaries', () => {
    const layout = readFileSync(path.join(root, 'src/app/layout.tsx'), 'utf8');
    const publicLocaleLayout = readFileSync(path.join(root, 'src/app/[locale]/layout.tsx'), 'utf8');
    const builderLocaleLayout = readFileSync(
      path.join(root, 'src/app/(builder)/[locale]/layout.tsx'),
      'utf8',
    );
    const middleware = readFileSync(path.join(root, 'src/middleware.ts'), 'utf8');
    const notFound = readFileSync(path.join(root, 'src/app/[locale]/not-found.tsx'), 'utf8');
    const globalError = readFileSync(path.join(root, 'src/app/global-error.tsx'), 'utf8');

    expect(layout).toContain('<html lang={language}');
    expect(layout).toContain("(await headers()).get('x-tseng-pathname')");
    expect(publicLocaleLayout).not.toContain('LocaleSetter');
    expect(publicLocaleLayout).toContain('<DocumentLocaleSync');
    expect(publicLocaleLayout).toContain('language={language}');
    expect(publicLocaleLayout).toContain('fontClassName={getLocaleFontClassName(language)}');
    expect(publicLocaleLayout).toContain(
      'managedFontClassNames={getManagedLocaleFontClassNames()}',
    );
    expect(publicLocaleLayout).toContain("'zh-hant': 'zh-Hant'");
    expect(builderLocaleLayout).not.toContain('LocaleSetter');
    expect(middleware).toContain("requestHeaders.set('x-tseng-pathname', pathname)");
    expect(notFound).toContain('title: { absolute: `${copy.title} | ${copy.brand}` }');
    expect(notFound).toContain("'zh-hant'");
    expect(globalError).toContain('<html lang={copy.locale}>');
    expect(globalError).toContain('<footer className="global-error-footer">');
  });

  it('1-7 removes external font links and connects next/font variables to the site tokens', () => {
    const layout = readFileSync(path.join(root, 'src/app/layout.tsx'), 'utf8');
    const fonts = readFileSync(path.join(root, 'src/app/fonts.ts'), 'utf8');
    const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
    const publicPage = readFileSync(path.join(root, 'src/lib/builder/site/public-page.tsx'), 'utf8');

    expect(layout).not.toContain('fonts.googleapis.com');
    expect(publicPage).not.toContain('fonts.googleapis.com');
    expect(publicPage).not.toContain('fontsUrl');
    expect(fonts).toContain("display: 'swap'");
    expect(fonts).toContain('preload: false');
    // Locale-gated Noto pairs on <html> so :root semantic tokens resolve
    expect(fonts).toContain('Noto_Sans_KR');
    expect(fonts).toContain('Noto_Sans_TC');
    expect(fonts).toContain('Noto_Serif_KR');
    expect(fonts).toContain('Noto_Serif_TC');
    expect(fonts).toContain('getLocaleFontClassName');
    expect(fonts).toContain('getManagedLocaleFontClassNames');
    expect(fonts).not.toContain('Cormorant_Garamond');
    expect(fonts).not.toContain('IBM_Plex_Sans_KR');
    expect(fonts).not.toContain('JetBrains_Mono');
    expect(layout).toContain('getLocaleFontClassName');
    expect(layout).toContain('className={fontClassName}');
    expect(layout).toMatch(/<html\s+lang=\{language\}\s+className=\{fontClassName\}/);
    expect(css).toContain('var(--font-noto-sans-kr-loaded)');
    expect(css).toContain('var(--font-noto-serif-kr-loaded)');
    expect(css).toContain('var(--font-noto-sans-tc-loaded)');
    expect(css).toContain('var(--font-noto-serif-tc-loaded)');
    expect(css).not.toContain('var(--font-ibm-plex-sans-kr-loaded)');
    expect(css).not.toContain('var(--font-cormorant-garamond-loaded)');
    expect(css).not.toContain('var(--font-jetbrains-mono-loaded)');
    // System mono stack (no next/font mono payload)
    expect(css).toMatch(/--font-mono:\s*ui-monospace/);
    // Closed serif allowlist present; broad h1,h2,h3 serif enforcement removed from late block
    expect(css).toContain('h1.blog-hero-title');
    expect(css).toContain('h1.svc-hero-title');
    expect(css).toContain('.page-header-title');
    expect(css).toContain('.hero-title');
    // Public H2/H3 forced sans (v1) — beats mega-title / CSS-module serif specificity
    expect(css).toMatch(/\.site h2,\s*\n\.site h3\s*\{[^}]*font-family:\s*var\(--font-sans/);
    // About composite-flow repair (not dead page-about-contact-root selector)
    expect(css).toContain("data-node-id='about-page-root-composite'");
    expect(css).toContain("data-node-id='about-page-root'] > div");
    expect(css).not.toContain("data-node-id='page-about-contact-root'");
  });

  it('1-8 keeps the app icon at 512px or below and 32KB or below', () => {
    const iconPath = path.join(root, 'src/app/icon.png');
    const icon = readFileSync(iconPath);
    expect(icon.subarray(1, 4).toString('ascii')).toBe('PNG');
    expect(icon.readUInt32BE(16)).toBeLessThanOrEqual(512);
    expect(icon.readUInt32BE(20)).toBeLessThanOrEqual(512);
    expect(statSync(iconPath).size).toBeLessThanOrEqual(32 * 1024);
  });
});

describe('WO-1b team, navigation, office, and floating-chat contracts', () => {
  it('1b-1 registers Chang Fang-Yu in every locale', () => {
    const expected = {
      ko: ['장방우', '법무전문원'],
      'zh-hant': ['張芳瑀', '法務專員'],
      en: ['Fang-Yu Chang', 'Paralegal'],
    } as const;

    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const members = teamContent[locale].members;
      const chang = members.find((member) => member.id === 'chang-fangyu');
      expect(chang).toMatchObject({
        id: 'chang-fangyu',
        name: expected[locale][0],
        role: expected[locale][1],
        email: 'fangyu@hoveringlaw.com.tw',
        photo: '/images/team/chang-fangyu.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/paralegalchang',
      });
      expect(chang?.education.length).toBeGreaterThanOrEqual(1);
      expect(chang?.experience.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('1b-2 and 1b-3 keep source data but remove its public link and duplicate lawyers heading', () => {
    const attorney = readFileSync(path.join(root, 'src/components/AttorneyProfileSection.tsx'), 'utf8');
    const lawyersBody = readFileSync(
      path.join(root, 'src/app/[locale]/(legacy)/legacy-page-bodies.tsx'),
      'utf8',
    );
    const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');

    expect(teamContent.ko.members.every((member) => Boolean(member.sourceUrl))).toBe(true);
    expect(attorney).not.toContain('attorney-card-source');
    expect(lawyersBody).toContain('<AttorneyProfileSection locale={locale} showIntro={false} />');
    expect(css).toContain("[data-node-id='lawyers-page-root']");
    expect(css).toContain('height: auto !important;');
  });

  it('1b-4 and 1b-5 keep all four Taiwan offices in official order and split out a standalone Korea office', () => {
    const officeTabs = readFileSync(path.join(root, 'src/components/OfficeMapTabs.tsx'), 'utf8');
    expect(officeTabs).toContain("const TAIPEI_EMBED_URL = 'https://maps.google.com/maps?q=25.0510767,121.5173077&z=16&output=embed'");
    expect(officeTabs).toContain("const TAIPEI_MAPS_URL = 'https://maps.app.goo.gl/mULpyAnQGz3M1GoQ6'");
    expect(officeTabs).toContain("mapLinkLabel: '네이버 지도에서 보기'");
    expect(officeTabs).toContain("current.embedUrl ? (");
    expect(officeTabs).toContain('const taiwanOfficeData');
    expect(officeTabs).toContain('const koreaOfficeData');
    expect(officeTabs).toContain("title: '한국 사무실'");
    expect(officeTabs).toContain("title: '韓國辦公室'");
    expect(officeTabs).toContain("title: 'Korea Office'");
    expect(officeTabs).not.toContain("title: '대만 사업 컨설팅 사무실'");
    expect(officeTabs).toContain('map.naver.com/p/search/');
    expect(officeTabs).toContain("const TAIPEI_RATING_VALUE = '5.0'");
    expect(officeTabs).toContain('const TAIPEI_REVIEW_COUNT = 17');
    expect(officeTabs).toContain('Google 플레이스 2026-07-21 기준, 수동 갱신');
    expect(officeTabs).toContain('/images/office/taipei-01.jpg');
    expect(officeTabs).toContain('/images/office/taipei-02.jpg');
    expect(officeTabs).toContain('/images/office/taipei-03.jpg');

    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const locations = siteContent[locale].contact.locations;
      expect(locations).toHaveLength(4);
      expect(locations[0].title).toMatch(/타이베이|台北|Taipei/);
      expect(locations[1].title).toMatch(/타이중|台中|Taichung/);
      expect(locations[2].title).toMatch(/가오슝|高雄|Kaohsiung/);
      expect(locations[3].title).toMatch(/핑둥|屏東|Pingtung/);
      expect(locations[3].details[0]).toBe(expectedPingtungAddress[locale]);
    }
  });

  it('1b-6 uses the complete official seal in desktop and mobile headers', () => {
    for (const component of ['Header.tsx', 'MobileNavDrawer.tsx']) {
      const source = readFileSync(path.join(root, 'src/components', component), 'utf8');
      expect(source).toContain('src="/images/brand/hovering-seal-official.png"');
      expect(source).not.toContain('src="/images/brand/favicon-seal-red-512.png"');
      expect(source).not.toContain('src="/images/brand/hovering-seal-red-512.png"');
      expect(source).toContain('width={40} height={40}');
      expect(source).not.toContain('const brandLogo =');
    }

    const officialSealPath = path.join(root, 'public/images/brand/hovering-seal-official.png');
    const officialSeal = readFileSync(officialSealPath);
    expect(statSync(officialSealPath).size).toBe(230656);
    expect(createHash('sha256').update(officialSeal).digest('hex')).toBe(
      '73c20bf8407d52560fe63f20953fd98e10a34e42924d916edd56ca1dc0e5a8d8',
    );
  });

  it('uses dedicated safe-area favicon assets in root layout, manifest, and builder fallback', () => {
    const dedicated192 = '/images/brand/favicon-seal-red-192.png';
    const dedicated512 = '/images/brand/favicon-seal-red-512.png';

    const layout = readFileSync(path.join(root, 'src/app/layout.tsx'), 'utf8');
    expect(layout).toContain(dedicated192);
    expect(layout).toContain(dedicated512);
    expect(layout).toContain("/favicon.ico");
    expect(layout).toContain('/apple-icon.png');

    const manifest = readFileSync(path.join(root, 'src/app/manifest.ts'), 'utf8');
    expect(manifest).toContain(dedicated192);
    expect(manifest).toContain(dedicated512);

    const publicPage = readFileSync(
      path.join(root, 'src/lib/builder/site/public-page.tsx'),
      'utf8',
    );
    expect(publicPage).toContain(dedicated192);
    expect(publicPage).toContain(dedicated512);
    expect(publicPage).toContain('dedicated safe-area');
  });

  it('1b-7 replaces only the primary Reviews link with localized directions', () => {
    expect(siteContent.ko.nav.primary.at(-1)).toEqual({ label: '오시는길', href: '/ko/contact#offices' });
    expect(siteContent['zh-hant'].nav.primary.at(-1)).toEqual({ label: '交通位置', href: '/zh-hant/contact#offices' });
    expect(siteContent.en.nav.primary.at(-1)).toEqual({ label: 'Directions', href: '/en/contact#offices' });
  });

  it('1b-8 defaults the AI FAB off and clamps the preserved panel to the viewport', () => {
    const widget = readFileSync(path.join(root, 'src/components/QuickContactWidget.tsx'), 'utf8');
    const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
    expect(widget).toContain("process.env.NEXT_PUBLIC_ENABLE_AI_CHAT === 'true'");
    expect(widget).toContain('if ((!AI_CHAT_ENABLED && !previewCollapsed) || !hydrated)');
    expect(css).toContain('width: min(500px, 100vw);');
    expect(css).toContain('max-width: calc(100vw - 1.5rem);');
  });
});
