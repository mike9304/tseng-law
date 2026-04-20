import { siteContent } from '@/data/site-content';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  createButtonNode,
  createContainerNode,
  createImageNode,
  createTextNode,
  resolveBodyFontFamily,
  resolveHeadingFontFamily,
  type CanvasRect,
} from './shared';

function resolveHeroBackgroundAlt(locale: Locale): string {
  if (locale === 'zh-hant') return '首頁主視覺背景';
  if (locale === 'en') return 'Home hero background';
  return '홈 히어로 배경';
}

export function decomposeHero(
  locale: Locale,
  groupId: string,
  baseRect: CanvasRect,
): BuilderCanvasNode[] {
  const hero = siteContent[locale].hero;
  const headingFont = resolveHeadingFontFamily(locale);
  const bodyFont = resolveBodyFontFamily(locale);

  return [
    createContainerNode({
      id: groupId,
      rect: baseRect,
      background: 'linear-gradient(160deg, rgba(13, 34, 26, 0.98) 0%, rgba(22, 56, 45, 0.94) 55%, rgba(11, 29, 20, 0.98) 100%)',
      style: {
        borderRadius: 0,
      },
    }),
    createImageNode({
      id: `${groupId}-background`,
      parentId: groupId,
      rect: { x: 0, y: 0, width: baseRect.width, height: baseRect.height },
      src: '/images/hero-bg-01.webp',
      alt: resolveHeroBackgroundAlt(locale),
      fit: 'cover',
      style: {
        borderRadius: 0,
        opacity: 72,
      },
    }),
    createTextNode({
      id: `${groupId}-title`,
      parentId: groupId,
      rect: { x: 88, y: 168, width: 740, height: 176 },
      text: hero.title,
      fontSize: locale === 'en' ? 68 : 74,
      color: '#fafff7',
      fontWeight: 'bold',
      lineHeight: 1.14,
      letterSpacing: locale === 'en' ? -1 : -2,
      fontFamily: headingFont,
      textShadow: { x: 0, y: 16, blur: 48, color: 'rgba(0, 0, 0, 0.36)' },
      verticalAlign: 'top',
      style: {
        backgroundColor: 'transparent',
      },
    }),
    createTextNode({
      id: `${groupId}-subtitle`,
      parentId: groupId,
      rect: { x: 88, y: 374, width: 600, height: 132 },
      text: hero.subtitle,
      fontSize: locale === 'en' ? 18 : 19,
      color: 'rgba(232, 238, 226, 0.82)',
      fontWeight: 'regular',
      lineHeight: 1.85,
      fontFamily: bodyFont,
      verticalAlign: 'top',
    }),
    createButtonNode({
      id: `${groupId}-search-button`,
      parentId: groupId,
      rect: { x: 88, y: 550, width: 260, height: 60 },
      label: hero.searchButton,
      href: `/${locale}/search`,
      variant: 'primary',
      style: {
        backgroundColor: '#b59a66',
        borderColor: '#b59a66',
        borderWidth: 1,
        borderRadius: 2,
        shadowY: 18,
        shadowBlur: 32,
        shadowColor: 'rgba(0, 0, 0, 0.28)',
      },
    }),
  ] satisfies BuilderCanvasNode[];
}
