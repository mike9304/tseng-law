'use client';

import type {
  BuilderCanvasNode,
  BuilderCanvasNodeStyle,
  BuilderHoverStyle,
} from '@/lib/builder/canvas/types';

const BUILDER_STYLE_CLIPBOARD_KEY = 'tw_builder_style_clipboard_v1';

export interface BuilderStyleClipboardPayload {
  sourceId: string;
  sourceKind: string;
  style: BuilderCanvasNodeStyle;
  hoverStyle?: BuilderHoverStyle;
  copiedAt: string;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function copyNodeStyleToClipboard(node: BuilderCanvasNode): BuilderStyleClipboardPayload | null {
  if (typeof window === 'undefined') return null;
  const payload: BuilderStyleClipboardPayload = {
    sourceId: node.id,
    sourceKind: node.kind,
    style: cloneJson(node.style),
    hoverStyle: node.hoverStyle ? cloneJson(node.hoverStyle) : undefined,
    copiedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(BUILDER_STYLE_CLIPBOARD_KEY, JSON.stringify(payload));
    return payload;
  } catch {
    return null;
  }
}

export function readStyleClipboard(): BuilderStyleClipboardPayload | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(BUILDER_STYLE_CLIPBOARD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<BuilderStyleClipboardPayload>;
    if (!parsed || typeof parsed !== 'object' || !parsed.style) return null;
    return parsed as BuilderStyleClipboardPayload;
  } catch {
    return null;
  }
}

export function hasStyleClipboard(): boolean {
  return Boolean(readStyleClipboard());
}
