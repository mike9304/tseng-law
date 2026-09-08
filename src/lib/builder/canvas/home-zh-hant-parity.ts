import type { CSSProperties } from 'react';
import type { SiteLocale } from '@/lib/locales';
import { getAiIntakeDiscovery, type AiIntakeDiscovery } from '@/lib/ai-intake/discovery';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import { createHomeButtonNode, createHomeContainerNode } from './decompose-home-shared';
import { getOfficeLocationPresets } from './office-locations';
import { createDefaultCanvasNodeStyle, type BuilderCanvasDocument, type BuilderCanvasNode } from './types';

// Public July 2026 stock geometry, not a whole-document seed fingerprint.
// Authored copy is deliberately excluded; every layout/style field is checked.
const STOCK = {
  "home-hero-search-wrapper": {"kind":"container","parentId":"home-hero-root","rect":{"x":51,"y":618,"width":1151,"height":62},"responsive":{"tablet":{"rect":{"x":32,"y":414,"width":704,"height":60}},"mobile":{"rect":{"x":20,"y":415,"width":335,"height":60}}},"content":{"label":"hero search wrapper","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"hero-search-wrapper","as":"div"},"radius":0},
  "home-hero-copy": {"kind":"container","parentId":"home-hero-inner","rect":{"x":0,"y":0,"width":780,"height":363},"responsive":{"tablet":{"rect":{"x":24,"y":12,"width":720,"height":274}},"mobile":{"rect":{"x":22.5,"y":12,"width":330,"height":287}}},"content":{"label":"hero copy","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"hero-copy","as":"div"},"radius":0},
  "home-hero-label": {"kind":"text","parentId":"home-hero-copy","rect":{"x":0,"y":1,"width":240,"height":32},"responsive":{"tablet":{"rect":{"x":24,"y":12,"width":672,"height":32}},"mobile":{"rect":{"x":19.8,"y":12,"width":290.4,"height":32}}},"content":{"fontSize":17.28,"color":"#e9f2ea","fontWeight":"medium","align":"left","lineHeight":1.82,"letterSpacing":0,"fontFamily":"system-ui","verticalAlign":"top","textTransform":"none","className":"section-label","as":"div"},"radius":14},
  "home-hero-columns-link": {"kind":"button","parentId":"home-hero-links","rect":{"x":0,"y":0,"width":180,"height":32},"responsive":{"tablet":{"rect":{"x":24,"y":12,"width":624,"height":46}},"mobile":{"rect":{"x":17.424,"y":12,"width":255.55199999999996,"height":46}}},"content":{"href":"/zh-hant/columns","style":"link","className":"link-underline","as":"a"},"radius":0},
  "home-insights-container": {"kind":"container","parentId":"home-insights-root","rect":{"x":72,"y":88,"width":1136,"height":1087},"responsive":{"tablet":{"rect":{"x":31,"y":92,"width":675,"height":1495}},"mobile":{"rect":{"x":16,"y":48,"width":343,"height":2411}}},"content":{"label":"home insights container","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"container","as":"div"},"radius":0},
  "home-stats-container": {"kind":"container","parentId":"home-stats-root","rect":{"x":51,"y":80,"width":1178,"height":480},"responsive":{"tablet":{"rect":{"x":31,"y":92,"width":675,"height":424}},"mobile":{"rect":{"x":16,"y":49,"width":343,"height":644}}},"content":{"label":"home stats container","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"container","as":"div"},"radius":0},
  "home-faq-container": {"kind":"container","parentId":"home-faq-root","rect":{"x":72,"y":110,"width":1136,"height":1206},"responsive":{"tablet":{"rect":{"x":31,"y":92,"width":675,"height":1066}},"mobile":{"rect":{"x":16,"y":48,"width":343,"height":1081}}},"content":{"label":"home faq container","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"container","as":"div"},"radius":0},
  "home-offices-container": {"kind":"container","parentId":"home-offices-root","rect":{"x":51,"y":149,"width":1178,"height":628},"responsive":{"tablet":{"rect":{"x":31,"y":92,"width":675,"height":880}},"mobile":{"rect":{"x":16,"y":48,"width":343,"height":812}}},"content":{"label":"home offices container","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"container","as":"div"},"radius":0},
  "home-hero-inner": {"kind":"container","parentId":"home-hero-root","rect":{"x":51,"y":175,"width":1178,"height":483},"responsive":{"tablet":{"rect":{"x":0,"y":12,"width":768,"height":298}},"mobile":{"rect":{"x":0,"y":12,"width":375,"height":311}}},"content":{"label":"hero inner","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"container hero-inner","as":"div"},"radius":0},
  "home-hero-title": {"kind":"text","parentId":"home-hero-copy","rect":{"x":0,"y":56,"width":780,"height":167},"responsive":{"tablet":{"rect":{"x":0,"y":170,"width":720,"height":32}},"mobile":{"rect":{"x":0,"y":158,"width":330,"height":32}}},"content":{"fontSize":17.28,"color":"#f7fcf7","fontWeight":"regular","align":"left","lineHeight":1.82,"letterSpacing":0,"fontFamily":"system-ui","verticalAlign":"top","textTransform":"none","className":"hero-title","as":"h1"},"radius":14},
  "home-hero-search-button": {"kind":"button","parentId":"home-hero-search-bar","rect":{"x":700,"y":0,"width":60,"height":62},"content":{"href":"/zh-hant/search","style":"ghost","className":"hero-search-btn","as":"button","buttonType":"submit","ariaLabel":"搜尋"},"radius":0},
  "home-hero-subtitle": {"kind":"text","parentId":"home-hero-copy","rect":{"x":0,"y":247,"width":580,"height":116},"responsive":{"tablet":{"rect":{"x":24,"y":230,"width":672,"height":32}},"mobile":{"rect":{"x":19.8,"y":212,"width":290.4,"height":63}}},"content":{"fontSize":17.28,"color":"#dfece1","fontWeight":"regular","align":"left","lineHeight":1.82,"letterSpacing":0,"fontFamily":"system-ui","verticalAlign":"top","textTransform":"none","className":"hero-subtitle","as":"p"},"radius":14},
  "home-hero-links": {"kind":"container","parentId":"home-hero-copy","rect":{"x":0,"y":286,"width":260,"height":32},"responsive":{"tablet":{"rect":{"x":24,"y":72,"width":672,"height":70}},"mobile":{"rect":{"x":19.8,"y":66,"width":290.4,"height":70}}},"content":{"label":"hero links","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"hero-links-minimal","as":"div"},"radius":0},
  "home-hero-scroll-arrow": {"kind":"button","parentId":"home-hero-root","rect":{"x":1216,"y":700,"width":48,"height":48},"responsive":{"tablet":{"rect":{"x":32,"y":338,"width":704,"height":48}},"mobile":{"rect":{"x":20,"y":345,"width":335,"height":48}}},"content":{"href":"#insights","style":"ghost","className":"hero-scroll-arrow","as":"a"},"radius":0},
  "home-attorney-content": {"kind":"container","parentId":"home-attorney-root","rect":{"x":576,"y":141,"width":704,"height":644},"responsive":{"tablet":{"rect":{"x":0,"y":652,"width":736,"height":411}},"mobile":{"rect":{"x":16,"y":525,"width":343,"height":510}}},"content":{"label":"home attorney content","background":"transparent","borderColor":"#cbd5e1","borderStyle":"solid","borderWidth":0,"borderRadius":0,"padding":0,"layoutMode":"absolute","activeIndex":0,"sticky":false,"className":"split-content","as":"div"},"radius":0},
  "home-attorney-summary": {"kind":"text","parentId":"home-attorney-content","rect":{"x":77,"y":392,"width":540,"height":32},"responsive":{"tablet":{"rect":{"x":31,"y":356,"width":675,"height":82}},"mobile":{"rect":{"x":18,"y":366,"width":308,"height":82}}},"content":{"fontSize":17.28,"color":"#0f172a","fontWeight":"regular","align":"left","lineHeight":1.82,"letterSpacing":0,"fontFamily":"system-ui","verticalAlign":"top","textTransform":"none","className":"split-text","as":"p"},"radius":14},
  "home-attorney-contact-line": {"kind":"text","parentId":"home-attorney-content","rect":{"x":77,"y":435,"width":540,"height":32},"responsive":{"tablet":{"rect":{"x":31,"y":452,"width":675,"height":40}},"mobile":{"rect":{"x":18,"y":462,"width":308,"height":40}}},"content":{"fontSize":17.28,"color":"#0f172a","fontWeight":"regular","align":"left","lineHeight":1.82,"letterSpacing":0,"fontFamily":"system-ui","verticalAlign":"top","textTransform":"none","className":"split-text","as":"p"},"radius":14},
  "home-attorney-cta": {"kind":"button","parentId":"home-attorney-content","rect":{"x":77,"y":478,"width":550,"height":32},"responsive":{"tablet":{"rect":{"x":31,"y":516,"width":220,"height":28}},"mobile":{"rect":{"x":18,"y":485,"width":220,"height":28}}},"content":{"href":"/zh-hant/lawyers/wei-tseng","style":"link","className":"link-underline","as":"a"},"radius":0},
} as const;

type StockId = keyof typeof STOCK;

function comparable(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(comparable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)
      .sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, comparable(item)]));
  }
  return value;
}

function same(left: unknown, right: unknown): boolean {
  return JSON.stringify(comparable(left)) === JSON.stringify(comparable(right));
}

function ordinary(node: BuilderCanvasNode, radius: number): boolean {
  return node.visible !== false && !node.locked && !node.rotation
    && node.dataBinding === undefined && node.animation === undefined
    && node.hoverStyle === undefined && node.sticky === undefined
    && node.anchorName === undefined && node.appWidget === undefined
    && same(node.style, createDefaultCanvasNodeStyle({ borderRadius: radius }));
}

function matchesStock(node: BuilderCanvasNode | undefined, id: StockId): boolean {
  if (!node || node.id !== id) return false;
  const expected = STOCK[id];
  if (node.kind !== expected.kind || !ordinary(node, expected.radius)) return false;
  if (node.parentId !== expected.parentId || !same(node.rect, expected.rect)
    || !same(node.responsive, 'responsive' in expected ? expected.responsive : undefined)) return false;
  const content = { ...node.content } as Record<string, unknown>;
  if (node.kind === 'text') delete content.text;
  if (node.kind === 'button') delete content.label;
  return same(content, expected.content);
}

const FLUID_CONTAINERS = new Set<StockId>([
  'home-hero-inner', 'home-insights-container', 'home-stats-container',
  'home-faq-container', 'home-offices-container',
]);

/** Parent percentages keep the 1280px editor stage and wide public view aligned. */
export function getLegacyZhHantFluidContainerStyle(
  node: BuilderCanvasNode,
  locale: SiteLocale,
): Pick<CSSProperties, 'left' | 'width'> | undefined {
  const id = node.id as StockId;
  const projectedSearch = node.id === 'home-hero-search-wrapper' && node.kind === 'container'
    && node.content.className === DESKTOP_SEARCH_CLASS
    && matchesStock({ ...node, content: { ...node.content, className: 'hero-search-wrapper' } }, 'home-hero-search-wrapper');
  if (locale !== 'zh-hant' || (!projectedSearch && (!FLUID_CONTAINERS.has(id) || !matchesStock(node, id)))) return undefined;
  return {
    left: 'max(clamp(17.6px, 4%, 52px), calc((100% - 1200px) / 2))',
    width: 'min(1200px, calc(100% - clamp(35.2px, 8%, 104px)))',
  };
}

/** Glyph-only presentation; ButtonElement retains the original link/form behavior. */
export function getLegacyZhHantHeroButtonIcon(
  node: BuilderCanvasNode,
  locale: SiteLocale,
): 'search' | 'scroll' | null {
  if (locale !== 'zh-hant' || node.kind !== 'button') return null;
  if (node.content.label === '⌕' && matchesStock(node, 'home-hero-search-button')) return 'search';
  if (node.content.label === '⌄' && matchesStock(node, 'home-hero-scroll-arrow')) return 'scroll';
  return null;
}

function isHome(document: BuilderCanvasDocument, locale: SiteLocale, isHomePage: boolean): boolean {
  if (!isHomePage || locale !== 'zh-hant' || document.locale !== 'zh-hant') return false;
  return document.nodes.some((node) => node.id === 'home-hero-root' && node.kind === 'container'
    && !node.parentId && node.content.as === 'section' && node.content.htmlId === 'hero');
}

const COPY_CHILDREN: StockId[] = ['home-hero-label', 'home-hero-title', 'home-hero-subtitle', 'home-hero-links'];

function addMissingEmailCta(nodes: BuilderCanvasNode[]): BuilderCanvasNode[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  if (byId.has('home-hero-email-consultation-link')) return nodes;
  const ids: StockId[] = ['home-hero-inner', 'home-hero-copy', ...COPY_CHILDREN, 'home-hero-columns-link'];
  if (!ids.every((id) => matchesStock(byId.get(id), id))) return nodes;
  const copyChildren = nodes.filter((node) => node.parentId === 'home-hero-copy').map((node) => node.id).sort();
  const linkChildren = nodes.filter((node) => node.parentId === 'home-hero-links');
  if (!same(copyChildren, [...COPY_CHILDREN].sort()) || linkChildren.length !== 1
    || linkChildren[0].id !== 'home-hero-columns-link') return nodes;
  const column = linkChildren[0];
  const email = createHomeButtonNode({
    id: 'home-hero-email-consultation-link', parentId: 'home-hero-links',
    rect: { x: 0, y: 0, width: 220, height: 48 }, zIndex: column.zIndex,
    label: '申請電子郵件諮詢', href: getConsultationPublicMailto('zh-hant'),
    style: 'primary', className: 'button hero-cta-primary', as: 'a',
  });
  const result: BuilderCanvasNode[] = [];
  for (const node of nodes) {
    if (node.id === 'home-hero-copy' && node.kind === 'container') {
      result.push({ ...node, rect: { ...node.rect, height: 450 }, content: {
        ...node.content, layoutMode: 'flex', flexConfig: {
          direction: 'column', wrap: false, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 18,
        },
      } });
    } else if (node.id === 'home-hero-links' && node.kind === 'container') {
      result.push({ ...node, rect: { x: 0, y: 390, width: 780, height: 48 }, content: {
        ...node.content, className: 'hero-links-minimal hero-cta-actions', layoutMode: 'flex', flexConfig: {
          direction: 'row', wrap: true, justifyContent: 'flex-start', alignItems: 'center', gap: 12,
        },
      } });
    } else if (node.id === 'home-hero-columns-link' && node.kind === 'button') {
      result.push(email, { ...node, rect: { ...node.rect, height: 48 },
        content: { ...node.content, className: 'button hero-cta-secondary' } });
    } else result.push(node);
  }
  return result;
}

const LEGACY_OFFICE_ADDRESSES: Record<string, string> = {
  taipei: '台北市大同區承德路一段35號7樓之2',
  taichung: '臺中市北區館前路19號樓之1',
  kaohsiung: '高雄市左營區安吉街233號',
};

function repairAttorneyDetailFlow(nodes: BuilderCanvasNode[]): BuilderCanvasNode[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const groupId = 'home-attorney-detail-flow';
  const ids: StockId[] = ['home-attorney-summary', 'home-attorney-contact-line', 'home-attorney-cta'];
  if (byId.has(groupId) || !matchesStock(byId.get('home-attorney-content'), 'home-attorney-content')
    || !ids.every((id) => matchesStock(byId.get(id), id))) return nodes;
  const siblings = nodes.filter((node) => node.parentId === 'home-attorney-content').map((node) => node.id).sort();
  const originalChildren = [...ids, 'home-attorney-label', 'home-attorney-title', 'home-attorney-divider',
    'home-attorney-intro-1', 'home-attorney-intro-2'].sort();
  if (!same(siblings, originalChildren)) return nodes;
  const summary = byId.get(ids[0])!;
  const group = createHomeContainerNode({
    id: groupId, parentId: 'home-attorney-content', label: 'Attorney detail flow',
    rect: { x: 77, y: 392, width: 550, height: 180 }, zIndex: summary.zIndex,
    layoutMode: 'flex', as: 'div',
  });
  if (group.kind !== 'container') return nodes;
  group.content.flexConfig = { direction: 'column', wrap: false, justifyContent: 'flex-start', alignItems: 'flex-start', gap: 16 };
  return nodes.flatMap((node) => {
    if (!ids.includes(node.id as StockId)) return [node];
    const child = { ...node, parentId: groupId, rect: { ...node.rect, x: 0, y: 0 } };
    return node.id === summary.id ? [group, child] : [child];
  });
}

function textOf(node: BuilderCanvasNode | undefined): string | undefined {
  return node?.kind === 'text' ? node.content.text : undefined;
}

function buttonHref(node: BuilderCanvasNode | undefined): string | undefined {
  return node?.kind === 'button' && !node.content.link ? node.content.href : undefined;
}

function repairOfficeContacts(nodes: BuilderCanvasNode[]): BuilderCanvasNode[] {
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const replacements = new Map<string, BuilderCanvasNode>();
  for (const tab of nodes) {
    const index = /^home-offices-tab-(\d+)$/.exec(tab.id)?.[1];
    if (index === undefined || tab.kind !== 'button' || tab.parentId !== 'home-offices-tabs') continue;
    const prefix = `home-offices-layout-${index}`;
    const title = byId.get(`${prefix}-card-title`);
    const mapTitle = byId.get(`${prefix}-map-title`);
    const cardAddress = byId.get(`${prefix}-card-address`);
    const mapAddress = byId.get(`${prefix}-map-address`);
    const cardLink = byId.get(`${prefix}-card-map-link`);
    const mapLink = byId.get(`${prefix}-map-link`);
    const preset = getOfficeLocationPresets('zh-hant').find((office) => office.title === tab.content.label);
    if (!preset || !LEGACY_OFFICE_ADDRESSES[preset.id] || textOf(title) !== preset.title
      || textOf(mapTitle) !== preset.title || title?.parentId !== `${prefix}-card`
      || mapTitle?.parentId !== `${prefix}-map-panel`
      || cardAddress?.parentId !== `${prefix}-card` || mapAddress?.parentId !== `${prefix}-map-panel`
      || cardLink?.parentId !== `${prefix}-card` || mapLink?.parentId !== `${prefix}-map-panel`
      || buttonHref(cardLink) !== preset.mapsUrl || buttonHref(mapLink) !== preset.mapsUrl) continue;
    const oldAddress = LEGACY_OFFICE_ADDRESSES[preset.id];
    if (![oldAddress, preset.address].includes(textOf(cardAddress) ?? '')
      || ![oldAddress, preset.address].includes(textOf(mapAddress) ?? '')) continue;
    if ([tab, title, mapTitle, cardAddress, mapAddress, cardLink, mapLink].some((node) => !node
      || !ordinary(node, node.kind === 'text' ? 14 : 0))) continue;
    for (const address of [cardAddress, mapAddress]) {
      if (address?.kind === 'text' && address.content.text === oldAddress) {
        replacements.set(address.id, { ...address, content: { ...address.content, text: preset.address } });
      }
    }
    if (preset.id !== 'taipei') continue;
    const phone = byId.get(`${prefix}-card-phone`);
    const fax = byId.get(`${prefix}-card-fax`);
    if (!preset.phone && phone?.kind === 'button' && phone.parentId === `${prefix}-card`
      && ordinary(phone, 0) && phone.content.label === '電話: 04-2326-1862'
      && phone.content.href === 'tel:0423261862' && !phone.content.link
      && phone.content.className === 'link-underline phone-number' && phone.content.as === 'a') {
      replacements.set(phone.id, { ...phone, visible: false });
    }
    if (!preset.fax && fax?.kind === 'text' && fax.parentId === `${prefix}-card`
      && ordinary(fax, 14) && fax.content.text === '傳真: 04-2326-1863'
      && fax.content.className === 'card-copy' && fax.content.as === 'p') {
      replacements.set(fax.id, { ...fax, visible: false });
    }
  }
  return replacements.size ? nodes.map((node) => replacements.get(node.id) ?? node) : nodes;
}

/** A read projection: no persistence, reseed, author metadata change or node removal. */
export function normalizeLegacyZhHantHome(
  document: BuilderCanvasDocument,
  locale: SiteLocale,
  isHomePage: boolean,
): BuilderCanvasDocument {
  if (!isHome(document, locale, isHomePage)) return document;
  const nodes = repairOfficeContacts(repairAttorneyDetailFlow(addMissingEmailCta(document.nodes)));
  return nodes === document.nodes ? document : { ...document, nodes };
}

const DESKTOP_SEARCH_CLASS = 'hero-search-wrapper legacy-zh-stock-search';
const AI_GUIDE_BUTTON = 'home-contact-ai-guide';
const AI_GUIDE_COPY = 'home-contact-ai-guide-copy';
const DESKTOP_ACTIONS_FLEX = {
  direction: 'row', wrap: true, justifyContent: 'flex-start', alignItems: 'center', gap: 14,
} as const;

/** Called only after the complete July fingerprint matches. No original node is removed. */
function projectKnownDesktopNodes(document: BuilderCanvasDocument, discovery: AiIntakeDiscovery): BuilderCanvasDocument {
  const description = document.nodes.find((node) => node.id === 'home-contact-description');
  if (description?.kind !== 'text') return document;
  const guide = createHomeButtonNode({
    id: AI_GUIDE_BUTTON, parentId: 'home-contact-actions', zIndex: document.nodes.length,
    // The stock 1024px desktop canvas is zoomed to 80%: 56px keeps a >=44px hit target.
    rect: { x: 0, y: 0, width: 250, height: 56 }, label: discovery.label,
    href: discovery.href, style: 'secondary', className: 'button secondary', as: 'a',
  });
  guide.visible = discovery.enabled;
  const supportingCopy: BuilderCanvasNode = {
    ...description, id: AI_GUIDE_COPY, parentId: 'home-contact-container',
    rect: { x: 0, y: 286, width: 1136, height: 88 }, zIndex: document.nodes.length + 1,
    responsive: undefined, visible: discovery.enabled,
    content: { ...description.content, text: discovery.supportingCopy },
  };
  const nodes = document.nodes.map((node) => {
    if (node.id === 'home-hero-search-wrapper' && node.kind === 'container') {
      return { ...node, content: { ...node.content, className: DESKTOP_SEARCH_CLASS } };
    }
    if (node.id === 'home-contact-actions' && node.kind === 'container') {
      return { ...node, rect: { ...node.rect, width: 1136 },
        content: { ...node.content, layoutMode: 'flex' as const, flexConfig: DESKTOP_ACTIONS_FLEX } };
    }
    return node;
  });
  return { ...document, nodes: [...nodes, guide, supportingCopy] };
}

/** Reverse only our exact two additions and two layout patches for fingerprint comparison. */
function restoreKnownDesktopProjection(
  document: BuilderCanvasDocument,
  discovery: AiIntakeDiscovery,
): BuilderCanvasDocument | null {
  const additions = document.nodes.filter((node) => node.id === AI_GUIDE_BUTTON || node.id === AI_GUIDE_COPY);
  if (!additions.length) return document;
  if (additions.length !== 2 || additions[0].visible !== additions[1].visible) return null;
  const nodes = document.nodes.filter((node) => node.id !== AI_GUIDE_BUTTON && node.id !== AI_GUIDE_COPY).map((node) => {
    if (node.id === 'home-hero-search-wrapper' && node.kind === 'container') {
      return { ...node, content: { ...node.content, className: 'hero-search-wrapper' } };
    }
    if (node.id === 'home-contact-actions' && node.kind === 'container') {
      const content = { ...node.content, layoutMode: 'absolute' as const };
      delete content.flexConfig;
      return { ...node, rect: { ...node.rect, width: 520 }, content };
    }
    return node;
  });
  const restored = { ...document, nodes };
  const expected = projectKnownDesktopNodes(restored, { ...discovery, enabled: additions[0].visible });
  return same(document.nodes, expected.nodes) ? restored : null;
}

// Exact historical/approved copy groups, not a content exclusion from the hash.
// before = July stock; priorAfter = already-saved v5 approved group; after = current approved source.
const STOCK_LANGUAGE_GROUPS = ['before', 'priorAfter', 'after'] as const;
type StockLanguageGroup = (typeof STOCK_LANGUAGE_GROUPS)[number];
type StockLanguageTarget = 'before' | 'after';

const STOCK_LANGUAGE_TEXT = {
  'home-stats-description': {
    before: '「昊」代表廣闊視野，「鼎」代表穩健基礎。憑藉韓語與日語溝通能力，從投資、公司設立到訴訟提供一站式法律支援。',
    priorAfter: '依官方律師簡介整理：4個台灣辦公據點、中文／韓文／日文／英文4種業務溝通語言、7項主要執業領域，以及TOPIK 6級與JLPT N1兩項最高級別語言資格。',
    after: '事務所提供中文／韓文／日文／英文4種語言的台灣法律諮詢。並依官方律師簡介整理：4個台灣辦公據點、7項主要執業領域，以及TOPIK 6級與JLPT N1兩項最高級別語言資格。',
  },
  'home-stats-number-1': { before: '3', priorAfter: '4', after: '4' },
  'home-attorney-intro-1': {
    before: '專精企業與個人案件，提供韓文與日文法律溝通。',
    priorAfter: '專精企業與個人案件。事務所可提供韓文、中文、日文、英文法律溝通。',
    after: '專精企業與個人案件。事務所可提供韓文、中文、日文、英文法律溝通。',
  },
  'home-faq-item-11-answer': {
    before: '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。韓語與中文皆可諮詢，須事先預約，以一小時為單位。若事先提供相關資料，可獲得更具體的建議。',
    priorAfter: '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。韓語、中文、日語、英語皆可諮詢，須事先預約，以一小時為單位。若事先提供相關資料，可獲得更具體的建議。',
    after: '可選擇面談（台北事務所）或視訊諮詢（Zoom/Google Meet）。韓語、中文、日語、英語皆可諮詢，須事先預約，以一小時為單位。若事先提供相關資料，可獲得更具體的建議。',
  },
} as const;

function rewriteKnownStockLanguageCopy(
  document: BuilderCanvasDocument,
  version: StockLanguageTarget,
): BuilderCanvasDocument | null {
  const matches = (candidate: StockLanguageGroup) => Object.entries(STOCK_LANGUAGE_TEXT).every(([id, copy]) => (
    textOf(document.nodes.find((node) => node.id === id)) === copy[candidate]
  ));
  if (matches(version)) return document;
  // A mixed group can be an author's partial edit; only complete known groups qualify.
  if (!STOCK_LANGUAGE_GROUPS.some((candidate) => candidate !== version && matches(candidate))) return null;
  return {
    ...document,
    nodes: document.nodes.map((node) => {
      const copy = STOCK_LANGUAGE_TEXT[node.id as keyof typeof STOCK_LANGUAGE_TEXT];
      return copy && node.kind === 'text'
        ? { ...node, content: { ...node.content, text: copy[version] } }
        : node;
    }),
  };
}

/** Final read-only boundary; callers must apply this after any persisted migration decision. */
export async function normalizeLegacyZhHantHomeRead(
  document: BuilderCanvasDocument,
  locale: SiteLocale,
  isHomePage: boolean,
  discovery: AiIntakeDiscovery = getAiIntakeDiscovery(locale),
): Promise<BuilderCanvasDocument> {
  const normalized = normalizeLegacyZhHantHome(document, locale, isHomePage);
  if (!await hasLegacyJulyZhHantHomeDualTree(normalized, locale, isHomePage)) return normalized;
  const stock = restoreKnownDesktopProjection(normalized, discovery);
  if (!stock) return normalized;
  const projected = rewriteKnownStockLanguageCopy(projectKnownDesktopNodes(stock, discovery), 'after');
  if (!projected) return normalized;
  return same(projected.nodes, normalized.nodes) ? normalized : projected;
}

const ZINDEX_INSERTION_IDS = ['home-hero-email-consultation-link', 'home-attorney-detail-flow'] as const;
const KNOWN_INSERTED_GROUP_ID = 'home-attorney-detail-flow';

/** Comparison-only: save compaction reindexes zIndex and fills the inserted group defaults. Actual nodes stay unchanged. */
function nodesForJulyFingerprint(nodes: BuilderCanvasNode[]): BuilderCanvasNode[] {
  const insertions = ZINDEX_INSERTION_IDS
    .map((id) => nodes.findIndex((node) => node.id === id))
    .filter((index) => index >= 0)
    .sort((left, right) => left - right);
  const sequential = insertions.length === ZINDEX_INSERTION_IDS.length
    && nodes.every((node, index) => node.zIndex === index);
  return nodes.map((node, index) => {
    const zIndex = sequential
      ? index - insertions.filter((position) => position < index).length
      : node.zIndex;
    if (node.id !== KNOWN_INSERTED_GROUP_ID || node.kind !== 'container') {
      return zIndex === node.zIndex ? node : { ...node, zIndex };
    }
    const content = { ...node.content };
    if (content.activeIndex === 0) delete content.activeIndex;
    if (content.sticky === false) delete content.sticky;
    if (zIndex === node.zIndex && content.activeIndex === node.content.activeIndex
      && content.sticky === node.content.sticky) {
      return node;
    }
    return { ...node, zIndex, content };
  });
}

/** Exact public July dual-tree only. Any authored node/content/style/viewport edit opts out. */
export async function hasLegacyJulyZhHantHomeDualTree(
  document: BuilderCanvasDocument,
  locale: SiteLocale,
  isHomePage: boolean,
): Promise<boolean> {
  if (!isHome(document, locale, isHomePage)) return false;
  const desktop = restoreKnownDesktopProjection(document, getAiIntakeDiscovery('zh-hant'));
  const stockDocument = desktop && rewriteKnownStockLanguageCopy(desktop, 'before');
  if (!stockDocument) return false;
  const value = comparable({ locale: stockDocument.locale, stageWidth: stockDocument.stageWidth,
    stageHeight: stockDocument.stageHeight, nodes: nodesForJulyFingerprint(stockDocument.nodes) });
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(value)));
  const fingerprint = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  return fingerprint === '8f75a13335144f4c9a7ac8dc0dbb1e93173eee5bc075318bde75406d86437a3f';
}
