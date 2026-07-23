import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ServicePracticeIcon from '../ServicePracticeIcon';

describe('ServicePracticeIcon', () => {
  it('renders six distinct code-native SVG silhouettes (no shared generic mark)', () => {
    const markups = [0, 1, 2, 3, 4, 5].map((index) =>
      renderToStaticMarkup(<ServicePracticeIcon index={index} />),
    );

    for (const html of markups) {
      expect(html).toContain('viewBox="0 0 24 24"');
      expect(html).toContain('currentColor');
      expect(html).toContain('data-practice-icon=');
      // Banned clichés should not reappear as path geometry labels in markup.
      expect(html.toLowerCase()).not.toMatch(/scale|gavel|shield|handshake|flag|heart/);
    }

    const signatures = markups.map((html) => html.replace(/\s+/g, ' ').trim());
    expect(new Set(signatures).size).toBe(6);
  });

  it('maps each practice index to the locked silhouette family', () => {
    const byIndex = [0, 1, 2, 3, 4, 5].map((index) =>
      renderToStaticMarkup(<ServicePracticeIcon index={index} />),
    );

    // 0 architectural elevation: base + facade
    expect(byIndex[0]).toContain('data-practice-icon="0"');
    expect(byIndex[0]).toContain('M4 19h16');

    // 1 document + progress arrow
    expect(byIndex[1]).toContain('data-practice-icon="1"');
    expect(byIndex[1]).toContain('M14.2 16.8h2.6');

    // 2 facing openings
    expect(byIndex[2]).toContain('data-practice-icon="2"');
    expect(byIndex[2]).toContain('M4.5 6.5v11h5.2V6.5z');
    expect(byIndex[2]).toContain('M14.3 6.5v11h5.2V6.5z');

    // 3 two independent rects
    expect(byIndex[3]).toContain('data-practice-icon="3"');
    expect(byIndex[3]).toContain('M4.5 7h6.2v10H4.5z');
    expect(byIndex[3]).toContain('M13.3 7h6.2v10H13.3z');

    // 4 parallel lines + diamond
    expect(byIndex[4]).toContain('data-practice-icon="4"');
    expect(byIndex[4]).toContain('M12 8.8l3.2 3.2L12 15.2 8.8 12z');

    // 5 3×3 node grid
    expect(byIndex[5]).toContain('data-practice-icon="5"');
    expect(byIndex[5]).toContain('M7 7h.01M12 7h.01M17 7h.01');
  });
});
