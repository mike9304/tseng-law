import type { BuilderCanvasNode } from './types';
import { createDefaultCanvasNodeStyle } from './types';
import type { Locale } from '@/lib/locales';
import {
  HOME_STAGE_WIDTH,
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';
import {
  createOfficeMapPreviewNodes,
  getOfficeMapPreviewCopy,
} from './decompose-office-map-preview';
import { getOfficeLocationPresets, telHrefFromPhone } from './office-locations';

const OFFICES_ROOT_HEIGHT = 760;

export const OFFICES_SECTION_ROOT_HEIGHT = OFFICES_ROOT_HEIGHT;

export function createOfficesDecomposedNodes(
  rootY: number,
  locale: Locale,
  zBase: number,
): BuilderCanvasNode[] {
  const offices = getOfficeLocationPresets(locale);
  const useCompositeMapPreview = locale === 'zh-hant';
  const useZhHantCompositeGeometry = locale === 'zh-hant';
  const layoutWidth = useZhHantCompositeGeometry ? 1178 : 1136;
  const mapWidth = useZhHantCompositeGeometry ? 687 : 660;
  const cardX = useZhHantCompositeGeometry ? 704 : 700;
  const cardWidth = useZhHantCompositeGeometry ? 474 : 436;
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
  const mapPreviewCopy = getOfficeMapPreviewCopy(locale);

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
      rect: { x: useZhHantCompositeGeometry ? 51 : 72, y: 88, width: layoutWidth, height: 600 },
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

    const mapNodes: BuilderCanvasNode[] = useCompositeMapPreview
      ? createOfficeMapPreviewNodes({
          mapId,
          parentId: layoutId,
          office,
          width: mapWidth,
          ...mapPreviewCopy,
        })
      : [
          {
            id: mapId,
            kind: 'map',
            parentId: layoutId,
            rect: { x: 0, y: 0, width: mapWidth, height: 420 },
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
        ];

    nodes.push(
      createHomeContainerNode({
        id: layoutId,
        parentId: containerId,
        rect: { x: 0, y: baseY, width: layoutWidth, height: 420 },
        zIndex: 3 + index,
        label: `home offices layout ${index + 1}`,
        className: `office-layout builder-office-layout-${index}`,
      }),
      ...mapNodes,
      createHomeContainerNode({
        id: cardId,
        parentId: layoutId,
        rect: { x: cardX, y: 0, width: cardWidth, height: 420 },
        zIndex: 1,
        label: `home offices card ${index + 1}`,
        className: 'card office-card',
        as: 'article',
      }),
      createHomeTextNode({
        id: `${cardId}-label`,
        parentId: cardId,
        rect: { x: useZhHantCompositeGeometry ? 25 : 0, y: useZhHantCompositeGeometry ? -47 : 0, width: 120, height: 24 },
        zIndex: 0,
        text: officeLabel,
        className: 'section-label',
        as: 'div',
        fontWeight: 'medium',
      }),
      createHomeTextNode({
        id: `${cardId}-title`,
        parentId: cardId,
        rect: { x: useZhHantCompositeGeometry ? 25 : 0, y: useZhHantCompositeGeometry ? 32 : 42, width: useZhHantCompositeGeometry ? 424 : 240, height: 34 },
        zIndex: 1,
        text: office.title,
        className: 'card-title',
        as: 'h3',
      }),
      createHomeTextNode({
        id: `${cardId}-address`,
        parentId: cardId,
        rect: { x: useZhHantCompositeGeometry ? 25 : 0, y: useZhHantCompositeGeometry ? 58 : 92, width: useZhHantCompositeGeometry ? 424 : 360, height: 58 },
        zIndex: 2,
        text: office.address,
        className: 'card-copy',
        as: 'p',
      }),
      createHomeButtonNode({
        id: `${cardId}-phone`,
        parentId: cardId,
        rect: { x: useZhHantCompositeGeometry ? 25 : 0, y: useZhHantCompositeGeometry ? 98 : 164, width: 220, height: 24 },
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
          rect: { x: useZhHantCompositeGeometry ? 25 : 0, y: useZhHantCompositeGeometry ? 137 : 198, width: 220, height: 24 },
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
        rect: { x: useZhHantCompositeGeometry ? 25 : 0, y: useZhHantCompositeGeometry ? 195 : 302, width: useZhHantCompositeGeometry ? 250 : 280, height: 40 },
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
