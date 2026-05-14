import { describe, expect, it } from 'vitest';
import {
  builderCanvasNodeSchema,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';

function baseLottieNode(overrides: { src: string; speed?: number }) {
  return {
    id: 'lottie-1',
    kind: 'lottie',
    rect: { x: 0, y: 0, width: 320, height: 240 },
    rotation: 0,
    zIndex: 0,
    visible: true,
    locked: false,
    style: undefined,
    content: {
      src: overrides.src,
      label: 'Lottie animation',
      autoplay: true,
      loop: true,
      speed: overrides.speed ?? 1,
    },
  } as unknown as BuilderCanvasNode;
}

describe('lottie canvas node schema', () => {
  it('accepts an empty src (unconfigured widget)', () => {
    const result = builderCanvasNodeSchema.safeParse(baseLottieNode({ src: '' }));
    expect(result.success).toBe(true);
  });

  it('accepts an https LottieFiles embed URL', () => {
    const result = builderCanvasNodeSchema.safeParse(
      baseLottieNode({ src: 'https://lottie.host/embed/abc/def.lottie' }),
    );
    expect(result.success).toBe(true);
  });

  it('rejects javascript: src', () => {
    const result = builderCanvasNodeSchema.safeParse(
      baseLottieNode({ src: 'javascript:alert(document.domain)' }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects data:text/html src', () => {
    const result = builderCanvasNodeSchema.safeParse(
      baseLottieNode({ src: 'data:text/html,<script>alert(1)</script>' }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects protocol-relative src', () => {
    const result = builderCanvasNodeSchema.safeParse(
      baseLottieNode({ src: '//evil.example.test/anim.lottie' }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects speed below 0.25 and above 4', () => {
    expect(
      builderCanvasNodeSchema.safeParse(baseLottieNode({ src: '', speed: 0.1 })).success,
    ).toBe(false);
    expect(
      builderCanvasNodeSchema.safeParse(baseLottieNode({ src: '', speed: 5 })).success,
    ).toBe(false);
  });
});
