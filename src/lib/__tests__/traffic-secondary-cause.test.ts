import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-accident-assessment-secondary-cause-compensation-ratio';

describe('reviewed secondary-cause compensation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/083-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    // Undo only the exact AI attribution removal approved on 2026-10-03;
    // the original reviewed-body hash still protects every other byte.
    const approvedAttributionChanges = [
      [
        "資料說明：本文依上述公開民事判決及2026年10月2日查得的官方法規整理。未確認本件民事判決是否上訴或已確定；判決中提及其他刑事裁判的部分，不據此擴張為其他案件的結論。本文未取得原始監視器影片，影像內容均以判決記載為據。本文經資料核對，供一般法律資訊參考，個案仍須依完整資料判斷。",
        "資料說明：本文依上述公開民事判決及2026年10月2日查得的官方法規整理。未確認本件民事判決是否上訴或已確定；判決中提及其他刑事裁判的部分，不據此擴張為其他案件的結論。本文未取得原始監視器影片，影像內容均以判決記載為據。本文由 AI 協助撰寫與資料核對，供一般法律資訊參考，個案仍須依完整資料判斷。",
      ],
    ] as const;
    let reviewedBody = body;
    for (const [approvedText, reviewedText] of approvedAttributionChanges) {
      expect(body.split(approvedText)).toHaveLength(2);
      expect(body).not.toContain(reviewedText);
      reviewedBody = reviewedBody.replace(approvedText, reviewedText);
    }
    expect(createHash('sha256').update(reviewedBody).digest('hex')).toBe('37192731d8ff9f738d94a0ca3dac52ad0af7bdfad25cfaf199f2134cfef45852');
    expect(body).toContain('未確認本件民事判決是否上訴或已確定');
    expect(body).toContain('不是法院的結論');
  });

  it('automatically joins the evidence collection without a false video or language copy', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'evidence', hasVideo: false, columnNumber: 83, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'evidence', q: '次因' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'evidence', video: '1' })).some(p => p.slug === slug)).toBe(false);
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
