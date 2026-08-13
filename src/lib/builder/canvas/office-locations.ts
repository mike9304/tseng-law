import type { Locale } from '@/lib/locales';
import type { BuilderCanvasNode } from './types';

export type OfficeLocationPreset = {
  id: string;
  title: string;
  address: string;
  phone?: string;
  fax?: string;
  mapsUrl: string;
};

export type OfficeNodeGroup = {
  layoutId: string;
  cardId: string;
  mapNode: BuilderCanvasNode;
  titleNode: BuilderCanvasNode | null;
  addressNode: BuilderCanvasNode | null;
  phoneNode: BuilderCanvasNode | null;
  faxNode: BuilderCanvasNode | null;
  mapLinkNode: BuilderCanvasNode | null;
};

const PINGTUNG_MAPS_URL =
  'https://www.google.com/maps/search/90443%E5%B1%8F%E6%9D%B1%E7%B8%A3%E4%B9%9D%E5%A6%82%E9%84%89%E4%B9%9D%E5%A6%82%E8%B7%AF%E4%B8%89%E6%AE%B546%E8%99%9F';

export const OFFICE_LOCATION_PRESETS: Record<Locale, OfficeLocationPreset[]> = {
  ko: [
    {
      id: 'taipei',
      title: '타이베이',
      address: '103 臺北市大同區承德路一段35號7樓之2',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2',
    },
    {
      id: 'taichung',
      title: '타이중',
      address: '40453 臺中市北區館前路19號6樓之1',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80',
    },
    {
      id: 'kaohsiung',
      title: '가오슝',
      address: '81358 高雄市左營區安吉街233號',
      phone: '07-557-9797',
      fax: '07-557-7171',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80',
    },
    {
      id: 'pingtung',
      title: '핑둥',
      address: '90443 屏東縣九如鄉九如路三段46號',
      phone: '08-739-1689',
      fax: '08-739-7362',
      mapsUrl: PINGTUNG_MAPS_URL,
    },
  ],
  'zh-hant': [
    {
      id: 'taipei',
      title: '台北',
      address: '103臺北市大同區承德路一段35號7樓之2',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2',
    },
    {
      id: 'taichung',
      title: '台中',
      address: '40453臺中市北區館前路19號6樓之1',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80',
    },
    {
      id: 'kaohsiung',
      title: '高雄',
      address: '81358高雄市左營區安吉街233號',
      phone: '07-557-9797',
      fax: '07-557-7171',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80',
    },
    {
      id: 'pingtung',
      title: '屏東',
      address: '90443屏東縣九如鄉九如路三段46號',
      phone: '08-739-1689',
      fax: '08-739-7362',
      mapsUrl: PINGTUNG_MAPS_URL,
    },
  ],
  en: [
    {
      id: 'taipei',
      title: 'Taipei',
      address: '103, 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2',
    },
    {
      id: 'taichung',
      title: 'Taichung',
      address: '40453, 6F-1, No. 19, Guanqian Rd., North Dist., Taichung City',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80',
    },
    {
      id: 'kaohsiung',
      title: 'Kaohsiung',
      address: '81358, No. 233, Anji St., Zuoying Dist., Kaohsiung City',
      phone: '07-557-9797',
      fax: '07-557-7171',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80',
    },
    {
      id: 'pingtung',
      title: 'Pingtung',
      address: 'No. 46, Sec. 3, Jiuru Rd., Jiuru Township, Pingtung County 90443',
      phone: '08-739-1689',
      fax: '08-739-7362',
      mapsUrl: PINGTUNG_MAPS_URL,
    },
  ],
};

export const BUILDER_OFFICE_LOCATION_COUNT = OFFICE_LOCATION_PRESETS.ko.length;

export function getOfficeLocationPresets(locale: string | undefined): OfficeLocationPreset[] {
  if (locale === 'en' || locale === 'zh-hant' || locale === 'ko') {
    return OFFICE_LOCATION_PRESETS[locale];
  }
  return OFFICE_LOCATION_PRESETS.ko;
}

export function isOfficeMapNodeId(nodeId: string): boolean {
  return /^home-offices-layout-\d+-map$/.test(nodeId);
}

export function resolveOfficeNodeGroup(
  nodesById: Map<string, BuilderCanvasNode>,
  mapNode: BuilderCanvasNode | null | undefined,
): OfficeNodeGroup | null {
  if (!mapNode || mapNode.kind !== 'map' || !isOfficeMapNodeId(mapNode.id)) return null;
  const layoutId = mapNode.id.replace(/-map$/, '');
  const cardId = `${layoutId}-card`;
  return {
    layoutId,
    cardId,
    mapNode,
    titleNode: nodesById.get(`${cardId}-title`) ?? null,
    addressNode: nodesById.get(`${cardId}-address`) ?? null,
    phoneNode: nodesById.get(`${cardId}-phone`) ?? null,
    faxNode: nodesById.get(`${cardId}-fax`) ?? null,
    mapLinkNode: nodesById.get(`${cardId}-map-link`) ?? null,
  };
}

export function readNodeText(node: BuilderCanvasNode | null | undefined): string {
  const value = node?.content && 'text' in node.content ? node.content.text : '';
  return typeof value === 'string' ? value : '';
}

export function readButtonLabel(node: BuilderCanvasNode | null | undefined): string {
  const value = node?.content && 'label' in node.content ? node.content.label : '';
  return typeof value === 'string' ? value : '';
}

export function readButtonHref(node: BuilderCanvasNode | null | undefined): string {
  const value = node?.content && 'href' in node.content ? node.content.href : '';
  return typeof value === 'string' ? value : '';
}

export function readMapAddress(node: BuilderCanvasNode | null | undefined): string {
  const value = node?.content && 'address' in node.content ? node.content.address : '';
  return typeof value === 'string' ? value : '';
}

export function readMapZoom(node: BuilderCanvasNode | null | undefined): number {
  const value = node?.content && 'zoom' in node.content ? node.content.zoom : 15;
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.max(1, Math.min(20, Math.round(value)))
    : 15;
}

export function labelPrefix(label: string, fallback: string): string {
  const separatorIndex = label.indexOf(':');
  return separatorIndex > 0 ? label.slice(0, separatorIndex).trim() : fallback;
}

export function labelValueAfterColon(label: string): string {
  const separatorIndex = label.indexOf(':');
  return separatorIndex >= 0 ? label.slice(separatorIndex + 1).trim() : label.trim();
}

export function telHrefFromPhone(phone: string): string {
  const normalized = phone.replace(/[^+\d]/g, '');
  return normalized ? `tel:${normalized}` : '';
}

export function googleMapsSearchUrl(address: string): string {
  return address.trim()
    ? `https://www.google.com/maps/search/${encodeURIComponent(address.trim())}`
    : '';
}
