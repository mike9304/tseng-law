import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

/**
 * Production polish: kind/role 기반 light entrance/hover defaults.
 *
 * 적용 규칙:
 * - 사용자가 node.animation/hoverStyle을 명시적으로 설정한 경우 절대 덮어쓰지 않음
 * - prefers-reduced-motion 환경에서는 globals.css가 transition/animation을 1ms로 강제 (효과 0)
 * - 모든 기본값은 200~600ms 내의 절제된 모션
 * - heuristic은 published runtime에서만 발동. editor preview에는 영향 없음
 */

type DefaultAnimation = NonNullable<BuilderCanvasNode['animation']>;
type DefaultHoverStyle = NonNullable<BuilderCanvasNode['hoverStyle']>;

const HERO_CLASS_HINTS = [
  'hero-title',
  'hero-subtitle',
  'hero-eyebrow',
  'section-label',
  'hero-cta',
];

// 카드/섹션류 컨테이너 — entrance 자동 적용 후보
const CARD_LIKE_HINTS = [
  'office-card',
  'services-detail-card',
  'stat-card',
  'split-text',
  'split-image',
  'split-portrait-badge',
  'card-copy',
  'card-title',
];

const FEATURE_IMAGE_KIND = new Set(['image']);

function readClassName(node: BuilderCanvasNode): string {
  const c = (node.content as Record<string, unknown> | undefined) ?? {};
  const className = c.className;
  return typeof className === 'string' ? className : '';
}

function isHeroLikeText(node: BuilderCanvasNode): boolean {
  if (node.kind !== 'text' && node.kind !== 'heading') return false;
  const className = readClassName(node);
  return HERO_CLASS_HINTS.some((hint) => className.includes(hint));
}

function isCardLikeContainer(node: BuilderCanvasNode): boolean {
  if (node.kind !== 'container') return false;
  const className = readClassName(node);
  return CARD_LIKE_HINTS.some((hint) => className.includes(hint));
}

export function deriveHeuristicAnimation(
  node: BuilderCanvasNode,
): DefaultAnimation | undefined {
  if (node.animation) return node.animation;

  if (isHeroLikeText(node)) {
    return {
      entrance: { preset: 'slide-up', duration: 520, delay: 80, easing: 'ease-out', triggerOnce: true },
    };
  }

  if (isCardLikeContainer(node)) {
    return {
      entrance: { preset: 'slide-up', duration: 480, delay: 0, easing: 'ease-out', triggerOnce: true },
    };
  }

  if (FEATURE_IMAGE_KIND.has(node.kind)) {
    const w = node.rect?.width ?? 0;
    const h = node.rect?.height ?? 0;
    if (w >= 400 && h >= 240) {
      return {
        entrance: { preset: 'fade-in', duration: 600, delay: 0, easing: 'ease-out', triggerOnce: true },
      };
    }
  }

  return undefined;
}

export function deriveHeuristicHoverStyle(
  node: BuilderCanvasNode,
): DefaultHoverStyle | undefined {
  if (node.hoverStyle) return node.hoverStyle;

  if (node.kind === 'button') {
    return {
      transitionMs: 200,
      translateY: -2,
      shadowBlur: 18,
      shadowSpread: 0,
    };
  }

  return undefined;
}
