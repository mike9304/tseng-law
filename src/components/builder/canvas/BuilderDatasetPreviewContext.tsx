'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ColumnPost } from '@/lib/columns';
import type { BuilderDataBindingPreviewTarget } from '@/lib/builder/datasets';
import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';

const BuilderDatasetPreviewContext = createContext<readonly BuilderDataBindingPreviewTarget[]>([]);
const BuilderColumnPostsContext = createContext<ColumnPost[]>([]);
const BuilderFaqCategoriesContext = createContext<BuilderFaqCategory[]>([]);
const BuilderFaqItemsContext = createContext<BuilderFaqItem[]>([]);
const BuilderPageIsHomeContext = createContext(false);

export function BuilderDatasetPreviewProvider({
  children,
  columnPosts,
  faqCategories,
  faqItems,
  targets,
  isHomePage = false,
}: {
  children: ReactNode;
  columnPosts?: ColumnPost[];
  faqCategories?: BuilderFaqCategory[];
  faqItems?: BuilderFaqItem[];
  targets?: readonly BuilderDataBindingPreviewTarget[];
  isHomePage?: boolean;
}) {
  return (
    <BuilderDatasetPreviewContext.Provider value={targets ?? []}>
      <BuilderColumnPostsContext.Provider value={columnPosts ?? []}>
        <BuilderFaqCategoriesContext.Provider value={faqCategories ?? []}>
          <BuilderFaqItemsContext.Provider value={faqItems ?? []}>
            <BuilderPageIsHomeContext.Provider value={isHomePage}>{children}</BuilderPageIsHomeContext.Provider>
          </BuilderFaqItemsContext.Provider>
        </BuilderFaqCategoriesContext.Provider>
      </BuilderColumnPostsContext.Provider>
    </BuilderDatasetPreviewContext.Provider>
  );
}

export function useBuilderDatasetPreviewTargets(): readonly BuilderDataBindingPreviewTarget[] {
  return useContext(BuilderDatasetPreviewContext);
}

export function useBuilderPageIsHome(): boolean {
  return useContext(BuilderPageIsHomeContext);
}

export function useBuilderColumnPosts(): ColumnPost[] {
  return useContext(BuilderColumnPostsContext);
}

export function useBuilderFaqCategories(): BuilderFaqCategory[] {
  return useContext(BuilderFaqCategoriesContext);
}

export function useBuilderFaqItems(): BuilderFaqItem[] {
  return useContext(BuilderFaqItemsContext);
}
