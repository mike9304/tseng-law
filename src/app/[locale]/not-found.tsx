import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import type { Locale } from '@/lib/locales';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';

const copyByLocale = {
  ko: {
    title: '페이지를 찾을 수 없습니다',
    description: '요청하신 주소가 변경되었거나 존재하지 않습니다.',
    home: '홈으로 돌아가기',
    contact: '상담 문의',
    brand: '법무법인 호정',
  },
  'zh-hant': {
    title: '找不到頁面',
    description: '您所查找的網址可能已變更或不存在。',
    home: '返回首頁',
    contact: '聯絡諮詢',
    brand: '昊鼎國際法律事務所',
  },
  en: {
    title: 'Page not found',
    description: 'The address may have changed or the requested page does not exist.',
    home: 'Return home',
    contact: 'Contact us',
    brand: 'Hovering International Law Firm',
  },
} as const;

async function requestLocale(): Promise<Locale> {
  const pathname = (await headers()).get('x-tseng-pathname') ?? '';
  const locale = pathname.split('/').filter(Boolean)[0];
  return locale === 'zh-hant' || locale === 'en' ? locale : 'ko';
}

export async function generateMetadata(): Promise<Metadata> {
  const copy = copyByLocale[await requestLocale()];
  return {
    title: { absolute: `${copy.title} | ${copy.brand}` },
    robots: { index: false, follow: false },
  };
}

export default async function LocalizedNotFound() {
  const locale = await requestLocale();
  const copy = copyByLocale[locale];

  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="container not-found-card">
        <p className="not-found-code" aria-hidden="true">404</p>
        <h1 id="not-found-title">{copy.title}</h1>
        <p>{copy.description}</p>
        <div className="not-found-actions">
          <Link className="button" href={`/${locale}`}>{copy.home}</Link>
          <a
            className="button button--outline"
            href={getConsultationPublicMailto(locale)}
            aria-label={`${copy.contact}: ${CONSULTATION_EMAIL}`}
          >
            {copy.contact}
          </a>
        </div>
      </div>
    </section>
  );
}
