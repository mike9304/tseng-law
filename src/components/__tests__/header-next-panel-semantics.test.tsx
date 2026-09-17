import { createRequire } from 'node:module';
import { describe, expect, it, vi } from 'vitest';
import type { SiteLocale } from '@/lib/locales';

// Next App Router uses a bundled React renderer; standalone React18 serializes
// inert differently. Keep this runtime override isolated to this test file.
const runtime = await vi.hoisted(async () => {
  const { createRequire } = await import('node:module');
  const load = createRequire(process.cwd() + '/package.json');
  return {
    react: load('next/dist/compiled/react'),
    jsx: load('next/dist/compiled/react/jsx-runtime'),
    jsxDev: load('next/dist/compiled/react/jsx-dev-runtime'),
    server: load('next/dist/compiled/react-dom/server.node'),
  };
});
vi.mock('react', () => ({ ...runtime.react, default: runtime.react }));
vi.mock('react/jsx-runtime', () => runtime.jsx);
vi.mock('react/jsx-dev-runtime', () => runtime.jsxDev);
vi.mock('next/navigation', () => ({ usePathname: () => '/en/design-review-missing-page' }));
vi.mock('next/link', () => ({ default: ({ children, ...props }: Record<string, unknown>) => runtime.react.createElement('a', props, children) }));
vi.mock('next/image', () => ({ default: ({ alt, src }: Record<string, unknown>) => runtime.react.createElement('img', { alt, src }) }));
// These independent overlays are outside the mounted desktop panel contract.
vi.mock('@/components/SearchOverlay', () => ({ default: () => null }));
vi.mock('@/components/MobileNavDrawer', () => ({ default: () => null }));
import Header from '@/components/Header';

const load = createRequire(import.meta.url);
describe('Desktop panel SSR with the actual Next React renderer', () => {
  it.each(['ko', 'en', 'zh-hant', 'ja'] as const)('makes every initially closed %s panel inert before hydration', (locale: SiteLocale) => {
    const warnings: string[] = [];
    const consoleError = vi.spyOn(console, 'error').mockImplementation((...args) => {
      warnings.push(args.map(String).join(' '));
    });
    try {
    const html = runtime.server.renderToStaticMarkup(runtime.react.createElement(Header, { locale }));
    const panels = html.match(/<div\b[^>]*\bid="mega-panel-[^"]+"[^>]*>/g) ?? [];
    expect(panels.length).toBeGreaterThan(0);
    for (const panel of panels) {
      expect(panel).toContain('inert=""');
      expect(panel).toContain('aria-hidden="true"');
    }
    expect(warnings.filter((warning) => warning.includes('inert'))).toEqual([]);
    } finally {
      consoleError.mockRestore();
    }
  });
  it('uses matching bundled element and server runtimes', () => {
    expect(runtime.react).toBe(load('next/dist/compiled/react'));
    expect(runtime.server).toBe(load('next/dist/compiled/react-dom/server.node'));
  });
});
