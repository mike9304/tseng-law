import { describe, expect, it } from 'vitest';
import { getSeoDashboardCopy } from '../seo-dashboard-copy';

describe('SEO dashboard copy', () => {
  it('returns ko dashboard copy', () => {
    const copy = getSeoDashboardCopy('ko');

    expect(copy.title).toBe('SEO 대시보드');
    expect(copy.saveDefaultsLabel).toBe('기본값 저장');
    expect(copy.saveRobotsLabel).toBe('Robots 저장');
    expect(copy.checklistStatusLabel('warning')).toBe('경고');
    expect(copy.issueCountsLabel(2, 1)).toBe('2 차단 · 1 경고');
  });

  it('returns zh-hant dashboard copy without Hangul', () => {
    const copy = getSeoDashboardCopy('zh-hant');
    const text = [
      copy.title,
      copy.lede,
      copy.checklistDescription,
      copy.defaultsDescription,
      copy.saveDefaultsLabel,
      copy.yesLabel,
      copy.customRobotsDescription,
      copy.saveRobotsLabel,
      copy.checklistStatusLabel('todo'),
      copy.issueCountsLabel(2, 1),
    ].join(' ');

    expect(copy.yesLabel).toBe('是');
    expect(copy.saveDefaultsLabel).toBe('儲存預設');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3]/);
  });

  it('returns en dashboard copy without CJK', () => {
    const copy = getSeoDashboardCopy('en');
    const text = [
      copy.title,
      copy.lede,
      copy.checklistDescription,
      copy.defaultsDescription,
      copy.saveDefaultsLabel,
      copy.saveRobotsLabel,
      copy.customRobotsDescription,
      copy.resetTitleLabel,
      copy.checklistStatusLabel('todo'),
      copy.issueCountsLabel(2, 1),
    ].join(' ');

    expect(copy.saveDefaultsLabel).toBe('Save defaults');
    expect(copy.saveRobotsLabel).toBe('Save robots');
    expect(copy.checklistStatusLabel('todo')).toBe('To do');
    expect(text).not.toMatch(/[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7A3\u4E00-\u9FFF]/);
  });
});
