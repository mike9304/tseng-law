import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type {
  ButtonVariantKey,
  CardVariantKey,
  FormInputVariantKey,
} from '@/lib/builder/site/component-variants';

export type FormSubmitVariantKey = 'primary' | 'secondary' | 'outline' | 'ghost';

export type ComponentDesignPresetKey = 'classic' | 'soft' | 'editorial' | 'conversion' | 'studio';

export interface ComponentDesignPreset {
  key: ComponentDesignPresetKey;
  label: string;
  description: string;
  buttonVariant: ButtonVariantKey;
  cardVariant: CardVariantKey;
  formInputVariant: FormInputVariantKey;
  formSubmitVariant: FormSubmitVariantKey;
  designerFinish: string;
  designerRhythm: string;
  designerAccent: string;
}

export interface ComponentDesignPresetPatchResult {
  nodes: BuilderCanvasNode[];
  changedNodeIds: string[];
  counts: ComponentDesignTargetCounts;
}

interface ComponentDesignTargetCounts {
  buttons: number;
  cards: number;
  formFields: number;
  formSubmits: number;
}

export interface ComponentDesignChangeDetail {
  nodeId: string;
  category: 'button' | 'card' | 'field' | 'submit';
  property: 'style' | 'variant';
  currentValue: string;
  nextValue: string;
}

export interface ComponentDesignPriorityItem extends ComponentDesignChangeDetail {
  priority: number;
  reason: string;
}

export type ComponentDesignQualityState = 'empty' | 'needs-apply' | 'partial' | 'synced';

export interface ComponentDesignPresetQualityComparison {
  presetKey: ComponentDesignPresetKey;
  score: number;
  matchedCount: number;
  changeCount: number;
  state: ComponentDesignQualityState;
}

export interface ComponentDesignTargetSummary extends ComponentDesignTargetCounts {
  total: number;
  recommendedPresetKey: ComponentDesignPresetKey;
  recommendedMatchedCounts: ComponentDesignTargetCounts;
  recommendedChangeCounts: ComponentDesignTargetCounts;
  recommendedMatchedNodeIds: string[];
  recommendedChangeNodeIds: string[];
  recommendedChangeDetails: ComponentDesignChangeDetail[];
  recommendedPriorityItems: ComponentDesignPriorityItem[];
  recommendedMatchedCount: number;
  recommendedChangeCount: number;
  recommendedMatchedNodeIdPayload: string;
  recommendedChangeNodeIdPayload: string;
  recommendedChangeDetailPayload: string;
  recommendedPriorityPayload: string;
  recommendedChangePreviewPayload: string;
  recommendedChangeBreakdownPayload: string;
  recommendedQualityScore: number;
  recommendedQualityState: ComponentDesignQualityState;
  recommendedQualityPayload: string;
  recommendedQualitySignals: string[];
  recommendedQualitySignalPayload: string;
  presetQualityComparisons: ComponentDesignPresetQualityComparison[];
  presetQualityComparisonPayload: string;
  currentFitLeaderPresetKey: ComponentDesignPresetKey;
  currentFitLeaderScore: number;
  currentFitLeaderChangeCount: number;
  currentFitLeaderPayload: string;
  recommendedIsCurrentFitLeader: boolean;
  recommendedChangeDeltaFromLeader: number;
  recommendationDecisionPayload: string;
  recommendation: string;
}

export const COMPONENT_DESIGN_PRESETS: readonly ComponentDesignPreset[] = [
  {
    key: 'classic',
    label: 'Classic system',
    description: 'Bordered cards, solid buttons, and classic form fields.',
    buttonVariant: 'primary-solid',
    cardVariant: 'flat',
    formInputVariant: 'default',
    formSubmitVariant: 'primary',
    designerFinish: 'clean baseline',
    designerRhythm: 'structured rows',
    designerAccent: 'solid primary CTA',
  },
  {
    key: 'soft',
    label: 'Soft system',
    description: 'Muted cards, soft fields, and quieter secondary actions.',
    buttonVariant: 'primary-ghost',
    cardVariant: 'soft',
    formInputVariant: 'filled',
    formSubmitVariant: 'secondary',
    designerFinish: 'calm service',
    designerRhythm: 'soft grouped panels',
    designerAccent: 'low-pressure CTA',
  },
  {
    key: 'editorial',
    label: 'Editorial system',
    description: 'Thin framed cards, underline fields, and text-led actions.',
    buttonVariant: 'primary-link',
    cardVariant: 'editorial',
    formInputVariant: 'underline',
    formSubmitVariant: 'outline',
    designerFinish: 'magazine trust',
    designerRhythm: 'thin-rule hierarchy',
    designerAccent: 'text-led CTA',
  },
  {
    key: 'conversion',
    label: 'Conversion system',
    description: 'Elevated cards, CTA buttons, and full-form emphasis.',
    buttonVariant: 'cta-shadow',
    cardVariant: 'floating',
    formInputVariant: 'filled',
    formSubmitVariant: 'primary',
    designerFinish: 'high-conversion',
    designerRhythm: 'featured CTA stack',
    designerAccent: 'shadow CTA',
  },
  {
    key: 'studio',
    label: 'Studio system',
    description: 'Spotlight cards, arrow CTAs, and branded form rhythm for high-end pages.',
    buttonVariant: 'cta-arrow',
    cardVariant: 'spotlight',
    formInputVariant: 'filled',
    formSubmitVariant: 'primary',
    designerFinish: 'studio spotlight',
    designerRhythm: 'hero-card-cta',
    designerAccent: 'arrow CTA',
  },
] as const;

const CARD_NODE_KINDS = new Set<BuilderCanvasNode['kind']>([
  'container',
  'attorneyCard',
  'blog-post-card',
  'columnCard',
]);

const FORM_FIELD_NODE_KINDS = new Set<BuilderCanvasNode['kind']>([
  'form-input',
  'form-textarea',
  'form-select',
  'form-file',
  'form-date',
]);

export function getComponentDesignPreset(key: unknown): ComponentDesignPreset {
  return COMPONENT_DESIGN_PRESETS.find((preset) => preset.key === key) ?? COMPONENT_DESIGN_PRESETS[0];
}

function createEmptyComponentDesignTargetCounts(): ComponentDesignTargetCounts {
  return {
    buttons: 0,
    cards: 0,
    formFields: 0,
    formSubmits: 0,
  };
}

function sumComponentDesignTargetCounts(counts: ComponentDesignTargetCounts): number {
  return counts.buttons + counts.cards + counts.formFields + counts.formSubmits;
}

function serializeComponentDesignTargetCounts(counts: ComponentDesignTargetCounts): string {
  return [
    `buttons=${counts.buttons}`,
    `cards=${counts.cards}`,
    `fields=${counts.formFields}`,
    `submits=${counts.formSubmits}`,
  ].join(';');
}

function serializeComponentDesignChangeDetails(details: readonly ComponentDesignChangeDetail[]): string {
  return details.map((detail) => (
    `${detail.nodeId}:${detail.category}:${detail.property}:${detail.currentValue}>${detail.nextValue}`
  )).join('|');
}

const COMPONENT_DESIGN_PRIORITY_ORDER: Record<ComponentDesignChangeDetail['category'], number> = {
  card: 1,
  button: 2,
  field: 3,
  submit: 4,
};

const COMPONENT_DESIGN_PRIORITY_REASON: Record<ComponentDesignChangeDetail['category'], string> = {
  card: 'Set visual hierarchy first',
  button: 'Align CTA rhythm next',
  field: 'Match field finish after layout',
  submit: 'Keep submit action consistent',
};

function createComponentDesignPriorityItems(
  details: readonly ComponentDesignChangeDetail[],
): ComponentDesignPriorityItem[] {
  return [...details]
    .sort((left, right) => {
      const categoryDelta = COMPONENT_DESIGN_PRIORITY_ORDER[left.category] - COMPONENT_DESIGN_PRIORITY_ORDER[right.category];
      if (categoryDelta !== 0) return categoryDelta;
      return left.nodeId.localeCompare(right.nodeId);
    })
    .map((detail, index) => ({
      ...detail,
      priority: index + 1,
      reason: COMPONENT_DESIGN_PRIORITY_REASON[detail.category],
    }));
}

function serializeComponentDesignPriorityItems(items: readonly ComponentDesignPriorityItem[]): string {
  return items.map((item) => (
    `${item.priority}:${item.nodeId}:${item.category}:${item.nextValue}`
  )).join('|');
}

function pushCountSignal(
  signals: string[],
  prefix: string,
  counts: ComponentDesignTargetCounts,
): void {
  if (counts.buttons > 0) signals.push(`${prefix}:button:${counts.buttons}`);
  if (counts.cards > 0) signals.push(`${prefix}:card:${counts.cards}`);
  if (counts.formFields > 0) signals.push(`${prefix}:field:${counts.formFields}`);
  if (counts.formSubmits > 0) signals.push(`${prefix}:submit:${counts.formSubmits}`);
}

function getComponentDesignQualityState(
  total: number,
  matchedCount: number,
  changeCount: number,
): ComponentDesignQualityState {
  if (total === 0) return 'empty';
  if (changeCount === 0) return 'synced';
  if (matchedCount > 0) return 'partial';
  return 'needs-apply';
}

function createComponentDesignQualitySignals(
  presetKey: ComponentDesignPresetKey,
  state: ComponentDesignQualityState,
  matchedCounts: ComponentDesignTargetCounts,
  changeCounts: ComponentDesignTargetCounts,
): string[] {
  if (state === 'empty') return ['no-targets'];
  if (state === 'synced') return [`preset:${presetKey}`, 'all-components-match'];
  const signals = [`preset:${presetKey}`];
  pushCountSignal(signals, 'change', changeCounts);
  pushCountSignal(signals, 'matched', matchedCounts);
  return signals;
}

function getComponentDesignPresetQualityComparison(
  total: number,
  presetKey: ComponentDesignPresetKey,
  audit: ComponentDesignPresetTargetAudit,
): ComponentDesignPresetQualityComparison {
  const matchedCount = sumComponentDesignTargetCounts(audit.matchedCounts);
  const changeCount = sumComponentDesignTargetCounts(audit.changeCounts);
  return {
    presetKey,
    score: total === 0 ? 0 : Math.round((matchedCount / total) * 100),
    matchedCount,
    changeCount,
    state: getComponentDesignQualityState(total, matchedCount, changeCount),
  };
}

function serializeComponentDesignPresetQualityComparisons(
  comparisons: readonly ComponentDesignPresetQualityComparison[],
): string {
  return comparisons.map((comparison) => (
    [
      comparison.presetKey,
      comparison.score,
      comparison.matchedCount,
      comparison.changeCount,
      comparison.state,
    ].join(':')
  )).join('|');
}

function serializeComponentDesignPresetQualityComparison(
  comparison: ComponentDesignPresetQualityComparison,
): string {
  return [
    comparison.presetKey,
    comparison.score,
    comparison.matchedCount,
    comparison.changeCount,
    comparison.state,
  ].join(':');
}

function findCurrentFitLeaderComparison(
  comparisons: readonly ComponentDesignPresetQualityComparison[],
  recommendedPresetKey: ComponentDesignPresetKey,
): ComponentDesignPresetQualityComparison {
  return comparisons.reduce<ComponentDesignPresetQualityComparison>((leader, comparison) => {
    if (comparison.score > leader.score) return comparison;
    if (comparison.score < leader.score) return leader;
    if (comparison.changeCount < leader.changeCount) return comparison;
    if (comparison.changeCount > leader.changeCount) return leader;
    if (comparison.presetKey === recommendedPresetKey) return comparison;
    return leader;
  }, comparisons[0] ?? {
    presetKey: recommendedPresetKey,
    score: 0,
    matchedCount: 0,
    changeCount: 0,
    state: 'empty',
  });
}

function countComponentDesignTarget(
  counts: ComponentDesignTargetCounts,
  node: BuilderCanvasNode,
): void {
  if (node.kind === 'button') {
    counts.buttons += 1;
    return;
  }
  if (node.kind === 'form-submit') {
    counts.formSubmits += 1;
    return;
  }
  if (FORM_FIELD_NODE_KINDS.has(node.kind)) {
    counts.formFields += 1;
    return;
  }
  if (CARD_NODE_KINDS.has(node.kind)) {
    counts.cards += 1;
  }
}

function getComponentDesignTargetCategory(
  node: BuilderCanvasNode,
): ComponentDesignChangeDetail['category'] | null {
  if (node.kind === 'button') return 'button';
  if (node.kind === 'form-submit') return 'submit';
  if (FORM_FIELD_NODE_KINDS.has(node.kind)) return 'field';
  if (CARD_NODE_KINDS.has(node.kind)) return 'card';
  return null;
}

function getComponentDesignPatchForNode(
  node: BuilderCanvasNode,
  preset: ComponentDesignPreset,
): Record<string, unknown> | null {
  if (node.kind === 'button') return { style: preset.buttonVariant };
  if (node.kind === 'form-submit') return { style: preset.formSubmitVariant };
  if (FORM_FIELD_NODE_KINDS.has(node.kind)) return { variant: preset.formInputVariant };
  if (CARD_NODE_KINDS.has(node.kind)) return { variant: preset.cardVariant };
  return null;
}

function hasSameContentValues(node: BuilderCanvasNode, values: Record<string, unknown>): boolean {
  return Object.entries(values).every(([key, value]) => (
    (node.content as Record<string, unknown>)[key] === value
  ));
}

interface ComponentDesignPresetTargetAudit {
  matchedCounts: ComponentDesignTargetCounts;
  changeCounts: ComponentDesignTargetCounts;
  matchedNodeIds: string[];
  changeNodeIds: string[];
  changeDetails: ComponentDesignChangeDetail[];
}

function collectPresetTargetAudit(
  nodes: readonly BuilderCanvasNode[],
  preset: ComponentDesignPreset,
): ComponentDesignPresetTargetAudit {
  return nodes.reduce<ComponentDesignPresetTargetAudit>((audit, node) => {
    const patch = getComponentDesignPatchForNode(node, preset);
    if (!patch) return audit;
    if (hasSameContentValues(node, patch)) {
      countComponentDesignTarget(audit.matchedCounts, node);
      audit.matchedNodeIds.push(node.id);
      return audit;
    }
    countComponentDesignTarget(audit.changeCounts, node);
    audit.changeNodeIds.push(node.id);
    const category = getComponentDesignTargetCategory(node);
    const [property, nextValue] = Object.entries(patch)[0] ?? [];
    if (category && (property === 'style' || property === 'variant')) {
      const currentValue = (node.content as Record<string, unknown>)[property];
      audit.changeDetails.push({
        nodeId: node.id,
        category,
        property,
        currentValue: currentValue == null ? 'unset' : String(currentValue),
        nextValue: nextValue == null ? 'unset' : String(nextValue),
      });
    }
    return audit;
  }, {
    matchedCounts: createEmptyComponentDesignTargetCounts(),
    changeCounts: createEmptyComponentDesignTargetCounts(),
    matchedNodeIds: [],
    changeNodeIds: [],
    changeDetails: [],
  });
}

export function summarizeComponentDesignTargets(
  nodes: readonly BuilderCanvasNode[],
): ComponentDesignTargetSummary {
  const counts = createEmptyComponentDesignTargetCounts();
  nodes.forEach((node) => countComponentDesignTarget(counts, node));
  const total = sumComponentDesignTargetCounts(counts);
  const recommendedPresetKey: ComponentDesignPresetKey =
    counts.buttons > 0 && counts.cards > 0
      ? 'studio'
      : counts.formFields > 0 || counts.formSubmits > 0
        ? 'conversion'
        : counts.cards > 0
          ? 'editorial'
          : 'classic';
  const recommendedPreset = getComponentDesignPreset(recommendedPresetKey);
  const targetAudit = collectPresetTargetAudit(nodes, recommendedPreset);
  const recommendedMatchedCounts = targetAudit.matchedCounts;
  const recommendedMatchedCount = sumComponentDesignTargetCounts(recommendedMatchedCounts);
  const recommendedChangeCounts = targetAudit.changeCounts;
  const recommendedChangeCount = sumComponentDesignTargetCounts(recommendedChangeCounts);
  const recommendedQualityScore = total === 0
    ? 0
    : Math.round((recommendedMatchedCount / total) * 100);
  const recommendedQualityState = getComponentDesignQualityState(
    total,
    recommendedMatchedCount,
    recommendedChangeCount,
  );
  const recommendedQualitySignals = createComponentDesignQualitySignals(
    recommendedPresetKey,
    recommendedQualityState,
    recommendedMatchedCounts,
    recommendedChangeCounts,
  );
  const recommendedPriorityItems = createComponentDesignPriorityItems(targetAudit.changeDetails);
  const presetQualityComparisons = COMPONENT_DESIGN_PRESETS.map((preset) => (
    preset.key === recommendedPresetKey
      ? getComponentDesignPresetQualityComparison(total, preset.key, targetAudit)
      : getComponentDesignPresetQualityComparison(
        total,
        preset.key,
        collectPresetTargetAudit(nodes, preset),
      )
  ));
  const currentFitLeader = findCurrentFitLeaderComparison(
    presetQualityComparisons,
    recommendedPresetKey,
  );
  const recommendation =
    recommendedPresetKey === 'studio'
      ? 'Use Studio system to align hero cards, CTA rhythm, and form finish.'
      : recommendedPresetKey === 'conversion'
        ? 'Use Conversion system to tighten forms and CTA emphasis.'
        : recommendedPresetKey === 'editorial'
          ? 'Use Editorial system for text-led card rhythm.'
          : 'Use Classic system as a clean baseline.';

  return {
    ...counts,
    total,
    recommendedPresetKey,
    recommendedMatchedCounts,
    recommendedChangeCounts,
    recommendedMatchedNodeIds: targetAudit.matchedNodeIds,
    recommendedChangeNodeIds: targetAudit.changeNodeIds,
    recommendedChangeDetails: targetAudit.changeDetails,
    recommendedPriorityItems,
    recommendedMatchedCount,
    recommendedChangeCount,
    recommendedMatchedNodeIdPayload: targetAudit.matchedNodeIds.join(','),
    recommendedChangeNodeIdPayload: targetAudit.changeNodeIds.join(','),
    recommendedChangeDetailPayload: serializeComponentDesignChangeDetails(targetAudit.changeDetails),
    recommendedPriorityPayload: serializeComponentDesignPriorityItems(recommendedPriorityItems),
    recommendedChangePreviewPayload: [
      recommendedPresetKey,
      total,
      recommendedMatchedCount,
      recommendedChangeCount,
    ].join(':'),
    recommendedChangeBreakdownPayload: serializeComponentDesignTargetCounts(recommendedChangeCounts),
    recommendedQualityScore,
    recommendedQualityState,
    recommendedQualityPayload: [
      recommendedPresetKey,
      recommendedQualityScore,
      recommendedQualityState,
    ].join(':'),
    recommendedQualitySignals,
    recommendedQualitySignalPayload: recommendedQualitySignals.join('|'),
    presetQualityComparisons,
    presetQualityComparisonPayload: serializeComponentDesignPresetQualityComparisons(presetQualityComparisons),
    currentFitLeaderPresetKey: currentFitLeader.presetKey,
    currentFitLeaderScore: currentFitLeader.score,
    currentFitLeaderChangeCount: currentFitLeader.changeCount,
    currentFitLeaderPayload: serializeComponentDesignPresetQualityComparison(currentFitLeader),
    recommendedIsCurrentFitLeader: currentFitLeader.presetKey === recommendedPresetKey,
    recommendedChangeDeltaFromLeader: recommendedChangeCount - currentFitLeader.changeCount,
    recommendationDecisionPayload: [
      recommendedPresetKey,
      currentFitLeader.presetKey,
      recommendedChangeCount,
      currentFitLeader.changeCount,
      recommendedChangeCount - currentFitLeader.changeCount,
    ].join(':'),
    recommendation,
  };
}

function patchNodeContent(
  node: BuilderCanvasNode,
  contentPatch: Record<string, unknown>,
): BuilderCanvasNode {
  return {
    ...node,
    content: {
      ...node.content,
      ...contentPatch,
    },
  } as BuilderCanvasNode;
}

export function applyComponentDesignPresetToNodes(
  nodes: readonly BuilderCanvasNode[],
  presetKey: ComponentDesignPresetKey | string,
): ComponentDesignPresetPatchResult {
  const preset = getComponentDesignPreset(presetKey);
  const changedNodeIds: string[] = [];
  const counts = createEmptyComponentDesignTargetCounts();

  const nextNodes = nodes.map((node) => {
    const patch = getComponentDesignPatchForNode(node, preset);
    if (!patch || hasSameContentValues(node, patch)) return node;
    changedNodeIds.push(node.id);
    countComponentDesignTarget(counts, node);
    return patchNodeContent(node, patch);
  });

  return {
    nodes: nextNodes,
    changedNodeIds,
    counts,
  };
}
