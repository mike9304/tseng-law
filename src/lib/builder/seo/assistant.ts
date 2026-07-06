import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import { resolveBuilderSiteSettings } from '@/lib/builder/site/localized-settings';
import {
  type BuilderSeoValidationIssue,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';
import { mergeSeoWithDefaults } from '@/lib/builder/seo/defaults';
import { getSeoAssistantTaskCopy } from '@/lib/builder/seo/assistant-task-copy';

export type BuilderSeoAssistantSeverity = 'critical' | 'high' | 'medium' | 'low';
export type BuilderSeoAssistantStatus = 'done' | 'todo';

export interface BuilderSeoAssistantTask {
  id: string;
  label: string;
  severity: BuilderSeoAssistantSeverity;
  status: BuilderSeoAssistantStatus;
  field: string;
  detail: string;
  applyHint?: string;
}

function cleanText(value: unknown): string {
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
  ].map(cleanText).filter(Boolean).join(' ');
}

function collectText(canvas?: BuilderCanvasDocument | null): string {
  if (!canvas) return '';
  return canvas.nodes
    .filter((node) => node.visible !== false)
    .map(textFromNode)
    .filter(Boolean)
    .join(' ');
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

function missingAltCount(canvas?: BuilderCanvasDocument | null): number {
  if (!canvas) return 0;
  return canvas.nodes.filter((node) => {
    if (node.kind !== 'image' || node.visible === false) return false;
    return !cleanText((node.content as Record<string, unknown>).alt);
  }).length;
}

function issueToTask(issue: BuilderSeoValidationIssue): BuilderSeoAssistantTask {
  const severity: BuilderSeoAssistantSeverity =
    issue.severity === 'blocker' ? 'critical' : issue.severity === 'warning' ? 'high' : 'low';
  return {
    id: issue.id,
    label: issue.message,
    severity,
    status: issue.severity === 'info' ? 'done' : 'todo',
    field: issue.field,
    detail: issue.fixHint ?? issue.message,
  };
}

function includesKeyword(value: string, keyword: string): boolean {
  if (!keyword) return true;
  return value.toLowerCase().includes(keyword.toLowerCase());
}

export function buildSeoAssistantTasks(input: {
  page: BuilderPageMeta;
  site?: BuilderSiteDocument | null;
  canvas?: BuilderCanvasDocument | null;
  siteUrl?: string;
}): BuilderSeoAssistantTask[] {
  const siteUrl = input.siteUrl ?? 'https://example.com';
  const resolvedSettings = resolveBuilderSiteSettings(input.site?.settings, input.page.locale);
  const seo = mergeSeoWithDefaults({
    page: input.page,
    site: input.site,
    siteUrl,
    locale: input.page.locale,
  });
  const focusKeyword = cleanText(seo.focusKeyword)
    || cleanText(input.site?.settings?.seoChecklist?.keywords?.[0])
    || cleanText(resolvedSettings?.seoChecklist?.keywords?.[0]);
  const copy = getSeoAssistantTaskCopy(input.page.locale);
  const pageText = collectText(input.canvas);
  const title = cleanText(seo.title);
  const description = cleanText(seo.description);
  const slug = cleanText(input.page.slug).replace(/-/g, ' ');
  const h1Count = countH1(input.canvas);
  const missingAlt = missingAltCount(input.canvas);

  const tasks: BuilderSeoAssistantTask[] = validateBuilderPageSeo({
    page: input.page,
    site: input.site,
    seo,
    siteUrl,
  }).map(issueToTask);

  tasks.push({
    id: 'assistant-indexable',
    label: copy.indexable.label,
    severity: seo.noIndex || input.page.noIndex ? 'critical' : 'low',
    status: seo.noIndex || input.page.noIndex ? 'todo' : 'done',
    field: 'robots',
    detail: seo.noIndex || input.page.noIndex
      ? copy.indexable.noIndex
      : copy.indexable.enabled,
  });

  tasks.push({
    id: 'assistant-h1',
    label: copy.h1.label,
    severity: h1Count === 1 ? 'low' : 'high',
    status: h1Count === 1 ? 'done' : 'todo',
    field: 'content',
    detail: h1Count === 1
      ? copy.h1.valid
      : copy.h1.invalid(h1Count),
  });

  tasks.push({
    id: 'assistant-image-alt',
    label: copy.imageAlt.label,
    severity: missingAlt > 0 ? 'medium' : 'low',
    status: missingAlt > 0 ? 'todo' : 'done',
    field: 'content',
    detail: missingAlt > 0
      ? copy.imageAlt.invalid(missingAlt)
      : copy.imageAlt.valid,
  });

  if (focusKeyword) {
    tasks.push({
      id: 'assistant-keyword-title',
      label: copy.keywordTitle.label,
      severity: includesKeyword(title, focusKeyword) ? 'low' : 'high',
      status: includesKeyword(title, focusKeyword) ? 'done' : 'todo',
      field: 'title',
      detail: includesKeyword(title, focusKeyword)
        ? copy.keywordTitle.valid(focusKeyword)
        : copy.keywordTitle.invalid(focusKeyword),
      applyHint: copy.keywordTitle.applyHint(focusKeyword, title),
    });

    tasks.push({
      id: 'assistant-keyword-description',
      label: copy.keywordDescription.label,
      severity: includesKeyword(description, focusKeyword) ? 'low' : 'medium',
      status: includesKeyword(description, focusKeyword) ? 'done' : 'todo',
      field: 'description',
      detail: includesKeyword(description, focusKeyword)
        ? copy.keywordDescription.valid(focusKeyword)
        : copy.keywordDescription.invalid(focusKeyword),
    });

    tasks.push({
      id: 'assistant-keyword-slug',
      label: copy.keywordSlug.label,
      severity: includesKeyword(slug, focusKeyword.replace(/\s+/g, ' ')) ? 'low' : 'medium',
      status: includesKeyword(slug, focusKeyword.replace(/\s+/g, ' ')) ? 'done' : 'todo',
      field: 'slug',
      detail: includesKeyword(slug, focusKeyword.replace(/\s+/g, ' '))
        ? copy.keywordSlug.valid
        : copy.keywordSlug.invalid,
    });

    tasks.push({
      id: 'assistant-keyword-body',
      label: copy.keywordBody.label,
      severity: includesKeyword(pageText, focusKeyword) ? 'low' : 'medium',
      status: includesKeyword(pageText, focusKeyword) ? 'done' : 'todo',
      field: 'content',
      detail: includesKeyword(pageText, focusKeyword)
        ? copy.keywordBody.valid(focusKeyword)
        : copy.keywordBody.invalid(focusKeyword),
    });
  } else {
    tasks.push({
      id: 'assistant-focus-keyword',
      label: copy.focusKeyword.label,
      severity: 'medium',
      status: 'todo',
      field: 'focusKeyword',
      detail: copy.focusKeyword.detail,
    });
  }

  const unique = new Map<string, BuilderSeoAssistantTask>();
  for (const task of tasks) {
    if (!unique.has(task.id)) unique.set(task.id, task);
  }

  const rank: Record<BuilderSeoAssistantSeverity, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };
  return [...unique.values()].sort((left, right) => {
    if (left.status !== right.status) return left.status === 'todo' ? -1 : 1;
    return rank[left.severity] - rank[right.severity] || left.label.localeCompare(right.label);
  });
}
