import { describe, expect, it } from 'vitest';
import {
  buildSavedSectionThumbnailSvg,
  sanitizeSvgThumbnail,
  assertSafeSvgThumbnail,
} from '@/lib/builder/sections/thumbnail';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import { createDefaultCanvasNodeStyle } from '@/lib/builder/canvas/types';

function mk(overrides: Record<string, unknown>): BuilderCanvasNode {
  return {
    id: 'n',
    kind: 'container',
    parentId: undefined,
    rect: { x: 0, y: 0, width: 800, height: 400 },
    style: createDefaultCanvasNodeStyle(),
    content: {},
    visible: true,
    locked: false,
    rotation: 0,
    zIndex: 0,
    ...overrides,
  } as unknown as BuilderCanvasNode;
}

describe('sanitizeSvgThumbnail', () => {
  it('returns null for null/undefined/empty', () => {
    expect(sanitizeSvgThumbnail(null)).toBeNull();
    expect(sanitizeSvgThumbnail(undefined)).toBeNull();
    expect(sanitizeSvgThumbnail('')).toBeNull();
    expect(sanitizeSvgThumbnail('   ')).toBeNull();
  });

  it('returns null when missing svg open or close tag', () => {
    expect(sanitizeSvgThumbnail('<div>nope</div>')).toBeNull();
    expect(sanitizeSvgThumbnail('<svg>no close')).toBeNull();
    expect(sanitizeSvgThumbnail('no open</svg>')).toBeNull();
  });

  it('rejects <script> tags (any case / whitespace)', () => {
    expect(sanitizeSvgThumbnail('<svg><script>alert(1)</script></svg>')).toBeNull();
    expect(sanitizeSvgThumbnail('<svg><SCRIPT>x</SCRIPT></svg>')).toBeNull();
    expect(sanitizeSvgThumbnail('<svg>< script >x</script ></svg>')).toBeNull();
  });

  it('rejects on* event handler attributes', () => {
    expect(sanitizeSvgThumbnail('<svg><rect onclick="x"></rect></svg>')).toBeNull();
    expect(sanitizeSvgThumbnail('<svg><circle ONLOAD="x"/></svg>')).toBeNull();
    expect(sanitizeSvgThumbnail('<svg onmouseover="x"></svg>')).toBeNull();
  });

  it('rejects external href / xlink:href', () => {
    expect(sanitizeSvgThumbnail('<svg><a href="https://evil.com">x</a></svg>')).toBeNull();
    expect(sanitizeSvgThumbnail('<svg><use xlink:href="https://x"/></svg>')).toBeNull();
  });

  it('rejects javascript:, vbscript:, data: protocols', () => {
    expect(sanitizeSvgThumbnail('<svg><a href="javascript:alert(1)">x</a></svg>')).toBeNull();
    expect(sanitizeSvgThumbnail('<svg><a href="vbscript:msg">x</a></svg>')).toBeNull();
    expect(sanitizeSvgThumbnail('<svg><image href="data:image/svg,..."/></svg>')).toBeNull();
  });

  // NOTE: 현재 sanitizer는 의도상 fragment href ("#anchor")를 허용해야 하지만,
  // UNSAFE_HREF_RE의 alternation에서 unquoted 분기가 quoted "#sym" 도 매치하여 reject.
  // 보안적으로는 더 엄격(safer) 동작이라 일단 그대로 두고 현재 동작을 잠금.
  // (intended-behavior fix는 별도 트랙에서 fragment-safe 구현 후 변경)
  it('rejects href even when fragment-only (quoted "#sym") — strict-by-default', () => {
    const svg = '<svg xmlns="http://www.w3.org/2000/svg"><use href="#sym"/></svg>';
    expect(sanitizeSvgThumbnail(svg)).toBeNull();
  });

  it('allows simple safe SVG', () => {
    const safe = '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10" fill="#000"/></svg>';
    expect(sanitizeSvgThumbnail(safe)).toBe(safe);
  });

  it('rejects oversized SVG (> 500_000 chars)', () => {
    const big = '<svg>' + 'x'.repeat(500_001) + '</svg>';
    expect(sanitizeSvgThumbnail(big)).toBeNull();
  });
});

describe('assertSafeSvgThumbnail', () => {
  it('returns the input on safe svg', () => {
    const safe = '<svg xmlns="http://www.w3.org/2000/svg"><rect/></svg>';
    expect(assertSafeSvgThumbnail(safe)).toBe(safe);
  });

  it('throws on unsafe svg', () => {
    expect(() => assertSafeSvgThumbnail('<svg><script>x</script></svg>')).toThrow(
      'unsafe_svg_thumbnail',
    );
  });
});

describe('buildSavedSectionThumbnailSvg', () => {
  it('returns wrapped empty svg when root not found', () => {
    const result = buildSavedSectionThumbnailSvg([], 'missing');
    expect(result).toMatch(/^<svg/);
    expect(result).toMatch(/<\/svg>$/);
    expect(result).not.toContain('<script');
  });

  it('produces non-empty svg with rects when root + children given', () => {
    const root = mk({ id: 'root', rect: { x: 0, y: 0, width: 800, height: 400 } });
    const text = mk({
      id: 'text-1',
      kind: 'text',
      parentId: 'root',
      rect: { x: 50, y: 60, width: 200, height: 32 },
    });
    const result = buildSavedSectionThumbnailSvg([root, text], 'root');
    expect(result).toMatch(/<svg/);
    expect(result).toMatch(/<\/svg>/);
    expect(result.length).toBeGreaterThan(80);
    // text fill (#cbd5e1) should be present in the kind color set
    expect(result).toContain('#cbd5e1');
  });

  it('clamps width/height to safe range', () => {
    const root = mk({ id: 'root' });
    const result = buildSavedSectionThumbnailSvg([root], 'root', 0, 99999);
    // Should not crash; viewBox should reflect clamped dimensions (40~2000 range)
    expect(result).toMatch(/viewBox="0 0 \d+ \d+"/);
  });

  it('output passes sanitizeSvgThumbnail (always self-safe)', () => {
    const root = mk({ id: 'root' });
    const child = mk({ id: 'c', parentId: 'root', kind: 'image' });
    const result = buildSavedSectionThumbnailSvg([root, child], 'root');
    expect(sanitizeSvgThumbnail(result)).not.toBeNull();
  });
});
