import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

export async function checkBuilderA11y(page: Page, context: string = '[data-editor-shell]'): Promise<void> {
  const results = await new AxeBuilder({ page })
    .include(context)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const summary = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    nodes: violation.nodes.slice(0, 3).map((node) => node.target.join(' ')),
  }));

  expect(summary).toEqual([]);
}
