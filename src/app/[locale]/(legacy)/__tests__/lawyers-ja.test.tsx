import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { pageCopy } from '@/data/page-copy';
import { LawyersLegacyPageBody } from '../legacy-page-bodies';
import { getLegacyPageMetadata, renderLegacyPage } from '../index';
import { getLawyersLegacyMetadata, LawyersLegacyPage } from '../lawyers-legacy';

const SITE_URL = 'https://tseng-law.com';

const builderVisibilityMock = vi.hoisted(() => ({
  read: vi.fn(async () => ({
    visibleBlockIds: [
      'attorney-profiles.list.hero',
      'attorney-profiles.list.repeater',
      'attorney-profiles.list.seo',
    ],
  })),
}));

vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: builderVisibilityMock.read,
}));

describe('Japanese lawyers-list integration', () => {
  beforeEach(() => {
    builderVisibilityMock.read.mockClear();
  });

  it('publishes Japanese metadata with four-language alternates', () => {
    const metadata = getLawyersLegacyMetadata('ja');

    expect(metadata.title).toBe(pageCopy.ja.lawyers.title);
    expect(metadata.description).toBe(pageCopy.ja.lawyers.description);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/lawyers`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: pageCopy.ja.lawyers.title,
      description: pageCopy.ja.lawyers.description,
      url: `${SITE_URL}/ja/lawyers`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/lawyers`,
      'zh-Hant': `${SITE_URL}/zh-hant/lawyers`,
      en: `${SITE_URL}/en/lawyers`,
      ja: `${SITE_URL}/ja/lawyers`,
      'x-default': `${SITE_URL}/ko/lawyers`,
    });
    expect(metadata.keywords).toEqual([
      '曾雋崴弁護士',
      '台湾弁護士',
      '昊鼎国際法律事務所',
      '韓国語対応の台湾弁護士',
    ]);
  });

  it('passes ja through the dispatcher and skips builder visibility storage', async () => {
    const dispatchedMetadata = getLegacyPageMetadata('lawyers', 'ja');
    expect(dispatchedMetadata?.title).toBe(pageCopy.ja.lawyers.title);
    expect(dispatchedMetadata?.title).not.toBe(pageCopy.en.lawyers.title);

    const dispatchedPage = await renderLegacyPage('lawyers', 'ja');
    expect(dispatchedPage?.type).toBe(LawyersLegacyPage);
    expect(dispatchedPage?.props.locale).toBe('ja');

    const japanesePage = await LawyersLegacyPage({ locale: 'ja' });
    expect(japanesePage.type).toBe(LawyersLegacyPageBody);
    expect(japanesePage.props.locale).toBe('ja');
    expect(builderVisibilityMock.read).not.toHaveBeenCalled();

    const englishPage = await LawyersLegacyPage({ locale: 'en' });
    expect(builderVisibilityMock.read).toHaveBeenCalledTimes(1);
    expect(builderVisibilityMock.read).toHaveBeenCalledWith(
      'attorney-profiles.list-template',
      'en',
    );
    expect(englishPage.props.visibleBlockIds).toEqual([
      'attorney-profiles.list.hero',
      'attorney-profiles.list.repeater',
      'attorney-profiles.list.seo',
    ]);
  });

  it('renders all Japanese blocks, the native profile link, and Japanese JSON-LD', () => {
    const html = renderToStaticMarkup(
      <LawyersLegacyPageBody locale="ja" visibleBlockIds={[]} />,
    );

    expect(html).toContain(pageCopy.ja.lawyers.title);
    expect(html).toContain(pageCopy.ja.lawyers.description);
    expect(html).toContain('曾雋崴弁護士');
    expect(html).toContain('台湾弁護士・代表弁護士');
    expect(html).toContain('所属弁護士・スタッフ');
    expect(html).toContain('提携会計士');
    expect(html).toContain('href="/ja/lawyers/wei-tseng"');
    expect(html).toContain('https://tseng-law.com/ja/lawyers');
    expect(html).toContain('"inLanguage":"ja"');
    expect(html).toContain('"name":"ホーム"');

    expect(html).not.toContain(pageCopy.en.lawyers.title);
    expect(html).not.toContain('Managing Attorney');
    expect(html).not.toContain('Lawyers &amp; Staff');
  });

  it.each(['ko', 'zh-hant', 'en'] as const)(
    'preserves %s builder-backed list visibility',
    async (locale) => {
      await LawyersLegacyPage({ locale });
      expect(builderVisibilityMock.read).toHaveBeenCalledWith(
        'attorney-profiles.list-template',
        locale,
      );
      expect(getLawyersLegacyMetadata(locale).alternates?.languages).toEqual({
        ko: `${SITE_URL}/ko/lawyers`,
        'zh-Hant': `${SITE_URL}/zh-hant/lawyers`,
        en: `${SITE_URL}/en/lawyers`,
        ja: `${SITE_URL}/ja/lawyers`,
        'x-default': `${SITE_URL}/ko/lawyers`,
      });
    },
  );
});
