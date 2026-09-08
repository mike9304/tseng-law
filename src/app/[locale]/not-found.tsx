import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';
import { normalizeSiteLocale, type SiteLocale } from '@/lib/locales';
import { buildLocalizedNotFoundMetadata, notFoundCopyByLocale } from '@/lib/not-found-copy';
import {
  CONSULTATION_EMAIL,
  getConsultationPublicMailto,
} from '@/lib/consultation/public-contact';
import styles from './NotFound.module.css';

async function requestLocale(): Promise<SiteLocale> {
  const pathname = (await headers()).get('x-tseng-pathname') ?? '';
  const locale = pathname.split('/').filter(Boolean)[0];
  return normalizeSiteLocale(locale);
}

export async function generateMetadata(): Promise<Metadata> {
  return buildLocalizedNotFoundMetadata(await requestLocale());
}

export default async function LocalizedNotFound() {
  const locale = await requestLocale();
  const copy = notFoundCopyByLocale[locale];

  return (
    <section className={`not-found-page ${styles.root}`} aria-labelledby="not-found-title">
      <div className="container not-found-card">
        <p className="not-found-code" aria-hidden="true">404</p>
        <h1 id="not-found-title">{copy.title}</h1>
        <p>{copy.description}</p>
        <div className={`not-found-actions ${styles.actions}`}>
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
