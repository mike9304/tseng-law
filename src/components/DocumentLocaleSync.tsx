'use client';

import { useEffect } from 'react';
import type { DocumentLanguage } from '@/app/fonts';
import { isRtlDocumentLanguage } from '@/lib/public-guidance';

export type DocumentDirection = 'ltr' | 'rtl';

type DocumentLocaleState = {
  language: DocumentLanguage;
  /** `<html dir>`: right-to-left for Arabic, left-to-right for every other language. */
  direction: DocumentDirection;
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
    direction: isRtlDocumentLanguage(language) ? 'rtl' : 'ltr',
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
    // Client-side locale switches must move `dir` with `lang`, or a visitor
    // leaving /ar for /vi would keep a right-to-left document.
    root.dir = nextState.direction;
    root.className = nextState.className;
  }, [fontClassName, language, managedFontClassNames]);

  return null;
}
