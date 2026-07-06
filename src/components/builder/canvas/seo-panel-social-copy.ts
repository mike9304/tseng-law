import type { Locale } from '@/lib/locales';

export interface SeoPanelSocialCopy {
  title: string;
  ogTitle: string;
  ogImage: string;
  ogImagePlaceholder: string;
  ogDescription: string;
  twitterCard: string;
  twitterImage: string;
  twitterTitle: string;
  twitterDescription: string;
  preview: string;
  noImage: string;
  useSeoTitle: string;
  useMetaDescription: string;
  useOgImage: string;
  useOgSeoTitle: string;
  useOgMetaDescription: string;
}

export function getSeoPanelSocialCopy(locale: Locale): SeoPanelSocialCopy {
  if (locale === 'zh-hant') {
    return {
      title: '社群分享設定',
      ogTitle: 'OG 標題',
      ogImage: 'OG 圖片 URL',
      ogImagePlaceholder: '完整圖片網址 · 例：https://example.com/og-image.png',
      ogDescription: 'OG 描述',
      twitterCard: 'Twitter 卡片',
      twitterImage: 'Twitter 圖片 URL',
      twitterTitle: 'Twitter 標題',
      twitterDescription: 'Twitter 描述',
      preview: 'OG 圖片預覽',
      noImage: '沒有圖片',
      useSeoTitle: '留白時使用 SEO 標題',
      useMetaDescription: '留白時使用 meta 描述',
      useOgImage: '留白時使用 OG 圖片',
      useOgSeoTitle: '留白時使用 OG/SEO 標題',
      useOgMetaDescription: '留白時使用 OG/meta 描述',
    };
  }

  if (locale === 'en') {
    return {
      title: 'Social share settings',
      ogTitle: 'OG title',
      ogImage: 'OG image URL',
      ogImagePlaceholder: 'Full image URL · e.g. https://example.com/og-image.png',
      ogDescription: 'OG description',
      twitterCard: 'Twitter card',
      twitterImage: 'Twitter image URL',
      twitterTitle: 'Twitter title',
      twitterDescription: 'Twitter description',
      preview: 'OG image preview',
      noImage: 'No image',
      useSeoTitle: 'Leave empty to use SEO title',
      useMetaDescription: 'Leave empty to use meta description',
      useOgImage: 'Leave empty to use OG image',
      useOgSeoTitle: 'Leave empty to use OG/SEO title',
      useOgMetaDescription: 'Leave empty to use OG/meta description',
    };
  }

  return {
    title: '소셜 공유 설정',
    ogTitle: 'OG 제목',
    ogImage: 'OG 이미지 URL',
    ogImagePlaceholder: '전체 이미지 주소 · 예: https://example.com/og-image.png',
    ogDescription: 'OG 설명',
    twitterCard: '트위터 카드',
    twitterImage: '트위터 이미지 URL',
    twitterTitle: '트위터 제목',
    twitterDescription: '트위터 설명',
    preview: 'OG 이미지 미리보기',
    noImage: '이미지 없음',
    useSeoTitle: '비우면 SEO 제목 사용',
    useMetaDescription: '비우면 meta description 사용',
    useOgImage: '비우면 OG 이미지 사용',
    useOgSeoTitle: '비우면 OG/SEO 제목 사용',
    useOgMetaDescription: '비우면 OG/meta description 사용',
  };
}
