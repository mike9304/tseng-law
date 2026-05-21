'use client';

import {
  SEO_DESCRIPTION_MAX,
  SEO_DESCRIPTION_MIN,
  SEO_TITLE_MAX,
  SEO_TITLE_MIN,
} from '@/lib/builder/seo/validation';
import {
  checkboxGridStyle,
  checkboxRowStyle,
  fieldStyle,
  helpTextStyle,
  inputStyle,
  labelStyle,
  previewCardStyle,
  sectionStyle,
  sectionTitleStyle,
  textareaStyle,
  twoColumnStyle,
} from './SeoPanel.styles';

export type SeoBasicsTextField = 'slug' | 'canonical' | 'title' | 'description';
export type SeoBasicsBooleanField = 'noIndex' | 'noFollow';

interface SeoBasicsPage {
  slug: string;
  isHomePage?: boolean;
}

interface SeoPanelBasicsTabProps {
  active: boolean;
  locale: string;
  page?: SeoBasicsPage | null;
  defaults?: {
    canonical?: string;
  };
  slug: string;
  canonical: string;
  title: string;
  description: string;
  noIndex: boolean;
  noFollow: boolean;
  createRedirect: boolean;
  canonicalPreview: string;
  searchTitle: string;
  searchDescription: string;
  onChangeTextField: (key: SeoBasicsTextField, value: string) => void;
  onChangeBooleanField: (key: SeoBasicsBooleanField, value: boolean) => void;
  onChangeCreateRedirect: (value: boolean) => void;
}

function counterColor(length: number, min: number, max: number): string {
  if (length === 0) return '#94a3b8';
  if (length < min || length > max) return '#d97706';
  return '#16a34a';
}

function fieldCounter(value: string, min: number, max: number) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: '0.72rem' }}>
      <span style={helpTextStyle}>권장 {min}-{max}자</span>
      <strong style={{ color: counterColor(value.trim().length, min, max) }}>
        {value.trim().length}/{max}
      </strong>
    </div>
  );
}

export function SeoPanelBasicsTab({
  active,
  locale,
  page,
  defaults,
  slug,
  canonical,
  title,
  description,
  noIndex,
  noFollow,
  createRedirect,
  canonicalPreview,
  searchTitle,
  searchDescription,
  onChangeTextField,
  onChangeBooleanField,
  onChangeCreateRedirect,
}: SeoPanelBasicsTabProps) {
  return (
    <>
      <section style={{ ...sectionStyle, display: active ? 'grid' : 'none' }}>
        <h3 style={sectionTitleStyle}>기본 검색 설정</h3>
        <div style={twoColumnStyle}>
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="builder-seo-slug">Slug</label>
            <input
              id="builder-seo-slug"
              type="text"
              value={slug}
              disabled={Boolean(page?.isHomePage)}
              placeholder="page-slug"
              style={inputStyle}
              onChange={(event) => onChangeTextField('slug', event.target.value)}
            />
            <span style={helpTextStyle}>최종 public URL은 /{locale}/{slug || ''} 입니다.</span>
          </div>
          <div style={fieldStyle}>
            <label style={labelStyle} htmlFor="builder-seo-canonical">Canonical URL</label>
            <input
              id="builder-seo-canonical"
              type="url"
              value={canonical}
              placeholder={defaults?.canonical || 'https://example.com/page'}
              style={inputStyle}
              onChange={(event) => onChangeTextField('canonical', event.target.value)}
            />
            <span style={helpTextStyle}>비우면 기본 public URL을 canonical로 사용합니다.</span>
          </div>
        </div>
        {!page?.isHomePage && page && page.slug !== slug ? (
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={createRedirect}
              onChange={(event) => onChangeCreateRedirect(event.target.checked)}
            />
            <span>
              <strong>301 redirect 생성</strong><br />
              저장 시 기존 URL /{locale}/{page.slug}에서 새 URL로 이동 규칙을 추가합니다.
              <br />
              기존 redirect 규칙이 같은 URL을 쓰면 SEO는 저장되고 redirect만 건너뜁니다.
            </span>
          </label>
        ) : null}

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-title">SEO title</label>
          <input
            id="builder-seo-title"
            type="text"
            value={title}
            placeholder="예: 국제 소송 전문 로펌 | 호정국제"
            style={inputStyle}
            onChange={(event) => onChangeTextField('title', event.target.value)}
          />
          {fieldCounter(title, SEO_TITLE_MIN, SEO_TITLE_MAX)}
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-description">Meta description</label>
          <textarea
            id="builder-seo-description"
            value={description}
            placeholder="검색 결과에 노출할 페이지 설명을 입력하세요."
            style={textareaStyle}
            onChange={(event) => onChangeTextField('description', event.target.value)}
          />
          {fieldCounter(description, SEO_DESCRIPTION_MIN, SEO_DESCRIPTION_MAX)}
        </div>

        <div style={checkboxGridStyle}>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={noIndex}
              onChange={(event) => onChangeBooleanField('noIndex', event.target.checked)}
            />
            <span><strong>noindex</strong><br />검색 결과에서 제외합니다.</span>
          </label>
          <label style={checkboxRowStyle}>
            <input
              type="checkbox"
              checked={noFollow}
              onChange={(event) => onChangeBooleanField('noFollow', event.target.checked)}
            />
            <span><strong>nofollow</strong><br />페이지 링크 신호 전달을 막습니다.</span>
          </label>
        </div>
      </section>

      <section style={{ ...sectionStyle, display: active ? 'grid' : 'none' }}>
        <h3 style={sectionTitleStyle}>Google preview</h3>
        <div style={previewCardStyle}>
          <div style={{ color: '#202124', fontSize: '0.74rem', wordBreak: 'break-all' }}>{canonicalPreview}</div>
          <div style={{ color: '#1a0dab', fontSize: '1rem', lineHeight: 1.3 }}>{searchTitle}</div>
          <div style={{ color: '#4d5156', fontSize: '0.8rem', lineHeight: 1.45 }}>{searchDescription}</div>
        </div>
      </section>
    </>
  );
}
