import type { Locale } from '@/lib/locales';

export interface SeoPanelHreflangCopy {
  title: string;
  description: string;
  empty: string;
  siblingsTitle: string;
  siblingsDescription: string;
  siblingsEmpty: string;
  missing: string;
  missingHint: string;
  sitemapTitle: string;
  sitemapDescription: string;
  included: string;
  excluded: string;
  crawlable: string;
  blocked: string;
  noIndex: string;
  indexed: string;
}

export function getSeoPanelHreflangCopy(locale: Locale): SeoPanelHreflangCopy {
  if (locale === 'zh-hant') {
    return {
      title: 'Hreflang 替代連結',
      description: 'Google 可見的 alternate-language URL 集合。依 linkedPageIds（多語系連結）生成，x-default 指向預設語系。',
      empty: '尚未發佈或 hreflang 資料為空。',
      siblingsTitle: '多語系連結頁面',
      siblingsDescription: '已登錄於 BuilderPageMeta.linkedPageIds 的兄弟頁面。缺少的語系請在頁面設定中補上。',
      siblingsEmpty: '沒有已連結的多語系頁面。',
      missing: '缺少的語系：',
      missingHint: '請在頁面設定中連結對應語系頁面。',
      sitemapTitle: 'Sitemap 納入狀態',
      sitemapDescription: '/sitemap.xml 是否包含此頁面。若設定 noIndex，Sitemap 也會排除。',
      included: '已包含於 Sitemap',
      excluded: '已排除於 Sitemap',
      crawlable: '可供搜尋引擎抓取',
      blocked: '因 noIndex 阻止索引',
      noIndex: 'noindex',
      indexed: '已索引',
    };
  }

  if (locale === 'en') {
    return {
      title: 'Hreflang alternate links',
      description: 'The alternate-language URL set visible to Google. It is generated from linkedPageIds, and x-default points at the default locale.',
      empty: 'Nothing has been published yet or the hreflang data is empty.',
      siblingsTitle: 'Linked locale pages',
      siblingsDescription: 'Sibling pages registered in BuilderPageMeta.linkedPageIds. Add missing locales from page settings.',
      siblingsEmpty: 'No linked locale pages.',
      missing: 'Missing locales: ',
      missingHint: 'Link the corresponding locale pages in page settings.',
      sitemapTitle: 'Sitemap inclusion',
      sitemapDescription: 'Whether this page is included in /sitemap.xml. noIndex pages are excluded from the sitemap too.',
      included: 'Included in sitemap',
      excluded: 'Excluded from sitemap',
      crawlable: 'Search-engine crawlable',
      blocked: 'Indexing blocked by noIndex',
      noIndex: 'noindex',
      indexed: 'indexed',
    };
  }

  return {
    title: 'Hreflang 대체 링크',
    description: 'Google에 노출되는 대체 언어 URL 세트입니다. linkedPageIds(다국어 연결)를 기반으로 생성되며 x-default는 기본 로케일을 가리킵니다.',
    empty: '아직 발행되지 않았거나 hreflang 데이터가 비어 있습니다.',
    siblingsTitle: '다국어 연결 페이지',
    siblingsDescription: 'BuilderPageMeta.linkedPageIds에 등록된 형제 페이지입니다. 누락된 로케일은 페이지 설정에서 연결을 추가하세요.',
    siblingsEmpty: '연결된 다국어 페이지가 없습니다.',
    missing: '누락된 로케일: ',
    missingHint: '페이지 설정에서 해당 로케일 페이지를 연결하세요.',
    sitemapTitle: 'Sitemap 포함 상태',
    sitemapDescription: '/sitemap.xml에 이 페이지가 포함되는지 여부입니다. noIndex 설정 시 sitemap에서도 제외됩니다.',
    included: 'Sitemap 포함됨',
    excluded: 'Sitemap 제외',
    crawlable: '검색엔진 크롤 가능',
    blocked: 'noIndex로 인해 색인 차단',
    noIndex: 'noindex',
    indexed: '색인 가능',
  };
}
