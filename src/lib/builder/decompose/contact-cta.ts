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

function resolveDecorAlt(locale: Locale): string {
  if (locale === 'zh-hant') return '聯絡區塊裝飾圖案';
  if (locale === 'en') return 'Contact section decorative graphic';
  return '문의 섹션 장식 그래픽';
}

export function decomposeContactCta(
  locale: Locale,
  groupId: string,
  baseRect: CanvasRect,
): BuilderCanvasNode[] {
  const content = siteContent[locale];
  const contact = content.contact;
  const cta = content.homeContactCta;
  const representativeTel = content.quickContact.actions.find((action) => action.href.startsWith('tel:'));
  const headingFont = resolveHeadingFontFamily(locale);
  const bodyFont = resolveBodyFontFamily(locale);

  const nodes: BuilderCanvasNode[] = [
    createContainerNode({
      id: groupId,
      rect: baseRect,
      background: 'linear-gradient(120deg, rgba(12, 28, 20, 0.95) 0%, rgba(18, 41, 29, 0.9) 55%, rgba(12, 28, 20, 0.94) 100%)',
      style: {
        borderRadius: 0,
      },
    }),
    createImageNode({
      id: `${groupId}-decor`,
      parentId: groupId,
      rect: { x: 900, y: 72, width: 260, height: 260 },
      src: '/images/feature-3.svg',
      alt: resolveDecorAlt(locale),
      fit: 'contain',
      style: {
        opacity: 22,
      },
    }),
    createTextNode({
      id: `${groupId}-label`,
      parentId: groupId,
      rect: { x: 80, y: 92, width: 220, height: 22 },
      text: contact.label,
      fontSize: 13,
      color: 'rgba(229, 223, 197, 0.78)',
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
      rect: { x: 80, y: 132, width: 660, height: 108 },
      text: cta.title,
      fontSize: locale === 'en' ? 44 : 48,
      color: '#fafff7',
      fontWeight: 'bold',
      lineHeight: 1.22,
      letterSpacing: -1,
      fontFamily: headingFont,
      verticalAlign: 'top',
    }),
    createTextNode({
      id: `${groupId}-description`,
      parentId: groupId,
      rect: { x: 80, y: 262, width: 620, height: 76 },
      text: cta.description,
      fontSize: 17,
      color: 'rgba(233, 242, 234, 0.82)',
      fontWeight: 'regular',
      lineHeight: 1.8,
      fontFamily: bodyFont,
      verticalAlign: 'top',
    }),
    createButtonNode({
      id: `${groupId}-contact-button`,
      parentId: groupId,
      rect: { x: 80, y: 370, width: 220, height: 48 },
      label: contact.cta.label,
      href: `/${locale}/contact`,
      variant: 'primary',
      style: {
        backgroundColor: '#16382d',
        borderColor: '#9f8752',
        borderWidth: 1,
        borderRadius: 12,
        shadowY: 10,
        shadowBlur: 22,
        shadowColor: 'rgba(0, 0, 0, 0.18)',
      },
    }),
  ];

  if (representativeTel) {
    nodes.push(
      createButtonNode({
        id: `${groupId}-phone-button`,
        parentId: groupId,
        rect: { x: 316, y: 370, width: 220, height: 48 },
        label: representativeTel.value,
        href: representativeTel.href,
        variant: 'secondary',
        style: {
          backgroundColor: 'rgba(233, 242, 234, 0.06)',
          borderColor: 'rgba(233, 242, 234, 0.28)',
          borderWidth: 1,
          borderRadius: 12,
        },
      }),
    );
  }

  return nodes;
}
