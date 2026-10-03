import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: vi.fn(), push: vi.fn() }),
  usePathname: () => '/ja',
  useSearchParams: () => new URLSearchParams(),
}));
vi.mock('next/image', () => ({ default: (props: { alt: string; src: string }) => <span data-img={props.alt} data-src={props.src} /> }));

import { JA_KOU_FACTS } from '../ja-facts';
import JaNumbers from '../JaNumbers';
import JaHomeBody from '../JaHomeBody';

const kouDir = path.join(process.cwd(), 'src/components/ja-design/kou');

describe('ja numerals (CONCEPT-V2 §7.3, §13.4)', () => {
  it('quotes every displayed value from its cited source', () => {
    for (const fact of JA_KOU_FACTS) {
      const source = readFileSync(path.join(process.cwd(), fact.source.file), 'utf8');
      expect(source, `${fact.key} snippet`).toContain(fact.source.snippet);
      expect(fact.source.snippet, `${fact.key} value`).toContain(fact.value);
    }
  });

  it('renders every numeral with a data-source and no practice-area count at display size', () => {
    const html = renderToStaticMarkup(<JaNumbers />);
    const numerals = html.match(/data-source="[^"]+"/g) ?? [];
    expect(numerals).toHaveLength(JA_KOU_FACTS.length);
    const dataValues = [...html.matchAll(/<data[^>]*value="([^"]+)"/g)].map((m) => m[1]);
    expect(dataValues).not.toContain('7');
    expect(html).toContain('7 主要取扱分野');
    expect(html).not.toContain('N1</data>');
    for (const label of ['主要取扱分野', '主な取扱分野']) {
      for (const fact of JA_KOU_FACTS) expect(fact.label ?? '').not.toContain(label);
    }
  });

  it('has no count-up: the numerals never animate their value', () => {
    for (const file of ['JaNumbers.tsx', 'JaNumeral.tsx', 'ja-facts.ts']) {
      const source = readFileSync(path.join(kouDir, file), 'utf8');
      expect(source, file).not.toMatch(/requestAnimationFrame|setInterval|useState/);
    }
  });

  it('shows no 2016 anywhere on the home', () => {
    const html = renderToStaticMarkup(<JaHomeBody posts={[]} faqItems={[]} />);
    expect(html).not.toContain('2016');
  });

  it('keeps every kou source file free of display-size practice counts', () => {
    for (const file of readdirSync(kouDir).filter((f) => /\.(tsx?|css)$/.test(f))) {
      const source = readFileSync(path.join(kouDir, file), 'utf8');
      expect(source, file).not.toMatch(/value=["']7["']/);
    }
  });
});
