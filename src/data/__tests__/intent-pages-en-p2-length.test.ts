import { describe, expect, it } from 'vitest';
import { getIntentPage, intentPages } from '@/data/intent-pages';

describe('P2-1 EN litigation landing description length', () => {
  it('keeps a 150–160 character complete sentence and the dispute facts', () => {
    const description = getIntentPage('en', 'taiwan-litigation-lawyer')?.description ?? '';

    expect(description.length).toBeGreaterThanOrEqual(150);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description.endsWith('.')).toBe(true);
    expect(description.endsWith('...')).toBe(false);
    expect(description).not.toContain('…');
    expect(description).toMatch(/overseas companies and individuals/i);
    expect(description).toMatch(/Taiwan litigation lawyer/i);
    expect(description).toMatch(/contract disputes/i);
    expect(description).toMatch(/unpaid invoices/i);
    expect(description).toMatch(/civil claims/i);
  });

  it('does not change Korean, Traditional Chinese, or Japanese litigation descriptions', () => {
    expect(intentPages.ko['taiwan-litigation-lawyer'].description).toBe(
      '대만 민사소송, 손해배상, 형사 대응, 가사 분쟁에서 한국 고객이 먼저 확인해야 할 포인트를 정리한 안내입니다.',
    );
    expect(intentPages['zh-hant']['taiwan-litigation-lawyer'].description).toBe(
      '整理台灣民事訴訟、損害賠償、刑事應對與家事爭議中，韓國客戶最先需要確認的重點。',
    );
    expect(intentPages.ja['taiwan-litigation-lawyer'].description).toBe(
      '台湾での契約紛争・未払い請求、民事訴訟、損害賠償、労働紛争、刑事対応、離婚・相続について、日本企業・在台日本人の方が最初に確認すべきポイントをまとめました。日本語で直接ご相談いただけます。',
    );
  });
});
