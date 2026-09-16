import type { Metadata } from 'next';
import SemiconductorGuideIndex from '@/components/semiconductor-drafts/SemiconductorGuideIndex';
import { getSemiconductorServiceDraft } from '@/lib/semiconductor-drafts';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const service = getSemiconductorServiceDraft();
  return {
    title: `${service.title} · 관리자 초안 미리보기`,
    robots: { index: false, follow: false, noarchive: true, nosnippet: true },
  };
}

export default function SemiconductorAdminPreviewPage() {
  return <SemiconductorGuideIndex admin />;
}
