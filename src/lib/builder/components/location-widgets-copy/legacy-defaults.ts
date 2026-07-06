import type { AddressBlockContent, BusinessHourRow, MultiLocation } from './types';

export const LOCATION_WIDGETS_LEGACY_DEFAULTS = {
  addressBlock: {
    label: '본 사무소',
    line1: '서울특별시 강남구',
    line2: '테헤란로 152',
    cityRegion: '강남구',
    postalCode: '06236',
    country: '대한민국',
    phone: '+82 2-0000-0000',
    showCopyButton: true,
    showDirectionsLink: true,
    directionsHref: '',
  },
  businessHours: {
    title: '영업 시간',
    timezone: 'Asia/Seoul',
    rows: [
      { day: '일', hours: '', closed: true },
      { day: '월', hours: '09:00 ~ 18:00', closed: false },
      { day: '화', hours: '09:00 ~ 18:00', closed: false },
      { day: '수', hours: '09:00 ~ 18:00', closed: false },
      { day: '목', hours: '09:00 ~ 18:00', closed: false },
      { day: '금', hours: '09:00 ~ 18:00', closed: false },
      { day: '토', hours: '10:00 ~ 14:00', closed: false },
    ],
    note: '공휴일은 별도 안내합니다.',
  },
  multiLocationMap: {
    title: '지점 안내',
    locations: [
      { name: '서울 본점', address: '서울특별시 강남구 테헤란로 152', lat: 37.4994, lng: 127.0356 },
      { name: '대만 지점', address: '台北市信義區市府路45號', lat: 25.0376, lng: 121.5640 },
    ],
  },
} as const satisfies {
  addressBlock: AddressBlockContent;
  businessHours: {
    title: string;
    timezone: string;
    rows: readonly BusinessHourRow[];
    note: string;
  };
  multiLocationMap: {
    title: string;
    locations: readonly MultiLocation[];
  };
};
