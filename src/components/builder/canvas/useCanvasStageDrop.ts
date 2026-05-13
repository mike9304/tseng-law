import { useCallback } from 'react';
import {
  createCanvasNodeTemplate,
} from '@/lib/builder/canvas/store';
import { builderCanvasNodeKinds, type BuilderCanvasNode } from '@/lib/builder/canvas/types';

type StagePoint = { x: number; y: number };

export function useCanvasStageDrop({
  addNode,
  hoveredContainerId,
  nodeCount,
  onRequestInsertSavedSection,
  resolveStagePosition,
  setDraftSaveState,
}: {
  addNode: (node: BuilderCanvasNode) => void;
  hoveredContainerId: string | null;
  nodeCount: number;
  onRequestInsertSavedSection?: (sectionId: string, position: StagePoint) => void;
  resolveStagePosition: (clientX: number, clientY: number) => StagePoint;
  setDraftSaveState: (state: 'idle' | 'saving' | 'saved' | 'error') => void;
}) {
  const handleStageDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleStageDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const savedSectionId = event.dataTransfer.getData('application/x-builder-saved-section-id');
    if (savedSectionId && onRequestInsertSavedSection) {
      const position = resolveStagePosition(event.clientX, event.clientY);
      onRequestInsertSavedSection(savedSectionId, position);
      setDraftSaveState('saving');
      return;
    }
    const kind = event.dataTransfer.getData('application/x-builder-node-kind');
    if (!builderCanvasNodeKinds.includes(kind as (typeof builderCanvasNodeKinds)[number])) return;
    const position = resolveStagePosition(event.clientX, event.clientY);
    const template = createCanvasNodeTemplate(
      kind as (typeof builderCanvasNodeKinds)[number],
      position.x,
      position.y,
      nodeCount,
    );
    if (hoveredContainerId) {
      (template as { parentId?: string }).parentId = hoveredContainerId;
    }
    addNode(template);
    setDraftSaveState('saving');
  }, [
    addNode,
    hoveredContainerId,
    nodeCount,
    onRequestInsertSavedSection,
    resolveStagePosition,
    setDraftSaveState,
  ]);

  return { handleStageDragOver, handleStageDrop };
}
