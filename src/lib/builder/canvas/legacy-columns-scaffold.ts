import type { SiteLocale } from '@/lib/locales';
import { createDefaultCanvasNodeStyle, type BuilderCanvasDocument } from './types';

function comparable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(comparable);
  if (value && typeof value === 'object') return Object.fromEntries(
    Object.entries(value).filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, comparable(item)]),
  );
  return value;
}

/** Only the two saved stock columns wrappers may grow around their live article grid. */
export function hasLegacyColumnsScaffold(
  document: BuilderCanvasDocument,
  locale: SiteLocale,
  slugPath: string,
): boolean {
  if (slugPath !== 'columns' || (locale !== 'ko' && locale !== 'zh-hant')
    || document.locale !== locale || document.version !== 1
    || document.stageWidth !== 1280 || document.stageHeight !== 2660 || document.nodes.length !== 2) return false;
  const base = { rect: { x: 0, y: 0, width: 1280, height: 2660 },
    style: createDefaultCanvasNodeStyle({ borderRadius: 0 }), rotation: 0, locked: false, visible: true };
  const expected = [
    { id: 'columns-page-root', kind: 'container', ...base, zIndex: 0,
      content: { label: 'legacy-page-columns page root', background: '#ffffff', borderColor: 'transparent',
        borderStyle: 'solid', borderWidth: 0, borderRadius: 0, padding: 0, layoutMode: 'absolute', as: 'main',
        activeIndex: 0, sticky: false } },
    { id: 'columns-page-root-composite', kind: 'composite', parentId: 'columns-page-root', ...base, zIndex: 1,
      content: { componentKey: 'legacy-page-columns', config: { locale } } },
  ];
  return document.nodes.every((node, index) => {
    // The read schema adds these two inert container defaults to the saved seed.
    // Keep every other authored field in the comparison, including unknown keys.
    const candidate = node.kind === 'container' ? { ...node, content: {
      ...node.content,
      activeIndex: node.content.activeIndex === undefined ? 0 : node.content.activeIndex,
      sticky: node.content.sticky === undefined ? false : node.content.sticky,
    } } : node;
    return JSON.stringify(comparable(candidate)) === JSON.stringify(comparable(expected[index]));
  });
}
