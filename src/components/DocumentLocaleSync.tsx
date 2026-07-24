'use client';

import { useEffect } from 'react';
import type { DocumentLanguage } from '@/app/fonts';

type DocumentLocaleState = {
  language: DocumentLanguage;
  className: string;
};

type DocumentLocaleSyncProps = {
  language: DocumentLanguage;
  fontClassName: string;
  managedFontClassNames: readonly string[];
};

function splitClassNames(className: string): string[] {
  return className.split(/\s+/).filter(Boolean);
}

export function getSynchronizedDocumentLocaleState(
  currentClassName: string,
  language: DocumentLanguage,
  fontClassName: string,
  managedFontClassNames: readonly string[],
): DocumentLocaleState {
  const managedClasses = new Set(managedFontClassNames);
  const nextClasses = new Set(
    splitClassNames(currentClassName).filter((className) => !managedClasses.has(className)),
  );

  for (const className of splitClassNames(fontClassName)) {
    nextClasses.add(className);
  }

  return {
    language,
    className: Array.from(nextClasses).join(' '),
  };
}

export default function DocumentLocaleSync({
  language,
  fontClassName,
  managedFontClassNames,
}: DocumentLocaleSyncProps) {
  useEffect(() => {
    const root = document.documentElement;
    const nextState = getSynchronizedDocumentLocaleState(
      root.className,
      language,
      fontClassName,
      managedFontClassNames,
    );

    root.lang = nextState.language;
    root.className = nextState.className;
  }, [fontClassName, language, managedFontClassNames]);

  return null;
}
