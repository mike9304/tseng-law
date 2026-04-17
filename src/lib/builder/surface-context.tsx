'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type SurfaceOverrideValue = string;

export interface BuilderSurfaceContextValue {
  nodeId: string;
  mode: 'edit' | 'preview' | 'published';
  overrides: Record<string, SurfaceOverrideValue>;
  selectedSurfaceKey: string | null;
}

const defaultValue: BuilderSurfaceContextValue = {
  nodeId: '',
  mode: 'published',
  overrides: {},
  selectedSurfaceKey: null,
};

const BuilderSurfaceContext = createContext<BuilderSurfaceContextValue>(defaultValue);

export function BuilderSurfaceProvider({
  children,
  ...value
}: BuilderSurfaceContextValue & { children: ReactNode }) {
  return <BuilderSurfaceContext.Provider value={value}>{children}</BuilderSurfaceContext.Provider>;
}

export function useBuilderSurfaceContext(): BuilderSurfaceContextValue {
  return useContext(BuilderSurfaceContext);
}

export function SurfaceText({
  surfaceKey,
  children,
}: {
  surfaceKey: string;
  children: ReactNode;
}) {
  const { overrides } = useContext(BuilderSurfaceContext);
  const override = overrides[surfaceKey];
  return <>{override != null ? override : children}</>;
}
