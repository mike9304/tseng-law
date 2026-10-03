import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-mediation-delayed-injury-rescission';

describe('reviewed delayed-injury mediation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/082-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    // Undo only the exact AI attribution removal approved on 2026-10-03;
    // the original reviewed-body hash still protects every other byte.
    const approvedAttributionChanges = [
      [
        "依公開官方資料整理，供一般法律資訊參考。法規查閱日：2026年10月2日。",
        "作者：legal-ai-assistant（AI 撰寫）。依公開官方資料整理，供一般法律資訊參考。法規查閱日：2026年10月2日。",
      ],
    ] as const;
    let reviewedBody = body;
    for (const [approvedText, reviewedText] of approvedAttributionChanges) {
      expect(body.split(approvedText)).toHaveLength(2);
      expect(body).not.toContain(reviewedText);
      reviewedBody = reviewedBody.replace(approvedText, reviewedText);
    }
    expect(createHash('sha256').update(reviewedBody).digest('hex')).toBe('b3cbf2e84a593f03650eceb10d6cad9b86fef2b50e6cf92b74ed9532878abb96');
    expect(body).toContain('目前也未確認本判決是否上訴或確定');
    expect(body).toContain('判決沒有交代實際送達日');
  });

  it('automatically joins the procedure collection without a false video or language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'procedure', hasVideo: false, columnNumber: 82, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'procedure', q: '遲發性' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'procedure', video: '1' })).some(p => p.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
