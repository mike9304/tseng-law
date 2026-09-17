import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { siteLocales } from '@/lib/locales';
import { teamContent } from '@/data/team-members';
import { getAboutLegacyMetadata } from '../about-legacy';
import { getLawyersLegacyMetadata } from '../lawyers-legacy';
import { AboutLegacyPageBody, LawyersLegacyPageBody } from '../legacy-page-bodies';

// WO-O22 C: each language now names the team it serves instead of a single
// "International Team" string. Kept literal (not imported) so a silent edit to
// `TEAM_NAME_BY_LOCALE` cannot make this test agree with itself.
const names = {
  ko: '호정 대만·한국 팀',
  en: 'Hovering English Team',
  'zh-hant': '昊鼎韓國台灣團隊',
  ja: '昊鼎日本語チーム',
};

describe('International team branding across public routes', () => {
  it.each(siteLocales)('%s connects visible team names, metadata and collection identity', (locale) => {
    const name = names[locale];
    const lawyers = renderToStaticMarkup(<LawyersLegacyPageBody locale={locale} />);
    const about = renderToStaticMarkup(<AboutLegacyPageBody locale={locale} />);
    expect(lawyers).toContain(name);
    expect(about).toContain(name);
    expect(getLawyersLegacyMetadata(locale).title).toBe(name);
    expect(getLawyersLegacyMetadata(locale).keywords).toContain(name);
    expect(getAboutLegacyMetadata(locale).keywords).toContain(name);
    const graphs = [...lawyers.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)]
      .map((match) => JSON.parse(match[1]));
    const collection = graphs.find((graph) => graph['@type'] === 'CollectionPage');
    expect(collection?.name).toBe(name);
    for (const oldName of [
      'Korea-Taiwan Team',
      'Taiwan Legal Team',
      '한국·대만 업무팀',
      '韓國·台灣 業務團隊',
      '韓国・台湾業務チーム',
      '호정 국제팀',
      'Hovering International Team',
      '昊鼎國際團隊',
      '昊鼎国際チーム',
    ]) {
      expect(lawyers).not.toContain(oldName);
      expect(about).not.toContain(oldName);
    }
    for (const member of teamContent[locale].members) {
      expect(about).toContain(member.name);
    }
  });
});
