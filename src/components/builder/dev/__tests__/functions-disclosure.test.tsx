import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import FunctionsAdmin from '../FunctionsAdmin';
import { getFunctionsCopy } from '../functions-copy';

const SELECTOR = 'data-builder-dev-disclosure="function-sandbox"';
const FALSE_CLAIMS = [
  'production isolated',
  'production-isolated',
  'deployed',
  'live runtime',
  'production-ready',
];

function countOccurrences(haystack: string, needle: string): number {
  return haystack.split(needle).length - 1;
}

describe('FunctionsAdmin developer-function sandbox disclosure', () => {
  it.each(['ko', 'zh-hant', 'en'] as const)(
    'renders exactly one truthful localized DEMO sandbox banner for %s',
    (locale) => {
      const html = renderToStaticMarkup(<FunctionsAdmin locale={locale} />);
      const copy = getFunctionsCopy(locale);

      // The visible marker is always rendered exactly once per locale.
      expect(countOccurrences(html, SELECTOR)).toBe(1);

      // An explicit DEMO label is present, and the real bounded execution
      // runtime (worker-vm) is named rather than the dead node-stub field.
      expect(html).toContain('DEMO');
      expect(html).toContain('worker-vm');
      expect(html).not.toContain('node-stub');

      // The localized notice content is actually emitted to the DOM, not just
      // a source-level constant.
      expect(html).toContain(copy.sandboxNotice);

      // Negative assertions: the rendered banner must never claim production
      // isolation, deployment, a live runtime, or production-readiness.
      for (const claim of FALSE_CLAIMS) {
        expect(html).not.toContain(claim);
      }
    },
  );

  it('renders the banner with role=status and a useful localized aria-label', () => {
    const html = renderToStaticMarkup(<FunctionsAdmin locale="en" />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="Test runs execute only in a bounded worker-vm sandbox');
    // The honest limitation (not production-grade, not a public execution
    // surface) is part of the rendered text.
    expect(html).toContain('not production-grade');
    expect(html).toContain('not a public execution surface');
  });
});
