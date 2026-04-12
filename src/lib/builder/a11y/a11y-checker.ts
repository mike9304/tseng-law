/**
 * Phase 9 P9-06/P9-07 — Accessibility checker engine.
 *
 * Runs static checks on a canvas document and returns a list of
 * issues with severity levels. The A11y panel (Codex) renders these.
 */

import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

export type A11ySeverity = 'error' | 'warning' | 'info';

export interface A11yIssue {
  nodeId: string;
  nodeKind: string;
  severity: A11ySeverity;
  rule: string;
  message: string;
  suggestion?: string;
}

export function checkAccessibility(doc: BuilderCanvasDocument): A11yIssue[] {
  const issues: A11yIssue[] = [];

  for (const node of doc.nodes) {
    // Image alt text
    if (node.kind === 'image' && !node.content.alt) {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'error',
        rule: 'img-alt',
        message: '이미지에 대체 텍스트(alt)가 없습니다.',
        suggestion: '이미지를 설명하는 짧은 텍스트를 alt 필드에 입력하세요.',
      });
    }

    // Empty text
    if (node.kind === 'text' && (!node.content.text || String(node.content.text).trim() === '')) {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'warning',
        rule: 'empty-text',
        message: '빈 텍스트 요소가 있습니다.',
        suggestion: '텍스트를 입력하거나 요소를 삭제하세요.',
      });
    }

    // Button without link
    if (node.kind === 'button' && !node.content.href) {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'warning',
        rule: 'button-no-link',
        message: '버튼에 링크가 설정되지 않았습니다.',
        suggestion: '클릭 시 이동할 URL을 설정하세요.',
      });
    }

    // Color contrast (simplified — checks text on background)
    if (node.kind === 'text' && node.content.color && node.style?.backgroundColor) {
      const contrast = estimateContrastRatio(
        String(node.content.color),
        String(node.style.backgroundColor),
      );
      if (contrast < 4.5) {
        issues.push({
          nodeId: node.id,
          nodeKind: node.kind,
          severity: 'error',
          rule: 'color-contrast',
          message: `색상 대비가 부족합니다 (${contrast.toFixed(1)}:1, 최소 4.5:1 필요).`,
          suggestion: '텍스트 색상을 더 어둡게 하거나 배경을 더 밝게 하세요.',
        });
      }
    }

    // Heading order (simplified — just checks if headings exist)
    if (node.kind === 'heading') {
      const level = typeof node.content.level === 'number' ? node.content.level : 2;
      if (level > 3) {
        issues.push({
          nodeId: node.id,
          nodeKind: node.kind,
          severity: 'info',
          rule: 'heading-level',
          message: `H${level} 헤딩이 사용되었습니다. H1~H3을 권장합니다.`,
        });
      }
    }

    // Video without captions info (kind check via string for future-proofing)
    if ((node.kind as string) === 'video') {
      issues.push({
        nodeId: node.id,
        nodeKind: node.kind,
        severity: 'info',
        rule: 'video-captions',
        message: '동영상에 자막이 있는지 확인하세요.',
        suggestion: 'YouTube/Vimeo에서 자막을 활성화하세요.',
      });
    }
  }

  // Check page has at least one heading
  const hasHeading = doc.nodes.some((n) => n.kind === 'heading' || (n.kind === 'text' && typeof n.content.fontSize === 'number' && n.content.fontSize >= 24));
  if (!hasHeading) {
    issues.push({
      nodeId: '',
      nodeKind: 'page',
      severity: 'warning',
      rule: 'page-heading',
      message: '페이지에 제목(Heading)이 없습니다.',
      suggestion: 'H1 또는 큰 텍스트를 페이지 상단에 추가하세요.',
    });
  }

  return issues;
}

// Simplified contrast estimation (not full WCAG algorithm)
function estimateContrastRatio(fg: string, bg: string): number {
  const fgLum = hexToLuminance(fg);
  const bgLum = hexToLuminance(bg);
  const lighter = Math.max(fgLum, bgLum);
  const darker = Math.min(fgLum, bgLum);
  return (lighter + 0.05) / (darker + 0.05);
}

function hexToLuminance(hex: string): number {
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return 0.5;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}
