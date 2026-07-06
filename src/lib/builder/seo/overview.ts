import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type {
  BuilderPageMeta,
  BuilderSeoChecklistSettings,
  BuilderSiteDocument,
} from '@/lib/builder/site/types';
import { resolveBuilderSiteSettings } from '@/lib/builder/site/localized-settings';
import { buildSitePagePath } from '@/lib/builder/site/paths';
import { resolveLocaleSeo } from '@/lib/builder/translations/seo-projection';
import {
  type BuilderSeoValidationIssue,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';
import { buildSeoAssistantTasks, type BuilderSeoAssistantTask } from '@/lib/builder/seo/assistant';
import { mergeSeoWithDefaults } from '@/lib/builder/seo/defaults';
import { getSeoOverviewCopy } from '@/lib/builder/seo/overview-copy';

export interface BuilderSeoPageAudit {
  pageId: string;
  title: string;
  slug: string;
  publicPath: string;
  published: boolean;
  indexable: boolean;
  issueCounts: {
    blockers: number;
    warnings: number;
    infos: number;
  };
  score: number;
  h1Count: number;
  imageCount: number;
  imagesMissingAlt: number;
  keywordHits: string[];
  issues: BuilderSeoValidationIssue[];
  assistantTasks: BuilderSeoAssistantTask[];
}

export interface BuilderSeoChecklistItem {
  id: string;
  label: string;
  status: 'done' | 'todo' | 'warning';
  detail: string;
}

export interface BuilderSeoOverview {
  checklistSettings: BuilderSeoChecklistSettings;
  pages: BuilderSeoPageAudit[];
  checklist: BuilderSeoChecklistItem[];
  totals: {
    pages: number;
    publishedPages: number;
    indexablePages: number;
    blockers: number;
    warnings: number;
    averageScore: number;
  };
}

function textFromUnknown(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

function textFromNode(node: BuilderCanvasNode): string {
  const content = (node.content ?? {}) as Record<string, unknown>;
  return [
    content.text,
    content.title,
    content.headline,
    content.subtitle,
    content.description,
    content.label,
    content.question,
    content.answer,
  ].map(textFromUnknown).filter(Boolean).join(' ');
}

function collectCanvasText(canvas?: BuilderCanvasDocument | null): string {
  if (!canvas) return '';
  return canvas.nodes
    .filter((node) => node.visible !== false)
    .map(textFromNode)
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function countH1(canvas?: BuilderCanvasDocument | null): number {
  if (!canvas) return 0;
  return canvas.nodes.filter((node) => {
    if (node.visible === false) return false;
    const content = (node.content ?? {}) as Record<string, unknown>;
    return (node.kind === 'heading' && content.level === 1)
      || (node.kind === 'text' && content.as === 'h1');
  }).length;
}

function imageStats(canvas?: BuilderCanvasDocument | null): { imageCount: number; imagesMissingAlt: number } {
  if (!canvas) return { imageCount: 0, imagesMissingAlt: 0 };
  const images = canvas.nodes.filter((node) => node.kind === 'image' && node.visible !== false);
  return {
    imageCount: images.length,
    imagesMissingAlt: images.filter((node) => !textFromUnknown((node.content as Record<string, unknown>).alt)).length,
  };
}

function titleForPage(page: BuilderPageMeta): string {
  return page.title[page.locale] || page.title.ko || page.slug || 'Untitled';
}

function calculateScore(input: {
  issues: BuilderSeoValidationIssue[];
  h1Count: number;
  imagesMissingAlt: number;
  published: boolean;
}): number {
  let score = 100;
  score -= input.issues.filter((issue) => issue.severity === 'blocker').length * 30;
  score -= input.issues.filter((issue) => issue.severity === 'warning').length * 12;
  score -= input.issues.filter((issue) => issue.severity === 'info').length * 4;
  if (input.h1Count !== 1) score -= 12;
  if (input.imagesMissingAlt > 0) score -= Math.min(20, input.imagesMissingAlt * 5);
  if (!input.published) score -= 8;
  return Math.max(0, Math.min(100, score));
}

export function buildBuilderSeoOverview(input: {
  site: BuilderSiteDocument;
  canvasesByPageId?: Map<string, BuilderCanvasDocument | null>;
}): BuilderSeoOverview {
  const { site } = input;
  const resolvedSettings = resolveBuilderSiteSettings(site.settings, site.locale);
  const checklistSettings = resolvedSettings?.seoChecklist ?? site.settings?.seoChecklist ?? {};
  const copy = getSeoOverviewCopy(site.locale);
  const keywords = (checklistSettings.keywords ?? [])
    .map((keyword) => keyword.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 5);

  const pages = site.pages.map((page) => {
    const canvas = input.canvasesByPageId?.get(page.pageId) ?? null;
    const effectiveSeo = {
      ...(page.seo ?? {}),
      ...resolveLocaleSeo(page, page.locale),
    };
    const effectivePage = {
      ...page,
      seo: Object.keys(effectiveSeo).length > 0 ? effectiveSeo : undefined,
    };
    const issues = validateBuilderPageSeo({ page: effectivePage, site, seo: effectivePage.seo });
    const resolvedSeo = mergeSeoWithDefaults({
      page: effectivePage,
      site,
      siteUrl: 'https://example.com',
      locale: page.locale,
      seo: effectivePage.seo,
    });
    const assistantTasks = buildSeoAssistantTasks({ page: effectivePage, site, canvas });
    const h1Count = countH1(canvas);
    const { imageCount, imagesMissingAlt } = imageStats(canvas);
    const haystack = [
      titleForPage(page),
      resolvedSeo.title,
      resolvedSeo.description,
      collectCanvasText(canvas),
    ].join(' ').toLowerCase();
    const keywordHits = keywords.filter((keyword) => haystack.includes(keyword));
    const issueCounts = {
      blockers: issues.filter((issue) => issue.severity === 'blocker').length,
      warnings: issues.filter((issue) => issue.severity === 'warning').length,
      infos: issues.filter((issue) => issue.severity === 'info').length,
    };
    const published = Boolean(page.publishedAt);

    return {
      pageId: page.pageId,
      title: titleForPage(page),
      slug: page.slug,
      publicPath: buildSitePagePath(page.locale, page.slug),
      published,
      indexable: !page.noIndex && !page.seo?.noIndex && !page.password,
      issueCounts,
      score: calculateScore({ issues, h1Count, imagesMissingAlt, published }),
      h1Count,
      imageCount,
      imagesMissingAlt,
      keywordHits,
      issues,
      assistantTasks,
    };
  });

  const blockers = pages.reduce((sum, page) => sum + page.issueCounts.blockers, 0);
  const warnings = pages.reduce((sum, page) => sum + page.issueCounts.warnings, 0);
  const averageScore = pages.length
    ? Math.round(pages.reduce((sum, page) => sum + page.score, 0) / pages.length)
    : 0;
  const missingSeoFields = pages.filter((page) => page.issues.some((issue) => issue.id.endsWith('missing'))).length;
  const indexablePublishedPages = pages.filter((page) => page.published && page.indexable).length;
  const h1CleanupPages = pages.filter((page) => page.h1Count !== 1).length;
  const missingAltImages = pages.reduce((sum, page) => sum + page.imagesMissingAlt, 0);

  const checklist: BuilderSeoChecklistItem[] = [
    {
      id: 'business-name',
      label: copy.businessNameLabel,
      status: checklistSettings.businessName || resolvedSettings?.firmName ? 'done' : 'todo',
      detail: checklistSettings.businessName || resolvedSettings?.firmName || copy.businessNameMissing,
    },
    {
      id: 'keywords',
      label: copy.keywordsLabel,
      status: keywords.length > 0 ? 'done' : 'todo',
      detail: keywords.length > 0 ? copy.keywordsConfigured(keywords.length) : copy.keywordsMissing,
    },
    {
      id: 'seo-fields',
      label: copy.seoFieldsLabel,
      status: missingSeoFields === 0 ? 'done' : 'warning',
      detail: copy.seoFieldsMissing(missingSeoFields),
    },
    {
      id: 'indexable',
      label: copy.indexableLabel,
      status: indexablePublishedPages > 0 ? 'done' : 'todo',
      detail: copy.indexablePages(indexablePublishedPages),
    },
    {
      id: 'h1',
      label: copy.h1Label,
      status: h1CleanupPages === 0 ? 'done' : 'warning',
      detail: copy.h1Cleanup(h1CleanupPages),
    },
    {
      id: 'image-alt',
      label: copy.imageAltLabel,
      status: missingAltImages === 0 ? 'done' : 'warning',
      detail: copy.imageAltMissing(missingAltImages),
    },
    {
      id: 'blockers',
      label: copy.blockersLabel,
      status: blockers === 0 ? 'done' : 'todo',
      detail: copy.blockers(blockers),
    },
  ];

  return {
    checklistSettings,
    pages,
    checklist,
    totals: {
      pages: pages.length,
      publishedPages: pages.filter((page) => page.published).length,
      indexablePages: pages.filter((page) => page.indexable).length,
      blockers,
      warnings,
      averageScore,
    },
  };
}
