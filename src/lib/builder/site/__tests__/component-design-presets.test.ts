import { describe, expect, it } from 'vitest';
import {
  applyComponentDesignPresetToNodes,
} from '@/lib/builder/site/component-design-presets';
import {
  createDefaultCanvasNodeStyle,
  type BuilderCanvasNode,
} from '@/lib/builder/canvas/types';

const baseNode = {
  rect: { x: 0, y: 0, width: 100, height: 40 },
  style: createDefaultCanvasNodeStyle(),
  zIndex: 0,
  rotation: 0,
  locked: false,
  visible: true,
};

describe('component design presets', () => {
  it('bulk patches button, card, form field, and submit variants without replacing other content', () => {
    const nodes = [
      {
        ...baseNode,
        id: 'button-a',
        kind: 'button',
        content: { label: 'CTA', style: 'primary-solid', href: '/ko/contact' },
      },
      {
        ...baseNode,
        id: 'card-a',
        kind: 'container',
        content: { label: 'Card', variant: 'flat', padding: 18 },
      },
      {
        ...baseNode,
        id: 'field-a',
        kind: 'form-input',
        content: { name: 'email', label: 'Email', type: 'email', variant: 'default' },
      },
      {
        ...baseNode,
        id: 'submit-a',
        kind: 'form-submit',
        content: { label: 'Submit', style: 'primary', fullWidth: true },
      },
    ] as BuilderCanvasNode[];

    const result = applyComponentDesignPresetToNodes(nodes, 'editorial');
    const byId = new Map(result.nodes.map((node) => [node.id, node]));

    expect(result.changedNodeIds).toEqual(['button-a', 'card-a', 'field-a', 'submit-a']);
    expect(result.counts).toEqual({ buttons: 1, cards: 1, formFields: 1, formSubmits: 1 });
    expect(byId.get('button-a')?.content).toMatchObject({ label: 'CTA', href: '/ko/contact', style: 'primary-link' });
    expect(byId.get('card-a')?.content).toMatchObject({ label: 'Card', padding: 18, variant: 'editorial' });
    expect(byId.get('field-a')?.content).toMatchObject({ name: 'email', variant: 'underline' });
    expect(byId.get('submit-a')?.content).toMatchObject({ label: 'Submit', fullWidth: true, style: 'outline' });
  });
});
