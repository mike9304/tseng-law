'use client';

import { createContext, useContext } from 'react';
import type { FormValues } from './conditional';

export interface BuilderFormRuntimeValue {
  mode: 'edit' | 'preview' | 'published';
  values: FormValues;
  errors: Record<string, string | undefined>;
  activeFieldIds?: Set<string>;
  isLastStep: boolean;
  updateValue: (name: string, value: string | string[] | undefined) => void;
  clearError: (name: string) => void;
}

const BuilderFormRuntimeContext = createContext<BuilderFormRuntimeValue | null>(null);

export const BuilderFormRuntimeProvider = BuilderFormRuntimeContext.Provider;

export function useBuilderFormRuntime(): BuilderFormRuntimeValue | null {
  return useContext(BuilderFormRuntimeContext);
}
