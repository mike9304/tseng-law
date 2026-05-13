import { resolveBuilderCollectionItemFocusFromNodeId } from '@/lib/builder/collection-focus';
import type { BuilderCanvasNode } from './types';

export type BuilderCanvasRepeaterQuickEdit =
  | {
      kind: 'service';
      index: number;
      rootNodeId: string;
      titleNodeId: string | null;
      descriptionNodeId: string | null;
      linkNodeId: string | null;
      iconNodeId: string | null;
      title: string;
      description: string;
      href: string;
    }
  | {
      kind: 'faq';
      index: number;
      rootNodeId: string;
      questionNodeId: string | null;
      answerNodeId: string | null;
      question: string;
      answer: string;
    };

export function resolveBuilderCanvasRepeaterQuickEdit(
  nodes: BuilderCanvasNode[],
  selectedNodeId: string | null | undefined
): BuilderCanvasRepeaterQuickEdit | null {
  const focus = resolveBuilderCollectionItemFocusFromNodeId(selectedNodeId);
  if (!focus) return null;

  const nodesById = new Map(nodes.map((node) => [node.id, node]));
  if (focus.sectionKey === 'home.services') {
    const rootNodeId = `home-services-card-${focus.index}`;
    return {
      kind: 'service',
      index: focus.index,
      rootNodeId,
      titleNodeId: getExistingNodeId(nodesById, `${rootNodeId}-title`),
      descriptionNodeId: getExistingNodeId(nodesById, `${rootNodeId}-description`),
      linkNodeId: getExistingNodeId(nodesById, `${rootNodeId}-more`),
      iconNodeId: getExistingNodeId(nodesById, `${rootNodeId}-icon-svg`),
      title: readNodeText(nodesById.get(`${rootNodeId}-title`)),
      description: readNodeText(nodesById.get(`${rootNodeId}-description`)),
      href: readNodeHref(nodesById.get(`${rootNodeId}-more`)),
    };
  }

  const rootNodeId = `home-faq-item-${focus.index}`;
  return {
    kind: 'faq',
    index: focus.index,
    rootNodeId,
    questionNodeId: getExistingNodeId(nodesById, `${rootNodeId}-question-text`),
    answerNodeId: getExistingNodeId(nodesById, `${rootNodeId}-answer`),
    question: readNodeText(nodesById.get(`${rootNodeId}-question-text`)),
    answer: readNodeText(nodesById.get(`${rootNodeId}-answer`)),
  };
}

function getExistingNodeId(nodesById: Map<string, BuilderCanvasNode>, nodeId: string) {
  return nodesById.has(nodeId) ? nodeId : null;
}

function readNodeText(node: BuilderCanvasNode | undefined) {
  const content = node?.content as { text?: unknown; label?: unknown } | undefined;
  if (typeof content?.text === 'string') return content.text;
  if (typeof content?.label === 'string') return content.label;
  return '';
}

function readNodeHref(node: BuilderCanvasNode | undefined) {
  const content = node?.content as { href?: unknown } | undefined;
  return typeof content?.href === 'string' ? content.href : '';
}
