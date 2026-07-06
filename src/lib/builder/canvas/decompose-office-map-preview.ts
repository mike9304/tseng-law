import type { Locale } from '@/lib/locales';
import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from './types';
import {
  createHomeButtonNode,
  createHomeContainerNode,
  createHomeTextNode,
} from './decompose-home-shared';
import type { OfficeLocationPreset } from './office-locations';

const MAP_PREVIEW_HEIGHT = 420;
const ZH_HANT_MAP_EMBED_URLS: Record<string, string> = {
  taichung: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.6658294!3d24.1554306!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d9e732d2ffb%3A0xf5febc8f45f245fe!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOWPsOS4reaJgA!5e0!3m2!1szh-TW!2stw',
  kaohsiung: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.3078343!3d22.6620929!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e05034374bf33%3A0x1cb351715e1377c4!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOmrmOmbhOaJgA!5e0!3m2!1szh-TW!2stw',
  taipei: 'https://maps.google.com/maps?q=%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2&t=&z=16&ie=UTF8&iwloc=B&output=embed',
};

export function getOfficeMapPreviewCopy(locale: Locale): {
  readonly mapPreviewLabel: string;
  readonly openMapLabel: string;
} {
  return {
    mapPreviewLabel: locale === 'ko' ? '지도 미리보기' : locale === 'zh-hant' ? '地圖預覽' : 'Map preview',
    openMapLabel: locale === 'ko' ? '지도 열기' : locale === 'zh-hant' ? '開啟地圖' : 'Open map',
  };
}

function getMapEmbedUrl(office: OfficeLocationPreset): string {
  return ZH_HANT_MAP_EMBED_URLS[office.id] ?? `https://maps.google.com/maps?q=${encodeURIComponent(office.address)}&z=16&output=embed`;
}

export function createOfficeMapPreviewNodes({
  mapId,
  parentId,
  office,
  mapPreviewLabel,
  openMapLabel,
  width = 660,
}: {
  readonly mapId: string;
  readonly parentId: string;
  readonly office: OfficeLocationPreset;
  readonly mapPreviewLabel: string;
  readonly openMapLabel: string;
  readonly width?: number;
}): BuilderCanvasNode[] {
  return [
    createHomeContainerNode({
      id: mapId,
      parentId,
      rect: { x: 0, y: 0, width, height: MAP_PREVIEW_HEIGHT },
      zIndex: 0,
      label: `home offices map preview ${office.title}`,
      className: 'office-map-wrap',
      borderRadius: 22,
    }),
    {
      id: `${mapId}-embed`,
      kind: 'video-embed',
      parentId: mapId,
      rect: { x: 0, y: 0, width, height: MAP_PREVIEW_HEIGHT },
      style: createDefaultCanvasNodeStyle({ borderRadius: 22 }),
      zIndex: 0,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        provider: 'url',
        src: getMapEmbedUrl(office),
        autoplay: false,
        loop: false,
        muted: false,
        controls: true,
      },
    },
    createHomeContainerNode({
      id: `${mapId}-fallback`,
      parentId: mapId,
      rect: { x: 0, y: 0, width, height: MAP_PREVIEW_HEIGHT },
      zIndex: 1,
      label: `home offices map overlay ${office.title}`,
      className: 'office-map-fallback',
    }),
    createHomeContainerNode({
      id: `${mapId}-panel`,
      parentId: `${mapId}-fallback`,
      rect: { x: 22, y: 238, width: 340, height: 160 },
      zIndex: 0,
      label: `home offices map preview panel ${office.title}`,
      className: 'office-map-fallback-panel',
      borderRadius: 16,
    }),
    createHomeTextNode({
      id: `${mapId}-kicker`,
      parentId: `${mapId}-panel`,
      rect: { x: 16, y: 16, width: 160, height: 18 },
      zIndex: 0,
      text: mapPreviewLabel,
      className: 'office-map-fallback-kicker',
      as: 'span',
    }),
    createHomeTextNode({
      id: `${mapId}-title`,
      parentId: `${mapId}-panel`,
      rect: { x: 16, y: 42, width: 300, height: 28 },
      zIndex: 1,
      text: office.title,
      className: 'office-map-fallback-title',
      as: 'span',
    }),
    createHomeTextNode({
      id: `${mapId}-address`,
      parentId: `${mapId}-panel`,
      rect: { x: 16, y: 76, width: 306, height: 42 },
      zIndex: 2,
      text: office.address,
      className: 'office-map-fallback-address',
      as: 'span',
    }),
    createHomeButtonNode({
      id: `${mapId}-link`,
      parentId: `${mapId}-panel`,
      rect: { x: 16, y: 120, width: 112, height: 36 },
      zIndex: 3,
      label: openMapLabel,
      href: office.mapsUrl,
      style: 'link',
      className: 'office-map-fallback-link',
      as: 'a',
      target: '_blank',
      rel: 'noopener noreferrer',
    }),
  ];
}
