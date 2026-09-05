import { describe, expect, it } from 'vitest';

import {
  createHomeContainerNode,
  createHomeTextNode,
} from '@/lib/builder/canvas/decompose-home-shared';
import type { BuilderCanvasNode, BuilderTextCanvasNode } from '@/lib/builder/canvas/types';
import type { Locale } from '@/lib/locales';
import {
  ARCHIVE_INTRO_COPY,
  projectPublishedHomeInsightsArchiveIntro,
} from '@/lib/insights/archive-copy';

const LEGACY_ARCHIVE_INTRO = {
  ko: '실제 수집된 칼럼 본문과 이미지를 기반으로 주요 글을 바로 확인할 수 있습니다.',
  'zh-hant': '以下內容直接對應已整理的專欄原文與圖片素材。',
  en: 'Browse key posts prepared from curated legal columns and source images.',
} as const;

const HOME_SLUG = '';

function insightsDescriptionNode(
  text: string,
  patch: Partial<BuilderTextCanvasNode> = {},
): BuilderCanvasNode {
  const node = createHomeTextNode({
    id: 'home-insights-description',
    parentId: 'home-insights-container',
    rect: { x: 12, y: 88, width: 720, height: 44 },
    zIndex: 2,
    text,
    className: 'section-lede',
    as: 'p',
    fontSize: 17.28,
    color: '#0f172a',
  });

  if (node.kind !== 'text') {
    return node;
  }

  return {
    ...node,
    ...patch,
    content: {
      ...node.content,
      ...(patch.content ?? {}),
    },
  };
}

function geometryOf(node: BuilderCanvasNode) {
  return {
    id: node.id,
    kind: node.kind,
    parentId: node.parentId,
    rect: node.rect,
    style: node.style,
    zIndex: node.zIndex,
    rotation: node.rotation,
    locked: node.locked,
    visible: node.visible,
    dataBinding: node.dataBinding,
  };
}

describe('projectPublishedHomeInsightsArchiveIntro', () => {
  it.each(Object.keys(LEGACY_ARCHIVE_INTRO) as Locale[])(
    'replaces the exact leftover %s home archive default without mutating input',
    (locale) => {
      const node = insightsDescriptionNode(LEGACY_ARCHIVE_INTRO[locale]);
      Object.freeze(node);
      Object.freeze(node.rect);
      Object.freeze(node.style);
      Object.freeze(node.content);
      const snapshot = JSON.parse(JSON.stringify(node));

      const projected = projectPublishedHomeInsightsArchiveIntro(node, HOME_SLUG);

      expect(projected).not.toBe(node);
      expect(JSON.stringify(node)).toBe(JSON.stringify(snapshot));
      expect(projected.content).not.toBe(node.content);
      expect(geometryOf(projected)).toEqual(geometryOf(node));
      expect(projected.kind === 'text' ? projected.content.text : null).toBe(
        ARCHIVE_INTRO_COPY[locale],
      );
    },
  );

  it('leaves authored home copy on the original reference', () => {
    const node = insightsDescriptionNode('Edited archive introduction.');
    expect(projectPublishedHomeInsightsArchiveIntro(node, HOME_SLUG)).toBe(node);
  });

  it.each(['toString', 'constructor', '__proto__'] as const)(
    'leaves authored %s on the original reference as a primitive string',
    (authored) => {
      const node = insightsDescriptionNode(authored);
      const projected = projectPublishedHomeInsightsArchiveIntro(node, HOME_SLUG);

      expect(projected).toBe(node);
      expect(projected.kind === 'text' ? projected.content.text : null).toBe(authored);
      expect(typeof (projected.kind === 'text' ? projected.content.text : null)).toBe('string');
    },
  );

  it('leaves a different node identity on the original reference', () => {
    const node = insightsDescriptionNode(LEGACY_ARCHIVE_INTRO.ko, {
      id: 'home-insights-title',
    });
    expect(projectPublishedHomeInsightsArchiveIntro(node, HOME_SLUG)).toBe(node);
  });

  it('leaves a dataset-bound node on the original reference', () => {
    const node = insightsDescriptionNode(LEGACY_ARCHIVE_INTRO.en, {
      dataBinding: {
        targetId: 'home.insights.feed',
        recordIndex: 0,
        fields: { text: 'summary' },
      },
    });
    expect(projectPublishedHomeInsightsArchiveIntro(node, HOME_SLUG)).toBe(node);
  });

  it('leaves a non-text node on the original reference', () => {
    const node = createHomeContainerNode({
      id: 'home-insights-description',
      rect: { x: 12, y: 88, width: 720, height: 44 },
      zIndex: 2,
      label: 'not text',
    });
    expect(projectPublishedHomeInsightsArchiveIntro(node, HOME_SLUG)).toBe(node);
  });

  it('leaves leftover seed copy unchanged off the home route', () => {
    const node = insightsDescriptionNode(LEGACY_ARCHIVE_INTRO['zh-hant']);
    expect(projectPublishedHomeInsightsArchiveIntro(node, 'pricing')).toBe(node);
    expect(projectPublishedHomeInsightsArchiveIntro(node, 'about')).toBe(node);
  });
});
