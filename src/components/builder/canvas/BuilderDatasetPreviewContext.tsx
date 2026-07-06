'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { ColumnPost } from '@/lib/columns';
import type { BuilderDataBindingPreviewTarget } from '@/lib/builder/datasets';
import type { BuilderFaqCategory, BuilderFaqItem } from '@/lib/builder/faq/faq-shared';

const BuilderDatasetPreviewContext = createContext<readonly BuilderDataBindingPreviewTarget[]>([]);
const BuilderColumnPostsContext = createContext<ColumnPost[]>([]);
const BuilderFaqCategoriesContext = createContext<BuilderFaqCategory[]>([]);
const BuilderFaqItemsContext = createContext<BuilderFaqItem[]>([]);

export function BuilderDatasetPreviewProvider({
  children,
  columnPosts,
  faqCategories,
  faqItems,
  targets,
}: {
  children: ReactNode;
  columnPosts?: ColumnPost[];
  faqCategories?: BuilderFaqCategory[];
  faqItems?: BuilderFaqItem[];
  targets?: readonly BuilderDataBindingPreviewTarget[];
}) {
  return (
    <BuilderDatasetPreviewContext.Provider value={targets ?? []}>
      <BuilderColumnPostsContext.Provider value={columnPosts ?? []}>
        <BuilderFaqCategoriesContext.Provider value={faqCategories ?? []}>
          <BuilderFaqItemsContext.Provider value={faqItems ?? []}>
            {children}
          </BuilderFaqItemsContext.Provider>
        </BuilderFaqCategoriesContext.Provider>
      </BuilderColumnPostsContext.Provider>
    </BuilderDatasetPreviewContext.Provider>
  );
}

export function useBuilderDatasetPreviewTargets(): readonly BuilderDataBindingPreviewTarget[] {
  return useContext(BuilderDatasetPreviewContext);
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
