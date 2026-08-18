import { describe, expect, it } from 'vitest';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasDocument,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';
import { DEFAULT_BUILDER_SITE_ID } from '@/lib/builder/constants';
import { runAllChecks } from '../gate-runner';
import { checkDisabledConsultationChannels } from '../consultation-channel-checks';

function documentWith(node: BuilderCanvasNode): BuilderCanvasDocument {
  return {
    version: 1,
    locale: 'ko',
    updatedAt: '2026-07-30T00:00:00.000Z',
    updatedBy: 'consultation-channel-gate-test',
    stageWidth: 1280,
    stageHeight: 720,
    nodes: [node],
  };
}

function textNode(text: string): BuilderCanvasNode {
  return {
    id: 'copy-node',
    kind: 'text',
    rect: { x: 0, y: 0, width: 640, height: 80 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: 20,
      color: '#111827',
      fontWeight: 'regular',
      align: 'left',
      lineHeight: 1.5,
      letterSpacing: 0,
    },
  };
}

function buttonNode(label: string, href: string): BuilderCanvasNode {
  return {
    id: 'button-node',
    kind: 'button',
    rect: { x: 0, y: 0, width: 320, height: 52 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 1,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      label,
      href,
      style: 'primary',
    },
  };
}

describe('disabled consultation channel publish gate', () => {
  it.each([
    '카카오톡으로 상담 문의하기',
    '라인 상담 연결',
    '使用 LINE 諮詢曾雋崴律師',
    'Contact Attorney Tseng via LINE',
    'KakaoTalk consultation',
  ])('blocks consultation copy in supported locales: %s', (copy) => {
    const results = checkDisabledConsultationChannels(
      documentWith(textNode(copy)),
      DEFAULT_BUILDER_SITE_ID,
    );
    expect(results).toEqual([
      expect.objectContaining({
        severity: 'blocker',
        affectedNodeIds: ['copy-node'],
      }),
    ]);
  });

  it.each([
    'https://line.me/R/ti/p/example',
    'https://page.line.me/example',
    'https://lin.ee/example',
    'https://pf.kakao.com/_example',
    'https://open.kakao.com/o/example',
    'https://talk.kakao.com/example',
    'https%253A%252F%252Fline.me%252FR%252Fti%252Fp%252Fexample',
  ])('blocks direct disabled-channel URLs, including encoded values: %s', (href) => {
    expect(checkDisabledConsultationChannels(
      documentWith(buttonNode('상담하기', href)),
      DEFAULT_BUILDER_SITE_ID,
    )).toHaveLength(1);
  });

  it.each([
    ['floating-chat', 'line'],
    ['floating-chat', 'kakao'],
    ['social-bar', 'line'],
    ['social-bar', 'kakao'],
  ] as const)('blocks %s provider %s', (kind, provider) => {
    const node = kind === 'floating-chat'
      ? {
        id: 'channel-widget',
        kind,
        rect: { x: 0, y: 0, width: 80, height: 80 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          provider,
          href: '',
          label: '문의하기',
          placement: 'bottom-right',
          showLabel: false,
          color: '#123b63',
        },
      } as BuilderCanvasNode
      : {
        id: 'channel-widget',
        kind,
        rect: { x: 0, y: 0, width: 240, height: 60 },
        style: createDefaultCanvasNodeStyle(),
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          items: [{ provider, href: 'https://example.com' }],
          layout: 'row',
          style: 'plain',
          size: 36,
          color: '#123b63',
        },
      } as BuilderCanvasNode;
    expect(checkDisabledConsultationChannels(
      documentWith(node),
      DEFAULT_BUILDER_SITE_ID,
    )).toHaveLength(1);
  });

  it('allows share providers and unrelated uses of the word line', () => {
    const shareButtons = {
      id: 'share-buttons',
      kind: 'share-buttons',
      rect: { x: 0, y: 0, width: 320, height: 60 },
      style: createDefaultCanvasNodeStyle(),
      zIndex: 1,
      rotation: 0,
      locked: false,
      visible: true,
      content: {
        providers: ['copy', 'kakao', 'line'],
        title: '공유하기',
        layout: 'row',
        size: 40,
      },
    } as BuilderCanvasNode;
    const safeCopy = [
      'Case timeline and outline',
      'Email subject line',
      'Email subject line: Contact Attorney Tseng',
      'Reference host: line.meevil.example',
      '이메일 상담: wei@hoveringlaw.com.tw',
      '사무실 전화: +886 2 1234 5678',
    ];

    expect(checkDisabledConsultationChannels(
      documentWith(shareButtons),
      DEFAULT_BUILDER_SITE_ID,
    )).toEqual([]);
    for (const copy of safeCopy) {
      expect(checkDisabledConsultationChannels(
        documentWith(textNode(copy)),
        DEFAULT_BUILDER_SITE_ID,
      )).toEqual([]);
    }
  });

  it('does not impose the law-firm channel policy on another site', () => {
    expect(checkDisabledConsultationChannels(
      documentWith(textNode('KakaoTalk consultation')),
      'customer-site',
    )).toEqual([]);
  });

  it('contributes a blocker to the shared publish suite', async () => {
    const suite = await runAllChecks(
      documentWith(textNode('LINE consultation')),
      null,
      null,
      DEFAULT_BUILDER_SITE_ID,
    );
    expect(suite.hasBlocker).toBe(true);
    expect(suite.results).toContainEqual(expect.objectContaining({
      id: 'disabled-consultation-channel-copy-node',
      severity: 'blocker',
    }));
  });
});
