'use client';

import { useEffect, useRef } from 'react';
import { useBuilderCanvasStore } from '@/lib/builder/canvas/store';
import { buildGoogleFontsUrl } from '@/lib/builder/canvas/fonts';

/**
 * Dynamically injects Google Fonts <link> tags based on fonts used
 * in the current canvas document. Updates when nodes change.
 */
export default function GoogleFontsLoader() {
  const loadedRef = useRef(new Set<string>());
  const document = useBuilderCanvasStore((s) => s.document);

  useEffect(() => {
    if (!document?.nodes) return;

    const usedFonts = new Set<string>();
    for (const node of document.nodes) {
      const content = node.content as Record<string, unknown>;
      if (typeof content.fontFamily === 'string' && content.fontFamily !== 'system-ui') {
        usedFonts.add(content.fontFamily);
      }
    }

    const newFonts = [...usedFonts].filter((f) => !loadedRef.current.has(f));
    if (newFonts.length === 0) return;

    const url = buildGoogleFontsUrl(newFonts);
    if (!url) return;

    const link = window.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.dataset.builderFonts = 'true';
    window.document.head.appendChild(link);

    for (const f of newFonts) {
      loadedRef.current.add(f);
    }
  }, [document?.nodes]);

  return null;
}
