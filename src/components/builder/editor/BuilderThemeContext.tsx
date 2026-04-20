'use client';

import { createContext, useContext } from 'react';
import { DEFAULT_THEME, type BuilderTheme } from '@/lib/builder/site/types';

const BuilderThemeContext = createContext<BuilderTheme>(DEFAULT_THEME);

export function BuilderThemeProvider({
  value,
  children,
}: {
  value: BuilderTheme;
  children: React.ReactNode;
}) {
  return (
    <BuilderThemeContext.Provider value={value}>
      {children}
    </BuilderThemeContext.Provider>
  );
}

export function useBuilderTheme(): BuilderTheme {
  return useContext(BuilderThemeContext);
}
