import type { Metadata } from 'next';
import { normalizeLocale, type Locale } from '@/lib/locales';
import {
  ensureGlobalHeaderFooterIds,
  readHeaderCanvas,
  writeHeaderCanvas,
} from '@/lib/builder/site/persistence';
import { createDefaultCanvasDocument, normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import GlobalCanvasEditor from '@/components/builder/global/GlobalCanvasEditor';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const COPY: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '글로벌 헤더 편집기',
    description: '사이트 헤더 캔버스를 로케일별로 편집합니다.',
  },
  'zh-hant': {
    title: '全域頁首編輯器',
    description: '依語言編輯網站頁首畫布。',
  },
  en: {
    title: 'Global Header Editor',
    description: 'Edit the site header canvas by locale.',
  },
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: COPY[locale].title,
    description: COPY[locale].description,
    path: '/admin-builder/header',
    noindex: true,
  });
}

export default async function GlobalHeaderEditPage({
  params,
}: {
  params: { locale: string };
}) {
  const locale: Locale = normalizeLocale(params.locale);

  let canvas = await readHeaderCanvas('default');
  if (!canvas) {
    // Lazy-seed an empty canvas so first-time editors land in the editor with
    // a 1280×120 stage. Published pages fall back to the legacy SiteHeader
    // component until the user adds nodes here.
    const seed = createDefaultCanvasDocument(locale);
    canvas = { ...seed, nodes: [], stageWidth: 1280, stageHeight: 120 };
    try {
      await writeHeaderCanvas('default', canvas);
      await ensureGlobalHeaderFooterIds('default', locale);
    } catch {
      // editor still loads with the in-memory document
    }
  }
  const initialDocument = normalizeCanvasDocument(canvas, locale);

  return (
    <GlobalCanvasEditor
      locale={locale}
      slot="header"
      initialDocument={initialDocument}
    />
  );
}
