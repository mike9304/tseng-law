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
import { listLocalBuilderAppManifests } from '@/lib/builder/apps/catalog';
import { normalizeBuilderInstalledApps, type BuilderAppManifest } from '@/lib/builder/apps/types';
import { listFaqItems, loadFaqItem, saveFaqItem } from '@/lib/builder/faq/faq-engine';
import type { BuilderFaqItem } from '@/lib/builder/faq/faq-shared';
import { listEvents, loadEvent, saveEvent } from '@/lib/builder/events/events-engine';
import type { BuilderEvent } from '@/lib/builder/events/events-shared';
import { listProjects, loadProject, saveProject } from '@/lib/builder/portfolio/portfolio-engine';
import type { PortfolioProject } from '@/lib/builder/portfolio/portfolio-shared';
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
  apps: '앱',
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

function manifestText(manifest: BuilderAppManifest, path: string, fallback: string, sourceLocale: Locale): string {
  return manifest.translations[path]?.[sourceLocale] ?? fallback;
}

function appLabel(manifest: BuilderAppManifest, suffix: string): string {
  return `App / ${manifest.name} / ${suffix}`;
}

function isTranslatableSettingField(field: BuilderAppManifest['settingsPanels'][number]['fields'][number]): boolean {
  if (field.type !== 'text' && field.type !== 'textarea') return false;
  return !/(color|email|url|href|slug|token|key|secret)/i.test(field.fieldId);
}

function addManifestSource(
  items: CollectedTranslationSource[],
  manifest: BuilderAppManifest,
  path: string,
  fallback: string | undefined,
  label: string,
  sourceLocale: Locale,
  extra: Partial<TranslationContentRef> = {},
) {
  if (typeof fallback !== 'string') return;
  addSource(
    items,
    {
      key: entryKey(['app', manifest.appId, 'manifest', path]),
      sourceText: manifestText(manifest, path, fallback, sourceLocale),
      content: {
        appId: manifest.appId,
        contentType: 'app-manifest',
        contentRef: `app:${manifest.appId}:manifest:${path}`,
        contentPath: path,
        category: 'apps',
        label,
        ...extra,
      },
    },
    sourceLocale,
  );
}

function collectAppManifestStrings(
  items: CollectedTranslationSource[],
  sourceLocale: Locale,
) {
  for (const manifest of listLocalBuilderAppManifests()) {
    addManifestSource(items, manifest, 'name', manifest.name, appLabel(manifest, 'Name'), sourceLocale);
    addManifestSource(items, manifest, 'summary', manifest.summary, appLabel(manifest, 'Summary'), sourceLocale);
    addManifestSource(items, manifest, 'description', manifest.description, appLabel(manifest, 'Description'), sourceLocale);

    for (const widget of manifest.widgets) {
      addManifestSource(
        items,
        manifest,
        `widgets.${widget.widgetId}.name`,
        widget.name,
        appLabel(manifest, `Widget / ${widget.name} / Name`),
        sourceLocale,
        { widgetId: widget.widgetId },
      );
      addManifestSource(
        items,
        manifest,
        `widgets.${widget.widgetId}.description`,
        widget.description,
        appLabel(manifest, `Widget / ${widget.name} / Description`),
        sourceLocale,
        { widgetId: widget.widgetId },
      );
      for (const [key, value] of Object.entries(widget.defaultContent ?? {})) {
        if (typeof value !== 'string') continue;
        addManifestSource(
          items,
          manifest,
          `widgets.${widget.widgetId}.defaultContent.${key}`,
          value,
          appLabel(manifest, `Widget / ${widget.name} / Default ${labelForPath(key)}`),
          sourceLocale,
          { widgetId: widget.widgetId },
        );
      }
    }

    for (const panel of manifest.settingsPanels) {
      addManifestSource(
        items,
        manifest,
        `settingsPanels.${panel.panelId}.name`,
        panel.name,
        appLabel(manifest, `Settings / ${panel.name}`),
        sourceLocale,
      );
      for (const field of panel.fields) {
        addManifestSource(
          items,
          manifest,
          `settingsPanels.${panel.panelId}.fields.${field.fieldId}.label`,
          field.label,
          appLabel(manifest, `Settings / ${panel.name} / ${field.label}`),
          sourceLocale,
          { settingFieldId: field.fieldId },
        );
        addManifestSource(
          items,
          manifest,
          `settingsPanels.${panel.panelId}.fields.${field.fieldId}.description`,
          field.description,
          appLabel(manifest, `Settings / ${panel.name} / ${field.label} description`),
          sourceLocale,
          { settingFieldId: field.fieldId },
        );
        for (const option of field.options ?? []) {
          addManifestSource(
            items,
            manifest,
            `settingsPanels.${panel.panelId}.fields.${field.fieldId}.options.${option.value}.label`,
            option.label,
            appLabel(manifest, `Settings / ${panel.name} / ${field.label} / ${option.label}`),
            sourceLocale,
            { settingFieldId: field.fieldId },
          );
        }
      }
    }

    for (const route of manifest.routes) {
      addManifestSource(
        items,
        manifest,
        `routes.${route.routeId}.label`,
        route.label,
        appLabel(manifest, `Route / ${route.path}`),
        sourceLocale,
        { routeId: route.routeId },
      );
    }
  }
}

function collectInstalledAppSettings(
  items: CollectedTranslationSource[],
  site: BuilderSiteDocument,
  sourceLocale: Locale,
) {
  const installedApps = normalizeBuilderInstalledApps(site.installedApps ?? []);
  const manifestById = new Map(listLocalBuilderAppManifests().map((manifest) => [manifest.appId, manifest]));

  for (const app of installedApps) {
    const manifest = manifestById.get(app.appId);
    if (!manifest) continue;
    const sourceSettings = {
      ...(app.settings ?? {}),
      ...(app.localizedSettings?.[sourceLocale] ?? {}),
    };
    for (const panel of manifest.settingsPanels) {
      for (const field of panel.fields) {
        if (!isTranslatableSettingField(field)) continue;
        const raw = sourceSettings[field.fieldId] ?? field.defaultValue;
        if (typeof raw !== 'string') continue;
        addSource(
          items,
          {
            key: entryKey(['app', manifest.appId, 'setting', field.fieldId, 'value']),
            sourceText: raw,
            content: {
              appId: manifest.appId,
              settingFieldId: field.fieldId,
              contentType: 'app-setting',
              contentRef: `app:${manifest.appId}:setting:${field.fieldId}`,
              contentPath: `settings.${field.fieldId}`,
              category: 'apps',
              label: appLabel(manifest, `Installed setting / ${field.label}`),
            },
          },
          sourceLocale,
        );
      }
    }
  }
}

function addAppContentSource(
  items: CollectedTranslationSource[],
  sourceLocale: Locale,
  {
    appId,
    kind,
    id,
    path,
    text,
    label,
  }: {
    appId: string;
    kind: NonNullable<TranslationContentRef['appContentKind']>;
    id: string;
    path: string;
    text: unknown;
    label: string;
  },
) {
  addSource(
    items,
    {
      key: entryKey(['app', appId, 'content', kind, id, path]),
      sourceText: typeof text === 'string' ? text : '',
      content: {
        appId,
        appContentId: id,
        appContentKind: kind,
        contentType: 'app-content',
        contentRef: `app:${appId}:content:${kind}:${id}:${path}`,
        contentPath: path,
        category: 'apps',
        label,
      },
    },
    sourceLocale,
  );
}

async function collectNativeAppContent(
  items: CollectedTranslationSource[],
  sourceLocale: Locale,
) {
  const faqItems = await listFaqItems({ locale: sourceLocale, status: 'all' });
  for (const item of faqItems) {
    addAppContentSource(items, sourceLocale, {
      appId: 'faq-manager',
      kind: 'faq',
      id: item.faqId,
      path: 'question',
      text: item.question,
      label: `App / FAQ / ${item.question} / Question`,
    });
    addAppContentSource(items, sourceLocale, {
      appId: 'faq-manager',
      kind: 'faq',
      id: item.faqId,
      path: 'answer',
      text: item.answer,
      label: `App / FAQ / ${item.question} / Answer`,
    });
    for (const [index, tag] of item.tags.entries()) {
      addAppContentSource(items, sourceLocale, {
        appId: 'faq-manager',
        kind: 'faq',
        id: item.faqId,
        path: `tags.${index}`,
        text: tag,
        label: `App / FAQ / ${item.question} / Tag ${index + 1}`,
      });
    }
  }

  const events = (await listEvents()).filter((event) => event.locale === sourceLocale);
  for (const event of events) {
    for (const [path, text, label] of [
      ['title', event.title, 'Title'],
      ['description', event.description, 'Description'],
      ['location', event.location, 'Location'],
      ['category', event.category, 'Category'],
    ] as const) {
      addAppContentSource(items, sourceLocale, {
        appId: 'native-events',
        kind: 'events',
        id: event.eventId,
        path,
        text,
        label: `App / Events / ${event.title} / ${label}`,
      });
    }
  }

  const projects = (await listProjects()).filter((project) => project.locale === sourceLocale);
  for (const project of projects) {
    for (const [path, text, label] of [
      ['title', project.title, 'Title'],
      ['summary', project.summary, 'Summary'],
      ['description', project.description, 'Description'],
      ['body', project.body, 'Body'],
      ['client', project.client, 'Client'],
      ['seoTitle', project.seoTitle, 'SEO title'],
      ['seoDescription', project.seoDescription, 'SEO description'],
    ] as const) {
      addAppContentSource(items, sourceLocale, {
        appId: 'native-portfolio',
        kind: 'portfolio',
        id: project.projectId,
        path,
        text,
        label: `App / Portfolio / ${project.title} / ${label}`,
      });
    }
    for (const [index, tag] of project.tags.entries()) {
      addAppContentSource(items, sourceLocale, {
        appId: 'native-portfolio',
        kind: 'portfolio',
        id: project.projectId,
        path: `tags.${index}`,
        text: tag,
        label: `App / Portfolio / ${project.title} / Tag ${index + 1}`,
      });
    }
    for (const [index, image] of project.gallery.entries()) {
      addAppContentSource(items, sourceLocale, {
        appId: 'native-portfolio',
        kind: 'portfolio',
        id: project.projectId,
        path: `gallery.${index}.alt`,
        text: image.alt,
        label: `App / Portfolio / ${project.title} / Image ${index + 1} alt`,
      });
      addAppContentSource(items, sourceLocale, {
        appId: 'native-portfolio',
        kind: 'portfolio',
        id: project.projectId,
        path: `gallery.${index}.caption`,
        text: image.caption,
        label: `App / Portfolio / ${project.title} / Image ${index + 1} caption`,
      });
    }
  }
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
          appId: node.appWidget?.appId,
          widgetId: node.appWidget?.widgetId,
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
    case 'site-search':
      addNodeSource('content.placeholder', node.content.placeholder, 'app-widget', 'apps');
      addNodeSource('content.submitLabel', node.content.submitLabel, 'app-widget', 'apps');
      break;
    case 'event-rsvp':
      addNodeSource('content.title', node.content.title, 'app-widget', 'apps');
      addNodeSource('content.successMessage', node.content.successMessage, 'app-widget', 'apps');
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

  collectAppManifestStrings(items, sourceLocale);
  collectInstalledAppSettings(items, site, sourceLocale);

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

  await collectNativeAppContent(items, sourceLocale);

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
  const categories: TranslationCategorySummary[] = (['all', 'pages', 'navigation', 'site', 'columns', 'forms', 'apps'] as const)
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

function targetFaqId(sourceId: string, targetLocale: Locale): string {
  const match = /^seed-(ko|en|zh-hant)-(\d+)$/.exec(sourceId);
  if (match) return `seed-${targetLocale}-${match[2]}`;
  return `${sourceId}--${targetLocale}`;
}

function targetAppContentId(sourceId: string, targetLocale: Locale): string {
  return `${sourceId}--${targetLocale}`;
}

function setStringPath(target: Record<string, unknown>, path: string | undefined, text: string): boolean {
  if (!path) return false;
  const parts = path.split('.');
  let current: unknown = target;
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

async function applyToFaqContent(entry: TranslationEntry, targetLocale: Locale, text: string): Promise<boolean> {
  if (!entry.content.appContentId) return false;
  const source = await loadFaqItem(entry.content.appContentId);
  if (!source) return false;
  const targetId = targetFaqId(source.faqId, targetLocale);
  const existing = await loadFaqItem(targetId);
  const next: BuilderFaqItem = existing ?? {
    ...source,
    faqId: targetId,
    locale: targetLocale,
    createdAt: new Date().toISOString(),
  };
  if (!setStringPath(next as unknown as Record<string, unknown>, entry.content.contentPath, text)) return false;
  await saveFaqItem({
    ...next,
    locale: targetLocale,
  });
  return true;
}

async function applyToEventContent(entry: TranslationEntry, targetLocale: Locale, text: string): Promise<boolean> {
  if (!entry.content.appContentId) return false;
  const source = await loadEvent(entry.content.appContentId);
  if (!source) return false;
  const targetId = targetAppContentId(source.eventId, targetLocale);
  const existing = await loadEvent(targetId);
  const next: BuilderEvent = existing ?? {
    ...source,
    eventId: targetId,
    locale: targetLocale,
    createdAt: new Date().toISOString(),
  };
  if (!setStringPath(next as unknown as Record<string, unknown>, entry.content.contentPath, text)) return false;
  await saveEvent({
    ...next,
    locale: targetLocale,
  });
  return true;
}

async function applyToPortfolioContent(entry: TranslationEntry, targetLocale: Locale, text: string): Promise<boolean> {
  if (!entry.content.appContentId) return false;
  const source = await loadProject(entry.content.appContentId);
  if (!source) return false;
  const targetId = targetAppContentId(source.projectId, targetLocale);
  const existing = await loadProject(targetId);
  const next: PortfolioProject = existing ?? {
    ...source,
    projectId: targetId,
    locale: targetLocale,
    createdAt: new Date().toISOString(),
  };
  if (!setStringPath(next as unknown as Record<string, unknown>, entry.content.contentPath, text)) return false;
  await saveProject({
    ...next,
    locale: targetLocale,
  });
  return true;
}

async function applyToAppContent(entry: TranslationEntry, targetLocale: Locale, text: string): Promise<boolean> {
  if (entry.content.appContentKind === 'faq') return applyToFaqContent(entry, targetLocale, text);
  if (entry.content.appContentKind === 'events') return applyToEventContent(entry, targetLocale, text);
  if (entry.content.appContentKind === 'portfolio') return applyToPortfolioContent(entry, targetLocale, text);
  return false;
}

function applyToInstalledAppSetting(
  site: BuilderSiteDocument,
  entry: TranslationEntry,
  targetLocale: Locale,
  text: string,
): boolean {
  if (!entry.content.appId || !entry.content.settingFieldId) return false;
  const installedApps = normalizeBuilderInstalledApps(site.installedApps ?? []);
  const index = installedApps.findIndex((app) => app.appId === entry.content.appId);
  if (index < 0) return false;

  const app = installedApps[index];
  const localizedSettings = {
    ...(app.localizedSettings ?? {}),
    [targetLocale]: {
      ...(app.localizedSettings?.[targetLocale] ?? {}),
      [entry.content.settingFieldId]: text,
    },
  };
  installedApps[index] = {
    ...app,
    localizedSettings,
    updatedAt: new Date().toISOString(),
  };
  site.installedApps = installedApps;
  return true;
}

async function applyTranslationToSourceTarget(
  site: BuilderSiteDocument,
  entry: TranslationEntry,
  targetLocale: Locale,
  text: string,
): Promise<boolean> {
  if (entry.content.contentType === 'app-content') {
    return applyToAppContent(entry, targetLocale, text);
  }
  if (entry.content.contentType === 'app-setting') {
    return applyToInstalledAppSetting(site, entry, targetLocale, text);
  }
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
