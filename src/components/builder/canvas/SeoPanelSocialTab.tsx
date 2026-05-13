'use client';

import {
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

type TwitterCard = 'summary' | 'summary_large_image';

export type SeoSocialTextField =
  | 'ogTitle'
  | 'ogImage'
  | 'ogDescription'
  | 'twitterImage'
  | 'twitterTitle'
  | 'twitterDescription';

interface SeoPanelSocialTabProps {
  active: boolean;
  ogTitle: string;
  ogImage: string;
  ogDescription: string;
  twitterCard: TwitterCard;
  twitterImage: string;
  twitterTitle: string;
  twitterDescription: string;
  socialImage: string;
  socialTitle: string;
  socialDescription: string;
  onChangeTextField: (key: SeoSocialTextField, value: string) => void;
  onChangeTwitterCard: (value: TwitterCard) => void;
}

export function SeoPanelSocialTab({
  active,
  ogTitle,
  ogImage,
  ogDescription,
  twitterCard,
  twitterImage,
  twitterTitle,
  twitterDescription,
  socialImage,
  socialTitle,
  socialDescription,
  onChangeTextField,
  onChangeTwitterCard,
}: SeoPanelSocialTabProps) {
  return (
    <section style={{ ...sectionStyle, display: active ? 'grid' : 'none' }}>
      <h3 style={sectionTitleStyle}>소셜 공유 설정</h3>
      <div style={twoColumnStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-og-title">OG title</label>
          <input
            id="builder-seo-og-title"
            type="text"
            value={ogTitle}
            placeholder="비우면 SEO title 사용"
            style={inputStyle}
            onChange={(event) => onChangeTextField('ogTitle', event.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-og-image">OG image URL</label>
          <input
            id="builder-seo-og-image"
            type="url"
            value={ogImage}
            placeholder="https://example.com/og-image.png"
            style={inputStyle}
            onChange={(event) => onChangeTextField('ogImage', event.target.value)}
          />
        </div>
      </div>
      <div style={fieldStyle}>
        <label style={labelStyle} htmlFor="builder-seo-og-description">OG description</label>
        <textarea
          id="builder-seo-og-description"
          value={ogDescription}
          placeholder="비우면 meta description 사용"
          style={textareaStyle}
          onChange={(event) => onChangeTextField('ogDescription', event.target.value)}
        />
      </div>

      <div style={twoColumnStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-twitter-card">Twitter card</label>
          <select
            id="builder-seo-twitter-card"
            value={twitterCard}
            style={inputStyle}
            onChange={(event) => onChangeTwitterCard(event.target.value as TwitterCard)}
          >
            <option value="summary_large_image">summary_large_image</option>
            <option value="summary">summary</option>
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-twitter-image">Twitter image URL</label>
          <input
            id="builder-seo-twitter-image"
            type="url"
            value={twitterImage}
            placeholder="비우면 OG image 사용"
            style={inputStyle}
            onChange={(event) => onChangeTextField('twitterImage', event.target.value)}
          />
        </div>
      </div>
      <div style={twoColumnStyle}>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-twitter-title">Twitter title</label>
          <input
            id="builder-seo-twitter-title"
            type="text"
            value={twitterTitle}
            placeholder="비우면 OG/SEO title 사용"
            style={inputStyle}
            onChange={(event) => onChangeTextField('twitterTitle', event.target.value)}
          />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle} htmlFor="builder-seo-twitter-description">Twitter description</label>
          <input
            id="builder-seo-twitter-description"
            type="text"
            value={twitterDescription}
            placeholder="비우면 OG/meta description 사용"
            style={inputStyle}
            onChange={(event) => onChangeTextField('twitterDescription', event.target.value)}
          />
        </div>
      </div>

      <h4 style={{ ...sectionTitleStyle, fontSize: '0.78rem' }}>OG image preview</h4>
      <div style={previewCardStyle}>
        <div style={{ display: 'grid', gridTemplateColumns: '160px minmax(0, 1fr)', gap: 12, alignItems: 'center' }}>
          <div style={{ height: 84, borderRadius: 8, background: '#e2e8f0', overflow: 'hidden', display: 'grid', placeItems: 'center', color: '#64748b', fontSize: '0.75rem', fontWeight: 800 }}>
            {socialImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={socialImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              'No image'
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{socialTitle}</div>
            <div style={{ ...helpTextStyle, marginTop: 5 }}>{socialDescription}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
