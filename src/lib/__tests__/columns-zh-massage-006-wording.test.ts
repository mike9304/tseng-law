import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const articlePath = path.join(
  process.cwd(),
  'src/content/columns-zh/006-taiwan-massage-history-law.md',
);

describe('Traditional Chinese massage column 006 — localized wording', () => {
  it('describes streets lined with massage shops without a literal compound', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain('總之，說到按摩，');
    expect(raw).toContain(
      '台灣也有不少街道兩旁林立著各式各樣的按摩店。',
    );
    expect(raw).not.toContain('按摩街');
    expect(raw).not.toContain('街道匯集了');
  });

  it('describes the bundled barbershop services in natural Taiwan usage', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '只要剪一次頭髮，就能享受到這麼多優質服務，CP值真的很高。',
    );
    expect(raw).not.toContain('性價比非常高');
  });

  it('uses natural Taiwan Traditional Chinese for the petition reference', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '而今日之所以有這麼多按摩店，或許與一件大法官釋憲聲請有關。',
    );
    expect(raw).toContain(
      '林先生認為這項處罰非常不合理，因此向大法官聲請釋憲。',
    );
    expect(raw).not.toContain('一次大法官釋憲的申請');
    expect(raw).not.toContain('申請大法官釋憲');
  });

  it('describes barriers and limited occupational options in one natural sentence', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '在台灣，視障者在成長過程、日常生活、學習與教育等方面都面臨許多障礙，能從事的職業也十分有限。',
    );
    expect(raw).not.toContain('視障者在成長、活動、學習、教育');
  });

  it('describes the occupational-rights dispute without redundant phrasing', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '在這場關於視障者與非視障者職業權利的爭議中，出現了許多反對意見。',
    );
    expect(raw).not.toContain('職業權利的爭議過程中');
  });

  it('states the cross-country rights-balance conclusion naturally', () => {
    const raw = fs.readFileSync(articlePath, 'utf8');

    expect(raw).toContain(
      '由此可見，各國為了保護不同群體的權益，採取了不同的做法。',
    );
    expect(raw).toContain('各群體的權益保護隨時代變遷不斷改變。');
    expect(raw).toContain(
      '而立法者為了解決利益衝突，努力尋找相對均衡的解決方案。',
    );
    expect(raw).not.toContain('不同的處理方式');
    expect(raw).not.toContain('在時代潮流中不斷變化');
  });
});
