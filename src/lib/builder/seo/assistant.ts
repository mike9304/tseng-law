import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';
import {
  type BuilderSeoValidationIssue,
  validateBuilderPageSeo,
} from '@/lib/builder/seo/validation';
import { mergeSeoWithDefaults } from '@/lib/builder/seo/defaults';

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
  const seo = mergeSeoWithDefaults({
    page: input.page,
    site: input.site,
    siteUrl,
    locale: input.page.locale,
  });
  const focusKeyword = cleanText(seo.focusKeyword)
    || cleanText(input.site?.settings?.seoChecklist?.keywords?.[0]);
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
    label: 'Let search engines index this page',
    severity: seo.noIndex || input.page.noIndex ? 'critical' : 'low',
    status: seo.noIndex || input.page.noIndex ? 'todo' : 'done',
    field: 'robots',
    detail: seo.noIndex || input.page.noIndex
      ? '검색 노출이 필요한 페이지라면 noindex를 끄세요.'
      : '페이지가 검색엔진 색인 대상입니다.',
  });

  tasks.push({
    id: 'assistant-h1',
    label: 'Use one H1 on the page',
    severity: h1Count === 1 ? 'low' : 'high',
    status: h1Count === 1 ? 'done' : 'todo',
    field: 'content',
    detail: h1Count === 1
      ? 'H1 구조가 적절합니다.'
      : `현재 H1이 ${h1Count}개입니다. 핵심 제목 하나만 H1로 유지하세요.`,
  });

  tasks.push({
    id: 'assistant-image-alt',
    label: 'Write alt text for images',
    severity: missingAlt > 0 ? 'medium' : 'low',
    status: missingAlt > 0 ? 'todo' : 'done',
    field: 'content',
    detail: missingAlt > 0
      ? `${missingAlt}개 이미지에 alt text가 없습니다.`
      : '이미지 alt text가 채워져 있습니다.',
  });

  if (focusKeyword) {
    tasks.push({
      id: 'assistant-keyword-title',
      label: 'Add focus keyword to title tag',
      severity: includesKeyword(title, focusKeyword) ? 'low' : 'high',
      status: includesKeyword(title, focusKeyword) ? 'done' : 'todo',
      field: 'title',
      detail: includesKeyword(title, focusKeyword)
        ? `Title에 "${focusKeyword}"가 포함되어 있습니다.`
        : `SEO title에 "${focusKeyword}"를 자연스럽게 포함하세요.`,
      applyHint: `${focusKeyword} | ${title}`.slice(0, 60),
    });

    tasks.push({
      id: 'assistant-keyword-description',
      label: 'Add focus keyword to meta description',
      severity: includesKeyword(description, focusKeyword) ? 'low' : 'medium',
      status: includesKeyword(description, focusKeyword) ? 'done' : 'todo',
      field: 'description',
      detail: includesKeyword(description, focusKeyword)
        ? `Description에 "${focusKeyword}"가 포함되어 있습니다.`
        : `Meta description에 "${focusKeyword}"를 포함하세요.`,
    });

    tasks.push({
      id: 'assistant-keyword-slug',
      label: 'Add focus keyword to URL slug',
      severity: includesKeyword(slug, focusKeyword.replace(/\s+/g, ' ')) ? 'low' : 'medium',
      status: includesKeyword(slug, focusKeyword.replace(/\s+/g, ' ')) ? 'done' : 'todo',
      field: 'slug',
      detail: includesKeyword(slug, focusKeyword.replace(/\s+/g, ' '))
        ? 'Slug가 focus keyword와 연결되어 있습니다.'
        : '가능하면 URL slug에도 핵심 검색어를 짧게 반영하세요.',
    });

    tasks.push({
      id: 'assistant-keyword-body',
      label: 'Add focus keyword to page body',
      severity: includesKeyword(pageText, focusKeyword) ? 'low' : 'medium',
      status: includesKeyword(pageText, focusKeyword) ? 'done' : 'todo',
      field: 'content',
      detail: includesKeyword(pageText, focusKeyword)
        ? `본문에 "${focusKeyword}"가 포함되어 있습니다.`
        : `페이지 본문에 "${focusKeyword}"를 자연스럽게 포함하세요.`,
    });
  } else {
    tasks.push({
      id: 'assistant-focus-keyword',
      label: 'Set a focus keyword',
      severity: 'medium',
      status: 'todo',
      field: 'focusKeyword',
      detail: '페이지별 focus keyword를 입력하면 Wix SEO Assistant처럼 더 구체적인 작업이 생성됩니다.',
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
