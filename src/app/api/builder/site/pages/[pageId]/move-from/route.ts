import { NextRequest, NextResponse } from 'next/server';
import { guardMutation } from '@/lib/builder/security/guard';
import { readPageCanvas, writePageCanvas } from '@/lib/builder/site/persistence';
import { normalizeLocale, type Locale } from '@/lib/locales';
import { normalizeCanvasDocument, type BuilderCanvasNode } from '@/lib/builder/canvas/types';
import {
  buildChildrenMap,
  getCanvasNodeDescendantIds,
  resolveCanvasNodeAbsoluteRect,
} from '@/lib/builder/canvas/tree';
import {
  getBuilderSiteApiErrorPayload,
  type BuilderSiteApiErrorCode,
} from '@/lib/builder/site/site-api-copy';
import { resolveBuilderSiteIdForMutationFromRequest } from '@/lib/builder/site/admin-routing';

export const runtime = 'nodejs';

let moveCounter = 0;
function newMovedId(): string {
  moveCounter += 1;
  return `moved-${Date.now()}-${moveCounter}`;
}

function moveErrorResponse(
  locale: Locale,
  errorCode: BuilderSiteApiErrorCode,
  status: number,
  extra: Record<string, unknown> = {},
): NextResponse {
  return NextResponse.json(
    { ok: false, ...getBuilderSiteApiErrorPayload(locale, errorCode), ...extra },
    { status },
  );
}

/**
 * Move nodes from source page to target page (this route's pageId).
 *
 * Body: { sourcePageId: string, nodeIds: string[] }
 *
 * Atomic-ish: reads both drafts, computes the move (descendants
 * included, fresh IDs to avoid collisions, root-level placement
 * with offset on target), writes both drafts. If write fails the
 * source remains unchanged (best-effort).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { pageId: string } },
) {
  const auth = await guardMutation(request, { permission: 'edit-pages' });
  if (auth instanceof NextResponse) return auth;

  const locale = normalizeLocale(request.nextUrl.searchParams.get('locale') || 'ko');
  let body: { siteId?: string; sourcePageId?: string; nodeIds?: string[] };
  try {
    body = (await request.json()) as { sourcePageId?: string; nodeIds?: string[] };
  } catch {
    return moveErrorResponse(locale, 'invalid_json', 400);
  }

  const targetPageId = params.pageId;
  const siteResolution = resolveBuilderSiteIdForMutationFromRequest(request, body.siteId);
  if (!siteResolution.ok) return siteResolution.response;
  const siteId = siteResolution.siteId;
  const sourcePageId = body.sourcePageId?.trim();
  const requestedIds = Array.isArray(body.nodeIds) ? body.nodeIds.filter((id) => typeof id === 'string') : [];

  if (!sourcePageId) {
    return moveErrorResponse(locale, 'move_source_page_required', 400);
  }
  if (sourcePageId === targetPageId) {
    return moveErrorResponse(locale, 'move_same_page', 400);
  }
  if (requestedIds.length === 0) {
    return moveErrorResponse(locale, 'move_node_ids_required', 400);
  }

  let sourceDraft: Awaited<ReturnType<typeof readPageCanvas>> = null;
  let targetDraft: Awaited<ReturnType<typeof readPageCanvas>> = null;
  try {
    sourceDraft = await readPageCanvas(siteId, sourcePageId, 'draft');
    targetDraft = await readPageCanvas(siteId, targetPageId, 'draft');
  } catch {
    return moveErrorResponse(locale, 'move_drafts_load_failed', 500);
  }
  if (!sourceDraft) {
    return moveErrorResponse(locale, 'move_source_draft_not_found', 404);
  }
  if (!targetDraft) {
    return moveErrorResponse(locale, 'move_target_draft_not_found', 404);
  }

  const sourceNormalized = normalizeCanvasDocument(sourceDraft, locale);
  const targetNormalized = normalizeCanvasDocument(targetDraft, locale);

  const sourceById = new Map(sourceNormalized.nodes.map((node) => [node.id, node]));
  const sourceChildrenMap = buildChildrenMap(sourceNormalized.nodes);

  // Collect requested nodes that exist + all their descendants
  const movingIdSet = new Set<string>();
  for (const id of requestedIds) {
    if (!sourceById.has(id)) continue;
    movingIdSet.add(id);
    for (const descendantId of getCanvasNodeDescendantIds(id, sourceChildrenMap)) {
      movingIdSet.add(descendantId);
    }
  }

  if (movingIdSet.size === 0) {
    return moveErrorResponse(locale, 'move_no_matching_nodes', 404);
  }

  // Determine which moved nodes are top-level (their parent is NOT in the moving set)
  const requestedRoots = requestedIds
    .filter((id) => sourceById.has(id))
    .filter((id) => {
      const parent = sourceById.get(id)?.parentId;
      return !parent || !movingIdSet.has(parent);
    });

  // Compute absolute rects for top-level moved nodes (to place at target root)
  const absoluteRects = new Map<string, { x: number; y: number; width: number; height: number }>();
  for (const rootId of requestedRoots) {
    const node = sourceById.get(rootId)!;
    absoluteRects.set(rootId, resolveCanvasNodeAbsoluteRect(node, sourceById));
  }

  // Find an empty area on the target by offsetting from current max y
  const targetMaxY = targetNormalized.nodes.reduce((max, node) => {
    if (node.parentId) return max;
    return Math.max(max, node.rect.y + node.rect.height);
  }, 0);
  const placementYStart = targetMaxY + 40;

  // Generate fresh IDs to avoid collisions across pages
  const idMap = new Map<string, string>();
  for (const oldId of movingIdSet) {
    idMap.set(oldId, newMovedId());
  }

  // Build the moved nodes set with rewritten parent refs and rects
  const maxTargetZ = targetNormalized.nodes.reduce((max, node) => Math.max(max, node.zIndex), 0);
  let zCounter = maxTargetZ + 1;
  const placementOffsets = new Map<string, { x: number; y: number }>();
  let cursorY = placementYStart;
  for (const rootId of requestedRoots) {
    const absRect = absoluteRects.get(rootId)!;
    placementOffsets.set(rootId, { x: 80, y: cursorY });
    cursorY += absRect.height + 32;
  }

  const movedNodes: BuilderCanvasNode[] = [];
  for (const oldId of movingIdSet) {
    const original = sourceById.get(oldId)!;
    const newId = idMap.get(oldId)!;
    const oldParent = original.parentId;
    const newParent = oldParent && movingIdSet.has(oldParent) ? idMap.get(oldParent) : undefined;
    let nextRect = original.rect;
    if (!newParent) {
      // Top-level moved node: place at target root with offset
      const placement = placementOffsets.get(oldId) ?? { x: 80, y: cursorY };
      nextRect = {
        x: placement.x,
        y: placement.y,
        width: original.rect.width,
        height: original.rect.height,
      };
    }
    const cloned = {
      ...structuredClone(original),
      id: newId,
      rect: nextRect,
      zIndex: zCounter,
    } as BuilderCanvasNode;
    if (newParent) {
      cloned.parentId = newParent;
    } else {
      delete (cloned as { parentId?: string }).parentId;
    }
    movedNodes.push(cloned);
    zCounter += 1;
  }

  // Source: filter out moved nodes
  const nextSourceNodes = sourceNormalized.nodes.filter((node) => !movingIdSet.has(node.id));
  const nextSource = normalizeCanvasDocument(
    { ...sourceNormalized, nodes: nextSourceNodes, updatedAt: new Date().toISOString() },
    locale,
  );

  // Target: append moved nodes
  const nextTargetNodes = [...targetNormalized.nodes, ...movedNodes];
  const nextTarget = normalizeCanvasDocument(
    { ...targetNormalized, nodes: nextTargetNodes, updatedAt: new Date().toISOString() },
    locale,
  );

  // Write target first (the destination must succeed); only delete from source if target write succeeded
  try {
    await writePageCanvas(siteId, targetPageId, 'draft', nextTarget);
  } catch {
    return moveErrorResponse(locale, 'move_target_write_failed', 500);
  }
  try {
    await writePageCanvas(siteId, sourcePageId, 'draft', nextSource);
  } catch {
    // Target was written but source delete failed — caller should retry to clean up source
    return moveErrorResponse(locale, 'move_source_write_failed', 500, {
      target: { pageId: targetPageId, nodeCount: nextTargetNodes.length },
    });
  }

  return NextResponse.json({
    ok: true,
    movedCount: movedNodes.length,
    movedRootIds: requestedRoots.map((id) => idMap.get(id)).filter((id): id is string => Boolean(id)),
    source: { pageId: sourcePageId, nodeCount: nextSourceNodes.length },
    target: { pageId: targetPageId, nodeCount: nextTargetNodes.length },
  });
}
