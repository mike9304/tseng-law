import { describe, expect, it } from 'vitest';
import { buildHowToJsonLd } from '@/lib/seo';

describe('buildHowToJsonLd', () => {
  it('returns null when no valid steps are supplied', () => {
    expect(buildHowToJsonLd({ name: '대만 회사설립', steps: [] })).toBeNull();
    expect(
      buildHowToJsonLd({
        name: '대만 회사설립',
        steps: [{ name: '단계' }, { text: '내용' }, {}] as never,
      })
    ).toBeNull();
  });

  it('drops steps that are missing a name or text but keeps valid ones', () => {
    const node = buildHowToJsonLd({
      name: '대만 회사설립',
      steps: [
        { name: '투심회 승인', text: '투자계획서 제출' },
        { name: '', text: '빈 이름' },
        { name: '설립 등기', text: '법인 등기' },
      ],
    });

    expect(node).not.toBeNull();
    const steps = node!.step as unknown[];
    expect(steps).toHaveLength(2);
  });

  it('builds a HowTo node with ordered HowToStep entries and positions', () => {
    const node = buildHowToJsonLd({
      name: '대만 회사설립',
      description: '5단계 종합 가이드',
      steps: [
        { name: '투심회 승인', text: '투자계획서 제출' },
        { name: '사명 예심', text: '중국어 명칭 검색' },
        { name: '설립 등기', text: '자본금 송금·감사·등기' },
      ],
    });

    expect(node).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: '대만 회사설립',
      description: '5단계 종합 가이드',
    });

    const steps = node!.step as Array<Record<string, unknown>>;
    expect(steps[0]).toEqual({
      '@type': 'HowToStep',
      position: 1,
      name: '투심회 승인',
      text: '투자계획서 제출',
    });
    expect(steps.map((s) => s.position)).toEqual([1, 2, 3]);
    expect(steps.every((s) => s['@type'] === 'HowToStep')).toBe(true);
  });

  it('adds totalTime and inLanguage when supplied', () => {
    const node = buildHowToJsonLd({
      name: '台灣公司設立',
      steps: [{ name: '投審會核准', text: '提交投資計畫書' }],
      totalTime: 'P4M',
      locale: 'zh-hant',
    });

    expect(node!.totalTime).toBe('P4M');
    expect(node!.inLanguage).toBe('zh-Hant');
  });

  it('includes step url when provided', () => {
    const node = buildHowToJsonLd({
      name: 'Setup',
      steps: [{ name: 'Step 1', text: 'Do it', url: '/ko/guides/taiwan-company-setup' }],
    });

    const step = (node!.step as Array<Record<string, unknown>>)[0];
    expect(step.url).toBe('/ko/guides/taiwan-company-setup');
  });
});
