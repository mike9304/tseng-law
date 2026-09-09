'use client';

import { useState } from 'react';
import Image from 'next/image';
import { isSiteLocale, type SiteLocale } from '@/lib/locales';
import {
  taipeiPhotos,
  taiwanOfficeData,
  TAIPEI_MAPS_URL,
  YANGJU_NAVER_MAP_URL,
  type OfficeInfo,
  type TaiwanOfficeId,
} from '@/data/office-locations';
import SectionLabel from '@/components/SectionLabel';
import { SurfaceText } from '@/lib/builder/surface-context';
import { guidanceOfficeCopy, type GuidanceOfficeCopy } from '@/data/international-guidance-offices';
import { isGuidanceLocale4, type PublicLocale8 } from '@/lib/public-guidance';

/**
 * WO-O29 A. The four guidance locales (vi/id/th/fil) used to render a separate
 * flat office band that listed all four Taiwan offices at once, so their
 * `iframe` / `tel:` / Google-maps counts could never equal `/en`, which shows
 * one office at a time behind these tabs. They now render this same component,
 * so the office section is structurally identical in all eight languages and
 * every office stays reachable by clicking its tab. Only tab labels, field
 * labels and photo alt-text come from `guidanceOfficeCopy`; addresses, phone
 * and fax numbers, map URLs and photographs stay canonical.
 */

// Google 플레이스 2026-07-21 기준, 수동 갱신
const TAIPEI_RATING_VALUE = '5.0';
const TAIPEI_REVIEW_COUNT = 17;

function taipeiRatingSummary(locale: PublicLocale8, guidance: GuidanceOfficeCopy | null) {
  if (locale === 'ko') return `${TAIPEI_RATING_VALUE} · 리뷰 ${TAIPEI_REVIEW_COUNT}개`;
  if (locale === 'zh-hant') return `${TAIPEI_RATING_VALUE} · ${TAIPEI_REVIEW_COUNT} 則評論`;
  if (locale === 'ja') return `${TAIPEI_RATING_VALUE}・クチコミ${TAIPEI_REVIEW_COUNT}件`;
  if (guidance) return `${TAIPEI_RATING_VALUE} · ${TAIPEI_REVIEW_COUNT} ${guidance.reviewCountWord}`;
  return `${TAIPEI_RATING_VALUE} · ${TAIPEI_REVIEW_COUNT} reviews`;
}

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
    address: '韓国京畿道楊州市玉井東路177 Suhyeon Plaza 4階',
    mapLinkLabel: 'NAVERマップで見る',
  },
};

/** Canonical Taiwan records, with only the city name written in the page language. */
function taiwanOfficesFor(locale: PublicLocale8, guidance: GuidanceOfficeCopy | null): OfficeInfo[] {
  if (!guidance || isSiteLocale(locale)) return taiwanOfficeData[locale as SiteLocale];
  return taiwanOfficeData.en.map((office) => ({
    ...office,
    title: guidance.officeTitles[office.id as TaiwanOfficeId] ?? office.title,
  }));
}

/** Canonical Korea record, with only its heading and map-link label localized. */
function koreaOfficeFor(locale: PublicLocale8, guidance: GuidanceOfficeCopy | null): OfficeInfo {
  if (!guidance || isSiteLocale(locale)) return koreaOfficeData[locale as SiteLocale];
  return {
    ...koreaOfficeData.en,
    title: guidance.koreaOfficeTitle,
    mapLinkLabel: guidance.koreaMapLinkLabel,
  };
}

export default function OfficeMapTabs({
  locale,
  id = 'offices',
  sectionClassName,
  tone = 'light',
  labelSurfaceId = 'section-label',
  titleSurfaceId = 'headline',
}: {
  locale: PublicLocale8;
  id?: string;
  sectionClassName?: string;
  tone?: 'light' | 'dark';
  labelSurfaceId?: string;
  titleSurfaceId?: string;
}) {
  const guidance = isGuidanceLocale4(locale) ? guidanceOfficeCopy[locale] : null;
  const offices = taiwanOfficesFor(locale, guidance);
  const koreaOffice = koreaOfficeFor(locale, guidance);
  const [activeId, setActiveId] = useState(offices[0]?.id ?? '');
  const current = offices.find((office) => office.id === activeId) ?? offices[0];
  const title = guidance
    ? guidance.title
    : locale === 'ko'
      ? '오시는길'
      : locale === 'zh-hant'
        ? '事務所據點'
        : locale === 'ja'
          ? '事務所所在地'
          : 'Office Locations';
  const officeLabel = guidance
    ? guidance.officeLabel
    : locale === 'ko' ? '사무소' : locale === 'zh-hant' ? '據點' : locale === 'ja' ? '事務所' : 'Office';
  const telLabel = guidance
    ? guidance.phoneLabel
    : locale === 'ko' ? '전화' : locale === 'zh-hant' ? '電話' : locale === 'ja' ? '電話' : 'Phone';
  const faxLabel = guidance
    ? guidance.faxLabel
    : locale === 'ko' ? '팩스' : locale === 'zh-hant' ? '傳真' : locale === 'ja' ? 'FAX' : 'Fax';
  const viewMapLabel = guidance
    ? guidance.mapLinkLabel
    : locale === 'ko'
      ? 'Google 지도에서 보기 (사진·리뷰)'
      : locale === 'zh-hant'
        ? '在 Google 地圖查看 (照片·評論)'
        : locale === 'ja'
          ? 'Google マップで見る（写真・口コミ）'
          : 'View on Google Maps (photos & reviews)';
  const mapPreviewLabel = guidance
    ? guidance.mapPreviewLabel
    : locale === 'ko'
      ? '지도 미리보기'
      : locale === 'zh-hant'
        ? '地圖預覽'
        : locale === 'ja'
          ? '地図プレビュー'
          : 'Map preview';
  const addressCardLabel = guidance
    ? guidance.koreaAddressCardLabel
    : locale === 'ko'
      ? '한국 사무실 주소'
      : locale === 'zh-hant'
        ? '韓國辦公室地址'
        : locale === 'ja'
          ? '韓国事務所の所在地'
          : 'Korea office address';
  const openMapLabel = guidance
    ? guidance.mapLinkLabel
    : locale === 'ko'
      ? '지도 열기'
      : locale === 'zh-hant'
        ? '開啟地圖'
        : locale === 'ja'
          ? '地図を開く'
          : 'Open map';

  if (!current) return null;

  const sectionClass = sectionClassName ?? 'section section--light';

  return (
    <section
      className={sectionClass}
      id={id}
      data-tone={tone}
      data-guidance-offices={guidance ? 'true' : undefined}
    >
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
                title={
                  locale === 'ja'
                    ? `${current.title}の地図`
                    : guidance
                      ? `${current.title} — ${mapPreviewLabel}`
                      : `${current.title} map`
                }
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
          <article className="card office-card" data-guidance-office={guidance ? current.id : undefined}>
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
                >
                  <span className="office-rating-stars" aria-hidden="true">
                    ★★★★★
                  </span>
                  <span className="office-rating-text">{taipeiRatingSummary(locale, guidance)}</span>
                </a>
                <div className="office-gallery">
                  {taipeiPhotos.map((photo, photoIndex) => (
                    <div
                      className="office-gallery-item"
                      key={photo.src}
                      data-guidance-office-photo={guidance ? photo.src : undefined}
                    >
                      <Image
                        src={photo.src}
                        alt={
                          guidance
                            ? guidance.photoAlts[photoIndex] ?? guidance.photoAlts[0]
                            : photo.alt[locale as SiteLocale]
                        }
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
