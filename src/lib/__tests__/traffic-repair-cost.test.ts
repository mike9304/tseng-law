import { describe, expect, it } from 'vitest';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-car-repair-cost-estimate-parts-depreciation';

describe('reviewed repair-cost depreciation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/081-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    // Undo only the exact AI attribution removal approved on 2026-10-03;
    // the original reviewed-body hash still protects every other byte.
    const approvedAttributionChanges = [
      [
        "本文依公開判決與法規整理，資料查核日為2026年10月2日。判決所列證據內容依判決記載說明，未另取得訴訟卷內照片、完整估價單或筆錄。個案是否成立及可請求金額，仍須依實際資料判斷。",
        "本文由法律AI助理依公開判決與法規整理，資料查核日為2026年10月2日。判決所列證據內容依判決記載說明，未另取得訴訟卷內照片、完整估價單或筆錄。個案是否成立及可請求金額，仍須依實際資料判斷。",
      ],
    ] as const;
    let reviewedBody = body;
    for (const [approvedText, reviewedText] of approvedAttributionChanges) {
      expect(body.split(approvedText)).toHaveLength(2);
      expect(body).not.toContain(reviewedText);
      reviewedBody = reviewedBody.replace(approvedText, reviewedText);
    }
    expect(createHash('sha256').update(reviewedBody).digest('hex')).toBe('b99475456c846c65240c749cc8e26c08fb189ef7d28b1d6e706b68897bcda728');
    expect(body).toContain('是否上訴、是否確定，尚未確認');
    expect(body).toContain('判決未另列金額');
  });

  it('automatically enables the compensation collection with its reviewed video and no language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'compensation', hasVideo: true, columnNumber: 81, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', q: '折舊' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', video: '1' })).map(p => p.slug)).toEqual([
      'taiwan-road-rage-baseball-bat-fracture-damages',
      'taiwan-car-repair-rental-cost-repair-period-evidence',
      'taiwan-accident-family-care-necessity-period',
      'taiwan-car-accident-work-loss-rest-note',
      slug,
    ]);
    // 2026-10-03: reviewed generated video; no diagram frontmatter.
    expect(getColumnGeneratedVideo('zh-hant', slug)?.id).toBe('repair-cost-film-v1-zh-hant');
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
