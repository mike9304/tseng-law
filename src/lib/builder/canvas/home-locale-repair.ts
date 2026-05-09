import { locales, type Locale } from '@/lib/locales';
import { createHomePageCanvasDocument } from './seed-home';
import type { BuilderCanvasDocument, BuilderCanvasNode } from './types';

const HOME_SENTINEL_NODE_IDS = [
  'home-hero-title',
  'home-hero-search-input',
  'home-insights-title',
  'home-services-title',
  'home-offices-title',
] as const;

const LOCALIZED_CONTENT_KEYS = [
  'text',
  'richText',
  'label',
  'href',
  'title',
  'ariaLabel',
  'placeholder',
  'alt',
  'action',
  'successMessage',
  'redirectUrl',
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function contentValue(node: BuilderCanvasNode | undefined): string | null {
  const content = node?.content as unknown;
  if (!isRecord(content)) return null;
  for (const key of ['text', 'label', 'placeholder', 'ariaLabel', 'alt'] as const) {
    const value = content[key];
    if (typeof value === 'string' && value.trim()) return value;
  }
  return null;
}

function stringify(value: unknown): string {
  return JSON.stringify(value);
}

function isHomeDocument(document: BuilderCanvasDocument): boolean {
  return document.nodes.some((node) => node.id === 'home-hero-root');
}

function hasHomeLocaleMismatch(document: BuilderCanvasDocument, locale: Locale): boolean {
  if (!isHomeDocument(document)) return false;
  if (document.locale !== locale) return true;

  const nodesById = new Map(document.nodes.map((node) => [node.id, node] as const));
  const targetSeedById = new Map(
    createHomePageCanvasDocument(locale).nodes.map((node) => [node.id, node] as const),
  );
  const otherLocaleSeeds = locales
    .filter((candidate) => candidate !== locale)
    .map((candidate) => new Map(
      createHomePageCanvasDocument(candidate).nodes.map((node) => [node.id, node] as const),
    ));

  return HOME_SENTINEL_NODE_IDS.some((nodeId) => {
    const current = contentValue(nodesById.get(nodeId));
    if (!current) return false;
    const target = contentValue(targetSeedById.get(nodeId));
    if (current === target) return false;
    return otherLocaleSeeds.some((seedById) => contentValue(seedById.get(nodeId)) === current);
  });
}

function mergeLocalizedContent(
  node: BuilderCanvasNode,
  seededNode: BuilderCanvasNode,
): BuilderCanvasNode['content'] {
  const nodeContent = node.content as unknown;
  const seededContent = seededNode.content as unknown;
  if (!isRecord(nodeContent) || !isRecord(seededContent)) {
    return seededNode.content;
  }

  const nextContent: Record<string, unknown> = { ...nodeContent };
  for (const key of LOCALIZED_CONTENT_KEYS) {
    if (Object.prototype.hasOwnProperty.call(seededContent, key)) {
      nextContent[key] = seededContent[key];
      continue;
    }
    if (key === 'richText' && Object.prototype.hasOwnProperty.call(nextContent, key)) {
      delete nextContent[key];
    }
  }

  if (isRecord(nextContent.config) && isRecord(seededContent.config)) {
    nextContent.config = {
      ...nextContent.config,
      locale: seededContent.config.locale,
    };
  }

  return nextContent as BuilderCanvasNode['content'];
}

export function repairHomeCanvasLocale(
  document: BuilderCanvasDocument,
  locale: Locale,
): BuilderCanvasDocument {
  if (!hasHomeLocaleMismatch(document, locale)) return document;

  const seededById = new Map(
    createHomePageCanvasDocument(locale).nodes.map((node) => [node.id, node] as const),
  );
  let changed = document.locale !== locale;
  const nodes = document.nodes.map((node) => {
    const seededNode = seededById.get(node.id);
    if (!seededNode || seededNode.kind !== node.kind) return node;
    const nextContent = mergeLocalizedContent(node, seededNode);
    if (stringify(nextContent) === stringify(node.content)) return node;
    changed = true;
    return {
      ...node,
      content: nextContent,
    } as BuilderCanvasNode;
  });

  if (!changed) return document;
  return {
    ...document,
    locale,
    updatedAt: new Date().toISOString(),
    updatedBy: `${document.updatedBy || 'builder'}+locale-repair`,
    nodes,
  };
}
