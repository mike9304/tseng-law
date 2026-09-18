import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import SemiconductorGuideIndex from '@/components/semiconductor-drafts/SemiconductorGuideIndex';
import {
  getSemiconductorServiceDraft,
  isSemiconductorDraftPreviewEnabled,
} from '@/lib/semiconductor-drafts';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  if (!isSemiconductorDraftPreviewEnabled()) return { title: 'Not found' };
  const service = getSemiconductorServiceDraft();
  return {
    title: `${service.title} · 초안 미리보기`,
    description: service.metaDescription,
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  };
}

export default async function SemiconductorDesignPreviewPage(props: {
  params: Promise<{ locale: string }>;
}) {
  if (!isSemiconductorDraftPreviewEnabled()) notFound();
  const { locale } = await props.params;
  if (locale !== 'ko') notFound();
  return <SemiconductorGuideIndex />;
}
