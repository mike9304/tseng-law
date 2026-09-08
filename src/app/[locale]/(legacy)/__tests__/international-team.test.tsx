import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { siteLocales } from '@/lib/locales';
import { teamContent } from '@/data/team-members';
import { getAboutLegacyMetadata } from '../about-legacy';
import { getLawyersLegacyMetadata } from '../lawyers-legacy';
import { AboutLegacyPageBody, LawyersLegacyPageBody } from '../legacy-page-bodies';

const names = { ko: '호정 국제팀', en: 'Hovering International Team', 'zh-hant': '昊鼎國際團隊', ja: '昊鼎国際チーム' };

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
    for (const oldName of ['Korea-Taiwan Team', 'Taiwan Legal Team', '한국·대만 업무팀', '韓國·台灣 業務團隊', '韓国・台湾業務チーム']) {
      expect(lawyers).not.toContain(oldName);
      expect(about).not.toContain(oldName);
    }
    for (const member of teamContent[locale].members) {
      expect(about).toContain(member.name);
    }
  });
});
