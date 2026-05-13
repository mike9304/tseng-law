'use client';

import {
  helpTextStyle,
  previewCardStyle,
  sectionStyle,
  sectionTitleStyle,
} from './SeoPanel.styles';

export interface HreflangAlternateResponse {
  hreflang: string;
  locale: string;
  href: string;
}

export interface SiblingPageResponse {
  locale: string;
  pageId: string;
  slug: string;
  hreflang: string;
  noIndex: boolean;
}

interface SeoPanelHreflangTabProps {
  active: boolean;
  hreflangAlternates: HreflangAlternateResponse[];
  siblings: SiblingPageResponse[];
  missingLocales: string[];
  sitemapIncluded: boolean;
}

export function SeoPanelHreflangTab({
  active,
  hreflangAlternates,
  siblings,
  missingLocales,
  sitemapIncluded,
}: SeoPanelHreflangTabProps) {
  return (
    <section style={{ ...sectionStyle, display: active ? 'grid' : 'none' }}>
      <div>
        <h3 style={sectionTitleStyle}>Hreflang 대체 링크</h3>
        <span style={helpTextStyle}>
          Google에 노출되는 alternate-language URL 세트입니다. linkedPageIds(다국어 연결) 기반으로 생성되며,
          x-default 항목은 기본 로케일을 가리킵니다.
        </span>
      </div>
      {hreflangAlternates.length === 0 ? (
        <div style={{ ...previewCardStyle, color: '#64748b' }}>
          아직 발행되지 않았거나 hreflang 데이터가 비어 있습니다.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 6 }}>
          {hreflangAlternates.map((alt) => (
            <div
              key={`${alt.hreflang}:${alt.href}`}
              style={{
                ...previewCardStyle,
                display: 'grid',
                gridTemplateColumns: '90px 1fr',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.78rem',
              }}
            >
              <strong
                style={{
                  color: alt.hreflang === 'x-default' ? '#0f766e' : '#0f172a',
                  fontFamily: 'ui-monospace, Menlo, monospace',
                }}
              >
                {alt.hreflang}
              </strong>
              <span style={{ color: '#334155', wordBreak: 'break-all' }}>{alt.href}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <h3 style={sectionTitleStyle}>다국어 연결 페이지</h3>
        <span style={helpTextStyle}>
          BuilderPageMeta.linkedPageIds 에 등록된 형제 페이지입니다. 누락된 로케일은 페이지 설정에서 연결을 추가하세요.
        </span>
      </div>
      {siblings.length === 0 ? (
        <div style={{ ...previewCardStyle, color: '#64748b' }}>
          연결된 다국어 페이지가 없습니다.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 6 }}>
          {siblings.map((sibling) => (
            <div
              key={sibling.pageId}
              style={{
                ...previewCardStyle,
                display: 'grid',
                gridTemplateColumns: '90px 1fr auto',
                alignItems: 'center',
                gap: 8,
                fontSize: '0.78rem',
              }}
            >
              <strong style={{ fontFamily: 'ui-monospace, Menlo, monospace' }}>{sibling.hreflang}</strong>
              <span style={{ color: '#334155' }}>/{sibling.locale}/{sibling.slug || ''}</span>
              <span
                style={{
                  ...helpTextStyle,
                  color: sibling.noIndex ? '#b45309' : '#15803d',
                  fontWeight: 700,
                }}
              >
                {sibling.noIndex ? 'noindex' : 'indexed'}
              </span>
            </div>
          ))}
        </div>
      )}

      {missingLocales.length > 0 ? (
        <div
          style={{
            ...previewCardStyle,
            background: '#fef3c7',
            borderColor: '#fcd34d',
            color: '#92400e',
            fontSize: '0.78rem',
          }}
        >
          <strong>누락된 로케일: </strong>
          {missingLocales.join(', ')} — 페이지 설정에서 해당 로케일 페이지를 연결하세요.
        </div>
      ) : null}

      <div style={{ marginTop: 8 }}>
        <h3 style={sectionTitleStyle}>Sitemap 포함 상태</h3>
        <span style={helpTextStyle}>
          /sitemap.xml 에 이 페이지가 포함되는지 여부입니다. noIndex 설정 시 sitemap 에서도 제외됩니다.
        </span>
      </div>
      <div
        style={{
          ...previewCardStyle,
          color: sitemapIncluded ? '#065f46' : '#7c2d12',
          background: sitemapIncluded ? '#ecfdf5' : '#fef2f2',
          borderColor: sitemapIncluded ? '#a7f3d0' : '#fecaca',
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <strong>{sitemapIncluded ? 'Sitemap 포함됨' : 'Sitemap 제외'}</strong>
        <span style={helpTextStyle}>
          {sitemapIncluded ? '검색엔진 크롤 가능' : 'noIndex로 인해 색인 차단'}
        </span>
      </div>
    </section>
  );
}
