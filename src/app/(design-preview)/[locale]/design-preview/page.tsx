import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isSiteLocale, type SiteLocale } from '@/lib/locales';
import DesignPreview from '@/app/[locale]/design-preview/DesignPreview';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isPreviewEnabled() {
  // The design study is intentionally not part of the production surface.
  // An explicit opt-in is required if somebody wants to inspect a production
  // build locally with `DESIGN_PREVIEW=1`.
  return process.env.NODE_ENV !== 'production' || process.env.DESIGN_PREVIEW === '1';
}

function resolveLocale(raw: string): SiteLocale {
  if (!isSiteLocale(raw)) notFound();
  return raw;
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  if (!isPreviewEnabled()) return { title: 'Not found' };
  const { locale: rawLocale } = await props.params;
  const locale = resolveLocale(rawLocale);
  return {
    title: `Design study · ${locale}`,
    description: 'Local-only visual design study for Hovering International Law Firm.',
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  };
}

export default async function DesignPreviewPage(props: {
  params: Promise<{ locale: string }>;
}) {
  if (!isPreviewEnabled()) notFound();
  const { locale: rawLocale } = await props.params;
  const locale = resolveLocale(rawLocale);
  return <DesignPreview locale={locale} />;
}
