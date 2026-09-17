import type { BuilderCanvasDocument } from '@/lib/builder/canvas/types';

/**
 * Exact-match public layout for the in-memory KO / zh-hant lawyers and pricing
 * two-node legacy composites produced by buildLegacyCompositePageCanvas.
 *
 * Actual source-factory match is required. The four source references used to
 * build these fingerprints do not prove current production stock.
 */

export const LEGACY_EDITORIAL_COMPOSITE_LAYOUT_MARKER =
  'data-builder-legacy-editorial-composite';

const HOST = `.builder-pub-main[${LEGACY_EDITORIAL_COMPOSITE_LAYOUT_MARKER}="true"]`;
const LAWYERS_ROOT = `${HOST} > .builder-pub-node[data-node-id="lawyers-page-root"]`;
const PRICING_ROOT = `${HOST} > .builder-pub-node[data-node-id="pricing-page-root"]`;
const LAWYERS_ROOT_INNER = `${LAWYERS_ROOT} > div:not(.builder-pub-node)`;
const PRICING_ROOT_INNER = `${PRICING_ROOT} > div:not(.builder-pub-node)`;
const LAWYERS_COMPOSITE_ID = 'lawyers-page-root-composite';
const PRICING_COMPOSITE_ID = 'pricing-page-root-composite';

function rule(selectors: string[], declarations: string[]): string {
  return `${selectors.join(',\n')} {\n  ${declarations.join('\n  ')}\n}`;
}

export const LEGACY_EDITORIAL_COMPOSITE_LAYOUT_CSS = [
  '/* Exact source-factory match required; these references do not prove current production stock. */',
  rule(
    [HOST],
    [
      'height: auto !important;',
      'min-height: 0 !important;',
      'max-height: none !important;',
    ],
  ),
  rule(
    [LAWYERS_ROOT, PRICING_ROOT],
    [
      'position: relative !important;',
      'left: auto !important;',
      'top: auto !important;',
      'height: auto !important;',
      'min-height: 0 !important;',
      'max-height: none !important;',
    ],
  ),
  rule(
    [LAWYERS_ROOT_INNER, PRICING_ROOT_INNER],
    [
      'height: auto !important;',
      'min-height: 0 !important;',
      'max-height: none !important;',
    ],
  ),
  rule(
    [
      `${LAWYERS_ROOT} > .builder-pub-node[data-node-id="${LAWYERS_COMPOSITE_ID}"]`,
      `${LAWYERS_ROOT_INNER} > .builder-pub-node[data-node-id="${LAWYERS_COMPOSITE_ID}"]`,
      `${PRICING_ROOT} > .builder-pub-node[data-node-id="${PRICING_COMPOSITE_ID}"]`,
      `${PRICING_ROOT_INNER} > .builder-pub-node[data-node-id="${PRICING_COMPOSITE_ID}"]`,
    ],
    [
      'position: relative !important;',
      'left: auto !important;',
      'top: auto !important;',
      'height: auto !important;',
      'min-height: 0 !important;',
      'max-height: none !important;',
      'width: 100% !important;',
      'max-width: 100% !important;',
    ],
  ),
  rule(
    [
      `${LAWYERS_ROOT} > .builder-pub-node[data-node-id="${LAWYERS_COMPOSITE_ID}"] > div:not(.builder-pub-node)`,
      `${LAWYERS_ROOT_INNER} > .builder-pub-node[data-node-id="${LAWYERS_COMPOSITE_ID}"] > div:not(.builder-pub-node)`,
      `${PRICING_ROOT} > .builder-pub-node[data-node-id="${PRICING_COMPOSITE_ID}"] > div:not(.builder-pub-node)`,
      `${PRICING_ROOT_INNER} > .builder-pub-node[data-node-id="${PRICING_COMPOSITE_ID}"] > div:not(.builder-pub-node)`,
    ],
    [
      'height: auto !important;',
      'min-height: 0 !important;',
      'max-height: none !important;',
    ],
  ),
].join('\n');

type EditorialLocale = 'ko' | 'zh-hant';
type EditorialSlug = 'lawyers' | 'pricing';

const SOURCE_STYLE = {
  backgroundColor: 'transparent',
  borderColor: '#cbd5e1',
  borderStyle: 'solid',
  borderWidth: 0,
  borderRadius: 0,
  shadowX: 0,
  shadowY: 0,
  shadowBlur: 0,
  shadowSpread: 0,
  shadowColor: 'rgba(15, 23, 42, 0.16)',
  opacity: 100,
} as const;

const SOURCE_FAMILIES = {
  lawyers: {
    rootId: 'lawyers-page-root',
    componentKey: 'legacy-page-lawyers',
    stageHeight: 2653,
    mobileHeight: 4706,
    tabletHeight: 4474,
  },
  pricing: {
    rootId: 'pricing-page-root',
    componentKey: 'legacy-page-pricing',
    stageHeight: 1450,
    mobileHeight: 2433,
    tabletHeight: 1747,
  },
} as const;

function sourceRect(width: number, height: number) {
  return { x: 0, y: 0, width, height };
}

function buildSourceReference(locale: EditorialLocale, slug: EditorialSlug) {
  const family = SOURCE_FAMILIES[slug];
  const rect = sourceRect(1280, family.stageHeight);
  const responsive = {
    mobile: { rect: sourceRect(375, family.mobileHeight) },
    tablet: { rect: sourceRect(768, family.tabletHeight) },
  };
  return {
    version: 1,
    locale,
    stageWidth: 1280,
    stageHeight: family.stageHeight,
    nodes: [
      {
        id: family.rootId,
        kind: 'container',
        rect,
        style: { ...SOURCE_STYLE },
        zIndex: 0,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          label: `${family.componentKey} page root`,
          background: '#ffffff',
          borderColor: 'transparent',
          borderStyle: 'solid',
          borderWidth: 0,
          borderRadius: 0,
          padding: 0,
          layoutMode: 'absolute',
          as: 'main',
        },
        responsive,
      },
      {
        id: `${family.rootId}-composite`,
        kind: 'composite',
        parentId: family.rootId,
        rect,
        style: { ...SOURCE_STYLE },
        zIndex: 1,
        rotation: 0,
        locked: false,
        visible: true,
        content: {
          componentKey: family.componentKey,
          config: { locale },
        },
        responsive,
      },
    ],
  };
}

function isPlainObject(value: object): boolean {
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}

function createSafeRecord(): Record<string, unknown> {
  return Object.create(null) as Record<string, unknown>;
}

function setOwnData(target: object, key: string, value: unknown): void {
  Object.defineProperty(target, key, {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

function ownDataDescriptor(value: object, key: string | symbol): PropertyDescriptor {
  const desc = Reflect.getOwnPropertyDescriptor(value, key);
  if (
    desc === undefined
    || desc.get !== undefined
    || desc.set !== undefined
    || !('value' in desc)
  ) {
    throw new Error('non-json');
  }
  return desc;
}

function canonicalizeArray(value: unknown[]): unknown[] {
  const lengthDesc = ownDataDescriptor(value, 'length');
  if (
    typeof lengthDesc.value !== 'number'
    || !Number.isInteger(lengthDesc.value)
    || lengthDesc.value < 0
  ) {
    throw new Error('non-json');
  }
  const length = lengthDesc.value as number;
  const expected = new Set<string>();
  for (let i = 0; i < length; i += 1) {
    expected.add(String(i));
  }
  expected.add('length');
  const ownKeys = Reflect.ownKeys(value);
  if (ownKeys.length !== expected.size) {
    throw new Error('non-json');
  }
  for (const key of ownKeys) {
    if (typeof key !== 'string' || !expected.has(key)) {
      throw new Error('non-json');
    }
  }
  const out: unknown[] = [];
  for (let i = 0; i < length; i += 1) {
    const desc = ownDataDescriptor(value, String(i));
    if (desc.enumerable !== true || desc.value === undefined) {
      throw new Error('non-json');
    }
    out.push(canonicalizeValue(desc.value));
  }
  return out;
}

function canonicalizeValue(value: unknown): unknown {
  if (value === null) return null;
  switch (typeof value) {
    case 'string':
    case 'boolean':
      return value;
    case 'number':
      if (!Number.isFinite(value)) {
        throw new Error('non-json');
      }
      return value;
    case 'object':
      break;
    default:
      throw new Error('non-json');
  }
  if (Array.isArray(value)) {
    return canonicalizeArray(value);
  }
  if (!isPlainObject(value)) {
    throw new Error('non-json');
  }
  const out = createSafeRecord();
  const keys: string[] = [];
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== 'string') {
      throw new Error('non-json');
    }
    const desc = ownDataDescriptor(value, key);
    if (desc.enumerable !== true) {
      throw new Error('non-json');
    }
    keys.push(key);
  }
  keys.sort();
  for (const key of keys) {
    const desc = ownDataDescriptor(value, key);
    if (desc.value === undefined) {
      throw new Error('non-json');
    }
    setOwnData(out, key, canonicalizeValue(desc.value));
  }
  return out;
}

function omitInertRootContainerDefaultsInPlace(canonical: unknown): void {
  if (canonical === null || typeof canonical !== 'object' || Array.isArray(canonical)) {
    return;
  }
  const nodesDesc = Reflect.getOwnPropertyDescriptor(canonical, 'nodes');
  const nodes =
    nodesDesc && nodesDesc.get === undefined && nodesDesc.set === undefined
      ? nodesDesc.value
      : undefined;
  if (!Array.isArray(nodes)) return;
  for (const node of nodes) {
    if (node === null || typeof node !== 'object' || Array.isArray(node)) continue;
    const parentIdDesc = Reflect.getOwnPropertyDescriptor(node, 'parentId');
    const parentId =
      parentIdDesc && parentIdDesc.get === undefined && parentIdDesc.set === undefined
        ? parentIdDesc.value
        : undefined;
    if (parentId !== undefined && parentId !== null) continue;
    const kindDesc = Reflect.getOwnPropertyDescriptor(node, 'kind');
    const kind =
      kindDesc && kindDesc.get === undefined && kindDesc.set === undefined
        ? kindDesc.value
        : undefined;
    if (kind !== 'container') continue;
    const contentDesc = Reflect.getOwnPropertyDescriptor(node, 'content');
    const content =
      contentDesc && contentDesc.get === undefined && contentDesc.set === undefined
        ? contentDesc.value
        : undefined;
    if (content === null || typeof content !== 'object' || Array.isArray(content)) continue;
    const next = createSafeRecord();
    for (const key of Reflect.ownKeys(content)) {
      if (typeof key !== 'string') {
        throw new Error('non-json');
      }
      const desc = ownDataDescriptor(content, key);
      const val = desc.value;
      if (key === 'activeIndex' && val === 0) continue;
      if (key === 'sticky' && val === false) continue;
      setOwnData(next, key, val);
    }
    setOwnData(node, 'content', next);
  }
}

function canonicalizeDocument(value: unknown): unknown {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('non-json');
  }
  if (!isPlainObject(value)) {
    throw new Error('non-json');
  }
  const stripped = createSafeRecord();
  for (const key of Reflect.ownKeys(value)) {
    if (typeof key !== 'string') {
      throw new Error('non-json');
    }
    const desc = ownDataDescriptor(value, key);
    if (key === 'updatedAt' || key === 'updatedBy') continue;
    if (desc.enumerable !== true) {
      throw new Error('non-json');
    }
    if (desc.value === undefined) {
      throw new Error('non-json');
    }
    setOwnData(stripped, key, desc.value);
  }
  const canonical = canonicalizeValue(stripped);
  omitInertRootContainerDefaultsInPlace(canonical);
  return canonical;
}

function fingerprintCandidate(value: unknown): string | null {
  try {
    return JSON.stringify(canonicalizeDocument(value));
  } catch {
    return null;
  }
}

function mustFingerprint(value: unknown): string {
  const fingerprint = fingerprintCandidate(value);
  if (!fingerprint) {
    throw new Error('legacy editorial composite source fingerprint is not JSON-canonical');
  }
  return fingerprint;
}

const SOURCE_FINGERPRINTS: Readonly<Record<string, string>> = {
  'ko:lawyers': mustFingerprint(buildSourceReference('ko', 'lawyers')),
  'ko:pricing': mustFingerprint(buildSourceReference('ko', 'pricing')),
  'zh-hant:lawyers': mustFingerprint(buildSourceReference('zh-hant', 'lawyers')),
  'zh-hant:pricing': mustFingerprint(buildSourceReference('zh-hant', 'pricing')),
};

export function matchLegacyEditorialCompositeLayout(
  canvas: BuilderCanvasDocument,
  locale: string,
  slugPath: string,
): boolean {
  if ((locale !== 'ko' && locale !== 'zh-hant') || (slugPath !== 'lawyers' && slugPath !== 'pricing')) {
    return false;
  }
  const expected = SOURCE_FINGERPRINTS[`${locale}:${slugPath}`];
  if (!expected) return false;
  const actual = fingerprintCandidate(canvas);
  return actual === expected;
}
