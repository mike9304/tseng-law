import type { Metadata } from 'next';
import SandboxPage from '@/components/builder/canvas/SandboxPage';
import { readCanvasSandboxDraft } from '@/lib/builder/canvas/persistence';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const seoCopy: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: 'Builder Sandbox',
    description: '자유 캔버스 runtime sandbox 입니다.',
  },
  'zh-hant': {
    title: 'Builder Sandbox',
    description: '自由畫布 runtime sandbox。',
  },
  en: {
    title: 'Builder Sandbox',
    description: 'Freeform canvas runtime sandbox.',
  },
};

export function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Metadata {
  const locale = normalizeLocale(params.locale);
  const copy = seoCopy[locale];
  return buildSeoMetadata({
    locale,
    title: copy.title,
    description: copy.description,
    path: '/admin-builder/sandbox',
    noindex: true,
  });
}

export default async function BuilderSandboxPage({
  params,
}: {
  params: { locale: Locale };
}) {
  const locale = normalizeLocale(params.locale);
  const draft = await readCanvasSandboxDraft(locale);

  return (
    <SandboxPage
      locale={locale}
      backend={draft.backend}
      initialDocument={draft.document}
    />
  );
}

