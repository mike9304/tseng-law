import { describe, expect, it } from 'vitest';
import { checkAccessibility } from '../a11y-checker';
import { getA11yCheckerCopy } from '../a11y-checker-copy';
import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

describe('a11y checker copy', () => {
  it('returns ko checker copy', () => {
    const copy = getA11yCheckerCopy('ko');

    expect(copy.imageAltMessage).toBe('이미지에 대체 텍스트(alt)가 없습니다.');
    expect(copy.buttonNoLinkSuggestion).toBe('클릭 시 이동할 URL을 설정하세요.');
    expect(copy.colorContrastMessage('3.2')).toContain('색상 대비');
    expect(copy.headingLevelMessage(4)).toBe('H4 헤딩이 사용되었습니다. H1~H3을 권장합니다.');
  });

  it('returns zh-hant checker copy without Hangul', () => {
    const copy = getA11yCheckerCopy('zh-hant');

    expect(copy.imageAltMessage).toBe('圖片缺少替代文字（alt）。');
    expect([
      copy.imageAltMessage,
      copy.imageAltSuggestion,
      copy.emptyTextMessage,
      copy.emptyTextSuggestion,
      copy.buttonNoLinkMessage,
      copy.buttonNoLinkSuggestion,
      copy.linkBlankRelMessage,
      copy.linkBlankRelSuggestion,
      copy.imageLinkLabelMessage,
      copy.imageLinkLabelSuggestion,
      copy.colorContrastMessage('3.2'),
      copy.colorContrastSuggestion,
      copy.headingLevelMessage(4),
      copy.videoCaptionsMessage,
      copy.videoCaptionsSuggestion,
      copy.pageHeadingMessage,
      copy.pageHeadingSuggestion,
    ].join(' ')).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en checker copy without CJK', () => {
    const copy = getA11yCheckerCopy('en');
    const cjk = /[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/;

    expect(copy.imageAltMessage).toBe('Image is missing alt text.');
    expect([
      copy.imageAltMessage,
      copy.imageAltSuggestion,
      copy.emptyTextMessage,
      copy.emptyTextSuggestion,
      copy.buttonNoLinkMessage,
      copy.buttonNoLinkSuggestion,
      copy.linkBlankRelMessage,
      copy.linkBlankRelSuggestion,
      copy.imageLinkLabelMessage,
      copy.imageLinkLabelSuggestion,
      copy.colorContrastMessage('3.2'),
      copy.colorContrastSuggestion,
      copy.headingLevelMessage(4),
      copy.videoCaptionsMessage,
      copy.videoCaptionsSuggestion,
      copy.pageHeadingMessage,
      copy.pageHeadingSuggestion,
    ].join(' ')).not.toMatch(cjk);
  });

  it('uses the requested locale when checking a document', () => {
    const doc = {
      version: 1,
      locale: 'zh-hant',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'img-1',
          kind: 'image',
          content: {},
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.message === 'Image is missing alt text.')).toBe(true);
    expect(issues.some((issue) => issue.message === 'Page has no heading.')).toBe(true);
    expect(issues.map((issue) => issue.message).join(' ')).not.toMatch(/[\u4E00-\u9FFF]/);
  });

  it('checks text contrast against the visible parent background', () => {
    const doc = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'dark-card',
          kind: 'container',
          rect: { x: 0, y: 0, width: 420, height: 220 },
          style: { backgroundColor: 'transparent' },
          content: { background: '#0f172a' },
          zIndex: 0,
        },
        {
          id: 'card-title',
          kind: 'text',
          parentId: 'dark-card',
          rect: { x: 24, y: 24, width: 320, height: 60 },
          style: { backgroundColor: 'transparent' },
          content: {
            text: 'Visible text',
            fontSize: 24,
            color: '#ffffff',
            fontWeight: 'bold',
            align: 'left',
          },
          zIndex: 1,
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.nodeId === 'card-title' && issue.rule === 'color-contrast')).toBe(false);
  });

  it('keeps low contrast text errors when colors are concrete', () => {
    const doc = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'muted-copy',
          kind: 'text',
          rect: { x: 0, y: 0, width: 320, height: 80 },
          style: { backgroundColor: '#ffffff' },
          content: {
            text: 'Muted copy',
            fontSize: 16,
            color: '#aaaaaa',
            fontWeight: 'regular',
            align: 'left',
          },
          zIndex: 0,
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.nodeId === 'muted-copy' && issue.rule === 'color-contrast')).toBe(true);
  });

  it('skips contrast errors for backgrounds that cannot be resolved statically', () => {
    const doc = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'gradient-section',
          kind: 'container',
          rect: { x: 0, y: 0, width: 420, height: 220 },
          style: { backgroundColor: 'linear-gradient(90deg, #0f172a, #334155)' },
          content: { background: 'transparent' },
          zIndex: 0,
        },
        {
          id: 'gradient-title',
          kind: 'text',
          parentId: 'gradient-section',
          rect: { x: 24, y: 24, width: 320, height: 60 },
          style: { backgroundColor: 'transparent' },
          content: {
            text: 'Gradient text',
            fontSize: 24,
            color: '#ffffff',
            fontWeight: 'bold',
            align: 'left',
          },
          zIndex: 1,
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.nodeId === 'gradient-title' && issue.rule === 'color-contrast')).toBe(false);
  });

  it('skips contrast errors for text over image-backed areas', () => {
    const doc = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'hero',
          kind: 'container',
          rect: { x: 0, y: 0, width: 1280, height: 680 },
          style: { backgroundColor: 'transparent' },
          content: { background: 'transparent' },
          zIndex: 0,
        },
        {
          id: 'hero-photo',
          kind: 'image',
          parentId: 'hero',
          rect: { x: 0, y: 0, width: 1280, height: 680 },
          style: { backgroundColor: 'transparent' },
          content: { src: '/hero.webp', alt: 'Hero photo', fit: 'cover' },
          zIndex: 0,
        },
        {
          id: 'hero-title',
          kind: 'text',
          parentId: 'hero',
          rect: { x: 80, y: 140, width: 620, height: 120 },
          style: { backgroundColor: 'transparent' },
          content: {
            text: 'Hero title',
            fontSize: 52,
            color: '#ffffff',
            fontWeight: 'bold',
            align: 'left',
          },
          zIndex: 1,
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.nodeId === 'hero-title' && issue.rule === 'color-contrast')).toBe(false);
  });

  it('uses section tone as a fallback background for contrast checks', () => {
    const doc = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'dark-section',
          kind: 'container',
          rect: { x: 0, y: 0, width: 1280, height: 480 },
          style: { backgroundColor: 'transparent' },
          content: {
            background: 'transparent',
            className: 'section section--dark',
            dataTone: 'dark',
          },
          zIndex: 0,
        },
        {
          id: 'dark-section-title',
          kind: 'text',
          parentId: 'dark-section',
          rect: { x: 80, y: 80, width: 620, height: 120 },
          style: { backgroundColor: 'transparent' },
          content: {
            text: 'Dark section title',
            fontSize: 44,
            color: '#f8fafc',
            fontWeight: 'bold',
            align: 'left',
          },
          zIndex: 1,
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.nodeId === 'dark-section-title' && issue.rule === 'color-contrast')).toBe(false);
  });

  it('does not flag decorative progress bars as empty text', () => {
    const doc = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'progress',
          kind: 'container',
          rect: { x: 0, y: 0, width: 240, height: 32 },
          style: { backgroundColor: '#f8fafc' },
          content: { background: '#f8fafc', className: 'stat-progress' },
          zIndex: 0,
        },
        {
          id: 'progress-bar',
          kind: 'text',
          parentId: 'progress',
          rect: { x: 0, y: 0, width: 120, height: 32 },
          style: { backgroundColor: 'transparent' },
          content: {
            text: ' ',
            fontSize: 16,
            color: '#0f172a',
            fontWeight: 'regular',
            align: 'left',
            as: 'span',
          },
          zIndex: 1,
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.nodeId === 'progress-bar' && issue.rule === 'empty-text')).toBe(false);
  });

  it('treats semantic h1 text nodes as page headings', () => {
    const doc = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'hero-title',
          kind: 'text',
          rect: { x: 80, y: 120, width: 720, height: 120 },
          style: { backgroundColor: '#ffffff' },
          content: {
            text: 'Hero title',
            fontSize: 16,
            color: '#0f172a',
            fontWeight: 'bold',
            align: 'left',
            as: 'h1',
          },
          zIndex: 0,
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.rule === 'page-heading')).toBe(false);
  });

  it('treats responsive large text nodes as page headings', () => {
    const doc = {
      version: 1,
      locale: 'ko',
      updatedAt: '2026-06-02T00:00:00.000Z',
      updatedBy: 'test',
      stageWidth: 1280,
      stageHeight: 880,
      nodes: [
        {
          id: 'responsive-title',
          kind: 'text',
          rect: { x: 80, y: 120, width: 720, height: 120 },
          style: { backgroundColor: '#ffffff' },
          responsive: {
            mobile: { fontSize: 32 },
          },
          content: {
            text: 'Responsive title',
            fontSize: 16,
            color: '#0f172a',
            fontWeight: 'bold',
            align: 'left',
          },
          zIndex: 0,
        },
      ],
    } as unknown as BuilderCanvasDocument;

    const issues = checkAccessibility(doc, 'en');

    expect(issues.some((issue) => issue.rule === 'page-heading')).toBe(false);
  });
});
