import { locales, type Locale } from '@/lib/locales';
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  readPageCanvas,
  readSiteDocument,
  writePageCanvas,
  writeSiteDocument,
} from '@/lib/builder/site/persistence';
import type { BuilderNavItem, BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { listColumnBundles, readColumnBundle, writeDraftColumn } from '@/lib/builder/columns/storage';
import type { ColumnDocument } from '@/lib/builder/columns/types';
import type {
  TranslationCategorySummary,
  TranslationContentRef,
  TranslationEntry,
  TranslationManagerPayload,
  TranslationProgress,
  TranslationProvider,
  TranslationStatus,
  TranslationTargetValue,
} from './types';
import { createTranslationSourceHash, normalizeTranslationSourceText } from './hash';

export const DEFAULT_TRANSLATION_SOURCE_LOCALE: Locale = 'ko';

const CATEGORY_LABELS: Record<TranslationContentRef['category'] | 'all', string> = {
  all: '전체',
  pages: '페이지',
  navigation: '사이트 메뉴',
  site: '사이트 메타',
  columns: '블로그 칼럼',
  forms: 'Forms',
};

interface CollectedTranslationSource {
  key: string;
  sourceLocale: Locale;
  sourceText: string;
  content: TranslationContentRef;
}

function compactText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const text = normalizeTranslationSourceText(value);
  return text.length > 0 ? text : null;
}

function entryKey(parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(':');
}

function addSource(
  items: CollectedTranslationSource[],
  source: Omit<CollectedTranslationSource, 'sourceLocale'>,
  sourceLocale: Locale,
) {
  const text = compactText(source.sourceText);
  if (!text) return;
  items.push({
    ...source,
    sourceLocale,
    sourceText: text,
  });
}

function sourceLocaleTitle(page: BuilderPageMeta, locale: Locale): string {
  return page.title[locale] || page.title[page.locale] || page.slug || 'Home';
}

function labelForPath(path: string): string {
  const key = path.split('.').pop() || path;
  const labels: Record<string, string> = {
    text: 'Text',
    label: 'Label',
    title: 'Title',
    ariaLabel: 'Aria label',
    description: 'Description',
    summary: 'Summary',
    placeholder: 'Placeholder',
    alt: 'Alt text',
    successMessage: 'Success message',
    loadingLabel: 'Loading label',
    bodyMarkdown: 'Body',
  };
  return labels[key] ?? key;
}

function collectNodeStrings(
  items: CollectedTranslationSource[],
  node: BuilderCanvasNode,
  page: BuilderPageMeta,
  sourceLocale: Locale,
) {
  const pageTitle = sourceLocaleTitle(page, sourceLocale);
  const addNodeSource = (
    path: string,
    text: unknown,
    contentType: TranslationContentRef['contentType'],
    category: TranslationContentRef['category'] = 'pages',
  ) => {
    addSource(
      items,
      {
        key: entryKey(['page', page.pageId, 'node', node.id, path]),
        sourceText: typeof text === 'string' ? text : '',
        content: {
          pageId: page.pageId,
          nodeId: node.id,
          contentType,
          contentRef: `page:${page.pageId}:node:${node.id}:${path}`,
          contentPath: path,
          category,
          label: `${pageTitle} / ${node.kind} / ${labelForPath(path)}`,
          pageTitle,
        },
      },
      sourceLocale,
    );
  };

  switch (node.kind) {
    case 'text':
      addNodeSource('content.text', node.content.text, 'node-text');
      break;
    case 'heading':
      addNodeSource('content.text', node.content.text, 'node-text');
      break;
    case 'button':
      addNodeSource('content.label', node.content.label, 'node-button-label');
      break;
    case 'image':
      addNodeSource('content.alt', node.content.alt, 'node-image-alt');
      break;
    case 'container':
    case 'section':
      addNodeSource('content.label', node.content.label, 'node-text');
      break;
    case 'form':
      addNodeSource('content.name', node.content.name, 'node-form-label', 'forms');
      addNodeSource('content.successMessage', node.content.successMessage, 'node-form-label', 'forms');
      break;
    case 'form-input':
      addNodeSource('content.label', node.content.label, 'node-form-label', 'forms');
      addNodeSource('content.placeholder', node.content.placeholder, 'node-form-label', 'forms');
      break;
    case 'form-textarea':
      addNodeSource('content.label', node.content.label, 'node-form-label', 'forms');
      addNodeSource('content.placeholder', node.content.placeholder, 'node-form-label', 'forms');
      break;
    case 'form-submit':
      addNodeSource('content.label', node.content.label, 'node-form-label', 'forms');
      addNodeSource('content.loadingLabel', node.content.loadingLabel, 'node-form-label', 'forms');
      break;
    case 'contactForm':
      addNodeSource('content.submitLabel', node.content.submitLabel, 'node-form-label', 'forms');
      break;
    case 'columnCard':
      addNodeSource('content.title', node.content.title, 'node-text');
      addNodeSource('content.summary', node.content.summary, 'node-text');
      break;
    case 'columnList':
      for (const [index, item] of (node.content.items ?? []).entries()) {
        addNodeSource(`content.items.${index}.title`, item.title, 'node-text');
        addNodeSource(`content.items.${index}.summary`, item.summary, 'node-text');
      }
      break;
    case 'attorneyCard':
      addNodeSource('content.name', node.content.name, 'node-text');
      addNodeSource('content.title', node.content.title, 'node-text');
      for (const [index, specialty] of node.content.specialties.entries()) {
        addNodeSource(`content.specialties.${index}`, specialty, 'node-text');
      }
      break;
    case 'faqList':
      for (const [index, item] of node.content.items.entries()) {
        addNodeSource(`content.items.${index}.question`, item.question, 'node-text');
        addNodeSource(`content.items.${index}.answer`, item.answer, 'node-text');
      }
      break;
    case 'ctaBanner':
      addNodeSource('content.title', node.content.title, 'node-text');
      addNodeSource('content.description', node.content.description, 'node-text');
      addNodeSource('content.buttonLabel', node.content.buttonLabel, 'node-button-label');
      break;
    case 'gallery':
      for (const [index, image] of node.content.images.entries()) {
        addNodeSource(`content.images.${index}.alt`, image.alt, 'node-image-alt');
      }
      break;
    case 'map':
      addNodeSource('content.address', node.content.address, 'node-text');
      break;
    default:
      break;
  }

  const link = (node.content as { link?: { title?: string; ariaLabel?: string } }).link;
  addNodeSource('content.link.title', link?.title, 'node-text');
  addNodeSource('content.link.ariaLabel', link?.ariaLabel, 'node-text');
}

function flattenNavItems(items: BuilderNavItem[]): BuilderNavItem[] {
  return items.flatMap((item) => [item, ...flattenNavItems(item.children ?? [])]);
}

function navLabelForLocale(item: BuilderNavItem, locale: Locale): string {
  if (typeof item.label === 'string') return item.label;
  return item.label[locale] || item.label.ko || item.label.en || item.href;
}

async function collectTranslationSources(
  site: BuilderSiteDocument,
  sourceLocale: Locale,
): Promise<CollectedTranslationSource[]> {
  const items: CollectedTranslationSource[] = [];

  addSource(
    items,
    {
      key: 'site:name',
      sourceText: site.name,
      content: {
        contentType: 'site-name',
        contentRef: 'site:name',
        contentPath: 'name',
        category: 'site',
        label: 'Site name',
      },
    },
    sourceLocale,
  );

  for (const [key, value] of Object.entries(site.settings ?? {})) {
    addSource(
      items,
      {
        key: entryKey(['site', 'settings', key]),
        sourceText: value,
        content: {
          contentType: 'site-setting',
          contentRef: `site:settings:${key}`,
          contentPath: `settings.${key}`,
          category: 'site',
          label: `Site setting / ${key}`,
        },
      },
      sourceLocale,
    );
  }

  for (const item of flattenNavItems(site.navigation)) {
    addSource(
      items,
      {
        key: entryKey(['nav', item.id, 'label']),
        sourceText: navLabelForLocale(item, sourceLocale),
        content: {
          navItemId: item.id,
          contentType: 'menu-item',
          contentRef: `nav:${item.id}:label`,
          contentPath: 'label',
          category: 'navigation',
          label: `Navigation / ${navLabelForLocale(item, sourceLocale)}`,
        },
      },
      sourceLocale,
    );
  }

  const sourcePages = site.pages.filter((page) => page.locale === sourceLocale || page.isHomePage);
  for (const page of sourcePages) {
    const pageTitle = sourceLocaleTitle(page, sourceLocale);
    addSource(
      items,
      {
        key: entryKey(['page', page.pageId, 'title']),
        sourceText: pageTitle,
        content: {
          pageId: page.pageId,
          contentType: 'page-title',
          contentRef: `page:${page.pageId}:title`,
          contentPath: 'title',
          category: 'pages',
          label: `${pageTitle} / Page title`,
          pageTitle,
        },
      },
      sourceLocale,
    );

    if (page.seo?.title) {
      addSource(
        items,
        {
          key: entryKey(['page', page.pageId, 'seo', 'title']),
          sourceText: page.seo.title,
          content: {
            pageId: page.pageId,
            contentType: 'page-meta',
            contentRef: `page:${page.pageId}:seo:title`,
            contentPath: 'seo.title',
            category: 'pages',
            label: `${pageTitle} / SEO title`,
            pageTitle,
          },
        },
        sourceLocale,
      );
    }
    if (page.seo?.description) {
      addSource(
        items,
        {
          key: entryKey(['page', page.pageId, 'seo', 'description']),
          sourceText: page.seo.description,
          content: {
            pageId: page.pageId,
            contentType: 'page-meta',
            contentRef: `page:${page.pageId}:seo:description`,
            contentPath: 'seo.description',
            category: 'pages',
            label: `${pageTitle} / SEO description`,
            pageTitle,
          },
        },
        sourceLocale,
      );
    }

    const canvas = await readPageCanvas(site.siteId, page.pageId, 'draft');
    for (const node of canvas?.nodes ?? []) {
      collectNodeStrings(items, node, page, sourceLocale);
    }
  }

  const columns = await listColumnBundles(sourceLocale);
  for (const bundle of columns) {
    const column = bundle.preferred;
    if (!column) continue;
    addSource(
      items,
      {
        key: entryKey(['column', column.slug, 'title']),
        sourceText: column.title,
        content: {
          columnSlug: column.slug,
          contentType: 'column-title',
          contentRef: `column:${column.slug}:title`,
          contentPath: 'title',
          category: 'columns',
          label: `Column / ${column.slug} / Title`,
        },
      },
      sourceLocale,
    );
    addSource(
      items,
      {
        key: entryKey(['column', column.slug, 'summary']),
        sourceText: column.summary,
        content: {
          columnSlug: column.slug,
          contentType: 'column-summary',
          contentRef: `column:${column.slug}:summary`,
          contentPath: 'summary',
          category: 'columns',
          label: `Column / ${column.slug} / Summary`,
        },
      },
      sourceLocale,
    );
    addSource(
      items,
      {
        key: entryKey(['column', column.slug, 'bodyMarkdown']),
        sourceText: column.bodyMarkdown,
        content: {
          columnSlug: column.slug,
          contentType: 'column-body',
          contentRef: `column:${column.slug}:bodyMarkdown`,
          contentPath: 'bodyMarkdown',
          category: 'columns',
          label: `Column / ${column.slug} / Body`,
        },
      },
      sourceLocale,
    );
  }

  return items;
}

function mergeTranslations(
  existing: TranslationEntry[] | undefined,
  sources: CollectedTranslationSource[],
): TranslationEntry[] {
  const now = new Date().toISOString();
  const existingByKey = new Map((existing ?? []).map((entry) => [entry.key, entry]));

  return sources.map((source) => {
    const previous = existingByKey.get(source.key);
    const sourceHash = createTranslationSourceHash(source.sourceText);
    const changed = Boolean(previous && previous.sourceHash !== sourceHash);
    const translations: TranslationEntry['translations'] = { ...(previous?.translations ?? {}) };

    if (changed) {
      for (const [locale, value] of Object.entries(translations) as Array<[Locale, TranslationTargetValue]>) {
        translations[locale] = {
          ...value,
          status: 'outdated',
        };
      }
    }

    return {
      key: source.key,
      sourceLocale: source.sourceLocale,
      sourceText: source.sourceText,
      sourceHash,
      content: source.content,
      translations,
      createdAt: previous?.createdAt ?? now,
      updatedAt: changed ? now : (previous?.updatedAt ?? now),
    };
  });
}

export function buildTranslationPayload(
  siteId: string,
  sourceLocale: Locale,
  entries: TranslationEntry[],
): TranslationManagerPayload {
  const targetLocales = locales.filter((locale) => locale !== sourceLocale);
  const categories: TranslationCategorySummary[] = (['all', 'pages', 'navigation', 'site', 'columns', 'forms'] as const)
    .map((category) => {
      const scoped = category === 'all' ? entries : entries.filter((entry) => entry.content.category === category);
      let missing = 0;
      let outdated = 0;
      for (const entry of scoped) {
        for (const target of targetLocales) {
          const status = entry.translations[target]?.status ?? 'missing';
          if (status === 'missing') missing += 1;
          if (status === 'outdated') outdated += 1;
        }
      }
      return {
        key: category,
        label: CATEGORY_LABELS[category],
        total: scoped.length,
        missing,
        outdated,
      };
    });

  const progress: TranslationProgress[] = targetLocales.map((locale) => {
    let translated = 0;
    let manual = 0;
    let outdated = 0;
    let missing = 0;
    for (const entry of entries) {
      const status = entry.translations[locale]?.status ?? 'missing';
      if (status === 'translated') translated += 1;
      if (status === 'manual') manual += 1;
      if (status === 'outdated') outdated += 1;
      if (status === 'missing') missing += 1;
    }
    const complete = translated + manual;
    const total = entries.length;
    return {
      locale,
      total,
      translated,
      manual,
      outdated,
      missing,
      percent: total > 0 ? Math.round((complete / total) * 100) : 100,
    };
  });

  return {
    ok: true,
    siteId,
    sourceLocale,
    targetLocales,
    entries,
    categories,
    progress,
    syncedAt: new Date().toISOString(),
  };
}

export async function syncTranslationsForSite(
  siteId = 'default',
  sourceLocale: Locale = DEFAULT_TRANSLATION_SOURCE_LOCALE,
): Promise<TranslationManagerPayload> {
  const site = await readSiteDocument(siteId, sourceLocale);
  const sources = await collectTranslationSources(site, sourceLocale);
  const nextEntries = mergeTranslations(site.translations, sources);
  const changed = JSON.stringify(site.translations ?? []) !== JSON.stringify(nextEntries);
  if (changed) {
    site.translations = nextEntries;
    site.updatedAt = new Date().toISOString();
    await writeSiteDocument(site);
  }
  return buildTranslationPayload(siteId, sourceLocale, nextEntries);
}

function findTargetPage(
  site: BuilderSiteDocument,
  sourcePageId: string | undefined,
  targetLocale: Locale,
): BuilderPageMeta | null {
  if (!sourcePageId) return null;
  const sourcePage = site.pages.find((page) => page.pageId === sourcePageId);
  if (!sourcePage) return null;
  const linkedId = sourcePage.linkedPageIds?.[targetLocale];
  if (linkedId) {
    return site.pages.find((page) => page.pageId === linkedId) ?? null;
  }
  return site.pages.find((page) => page.locale === targetLocale && page.slug === sourcePage.slug) ?? null;
}

function setNavigationLabel(items: BuilderNavItem[], navItemId: string, locale: Locale, text: string): boolean {
  for (const item of items) {
    if (item.id === navItemId) {
      const current: Record<Locale, string> = typeof item.label === 'string'
        ? { ko: item.label, 'zh-hant': item.label, en: item.label }
        : { ...item.label };
      current[locale] = text;
      item.label = current;
      return true;
    }
    if (item.children && setNavigationLabel(item.children, navItemId, locale, text)) return true;
  }
  return false;
}

function setByContentPath(node: BuilderCanvasNode, path: string | undefined, text: string): boolean {
  if (!path?.startsWith('content.')) return false;
  const parts = path.split('.').slice(1);
  let current: unknown = node.content;
  for (const part of parts.slice(0, -1)) {
    if (!current || typeof current !== 'object') return false;
    const key: string | number = /^\d+$/.test(part) ? Number(part) : part;
    current = (current as Record<string | number, unknown>)[key];
  }
  const last = parts.at(-1);
  if (!last || !current || typeof current !== 'object') return false;
  const key: string | number = /^\d+$/.test(last) ? Number(last) : last;
  (current as Record<string | number, unknown>)[key] = text;
  return true;
}

async function applyToCanvasDraft(
  site: BuilderSiteDocument,
  entry: TranslationEntry,
  targetLocale: Locale,
  text: string,
): Promise<boolean> {
  const targetPage = findTargetPage(site, entry.content.pageId, targetLocale);
  if (!targetPage || !entry.content.nodeId) return false;
  const canvas = await readPageCanvas(site.siteId, targetPage.pageId, 'draft');
  if (!canvas) return false;
  const node = canvas.nodes.find((candidate) => candidate.id === entry.content.nodeId);
  if (!node || !setByContentPath(node, entry.content.contentPath, text)) return false;
  const nextCanvas: BuilderCanvasDocument = {
    ...canvas,
    locale: targetLocale,
    updatedAt: new Date().toISOString(),
    updatedBy: 'translation-manager',
    nodes: [...canvas.nodes],
  };
  await writePageCanvas(site.siteId, targetPage.pageId, 'draft', nextCanvas);
  return true;
}

async function applyToColumnDraft(
  entry: TranslationEntry,
  targetLocale: Locale,
  text: string,
): Promise<boolean> {
  if (!entry.content.columnSlug) return false;
  const sourceBundle = await readColumnBundle(entry.sourceLocale, entry.content.columnSlug);
  const sourceDoc = sourceBundle.preferred;
  const targetSlug = sourceDoc?.linkedSlugs[targetLocale] ?? entry.content.columnSlug;
  const targetBundle = await readColumnBundle(targetLocale, targetSlug);
  const targetDoc = targetBundle.draft ?? targetBundle.published;
  if (!targetDoc) return false;
  const now = new Date().toISOString();
  const nextDoc: ColumnDocument = {
    ...targetDoc,
    locale: targetLocale,
    draft: true,
    revision: (targetBundle.draft?.revision ?? targetBundle.published?.revision ?? 0) + 1,
    updatedAt: now,
    updatedBy: 'translation-manager',
  };
  if (entry.content.contentType === 'column-title') nextDoc.title = text;
  if (entry.content.contentType === 'column-summary') nextDoc.summary = text;
  if (entry.content.contentType === 'column-body') nextDoc.bodyMarkdown = text;
  await writeDraftColumn(nextDoc);
  return true;
}

async function applyTranslationToSourceTarget(
  site: BuilderSiteDocument,
  entry: TranslationEntry,
  targetLocale: Locale,
  text: string,
): Promise<boolean> {
  if (entry.content.contentType === 'menu-item' && entry.content.navItemId) {
    return setNavigationLabel(site.navigation, entry.content.navItemId, targetLocale, text);
  }
  if (entry.content.contentType === 'page-title') {
    const sourcePage = site.pages.find((page) => page.pageId === entry.content.pageId);
    const targetPage = findTargetPage(site, entry.content.pageId, targetLocale);
    if (sourcePage) sourcePage.title[targetLocale] = text;
    if (targetPage) targetPage.title[targetLocale] = text;
    return Boolean(sourcePage || targetPage);
  }
  if (entry.content.contentType === 'page-meta') {
    const targetPage = findTargetPage(site, entry.content.pageId, targetLocale);
    const page = targetPage ?? site.pages.find((candidate) => candidate.pageId === entry.content.pageId);
    if (!page) return false;
    page.seo = page.seo ?? {};
    if (entry.content.contentPath === 'seo.title') page.seo.title = text;
    if (entry.content.contentPath === 'seo.description') page.seo.description = text;
    return true;
  }
  if (entry.content.category === 'columns') {
    return applyToColumnDraft(entry, targetLocale, text);
  }
  if (entry.content.nodeId) {
    return applyToCanvasDraft(site, entry, targetLocale, text);
  }
  return false;
}

export async function saveTranslationValue({
  siteId = 'default',
  sourceLocale = DEFAULT_TRANSLATION_SOURCE_LOCALE,
  key,
  targetLocale,
  text,
  status,
  provider,
  reviewedBy,
}: {
  siteId?: string;
  sourceLocale?: Locale;
  key: string;
  targetLocale: Locale;
  text: string;
  status: TranslationStatus;
  provider: TranslationProvider;
  reviewedBy?: string;
}): Promise<{ payload: TranslationManagerPayload; entry: TranslationEntry; applied: boolean }> {
  await syncTranslationsForSite(siteId, sourceLocale);
  const site = await readSiteDocument(siteId, sourceLocale);
  const entries = site.translations ?? [];
  const entry = entries.find((candidate) => candidate.key === key);
  if (!entry) {
    throw new Error('translation_entry_not_found');
  }

  if (status === 'missing' || text.trim().length === 0) {
    delete entry.translations[targetLocale];
  } else {
    entry.translations[targetLocale] = {
      text,
      status,
      sourceHashAtTranslation: entry.sourceHash,
      translatedBy: provider,
      translatedAt: new Date().toISOString(),
      reviewedBy,
    };
  }
  entry.updatedAt = new Date().toISOString();

  const applied = status === 'missing'
    ? false
    : await applyTranslationToSourceTarget(site, entry, targetLocale, text);

  site.translations = entries;
  site.updatedAt = new Date().toISOString();
  await writeSiteDocument(site);

  return {
    payload: buildTranslationPayload(siteId, sourceLocale, entries),
    entry,
    applied,
  };
}
