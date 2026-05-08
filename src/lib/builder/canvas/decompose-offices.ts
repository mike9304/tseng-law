import type { BuilderCanvasNode } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import type { Locale } from '@/lib/locales';
import {
  HOME_STAGE_WIDTH,
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';
import { getOfficeLocationPresets, telHrefFromPhone } from './office-locations';

const OFFICES_ROOT_HEIGHT = 760;

export const OFFICES_SECTION_ROOT_HEIGHT = OFFICES_ROOT_HEIGHT;

export function createOfficesDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const offices = getOfficeLocationPresets(locale);
  const title = locale === 'ko' ? '오시는길' : locale === 'zh-hant' ? '事務所據點' : 'Office Locations';
  const officeLabel = locale === 'ko' ? '사무소' : locale === 'zh-hant' ? '據點' : 'Office';
  const telLabel = locale === 'ko' ? '전화' : locale === 'zh-hant' ? '電話' : 'Phone';
  const faxLabel = locale === 'ko' ? '팩스' : locale === 'zh-hant' ? '傳真' : 'Fax';
  const viewMapLabel =
    locale === 'ko'
      ? 'Google 지도에서 보기 (사진·리뷰)'
      : locale === 'zh-hant'
        ? '在 Google 地圖查看 (照片·評論)'
        : 'View on Google Maps (photos & reviews)';

  const rootId = 'home-offices-root';
  const containerId = 'home-offices-container';
  const tabsId = 'home-offices-tabs';

  const nodes: BuilderCanvasNode[] = [
    createHomeContainerNode({
      id: rootId,
      rect: { x: 0, y: rootY, width: HOME_STAGE_WIDTH, height: OFFICES_ROOT_HEIGHT },
      zIndex: zBase,
      label: 'home offices root',
      className: 'section section--light',
      as: 'section',
      htmlId: 'offices',
      dataTone: 'light',
      variant: 'flat',
    }),
    createHomeContainerNode({
      id: containerId,
      parentId: rootId,
      rect: { x: 72, y: 88, width: 1136, height: 600 },
      zIndex: 0,
      label: 'home offices container',
      className: 'container',
    }),
    createHomeTextNode({
      id: 'home-offices-label',
      parentId: containerId,
      rect: { x: 0, y: 0, width: 180, height: 28 },
      zIndex: 0,
      text: 'OFFICES',
      className: 'section-label',
      as: 'div',
      fontWeight: 'medium',
    }),
    createHomeTextNode({
      id: 'home-offices-title',
      parentId: containerId,
      rect: { x: 0, y: 40, width: 520, height: 56 },
      zIndex: 1,
      text: title,
      className: 'section-title',
      as: 'h2',
    }),
    createHomeContainerNode({
      id: tabsId,
      parentId: containerId,
      rect: { x: 0, y: 116, width: 560, height: 36 },
      zIndex: 2,
      label: 'home offices tabs',
      className: 'office-tabs',
    }),
  ];

  offices.forEach((office, index) => {
    nodes.push(
      createHomeButtonNode({
        id: `home-offices-tab-${index}`,
        parentId: tabsId,
        rect: { x: index * 120, y: 0, width: 104, height: 32 },
        zIndex: index,
        label: office.title,
        href: '#offices',
        style: 'ghost',
        className: `tab-button${index === 0 ? ' active' : ''}`,
        as: 'button',
      }),
    );
  });

  offices.forEach((office, index) => {
    const layoutId = `home-offices-layout-${index}`;
    const mapId = `${layoutId}-map`;
    const cardId = `${layoutId}-card`;
    const baseY = 184;

    nodes.push(
      createHomeContainerNode({
        id: layoutId,
        parentId: containerId,
        rect: { x: 0, y: baseY, width: 1136, height: 420 },
        zIndex: 3 + index,
        label: `home offices layout ${index + 1}`,
        className: `office-layout builder-office-layout-${index}`,
      }),
      {
        id: mapId,
        kind: 'map',
        parentId: layoutId,
        rect: { x: 0, y: 0, width: 660, height: 420 },
        style: createDefaultCanvasNodeStyle({ borderRadius: 12 }),
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          address: office.address,
          zoom: 16,
        },
      },
      createHomeContainerNode({
        id: cardId,
        parentId: layoutId,
        rect: { x: 700, y: 0, width: 436, height: 420 },
        zIndex: 1,
        label: `home offices card ${index + 1}`,
        className: 'card office-card',
        as: 'article',
      }),
      createHomeTextNode({
        id: `${cardId}-label`,
        parentId: cardId,
        rect: { x: 0, y: 0, width: 120, height: 24 },
        zIndex: 0,
        text: officeLabel,
        className: 'section-label',
        as: 'div',
        fontWeight: 'medium',
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: cardId,
        rect: { x: 0, y: 42, width: 240, height: 34 },
        zIndex: 1,
        text: office.title,
        className: 'card-title',
        as: 'h3',
      }),
      createHomeTextNode({
        id: `${cardId}-address`,
        parentId: cardId,
        rect: { x: 0, y: 92, width: 360, height: 58 },
        zIndex: 2,
        text: office.address,
        className: 'card-copy',
        as: 'p',
      }),
      createHomeButtonNode({
        id: `${cardId}-phone`,
        parentId: cardId,
        rect: { x: 0, y: 164, width: 220, height: 24 },
        zIndex: 3,
        label: `${telLabel}: ${office.phone}`,
        href: telHrefFromPhone(office.phone),
        style: 'link',
        className: 'link-underline phone-number',
        as: 'a',
      }),
    );

    if (office.fax) {
      nodes.push(
        createHomeTextNode({
          id: `${cardId}-fax`,
          parentId: cardId,
          rect: { x: 0, y: 198, width: 220, height: 24 },
          zIndex: 4,
          text: `${faxLabel}: ${office.fax}`,
          className: 'card-copy',
          as: 'p',
        }),
      );
    }

    nodes.push(
      createHomeButtonNode({
        id: `${cardId}-map-link`,
        parentId: cardId,
        rect: { x: 0, y: 302, width: 280, height: 40 },
        zIndex: 5,
        label: viewMapLabel,
        href: office.mapsUrl,
        style: 'primary',
        className: 'button office-map-link',
        as: 'a',
        target: '_blank',
        rel: 'noopener noreferrer',
      }),
    );
  });

  return nodes;
}
