import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import EnHomeBody from '@/components/en-design/EnHomeBody';
import { getConsultationGuideCopy } from '@/components/ConsultationGuideSection';
import { getPricingContent } from '@/components/PricingCards';

/**
 * en home "Clear Night" (CONCEPT-V2 17.3): the server HTML is the finished, readable page before any
 * client code runs, and the legal qualifiers stay with the numbers they qualify.
 */
const POSTS = [1, 2, 3, 4, 5].map((index) => ({
  slug: `column-${index}`,
  title: `Column ${index}`,
  date: `2026-01-0${index}`,
  dateDisplay: `January ${index}, 2026`,
  readTime: '5 min read',
  categoryLabel: 'Topic',
  featuredImage: '/images/columns/placeholder.webp',
  summary: `Summary ${index}`,
}));

function render() {
  return renderToStaticMarkup(<EnHomeBody posts={POSTS} faqItems={[]} />);
}

/** The markup of the first element that carries `marker`, up to the end of its section. */
function sectionAfter(html: string, marker: RegExp): string {
  const start = html.search(marker);
  expect(start, String(marker)).toBeGreaterThanOrEqual(0);
  const sectionStart = html.lastIndexOf('<section', start);
  const end = html.indexOf('</section>', start);
  return html.slice(sectionStart, end);
}

describe('en home Clear Night server HTML', () => {
  it('renders one h1 with the short headline and the one-sentence lead', () => {
    const html = render();
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain('Email Attorney Wei Tseng');
    expect(html).toContain(' and meet in Taipei or by video.');
    expect(html).not.toContain('Work, family, police and accident matters, residence permits, company setup.');
  });

  it('keeps the pinned email CTA label and its accessible-name pattern', () => {
    const html = render();
    expect(html).toMatch(/aria-label="Request an Email Consultation — [^"]+"/);
  });

  it('serves the S3 practice areas as the stack until the client switches the run on', () => {
    const practice = sectionAfter(render(), /id="practice"/);
    expect(practice).toContain('data-en-run="off"');
    expect(practice.match(/data-run-index="/g)).toHaveLength(6);
    // "View details" duplicates the title link, so it stays out of the tab order and the accessibility tree.
    expect(practice).toMatch(/class="services-run-more"[^>]*aria-hidden="true"[^>]*tabindex="-1"/i);
  });

  it('lists all three S4 steps and both detail lists before hydration', () => {
    const html = render();
    const process = sectionAfter(html, /id="process"/);
    expect(process).toContain('data-steps="all"');
    const guide = getConsultationGuideCopy('en');
    const flow = guide.cards.find((card) => card.title === 'Consultation flow');
    expect(flow?.items).toHaveLength(3);
    for (const item of flow?.items ?? []) expect(process).toContain(item);
    expect(process).toContain('Useful materials to prepare');
    expect(process).toContain('Available channels');
    expect(process).toContain('How it works');
  });

  it('keeps "/ 1 hour" and "Appointment required" in the consultation fee block', () => {
    const html = render();
    const start = html.indexOf('data-fee="consultation"');
    expect(start).toBeGreaterThan(0);
    const block = html.slice(start, html.indexOf('</ul>', start));
    const text = block.replace(/<[^>]+>/g, '');
    expect(text).toContain('NT$ 3,000');
    expect(text).toContain('/ 1 hour');
    expect(text).toContain('Appointment required');
    // every fee and condition from the shared pricing data is on the home, verbatim
    const escape = (value: string) => value.replace(/&/g, '&amp;');
    for (const item of getPricingContent('en').items) {
      expect(html).toContain(escape(item.title));
      for (const detail of item.details) expect(html).toContain(escape(detail));
    }
  });

  it('sets the case study as type only, with no numeral in its heading and the disclaimer after the description', () => {
    const results = sectionAfter(render(), /id="results"/);
    expect(results).toContain('data-results-media="none"');
    expect(results).not.toMatch(/<video\b|<img\b/);
    const heading = /<h2[^>]*home-results-title[^>]*>([\s\S]*?)<\/h2>/.exec(results)?.[1] ?? '';
    expect(heading.replace(/<[^>]+>/g, '')).not.toMatch(/\d/);
    const description = results.indexOf('A university student sought damages');
    const disclaimer = results.indexOf('Outcomes depend on the specific facts and evidence');
    expect(description).toBeGreaterThan(0);
    expect(disclaimer).toBeGreaterThan(description);
  });

  it('shows the figures as static text inside the attorney chapter, before the insights', () => {
    const html = render();
    const numbers = Array.from(html.matchAll(/class="stat-number"[^>]*>([^<]+)</g)).map((m) => m[1].trim());
    expect(numbers).toEqual(['4', '4', '7', '2']);
    expect(html.indexOf('id="about"')).toBeLessThan(html.indexOf('id="stats"'));
    expect(html.indexOf('id="stats"')).toBeLessThan(html.indexOf('id="insights"'));
  });

  it('draws en-owned arrows as chevrons and loads neither the taxi nor the courtroom film', () => {
    const html = render();
    expect(html).toContain('data-en-chevron="right"');
    expect(html).not.toMatch(/en-night-taxi-hero|taiwan-courtroom-calm-daylight/);
    // the films mount after hydration; the server HTML carries their posters
    expect(html).toContain('en-drops-hero.webp');
    expect(html).toContain('en-rooftops-rain.webp');
  });
});
