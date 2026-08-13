import type { Metadata } from 'next';
import { locales, normalizeLocale, type Locale } from '@/lib/locales';
import {
  ensureGlobalHeaderFooterIds,
  readFooterCanvas,
  writeFooterCanvas,
} from '@/lib/builder/site/persistence';
import { createDefaultCanvasDocument, normalizeCanvasDocument } from '@/lib/builder/canvas/types';
import GlobalCanvasEditor from '@/components/builder/global/GlobalCanvasEditor';
import { buildSeoMetadata } from '@/lib/seo';

export const dynamic = 'force-dynamic';

const COPY: Record<Locale, { title: string; description: string }> = {
  ko: {
    title: '글로벌 푸터 편집기',
    description: '사이트 푸터 캔버스를 로케일별로 편집합니다.',
  },
  'zh-hant': {
    title: '全域頁尾編輯器',
    description: '依語言編輯網站頁尾畫布。',
  },
  en: {
    title: 'Global Footer Editor',
    description: 'Edit the site footer canvas by locale.',
  },
};

export async function generateMetadata(props: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const params = await props.params;
  const locale = normalizeLocale(params.locale);
  return buildSeoMetadata({
    locale,
    title: COPY[locale].title,
    description: COPY[locale].description,
    path: '/admin-builder/footer',
    alternateLocales: locales,
    noindex: true,
  });
}

export default async function GlobalFooterEditPage(
  props: {
    params: Promise<{ locale: string }>;
  }
) {
  const params = await props.params;
  const locale: Locale = normalizeLocale(params.locale);

  let canvas = await readFooterCanvas('default');
  if (!canvas) {
    // Lazy-seed an empty canvas; published pages fall back to the legacy
    // SiteFooter component until the user adds nodes here.
    const seed = createDefaultCanvasDocument(locale);
    canvas = { ...seed, nodes: [], stageWidth: 1280, stageHeight: 240 };
    try {
      await writeFooterCanvas('default', canvas);
      await ensureGlobalHeaderFooterIds('default', locale);
    } catch {
      // editor still loads with the in-memory document
    }
  }
  const initialDocument = normalizeCanvasDocument(canvas, locale);

  return (
    <GlobalCanvasEditor
      locale={locale}
      slot="footer"
      initialDocument={initialDocument}
    />
  );
}
