import { describe, expect, it } from 'vitest';
import { getJapaneseServiceDetail, japaneseServiceDetails } from '@/data/service-details-ja';

describe('Japanese criminal service-detail procedure guidance', () => {
  it('keeps the complaint period limited to complaint-dependent offenses and knowledge of the offender', () => {
    const points = getJapaneseServiceDetail('criminal')!.keyPoints;
    const period = points.find((point) => point.includes('第237条'))!;
    expect(period).toContain('告訴を必要とする罪');
    expect(period).toContain('告訴権者が犯人を知った時から6か月');
    expect(period).toContain('すべての刑事事件に共通する期限ではありません');
  });

  it('distinguishes withdrawal, reconsideration and return of seized property', () => {
    const points = getJapaneseServiceDetail('criminal')!.keyPoints;
    expect(points.find((point) => point.includes('第238条'))).toContain('第一審弁論終結前');
    expect(points.find((point) => point.includes('第238条'))).toContain('再び告訴できません');
    expect(points.find((point) => point.includes('第256条'))).toContain('受領後10日以内に原検察官を経由');
    expect(points.find((point) => point.includes('第142・416条'))).toContain('留置の必要がない押収物');
    expect(points.find((point) => point.includes('第142・416条'))).toContain('一時的な還付と不服申立てには別の要件');
  });

  it('renders Japanese without the old blanket penalties or outcome promises', () => {
    const record = getJapaneseServiceDetail('criminal')!;
    expect(record.keyPoints).toHaveLength(5);
    expect(record.title).toBe('台湾の刑事事件・刑事弁護');
    const text = JSON.stringify(record);
    expect(text).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
    expect(text).not.toMatch(/3年間入国禁止|ひき逃げは1年以上7年以下|必ず不起訴|必ず無罪|6か月を過ぎると民事のみ|Criminal Defense/);
    expect(japaneseServiceDetails.criminal).toBe(record);
    expect(getJapaneseServiceDetail('__proto__')).toBeUndefined();
    expect(getJapaneseServiceDetail('constructor')).toBeUndefined();
  });
});
