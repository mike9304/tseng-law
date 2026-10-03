import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { siteContent } from '@/data/site-content';
import { getPricingContent } from '@/components/PricingCards';
import { getAllColumnPosts } from '@/lib/columns';
import { JA_KOU_DISPLAY_EXTRA } from '../ja-copy';
import { JA_KOU_FACTS } from '../ja-facts';
import { SUKASHI_PAIRS } from '../sukashi-pairs';
import { JA_GLYPH_BY_TOPIC } from '../JaGlyphCard';

const glyphs = new Set(readFileSync(path.join(process.cwd(), 'src/components/ja-design/kou/ja-kou-display.glyphs.txt'), 'utf8'));

describe('display-face subset (CONCEPT-V2 §3.3, §15.4)', () => {
  it('covers every glyph the home sets in the display face', () => {
    const pricing = getPricingContent('ja').items.flatMap((item) => [item.price, item.unit]);
    const strings = [
      siteContent.ja.hero.title,
      ...SUKASHI_PAIRS.map((pair) => pair.term),
      ...JA_KOU_FACTS.flatMap((fact) => [fact.value, fact.unit ?? '']),
      ...pricing,
      ...Object.values(JA_GLYPH_BY_TOPIC),
      String(getAllColumnPosts('ja').length),
      'N1',
      JA_KOU_DISPLAY_EXTRA,
    ];
    const missing = new Set<string>();
    for (const text of strings) for (const char of text) if (char.trim() && !glyphs.has(char)) missing.add(char);
    expect([...missing]).toEqual([]);
  });
});
