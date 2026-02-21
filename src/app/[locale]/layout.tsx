import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { normalizeLocale, type Locale, locales } from '@/lib/locales';
import { siteContent } from '@/data/site-content';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocaleSetter from '@/components/LocaleSetter';
import ScrollTopButton from '@/components/ScrollTopButton';
import ScrollProgressLine from '@/components/ScrollProgressLine';
import QuickContactWidget from '@/components/QuickContactWidget';
import SectionDotNav from '@/components/SectionDotNav';
import YearEndEventPopup from '@/components/YearEndEventPopup';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: Locale } }): Metadata {
  const locale = normalizeLocale(params.locale);
  const content = siteContent[locale];
  return {
    title: content.meta.title,
    description: content.meta.description
  };
}

export default function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  return (
    <div className="site" data-locale={locale} data-theme="parity">
      <LocaleSetter locale={locale} />
      <Header locale={locale} />
      <ScrollProgressLine />
      <main id="main">{children}</main>
      <Footer locale={locale} />
      <SectionDotNav locale={locale} />
      <QuickContactWidget locale={locale} />
      <ScrollTopButton locale={locale} />
      <YearEndEventPopup locale={locale} />
    </div>
  );
}
