import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import type { BuilderSeoAdditionalMetaTag, BuilderStructuredDataBlock } from '@/lib/builder/site/types';
import { SeoPanelBasicsTab } from '../SeoPanelBasicsTab';
import { SeoPanelAssistantTab } from '../SeoPanelAssistantTab';
import { SeoPanelHreflangTab } from '../SeoPanelHreflangTab';
import { SeoPanelSocialTab } from '../SeoPanelSocialTab';
import { SeoPanelAdvancedTab } from '../SeoPanelAdvancedTab';
import { localizedUntitledPage } from '../SeoPanel';

const noop = vi.fn();

const additionalMetaTags: BuilderSeoAdditionalMetaTag[] = [
  { id: 'meta-1', name: 'robots', content: 'index,follow' },
];

const structuredDataBlocks: BuilderStructuredDataBlock[] = [
  {
    id: 'block-1',
    type: 'Article',
    label: 'Article JSON-LD',
    enabled: true,
    json: '{\n  "@context": "https://schema.org",\n  "@type": "Article"\n}',
  },
];

const alternates = [
  { hreflang: 'ko', locale: 'ko', href: '/ko/home' },
  { hreflang: 'en', locale: 'en', href: '/en/home' },
];

const siblings = [
  { hreflang: 'ko', locale: 'ko', pageId: 'page-ko', slug: 'home', noIndex: false },
  { hreflang: 'en', locale: 'en', pageId: 'page-en', slug: 'home', noIndex: true },
];

describe('SeoPanel localization', () => {
  it('renders the localized basics, social, and advanced labels in ko', () => {
    const basics = renderToStaticMarkup(
      <SeoPanelBasicsTab
        active
        locale="ko"
        page={{ slug: 'home' }}
        defaults={{ canonical: 'https://example.com/ko/home' }}
        slug="home"
        canonical="https://example.com/ko/home"
        title="SEO 제목"
        description="메타 설명"
        noIndex={false}
        noFollow={false}
        createRedirect={false}
        canonicalPreview="https://example.com/ko/home"
        searchTitle="SEO 제목"
        searchDescription="메타 설명"
        onChangeTextField={noop}
        onChangeBooleanField={noop}
        onChangeCreateRedirect={noop}
      />,
    );
    expect(basics).toContain('기본 검색 설정');
    expect(basics).toContain('표준 URL');
    expect(basics).toContain('SEO 제목');
    expect(basics).toContain('메타 설명');
    expect(basics).toContain('Google 미리보기');
    expect(basics).toContain('권장 30-60자');

    const social = renderToStaticMarkup(
      <SeoPanelSocialTab
        active
        locale="ko"
        ogTitle="OG 제목"
        ogImage=""
        ogDescription="OG 설명"
        twitterCard="summary_large_image"
        twitterImage=""
        twitterTitle="트위터 제목"
        twitterDescription="트위터 설명"
        socialImage=""
        socialTitle="트위터 제목"
        socialDescription="트위터 설명"
        onChangeTextField={noop}
        onChangeTwitterCard={noop}
      />,
    );
    expect(social).toContain('소셜 공유 설정');
    expect(social).toContain('OG 이미지 미리보기');
    expect(social).toContain('트위터 카드');

    const advanced = renderToStaticMarkup(
      <SeoPanelAdvancedTab
        active
        locale="ko"
        additionalMetaTags={additionalMetaTags}
        structuredData={{
          legalService: true,
          organization: false,
          localBusiness: false,
          faqPage: 'auto',
          breadcrumbList: true,
        }}
        structuredDataBlocks={structuredDataBlocks}
        onAddAdditionalMetaTag={noop}
        onUpdateAdditionalMetaTag={noop}
        onRemoveAdditionalMetaTag={noop}
        onUpdateStructuredField={noop}
        onAddStructuredDataBlock={noop}
        onChangeStructuredDataBlockType={noop}
        onUpdateStructuredDataBlock={noop}
        onRemoveStructuredDataBlock={noop}
      />,
    );
    expect(advanced).toContain('고급 SEO 메타 태그');
    expect(advanced).toContain('JSON-LD 블록');
    expect(advanced).toContain('+ 칼럼');
    expect(advanced).toContain('법률 서비스');

    const hreflang = renderToStaticMarkup(
      <SeoPanelHreflangTab
        active
        locale="ko"
        hreflangAlternates={alternates}
        siblings={siblings}
        missingLocales={['zh-hant']}
        sitemapIncluded
      />,
    );
    expect(hreflang).toContain('Hreflang 대체 링크');
    expect(hreflang).toContain('다국어 연결 페이지');
    expect(hreflang).toContain('Sitemap 포함 상태');

    const assistant = renderToStaticMarkup(
      <SeoPanelAssistantTab
        active
        locale="ko"
        focusKeyword="대만 로펌"
        assistantStatus=""
        assistantTasks={[]}
        localIssues={[]}
        onChangeFocusKeyword={noop}
        onSaveFocusKeyword={noop}
      />,
    );
    expect(assistant).toContain('SEO 도우미');
    expect(assistant).toContain('포커스 키워드');
    expect(assistant).toContain('검증');
    expect(assistant).toContain('SEO 검사 통과');
  });

  it('returns a localized untitled page fallback in ko', () => {
    expect(localizedUntitledPage('ko')).toBe('제목 없음 페이지');
  });

  it('renders the localized basics, social, and advanced labels in zh-hant', () => {
    const basics = renderToStaticMarkup(
      <SeoPanelBasicsTab
        active
        locale="zh-hant"
        page={{ slug: 'home' }}
        defaults={{ canonical: 'https://example.com/zh-hant/home' }}
        slug="home"
        canonical="https://example.com/zh-hant/home"
        title="SEO 標題"
        description="中繼描述"
        noIndex={false}
        noFollow={false}
        createRedirect={false}
        canonicalPreview="https://example.com/zh-hant/home"
        searchTitle="SEO 標題"
        searchDescription="中繼描述"
        onChangeTextField={noop}
        onChangeBooleanField={noop}
        onChangeCreateRedirect={noop}
      />,
    );
    expect(basics).toContain('基本搜尋設定');
    expect(basics).toContain('標準 URL');
    expect(basics).toContain('SEO 標題');
    expect(basics).toContain('中繼描述');
    expect(basics).toContain('Google 預覽');
    expect(basics).toContain('建議 30-60 字元');

    const social = renderToStaticMarkup(
      <SeoPanelSocialTab
        active
        locale="zh-hant"
        ogTitle="OG 標題"
        ogImage=""
        ogDescription="OG 描述"
        twitterCard="summary_large_image"
        twitterImage=""
        twitterTitle="Twitter 標題"
        twitterDescription="Twitter 描述"
        socialImage=""
        socialTitle="Twitter 標題"
        socialDescription="Twitter 描述"
        onChangeTextField={noop}
        onChangeTwitterCard={noop}
      />,
    );
    expect(social).toContain('社群分享設定');
    expect(social).toContain('OG 圖片預覽');
    expect(social).toContain('Twitter 卡片');

    const advanced = renderToStaticMarkup(
      <SeoPanelAdvancedTab
        active
        locale="zh-hant"
        additionalMetaTags={additionalMetaTags}
        structuredData={{
          legalService: true,
          organization: false,
          localBusiness: false,
          faqPage: 'auto',
          breadcrumbList: true,
        }}
        structuredDataBlocks={structuredDataBlocks}
        onAddAdditionalMetaTag={noop}
        onUpdateAdditionalMetaTag={noop}
        onRemoveAdditionalMetaTag={noop}
        onUpdateStructuredField={noop}
        onAddStructuredDataBlock={noop}
        onChangeStructuredDataBlockType={noop}
        onUpdateStructuredDataBlock={noop}
        onRemoveStructuredDataBlock={noop}
      />,
    );
    expect(advanced).toContain('進階 SEO meta tags');
    expect(advanced).toContain('JSON-LD 區塊');
    expect(advanced).toContain('+ 文章');
    expect(advanced).toContain('法律服務');

    const hreflang = renderToStaticMarkup(
      <SeoPanelHreflangTab
        active
        locale="zh-hant"
        hreflangAlternates={alternates}
        siblings={siblings}
        missingLocales={['ko']}
        sitemapIncluded={false}
      />,
    );
    expect(hreflang).toContain('Hreflang 替代連結');
    expect(hreflang).toContain('多語系連結頁面');
    expect(hreflang).toContain('Sitemap 納入狀態');

    const assistant = renderToStaticMarkup(
      <SeoPanelAssistantTab
        active
        locale="zh-hant"
        focusKeyword="台灣律師"
        assistantStatus=""
        assistantTasks={[]}
        localIssues={[]}
        onChangeFocusKeyword={noop}
        onSaveFocusKeyword={noop}
      />,
    );
    expect(assistant).toContain('SEO 助理');
    expect(assistant).toContain('焦點關鍵字');
    expect(assistant).toContain('驗證');
    expect(assistant).toContain('SEO 檢查通過');
  });

  it('returns a localized untitled page fallback in zh-hant', () => {
    expect(localizedUntitledPage('zh-hant')).toBe('未命名頁面');
  });
});
