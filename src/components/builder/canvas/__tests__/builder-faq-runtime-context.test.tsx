import { readFileSync } from 'node:fs';
import path from 'node:path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import {
  BuilderDatasetPreviewProvider,
  useBuilderFaqCategories,
  useBuilderFaqItems,
} from '@/components/builder/canvas/BuilderDatasetPreviewContext';
import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

const FAQ_CATEGORY: BuilderFaqCategory = {
  categoryId: 'company-setup',
  slug: 'company-setup',
  label: {
    ko: '법인설립',
    'zh-hant': '公司設立',
    en: 'Company Setup',
    ja: '会社設立',
  },
  sortOrder: 10,
  createdAt: '2026-05-20T00:00:00.000Z',
  updatedAt: '2026-05-20T00:00:00.000Z',
};

const FAQ_ITEM: BuilderFaqItem = {
  faqId: 'faq-builder-context-1',
  slug: 'builder-context-question',
  locale: 'ko',
  question: '빌더 FAQ 캔버스가 실제 FAQ 앱 데이터를 쓰나요?',
  answer: 'published FAQ route와 같은 데이터가 context를 통해 composite에 전달됩니다.',
  categoryId: 'company-setup',
  tags: ['builder'],
  status: 'published',
  sortOrder: 10,
  schemaEnabled: true,
  createdAt: '2026-05-20T00:00:00.000Z',
  updatedAt: '2026-05-20T00:00:00.000Z',
};

function FaqRuntimeProbe() {
  const categories = useBuilderFaqCategories();
  const items = useBuilderFaqItems();

  return (
    <output>
      {categories.map((category) => category.label.ko).join(',')}
      {'|'}
      {items.map((item) => item.question).join(',')}
    </output>
  );
}

describe('builder FAQ runtime context', () => {
  it('provides FAQ app categories and items to canvas descendants', () => {
    const html = renderToStaticMarkup(
      <BuilderDatasetPreviewProvider faqCategories={[FAQ_CATEGORY]} faqItems={[FAQ_ITEM]}>
        <FaqRuntimeProbe />
      </BuilderDatasetPreviewProvider>,
    );

    expect(html).toContain('법인설립');
    expect(html).toContain('빌더 FAQ 캔버스가 실제 FAQ 앱 데이터를 쓰나요?');
  });

  it('keeps admin-builder FAQ app data wired into composite canvas rendering', () => {
    const adminBuilderPage = read('src/app/(builder)/[locale]/admin-builder/page.tsx');
    const sandboxPage = read('src/components/builder/canvas/SandboxPage.tsx');
    const workspace = read('src/components/builder/canvas/SandboxEditorWorkspace.tsx');
    const workspaceTypes = read('src/components/builder/canvas/SandboxEditorWorkspace.types.ts');
    const canvasNode = read('src/components/builder/canvas/CanvasNode.tsx');

    expect(adminBuilderPage).toContain("import { listFaqCategories, listFaqItems } from '@/lib/builder/faq/faq-engine';");
    expect(adminBuilderPage).toContain('listFaqItems({ locale, status: \'published\' })');
    expect(adminBuilderPage).toContain('faqCategories={faqCategories}');
    expect(adminBuilderPage).toContain('faqItems={faqItems}');

    expect(sandboxPage).toContain('faqCategories?: BuilderFaqCategory[];');
    expect(sandboxPage).toContain('faqItems?: BuilderFaqItem[];');
    expect(sandboxPage).toContain('faqCategories={faqCategories}');
    expect(sandboxPage).toContain('faqItems={faqItems}');

    expect(workspaceTypes).toContain('faqCategories?: BuilderFaqCategory[];');
    expect(workspaceTypes).toContain('faqItems?: BuilderFaqItem[];');
    expect(workspace).toContain('faqCategories={faqCategories}');
    expect(workspace).toContain('faqItems={faqItems}');

    expect(canvasNode).toContain('useBuilderFaqCategories');
    expect(canvasNode).toContain('useBuilderFaqItems');
    expect(canvasNode).toContain('{ columnPosts, faqCategories, faqItems }');
  });
});
