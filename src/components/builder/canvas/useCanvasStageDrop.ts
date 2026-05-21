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
    const appWidgetData = event.dataTransfer.getData('application/x-builder-app-widget');
    if (appWidgetData) {
      try {
        const parsed = JSON.parse(appWidgetData) as {
          appId?: unknown;
          widgetId?: unknown;
          defaultContent?: unknown;
          defaultSize?: unknown;
        };
        if (typeof parsed.appId === 'string' && typeof parsed.widgetId === 'string') {
          template.appWidget = {
            appId: parsed.appId,
            widgetId: parsed.widgetId,
          };
        }
        if (parsed.defaultContent && typeof parsed.defaultContent === 'object' && !Array.isArray(parsed.defaultContent)) {
          template.content = {
            ...template.content,
            ...(parsed.defaultContent as Record<string, unknown>),
          } as BuilderCanvasNode['content'];
        }
        if (parsed.defaultSize && typeof parsed.defaultSize === 'object') {
          const size = parsed.defaultSize as { width?: unknown; height?: unknown };
          if (typeof size.width === 'number' && typeof size.height === 'number') {
            template.rect = {
              ...template.rect,
              width: size.width,
              height: size.height,
            };
          }
        }
      } catch {
        // Ignore malformed drag metadata and fall back to a plain node.
      }
    }
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
