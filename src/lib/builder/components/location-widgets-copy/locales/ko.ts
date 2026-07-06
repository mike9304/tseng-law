import { presetAddresses } from '../presets';
import type { LocationWidgetsCopy } from '../types';
import { LOCATION_WIDGETS_LEGACY_DEFAULTS } from '../legacy-defaults';
import { cloneLocations, cloneRows } from '../helpers';

export const koCopy: LocationWidgetsCopy = {
  addressBlock: {
    defaultContent: { ...LOCATION_WIDGETS_LEGACY_DEFAULTS.addressBlock },
    copyButton: '주소 복사',
    copiedButton: '복사됨',
    directionsLink: '길찾기',
    inspector: {
      label: '라벨',
      line1: '1행',
      line2: '2행',
      cityRegion: '도시/지역',
      postalCode: '우편번호',
      country: '국가',
      phone: '전화',
      directionsHref: '길찾기 URL (자동 생성 override)',
      showCopyButton: '복사 버튼',
      showDirectionsLink: '길찾기 링크',
    },
  },
  businessHours: {
    defaultTitle: LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.title,
    defaultTimezone: LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.timezone,
    defaultRows: cloneRows(LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.rows),
    defaultNote: LOCATION_WIDGETS_LEGACY_DEFAULTS.businessHours.note,
    empty: '영업 시간을 인스펙터에서 추가하세요',
    closed: '휴무',
    inspector: {
      title: '제목',
      timezone: '시간대',
      rows: '요일별 시간 (day | hours [| closed])',
      highlightToday: '오늘 강조',
      note: '비고',
    },
  },
  multiLocationMap: {
    defaultTitle: LOCATION_WIDGETS_LEGACY_DEFAULTS.multiLocationMap.title,
    defaultLocations: cloneLocations(LOCATION_WIDGETS_LEGACY_DEFAULTS.multiLocationMap.locations),
    count: (count) => `${count}개 지점`,
    empty: '지점을 인스펙터에서 추가하세요',
    noActive: '활성 지점 없음',
    inspector: {
      title: '제목',
      locations: '지점 (name | address | lat | lng)',
      activeIndex: '활성 인덱스',
      showList: '리스트 표시',
    },
  },
  map: {
    iframeTitle: 'Google Maps',
    editBadge: 'Map · 위치 변경',
    fallbackMessage: '지도를 불러올 수 없습니다',
    openInMaps: 'Google 지도에서 보기',
    officePresets: '사무소 프리셋',
    address: '주소',
    addressPlaceholder: '서울특별시 강남구...',
    zoomLevel: (zoom) => `줌 레벨 (${zoom})`,
    addressAria: 'Map address',
    decreaseZoomAria: 'Decrease map zoom',
    zoomAria: 'Map zoom',
    increaseZoomAria: 'Increase map zoom',
    presetAria: (label) => `${label} office map preset`,
    presets: [
      { label: '타이중', address: presetAddresses.taichung },
      { label: '가오슝', address: presetAddresses.kaohsiung },
      { label: '타이베이', address: presetAddresses.taipei },
    ],
  },
};
