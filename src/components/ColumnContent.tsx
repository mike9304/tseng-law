'use client';

import {
  Children,
  isValidElement,
  type ReactNode,
} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { remarkUnderline } from '@/lib/builder/columns/remark-underline';
import type { SiteLocale } from '@/lib/locales';
import { getConsultationPublicMailto } from '@/lib/consultation/public-contact';

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

export default function ColumnContent({
  content,
  locale,
}: {
  content: string;
  locale?: SiteLocale;
}) {
  return (
    <div className="column-markdown" data-column-content="markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkUnderline]}
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
          h2: ({ children }) => <h2 className="blog-heading">{children}</h2>,
          h3: ({ children }) => <h3 className="blog-heading" style={{ fontSize: '1.25rem' }}>{children}</h3>,
          p: ({ children }) => <p className="blog-paragraph">{children}</p>,
          table: ({ children }) => (
            <div className="column-table-wrap"><table>{children}</table></div>
          ),
          strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
          u: ({ children }) => <u className="column-underline">{children}</u>,
          a: ({ href, children }) => {
            const linkLabel = Children.toArray(children).map(getNodeText).join('');
            const resolvedHref = resolveColumnMarkdownLinkHref(href, linkLabel, locale);
            return (
              <a href={resolvedHref} target="_blank" rel="noopener noreferrer" className="link-underline">{children}</a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
