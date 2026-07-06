import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type {
  BuilderAddressBlockCanvasNode,
  BuilderBusinessHoursCanvasNode,
  BuilderMapCanvasNode,
  BuilderMultiLocationMapCanvasNode,
} from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import addressBlockComponent from '../addressBlock';
import businessHoursComponent from '../businessHours';
import {
  getLocationWidgetsCopy,
  localizedAddressBlockContent,
  localizedBusinessHourRows,
  localizedLocationWidgetText,
  localizedMultiLocations,
  LOCATION_WIDGETS_LEGACY_DEFAULTS,
} from '../location-widgets-copy';
import mapComponent from '../map';
import multiLocationMapComponent from '../multiLocationMap';

type Mode = 'edit' | 'preview' | 'published';
type RenderProps<Node> = { node: Node; mode?: Mode; locale?: Locale };
type InspectorProps<Node> = {
  node: Node;
  locale?: Locale;
  onUpdate: (props: Record<string, unknown>) => void;
  disabled?: boolean;
};
type RenderComponent<Node> = React.ComponentType<RenderProps<Node>>;
type InspectorComponent<Node> = React.ComponentType<InspectorProps<Node>>;

const AddressRender = addressBlockComponent.Render as RenderComponent<BuilderAddressBlockCanvasNode>;
const AddressInspector = addressBlockComponent.Inspector as InspectorComponent<BuilderAddressBlockCanvasNode>;
const HoursRender = businessHoursComponent.Render as RenderComponent<BuilderBusinessHoursCanvasNode>;
const HoursInspector = businessHoursComponent.Inspector as InspectorComponent<BuilderBusinessHoursCanvasNode>;
const MultiRender = multiLocationMapComponent.Render as RenderComponent<BuilderMultiLocationMapCanvasNode>;
const MultiInspector = multiLocationMapComponent.Inspector as InspectorComponent<BuilderMultiLocationMapCanvasNode>;
const MapRender = mapComponent.Render as RenderComponent<BuilderMapCanvasNode>;
const MapInspector = mapComponent.Inspector as InspectorComponent<BuilderMapCanvasNode>;
const legacy = LOCATION_WIDGETS_LEGACY_DEFAULTS;

function widget<Node>(
  Component: RenderComponent<Node>,
  node: Node,
  locale: Locale = 'zh-hant',
  mode: Mode = 'preview',
): string {
  return renderToStaticMarkup(<Component node={node} mode={mode} locale={locale} />);
}

function inspector<Node>(Component: InspectorComponent<Node>, node: Node): string {
  return renderToStaticMarkup(
    <Component node={node} locale="zh-hant" onUpdate={() => undefined} disabled={false} />,
  );
}

function contains(html: string, includes: string[], excludes: string[] = []): void {
  includes.forEach((value) => expect(html).toContain(value));
  excludes.forEach((value) => expect(html).not.toContain(value));
}

function address(
  content: Partial<BuilderAddressBlockCanvasNode['content']> = {},
): BuilderAddressBlockCanvasNode {
  return {
    id: 'address-1',
    kind: 'address-block',
    content: {
      label: '台北辦公室',
      line1: '台北市大同區承德路一段35號',
      line2: '7樓之2',
      cityRegion: '台北',
      postalCode: '103',
      country: '台灣',
      phone: '+886 2 0000 0000',
      showCopyButton: true,
      showDirectionsLink: true,
      directionsHref: 'https://maps.example.com',
      ...content,
    },
  } as BuilderAddressBlockCanvasNode;
}

function hours(
  content: Partial<BuilderBusinessHoursCanvasNode['content']> = {},
): BuilderBusinessHoursCanvasNode {
  return {
    id: 'hours-1',
    kind: 'business-hours',
    content: {
      title: '營業時間',
      timezone: 'Asia/Taipei',
      rows: [
        { day: '週一', hours: '09:00-18:00', closed: false },
        { day: '週日', hours: '', closed: true },
      ],
      showCurrentStatus: true,
      note: '',
      ...content,
    },
  } as BuilderBusinessHoursCanvasNode;
}

function multi(
  content: Partial<BuilderMultiLocationMapCanvasNode['content']> = {},
): BuilderMultiLocationMapCanvasNode {
  return {
    id: 'multi-map-1',
    kind: 'multi-location-map',
    content: {
      title: '據點',
      locations: [
        { name: '台北', address: '台北市大同區承德路一段35號', lat: 25.05, lng: 121.51 },
        { name: '高雄', address: '高雄市左營區安吉街233號', lat: 22.68, lng: 120.3 },
      ],
      activeIndex: 0,
      showList: true,
      ...content,
    },
  } as BuilderMultiLocationMapCanvasNode;
}

function map(content: Partial<BuilderMapCanvasNode['content']> = {}): BuilderMapCanvasNode {
  return { id: 'map-1', kind: 'map', content: { address: '台北市大同區承德路一段35號', zoom: 14, ...content } } as BuilderMapCanvasNode;
}

type CopyCase = [Locale, string, string, string, string, string, string, string, string, string, string, string, string];
const copyCases: CopyCase[] = [
  ['zh-hant', '台北辦公室', '台灣', '複製地址', '請在檢查器新增營業時間', '公休', '週一', 'Google 地圖', '據點導覽', '台北辦公室', '2 個地點', '縮放層級 (14)', '台北 辦公室地圖預設'],
  ['en', 'Taipei office', 'Taiwan', 'Copy address', 'Add business hours in the inspector', 'Closed', 'Mon', 'Google Maps', 'Locations', 'Taipei office', '2 locations', 'Zoom level (14)', 'Taipei office map preset'],
  ['ko', legacy.addressBlock.label, legacy.addressBlock.country, '주소 복사', '영업 시간을 인스펙터에서 추가하세요', '휴무', '월', 'Google Maps', legacy.multiLocationMap.title, '서울 본점', '2개 지점', '줌 레벨 (14)', '타이베이 office map preset'],
];

describe('location widget localization', () => {
  it.each(copyCases)('returns helper copy in %s', (
    locale,
    addressLabel,
    country,
    copyButton,
    emptyHours,
    closed,
    workday,
    mapTitle,
    locationsTitle,
    firstLocation,
    count,
    zoom,
    preset,
  ) => {
    const copy = getLocationWidgetsCopy(locale);

    expect(copy.addressBlock).toMatchObject({ defaultContent: { label: addressLabel, country }, copyButton });
    expect(copy.businessHours).toMatchObject({ empty: emptyHours, closed });
    expect(copy.businessHours.defaultRows[1]).toMatchObject({ day: workday });
    expect(copy.map.iframeTitle).toBe(mapTitle);
    expect(copy.map.zoomLevel(14)).toBe(zoom);
    expect(copy.map.presetAria(copy.map.presets[2]?.label ?? '')).toBe(preset);
    expect(copy.multiLocationMap.defaultTitle).toBe(locationsTitle);
    expect(copy.multiLocationMap.defaultLocations[0]).toMatchObject({ name: firstLocation });
    expect(copy.multiLocationMap.count(2)).toBe(count);
  });

  it('renders zh-hant widget and inspector copy', () => {
    const checks: Array<[string, string[]]> = [
      [widget(AddressRender, address()), ['複製地址', '路線']],
      [inspector(AddressInspector, address()), ['第 1 行', '城市 / 地區', '路線 URL（覆寫自動產生）']],
      [widget(HoursRender, hours()), ['公休']],
      [widget(HoursRender, hours({ rows: [] })), ['請在檢查器新增營業時間']],
      [inspector(HoursInspector, hours()), ['每日時間（day | hours [| closed]）', '醒目顯示今天']],
      [widget(MultiRender, multi()), ['2 個地點']],
      [widget(MultiRender, multi({ locations: [] })), ['請在檢查器新增地點', '沒有啟用的地點']],
      [inspector(MultiInspector, multi()), ['地點（name | address | lat | lng）', '啟用索引', '顯示列表']],
      [widget(MapRender, map(), 'zh-hant', 'edit'), ['title="Google 地圖"', '地圖 · 變更位置']],
      [inspector(MapInspector, map()), ['辦公室預設', '台北 辦公室地圖預設', '縮放層級 (14)', '放大地圖']],
    ];

    checks.forEach(([html, expected]) => contains(html, expected));
  });

  it('localizes legacy defaults without changing custom content', () => {
    const zhCopy = getLocationWidgetsCopy('zh-hant');
    const legacyAddress = address({ ...legacy.addressBlock });
    const customAddress = address({ ...legacy.addressBlock, label: 'Custom office', line1: 'Custom address' });
    const legacyHours = hours({
      title: legacy.businessHours.title,
      timezone: legacy.businessHours.timezone,
      rows: legacy.businessHours.rows.map((row) => ({ ...row })),
      note: legacy.businessHours.note,
    });
    const customHours = hours({ ...legacyHours.content, rows: [{ day: 'Custom day', hours: '10:00-11:00', closed: false }] });
    const legacyMulti = multi({
      title: legacy.multiLocationMap.title,
      locations: legacy.multiLocationMap.locations.map((location) => ({ ...location })),
    });
    const customMulti = multi({ ...legacyMulti.content, title: 'Custom locations', locations: [{ name: 'Custom branch', address: 'Custom address', lat: 1, lng: 2 }] });

    expect(localizedAddressBlockContent(legacyAddress.content, zhCopy.addressBlock.defaultContent).label).toBe('台北辦公室');
    expect(localizedAddressBlockContent(customAddress.content, zhCopy.addressBlock.defaultContent).label).toBe('Custom office');
    expect(localizedLocationWidgetText(legacyHours.content.title, zhCopy.businessHours.defaultTitle, legacy.businessHours.title)).toBe('營業時間');
    expect(localizedBusinessHourRows(legacyHours.content.rows, zhCopy.businessHours.defaultRows)[1]?.day).toBe('週一');
    expect(localizedBusinessHourRows(customHours.content.rows, zhCopy.businessHours.defaultRows)[0]?.day).toBe('Custom day');
    expect(localizedMultiLocations(legacyMulti.content.locations, zhCopy.multiLocationMap.defaultLocations)[0]?.name).toBe('台北辦公室');
    expect(localizedMultiLocations(customMulti.content.locations, zhCopy.multiLocationMap.defaultLocations)[0]?.name).toBe('Custom branch');
    expect(getLocationWidgetsCopy('ko').businessHours.defaultRows).toEqual(legacy.businessHours.rows.map((row) => ({ ...row })));
    contains(widget(AddressRender, legacyAddress), ['台北辦公室', '台北市大同區承德路一段35號', '台灣'], ['본 사무소', '대한민국']);
    contains(widget(AddressRender, customAddress), ['Custom office', 'Custom address'], ['台北辦公室']);
    contains(widget(HoursRender, legacyHours), ['營業時間', 'Asia/Taipei', '週一', '國定假日另行公告。'], ['영업 시간', '공휴일은 별도 안내합니다.']);
    contains(widget(MultiRender, legacyMulti), ['據點導覽', '台北辦公室'], ['지점 안내', '서울 본점']);
    contains(widget(MultiRender, customMulti), ['Custom locations', 'Custom branch'], ['據點導覽']);
  });
});
