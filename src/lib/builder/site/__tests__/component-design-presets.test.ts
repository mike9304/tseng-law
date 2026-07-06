import { describe, expect, it } from 'vitest';
import {
  COMPONENT_DESIGN_PRESETS,
  applyComponentDesignPresetToNodes,
  getComponentDesignPreset,
  summarizeComponentDesignTargets,
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

  it('includes a studio designer system for high-end page polish', () => {
    const studio = getComponentDesignPreset('studio');
    expect(COMPONENT_DESIGN_PRESETS.map((preset) => preset.key)).toContain('studio');
    expect(studio).toMatchObject({
      buttonVariant: 'cta-arrow',
      cardVariant: 'spotlight',
      formInputVariant: 'filled',
      formSubmitVariant: 'primary',
      designerFinish: 'studio spotlight',
      designerRhythm: 'hero-card-cta',
      designerAccent: 'arrow CTA',
    });

    const result = applyComponentDesignPresetToNodes([
      {
        ...baseNode,
        id: 'button-studio',
        kind: 'button',
        content: { label: 'CTA', style: 'primary-solid' },
      },
      {
        ...baseNode,
        id: 'card-studio',
        kind: 'container',
        content: { label: 'Card', variant: 'flat' },
      },
      {
        ...baseNode,
        id: 'field-studio',
        kind: 'form-input',
        content: { name: 'email', variant: 'default' },
      },
    ] as BuilderCanvasNode[], 'studio');

    const byId = new Map(result.nodes.map((node) => [node.id, node]));
    expect(byId.get('button-studio')?.content).toMatchObject({ style: 'cta-arrow' });
    expect(byId.get('card-studio')?.content).toMatchObject({ variant: 'spotlight' });
    expect(byId.get('field-studio')?.content).toMatchObject({ variant: 'filled' });
  });

  it('summarizes component targets and recommends a designer system', () => {
    const summary = summarizeComponentDesignTargets([
      {
        ...baseNode,
        id: 'button-audit',
        kind: 'button',
        content: { label: 'CTA' },
      },
      {
        ...baseNode,
        id: 'card-audit',
        kind: 'container',
        content: { label: 'Card' },
      },
      {
        ...baseNode,
        id: 'submit-audit',
        kind: 'form-submit',
        content: { label: 'Submit', style: 'primary' },
      },
    ] as BuilderCanvasNode[]);

    expect(summary).toMatchObject({
      buttons: 1,
      cards: 1,
      formFields: 0,
      formSubmits: 1,
      total: 3,
      recommendedPresetKey: 'studio',
      recommendedMatchedCount: 1,
      recommendedChangeCount: 2,
      recommendedChangePreviewPayload: 'studio:3:1:2',
      recommendedChangeBreakdownPayload: 'buttons=1;cards=1;fields=0;submits=0',
      recommendedQualityScore: 33,
      recommendedQualityState: 'partial',
      recommendedQualityPayload: 'studio:33:partial',
      recommendedQualitySignals: ['preset:studio', 'change:button:1', 'change:card:1', 'matched:submit:1'],
      recommendedQualitySignalPayload: 'preset:studio|change:button:1|change:card:1|matched:submit:1',
      presetQualityComparisonPayload: 'classic:33:1:2:partial|soft:0:0:3:needs-apply|editorial:0:0:3:needs-apply|conversion:33:1:2:partial|studio:33:1:2:partial',
      currentFitLeaderPresetKey: 'studio',
      currentFitLeaderScore: 33,
      currentFitLeaderChangeCount: 2,
      currentFitLeaderPayload: 'studio:33:1:2:partial',
      recommendedIsCurrentFitLeader: true,
      recommendedChangeDeltaFromLeader: 0,
      recommendationDecisionPayload: 'studio:studio:2:2:0',
      recommendedMatchedNodeIds: ['submit-audit'],
      recommendedChangeNodeIds: ['button-audit', 'card-audit'],
      recommendedMatchedNodeIdPayload: 'submit-audit',
      recommendedChangeNodeIdPayload: 'button-audit,card-audit',
      recommendedChangeDetailPayload: 'button-audit:button:style:unset>cta-arrow|card-audit:card:variant:unset>spotlight',
      recommendedPriorityPayload: '1:card-audit:card:spotlight|2:button-audit:button:cta-arrow',
      recommendedChangeDetails: [
        {
          nodeId: 'button-audit',
          category: 'button',
          property: 'style',
          currentValue: 'unset',
          nextValue: 'cta-arrow',
        },
        {
          nodeId: 'card-audit',
          category: 'card',
          property: 'variant',
          currentValue: 'unset',
          nextValue: 'spotlight',
        },
      ],
      recommendedPriorityItems: [
        {
          nodeId: 'card-audit',
          category: 'card',
          property: 'variant',
          currentValue: 'unset',
          nextValue: 'spotlight',
          priority: 1,
          reason: 'Set visual hierarchy first',
        },
        {
          nodeId: 'button-audit',
          category: 'button',
          property: 'style',
          currentValue: 'unset',
          nextValue: 'cta-arrow',
          priority: 2,
          reason: 'Align CTA rhythm next',
        },
      ],
      recommendedMatchedCounts: {
        buttons: 0,
        cards: 0,
        formFields: 0,
        formSubmits: 1,
      },
      recommendedChangeCounts: {
        buttons: 1,
        cards: 1,
        formFields: 0,
        formSubmits: 0,
      },
    });
    expect(summary.recommendation).toContain('Studio system');

    const syncedSummary = summarizeComponentDesignTargets([
      {
        ...baseNode,
        id: 'button-synced',
        kind: 'button',
        content: { label: 'CTA', style: 'cta-arrow' },
      },
      {
        ...baseNode,
        id: 'card-synced',
        kind: 'container',
        content: { label: 'Card', variant: 'spotlight' },
      },
      {
        ...baseNode,
        id: 'field-synced',
        kind: 'form-input',
        content: { name: 'email', variant: 'filled' },
      },
      {
        ...baseNode,
        id: 'submit-synced',
        kind: 'form-submit',
        content: { label: 'Submit', style: 'primary' },
      },
    ] as BuilderCanvasNode[]);

    expect(syncedSummary).toMatchObject({
      total: 4,
      recommendedPresetKey: 'studio',
      recommendedMatchedCount: 4,
      recommendedChangeCount: 0,
      recommendedChangePreviewPayload: 'studio:4:4:0',
      recommendedChangeBreakdownPayload: 'buttons=0;cards=0;fields=0;submits=0',
      recommendedQualityScore: 100,
      recommendedQualityState: 'synced',
      recommendedQualityPayload: 'studio:100:synced',
      recommendedQualitySignals: ['preset:studio', 'all-components-match'],
      recommendedQualitySignalPayload: 'preset:studio|all-components-match',
      presetQualityComparisonPayload: 'classic:25:1:3:partial|soft:25:1:3:partial|editorial:0:0:4:needs-apply|conversion:50:2:2:partial|studio:100:4:0:synced',
      currentFitLeaderPresetKey: 'studio',
      currentFitLeaderScore: 100,
      currentFitLeaderChangeCount: 0,
      currentFitLeaderPayload: 'studio:100:4:0:synced',
      recommendedIsCurrentFitLeader: true,
      recommendedChangeDeltaFromLeader: 0,
      recommendationDecisionPayload: 'studio:studio:0:0:0',
      recommendedMatchedNodeIds: ['button-synced', 'card-synced', 'field-synced', 'submit-synced'],
      recommendedChangeNodeIds: [],
      recommendedMatchedNodeIdPayload: 'button-synced,card-synced,field-synced,submit-synced',
      recommendedChangeNodeIdPayload: '',
      recommendedChangeDetailPayload: '',
      recommendedPriorityPayload: '',
      recommendedChangeDetails: [],
      recommendedPriorityItems: [],
      recommendedMatchedCounts: {
        buttons: 1,
        cards: 1,
        formFields: 1,
        formSubmits: 1,
      },
      recommendedChangeCounts: {
        buttons: 0,
        cards: 0,
        formFields: 0,
        formSubmits: 0,
      },
    });
  });

  it('keeps recommendations sensible for empty and form-only target sets', () => {
    const emptySummary = summarizeComponentDesignTargets([]);
    expect(emptySummary).toMatchObject({
      total: 0,
      recommendedPresetKey: 'classic',
      recommendedMatchedCount: 0,
      recommendedChangeCount: 0,
      recommendedChangePreviewPayload: 'classic:0:0:0',
      recommendedChangeBreakdownPayload: 'buttons=0;cards=0;fields=0;submits=0',
      recommendedQualityScore: 0,
      recommendedQualityState: 'empty',
      recommendedQualityPayload: 'classic:0:empty',
      recommendedQualitySignals: ['no-targets'],
      recommendedQualitySignalPayload: 'no-targets',
      presetQualityComparisonPayload: 'classic:0:0:0:empty|soft:0:0:0:empty|editorial:0:0:0:empty|conversion:0:0:0:empty|studio:0:0:0:empty',
      currentFitLeaderPresetKey: 'classic',
      currentFitLeaderScore: 0,
      currentFitLeaderChangeCount: 0,
      currentFitLeaderPayload: 'classic:0:0:0:empty',
      recommendedIsCurrentFitLeader: true,
      recommendedChangeDeltaFromLeader: 0,
      recommendationDecisionPayload: 'classic:classic:0:0:0',
      recommendedChangeNodeIdPayload: '',
      recommendedChangeDetailPayload: '',
    });

    const formOnlySummary = summarizeComponentDesignTargets([
      {
        ...baseNode,
        id: 'field-form-only',
        kind: 'form-input',
        content: { name: 'email', variant: 'default' },
      },
      {
        ...baseNode,
        id: 'submit-form-only',
        kind: 'form-submit',
        content: { label: 'Submit', style: 'ghost' },
      },
    ] as BuilderCanvasNode[]);

    expect(formOnlySummary).toMatchObject({
      total: 2,
      recommendedPresetKey: 'conversion',
      recommendedMatchedCount: 0,
      recommendedChangeCount: 2,
      recommendedChangePreviewPayload: 'conversion:2:0:2',
      recommendedChangeBreakdownPayload: 'buttons=0;cards=0;fields=1;submits=1',
      recommendedQualityScore: 0,
      recommendedQualityState: 'needs-apply',
      recommendedQualityPayload: 'conversion:0:needs-apply',
      recommendedQualitySignals: ['preset:conversion', 'change:field:1', 'change:submit:1'],
      recommendedQualitySignalPayload: 'preset:conversion|change:field:1|change:submit:1',
      presetQualityComparisonPayload: 'classic:50:1:1:partial|soft:0:0:2:needs-apply|editorial:0:0:2:needs-apply|conversion:0:0:2:needs-apply|studio:0:0:2:needs-apply',
      currentFitLeaderPresetKey: 'classic',
      currentFitLeaderScore: 50,
      currentFitLeaderChangeCount: 1,
      currentFitLeaderPayload: 'classic:50:1:1:partial',
      recommendedIsCurrentFitLeader: false,
      recommendedChangeDeltaFromLeader: 1,
      recommendationDecisionPayload: 'conversion:classic:2:1:1',
      recommendedChangeNodeIdPayload: 'field-form-only,submit-form-only',
      recommendedChangeDetailPayload: 'field-form-only:field:variant:default>filled|submit-form-only:submit:style:ghost>primary',
    });
  });
});
