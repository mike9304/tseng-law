import { describe, expect, it } from 'vitest';

import { firmIntroductionContent } from '@/data/firm-introduction';

describe('Japanese firm introduction content', () => {
  const japanese = firmIntroductionContent.ja;

  it('provides a complete Japanese section with the official identity and source', () => {
    expect(japanese.sectionLabel).toBe('ABOUT');
    expect(japanese.title).toBe('事務所紹介');
    expect(japanese.subtitle).toContain('弁護士');
    expect(japanese.paragraphs).toHaveLength(7);
    expect(japanese.paragraphs.every((paragraph) => paragraph.trim().length > 0)).toBe(true);
    expect(japanese.paragraphs.join(' ')).toContain('昊鼎国際法律事務所');
    expect(japanese.paragraphs.join(' ')).toContain('曾雋崴弁護士');
    expect(japanese.paragraphs.join(' ')).toContain('公認会計士');
    expect(japanese.logo).toBe('/images/brand/hovering-logo-zh.png');
    expect(japanese.logoAlt).toBe('昊鼎国際法律事務所のロゴ');
    expect(japanese.sourceUrl).toBe('https://www.hoveringlaw.com.tw/zh/about.html');
    expect(japanese.sourceLabel).toBe('出典：hoveringlaw.com.tw');
  });

  it('covers every required historical milestone and practice topic', () => {
    expect(japanese.paragraphs[0]).toMatch(/2016年.*「昊」.*「鼎」/);
    expect(japanese.paragraphs[1]).toMatch(/高雄オフィス.*台中オフィス.*知的財産.*韓国・日本/);
    expect(japanese.paragraphs[2]).toMatch(/2017年.*屏東オフィス.*農業者団体/);
    expect(japanese.paragraphs[3]).toMatch(/2020年.*公認会計士.*昊鼎会計士事務所.*会計・税務/);
    expect(japanese.paragraphs[4]).toMatch(/2024年.*法律・会計・税務・人事管理.*ワンストップ/);
    expect(japanese.paragraphs[5]).toMatch(/2024年.*曾雋崴弁護士.*韓国.*日本.*会社設立.*ビザ申請.*商標・特許/);
    expect(japanese.paragraphs[6]).toMatch(
      /社会貢献.*公益性の高い案件.*法律扶助案件.*無償.*法律相談/,
    );
  });

  it('contains no Hangul and does not reuse Korean or English paragraphs', () => {
    for (const [index, paragraph] of japanese.paragraphs.entries()) {
      expect(paragraph).not.toMatch(/[\u3131-\u318e\uac00-\ud7a3]/u);
      expect(paragraph).not.toBe(firmIntroductionContent.ko.paragraphs[index]);
      expect(paragraph).not.toBe(firmIntroductionContent.en.paragraphs[index]);
    }
  });

  it('preserves the existing locale structures and representative copy', () => {
    expect(firmIntroductionContent.ko.paragraphs).toHaveLength(7);
    expect(firmIntroductionContent['zh-hant'].paragraphs).toHaveLength(5);
    expect(firmIntroductionContent.en.paragraphs).toHaveLength(7);
    expect(firmIntroductionContent.ko.paragraphs[0]).toContain('법무법인 호정은 2016년');
    expect(firmIntroductionContent['zh-hant'].paragraphs[0]).toContain('昊鼎國際法律事務所於2016年');
    expect(firmIntroductionContent.en.paragraphs[0]).toContain(
      'Hovering International Law Firm was established in 2016',
    );
  });
});
