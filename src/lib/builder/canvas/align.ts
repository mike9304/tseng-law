/**
 * Phase 2 P2-18 — 요소 정렬 + 균등 분배 + 크기 동일화.
 *
 * Pure functions. 입력: 선택된 노드들의 rect 배열. 출력: 새 rect 배열.
 * Store 에서 호출 → updateNode 로 적용.
 */

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface NodeRect {
  id: string;
  rect: Rect;
}

// ─── Align ────────────────────────────────────────────────────────

export function alignLeft(nodes: NodeRect[]): NodeRect[] {
  const minX = Math.min(...nodes.map((n) => n.rect.x));
  return nodes.map((n) => ({ ...n, rect: { ...n.rect, x: minX } }));
}

export function alignCenter(nodes: NodeRect[]): NodeRect[] {
  const centers = nodes.map((n) => n.rect.x + n.rect.width / 2);
  const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
  return nodes.map((n) => ({ ...n, rect: { ...n.rect, x: Math.round(avgCenter - n.rect.width / 2) } }));
}

export function alignRight(nodes: NodeRect[]): NodeRect[] {
  const maxRight = Math.max(...nodes.map((n) => n.rect.x + n.rect.width));
  return nodes.map((n) => ({ ...n, rect: { ...n.rect, x: maxRight - n.rect.width } }));
}

export function alignTop(nodes: NodeRect[]): NodeRect[] {
  const minY = Math.min(...nodes.map((n) => n.rect.y));
  return nodes.map((n) => ({ ...n, rect: { ...n.rect, y: minY } }));
}

export function alignMiddle(nodes: NodeRect[]): NodeRect[] {
  const middles = nodes.map((n) => n.rect.y + n.rect.height / 2);
  const avgMiddle = middles.reduce((a, b) => a + b, 0) / middles.length;
  return nodes.map((n) => ({ ...n, rect: { ...n.rect, y: Math.round(avgMiddle - n.rect.height / 2) } }));
}

export function alignBottom(nodes: NodeRect[]): NodeRect[] {
  const maxBottom = Math.max(...nodes.map((n) => n.rect.y + n.rect.height));
  return nodes.map((n) => ({ ...n, rect: { ...n.rect, y: maxBottom - n.rect.height } }));
}

// ─── Distribute ───────────────────────────────────────────────────

export function distributeHorizontal(nodes: NodeRect[]): NodeRect[] {
  if (nodes.length < 3) return nodes;
  const sorted = [...nodes].sort((a, b) => a.rect.x - b.rect.x);
  const first = sorted[0]!;
  const last = sorted[sorted.length - 1]!;
  const totalWidth = sorted.reduce((sum, n) => sum + n.rect.width, 0);
  const totalSpace = (last.rect.x + last.rect.width) - first.rect.x - totalWidth;
  const gap = totalSpace / (sorted.length - 1);
  let currentX = first.rect.x + first.rect.width + gap;
  return sorted.map((n, i) => {
    if (i === 0 || i === sorted.length - 1) return n;
    const result = { ...n, rect: { ...n.rect, x: Math.round(currentX) } };
    currentX += n.rect.width + gap;
    return result;
  });
}

export function distributeVertical(nodes: NodeRect[]): NodeRect[] {
  if (nodes.length < 3) return nodes;
  const sorted = [...nodes].sort((a, b) => a.rect.y - b.rect.y);
  const first = sorted[0]!;
  const last = sorted[sorted.length - 1]!;
  const totalHeight = sorted.reduce((sum, n) => sum + n.rect.height, 0);
  const totalSpace = (last.rect.y + last.rect.height) - first.rect.y - totalHeight;
  const gap = totalSpace / (sorted.length - 1);
  let currentY = first.rect.y + first.rect.height + gap;
  return sorted.map((n, i) => {
    if (i === 0 || i === sorted.length - 1) return n;
    const result = { ...n, rect: { ...n.rect, y: Math.round(currentY) } };
    currentY += n.rect.height + gap;
    return result;
  });
}

// ─── Match Size ───────────────────────────────────────────────────

export function matchWidth(nodes: NodeRect[]): NodeRect[] {
  const maxWidth = Math.max(...nodes.map((n) => n.rect.width));
  return nodes.map((n) => ({ ...n, rect: { ...n.rect, width: maxWidth } }));
}

export function matchHeight(nodes: NodeRect[]): NodeRect[] {
  const maxHeight = Math.max(...nodes.map((n) => n.rect.height));
  return nodes.map((n) => ({ ...n, rect: { ...n.rect, height: maxHeight } }));
}
