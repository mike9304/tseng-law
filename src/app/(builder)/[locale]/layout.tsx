import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { isLocale, type Locale, locales } from '@/lib/locales';
import LocaleSetter from '@/components/LocaleSetter';
import '@/app/column-editor.css';

export const dynamicParams = false;

function resolveLocaleOrNotFound(locale: string): Locale {
  if (!isLocale(locale)) {
    notFound();
  }

  return locale;
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default function BuilderLocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const locale = resolveLocaleOrNotFound(params.locale);

  return (
    <div className="builder-route-layout" data-locale={locale}>
      <LocaleSetter locale={locale} />
      {children}
    </div>
  );
}
