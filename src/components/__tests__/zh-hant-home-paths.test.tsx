import { readFileSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import HeroSearch from '@/components/HeroSearch';
import { CORE_HOME_PATHS } from '@/data/multilingual-international-v2';

describe('zh-hant home hero paths', () => {
  it('omits the company-setup and dispute path links when showHomePaths is false', () => {
    const paths = CORE_HOME_PATHS['zh-hant'];
    const html = renderToStaticMarkup(
      <HeroSearch locale="zh-hant" presentation="editorial" showHomePaths={false} />,
    );
    expect(html).not.toContain('locale-home-paths');
    expect(html).not.toContain(`href="${paths.companySetup.href}"`);
    expect(html).not.toContain(`href="${paths.dispute.href}"`);
    expect(html).toContain('hero-cta-primary');
  });

  it('keeps the paths by default', () => {
    const html = renderToStaticMarkup(<HeroSearch locale="zh-hant" presentation="editorial" />);
    expect(html).toContain('locale-home-paths');
  });

  it('is switched off on the zh-hant home, where CSS used to hide it', () => {
    const source = readFileSync(path.join(process.cwd(), 'src/components/ZhHantHomeBody.tsx'), 'utf8');
    expect(source).toMatch(/<HeroSearch[\s\S]*?showHomePaths=\{false\}[\s\S]*?\/>/);
  });
});
