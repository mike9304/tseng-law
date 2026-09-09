import type { SiteLocale } from '@/lib/locales';

/**
 * Canonical Taiwan office records and Taipei office photographs.
 *
 * These used to live inside `OfficeMapTabs`, a `'use client'` component. A
 * server component that imports a value from a client module receives a client
 * reference proxy, not the value — the guidance office band crashed with
 * "taipeiPhotos.map is not a function" — so the data lives in this plain module
 * and both the client tabs and the server-rendered guidance band read it here.
 */

export type OfficeInfo = {
  id: string;
  title: string;
  address: string;
  phone?: string;
  phoneLabel?: string;
  fax?: string;
  embedUrl?: string;
  mapsUrl: string;
  mapLinkLabel?: string;
};

const TAIPEI_EMBED_URL = 'https://maps.google.com/maps?q=25.0510767,121.5173077&z=16&output=embed';
export const TAIPEI_MAPS_URL = 'https://maps.app.goo.gl/mULpyAnQGz3M1GoQ6';
export const YANGJU_NAVER_MAP_URL = 'https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%96%91%EC%A3%BC%EC%8B%9C%20%EC%98%A5%EC%A0%95%EB%8F%99%EB%A1%9C%20177%20%EC%88%98%ED%98%84%ED%94%84%EB%9D%BC%EC%9E%90%204%EC%B8%B5';
// 등록 후 공식 임베드 전환용: `https://map.naver.com/p/embed/place/{placeId}` (스마트플레이스 등록 대기)

type TaipeiPhoto = { src: string; alt: Record<SiteLocale, string> };

export const taipeiPhotos: TaipeiPhoto[] = [
  {
    src: '/images/office/taipei-01.jpg',
    alt: {
      ko: '법무법인 호정 타이베이 사무소 응접실',
      'zh-hant': '昊鼎國際法律事務所台北辦公室接待室',
      en: 'Hovering International Law Firm Taipei office reception room',
      ja: '昊鼎国際法律事務所 台北事務所の応接室',
    },
  },
  {
    src: '/images/office/taipei-02.jpg',
    alt: {
      ko: '법무법인 호정 타이베이 사무소 집무실',
      'zh-hant': '昊鼎國際法律事務所台北辦公室律師辦公室',
      en: "Hovering International Law Firm Taipei office attorney's office",
      ja: '昊鼎国際法律事務所 台北事務所の執務室',
    },
  },
  {
    src: '/images/office/taipei-03.jpg',
    alt: {
      ko: '법무법인 호정 타이베이 사무소 회의실',
      'zh-hant': '昊鼎國際法律事務所台北辦公室會議室',
      en: 'Hovering International Law Firm Taipei office meeting room',
      ja: '昊鼎国際法律事務所 台北事務所の会議室',
    },
  },
];

export type TaiwanOfficeId = 'taipei' | 'taichung' | 'kaohsiung' | 'pingtung';
type TaiwanOfficeInfo = OfficeInfo & { id: TaiwanOfficeId };

const zhHantTaiwanOffices: TaiwanOfficeInfo[] = [
  {
    id: 'taipei',
    title: '台北',
    address: '103臺北市大同區承德路一段35號7樓之2',
    embedUrl: TAIPEI_EMBED_URL,
    mapsUrl: TAIPEI_MAPS_URL
  },
  {
    id: 'taichung',
    title: '台中',
    address: '40453臺中市北區館前路19號6樓之1',
    phone: '04-2326-1862',
    fax: '04-2326-1863',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.6658294!3d24.1554306!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d9e732d2ffb%3A0xf5febc8f45f245fe!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOWPsOS4reaJgA!5e0!3m2!1szh-TW!2stw',
    mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80'
  },
  {
    id: 'kaohsiung',
    title: '高雄',
    address: '81358高雄市左營區安吉街233號',
    phone: '07-557-9797',
    fax: '07-557-7171',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.3078343!3d22.6620929!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e05034374bf33%3A0x1cb351715e1377c4!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOmrmOmbhOaJgA!5e0!3m2!1szh-TW!2stw',
    mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80'
  },
  {
    id: 'pingtung',
    title: '屏東',
    address: '90443屏東縣九如鄉九如路三段46號',
    phone: '08-739-1689',
    fax: '08-739-7362',
    embedUrl: 'https://maps.google.com/maps?q=90443%E5%B1%8F%E6%9D%B1%E7%B8%A3%E4%B9%9D%E5%A6%82%E9%84%89%E4%B9%9D%E5%A6%82%E8%B7%AF%E4%B8%89%E6%AE%B546%E8%99%9F&z=16&output=embed',
    mapsUrl: 'https://www.google.com/maps/search/90443%E5%B1%8F%E6%9D%B1%E7%B8%A3%E4%B9%9D%E5%A6%82%E9%84%89%E4%B9%9D%E5%A6%82%E8%B7%AF%E4%B8%89%E6%AE%B546%E8%99%9F'
  }
];

const japaneseTaiwanOfficeTitles: Record<TaiwanOfficeId, string> = {
  taipei: '台北事務所',
  taichung: '台中事務所',
  kaohsiung: '高雄事務所',
  pingtung: '屏東事務所',
};

// ja 주소는 site-content.ts 연락처 관례(일본식 한자·층수 표기)를 따른다.
const japaneseTaiwanOfficeAddresses: Record<TaiwanOfficeId, string> = {
  taipei: '103 台北市大同区承徳路一段35号7F-2',
  taichung: '40453 台中市北区館前路19号6F-1',
  kaohsiung: '81358 高雄市左営区安吉街233号',
  pingtung: '90443 屏東県九如郷九如路三段46号',
};

export const taiwanOfficeData: Record<SiteLocale, OfficeInfo[]> = {
  ko: [
    {
      id: 'taipei',
      title: '타이베이',
      address: '103 臺北市大同區承德路一段35號7樓之2',
      embedUrl: TAIPEI_EMBED_URL,
      mapsUrl: TAIPEI_MAPS_URL
    },
    {
      id: 'taichung',
      title: '타이중',
      address: '40453 臺中市北區館前路19號6樓之1',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.6658294!3d24.1554306!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d9e732d2ffb%3A0xf5febc8f45f245fe!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOWPsOS4reaJgA!5e0!3m2!1sko!2stw',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80'
    },
    {
      id: 'kaohsiung',
      title: '가오슝',
      address: '81358 高雄市左營區安吉街233號',
      phone: '07-557-9797',
      fax: '07-557-7171',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.3078343!3d22.6620929!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e05034374bf33%3A0x1cb351715e1377c4!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOmrmOmbhOaJgA!5e0!3m2!1sko!2stw',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80'
    },
    {
      id: 'pingtung',
      title: '핑둥',
      address: '90443 屏東縣九如鄉九如路三段46號',
      phone: '08-739-1689',
      fax: '08-739-7362',
      embedUrl: 'https://maps.google.com/maps?q=90443%E5%B1%8F%E6%9D%B1%E7%B8%A3%E4%B9%9D%E5%A6%82%E9%84%89%E4%B9%9D%E5%A6%82%E8%B7%AF%E4%B8%89%E6%AE%B546%E8%99%9F&z=16&output=embed',
      mapsUrl: 'https://www.google.com/maps/search/90443%E5%B1%8F%E6%9D%B1%E7%B8%A3%E4%B9%9D%E5%A6%82%E9%84%89%E4%B9%9D%E5%A6%82%E8%B7%AF%E4%B8%89%E6%AE%B546%E8%99%9F'
    }
  ],
  'zh-hant': zhHantTaiwanOffices,
  en: [
    {
      id: 'taipei',
      title: 'Taipei',
      address: '103, 7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City',
      embedUrl: TAIPEI_EMBED_URL,
      mapsUrl: TAIPEI_MAPS_URL
    },
    {
      id: 'taichung',
      title: 'Taichung',
      address: '40453, 6F-1, No. 19, Guanqian Rd., North Dist., Taichung City',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.6658294!3d24.1554306!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d9e732d2ffb%3A0xf5febc8f45f245fe!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOWPsOS4reaJgA!5e0!3m2!1sen!2stw',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80'
    },
    {
      id: 'kaohsiung',
      title: 'Kaohsiung',
      address: '81358, No. 233, Anji St., Zuoying Dist., Kaohsiung City',
      phone: '07-557-9797',
      fax: '07-557-7171',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.3078343!3d22.6620929!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e05034374bf33%3A0x1cb351715e1377c4!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOmrmOmbhOaJgA!5e0!3m2!1sen!2stw',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80'
    },
    {
      id: 'pingtung',
      title: 'Pingtung',
      address: 'No. 46, Sec. 3, Jiuru Rd., Jiuru Township, Pingtung County 90443',
      phone: '08-739-1689',
      fax: '08-739-7362',
      embedUrl: 'https://maps.google.com/maps?q=90443%E5%B1%8F%E6%9D%B1%E7%B8%A3%E4%B9%9D%E5%A6%82%E9%84%89%E4%B9%9D%E5%A6%82%E8%B7%AF%E4%B8%89%E6%AE%B546%E8%99%9F&z=16&output=embed',
      mapsUrl: 'https://www.google.com/maps/search/90443%E5%B1%8F%E6%9D%B1%E7%B8%A3%E4%B9%9D%E5%A6%82%E9%84%89%E4%B9%9D%E5%A6%82%E8%B7%AF%E4%B8%89%E6%AE%B546%E8%99%9F'
    }
  ],
  ja: zhHantTaiwanOffices.map((office) => ({
    ...office,
    title: japaneseTaiwanOfficeTitles[office.id],
    address: japaneseTaiwanOfficeAddresses[office.id],
  })),
};

