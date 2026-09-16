import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SemiconductorColumnPreview from '@/components/semiconductor-drafts/SemiconductorColumnPreview';
import { getSemiconductorDraftBySlug } from '@/lib/semiconductor-drafts';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  if (locale !== 'ko') {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }
  const record = getSemiconductorDraftBySlug(slug);
  if (!record || record.kind !== 'article') {
    return { title: 'Not found', robots: { index: false, follow: false } };
  }
  return {
    title: `${record.title} · 관리자 초안 미리보기`,
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  };
}

export default async function SemiconductorAdminColumnPreviewPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  if (locale !== 'ko') notFound();
  const record = getSemiconductorDraftBySlug(slug);
  if (!record || record.kind !== 'article') notFound();
  return <SemiconductorColumnPreview record={record} admin />;
}
