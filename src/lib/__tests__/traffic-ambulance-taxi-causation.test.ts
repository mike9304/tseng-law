import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { getAllColumnPosts, getColumnPost } from '../columns';
import { buildTrafficCollection, filterTrafficBoardItems, parseTrafficBoardQuery } from '../traffic-collection';
import pending from '@/content/column-embeddings-pending.json';
const articles = [
  {
    "number": 120,
    "slug": "taiwan-ambulance-red-light-emergency-priority-negligence",
    "file": "src/content/columns-zh/120-taiwan-ambulance-red-light-emergency-priority-negligence.md",
    "sourceManuscriptSha256": "ac9612de8ac8e11d44b25e3d085cc5921fbf3fd38cc7feefcd76b3d4902dbd02",
    "changes": [
      {
        "old": "本文由AI撰寫，依",
        "new": "本文依",
        "reason": "User-approved removal of public AI author attribution; source/date/legal qualifications retained."
      }
    ],
    "heroAlt": "日光下的街道路口與斑馬線，路邊凹入的柏油區域停著白色紅條紋廂型車，車頂燈組未亮起。",
    "heroCaption": "AI 生成的虛構街景，僅供文章示意；非事故現場照片或個案證據，不代表實際車輛位置、勤務狀態或肇責。"
  },
  {
    "number": 121,
    "slug": "taiwan-bus-stop-illegal-parking-no-contact-criminal-causation",
    "file": "src/content/columns-zh/121-taiwan-bus-stop-illegal-parking-no-contact-criminal-causation.md",
    "sourceManuscriptSha256": "56019b0d19dfdbebaff778f573e5bb172c7af42de111ca63e48bd7d04223e826",
    "changes": [
      {
        "old": "作者：法律AI助理（本文由AI依官方裁判及法條撰寫，提供一般法律資訊）",
        "new": "本文依官方裁判及法條撰寫，提供一般法律資訊。",
        "reason": "User-approved removal of public AI author attribution; source/date/legal qualifications retained."
      },
      {
        "old": "![日光下的空置路側停靠區，白色標線沿著人行道延伸，右側立著沒有文字的站牌。](../media/empty-bus-bay-1600x900.webp)\n\nAI 生成的虛構站區街景，僅供文章示意；非個案現場或證據，不表示曾有違停、車輛受阻、碰撞或因果關係。\n\n",
        "new": "",
        "reason": "Relocate the exact approved image, alt and caption into the existing single-hero presentation; no duplicate image/caption."
      }
    ],
    "heroAlt": "日光下的空置路側停靠區，白色標線沿著人行道延伸，右側立著沒有文字的站牌。",
    "heroCaption": "AI 生成的虛構站區街景，僅供文章示意；非個案現場或證據，不表示曾有違停、車輛受阻、碰撞或因果關係。"
  }
];
describe('reviewed ambulance and bus-stop causation publications', () => {
  it.each(articles)('preserves every reviewed legal-content byte for $number', (a) => {
    const file = fs.readFileSync(a.file, 'utf8');
    let body = file.slice(file.indexOf('\n---\n') + 5);
    expect(body).not.toMatch(/本文由AI|作者：法律AI助理|\*\*|<strong|<b>/);
    for (const change of [...a.changes].reverse()) {
      if (change.new) { expect(body.split(change.new)).toHaveLength(2); body = body.replace(change.new, change.old); }
      else body = body.replace('2017年9月19日晚間', change.old + '2017年9月19日晚間');
    }
    expect(createHash('sha256').update(body).digest('hex')).toBe(a.sourceManuscriptSha256);
    expect(file).toContain(a.heroAlt);
    expect(file).toContain(a.heroCaption);
    expect(file).toContain('author: "legal-ai-assistant"');
  });
  it.each(articles)('joins the native liability list and search exactly once for $number', (a) => {
    const collection = buildTrafficCollection('zh-hant', {columns: getAllColumnPosts('zh-hant'), issues: []});
    const matches = collection.filter(p => p.slug === a.slug);
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({subject: 'liability', hasVideo: false, columnNumber: a.number, aiAuthored: true});
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({subject: 'liability', q: matches[0].title})).map(p => p.slug)).toEqual([a.slug]);
    expect(filterTrafficBoardItems(collection, parseTrafficBoardQuery({video: '1'})).some(p => p.slug === a.slug)).toBe(false);
    expect(getColumnPost(a.slug, 'zh-hant')!.diagramVideo).toBeUndefined();
    expect(pending.columns.filter(p => p.slug === a.slug)).toEqual([{locale: 'zh-hant', slug: a.slug}]);
    for (const locale of ['ko','en','ja'] as const) expect(getAllColumnPosts(locale).some(p => p.slug === a.slug)).toBe(false);
  });
});
