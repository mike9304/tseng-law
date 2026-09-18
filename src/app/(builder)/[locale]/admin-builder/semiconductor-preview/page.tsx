import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SemiconductorGuideIndex from '@/components/semiconductor-drafts/SemiconductorGuideIndex';
import { getSemiconductorServiceDraft } from '@/lib/semiconductor-drafts';

export const dynamic = 'force-dynamic';

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  if (locale !== 'ko') return { title: 'Not found', robots: { index: false, follow: false } };
  const service = getSemiconductorServiceDraft();
  return {
    title: `${service.title} · 관리자 초안 미리보기`,
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  };
}

export default async function SemiconductorAdminPreviewPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  if (locale !== 'ko') notFound();
  return <SemiconductorGuideIndex admin />;
}
