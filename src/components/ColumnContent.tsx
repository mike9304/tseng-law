'use client';

import {
  Children,
  cloneElement,
  isValidElement,
  type ReactNode,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { remarkUnderline } from '@/lib/builder/columns/remark-underline';
import type { SiteLocale } from '@/lib/locales';
import { getLocalizedConsultationMailto } from '@/lib/consultation/localized-mailto';
import { CONSULTATION_EMAIL, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import type { GuidanceLocale4 } from '@/lib/public-guidance';
import { remarkColumnSectionIds } from '@/lib/column-toc';

const CONSULTATION_CTA_LABELS: Record<SiteLocale, ReadonlySet<string>> = {
  ko: new Set([
    '상담 문의',
    '문의하기',
    '상담하기',
    '상담 신청',
    '이메일 상담',
    '이메일 상담 신청',
    '증준외 대만 변호사에게 이메일 상담',
  ]),
  'zh-hant': new Set([
    '聯絡我們',
    '聯絡諮詢',
    '預約諮詢',
    '電子郵件諮詢',
    '寄信諮詢曾雋崴律師',
  ]),
  en: new Set([
    'contact us',
    'contact our office',
    'book consultation',
    'request consultation',
    'email attorney tseng for consultation',
  ]),
  ja: new Set([
    'お問い合わせ',
    'ご相談・お問い合わせ',
    'お問い合わせ・ご相談',
    '相談予約',
    'メールで相談',
    '曾雋崴弁護士にメールで相談',
  ]),
};

function normalizeLinkLabel(label: string): string {
  return label.replace(/\s+/g, ' ').trim().toLocaleLowerCase('en-US');
}

function getNodeText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(getNodeText).join('');
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getNodeText(node.props.children);
  }
  return '';
}

function asciiArticleDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => String(
    digit.charCodeAt(0) - (digit >= '۰' ? 0x06f0 : 0x0660),
  ));
}

/** Links have their own authority check; code and existing isolates are opaque. */
function isProtectedArticleNode(node: ReactNode): boolean {
  return isValidElement<{ href?: string; node?: { tagName?: string } }>(node) && (
    node.type === 'a' || node.type === 'code' || node.type === 'bdi'
    || node.props.href != null || node.props.node?.tagName === 'a'
  );
}

/** Isolate only the labelled ID span, not an equal ordinary range elsewhere. */
function isolateArticleNumbers(children: ReactNode, linkedArticle?: string): ReactNode {
  const eligibleText = (node: ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node)) return node.map(eligibleText).join('');
    if (isProtectedArticleNode(node)) return '\0';
    if (isValidElement<{ children?: ReactNode }>(node)) return eligibleText(node.props.children);
    return '';
  };
  const text = eligibleText(children);
  const spans: Array<{ start: number; end: number }> = [];
  if (linkedArticle) {
    for (const match of text.matchAll(/[0-9٠-٩۰-۹]+(?:-[0-9٠-٩۰-۹]+)+/gu)) {
      if (asciiArticleDigits(match[0]) === linkedArticle) {
        spans.push({ start: match.index, end: match.index + match[0].length });
      }
    }
  } else {
    // Explicit Persian, Urdu, Arabic and Hebrew article labels only. Hebrew
    // prefixes cover the actual "in section" / "that in section" references.
    for (const match of text.matchAll(/(?:^|[^\p{L}\p{M}\p{N}])(?:ماده[\u064b-\u065f]*|دفعہ|المادة|(?:שב|ב)?סעיף)\s+([0-9٠-٩۰-۹]+(?:-[0-9٠-٩۰-۹]+)+)(?![\p{L}\p{M}\p{N}-])/gu)) {
      const end = match.index + match[0].length;
      spans.push({ start: end - match[1].length, end });
    }
  }
  if (!spans.length) return children;

  let offset = 0;
  const isolate = (nodes: ReactNode): ReactNode => Children.map(nodes, (node) => {
    if (typeof node === 'string' || typeof node === 'number') {
      const value = String(node);
      const start = offset;
      offset += value.length;
      const matches = spans.filter((span) => span.start >= start && span.end <= offset);
      if (!matches.length) return node;
      const parts: ReactNode[] = [];
      let cursor = 0;
      for (const span of matches) {
        parts.push(value.slice(cursor, span.start - start));
        parts.push(<bdi key={span.start} dir="ltr" style={{ whiteSpace: 'nowrap' }}>{value.slice(span.start - start, span.end - start)}</bdi>);
        cursor = span.end - start;
      }
      parts.push(value.slice(cursor));
      return parts;
    }
    if (isProtectedArticleNode(node)) {
      offset += 1; // Same separator used by eligibleText; matches cannot cross it.
      return node;
    }
    if (isValidElement<{ children?: ReactNode }>(node) && node.props.children != null) {
      return cloneElement(node, undefined, isolate(node.props.children));
    }
    return node;
  });
  return isolate(children);
}

/** Official single-article URLs identify the exact ID independently of language. */
function isolateLinkedArticleNumber(href: string, children: ReactNode): ReactNode {
  try {
    const url = new URL(href);
    if (url.origin !== 'https://law.moj.gov.tw') return children;
    if (/^\/(?:ENG\/)?LawClass\/LawSingle\.aspx$/.test(url.pathname)) {
      const article = url.searchParams.get('flno');
      return article && /^\d+(?:-\d+)+$/.test(article)
        ? isolateArticleNumbers(children, article)
        : children;
    }
    if (/^\/(?:ENG\/)?LawClass\/LawAll\.aspx$/.test(url.pathname)) {
      return isolateArticleNumbers(children);
    }
  } catch {
    // Relative and non-URL links cannot identify an official legal article.
  }
  return children;
}

/**
 * Convert only explicit consultation CTAs that point at the current locale's
 * internal contact route. Ordinary contact-page navigation remains internal.
 */
export function resolveColumnMarkdownLinkHref(
  href: string | undefined,
  label: string,
  locale: SiteLocale | undefined,
): string {
  if (!href || !locale) return href || '#';

  const normalizedHref = href.trim();
  const localeContactRoute = `/${locale}/contact`;
  if (
    normalizedHref !== localeContactRoute
    && !normalizedHref.startsWith(`${localeContactRoute}?`)
    && !normalizedHref.startsWith(`${localeContactRoute}#`)
  ) {
    return href;
  }

  const normalizedLabel = normalizeLinkLabel(label);
  if (!CONSULTATION_CTA_LABELS[locale].has(normalizedLabel)) {
    return href;
  }

  return getConsultationPublicMailto(locale);
}

/**
 * WO-X1 (EN-15 · J21): EN/JA columns end with a fixed "see also" list that
 * pointed readers at the Korean-speaker landing. On those two locales the item
 * is swapped for the first English/Japanese entry path the list does not
 * already carry (or dropped when both are there). The landing page itself and
 * the ko/zh-hant columns are untouched.
 */
const KOREAN_SPEAKER_LANDING_ITEM =
  /^(>[ \t]*[-*][ \t]+)\[[^\]\n]*\]\(\/(?:ko|zh-hant|en|ja)\/korean-lawyer-in-taiwan\/?\)[ \t]*$/gm;

const KOREAN_SPEAKER_LANDING_REPLACEMENTS: Partial<
  Record<SiteLocale, ReadonlyArray<{ href: string; label: string }>>
> = {
  en: [
    { href: '/en/taiwan-lawyer', label: 'English-language consultation in Taipei' },
    { href: '/en/taiwan-company-setup-lawyer', label: 'Company setup for overseas businesses' },
  ],
  ja: [
    { href: '/ja/taiwan-lawyer', label: '日本語で相談できる台湾弁護士' },
    { href: '/ja/taiwan-company-setup-lawyer', label: '日本企業の台湾会社設立' },
  ],
};

export function replaceKoreanSpeakerLandingLinks(content: string, locale?: SiteLocale): string {
  const replacements = locale ? KOREAN_SPEAKER_LANDING_REPLACEMENTS[locale] : undefined;
  if (!replacements) return content;
  const used = new Set(
    replacements
      .filter((item) => content.includes(`](${item.href})`))
      .map((item) => item.href),
  );
  return content.replace(KOREAN_SPEAKER_LANDING_ITEM, (_match, prefix: string) => {
    const next = replacements.find((item) => !used.has(item.href));
    if (!next) return '\u0000DROP\u0000';
    used.add(next.href);
    return `${prefix}[${next.label}](${next.href})`;
  }).replace(/^\u0000DROP\u0000\n?/gm, '');
}

type ColumnUiLocale = SiteLocale | 'vi';

const FOOTNOTE_LABELS: Record<ColumnUiLocale, string> = {
  ko: '각주',
  'zh-hant': '註腳',
  en: 'Footnotes',
  ja: '脚注',
  vi: 'Chú thích',
};

const COLUMN_TABLE_SCROLL_HINTS: Record<ColumnUiLocale, string> = {
  ko: '표가 화면보다 넓으면 좌우로 스크롤해 보세요.',
  'zh-hant': '若表格超出畫面，請左右捲動檢視。',
  en: 'If the table extends beyond the screen, scroll horizontally to see the rest.',
  ja: '表が画面より広い場合は、左右にスクロールしてご覧ください。',
  vi: 'Bảng có thể cuộn sang ngang để xem đầy đủ nội dung.',
};

function getColumnTableScrollHint(locale?: ColumnUiLocale): string {
  return COLUMN_TABLE_SCROLL_HINTS[locale ?? 'ko'];
}

export default function ColumnContent({
  content,
  locale,
  uiLocale = locale,
  sectionIdOffset = 0,
  tableScrollHint,
  consultationLocale,
}: {
  content: string;
  locale?: SiteLocale;
  /** UI labels may be localized independently of the legacy link-rewriting locale. */
  uiLocale?: ColumnUiLocale;
  /** Number of section headings already rendered by an earlier part of the same body. */
  sectionIdOffset?: number;
  /** Wide-table hint for a page language outside `ColumnUiLocale` (the Folio locales). */
  tableScrollHint?: string;
  /** Page language for stock consultation links on guidance articles. */
  consultationLocale?: GuidanceLocale4;
}) {
  return (
    <div className="column-markdown" data-column-content="markdown">
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }], remarkUnderline, [remarkColumnSectionIds, { offset: sectionIdOffset }]]}
        remarkRehypeOptions={
          uiLocale
            ? {
                footnoteLabel: FOOTNOTE_LABELS[uiLocale],
                ...(uiLocale === 'vi' ? { footnoteBackLabel: 'Trở lại nội dung' } : {}),
              }
            : undefined
        }
        components={{
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <span className="column-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt || ''} loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
              </span>
            );
          },
          // `id` comes from remarkColumnSectionIds (sec-1…n, document order).
          h2: ({ children, id }) => (
            <h2 className="blog-heading" id={id}>
              {isolateArticleNumbers(children)}
            </h2>
          ),
          h3: ({ children }) => <h3 className="blog-heading">{isolateArticleNumbers(children)}</h3>,
          p: ({ children }) => {
            // Imported spacer-only paragraphs must not add blank reading lines.
            if (typeof children === 'string' && /^[\s\u200B]*$/.test(children)) return null;
            return <p className="blog-paragraph">{isolateArticleNumbers(children)}</p>;
          },
          table: ({ children }) => {
            const hint = tableScrollHint ?? getColumnTableScrollHint(uiLocale);
            return (
              <div
                className="column-table-wrap"
                role="region"
                aria-label={hint}
                tabIndex={0}
              >
                <p className="column-table-scroll-hint" aria-hidden="true">
                  {hint}
                </p>
                <table>{children}</table>
              </div>
            );
          },
          strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
          u: ({ children }) => <u className="column-underline">{children}</u>,
          a: ({ href, children, id, title, 'aria-label': ariaLabel, 'aria-describedby': ariaDescribedBy }) => {
            const linkLabel = Children.toArray(children).map(getNodeText).join('');
            const resolvedHref = consultationLocale && href === `mailto:${CONSULTATION_EMAIL}`
              ? getLocalizedConsultationMailto(consultationLocale)
              : resolveColumnMarkdownLinkHref(href, linkLabel, locale);
            const linkChildren = isolateLinkedArticleNumber(resolvedHref, children);
            if (uiLocale === 'vi' && resolvedHref.startsWith('#')) {
              // Footnote references need their generated IDs and accessible
              // return labels, and must stay in this article's document.
              return (
                <a href={resolvedHref} id={id} title={title} aria-label={ariaLabel} aria-describedby={ariaDescribedBy} className="link-underline">{linkChildren}</a>
              );
            }
            return (
              <a href={resolvedHref} target="_blank" rel="noopener noreferrer" className="link-underline">{linkChildren}</a>
            );
          },
        }}
      >
        {replaceKoreanSpeakerLandingLinks(content, locale)}
      </ReactMarkdown>
    </div>
  );
}
