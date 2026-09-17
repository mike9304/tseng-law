import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const navigationState = vi.hoisted(() => ({
  pathname: '/en',
}));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

import PageHeader from '@/components/PageHeader';
import styles from '@/components/PublicChrome.module.css';

function reactEscapedText(value: string): string {
  return renderToStaticMarkup(<span>{value}</span>)
    .replace(/^<span>/, '')
    .replace(/<\/span>$/, '');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function headlineInner(html: string): string {
  const match = html.match(
    /<h1\b[^>]*data-builder-surface-key="headline"[^>]*>([\s\S]*?)<\/h1>/,
  );
  expect(match).not.toBeNull();
  return match?.[1] ?? '';
}

function stripProtectedSpans(markup: string): string {
  const className = escapeRegExp(String(styles.protectedTerm));
  return markup.replace(new RegExp(String.raw`<span class="${className}">([\s\S]*?)<\/span>`, 'g'), '$1');
}

function countProtectedTokens(html: string, token: string): number {
  const className = escapeRegExp(String(styles.protectedTerm));
  const tokenPattern = escapeRegExp(token);
  return (
    html.match(new RegExp(`<span class="${className}">${tokenPattern}<\/span>`, 'g')) ?? []
  ).length;
}

function renderHeader(
  locale: 'ko' | 'ja' | 'zh-hant' | 'en',
  title: string,
  extra?: { label?: string; description?: string; children?: ReactNode },
) {
  navigationState.pathname = `/${locale}`;
  return renderToStaticMarkup(
    <PageHeader
      locale={locale}
      label={extra?.label ?? 'Section'}
      title={title}
      description={extra?.description}
    >
      {extra?.children}
    </PageHeader>,
  );
}

describe('PageHeader protected terms (SSR markup, not browser DOM)', () => {
  beforeEach(() => {
    navigationState.pathname = '/en';
  });

  it('keeps the presentation class name available for span stripping', () => {
    expect(styles.protectedTerm).toEqual(expect.any(String));
    expect(String(styles.protectedTerm).length).toBeGreaterThan(0);
  });

  it('wraps every exact JA 弁護士 token in the headline while preserving characters, punctuation, and repeats', () => {
    const title = '弁護士。弁護士、弁護士';
    const html = renderHeader('ja', title, {
      label: '取扱業務',
      description: '説明',
      children: <div>CHILD_SLOT</div>,
    });
    const inner = headlineInner(html);

    expect(stripProtectedSpans(inner)).toBe(reactEscapedText(title));
    expect(countProtectedTokens(html, '弁護士')).toBe(3);
    expect(countProtectedTokens(inner, '弁護士')).toBe(3);
    expect(html.replace(/<h1\b[\s\S]*?<\/h1>/, '')).toContain(reactEscapedText(title));
    expect(html.replace(/<h1\b[\s\S]*?<\/h1>/, '')).not.toContain(String(styles.protectedTerm));
    expect(html).toContain('data-builder-surface-key="headline"');
    expect(html).toContain('data-builder-surface-key="section-label"');
    expect(html).toContain('data-builder-surface-key="description"');
    expect(html).toContain('CHILD_SLOT');
    expect(html).toContain('取扱業務');
    expect(html).toContain('説明');
  });

  it('wraps every exact EN Korea-Taiwan token, including repeats, punctuation, and React escaping', () => {
    const title = 'Korea-Taiwan & Korea-Taiwan: "desk" <note>';
    const html = renderHeader('en', title, {
      label: 'Services',
      description: 'Support',
      children: <span>CHILD_SLOT</span>,
    });
    const inner = headlineInner(html);

    expect(stripProtectedSpans(inner)).toBe(reactEscapedText(title));
    expect(inner).toContain('&amp;');
    expect(inner).toContain('&quot;desk&quot;');
    expect(inner).toContain('&lt;note&gt;');
    expect(countProtectedTokens(html, 'Korea-Taiwan')).toBe(2);
    expect(html.replace(/<h1\b[\s\S]*?<\/h1>/, '')).toContain(reactEscapedText(title));
    expect(html.replace(/<h1\b[\s\S]*?<\/h1>/, '')).not.toContain(String(styles.protectedTerm));
    expect(html).toContain('data-builder-surface-key="headline"');
    expect(html).toContain('data-builder-surface-key="section-label"');
    expect(html).toContain('data-builder-surface-key="description"');
    expect(html).toContain('CHILD_SLOT');
  });

  it('leaves nonmatching titles and other locales without protected spans', () => {
    const cases = [
      ['en', 'Pricing'] as const,
      ['en', 'Korea Taiwan'] as const,
      ['ja', '費用案内'] as const,
      ['ko', '변호사와 Korea-Taiwan'] as const,
      ['zh-hant', '律師與 Korea-Taiwan 弁護士'] as const,
    ];

    cases.forEach(([locale, title]) => {
      const html = renderHeader(locale, title);
      const inner = headlineInner(html);
      expect(inner).toBe(reactEscapedText(title));
      expect(html).not.toContain(String(styles.protectedTerm));
      expect(countProtectedTokens(html, '弁護士')).toBe(0);
      expect(countProtectedTokens(html, 'Korea-Taiwan')).toBe(0);
      expect(html.replace(/<h1\b[\s\S]*?<\/h1>/, '')).toContain(reactEscapedText(title));
    });
  });
});
