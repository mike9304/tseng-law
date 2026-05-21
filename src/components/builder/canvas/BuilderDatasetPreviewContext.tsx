'use client';

import { createContext, useContext, type ReactNode } from 'react';
import type { BuilderDataBindingPreviewTarget } from '@/lib/builder/datasets';

const BuilderDatasetPreviewContext = createContext<readonly BuilderDataBindingPreviewTarget[]>([]);

export function BuilderDatasetPreviewProvider({
  children,
  targets,
}: {
  children: ReactNode;
  targets?: readonly BuilderDataBindingPreviewTarget[];
}) {
  return (
    <BuilderDatasetPreviewContext.Provider value={targets ?? []}>
      {children}
    </BuilderDatasetPreviewContext.Provider>
  );
}

export function useBuilderDatasetPreviewTargets(): readonly BuilderDataBindingPreviewTarget[] {
  return useContext(BuilderDatasetPreviewContext);
}
