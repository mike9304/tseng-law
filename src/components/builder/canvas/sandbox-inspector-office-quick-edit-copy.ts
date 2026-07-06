import type { Locale } from '@/lib/locales';

export type SandboxInspectorOfficeQuickEditCopy = {
  sectionLabel: string;
  sectionTitle: string;
  presetsLabel: string;
  presetAriaLabel: (presetTitle: string) => string;
  officeTitleLabel: string;
  officeTitleAriaLabel: string;
  addressLabel: string;
  addressAriaLabel: string;
  zoomLabel: string;
  zoomAriaLabel: string;
  phoneLabel: string;
  phoneAriaLabel: string;
  faxLabel: string;
  faxAriaLabel: string;
  directionsUrlLabel: string;
  mapUrlAriaLabel: string;
  generateFromAddressLabel: string;
};

const COPY: Record<'ko' | 'zh-hant' | 'en', SandboxInspectorOfficeQuickEditCopy> = {
  ko: {
    sectionLabel: '사무소 동기화',
    sectionTitle: 'Wix 스타일 위치 설정',
    presetsLabel: '사무소 프리셋',
    presetAriaLabel: (presetTitle) => `${presetTitle} 사무소 지도 프리셋 사용`,
    officeTitleLabel: '사무소명',
    officeTitleAriaLabel: '동기화된 사무소명',
    addressLabel: '주소',
    addressAriaLabel: '동기화된 사무소 주소',
    zoomLabel: '확대',
    zoomAriaLabel: '사무소 지도 확대 수준',
    phoneLabel: '전화',
    phoneAriaLabel: '동기화된 사무소 전화번호',
    faxLabel: '팩스',
    faxAriaLabel: '동기화된 사무소 팩스번호',
    directionsUrlLabel: '길찾기 URL',
    mapUrlAriaLabel: '사무소 지도 URL',
    generateFromAddressLabel: '주소로 생성',
  },
  'zh-hant': {
    sectionLabel: '辦公室同步',
    sectionTitle: 'Wix 風格地點設定',
    presetsLabel: '辦公室預設',
    presetAriaLabel: (presetTitle) => `使用${presetTitle}辦公室地圖預設`,
    officeTitleLabel: '辦公室名稱',
    officeTitleAriaLabel: '已同步的辦公室名稱',
    addressLabel: '地址',
    addressAriaLabel: '已同步的辦公室地址',
    zoomLabel: '縮放',
    zoomAriaLabel: '辦公室地圖縮放層級',
    phoneLabel: '電話',
    phoneAriaLabel: '已同步的辦公室電話',
    faxLabel: '傳真',
    faxAriaLabel: '已同步的辦公室傳真',
    directionsUrlLabel: '導航 URL',
    mapUrlAriaLabel: '辦公室地圖 URL',
    generateFromAddressLabel: '由地址產生',
  },
  en: {
    sectionLabel: 'Office sync',
    sectionTitle: 'Wix-style location settings',
    presetsLabel: 'Office presets',
    presetAriaLabel: (presetTitle) => `Use ${presetTitle} office map preset`,
    officeTitleLabel: 'Office name',
    officeTitleAriaLabel: 'Office title synced value',
    addressLabel: 'Address',
    addressAriaLabel: 'Office address synced value',
    zoomLabel: 'Zoom',
    zoomAriaLabel: 'Office map zoom',
    phoneLabel: 'Phone',
    phoneAriaLabel: 'Office phone synced value',
    faxLabel: 'Fax',
    faxAriaLabel: 'Office fax synced value',
    directionsUrlLabel: 'Directions URL',
    mapUrlAriaLabel: 'Office map URL',
    generateFromAddressLabel: 'Generate from address',
  },
};

export function getSandboxInspectorOfficeQuickEditCopy(locale: Locale): SandboxInspectorOfficeQuickEditCopy {
  return COPY[locale] ?? COPY.en;
}
