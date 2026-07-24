'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { SiteLocale } from '@/lib/locales';
import SectionLabel from '@/components/SectionLabel';
import { SurfaceText } from '@/lib/builder/surface-context';

type OfficeInfo = {
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
const TAIPEI_MAPS_URL = 'https://maps.app.goo.gl/mULpyAnQGz3M1GoQ6';
const YANGJU_NAVER_MAP_URL = 'https://map.naver.com/p/search/%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%96%91%EC%A3%BC%EC%8B%9C%20%EC%98%A5%EC%A0%95%EB%8F%99%EB%A1%9C%20177%20%EC%88%98%ED%98%84%ED%94%84%EB%9D%BC%EC%9E%90%204%EC%B8%B5';
// 등록 후 공식 임베드 전환용: `https://map.naver.com/p/embed/place/{placeId}` (스마트플레이스 등록 대기)

// Google 플레이스 2026-07-21 기준, 수동 갱신
const TAIPEI_RATING_VALUE = '5.0';
const TAIPEI_REVIEW_COUNT = 17;

function taipeiRatingSummary(locale: SiteLocale) {
  if (locale === 'ko') return `${TAIPEI_RATING_VALUE} · 리뷰 ${TAIPEI_REVIEW_COUNT}개`;
  if (locale === 'zh-hant') return `${TAIPEI_RATING_VALUE} · ${TAIPEI_REVIEW_COUNT} 則評論`;
  if (locale === 'ja') return `${TAIPEI_RATING_VALUE}・クチコミ${TAIPEI_REVIEW_COUNT}件`;
  return `${TAIPEI_RATING_VALUE} · ${TAIPEI_REVIEW_COUNT} reviews`;
}

function taipeiRatingAriaLabel(locale: SiteLocale) {
  if (locale === 'ko') return `구글 평점 ${TAIPEI_RATING_VALUE}, 리뷰 ${TAIPEI_REVIEW_COUNT}개`;
  if (locale === 'zh-hant') return `Google 評分 ${TAIPEI_RATING_VALUE}，${TAIPEI_REVIEW_COUNT} 則評論`;
  if (locale === 'ja') {
    return `Googleでの評価は${TAIPEI_RATING_VALUE}、クチコミは${TAIPEI_REVIEW_COUNT}件です`;
  }
  return `Google rating ${TAIPEI_RATING_VALUE}, ${TAIPEI_REVIEW_COUNT} reviews`;
}

type TaipeiPhoto = { src: string; alt: Record<SiteLocale, string> };

const taipeiPhotos: TaipeiPhoto[] = [
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

type TaiwanOfficeId = 'taipei' | 'taichung' | 'kaohsiung';
type TaiwanOfficeInfo = OfficeInfo & { id: TaiwanOfficeId };

const zhHantTaiwanOffices: TaiwanOfficeInfo[] = [
  {
    id: 'taipei',
    title: '台北',
    address: '台北市大同區承德路一段35號7樓之2',
    embedUrl: TAIPEI_EMBED_URL,
    mapsUrl: TAIPEI_MAPS_URL
  },
  {
    id: 'taichung',
    title: '台中',
    address: '臺中市北區館前路19號樓之1',
    phone: '04-2326-1862',
    fax: '04-2326-1863',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.6658294!3d24.1554306!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d9e732d2ffb%3A0xf5febc8f45f245fe!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOWPsOS4reaJgA!5e0!3m2!1szh-TW!2stw',
    mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80'
  },
  {
    id: 'kaohsiung',
    title: '高雄',
    address: '高雄市左營區安吉街233號',
    phone: '07-557-9797',
    embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.3078343!3d22.6620929!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e05034374bf33%3A0x1cb351715e1377c4!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOmrmOmbhOaJgA!5e0!3m2!1szh-TW!2stw',
    mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80'
  }
];

const japaneseTaiwanOfficeTitles: Record<TaiwanOfficeId, string> = {
  taipei: '台北事務所',
  taichung: '台中事務所',
  kaohsiung: '高雄事務所',
};

const taiwanOfficeData: Record<SiteLocale, OfficeInfo[]> = {
  ko: [
    {
      id: 'taipei',
      title: '타이베이',
      address: '台北市大同區承德路一段35號7樓之2',
      embedUrl: TAIPEI_EMBED_URL,
      mapsUrl: TAIPEI_MAPS_URL
    },
    {
      id: 'taichung',
      title: '타이중',
      address: '臺中市北區館前路19號樓之1',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.6658294!3d24.1554306!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d9e732d2ffb%3A0xf5febc8f45f245fe!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOWPsOS4reaJgA!5e0!3m2!1sko!2stw',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80'
    },
    {
      id: 'kaohsiung',
      title: '가오슝',
      address: '高雄市左營區安吉街233號',
      phone: '07-557-9797',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.3078343!3d22.6620929!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e05034374bf33%3A0x1cb351715e1377c4!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOmrmOmbhOaJgA!5e0!3m2!1sko!2stw',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80'
    }
  ],
  'zh-hant': zhHantTaiwanOffices,
  en: [
    {
      id: 'taipei',
      title: 'Taipei',
      address: '7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City',
      embedUrl: TAIPEI_EMBED_URL,
      mapsUrl: TAIPEI_MAPS_URL
    },
    {
      id: 'taichung',
      title: 'Taichung',
      address: 'No. 19, Guanqian Rd., North Dist., Taichung City',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.6658294!3d24.1554306!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d9e732d2ffb%3A0xf5febc8f45f245fe!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOWPsOS4reaJgA!5e0!3m2!1sen!2stw',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E5%8F%B0%E4%B8%AD%E6%89%80'
    },
    {
      id: 'kaohsiung',
      title: 'Kaohsiung',
      address: 'No. 233, Anji St., Zuoying Dist., Kaohsiung City',
      phone: '07-557-9797',
      embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1500!2d120.3078343!3d22.6620929!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x346e05034374bf33%3A0x1cb351715e1377c4!2z5piK6byO5ZyL6Zqb5rOV5b6L5LqL5YuZ5omAIOmrmOmbhOaJgA!5e0!3m2!1sen!2stw',
      mapsUrl: 'https://www.google.com/maps/search/%E6%98%8A%E9%BC%8E%E5%9C%8B%E9%9A%9B%E6%B3%95%E5%BE%8B%E4%BA%8B%E5%8B%99%E6%89%80+%E9%AB%98%E9%9B%84%E6%89%80'
    }
  ],
  ja: zhHantTaiwanOffices.map((office) => ({
    ...office,
    title: japaneseTaiwanOfficeTitles[office.id],
  })),
};

const zhHantKoreaOffice: OfficeInfo = {
  id: 'yangju',
  title: '韓國辦公室',
  address: '韓國京畿道楊州市玉井東路177號 Suhyeon Plaza 4樓',
  phone: '+82-10-2992-9304',
  mapsUrl: YANGJU_NAVER_MAP_URL,
  mapLinkLabel: '在 Naver 地圖查看'
};

const koreaOfficeData: Record<SiteLocale, OfficeInfo> = {
  ko: {
    id: 'yangju',
    title: '한국 사무실',
    address: '경기도 양주시 옥정동로 177 수현프라자 4층',
    phone: '+82-10-2992-9304',
    mapsUrl: YANGJU_NAVER_MAP_URL,
    mapLinkLabel: '네이버 지도에서 보기'
  },
  'zh-hant': zhHantKoreaOffice,
  en: {
    id: 'yangju',
    title: 'Korea Office',
    address: '4F, Suhyeon Plaza, 177 Okjeongdong-ro, Yangju-si, Gyeonggi-do',
    phone: '+82-10-2992-9304',
    mapsUrl: YANGJU_NAVER_MAP_URL,
    mapLinkLabel: 'View on Naver Map'
  },
  ja: {
    ...zhHantKoreaOffice,
    title: '韓国事務所',
    mapLinkLabel: 'NAVERマップで見る',
  },
};

export default function OfficeMapTabs({
  locale,
  id = 'offices',
  sectionClassName,
  tone = 'light',
  labelSurfaceId = 'section-label',
  titleSurfaceId = 'headline',
}: {
  locale: SiteLocale;
  id?: string;
  sectionClassName?: string;
  tone?: 'light' | 'dark';
  labelSurfaceId?: string;
  titleSurfaceId?: string;
}) {
  const offices = taiwanOfficeData[locale];
  const koreaOffice = koreaOfficeData[locale];
  const [activeId, setActiveId] = useState(offices[0]?.id ?? '');
  const current = offices.find((office) => office.id === activeId) ?? offices[0];
  const title =
    locale === 'ko'
      ? '오시는길'
      : locale === 'zh-hant'
        ? '事務所據點'
        : locale === 'ja'
          ? '事務所所在地'
          : 'Office Locations';
  const officeLabel =
    locale === 'ko' ? '사무소' : locale === 'zh-hant' ? '據點' : locale === 'ja' ? '事務所' : 'Office';
  const telLabel =
    locale === 'ko' ? '전화' : locale === 'zh-hant' ? '電話' : locale === 'ja' ? '電話' : 'Phone';
  const faxLabel =
    locale === 'ko' ? '팩스' : locale === 'zh-hant' ? '傳真' : locale === 'ja' ? 'FAX' : 'Fax';
  const viewMapLabel =
    locale === 'ko'
      ? 'Google 지도에서 보기 (사진·리뷰)'
      : locale === 'zh-hant'
        ? '在 Google 地圖查看 (照片·評論)'
        : locale === 'ja'
          ? 'Google マップで見る（写真・口コミ）'
          : 'View on Google Maps (photos & reviews)';
  const mapPreviewLabel =
    locale === 'ko'
      ? '지도 미리보기'
      : locale === 'zh-hant'
        ? '地圖預覽'
        : locale === 'ja'
          ? '地図プレビュー'
          : 'Map preview';
  const addressCardLabel =
    locale === 'ko'
      ? '한국 사무실 주소'
      : locale === 'zh-hant'
        ? '韓國辦公室地址'
        : locale === 'ja'
          ? '韓国事務所の所在地'
          : 'Korea office address';
  const openMapLabel =
    locale === 'ko'
      ? '지도 열기'
      : locale === 'zh-hant'
        ? '開啟地圖'
        : locale === 'ja'
          ? '地図を開く'
          : 'Open map';

  if (!current) return null;

  const sectionClass = sectionClassName ?? 'section section--light';

  return (
    <section className={sectionClass} id={id} data-tone={tone}>
      <div className="container">
        <SectionLabel data-builder-surface-key={labelSurfaceId}>
          <SurfaceText surfaceKey={labelSurfaceId}>{locale === 'ko' ? 'OFFICES' : 'OFFICES'}</SurfaceText>
        </SectionLabel>
        <h2 className="section-title" data-builder-surface-key={titleSurfaceId}>
          <SurfaceText surfaceKey={titleSurfaceId}>{title}</SurfaceText>
        </h2>
        <div className="office-tabs" role="tablist" aria-label={title}>
          {offices.map((office) => (
            <button
              key={office.id}
              type="button"
              role="tab"
              className={`tab-button ${office.id === current.id ? 'active' : ''}`}
              aria-selected={office.id === current.id}
              onClick={() => setActiveId(office.id)}
            >
              {office.title}
            </button>
          ))}
        </div>
        <div className="office-layout">
          <div className={`office-map-wrap${current.embedUrl ? '' : ' office-map-wrap--address'}`}>
            {current.embedUrl ? (
              <iframe
                key={current.id}
                title={locale === 'ja' ? `${current.title}の地図` : `${current.title} map`}
                src={current.embedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            ) : null}
            <div
              className={current.embedUrl ? 'office-map-fallback' : 'office-address-card'}
              data-office-map-fallback={current.embedUrl ? true : undefined}
            >
              <div className="office-map-fallback-panel">
                <span className="office-map-fallback-kicker">
                  {current.embedUrl ? mapPreviewLabel : addressCardLabel}
                </span>
                <strong>{current.title}</strong>
                <span>{current.address}</span>
                <a
                  className="office-map-fallback-link"
                  href={current.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {current.mapLinkLabel ?? openMapLabel}
                </a>
              </div>
            </div>
          </div>
          <article className="card office-card">
            <div className="section-label">{officeLabel}</div>
            <h3 className="card-title">{current.title}</h3>
            <p className="card-copy">{current.address}</p>
            {current.phone ? (
              <p className="card-copy">
                {current.phoneLabel ?? telLabel}:{' '}
                <a className="link-underline phone-number" href={`tel:${current.phone.replace(/-/g, '')}`}>{current.phone}</a>
              </p>
            ) : null}
            {current.fax && (
              <p className="card-copy">
                {faxLabel}: {current.fax}
              </p>
            )}
            <a
              className="button office-map-link"
              href={current.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {current.mapLinkLabel ?? viewMapLabel}
            </a>
            {current.id === 'taipei' && (
              <div className="office-taipei-extra">
                <a
                  className="office-rating-link"
                  href={TAIPEI_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={taipeiRatingAriaLabel(locale)}
                >
                  <span className="office-rating-stars" aria-hidden="true">
                    ★★★★★
                  </span>
                  <span className="office-rating-text">{taipeiRatingSummary(locale)}</span>
                </a>
                <div className="office-gallery">
                  {taipeiPhotos.map((photo) => (
                    <div className="office-gallery-item" key={photo.src}>
                      <Image
                        src={photo.src}
                        alt={photo.alt[locale]}
                        fill
                        sizes="(max-width: 640px) 30vw, 140px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>

        <div className="office-korea">
          <div className="section-label">{officeLabel}</div>
          <h3 className="card-title office-korea-title">{koreaOffice.title}</h3>
          <div className="office-layout">
            {/* 네이버 공식 임베드는 플레이스 등록 후 가능(map.naver.com/p/embed/place/{id}) —
                등록 전까지는 주소 카드 + 네이버 링크로 대체. NAVER_EMBED_URL은 등록 후 전환용으로 보존. */}
            <div className="office-map-wrap office-map-wrap--address office-map-wrap--naver">
              <div className="office-address-card">
                <div className="office-map-fallback-panel">
                  <span className="office-map-fallback-kicker">{addressCardLabel}</span>
                  <strong>{koreaOffice.title}</strong>
                  <span>{koreaOffice.address}</span>
                  <a
                    className="office-map-fallback-link"
                    href={koreaOffice.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {koreaOffice.mapLinkLabel}
                  </a>
                </div>
              </div>
            </div>
            <article className="card office-card">
              <p className="card-copy">{koreaOffice.address}</p>
              {koreaOffice.phone ? (
                <p className="card-copy">
                  {telLabel}:{' '}
                  <a className="link-underline phone-number" href={`tel:${koreaOffice.phone.replace(/-/g, '')}`}>
                    {koreaOffice.phone}
                  </a>
                </p>
              ) : null}
              <a
                className="button office-map-link"
                href={koreaOffice.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {koreaOffice.mapLinkLabel}
              </a>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
