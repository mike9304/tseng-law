import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SemiconductorColumnPreview from '@/components/semiconductor-drafts/SemiconductorColumnPreview';
import {
  getSemiconductorDraftBySlug,
  isSemiconductorDraftPreviewEnabled,
} from '@/lib/semiconductor-drafts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  if (!isSemiconductorDraftPreviewEnabled()) return { title: 'Not found' };
  const { locale, slug } = await props.params;
  const record = getSemiconductorDraftBySlug(slug);
  if (locale !== 'ko' || !record || record.kind !== 'article') {
    return { title: 'Not found' };
  }
  return {
    title: `${record.title} · 초안 미리보기`,
    description: record.metaDescription,
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  };
}

export default async function SemiconductorColumnDesignPreviewPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  if (!isSemiconductorDraftPreviewEnabled()) notFound();
  const { locale, slug } = await props.params;
  if (locale !== 'ko') notFound();
  const record = getSemiconductorDraftBySlug(slug);
  if (!record || record.kind !== 'article') notFound();
  return <SemiconductorColumnPreview record={record} />;
}
