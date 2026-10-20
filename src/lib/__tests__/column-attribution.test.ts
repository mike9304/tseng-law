import { describe, expect, it } from 'vitest';
import { stripColumnAttribution, stripColumnHtmlAttribution } from '../column-attribution';

describe('public column manuscript attribution', () => {
  it('removes inline manuscript signatures and self-introductions in several languages', () => {
    for (const byline of [
      '증준외 변호사(曾雋崴, Wei Tseng)',
      'Hello, I am Wei Tseng (曾雋崴), Taiwan Attorney.',
      '曾雋崴弁護士（Wei Tseng）',
      'Luật sư Wei Tseng (曾雋崴)',
      'Verfasserin ist Rechtsanwältin Wei Tseng (曾雋崴) in Taiwan.',
      '作者：法律 AI 助理',
      'Author: Another Writer',
      'Tác giả: Another Writer',
      'By Legal AI Assistant',
    ]) {
      expect(stripColumnAttribution(`Legal conditions.\n\n${byline}\n\nSources.`)).toBe('Legal conditions.\n\n\n\nSources.');
    }
  });

  it('preserves legal conditions in paragraphs that started with an author introduction', () => {
    const zh = '以下為一般性資訊；所需文件、審查內容及程序順序，會因投資申請人、事業內容、資金流向、公司型態、所在地、金融機構及申請當時的規定而異。';
    const et = 'Seadusjärgset lahkumishüvitist (資遣費) makstakse Taiwanis ainult siis, kui seaduses sätestatud eeldused on täidetud.';
    expect(stripColumnAttribution(`您好，我是曾雋崴律師（Wei Tseng）。${zh}`)).toBe(zh);
    expect(stripColumnAttribution(`Artikli koostas advokaat Wei Tseng (曾雋崴). ${et}`)).toBe(et);
  });

  it('retains the source basis and check dates in AI authorship endnotes', () => {
    expect(stripColumnAttribution('이 글은 법률 AI 어시스턴트가 공개 판결문과 법령을 바탕으로 작성했습니다. 자료 확인일: 2026-10-03.'))
      .toBe('이 글은 공개 판결문과 법령을 바탕으로 작성했습니다. 자료 확인일: 2026-10-03.');
    expect(stripColumnAttribution('本文由法律 AI 助理依公開判決與法規撰寫。資料核對日期：2026年10月3日。'))
      .toBe('本文依公開判決與法規撰寫。資料核對日期：2026年10月3日。');
    expect(stripColumnAttribution('This article was written by the Legal AI Assistant from public court judgments and statutes. Sources checked: 2026-10-03.'))
      .toBe('This article is based on public court judgments and statutes. Sources checked: 2026-10-03.');
    expect(stripColumnAttribution('AI-generated illustration; not a photograph of the incident.'))
      .toBe('AI-generated illustration; not a photograph of the incident.');
  });

  it('preserves consultation links, quoted text, code and the attorney’s role in a cited case', () => {
    const text = [
      'Consult [Wei Tseng](/en/lawyers/wei-tseng) about the documents.',
      '曾雋崴弁護士（Wei Tseng）は、この訴訟で原告の訴訟代理人を務めました。',
      '> Author: Quoted author',
      '```yaml', 'author: legal-ai-assistant', '```',
    ].join('\n');
    expect(stripColumnAttribution(text)).toBe(text);
  });

  it('omits CMS HTML author paragraphs while retaining formatting, conditions and quotations', () => {
    const html = '<div><p>Legal <em>conditions</em>.</p><p><strong>Wei Tseng (曾雋崴), Taiwan Attorney</strong></p></div><blockquote><p>Author: Quoted author</p></blockquote><pre>author: internal</pre>';
    expect(stripColumnHtmlAttribution(html)).toBe('<div><p>Legal <em>conditions</em>.</p></div><blockquote><p>Author: Quoted author</p></blockquote><pre>author: internal</pre>');
  });
});
