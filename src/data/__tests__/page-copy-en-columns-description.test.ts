import { describe, expect, it } from 'vitest';
import { pageCopy } from '@/data/page-copy';

describe('P2-1 EN columns listing description', () => {
  it('uses a 140–160 character sentence covering Taiwan law, company, and litigation', () => {
    const description = pageCopy.en.insights.description;

    expect(description.length).toBeGreaterThanOrEqual(140);
    expect(description.length).toBeLessThanOrEqual(160);
    expect(description.endsWith('.')).toBe(true);
    expect(description.endsWith('...')).toBe(false);
    expect(description).toMatch(/Taiwan law/i);
    expect(description).toMatch(/company/i);
    expect(description).toMatch(/litigation/i);
  });

  it('leaves non-English columns listing descriptions unchanged', () => {
    expect(pageCopy.ko.insights.description).toBe(
      '호정칼럼 전체 글을 카테고리별로 확인할 수 있습니다.',
    );
    expect(pageCopy['zh-hant'].insights.description).toBe(
      '依分類整理昊鼎專欄文章，快速查看重點主題。',
    );
    expect(pageCopy.ja.insights.description).toBe(
      '台湾進出を検討する日系企業や在台日本人向けに、会社設立、訴訟、労務、家事事件など台湾法務に関する実務コラムをカテゴリ別にまとめてご覧いただけます。',
    );
  });
});
