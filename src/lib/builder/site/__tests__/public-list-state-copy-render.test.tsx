import { renderToStaticMarkup } from 'react-dom/server';
import { vi } from 'vitest';
import { PublishedSitePageView } from '@/lib/builder/site/public-page';
import type { Locale } from '@/lib/locales';
import { publicListFixture } from './public-list-state-fixture';
import { createPublicListStateRenderTests } from './public-list-render-contract';
vi.mock('next/navigation', () => ({
  usePathname: () => '/ko',
  useRouter: () => ({ replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

createPublicListStateRenderTests(
  async (locale, state) => renderToStaticMarkup(await PublishedSitePageView({
    resolved: publicListFixture(locale as Locale, state),
    searchParams: state === 'filtered-empty' ? { q: 'design-no-match' } : {},
  })),
  (locale) => `/${locale}/design-fixtures/public-list`,
);
