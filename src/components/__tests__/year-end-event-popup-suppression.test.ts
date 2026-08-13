import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it, vi } from 'vitest';

import {
  readPopupSuppressionUntil,
  storePopupSuppression,
} from '@/components/YearEndEventPopup';

const HIDE_UNTIL_KEY = 'hojeong-year-end-event-hide-until';
const root = process.cwd();
const popupSource = readFileSync(
  path.join(root, 'src/components/YearEndEventPopup.tsx'),
  'utf8',
);
const layoutSource = readFileSync(
  path.join(root, 'src/app/[locale]/layout.tsx'),
  'utf8',
);
const css = readFileSync(path.join(root, 'src/app/globals.css'), 'utf8');
const finalPopupCss = css.slice(css.lastIndexOf('/* Year-end popup:'));

function createStorage(initialValue: string | null = null) {
  let value = initialValue;
  return {
    getItem: vi.fn(() => value),
    setItem: vi.fn((_key: string, nextValue: string) => {
      value = nextValue;
    }),
    removeItem: vi.fn(() => {
      value = null;
    }),
  };
}

describe('year-end event popup suppression', () => {
  it('stores exact 24-hour and 7-day suppression timestamps', () => {
    const storage = createStorage();
    const now = Date.UTC(2026, 6, 30);
    const day = 24 * 60 * 60 * 1000;

    expect(storePopupSuppression(storage, day, now)).toBe(now + day);
    expect(storage.setItem).toHaveBeenLastCalledWith(HIDE_UNTIL_KEY, String(now + day));

    expect(storePopupSuppression(storage, 7 * day, now)).toBe(now + 7 * day);
    expect(storage.setItem).toHaveBeenLastCalledWith(HIDE_UNTIL_KEY, String(now + 7 * day));
  });

  it('returns an active future timestamp without changing storage', () => {
    const now = Date.UTC(2026, 6, 30);
    const hideUntil = now + 10_000;
    const storage = createStorage(String(hideUntil));

    expect(readPopupSuppressionUntil(storage, now)).toBe(hideUntil);
    expect(storage.removeItem).not.toHaveBeenCalled();
  });

  it.each(['not-a-timestamp', 'Infinity', '-1'])(
    'clears an invalid or expired value (%s)',
    (storedValue) => {
      const storage = createStorage(storedValue);

      expect(readPopupSuppressionUntil(storage, 100)).toBe(0);
      expect(storage.removeItem).toHaveBeenCalledWith(HIDE_UNTIL_KEY);
    },
  );

  it('fails open when browser storage is unavailable', () => {
    const storage = {
      getItem: vi.fn(() => {
        throw new Error('storage disabled');
      }),
      setItem: vi.fn(() => {
        throw new Error('storage disabled');
      }),
      removeItem: vi.fn(),
    };

    expect(readPopupSuppressionUntil(storage, 100)).toBe(0);
    expect(storePopupSuppression(storage, 1_000, 100)).toBe(0);
  });
});

describe('year-end event popup hero placement', () => {
  it('portals the normal home popup into #hero while leaving preview rendering local', () => {
    expect(popupSource).toContain("import { createPortal } from 'react-dom'");
    expect(popupSource).toContain("document.getElementById('hero')");
    expect(popupSource).toContain('if (previewOpen) return fullPopup;');
    expect(popupSource).toContain('createPortal(fullPopup, heroPortalTarget)');
    expect(popupSource).toContain('createPortal(minimizedPopup, heroPortalTarget)');
    expect(layoutSource).not.toMatch(
      /<div data-legacy-chrome>\s*<YearEndEventPopup[\s\S]*?<\/div>/,
    );
  });

  it('has no scroll-driven visibility state or listener', () => {
    expect(popupSource).not.toContain('shouldHidePopupForScroll');
    expect(popupSource).not.toContain('hiddenByScroll');
    expect(popupSource).not.toContain("addEventListener('scroll'");
  });

  it('keeps document Escape, close, and CTA on 24 hours while 7 days stays explicit', () => {
    expect(popupSource).toContain("document.addEventListener('keydown', onKeyDown)");
    expect(popupSource).toContain("if (event.key === 'Escape')");
    expect(popupSource).toContain('dismissForOneDay();');
    expect((popupSource.match(/onClick=\{dismissForOneDay\}/g) ?? []).length).toBeGreaterThanOrEqual(3);
    expect(popupSource).toContain('const hideForSevenDays = () => dismissForDuration(SEVEN_DAYS_MS);');
    expect(popupSource).toContain('onClick={hideForSevenDays}');
  });

  it('uses final non-fixed hero-contained placement and a reserved mobile strip', () => {
    expect(finalPopupCss).not.toContain('position: fixed');
    expect(finalPopupCss).toMatch(
      /\.year-end-popup-backdrop\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?inset:\s*0;/,
    );
    expect(finalPopupCss).toMatch(
      /\.year-end-popup\s*\{[\s\S]*?position:\s*absolute;[\s\S]*?right:[\s\S]*?bottom:/,
    );
    expect(finalPopupCss).toMatch(
      /\.year-end-popup-minimized\s*\{[\s\S]*?position:\s*absolute;/,
    );
    expect(finalPopupCss).toContain('#hero:has(> .year-end-popup-backdrop)');
    expect(finalPopupCss).toContain('calc(3.5rem + 64px + env(safe-area-inset-bottom))');
    expect(finalPopupCss).toContain('calc(1.5rem + 64px + env(safe-area-inset-bottom))');
    expect(finalPopupCss).toContain('height: min(88px, calc(64px + env(safe-area-inset-bottom)))');
  });
});
