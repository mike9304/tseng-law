import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-car-accident-work-loss-rest-note';

describe('reviewed work-loss compensation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/084-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    // Undo only the exact AI attribution removal approved on 2026-10-03;
    // the original reviewed-body hash still protects every other byte.
    const approvedAttributionChanges = [
      [
        "註：本文依公開官方資料撰寫，供一般法律資訊參考。法規查閱日為2026年10月2日。兩案後續是否上訴、是否確定均未確認；臺中案判決末另有附條件的第三審上訴教示。個案認定仍取決於實際事證。",
        "註：本文由法律AI助理依公開官方資料撰寫，供一般法律資訊參考。法規查閱日為2026年10月2日。兩案後續是否上訴、是否確定均未確認；臺中案判決末另有附條件的第三審上訴教示。個案認定仍取決於實際事證。",
      ],
      [
        "# 診斷書寫「宜休養」，車禍工作損失就能照算嗎？\n\n\n",
        "# 診斷書寫「宜休養」，車禍工作損失就能照算嗎？\n\n作者：法律AI助理\n\n",
      ],
    ] as const;
    let reviewedBody = body;
    for (const [approvedText, reviewedText] of approvedAttributionChanges) {
      expect(body.split(approvedText)).toHaveLength(2);
      expect(body).not.toContain(reviewedText);
      reviewedBody = reviewedBody.replace(approvedText, reviewedText);
    }
    expect(createHash('sha256').update(reviewedBody).digest('hex')).toBe('ee1cf6e9a4a641e6fea57cb526e0452ccda22e7677fa9158742b9cb7f67bf885');
    expect(body).toContain('兩案後續是否上訴、是否確定均未確認');
    expect(body).toContain('它是這件歷史案件依卷證及對造同意形成的計算基礎');
  });

  it('joins the compensation collection with its reviewed film and without invented language copies', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'compensation', hasVideo: true, columnNumber: 84, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', q: '宜休養' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', video: '1' })).some(p => p.slug === slug)).toBe(true);
    expect(getColumnGeneratedVideo('zh-hant', slug)?.id).toBe('work-loss-film-v1-zh-hant');
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
