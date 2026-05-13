import { describe, expect, it } from 'vitest';
import {
  resolveBuilderCanvasRepeaterQuickEdit,
} from '@/lib/builder/canvas/repeater-quick-edit';
import { createDefaultCanvasNodeStyle, type BuilderCanvasNode } from '@/lib/builder/canvas/types';

function textNode(id: string, text: string): BuilderCanvasNode {
  return {
    id,
    kind: 'text',
    rect: { x: 0, y: 0, width: 100, height: 24 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      text,
      fontSize: 16,
      color: '#111827',
      fontWeight: 'regular',
      align: 'left',
      as: 'p',
      lineHeight: 1.4,
      letterSpacing: 0,
    },
  };
}

function imageNode(id: string, alt: string): BuilderCanvasNode {
  return {
    id,
    kind: 'image',
    rect: { x: 0, y: 0, width: 32, height: 32 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
    rotation: 0,
    locked: false,
    visible: true,
    content: {
      src: '/icon.svg',
      alt,
      fit: 'cover',
    },
  };
}

function buttonNode(id: string, label: string, href: string): BuilderCanvasNode {
  return {
    id,
    kind: 'button',
    rect: { x: 0, y: 0, width: 120, height: 36 },
    style: createDefaultCanvasNodeStyle(),
    zIndex: 0,
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

describe('builder canvas repeater quick edit', () => {
  it('resolves service card title, description, icon and link from a selected child', () => {
    const quickEdit = resolveBuilderCanvasRepeaterQuickEdit(
      [
        textNode('home-services-card-1-title', '민사소송'),
        textNode('home-services-card-1-description', '손해배상과 계약 분쟁'),
        imageNode('home-services-card-1-icon-svg', '민사소송'),
        buttonNode('home-services-card-1-more', '자세히 보기', '/ko/services/civil'),
      ],
      'home-services-card-1-description'
    );

    expect(quickEdit).toMatchObject({
      kind: 'service',
      index: 1,
      rootNodeId: 'home-services-card-1',
      titleNodeId: 'home-services-card-1-title',
      descriptionNodeId: 'home-services-card-1-description',
      iconNodeId: 'home-services-card-1-icon-svg',
      linkNodeId: 'home-services-card-1-more',
      title: '민사소송',
      description: '손해배상과 계약 분쟁',
      href: '/ko/services/civil',
    });
  });

  it('resolves FAQ question and answer from a selected child', () => {
    const quickEdit = resolveBuilderCanvasRepeaterQuickEdit(
      [
        textNode('home-faq-item-2-question-text', '상담은 어떻게 예약하나요?'),
        textNode('home-faq-item-2-answer', '문의 양식을 보내주세요.'),
      ],
      'home-faq-item-2-answer'
    );

    expect(quickEdit).toMatchObject({
      kind: 'faq',
      index: 2,
      rootNodeId: 'home-faq-item-2',
      questionNodeId: 'home-faq-item-2-question-text',
      answerNodeId: 'home-faq-item-2-answer',
      question: '상담은 어떻게 예약하나요?',
      answer: '문의 양식을 보내주세요.',
    });
  });

  it('ignores non-repeater selections', () => {
    expect(resolveBuilderCanvasRepeaterQuickEdit([textNode('hero-title', 'Hero')], 'hero-title')).toBeNull();
  });
});
