import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import ZhHantAudienceDoors from '@/components/zh-hant-home/ZhHantAudienceDoors';
import ZhHantServiceGroups from '@/components/zh-hant-home/ZhHantServiceGroups';
import ZhHantEngagement from '@/components/zh-hant-home/ZhHantEngagement';
import ServicesBento from '@/components/ServicesBento';
import { ZH_HANT_DOMESTIC_SERVICE_ORDER } from '@/components/zh-hant-home/zh-hant-service-scenarios';

const hrefOrder = (html: string) => [...html.matchAll(/href="\/zh-hant\/services\/([a-z-]+)"/g)].map((m) => m[1]);

describe('zh-hant arrangement for Taiwanese readers (2026-10-01)', () => {
  it('puts personal and family matters in the first door and company setup in the last', () => {
    const html = renderToStaticMarkup(<ZhHantAudienceDoors />);
    expect(html.indexOf('個人與家庭')).toBeLessThan(html.indexOf('工作與契約糾紛'));
    expect(html.indexOf('工作與契約糾紛')).toBeLessThan(html.indexOf('在台外國人與外國企業'));
    expect(html.indexOf('/zh-hant/services/investment')).toBeGreaterThan(html.indexOf('/zh-hant/services/criminal'));
  });

  it('orders the home service cards disputes first and investment last, keeping anchors', () => {
    const html = renderToStaticMarkup(<ServicesBento locale="zh-hant" presentation="editorial" order={ZH_HANT_DOMESTIC_SERVICE_ORDER} />);
    expect(hrefOrder(html)).toEqual([...ZH_HANT_DOMESTIC_SERVICE_ORDER]);
    for (const anchor of ['civil', 'family', 'criminal', 'labor', 'ip', 'investment', 'real-estate', 'finance']) {
      expect(html).toContain(`id="${anchor}"`);
    }
  });

  it('keeps the default service order when no order is passed (other locales)', () => {
    const html = renderToStaticMarkup(<ServicesBento locale="zh-hant" presentation="editorial" />);
    expect(hrefOrder(html)[0]).toBe('investment');
  });

  it('groups the services page individuals first, foreign clients (company setup) last', () => {
    const html = renderToStaticMarkup(<ZhHantServiceGroups showTitle />);
    expect(hrefOrder(html)).toEqual(['civil', 'family', 'criminal', 'labor', 'ip', 'investment']);
  });

  it('shows the retain-the-firm steps and the four offices without phone numbers', () => {
    const html = renderToStaticMarkup(<ZhHantEngagement />);
    expect(html).toContain('id="process"');
    for (const office of ['台北所', '台中所', '高雄所', '屏東所']) expect(html).toContain(office);
    expect(html).not.toMatch(/Tel:|tel:|\d{2,3}-\d{3,4}-\d{4}/);
    expect(html).toContain('確切費用於初次諮詢後以書面報價');
  });
});
