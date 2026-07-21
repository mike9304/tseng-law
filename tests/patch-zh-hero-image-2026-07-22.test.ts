/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- fixtures intentionally exercise the JavaScript CLI boundary.
import { describe, expect, it } from 'vitest';
import {
  HERO_IMAGE_ALT,
  HERO_IMAGE_IDS,
  HERO_IMAGE_SRC,
  formatZhHeroImagePatchPlan,
  planZhHeroImagePatch,
} from '../scripts/patch-zh-hero-image-2026-07-22.mjs';
import {
  builderCanvasDocumentSchema,
  builderCanvasNodeSchema,
} from '../src/lib/builder/canvas/types.ts';
import { validatePatchedDocument } from '../scripts/patch-zh-hero-2026-07-21.mjs';

const STYLE = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
};

function baseNode(overrides = {}) {
  return {
    id: 'node',
    kind: 'container',
    rect: { x: 0, y: 0, width: 100, height: 100 },
    style: { ...STYLE },
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label: 'container',
      background: 'transparent',
      borderColor: '#cbd5e1',
      borderStyle: 'solid',
      borderWidth: 0,
      borderRadius: 0,
      padding: 0,
      layoutMode: 'absolute',
    },
    ...overrides,
  };
}

function container(id, parentId, width, responsiveWidth) {
  return baseNode({
    id,
    ...(parentId ? { parentId } : {}),
    rect: { x: width < 1280 ? 200 : 0, y: 11, width, height: 720 },
    responsive: {
      tablet: { rect: { x: responsiveWidth.tablet < 760 ? 80 : 0, width: responsiveWidth.tablet } },
      mobile: { rect: { x: responsiveWidth.mobile < 390 ? 40 : 0, width: responsiveWidth.mobile } },
    },
  });
}

function image(id, width, responsiveWidth, index) {
  return baseNode({
    id,
    kind: 'image',
    parentId: 'home-hero-media',
    rect: { x: width < 1280 ? 200 : 0, y: index * 3, width, height: 700 - index },
    responsive: {
      tablet: {
        rect: {
          x: responsiveWidth.tablet < 760 ? 80 : 0,
          y: index + 1,
          width: responsiveWidth.tablet,
          height: 600 - index,
        },
      },
      mobile: {
        rect: {
          x: responsiveWidth.mobile < 390 ? 40 : 0,
          y: index + 2,
          width: responsiveWidth.mobile,
          height: 500 - index,
        },
      },
    },
    content: {
      src: `/images/old-${index}.webp`,
      srcByLocale: {
        'zh-hant': `/images/old-zh-${index}.webp`,
        en: `/images/old-en-${index}.webp`,
      },
      alt: `old alt ${index}`,
      altByLocale: {
        'zh-hant': `old zh alt ${index}`,
        en: `old en alt ${index}`,
      },
      fit: 'contain',
      focalPoint: { x: 35 + index, y: 45 + index },
      clickAction: 'none',
    },
  });
}

function fixture({ fullBleed = false } = {}) {
  const desktopWidth = fullBleed ? 1280 : 1080;
  const tabletWidth = fullBleed ? 760 : 640;
  const mobileWidth = fullBleed ? 390 : 330;
  return {
    version: 1,
    locale: 'zh-hant',
    updatedAt: '2026-07-21T00:00:00.000Z',
    updatedBy: 'fixture',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [
      container('home-hero-root', undefined, 1280, { tablet: 760, mobile: 390 }),
      container('home-hero-media', 'home-hero-root', desktopWidth, {
        tablet: tabletWidth,
        mobile: mobileWidth,
      }),
      ...HERO_IMAGE_IDS.map((id, index) => image(
        id,
        desktopWidth,
        { tablet: tabletWidth, mobile: mobileWidth },
        index,
      )),
    ],
  };
}

const SCHEMAS = { builderCanvasDocumentSchema, builderCanvasNodeSchema };

describe('planZhHeroImagePatch', () => {
  it('replaces all three exact image nodes and expands desktop/responsive widths to the root', () => {
    const input = fixture();
    const before = structuredClone(input);
    const result = planZhHeroImagePatch(input, { now: '2026-07-22T00:00:00.000Z' });

    expect(result.ok).toBe(true);
    expect(input).toEqual(before);
    const byId = new Map(result.document.nodes.map((node) => [node.id, node]));
    const media = byId.get('home-hero-media');
    expect(media.rect).toEqual({ x: 0, y: 11, width: 1280, height: 720 });
    expect(media.responsive.tablet.rect).toEqual({ x: 0, width: 760 });
    expect(media.responsive.mobile.rect).toEqual({ x: 0, width: 390 });

    for (const [index, id] of HERO_IMAGE_IDS.entries()) {
      const node = byId.get(id);
      expect(node.content.src).toBe(HERO_IMAGE_SRC);
      expect(node.content.srcByLocale).toEqual({
        'zh-hant': HERO_IMAGE_SRC,
        en: `/images/old-en-${index}.webp`,
      });
      expect(node.content.alt).toBe(HERO_IMAGE_ALT);
      expect(node.content.altByLocale).toEqual({
        'zh-hant': HERO_IMAGE_ALT,
        en: `old en alt ${index}`,
      });
      expect(node.content.fit).toBe('cover');
      expect(node.content.focalPoint).toEqual({ x: 50, y: 50 });
      expect(node.rect).toEqual({ x: 0, y: index * 3, width: 1280, height: 700 - index });
      expect(node.responsive.tablet.rect).toEqual({
        x: 0,
        y: index + 1,
        width: 760,
        height: 600 - index,
      });
      expect(node.responsive.mobile.rect).toEqual({
        x: 0,
        y: index + 2,
        width: 390,
        height: 500 - index,
      });
    }

    expect(validatePatchedDocument(result.document, SCHEMAS)).toMatchObject({ ok: true });
    expect(result.document.nodes.every((node) => builderCanvasNodeSchema.safeParse(node).success))
      .toBe(true);
    const output = formatZhHeroImagePatchPlan(result);
    expect(output).toContain('home-hero-media-image-3 :: content.src');
    expect(output).toContain(`"/images/old-2.webp" -> "${HERO_IMAGE_SRC}"`);
    expect(output).toContain('Dry-run complete; no persistence write was attempted.');
  });

  it('fails closed with the original document when one exact image node is missing', () => {
    const input = fixture();
    input.nodes = input.nodes.filter((node) => node.id !== 'home-hero-media-image-3');
    const before = structuredClone(input);
    const result = planZhHeroImagePatch(input);

    expect(result.ok).toBe(false);
    expect(result.error).toBe('Required exact node is missing: home-hero-media-image-3');
    expect(result.changes).toEqual([]);
    expect(result.document).toEqual(before);
    expect(input).toEqual(before);
    expect(formatZhHeroImagePatchPlan(result)).toContain('No persistence write was attempted.');
  });

  it('keeps already full-bleed desktop/responsive geometry unchanged', () => {
    const input = fixture({ fullBleed: true });
    const geometryBefore = new Map(input.nodes.map((node) => [
      node.id,
      { rect: structuredClone(node.rect), responsive: structuredClone(node.responsive) },
    ]));
    const result = planZhHeroImagePatch(input);

    expect(result.ok).toBe(true);
    for (const node of result.document.nodes) {
      expect({ rect: node.rect, responsive: node.responsive }).toEqual(geometryBefore.get(node.id));
    }
    expect(result.changes.filter((change) => (
      change.field === 'rect.x'
      || change.field === 'rect.width'
      || change.field.includes('.rect.x')
      || change.field.includes('.rect.width')
    ))).toEqual([]);
    expect(validatePatchedDocument(result.document, SCHEMAS)).toMatchObject({ ok: true });
  });
});
