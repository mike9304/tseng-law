import { describe, expect, it } from 'vitest';
import { getSeoPanelSocialCopy } from '../seo-panel-social-copy';

describe('seo panel social copy', () => {
  it('returns ko SEO social tab copy', () => {
    const copy = getSeoPanelSocialCopy('ko');

    expect(copy.title).toBe('소셜 공유 설정');
    expect(copy.twitterCard).toBe('트위터 카드');
    expect(copy.noImage).toBe('이미지 없음');
    expect(copy.useOgSeoTitle).toBe('비우면 OG/SEO 제목 사용');
    expect(copy.ogImagePlaceholder).toBe('전체 이미지 주소 · 예: https://example.com/og-image.png');
  });

  it('returns zh-hant SEO social tab copy without Hangul', () => {
    const copy = getSeoPanelSocialCopy('zh-hant');
    const text = [
      copy.title,
      copy.ogTitle,
      copy.ogImage,
      copy.ogDescription,
      copy.twitterCard,
      copy.twitterImage,
      copy.twitterTitle,
      copy.twitterDescription,
      copy.preview,
      copy.noImage,
      copy.useSeoTitle,
      copy.useMetaDescription,
      copy.useOgImage,
      copy.useOgSeoTitle,
      copy.useOgMetaDescription,
    ].join(' ');

    expect(copy.title).toBe('社群分享設定');
    expect(copy.preview).toBe('OG 圖片預覽');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en SEO social tab copy without CJK', () => {
    const copy = getSeoPanelSocialCopy('en');
    const text = [
      copy.title,
      copy.ogTitle,
      copy.ogImage,
      copy.ogDescription,
      copy.twitterCard,
      copy.twitterImage,
      copy.twitterTitle,
      copy.twitterDescription,
      copy.preview,
      copy.noImage,
      copy.useSeoTitle,
      copy.useMetaDescription,
      copy.useOgImage,
      copy.useOgSeoTitle,
      copy.useOgMetaDescription,
    ].join(' ');

    expect(copy.title).toBe('Social share settings');
    expect(copy.noImage).toBe('No image');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
