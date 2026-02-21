'use client';

import { useState } from 'react';
import type { Locale } from '@/lib/locales';
import SectionLabel from '@/components/SectionLabel';

type OfficeInfo = {
  id: string;
  title: string;
  address: string;
  phone: string;
  fax?: string;
  embedUrl: string;
  mapsUrl: string;
};

const officeData: Record<Locale, OfficeInfo[]> = {
  ko: [
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
    },
    {
      id: 'taipei',
      title: '타이베이',
      address: '台北市大同區承德路一段35號7樓之2',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      embedUrl: 'https://maps.google.com/maps?q=%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2&t=&z=16&ie=UTF8&iwloc=B&output=embed',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2'
    }
  ],
  'zh-hant': [
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
    },
    {
      id: 'taipei',
      title: '台北',
      address: '台北市大同區承德路一段35號7樓之2',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      embedUrl: 'https://maps.google.com/maps?q=%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2&t=&z=16&ie=UTF8&iwloc=B&output=embed',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2'
    }
  ],
  en: [
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
    },
    {
      id: 'taipei',
      title: 'Taipei',
      address: '7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City',
      phone: '04-2326-1862',
      fax: '04-2326-1863',
      embedUrl: 'https://maps.google.com/maps?q=%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2&t=&z=16&ie=UTF8&iwloc=B&output=embed',
      mapsUrl: 'https://www.google.com/maps/search/%E5%8F%B0%E5%8C%97%E5%B8%82%E5%A4%A7%E5%90%8C%E5%8D%80%E6%89%BF%E5%BE%B7%E8%B7%AF%E4%B8%80%E6%AE%B535%E8%99%9F7%E6%A8%93%E4%B9%8B2'
    }
  ]
};

export default function OfficeMapTabs({
  locale,
  id = 'offices',
  sectionClassName,
  tone = 'light'
}: {
  locale: Locale;
  id?: string;
  sectionClassName?: string;
  tone?: 'light' | 'dark';
}) {
  const offices = officeData[locale];
  const [activeId, setActiveId] = useState(offices[0]?.id ?? '');
  const current = offices.find((office) => office.id === activeId) ?? offices[0];
  const title = locale === 'ko' ? '오시는길' : locale === 'zh-hant' ? '事務所據點' : 'Office Locations';
  const officeLabel = locale === 'ko' ? '사무소' : locale === 'zh-hant' ? '據點' : 'Office';
  const telLabel = locale === 'ko' ? '전화' : locale === 'zh-hant' ? '電話' : 'Phone';
  const faxLabel = locale === 'ko' ? '팩스' : locale === 'zh-hant' ? '傳真' : 'Fax';
  const viewMapLabel =
    locale === 'ko' ? 'Google 지도에서 보기 (사진·리뷰)' : locale === 'zh-hant' ? '在 Google 地圖查看 (照片·評論)' : 'View on Google Maps (photos & reviews)';

  if (!current) return null;

  const sectionClass = sectionClassName ?? 'section section--light';

  return (
    <section className={sectionClass} id={id} data-tone={tone}>
      <div className="container">
        <SectionLabel>{locale === 'ko' ? 'OFFICES' : 'OFFICES'}</SectionLabel>
        <h2 className="section-title">{title}</h2>
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
          <div className="office-map-wrap">
            <iframe
              key={current.id}
              title={`${current.title} map`}
              src={current.embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <article className="card office-card">
            <div className="section-label">{officeLabel}</div>
            <h3 className="card-title">{current.title}</h3>
            <p className="card-copy">{current.address}</p>
            <p className="card-copy">
              {telLabel}: <a className="link-underline phone-number" href={`tel:${current.phone.replace(/-/g, '')}`}>{current.phone}</a>
            </p>
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
              {viewMapLabel}
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
