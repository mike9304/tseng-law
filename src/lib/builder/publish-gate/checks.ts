/**
 * Publish gate — pure check functions.
 *
 * Each check operates on a `BuilderCanvasDocument` (and optionally
 * `BuilderPageMeta` / `BuilderSiteDocument`) and returns a list of
 * `CheckResult`. They are pure, sync, and side-effect free so they can run
 * server-side (POST /api/builder/site/publish-checks) or client-side.
 *
 * Severities:
 *   - blocker  → publish is disallowed until resolved
 *   - warning  → publish allowed but flagged ("publish anyway")
 *   - info     → informational only, never blocks
 *
 * The runner (`gate-runner.ts`) calls all of these and aggregates results.
 */
import type { BuilderCanvasDocument, BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type { BuilderPageMeta, BuilderSiteDocument } from '@/lib/builder/site/types';

export type CheckSeverity = 'blocker' | 'warning' | 'info';

export type CheckCategory =
  | 'links'
  | 'images'
  | 'seo'
  | 'forms'
  | 'responsive'
  | 'accessibility'
  | 'performance';

export interface CheckResult {
  id: string;
  severity: CheckSeverity;
  category: CheckCategory;
  message: string;
  affectedNodeIds?: string[];
  fixHint?: string;
}

export interface PublishCheckSuite {
  results: CheckResult[];
  hasBlocker: boolean;
  warningCount: number;
  blockerCount: number;
  infoCount: number;
  checkedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────

function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href) || /^mailto:/i.test(href) || /^tel:/i.test(href);
}

function isAnchorLink(href: string): boolean {
  return href.startsWith('#');
}

function isLightboxLink(href: string): boolean {
  return href.startsWith('lightbox:');
}

function normalizeInternalPath(href: string): string {
  // Strip leading locale segment, query, hash. Returns slug only.
  const noHash = href.split('#')[0].split('?')[0];
  // /ko/foo/bar  → /foo/bar
  const stripped = noHash.replace(/^\/(?:ko|zh-hant|en)(?=\/|$)/, '');
  // leading slash off
  return stripped.replace(/^\//, '').replace(/\/$/, '');
}

function isValidExternalUrl(href: string): boolean {
  try {
    // mailto:/tel: handled separately
    if (/^mailto:/i.test(href)) {
      return /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+/i.test(href);
    }
    if (/^tel:/i.test(href)) {
      return /^tel:[+\d\s\-()]+$/i.test(href);
    }
    new URL(href);
    return true;
  } catch {
    return false;
  }
}

function siteSlugSet(site?: BuilderSiteDocument | null): Set<string> {
  if (!site) return new Set<string>();
  const set = new Set<string>();
  for (const page of site.pages) {
    set.add(page.slug.replace(/^\//, '').replace(/\/$/, ''));
  }
  return set;
}

// ─── Individual checks ────────────────────────────────────────────

export function checkBrokenLinks(
  doc: BuilderCanvasDocument,
  site?: BuilderSiteDocument | null,
): CheckResult[] {
  const results: CheckResult[] = [];
  const slugs = siteSlugSet(site);

  for (const node of doc.nodes) {
    let href: string | undefined;
    let nodeLabel: string = node.kind;

    if (node.kind === 'button') {
      href = node.content.href;
      nodeLabel = 'button';
    } else if (node.kind === 'ctaBanner') {
      href = node.content.buttonHref;
      nodeLabel = 'CTA banner';
    }

    if (typeof href !== 'string') continue;
    const trimmed = href.trim();

    if (!trimmed || trimmed === '#') {
      results.push({
        id: `broken-link-empty-${node.id}`,
        severity: 'warning',
        category: 'links',
        message: `${nodeLabel} 링크가 비어 있습니다 (${node.id}).`,
        affectedNodeIds: [node.id],
        fixHint: 'Inspector 에서 href 또는 링크 대상을 설정하세요.',
      });
      continue;
    }

    if (isAnchorLink(trimmed) || isLightboxLink(trimmed)) {
      // Anchor / lightbox refs not validated here — assume ok.
      continue;
    }

    if (isExternalUrl(trimmed)) {
      if (!isValidExternalUrl(trimmed)) {
        results.push({
          id: `broken-link-extern-${node.id}`,
          severity: 'blocker',
          category: 'links',
          message: `외부 URL 형식이 잘못되었습니다: ${trimmed}`,
          affectedNodeIds: [node.id],
          fixHint: '유효한 URL (예: https://example.com) 으로 수정하세요.',
        });
      }
      continue;
    }

    // Internal path check
    if (trimmed.startsWith('/')) {
      const slug = normalizeInternalPath(trimmed);
      if (slugs.size > 0 && !slugs.has(slug)) {
        results.push({
          id: `broken-link-internal-${node.id}`,
          severity: 'warning',
          category: 'links',
          message: `내부 경로 ${trimmed} 에 해당하는 페이지가 사이트에 없습니다.`,
          affectedNodeIds: [node.id],
          fixHint: '페이지를 생성하거나 다른 경로로 변경하세요.',
        });
      }
      continue;
    }

    // Anything else (relative slug, raw text) → warning
    results.push({
      id: `broken-link-unknown-${node.id}`,
      severity: 'warning',
      category: 'links',
      message: `링크가 절대 경로(/...) 또는 외부 URL 이 아닙니다: ${trimmed}`,
      affectedNodeIds: [node.id],
      fixHint: '/ko/contact 형태의 경로 또는 https://... 외부 URL을 사용하세요.',
    });
  }

  return results;
}

export function checkImageAlt(doc: BuilderCanvasDocument): CheckResult[] {
  const results: CheckResult[] = [];
  for (const node of doc.nodes) {
    if (node.kind !== 'image') continue;
    if (!node.content.src) {
      results.push({
        id: `image-no-src-${node.id}`,
        severity: 'blocker',
        category: 'images',
        message: `이미지 소스가 비어 있습니다 (${node.id}).`,
        affectedNodeIds: [node.id],
        fixHint: 'Asset Library 에서 이미지를 선택하세요.',
      });
      continue;
    }
    const alt = node.content.alt?.trim?.() ?? '';
    if (!alt) {
      results.push({
        id: `image-no-alt-${node.id}`,
        severity: 'warning',
        category: 'accessibility',
        message: `이미지 alt 텍스트가 없습니다 (${node.id}).`,
        affectedNodeIds: [node.id],
        fixHint: 'Inspector 에서 alt 텍스트를 입력하세요. 장식용이면 빈 문자열도 명시적으로 입력하세요.',
      });
    }
  }
  return results;
}

export function checkSeoMeta(page?: BuilderPageMeta | null): CheckResult[] {
  if (!page) return [];
  const results: CheckResult[] = [];
  const seo = page.seo ?? {};
  const title = (seo.title ?? '').trim();
  const description = (seo.description ?? '').trim();

  if (!title) {
    results.push({
      id: 'seo-title-missing',
      severity: 'warning',
      category: 'seo',
      message: 'SEO title 이 비어 있습니다.',
      fixHint: 'SEO 패널에서 30~60자 사이의 제목을 입력하세요.',
    });
  } else if (title.length < 30 || title.length > 60) {
    results.push({
      id: 'seo-title-length',
      severity: 'warning',
      category: 'seo',
      message: `SEO title 길이 권장 범위 (30~60자)를 벗어났습니다. 현재 ${title.length}자.`,
      fixHint: '검색 결과 노출 최적화를 위해 30~60자로 조정하세요.',
    });
  }

  if (!description) {
    results.push({
      id: 'seo-description-missing',
      severity: 'warning',
      category: 'seo',
      message: 'SEO description 이 비어 있습니다.',
      fixHint: 'SEO 패널에서 120~160자 사이의 설명을 입력하세요.',
    });
  } else if (description.length < 120 || description.length > 160) {
    results.push({
      id: 'seo-description-length',
      severity: 'info',
      category: 'seo',
      message: `SEO description 길이 권장 범위 (120~160자)를 벗어났습니다. 현재 ${description.length}자.`,
      fixHint: '검색 결과 스니펫 최적화를 위해 120~160자로 조정하세요.',
    });
  }

  return results;
}

export function checkFormTarget(doc: BuilderCanvasDocument): CheckResult[] {
  const results: CheckResult[] = [];
  for (const node of doc.nodes) {
    if (node.kind !== 'form') continue;
    const target = node.content.submitTo;
    if (target === 'email') {
      const email = node.content.targetEmail?.trim() ?? '';
      if (!email) {
        results.push({
          id: `form-email-missing-${node.id}`,
          severity: 'blocker',
          category: 'forms',
          message: `폼 ${node.content.name} 의 수신 이메일이 비어 있습니다.`,
          affectedNodeIds: [node.id],
          fixHint: 'Inspector → 폼 설정 → "수신 이메일" 입력.',
        });
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(email)) {
        results.push({
          id: `form-email-invalid-${node.id}`,
          severity: 'blocker',
          category: 'forms',
          message: `폼 ${node.content.name} 의 수신 이메일 형식이 잘못되었습니다 (${email}).`,
          affectedNodeIds: [node.id],
          fixHint: '유효한 이메일 주소로 수정하세요.',
        });
      }
    }
    if (target === 'webhook') {
      const url = node.content.webhookUrl?.trim() ?? '';
      if (!url) {
        results.push({
          id: `form-webhook-missing-${node.id}`,
          severity: 'blocker',
          category: 'forms',
          message: `폼 ${node.content.name} 의 webhook URL 이 비어 있습니다.`,
          affectedNodeIds: [node.id],
          fixHint: 'Inspector → 폼 설정 → "Webhook URL" 입력.',
        });
      } else if (!isValidExternalUrl(url)) {
        results.push({
          id: `form-webhook-invalid-${node.id}`,
          severity: 'blocker',
          category: 'forms',
          message: `폼 ${node.content.name} 의 webhook URL 형식이 잘못되었습니다.`,
          affectedNodeIds: [node.id],
          fixHint: '유효한 https:// URL 로 수정하세요.',
        });
      }
    }
  }
  return results;
}

export function checkResponsiveOverflow(doc: BuilderCanvasDocument): CheckResult[] {
  const results: CheckResult[] = [];
  const stageWidth = doc.stageWidth ?? 1280;

  for (const node of doc.nodes) {
    // Skip child nodes — their rect is relative to parent container.
    if (node.parentId) continue;

    // Desktop check
    const right = node.rect.x + node.rect.width;
    if (right > stageWidth + 1) {
      results.push({
        id: `overflow-desktop-${node.id}`,
        severity: 'warning',
        category: 'responsive',
        message: `${node.kind} 노드가 데스크탑 스테이지 폭(${stageWidth}px)을 초과합니다 (${right}px).`,
        affectedNodeIds: [node.id],
        fixHint: '노드를 드래그해서 스테이지 안으로 이동하거나 폭을 줄이세요.',
      });
    }

    // Mobile / tablet override checks
    const mobileOverride = node.responsive?.mobile?.rect;
    if (mobileOverride) {
      const mw = mobileOverride.width ?? node.rect.width;
      const mx = mobileOverride.x ?? node.rect.x;
      if (mx + mw > 480 + 1) {
        results.push({
          id: `overflow-mobile-${node.id}`,
          severity: 'info',
          category: 'responsive',
          message: `모바일 뷰포트에서 ${node.kind} 노드가 480px 가이드를 초과합니다.`,
          affectedNodeIds: [node.id],
          fixHint: '모바일 뷰포트에서 rect 를 조정하세요.',
        });
      }
    }

    const tabletOverride = node.responsive?.tablet?.rect;
    if (tabletOverride) {
      const tw = tabletOverride.width ?? node.rect.width;
      const tx = tabletOverride.x ?? node.rect.x;
      if (tx + tw > 768 + 1) {
        results.push({
          id: `overflow-tablet-${node.id}`,
          severity: 'info',
          category: 'responsive',
          message: `태블릿 뷰포트에서 ${node.kind} 노드가 768px 가이드를 초과합니다.`,
          affectedNodeIds: [node.id],
          fixHint: '태블릿 뷰포트에서 rect 를 조정하세요.',
        });
      }
    }
  }
  return results;
}

export function checkH1Count(doc: BuilderCanvasDocument): CheckResult[] {
  const h1Nodes: BuilderCanvasNode[] = [];
  for (const node of doc.nodes) {
    if (node.kind === 'heading' && node.content.level === 1) {
      h1Nodes.push(node);
      continue;
    }
    if (node.kind === 'text' && node.content.as === 'h1') {
      h1Nodes.push(node);
    }
  }
  if (h1Nodes.length === 0) {
    return [{
      id: 'seo-h1-missing',
      severity: 'warning',
      category: 'seo',
      message: '페이지에 H1 이 없습니다. 검색 엔진은 페이지 주제를 H1 으로 식별합니다.',
      fixHint: 'Heading 노드를 추가하고 level 을 1 로 설정하세요.',
    }];
  }
  if (h1Nodes.length > 1) {
    return [{
      id: 'seo-h1-multiple',
      severity: 'warning',
      category: 'seo',
      message: `H1 이 ${h1Nodes.length} 개 있습니다. 일반적으로 페이지당 하나만 사용합니다.`,
      affectedNodeIds: h1Nodes.map((n) => n.id),
      fixHint: '주요 H1 을 제외한 나머지를 H2/H3 으로 강등하세요.',
    }];
  }
  return [];
}

export function checkEmptyContent(doc: BuilderCanvasDocument): CheckResult[] {
  const results: CheckResult[] = [];
  if (doc.nodes.length === 0) {
    results.push({
      id: 'page-empty',
      severity: 'blocker',
      category: 'performance',
      message: '페이지에 요소가 없습니다.',
      fixHint: '캔버스에 텍스트, 이미지, 버튼 등을 추가하세요.',
    });
    return results;
  }
  for (const node of doc.nodes) {
    if (node.kind === 'text') {
      const text = node.content.text?.trim?.() ?? '';
      if (!text) {
        results.push({
          id: `text-empty-${node.id}`,
          severity: 'warning',
          category: 'performance',
          message: `빈 텍스트 노드가 있습니다 (${node.id}).`,
          affectedNodeIds: [node.id],
          fixHint: '내용을 입력하거나 노드를 삭제하세요.',
        });
      }
    }
    if (node.kind === 'heading') {
      const text = node.content.text?.trim?.() ?? '';
      if (!text) {
        results.push({
          id: `heading-empty-${node.id}`,
          severity: 'warning',
          category: 'performance',
          message: `빈 heading 노드가 있습니다 (${node.id}).`,
          affectedNodeIds: [node.id],
          fixHint: '제목 텍스트를 입력하거나 노드를 삭제하세요.',
        });
      }
    }
  }
  return results;
}
