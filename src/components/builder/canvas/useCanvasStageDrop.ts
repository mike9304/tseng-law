import { useCallback } from 'react';
import {
  BUILDER_APP_WIDGET_DRAG_MIME,
  BUILDER_BUILT_IN_SECTION_TEMPLATE_DRAG_MIME,
  BUILDER_NODE_KIND_DRAG_MIME,
  BUILDER_SAVED_SECTION_DRAG_MIME,
  BUILDER_WIDGET_PRESET_DRAG_MIME,
  type CanvasDropTargetContext,
  createBuiltInSectionDropSnapshot,
  createCatalogDropNode,
  isBuilderCatalogNodeKind,
  parseBuiltInSectionTemplateDragData,
  parseCatalogAppWidgetDragData,
  parseCatalogWidgetPresetDragData,
} from './canvasCatalogDrop';
import type { BuilderCanvasNode } from '@/lib/builder/canvas/types';

type StagePoint = { x: number; y: number };
const BUILDER_STAGE_DROP_MIME_TYPES = [
  BUILDER_SAVED_SECTION_DRAG_MIME,
  BUILDER_BUILT_IN_SECTION_TEMPLATE_DRAG_MIME,
  BUILDER_NODE_KIND_DRAG_MIME,
] as const;

export function useCanvasStageDrop({
  addNode,
  addNodes,
  nodeCount,
  onRequestInsertSavedSection,
  resolveDropTargetContext,
  setExternalDropTargetId,
  setDraftSaveState,
  setSelectedNodeId,
}: {
  addNode: (node: BuilderCanvasNode) => void;
  addNodes: (nodes: BuilderCanvasNode[], rootNodeId?: string | null, parentNodeId?: string | null) => void;
  nodeCount: number;
  onRequestInsertSavedSection?: (sectionId: string, position: StagePoint, parentNodeId: string | null) => void;
  resolveDropTargetContext: (clientX: number, clientY: number) => CanvasDropTargetContext;
  setExternalDropTargetId: (nodeId: string | null) => void;
  setDraftSaveState: (state: 'idle' | 'saving' | 'saved' | 'error') => void;
  setSelectedNodeId: (nodeId: string | null) => void;
}) {
  const handleStageDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    if (!hasBuilderStageDropData(event.dataTransfer)) {
      setExternalDropTargetId(null);
      return;
    }
    const target = resolveDropTargetContext(event.clientX, event.clientY);
    setExternalDropTargetId(target.parentId);
  }, [resolveDropTargetContext, setExternalDropTargetId]);

  const handleStageDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && event.currentTarget.contains(relatedTarget)) return;
    setExternalDropTargetId(null);
  }, [setExternalDropTargetId]);

  const handleStageDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setExternalDropTargetId(null);
    const savedSectionId = event.dataTransfer.getData(BUILDER_SAVED_SECTION_DRAG_MIME);
    if (savedSectionId && onRequestInsertSavedSection) {
      const dropTarget = resolveDropTargetContext(event.clientX, event.clientY);
      onRequestInsertSavedSection(savedSectionId, dropTarget.position, dropTarget.parentId);
      setDraftSaveState('saving');
      return;
    }

    const sectionTemplate = parseBuiltInSectionTemplateDragData(
      event.dataTransfer.getData(BUILDER_BUILT_IN_SECTION_TEMPLATE_DRAG_MIME),
    );
    if (sectionTemplate) {
      const dropTarget = resolveDropTargetContext(event.clientX, event.clientY);
      const result = createBuiltInSectionDropSnapshot(sectionTemplate, dropTarget.position);
      if (result.nodes.length === 0) return;
      addNodes(result.nodes, result.rootNodeId, dropTarget.parentId);
      setSelectedNodeId(result.rootNodeId);
      setDraftSaveState('saving');
      return;
    }

    const kind = event.dataTransfer.getData(BUILDER_NODE_KIND_DRAG_MIME);
    if (!isBuilderCatalogNodeKind(kind)) return;
    const dropTarget = resolveDropTargetContext(event.clientX, event.clientY);
    const appWidget = parseCatalogAppWidgetDragData(event.dataTransfer.getData(BUILDER_APP_WIDGET_DRAG_MIME));
    const preset = parseCatalogWidgetPresetDragData(event.dataTransfer.getData(BUILDER_WIDGET_PRESET_DRAG_MIME));
    const template = createCatalogDropNode({
      appWidget,
      kind,
      nodeCount,
      parentId: dropTarget.parentId,
      position: dropTarget.position,
      preset,
    });
    addNode(template);
    setDraftSaveState('saving');
  }, [
    addNode,
    addNodes,
    nodeCount,
    onRequestInsertSavedSection,
    resolveDropTargetContext,
    setExternalDropTargetId,
    setDraftSaveState,
    setSelectedNodeId,
  ]);

  return { handleStageDragLeave, handleStageDragOver, handleStageDrop };
}

function hasBuilderStageDropData(dataTransfer: DataTransfer): boolean {
  const types = Array.from(dataTransfer.types);
  return BUILDER_STAGE_DROP_MIME_TYPES.some((type) => types.includes(type));
}
