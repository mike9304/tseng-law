// Single source of truth for which standard-page slugs support "decompose to
// edit" (converting a live-matching composite page into an editable node tree).
//
// Kept as a pure, dependency-free module so BOTH the server seed
// (STANDARD_PAGE_DECOMPOSERS in seed-pages.ts) and the client PageSwitcher can
// share it without pulling server-only code (fs/@vercel/blob) into the client
// bundle. '' is the home page. NOTE: 'columns' is intentionally excluded — it is
// a blog-feed page with no decomposer.
//
// A test in __tests__/seed-composite-pages.test.ts asserts that
// Object.keys(STANDARD_PAGE_DECOMPOSERS) stays in sync with this list.
export const DECOMPOSABLE_PAGE_SLUGS = [
  '',
  'about',
  'services',
  'contact',
  'lawyers',
  'faq',
  'pricing',
  'reviews',
  'privacy',
  'disclaimer',
] as const;
