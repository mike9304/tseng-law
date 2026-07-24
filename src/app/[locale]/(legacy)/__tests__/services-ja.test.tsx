import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { pageCopy } from '@/data/page-copy';
import { siteContent } from '@/data/site-content';
import { ServicesLegacyPageBody } from '../legacy-page-bodies';
import { getLegacyPageMetadata, renderLegacyPage } from '../index';
import { getServicesLegacyMetadata, ServicesLegacyPage } from '../services-legacy';

const SITE_URL = 'https://tseng-law.com';

const builderVisibilityMock = vi.hoisted(() => ({
  read: vi.fn(async () => ({
    visibleBlockIds: [
      'service-areas.list.hero',
      'service-areas.list.repeater',
    ],
  })),
}));

vi.mock('@/lib/builder/dynamic-template-drafts', () => ({
  readBuilderDynamicTemplatePublishedBlockVisibility: builderVisibilityMock.read,
}));

describe('Japanese services-list integration', () => {
  beforeEach(() => {
    builderVisibilityMock.read.mockClear();
  });

  it('publishes Japanese metadata with four-language alternates', () => {
    const metadata = getServicesLegacyMetadata('ja');

    expect(metadata.title).toBe(pageCopy.ja.services.title);
    expect(metadata.description).toBe(pageCopy.ja.services.description);
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/ja/services`);
    expect(metadata.other?.['content-language']).toBe('ja');
    expect(metadata.openGraph).toMatchObject({
      title: pageCopy.ja.services.title,
      description: pageCopy.ja.services.description,
      url: `${SITE_URL}/ja/services`,
      locale: 'ja_JP',
    });
    expect(metadata.alternates?.languages).toEqual({
      ko: `${SITE_URL}/ko/services`,
      'zh-Hant': `${SITE_URL}/zh-hant/services`,
      en: `${SITE_URL}/en/services`,
      ja: `${SITE_URL}/ja/services`,
      'x-default': `${SITE_URL}/ko/services`,
    });
    expect(metadata.keywords).toEqual([
      '台湾会社設立',
      '台湾投資法務',
      '台湾民事訴訟',
      '台湾刑事事件',
      '台湾労働法',
    ]);
  });

  it('passes ja through the services dispatcher without querying builder visibility', async () => {
    const dispatchedMetadata = getLegacyPageMetadata('services', 'ja');
    expect(dispatchedMetadata?.title).toBe(pageCopy.ja.services.title);
    expect(dispatchedMetadata?.title).not.toBe(pageCopy.en.services.title);

    const dispatchedPage = await renderLegacyPage('services', 'ja');
    expect(dispatchedPage?.type).toBe(ServicesLegacyPage);
    expect(dispatchedPage?.props.locale).toBe('ja');

    const japanesePage = await ServicesLegacyPage({ locale: 'ja' });
    expect(japanesePage.type).toBe(ServicesLegacyPageBody);
    expect(japanesePage.props.locale).toBe('ja');
    expect(builderVisibilityMock.read).not.toHaveBeenCalled();

    const englishPage = await ServicesLegacyPage({ locale: 'en' });
    expect(builderVisibilityMock.read).toHaveBeenCalledTimes(1);
    expect(builderVisibilityMock.read).toHaveBeenCalledWith(
      'service-areas.list-template',
      'en',
    );
    expect(englishPage.props.visibleBlockIds).toEqual([
      'service-areas.list.hero',
      'service-areas.list.repeater',
    ]);
  });

  it('renders the reviewed Japanese hero, six accordions, anchors, and column links', () => {
    const html = renderToStaticMarkup(
      <ServicesLegacyPageBody locale="ja" visibleBlockIds={[]} />,
    );

    expect(html).toContain(pageCopy.ja.services.title);
    expect(html).toContain(pageCopy.ja.services.description);
    expect(html).toContain(siteContent.ja.services.description);
    expect(html.match(/aria-expanded="false"/g)).toHaveLength(6);

    for (const serviceTitle of siteContent.ja.services.items.map((item) => item.title)) {
      expect(html).toContain(serviceTitle);
    }
    for (const anchor of [
      'id="investment"',
      'id="civil"',
      'id="family"',
      'id="labor"',
      'id="criminal"',
      'id="ip"',
      '経済部投資審議司',
      '157万新台湾ドル',
      '残余財産差額分配請求',
      '最低勤務期間',
      '先行商標調査',
    ]) {
      expect(html).toContain(anchor);
    }

    expect(html).toContain('関連コラム');
    expect(html.match(/href="\/ja\/columns\//g)).toHaveLength(16);
    expect(html).not.toContain('Related Columns');
    expect(html).not.toContain('View details');
    expect(html).not.toContain('詳細を見る');
    expect(html).not.toMatch(/href="\/ja\/services\/[^"#]+"/);
  });

  it.each([
    ['ko', '관련 칼럼', '자세히 보기 →', '/ko/services/investment'],
    ['zh-hant', '相關專欄', '查看詳情 →', '/zh-hant/services/investment'],
    ['en', 'Related Columns', 'View details →', '/en/services/investment'],
  ] as const)(
    'preserves %s related-column labels and service-detail links',
    (locale, relatedLabel, detailLabel, detailHref) => {
      const html = renderToStaticMarkup(
        <ServicesLegacyPageBody locale={locale} />,
      );

      expect(html).toContain(relatedLabel);
      expect(html).toContain(detailLabel);
      expect(html).toContain(`href="${detailHref}"`);
    },
  );
});
