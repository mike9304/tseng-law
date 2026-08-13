import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import OfficeMapTabs from '@/components/OfficeMapTabs';
import type { SiteLocale } from '@/lib/locales';

const componentSource = readFileSync(
  path.join(process.cwd(), 'src/components/OfficeMapTabs.tsx'),
  'utf8',
);

function render(locale: SiteLocale): string {
  return renderToStaticMarkup(<OfficeMapTabs locale={locale} />);
}

describe('WO-I18N-JA-C02B Japanese office maps', () => {
  it('renders the complete Japanese Taipei view with exact labels and accessible names', () => {
    const html = render('ja');

    expect(html).toContain('>OFFICES<');
    expect(html).toContain('>事務所所在地<');
    expect(html).toContain('role="tablist" aria-label="事務所所在地"');
    expect(html).toContain('>事務所<');
    expect(html).toContain('>電話:');
    expect(html).toContain('>Google マップで見る（写真・口コミ）<');
    expect(html).toContain('>地図プレビュー<');
    expect(html).toContain('>地図を開く<');
    expect(html).toContain('>韓国事務所の所在地<');
    expect(html).toContain('title="台北事務所の地図"');
    expect(html).toContain('>5.0・クチコミ17件<');
    expect(html).not.toContain('aria-label="Googleでの評価は5.0、クチコミは17件です"');
    expect(html).toMatch(
      /class="office-rating-link"[^>]*>[\s\S]*?<span class="office-rating-text">5\.0・クチコミ17件<\/span>/,
    );
    expect(componentSource).toContain("locale === 'ja' ? 'FAX' : 'Fax'");
  });

  it('renders all Japanese office titles, keeps Taipei selected, and preserves canonical office values', () => {
    const html = render('ja');

    expect((html.match(/role="tab"/g) ?? [])).toHaveLength(4);
    expect(html).toMatch(
      /role="tab"[^>]*aria-selected="true"[^>]*>台北事務所<\/button>/,
    );
    expect(html).toMatch(
      /role="tab"[^>]*aria-selected="false"[^>]*>台中事務所<\/button>/,
    );
    expect(html).toMatch(
      /role="tab"[^>]*aria-selected="false"[^>]*>高雄事務所<\/button>/,
    );
    expect(html).toMatch(
      /role="tab"[^>]*aria-selected="false"[^>]*>屏東事務所<\/button>/,
    );
    expect(html).toContain('103 台北市大同区承徳路一段35号7F-2');
    expect(html).not.toContain('台北市大同區承德路一段35號7樓之2');
    expect(html).toContain(
      'src="https://maps.google.com/maps?q=25.0510767,121.5173077&amp;z=16&amp;output=embed"',
    );
    expect(html).toMatch(
      /href="https:\/\/maps\.app\.goo\.gl\/mULpyAnQGz3M1GoQ6" target="_blank" rel="noopener noreferrer"/,
    );
  });

  it('derives Japanese Taiwan and Korea records from the verified Traditional Chinese records with Japanese address copy', () => {
    expect(componentSource).toContain("'zh-hant': zhHantTaiwanOffices");
    expect(componentSource).toMatch(
      /ja: zhHantTaiwanOffices\.map\(\(office\) => \(\{\s+\.\.\.office,\s+title: japaneseTaiwanOfficeTitles\[office\.id\],\s+address: japaneseTaiwanOfficeAddresses\[office\.id\],\s+\}\)\)/,
    );
    expect(componentSource).toContain("'zh-hant': zhHantKoreaOffice");
    expect(componentSource).toMatch(
      /ja: \{\s+\.\.\.zhHantKoreaOffice,\s+title: '韓国事務所',\s+address: '韓国京畿道楊州市玉井東路177 Suhyeon Plaza 4階',\s+mapLinkLabel: 'NAVERマップで見る',/,
    );
  });

  it('defines Japanese-orthography addresses for every Japanese office, without Traditional Chinese remnants', () => {
    for (const expected of [
      "taipei: '103 台北市大同区承徳路一段35号7F-2'",
      "taichung: '40453 台中市北区館前路19号6F-1'",
      "kaohsiung: '81358 高雄市左営区安吉街233号'",
      "pingtung: '90443 屏東県九如郷九如路三段46号'",
    ]) {
      expect(componentSource).toContain(expected);
    }

    const html = render('ja');
    expect(html).not.toContain('臺中市北區館前路19號');
    expect(html).not.toContain('高雄市左營區安吉街233號');
  });

  it('renders exact Japanese Taipei photo alternatives', () => {
    const html = render('ja');

    expect(html).toContain('alt="昊鼎国際法律事務所 台北事務所の応接室"');
    expect(html).toContain('alt="昊鼎国際法律事務所 台北事務所の執務室"');
    expect(html).toContain('alt="昊鼎国際法律事務所 台北事務所の会議室"');
  });

  it('reuses the verified Korea office contact and NAVER destination with Japanese copy', () => {
    const html = render('ja');
    const naverHref =
      'https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%96%91%EC%A3%BC%EC%8B%9C%20%EC%98%A5%EC%A0%95%EB%8F%99%EB%A1%9C%20177%20%EC%88%98%ED%98%84%ED%94%84%EB%9D%BC%EC%9E%90%204%EC%B8%B5';

    expect(html).toContain('>韓国事務所<');
    expect(html).toContain('韓国京畿道楊州市玉井東路177 Suhyeon Plaza 4階');
    expect(html).not.toContain('韓國京畿道楊州市玉井東路177號 Suhyeon Plaza 4樓');
    expect(html).toContain('>+82-10-2992-9304<');
    expect(html).toContain('>NAVERマップで見る<');
    expect((html.match(new RegExp(`href="${naverHref}"`, 'g')) ?? [])).toHaveLength(2);
    expect(html).toMatch(
      new RegExp(
        `href="${naverHref}" target="_blank" rel="noopener noreferrer"`,
      ),
    );
  });

  it.each([
    ['ko', '오시는길', '타이베이', '타이베이 map', 'Google 지도에서 보기 (사진·리뷰)'],
    ['zh-hant', '事務所據點', '台北', '台北 map', '在 Google 地圖查看 (照片·評論)'],
    ['en', 'Office Locations', 'Taipei', 'Taipei map', 'View on Google Maps (photos &amp; reviews)'],
  ] as const)(
    'preserves representative %s office output',
    (locale, title, office, iframeTitle, mapLabel) => {
      const html = render(locale);

      expect(html).toContain(`>${title}<`);
      expect(html).toContain(`>${office}<`);
      expect(html).toContain(`title="${iframeTitle}"`);
      expect(html).toContain(`>${mapLabel}<`);
    },
  );
});
