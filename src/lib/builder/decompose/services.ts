import { siteContent } from '@/data/site-content';
import { getServiceSlugs } from '@/data/service-details';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  createButtonNode,
  createContainerNode,
  createTextNode,
  resolveBodyFontFamily,
  resolveHeadingFontFamily,
  type CanvasRect,
} from './shared';

function resolveDetailLabel(locale: Locale): string {
  if (locale === 'zh-hant') return '查看詳情';
  if (locale === 'en') return 'View details';
  return '자세히 보기';
}

export function decomposeServices(
  locale: Locale,
  groupId: string,
  baseRect: CanvasRect,
): BuilderCanvasNode[] {
  const services = siteContent[locale].services;
  const headingFont = resolveHeadingFontFamily(locale);
  const bodyFont = resolveBodyFontFamily(locale);
  const serviceSlugs = getServiceSlugs();
  const cardHeight = 92;
  const cardGap = 12;
  const cardStartY = 260;

  const nodes: BuilderCanvasNode[] = [
    createContainerNode({
      id: groupId,
      rect: baseRect,
      background: 'linear-gradient(180deg, #f7faf6 0%, #eef4ee 100%)',
      style: {
        borderRadius: 0,
      },
    }),
    createTextNode({
      id: `${groupId}-label`,
      parentId: groupId,
      rect: { x: 80, y: 72, width: 260, height: 24 },
      text: services.label,
      fontSize: 13,
      color: '#50684a',
      fontWeight: 'bold',
      lineHeight: 1.2,
      letterSpacing: 3,
      fontFamily: bodyFont,
      textTransform: 'uppercase',
      verticalAlign: 'center',
    }),
    createTextNode({
      id: `${groupId}-title`,
      parentId: groupId,
      rect: { x: 80, y: 112, width: 620, height: 72 },
      text: services.title,
      fontSize: locale === 'en' ? 48 : 52,
      color: '#0b1d14',
      fontWeight: 'bold',
      lineHeight: 1.22,
      letterSpacing: -1,
      fontFamily: headingFont,
      verticalAlign: 'top',
    }),
    createTextNode({
      id: `${groupId}-description`,
      parentId: groupId,
      rect: { x: 80, y: 190, width: 760, height: 48 },
      text: services.description,
      fontSize: 17,
      color: '#355145',
      fontWeight: 'regular',
      lineHeight: 1.75,
      fontFamily: bodyFont,
      verticalAlign: 'top',
    }),
  ];

  services.items.forEach((item, index) => {
    const cardId = `${groupId}-card-${index + 1}`;
    const y = cardStartY + index * (cardHeight + cardGap);
    const href = serviceSlugs[index] ? `/${locale}/services/${serviceSlugs[index]}` : item.href;

    nodes.push(
      createContainerNode({
        id: cardId,
        parentId: groupId,
        rect: { x: 80, y, width: 1120, height: cardHeight },
        background: '#eef4ee',
        borderColor: '#d9e3d8',
        borderWidth: 1,
        borderRadius: 14,
        style: {
          borderRadius: 14,
          shadowY: 4,
          shadowBlur: 16,
          shadowColor: 'rgba(0, 0, 0, 0.05)',
        },
      }),
      createTextNode({
        id: `${cardId}-title`,
        parentId: cardId,
        rect: { x: 24, y: 14, width: 660, height: 24 },
        text: item.title,
        fontSize: 24,
        color: '#16382d',
        fontWeight: 'bold',
        lineHeight: 1.2,
        fontFamily: headingFont,
        verticalAlign: 'center',
      }),
      createTextNode({
        id: `${cardId}-description`,
        parentId: cardId,
        rect: { x: 24, y: 42, width: 760, height: 34 },
        text: item.description,
        fontSize: 13,
        color: '#355145',
        fontWeight: 'regular',
        lineHeight: 1.45,
        fontFamily: bodyFont,
        verticalAlign: 'top',
      }),
      createButtonNode({
        id: `${cardId}-button`,
        parentId: cardId,
        rect: { x: 928, y: 26, width: 168, height: 38 },
        label: resolveDetailLabel(locale),
        href,
        variant: 'primary',
        style: {
          backgroundColor: '#16382d',
          borderColor: '#16382d',
          borderWidth: 1,
          borderRadius: 8,
          shadowY: 8,
          shadowBlur: 18,
          shadowColor: 'rgba(22, 56, 45, 0.18)',
        },
      }),
    );
  });

  return nodes;
}
