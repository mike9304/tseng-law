import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, test } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), 'utf8');
}

describe('D-POOL-6 public widget design assets', () => {
  test('loads shared widget CSS globally', () => {
    const appLayout = read('src/app/layout.tsx');

    expect(appLayout).toContain("@/lib/builder/components/_shared/widget-tokens.css");
    expect(appLayout).toContain("@/lib/builder/components/_shared/hover-states.css");
  });

  test('keeps required widget CSS modules in place', () => {
    const requiredFiles = [
      'src/lib/builder/components/blogPostCard/BlogPostCard.module.css',
      'src/lib/builder/components/blogFeed/BlogFeed.module.css',
      'src/components/builder/bookings/BookingFlowSteps.module.css',
      'src/lib/builder/components/contactForm/ContactForm.module.css',
      'src/lib/builder/components/faqList/FaqList.module.css',
      'src/lib/builder/components/columnList/ColumnList.module.css',
      'src/lib/builder/components/columnCard/ColumnCard.module.css',
      'src/lib/builder/components/divider/Divider.module.css',
      'src/lib/builder/components/spacer/Spacer.module.css',
      'src/lib/builder/components/icon/Icon.module.css',
      'src/lib/builder/components/videoEmbed/VideoEmbed.module.css',
      'src/lib/builder/components/formInput/FormInput.module.css',
    ];

    for (const file of requiredFiles) {
      expect(existsSync(path.join(root, file)), file).toBe(true);
    }
  });

  test('defines shared light, dark, focus, and reduced-motion widget behavior', () => {
    const tokens = read('src/lib/builder/components/_shared/widget-tokens.css');
    const hover = read('src/lib/builder/components/_shared/hover-states.css');

    expect(tokens).toContain('--builder-widget-text');
    expect(tokens).toContain('--builder-widget-surface');
    expect(tokens).toContain("html[data-theme='dark']");
    expect(tokens).toContain('@media (prefers-color-scheme: dark)');
    expect(tokens).toContain('.builder-widget-empty');
    expect(tokens).toContain('.builder-widget-surface');

    expect(hover).toContain('.builder-button-element:hover');
    expect(hover).toContain('.builder-widget-focusable:focus-visible');
    expect(hover).toContain('@media (prefers-reduced-motion: reduce)');
    expect(hover).toContain('transform: none !important');
  });

  test('retains mobile layout rules for high-density widget surfaces', () => {
    const mobileCriticalFiles = [
      'src/lib/builder/components/blogPostCard/BlogPostCard.module.css',
      'src/lib/builder/components/blogFeed/BlogFeed.module.css',
      'src/components/builder/bookings/BookingFlowSteps.module.css',
      'src/lib/builder/components/contactForm/ContactForm.module.css',
      'src/lib/builder/components/columnList/ColumnList.module.css',
    ];

    for (const file of mobileCriticalFiles) {
      expect(read(file), file).toMatch(/@(media|container)\s*\(max-width:/);
    }
  });
});
