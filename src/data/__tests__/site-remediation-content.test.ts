import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { faqContent } from '@/data/faq-content';
import { insightsArchive } from '@/data/insights-archive';
import { siteContent } from '@/data/site-content';
import { teamContent } from '@/data/team-members';

const root = process.cwd();

describe('WO-1 trust, localization, and performance content contracts', () => {
  it('1-1 labels Taipei as the Taichung main line and preserves Kaohsiung 07 numbers', () => {
    const officeTabs = readFileSync(path.join(root, 'src/components/OfficeMapTabs.tsx'), 'utf8');
    expect(officeTabs).toContain("phoneLabel: '대표전화(타이중 본소)'");
    expect(officeTabs).toContain("phoneLabel: '代表電話（台中本所）'");
    expect(officeTabs).toContain("phoneLabel: 'Main line (Taichung headquarters)'");

    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const locations = siteContent[locale].contact.locations;
      const kaohsiung = locations.find((location) => /가오슝|高雄|Kaohsiung/.test(location.title));
      const taipei = locations.find((location) => /타이베이|台北|Taipei/.test(location.title));
      expect(kaohsiung?.details.join(' ')).toContain('07-557-9797');
      expect(taipei?.details.join(' ')).toMatch(/타이중 본소|台中本所|Taichung headquarters/);
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

  it('1-3 limits the English consultation language claim to Korean and Chinese', () => {
    const consultation = faqContent.en.find((item) => item.question === 'How are consultations conducted?');
    expect(consultation?.answer).toContain('Korean and Chinese');
    expect(consultation?.answer).not.toContain('Korean, Chinese, and English');
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
    expect(layout).toContain("headers().get('x-tseng-pathname')");
    expect(publicLocaleLayout).not.toContain('LocaleSetter');
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
    expect(css).toContain('var(--font-ibm-plex-sans-kr-loaded)');
    expect(css).toContain('var(--font-noto-serif-tc-loaded)');
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

  it('1b-4 and 1b-5 put Taipei first and provide the Yangju Naver-only address card', () => {
    const officeTabs = readFileSync(path.join(root, 'src/components/OfficeMapTabs.tsx'), 'utf8');
    expect(officeTabs).toContain("const TAIPEI_EMBED_URL = 'https://maps.google.com/maps?q=25.0510767,121.5173077&z=16&output=embed'");
    expect(officeTabs).toContain("const TAIPEI_MAPS_URL = 'https://maps.app.goo.gl/mULpyAnQGz3M1GoQ6'");
    expect(officeTabs).toContain("mapLinkLabel: '네이버 지도에서 보기'");
    expect(officeTabs).toContain("title: '대만 사업 컨설팅 사무실'");
    expect(officeTabs).toContain("current.embedUrl ? (");

    for (const locale of ['ko', 'zh-hant', 'en'] as const) {
      const locations = siteContent[locale].contact.locations;
      expect(locations).toHaveLength(3);
      expect(locations[0].title).toMatch(/타이베이|台北|Taipei/);
      expect(locations[1].title).toMatch(/타이중|台中|Taichung/);
      expect(locations[2].title).toMatch(/가오슝|高雄|Kaohsiung/);
    }
  });

  it('1b-6 uses the square seal in desktop and mobile headers', () => {
    for (const component of ['Header.tsx', 'MobileNavDrawer.tsx']) {
      const source = readFileSync(path.join(root, 'src/components', component), 'utf8');
      expect(source).toContain('src="/images/brand/hovering-seal-red-512.png"');
      expect(source).toContain('width={40} height={40}');
      expect(source).not.toContain('const brandLogo =');
    }
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
    expect(widget).toContain('if (!AI_CHAT_ENABLED || !hydrated)');
    expect(css).toContain('width: min(500px, 100vw);');
    expect(css).toContain('max-width: calc(100vw - 1.5rem);');
  });
});
