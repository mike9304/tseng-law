'use client';

import { useEffect } from 'react';
import { splitJaPhrases } from './JaPhrases';

/**
 * Phrase breaks for headings that shared components render as plain text (C6, C10, C11, C12), where the ja lane may
 * not change markup. After hydration it inserts <wbr> at the same phrase boundaries JaPhrases uses on the server and
 * marks the heading `data-ja-ph`, which switches it to `word-break: keep-all`. Text content is unchanged; without
 * JavaScript the headings keep the browser's normal Japanese breaking.
 */
export default function JaPhraseEnhancer({ rootId, selectors }: { rootId: string; selectors: readonly string[] }) {
  useEffect(() => {
    const root = document.getElementById(rootId);
    if (!root) return;
    for (const selector of selectors) {
      root.querySelectorAll<HTMLElement>(selector).forEach((element) => {
        if (element.dataset.jaPh) return;
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        const nodes: Text[] = [];
        for (let node = walker.nextNode(); node; node = walker.nextNode()) nodes.push(node as Text);
        const full = nodes.map((node) => node.data).join('');
        const boundaries = new Set<number>();
        let at = 0;
        for (const phrase of splitJaPhrases(full).slice(0, -1)) {
          at += phrase.length;
          boundaries.add(at);
        }
        let offset = 0;
        for (const node of nodes) {
          const start = offset;
          const end = offset + node.data.length;
          offset = end;
          const cuts = [...boundaries].filter((b) => b > start && b < end).sort((a, b) => b - a);
          for (const cut of cuts) {
            const tail = node.splitText(cut - start);
            node.parentNode?.insertBefore(document.createElement('wbr'), tail);
          }
          if (boundaries.has(start) && start > 0) {
            // Break before this node: place the <wbr> outside any no-wrap wrapper that this node opens.
            let anchor: Node = node;
            while (anchor.parentNode && anchor.parentNode !== element && anchor.parentNode.firstChild === anchor) anchor = anchor.parentNode;
            anchor.parentNode?.insertBefore(document.createElement('wbr'), anchor);
          }
        }
        element.dataset.jaPh = 'on';
      });
    }
  }, [rootId, selectors]);
  return null;
}
