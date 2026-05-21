import type { Page } from '@playwright/test';
import { canvasEditor, ensureSelected, gotoBuilder } from './helpers';

export interface Station {
  id: string;
  name: string;
  description: string;
  relatedW: string[];
  navigate: (page: Page, baseUrl: string) => Promise<{ ok: boolean; note?: string }>;
}

async function safeClick(page: Page, selector: string, timeout = 2_000): Promise<boolean> {
  const el = page.locator(selector).first();
  try {
    await el.waitFor({ state: 'visible', timeout });
    await el.click({ force: true });
    return true;
  } catch {
    return false;
  }
}

export const STATIONS: Station[] = [
  {
    id: 'S01',
    name: '홈 캔버스 진입 직후 (default)',
    description: 'admin-builder 진입. 홈 헤더/푸터/Hero/insights/footer 전체 표면.',
    relatedW: ['W01', 'W12', 'W19', 'W20'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      return { ok: true };
    },
  },
  {
    id: 'S02',
    name: '첫 노드 선택 상태 (selection handles)',
    description: '첫 visible 노드 클릭 → 8 resize handle + rotation handle + size label 표시.',
    relatedW: ['W02', 'W06', 'W07', 'W08', 'W09', 'W12'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      try {
        await ensureSelected(page);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S03',
    name: '인라인 텍스트 편집 모드',
    description: '텍스트 노드 더블클릭 → TipTap inline editor + floating toolbar.',
    relatedW: ['W03', 'W46', 'W47', 'W48', 'W49'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const textNode = canvasEditor(page)
        .locator('[data-node-id*="title"]:visible, [data-node-id*="subtitle"]:visible, [data-node-id*="copy"]:visible')
        .first();
      try {
        await textNode.waitFor({ state: 'visible', timeout: 5_000 });
        await textNode.dblclick({ force: true });
        await page.waitForTimeout(800);
        const active = await page
          .locator('[data-builder-inline-text-editor="true"]')
          .first()
          .isVisible()
          .catch(() => false);
        return { ok: active, note: active ? undefined : 'inline editor not visible after dblclick' };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S04',
    name: '+ Add 패널 열림',
    description: '좌측 + Add rail 클릭 → 카테고리 탭 + 컴포넌트 아이콘 그리드.',
    relatedW: ['W04', 'W05', 'W46', 'W56', 'W71', 'W79', 'W89', 'W99', 'W106', 'W114', 'W118'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="Add"]',
        'button[aria-label*="추가"]',
        '[data-rail-item="add"]',
        '[data-builder-rail-item="add"]',
        'button:has-text("Add")',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(500);
          return { ok: true, note: `clicked ${sel}` };
        }
      }
      return { ok: false, note: 'add rail button not found' };
    },
  },
  {
    id: 'S05',
    name: 'Pages 드로어 열림',
    description: '좌측 Pages rail 클릭 → 페이지 목록 + + New + Rename/Delete 진입.',
    relatedW: ['W14', 'W15', 'W18'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="Pages"]',
        'button[aria-label*="페이지"]',
        '[data-rail-item="pages"]',
        '[data-builder-rail-item="pages"]',
        'button:has-text("Pages")',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(500);
          return { ok: true };
        }
      }
      return { ok: false, note: 'pages rail button not found' };
    },
  },
  {
    id: 'S06',
    name: 'Mobile viewport (375px)',
    description: 'Mobile 토글 → 캔버스 375px + auto-fit 세로 스택.',
    relatedW: ['W16', 'W17', 'W31', 'W32', 'W33', 'W34', 'W37', 'W39', 'W43', 'W44'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="Mobile"]',
        'button[aria-label*="모바일"]',
        '[data-viewport="mobile"]',
        '[data-builder-viewport="mobile"]',
        'button:has-text("Mobile")',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(600);
          return { ok: true };
        }
      }
      return { ok: false, note: 'mobile toggle not found' };
    },
  },
  {
    id: 'S07',
    name: 'Tablet viewport (768px)',
    description: 'Tablet 토글 → 캔버스 768px.',
    relatedW: ['W16', 'W35'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="Tablet"]',
        'button[aria-label*="태블릿"]',
        '[data-viewport="tablet"]',
        '[data-builder-viewport="tablet"]',
        'button:has-text("Tablet")',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(600);
          return { ok: true };
        }
      }
      return { ok: false, note: 'tablet toggle not found' };
    },
  },
  {
    id: 'S08',
    name: 'Site Settings 모달',
    description: 'Site Settings 열기 → Brand kit / Type / Dark / Advanced 탭.',
    relatedW: ['W21', 'W24', 'W25', 'W178', 'W179', 'W180', 'W181'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="Site settings"]',
        'button[aria-label*="사이트 설정"]',
        '[data-builder-settings-trigger]',
        'button:has-text("Site settings")',
        'button:has-text("Settings")',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(600);
          return { ok: true };
        }
      }
      return { ok: false, note: 'site settings trigger not found' };
    },
  },
  {
    id: 'S09',
    name: 'Publish 모달',
    description: 'Publish 버튼 → preflight 체크리스트 + Publish CTA.',
    relatedW: ['W13', 'W28'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button:has-text("발행")',
        'button[title="사이트 발행"]',
        'button:has-text("Publish")',
        'button:has-text("게시")',
        'button[aria-label*="Publish"]',
        '[data-builder-publish-trigger]',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(900);
          return { ok: true };
        }
      }
      return { ok: false, note: 'publish trigger not found' };
    },
  },
  {
    id: 'S10',
    name: 'SEO 패널',
    description: '페이지 SEO 패널 → title / description / canonical / OG image.',
    relatedW: ['W27', 'W186', 'W187', 'W188', 'W189'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="SEO"]',
        '[data-rail-item="seo"]',
        '[data-builder-rail-item="seo"]',
        'button:has-text("SEO")',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(500);
          return { ok: true };
        }
      }
      return { ok: false, note: 'seo trigger not found' };
    },
  },
  {
    id: 'S11',
    name: 'History 패널',
    description: 'Version history → revision timeline + diff chip + Restore.',
    relatedW: ['W26'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="History"]',
        'button[aria-label*="히스토리"]',
        '[data-rail-item="history"]',
        'button:has-text("History")',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(500);
          return { ok: true };
        }
      }
      return { ok: false, note: 'history trigger not found' };
    },
  },
  {
    id: 'S12',
    name: 'Asset Library 모달',
    description: '이미지 노드 우클릭/인스펙터 → Asset Library (폴더/태그/검색).',
    relatedW: ['W22', 'W23', 'W56'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="Media"]',
        'button[aria-label*="Asset"]',
        'button[aria-label*="자산"]',
        '[data-rail-item="media"]',
        'button:has-text("Media")',
      ];
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          await page.waitForTimeout(500);
          return { ok: true };
        }
      }
      return { ok: false, note: 'asset library trigger not found' };
    },
  },
  {
    id: 'S13',
    name: '페이지 하단 스크롤 (footer)',
    description: '홈 캔버스 끝까지 스크롤 → footer + 모바일 sticky CTA 표면.',
    relatedW: ['W20', 'W44'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const canvas = canvasEditor(page);
      try {
        const column = page.locator('[class*="canvasColumn"], [class*="stageScroll"]').first();
        if (await column.isVisible().catch(() => false)) {
          await column.evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });
        } else {
          await canvas.evaluate((el) => {
            el.scrollTop = el.scrollHeight;
          });
        }
        await page.waitForTimeout(400);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S14',
    name: 'Columns 관리자 페이지',
    description: '/ko/admin-builder/columns → 칼럼 목록 / 새 글 쓰기 / 편집 홈 dock.',
    relatedW: ['W18', 'E1'],
    async navigate(page, baseUrl) {
      try {
        const url = new URL('/ko/admin-builder/columns', baseUrl).toString();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(800);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S15',
    name: 'About 페이지 캔버스',
    description: '/ko/admin-builder?slug=about 진입 → 다른 페이지 캔버스 진입.',
    relatedW: ['W14', 'W15'],
    async navigate(page, baseUrl) {
      try {
        const url = new URL('/ko/admin-builder?slug=about', baseUrl).toString();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(800);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  // === 라운드 2: 위젯 walk + 깊은 점검 ===
  {
    id: 'S16',
    name: '+ Add 패널 — Text 위젯 카테고리',
    description: '+ Add 열고 text-widgets 카테고리 전체 위젯 그리드.',
    relatedW: ['W46', 'W47', 'W48', 'W49', 'W50', 'W51', 'W52', 'W53', 'W54', 'W55'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      await safeClick(page, 'button:has-text("Add"), [data-builder-rail-item="add"], button[aria-label*="Add"]');
      await page.waitForTimeout(500);
      const cat = page.locator('[data-builder-category="text-widgets"], h2:has-text("Text"), button:has-text("Text & Content")').first();
      if (await cat.isVisible().catch(() => false)) {
        await cat.click({ force: true }).catch(() => undefined);
      }
      await page.waitForTimeout(500);
      const items = await page.locator('[data-builder-add-card], [data-builder-add-quick-kind]').count();
      return { ok: items > 0, note: `${items} add-cards visible` };
    },
  },
  {
    id: 'S17',
    name: '+ Add 패널 — Media/Image 카테고리',
    description: '+ Add 열고 media-widgets 카테고리 위젯 그리드.',
    relatedW: ['W56', 'W57', 'W58', 'W59', 'W60', 'W61', 'W62', 'W63', 'W64', 'W65', 'W66', 'W67', 'W68', 'W69', 'W70'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      await safeClick(page, 'button:has-text("Add"), [data-builder-rail-item="add"], button[aria-label*="Add"]');
      await page.waitForTimeout(400);
      const cat = page.locator('[data-builder-category="media-widgets"], h2:has-text("Media"), h2:has-text("Image")').first();
      if (await cat.isVisible().catch(() => false)) {
        await cat.click({ force: true }).catch(() => undefined);
        await cat.scrollIntoViewIfNeeded().catch(() => undefined);
      }
      await page.waitForTimeout(500);
      return { ok: true };
    },
  },
  {
    id: 'S18',
    name: '+ Add 패널 — Gallery 카테고리',
    description: '+ Add 열고 gallery-widgets 카테고리.',
    relatedW: ['W71', 'W72', 'W73', 'W74', 'W75', 'W76', 'W77', 'W78'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      await safeClick(page, 'button:has-text("Add"), [data-builder-rail-item="add"], button[aria-label*="Add"]');
      await page.waitForTimeout(400);
      const cat = page.locator('[data-builder-category="gallery-widgets"], h2:has-text("Gallery")').first();
      if (await cat.isVisible().catch(() => false)) {
        await cat.scrollIntoViewIfNeeded().catch(() => undefined);
      }
      await page.waitForTimeout(500);
      return { ok: true };
    },
  },
  {
    id: 'S19',
    name: '+ Add 패널 — Layout 카테고리 (strip/box/columns/repeater)',
    description: '+ Add 열고 layout-widgets 카테고리.',
    relatedW: ['W79', 'W80', 'W81', 'W82', 'W83', 'W84', 'W85', 'W86', 'W87', 'W88'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      await safeClick(page, 'button:has-text("Add"), [data-builder-rail-item="add"], button[aria-label*="Add"]');
      await page.waitForTimeout(400);
      const cat = page.locator('[data-builder-category="layout-widgets"], h2:has-text("Layout")').first();
      if (await cat.isVisible().catch(() => false)) {
        await cat.scrollIntoViewIfNeeded().catch(() => undefined);
      }
      await page.waitForTimeout(500);
      return { ok: true };
    },
  },
  {
    id: 'S20',
    name: '+ Add 패널 — Interactive (Forms/Button/Video)',
    description: '+ Add 열고 interactive-widgets 카테고리.',
    relatedW: ['W89', 'W90', 'W91', 'W92', 'W93', 'W94', 'W95', 'W96', 'W97', 'W98'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      await safeClick(page, 'button:has-text("Add"), [data-builder-rail-item="add"], button[aria-label*="Add"]');
      await page.waitForTimeout(400);
      const cat = page.locator('[data-builder-category="interactive-widgets"], h2:has-text("Interactive")').first();
      if (await cat.isVisible().catch(() => false)) {
        await cat.scrollIntoViewIfNeeded().catch(() => undefined);
      }
      await page.waitForTimeout(500);
      return { ok: true };
    },
  },
  {
    id: 'S21',
    name: 'Services 페이지 캔버스',
    description: '/ko/admin-builder?slug=services 진입 → 서비스 페이지 표면.',
    relatedW: ['W14', 'W15'],
    async navigate(page, baseUrl) {
      try {
        const url = new URL('/ko/admin-builder?slug=services', baseUrl).toString();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(800);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S22',
    name: 'Contact 페이지 캔버스',
    description: '/ko/admin-builder?slug=contact 진입 → 연락 페이지 표면.',
    relatedW: ['W14', 'W136'],
    async navigate(page, baseUrl) {
      try {
        const url = new URL('/ko/admin-builder?slug=contact', baseUrl).toString();
        await page.goto(url, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(800);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S24',
    name: 'Bookings — Dashboard',
    description: '/ko/admin-builder/bookings/dashboard — 예약 대시보드 표면.',
    relatedW: ['W196', 'W197', 'W198', 'W199', 'W200'],
    async navigate(page, baseUrl) {
      try {
        await page.goto(new URL('/ko/admin-builder/bookings/dashboard', baseUrl).toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S25',
    name: 'Bookings — Services 카탈로그',
    description: '/ko/admin-builder/bookings/services — 상담 서비스 카탈로그.',
    relatedW: ['W201', 'W202', 'W203', 'W204'],
    async navigate(page, baseUrl) {
      try {
        await page.goto(new URL('/ko/admin-builder/bookings/services', baseUrl).toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S26',
    name: 'Bookings — Calendar',
    description: '/ko/admin-builder/bookings/calendar — 예약 캘린더 뷰.',
    relatedW: ['W205', 'W206', 'W207'],
    async navigate(page, baseUrl) {
      try {
        await page.goto(new URL('/ko/admin-builder/bookings/calendar', baseUrl).toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S27',
    name: 'Bookings — Staff',
    description: '/ko/admin-builder/bookings/staff — 스태프 관리.',
    relatedW: ['W208', 'W209'],
    async navigate(page, baseUrl) {
      try {
        await page.goto(new URL('/ko/admin-builder/bookings/staff', baseUrl).toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S28',
    name: 'Bookings — Email Templates',
    description: '/ko/admin-builder/bookings/email-templates — 예약 이메일 템플릿.',
    relatedW: ['W210', 'W211'],
    async navigate(page, baseUrl) {
      try {
        await page.goto(new URL('/ko/admin-builder/bookings/email-templates', baseUrl).toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S29',
    name: 'Forms 관리자',
    description: '/ko/admin-builder/forms — 폼 관리.',
    relatedW: ['W136', 'W137', 'W138', 'W139', 'W140'],
    async navigate(page, baseUrl) {
      try {
        await page.goto(new URL('/ko/admin-builder/forms', baseUrl).toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S30',
    name: 'CMS 관리자',
    description: '/ko/admin-builder/cms — CMS 콜렉션 관리.',
    relatedW: ['W126', 'W127', 'W128', 'W129'],
    async navigate(page, baseUrl) {
      try {
        await page.goto(new URL('/ko/admin-builder/cms', baseUrl).toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S31',
    name: 'Lightboxes 관리',
    description: '/ko/admin-builder/lightboxes — 라이트박스 관리.',
    relatedW: ['W216', 'W217'],
    async navigate(page, baseUrl) {
      try {
        await page.goto(new URL('/ko/admin-builder/lightboxes', baseUrl).toString(), { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(700);
        return { ok: true };
      } catch (err) {
        return { ok: false, note: (err as Error).message };
      }
    },
  },
  {
    id: 'S23',
    name: 'Mobile 페이지 하단 (sticky CTA)',
    description: 'Mobile 뷰포트 + 하단 스크롤 → mobile sticky CTA bar 표면 (W44).',
    relatedW: ['W43', 'W44'],
    async navigate(page, baseUrl) {
      await gotoBuilder(page, baseUrl);
      const tries = [
        'button[aria-label*="Mobile"]',
        '[data-builder-viewport="mobile"]',
        'button:has-text("Mobile")',
      ];
      let mobOk = false;
      for (const sel of tries) {
        if (await safeClick(page, sel)) {
          mobOk = true;
          break;
        }
      }
      await page.waitForTimeout(600);
      await page.evaluate(() => {
        const col = document.querySelector('[class*="canvasColumn"], [class*="stageScroll"]') as HTMLElement | null;
        if (col) col.scrollTop = col.scrollHeight;
        else window.scrollTo(0, document.body.scrollHeight);
      });
      await page.waitForTimeout(400);
      return { ok: mobOk, note: mobOk ? undefined : 'mobile toggle missing' };
    },
  },
];
