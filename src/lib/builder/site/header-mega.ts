import type { Locale } from '@/lib/locales';
import type { BuilderNavItem } from './types';

export type HeaderMegaKey = 'services' | 'videos';

export type HeaderMegaLink = {
  id: string;
  label: string;
  href: string;
  source?: BuilderNavItem;
};

export type HeaderMegaPanel = {
  key: HeaderMegaKey;
  title: string;
  links: HeaderMegaLink[];
};

type HeaderMegaTemplate = {
  key: HeaderMegaKey;
  title: Record<Locale, string>;
  links: Array<{
    id: string;
    label: Record<Locale, string>;
    href: string;
  }>;
};

const HEADER_MEGA_TEMPLATES: HeaderMegaTemplate[] = [
  {
    key: 'services',
    title: { ko: '업무분야', 'zh-hant': '服務領域', en: 'Services' },
    links: [
      {
        id: 'investment',
        label: { ko: '투자·법인설립', 'zh-hant': '投資·公司設立', en: 'Investment & Company Setup' },
        href: '/services/investment',
      },
      {
        id: 'civil',
        label: { ko: '민사소송·손해배상', 'zh-hant': '民事訴訟·損害賠償', en: 'Civil Litigation & Damages' },
        href: '/services/civil',
      },
      {
        id: 'family',
        label: { ko: '가사소송', 'zh-hant': '家事訴訟', en: 'Family Litigation' },
        href: '/services/family',
      },
      {
        id: 'labor',
        label: { ko: '노동법·고용분쟁', 'zh-hant': '勞動法·僱傭爭議', en: 'Labor & Employment' },
        href: '/services/labor',
      },
      {
        id: 'criminal',
        label: { ko: '형사소송', 'zh-hant': '刑事訴訟', en: 'Criminal Litigation' },
        href: '/services/criminal',
      },
      {
        id: 'ip',
        label: { ko: '지적재산·금융분쟁', 'zh-hant': '智慧財產·金融爭議', en: 'IP & Financial Disputes' },
        href: '/services/ip',
      },
      {
        id: 'all',
        label: { ko: '전체 보기', 'zh-hant': '查看全部', en: 'View All' },
        href: '/services',
      },
    ],
  },
  {
    key: 'videos',
    title: { ko: '미디어센터', 'zh-hant': '媒體中心', en: 'Media Center' },
    links: [
      {
        id: 'youtube',
        label: { ko: 'YouTube @weilawyer', 'zh-hant': 'YouTube @weilawyer', en: 'YouTube @weilawyer' },
        href: 'https://www.youtube.com/@weilawyer',
      },
      {
        id: 'naver',
        label: { ko: '네이버 블로그', 'zh-hant': 'Naver 部落格', en: 'Naver Blog' },
        href: 'https://blog.naver.com/wei_lawyer/223461663913',
      },
      {
        id: 'videos',
        label: { ko: '영상/채널 페이지', 'zh-hant': '影音頁面', en: 'Videos / Channels' },
        href: '/videos',
      },
    ],
  },
];

function localizedLabel(label: BuilderNavItem['label'], locale: Locale, fallback: Record<Locale, string>): string {
  if (typeof label === 'string') return label;
  return label[locale] || label.ko || label.en || label['zh-hant'] || fallback[locale];
}

function localizeHref(href: string, locale: Locale): string {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  if (/^\/(?:ko|en|zh-hant)(?:\/|$)/.test(href)) return href;
  return `/${locale}${href.startsWith('/') ? href : `/${href}`}`;
}

export function getHeaderMegaTemplates(): HeaderMegaTemplate[] {
  return HEADER_MEGA_TEMPLATES;
}

export function createHeaderMegaChildren(key: HeaderMegaKey): BuilderNavItem[] {
  const template = HEADER_MEGA_TEMPLATES.find((candidate) => candidate.key === key);
  if (!template) return [];
  return template.links.map((link) => ({
    id: `nav-${key}-${link.id}`,
    pageId: link.href.startsWith('/') ? `external-${key}-${link.id}` : `external-${key}-${link.id}`,
    href: link.href,
    label: link.label,
  }));
}

export function mergeHeaderMegaChildren(item: BuilderNavItem, key: HeaderMegaKey): { item: BuilderNavItem; changed: boolean } {
  const defaults = createHeaderMegaChildren(key);
  if (defaults.length === 0) return { item, changed: false };

  const existingChildren = item.children ?? [];
  let changed = !item.children;
  const nextChildren = [...existingChildren];

  for (const child of defaults) {
    const existing = nextChildren.find((candidate) => candidate.id === child.id || candidate.href === child.href);
    if (!existing) {
      nextChildren.push(child);
      changed = true;
    }
  }

  if (!changed) return { item, changed: false };
  return {
    item: {
      ...item,
      children: nextChildren,
    },
    changed: true,
  };
}

export function buildHeaderMegaPanels(locale: Locale, navItems: Array<{ key: string; source?: BuilderNavItem }>): HeaderMegaPanel[] {
  return HEADER_MEGA_TEMPLATES.map((template) => {
    const source = navItems.find((item) => item.key === template.key)?.source;
    const sourceChildren = source?.children ?? [];
    const defaultChildren = createHeaderMegaChildren(template.key);
    const children = sourceChildren.length > 0 ? sourceChildren : defaultChildren;
    const defaultById = new Map(defaultChildren.map((child) => [child.id, child]));

    return {
      key: template.key,
      title: source ? localizedLabel(source.label, locale, template.title) : template.title[locale],
      links: children.map((child) => {
        const defaultLabel = defaultById.get(child.id)?.label;
        const fallback = typeof defaultLabel === 'string'
          ? { ko: defaultLabel, 'zh-hant': defaultLabel, en: defaultLabel }
          : defaultLabel ?? template.title;
        return {
          id: child.id,
          label: localizedLabel(child.label, locale, fallback),
          href: localizeHref(child.href, locale),
          source: child,
        };
      }),
    };
  });
}
