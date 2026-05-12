import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';
import type {
  ButtonVariantKey,
  CardVariantKey,
  FormInputVariantKey,
} from '@/lib/builder/site/component-variants';

export type FormSubmitVariantKey = 'primary' | 'secondary' | 'outline' | 'ghost';

export type ComponentDesignPresetKey = 'classic' | 'soft' | 'editorial' | 'conversion';

export interface ComponentDesignPreset {
  key: ComponentDesignPresetKey;
  label: string;
  description: string;
  buttonVariant: ButtonVariantKey;
  cardVariant: CardVariantKey;
  formInputVariant: FormInputVariantKey;
  formSubmitVariant: FormSubmitVariantKey;
}

export interface ComponentDesignPresetPatchResult {
  nodes: BuilderCanvasNode[];
  changedNodeIds: string[];
  counts: {
    buttons: number;
    cards: number;
    formFields: number;
    formSubmits: number;
  };
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
  },
  {
    key: 'soft',
    label: 'Soft system',
    description: 'Muted cards, soft fields, and quieter secondary actions.',
    buttonVariant: 'primary-ghost',
    cardVariant: 'soft',
    formInputVariant: 'filled',
    formSubmitVariant: 'secondary',
  },
  {
    key: 'editorial',
    label: 'Editorial system',
    description: 'Thin framed cards, underline fields, and text-led actions.',
    buttonVariant: 'primary-link',
    cardVariant: 'editorial',
    formInputVariant: 'underline',
    formSubmitVariant: 'outline',
  },
  {
    key: 'conversion',
    label: 'Conversion system',
    description: 'Elevated cards, CTA buttons, and full-form emphasis.',
    buttonVariant: 'cta-shadow',
    cardVariant: 'floating',
    formInputVariant: 'filled',
    formSubmitVariant: 'primary',
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

function hasSameContentValues(node: BuilderCanvasNode, values: Record<string, unknown>): boolean {
  return Object.entries(values).every(([key, value]) => (
    (node.content as Record<string, unknown>)[key] === value
  ));
}

export function applyComponentDesignPresetToNodes(
  nodes: readonly BuilderCanvasNode[],
  presetKey: ComponentDesignPresetKey | string,
): ComponentDesignPresetPatchResult {
  const preset = getComponentDesignPreset(presetKey);
  const changedNodeIds: string[] = [];
  const counts = {
    buttons: 0,
    cards: 0,
    formFields: 0,
    formSubmits: 0,
  };

  const nextNodes = nodes.map((node) => {
    if (node.kind === 'button') {
      const patch = { style: preset.buttonVariant };
      if (hasSameContentValues(node, patch)) return node;
      changedNodeIds.push(node.id);
      counts.buttons += 1;
      return patchNodeContent(node, patch);
    }

    if (node.kind === 'form-submit') {
      const patch = { style: preset.formSubmitVariant };
      if (hasSameContentValues(node, patch)) return node;
      changedNodeIds.push(node.id);
      counts.formSubmits += 1;
      return patchNodeContent(node, patch);
    }

    if (FORM_FIELD_NODE_KINDS.has(node.kind)) {
      const patch = { variant: preset.formInputVariant };
      if (hasSameContentValues(node, patch)) return node;
      changedNodeIds.push(node.id);
      counts.formFields += 1;
      return patchNodeContent(node, patch);
    }

    if (CARD_NODE_KINDS.has(node.kind)) {
      const patch = { variant: preset.cardVariant };
      if (hasSameContentValues(node, patch)) return node;
      changedNodeIds.push(node.id);
      counts.cards += 1;
      return patchNodeContent(node, patch);
    }

    return node;
  });

  return {
    nodes: nextNodes,
    changedNodeIds,
    counts,
  };
}
