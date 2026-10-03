import { describe, expect, it } from 'vitest';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-car-repair-rental-cost-repair-period-evidence';

describe('reviewed rental-repair compensation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/086-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    // Undo only the exact AI attribution removal approved on 2026-10-03;
    // the original reviewed-body hash still protects every other byte.
    const approvedAttributionChanges = [
      [
        "本文依公開官方資料撰寫，資料查核日為2026年10月2日。判決提到的租約、發票及車廠函覆，均依公開判決記載整理，未取得原始卷證。本文供一般法律資訊參考，個案仍須依實際資料判斷。",
        "本文由法律AI助理依公開官方資料撰寫，資料查核日為2026年10月2日。判決提到的租約、發票及車廠函覆，均依公開判決記載整理，未取得原始卷證。本文供一般法律資訊參考，個案仍須依實際資料判斷。",
      ],
      [
        "# 車送修就能請求租車費嗎？租車單還要對上修車期間\n\n\n",
        "# 車送修就能請求租車費嗎？租車單還要對上修車期間\n\n作者：法律AI助理\n\n",
      ],
    ] as const;
    let reviewedBody = body;
    for (const [approvedText, reviewedText] of approvedAttributionChanges) {
      expect(body.split(approvedText)).toHaveLength(2);
      expect(body).not.toContain(reviewedText);
      reviewedBody = reviewedBody.replace(approvedText, reviewedText);
    }
    expect(createHash('sha256').update(reviewedBody).digest('hex')).toBe('6ea09674069efddc774a209b6993b4d6b159616c02f9df61bd4b2b373d683803');
    expect(body).toContain('本文未確認是否上訴、上訴結果或是否確定');
    expect(body).toContain('不能據此宣稱租期與修車日期已逐日吻合');
  });

  it('automatically joins the compensation collection with its reviewed video and no language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'compensation', hasVideo: true, columnNumber: 86, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', q: '租車單' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', video: '1' })).some(p => p.slug === slug)).toBe(true);
    // 2026-10-03: reviewed generated video; no diagram frontmatter.
    expect(getColumnGeneratedVideo('zh-hant', slug)?.id).toBe('rental-period-film-v1-zh-hant');
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
