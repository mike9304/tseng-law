import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getColumnGeneratedVideo } from '@/data/column-generated-videos';
import { getColumnPost, getAllColumnPosts } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';

const slug = 'taiwan-accident-family-care-necessity-period';

describe('reviewed family-care compensation column', () => {
  it('preserves the exact reviewed body, case amounts and qualifications', () => {
    const file = fs.readFileSync(`src/content/columns-zh/085-${slug}.md`, 'utf8');
    const body = file.slice(file.indexOf('\n---\n') + 5);
    // Undo only the exact AI attribution removal approved on 2026-10-03;
    // the original reviewed-body hash still protects every other byte.
    const approvedAttributionChanges = [
      [
        "本文依官方公開資料撰寫，供一般法律資訊參考，不取代個案法律意見。法規查閱日：2026年10月2日。上述兩件二審判決末尾均載明不得上訴；本文未另取得確定證明書或查核非常救濟程序。",
        "本文由法律AI助理依官方公開資料撰寫，供一般法律資訊參考，不取代個案法律意見。法規查閱日：2026年10月2日。上述兩件二審判決末尾均載明不得上訴；本文未另取得確定證明書或查核非常救濟程序。",
      ],
      [
        "# 家人照顧能請求車禍看護費嗎？先分清照護需求與期間\n\n\n",
        "# 家人照顧能請求車禍看護費嗎？先分清照護需求與期間\n\n作者：法律AI助理（legal-ai-assistant）\n\n",
      ],
    ] as const;
    let reviewedBody = body;
    for (const [approvedText, reviewedText] of approvedAttributionChanges) {
      expect(body.split(approvedText)).toHaveLength(2);
      expect(body).not.toContain(reviewedText);
      reviewedBody = reviewedBody.replace(approvedText, reviewedText);
    }
    expect(createHash('sha256').update(reviewedBody).digest('hex')).toBe('ef6305aed4de829f3cbfcff02462e73c9a21dfba80d7eaadbc785cd0b5c44d41');
    expect(body).toContain('本文未另取得確定證明書或查核非常救濟程序');
    expect(body).toContain('並非全國統一或現行行情');
  });

  it('joins the compensation collection with its reviewed film and without invented language copies', () => {
    const collection = buildTrafficCollection('zh-hant', { columns: getAllColumnPosts('zh-hant'), issues: [] });
    const matches = collection.filter(p => p.slug === slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ subject: 'compensation', hasVideo: true, columnNumber: 85, aiAuthored: true });
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', q: '家人' })).map(p => p.slug)).toEqual([slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({ subject: 'compensation', video: '1' })).some(p => p.slug === slug)).toBe(true);
    expect(getColumnGeneratedVideo('zh-hant', slug)?.id).toBe('family-care-film-v1-zh-hant');
    expect(getColumnPost(slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    for (const locale of ['ko', 'en', 'ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === slug)).toBe(false);
  });
});
