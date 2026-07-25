import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { getAllColumnPosts, getColumnPost } from '@/lib/columns';

const HANGUL = /[\uac00-\ud7af]/;
const root = process.cwd();
const koDir = path.join(root, 'src/content/columns');
const enDir = path.join(root, 'src/content/columns-en');
const gymColumnPath = path.join(enDir, '010-taiwan-gym-injury-lawsuit.md');
const overtakingColumnPath = path.join(
  enDir,
  '012-taiwan-overtaking-accident-liability.md',
);
const CJK_SCRIPTS = /[\p{Script=Han}\p{Script=Hangul}\p{Script=Hiragana}\p{Script=Katakana}]/u;

const countOccurrences = (value: string, needle: string) => value.split(needle).length - 1;

const countRenderedEnglishWords = (value: string) => {
  const visibleText = value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/[“”*_`]/g, ' ');
  return visibleText.match(/[A-Za-z0-9]+(?:[.’-][A-Za-z0-9]+)*/g)?.length ?? 0;
};

const koFiles = fs
  .readdirSync(koDir)
  .filter((name) => name.endsWith('.md'))
  .sort();

describe('English full column corpus', () => {
  it('has one EN file per KO file with identical filenames', () => {
    expect(fs.existsSync(enDir)).toBe(true);
    const enFiles = fs.readdirSync(enDir).filter((name) => name.endsWith('.md')).sort();
    expect(enFiles).toEqual(koFiles);
  });

  it('loads 17 English posts with full bodies (not Overview stubs only)', () => {
    const posts = getAllColumnPosts('en');
    expect(posts).toHaveLength(17);

    for (const post of posts) {
      expect(post.title.trim().length).toBeGreaterThan(8);
      expect(post.content.length).toBeGreaterThan(800);
      expect(post.content).not.toMatch(/^## Overview\n[\s\S]*## Key Focus Areas\n[\s\S]*## Consultation\nFor a case-specific/);
      expect(HANGUL.test(post.title)).toBe(false);
      expect(HANGUL.test(post.content)).toBe(false);
      expect(post.dateDisplay).not.toMatch(/Date pending/i);
      expect(post.date).toBeTruthy();
      if (post.faq?.length) {
        for (const item of post.faq) {
          expect(HANGUL.test(item.q)).toBe(false);
          expect(HANGUL.test(item.a)).toBe(false);
        }
      }
    }
  });

  it('preserves FAQ count for known FAQ sources', () => {
    const faqSlugs = [
      'taiwan-company-establishment-basics',
      'withdraw-capital-taiwan-company',
      'taiwan-company-subsidiary-vs-branch',
      'taiwan-labor-severance-law',
      'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
    ];
    for (const slug of faqSlugs) {
      const ko = getColumnPost(slug, 'ko');
      const en = getColumnPost(slug, 'en');
      expect(en?.faq?.length ?? 0).toBe(ko?.faq?.length ?? 0);
      expect((en?.faq?.length ?? 0) > 0).toBe(true);
    }
  });

  it('EN body is not dramatically shorter than KO for each slug', () => {
    for (const file of koFiles) {
      const slug = file.replace(/\.md$/, '').replace(/^\d{3}-/, '');
      const ko = getColumnPost(slug, 'ko');
      const en = getColumnPost(slug, 'en');
      expect(ko).toBeTruthy();
      expect(en).toBeTruthy();
      // Allow EN to be shorter, but not stub-level (< 35% of KO cleaned body)
      expect(en!.content.length).toBeGreaterThan(Math.floor(ko!.content.length * 0.35));
    }
  });

  it('keeps column 012 fully English, current-law scoped, and fact-specific', () => {
    const raw = fs.readFileSync(overtakingColumnPath, 'utf8');
    const post = getColumnPost('taiwan-overtaking-accident-liability', 'en');
    expect(post).toBeTruthy();

    const exactTitle = 'Who Is Liable in an Overtaking Accident?';
    expect(raw.match(/^title:\s*"([^"]+)"$/m)?.[1]).toBe(exactTitle);
    expect(raw.match(/^#\s.+$/gm)).toEqual([`# ${exactTitle}`]);
    expect(post!.title).toBe(exactTitle);
    expect(raw.match(/^lastmod:\s*"([^"]+)"$/m)?.[1]).toBe('2026-07-26');
    expect(raw.match(/^date_display:\s*"([^"]+)"$/m)?.[1]).toBe(
      'September 13, 2025',
    );
    expect(post!.date).toBe('2026-07-26');
    expect(post!.dateDisplay).toBe('September 13, 2025');

    const loadedPublicContent = `${post!.title}\n${post!.content}`;
    expect(raw).not.toMatch(CJK_SCRIPTS);
    expect(loadedPublicContent).not.toMatch(CJK_SCRIPTS);

    const renderedWordCount = countRenderedEnglishWords(post!.content);
    expect(renderedWordCount).toBe(757);
    expect(Math.ceil(renderedWordCount / 200)).toBe(4);
    expect(raw.match(/^read_time:\s*"([^"]+)"$/m)?.[1]).toBe('4 min read');
    expect(post!.readTime).toBe('4 min read');

    const sourceUrl =
      'https://www.wei-wei-lawyer.com/post/taiwan-overtaking-accident-liability';
    const officialRegulationsUrl =
      'https://laws.gov.taipei/Law/LawSearch/LawArticleContent/FL012455';
    const supplementaryUrl = 'https://gonews.com.tw/car/daily/21934/';
    const featuredImage =
      '../images/012-taiwan-overtaking-accident-liability/featured-01.jpg';
    const incidentImage = '../images/012-taiwan-overtaking-accident-liability/img-01.jpg';
    const featuredImageBlock =
      '![Illustration of liability analysis and safe passing procedure after an overtaking accident in Taiwan](../images/012-taiwan-overtaking-accident-liability/featured-01.jpg)';
    const incidentImageBlock =
      '![Diagram of a motorcycle and two cars during a mountain-road overtaking collision](../images/012-taiwan-overtaking-accident-liability/img-01.jpg)';
    const disclaimer =
      'This article provides general legal information about Taiwan overtaking rules and how fault may be assessed after an overtaking collision. It is not legal advice for any specific matter and does not guarantee any liability outcome. Actual fault may vary with the location, vehicle movements, speed, signals, evidence, appraisals, and the current regulations. Specific matters should be reviewed against the relevant materials.';
    const internalLinks = [
      '/en/taiwan-litigation-lawyer',
      '/en/korean-lawyer-in-taiwan',
      '/en/columns/taiwan-traffic-accident-procedure',
    ];

    expect(countOccurrences(raw, sourceUrl)).toBe(1);
    expect(countOccurrences(raw, officialRegulationsUrl)).toBe(1);
    expect(countOccurrences(raw, supplementaryUrl)).toBe(1);
    expect(countOccurrences(raw, featuredImage)).toBe(2);
    expect(countOccurrences(raw, incidentImage)).toBe(1);
    expect(countOccurrences(raw, featuredImageBlock)).toBe(1);
    expect(countOccurrences(raw, incidentImageBlock)).toBe(1);
    expect(countOccurrences(raw, disclaimer)).toBe(1);
    expect(loadedPublicContent).toContain(disclaimer);
    for (const link of internalLinks) {
      expect(countOccurrences(raw, link)).toBe(1);
      expect(loadedPublicContent).toContain(`(${link})`);
    }
    expect(raw).toContain(
      `[Illustrated guide to overtaking rules and steps](${supplementaryUrl})`,
    );
    expect(loadedPublicContent).toContain(`(${officialRegulationsUrl})`);
    expect(loadedPublicContent).toContain(`(${supplementaryUrl})`);
    expect(raw).not.toContain('img-02.jpg');
    expect(raw).not.toMatch(/Korean version/i);

    const article101Rules = [
      'Article 101 prohibits overtaking on road sections with signs for bends, steep slopes, narrow bridges, tunnels, or intersections, and at railroad crossings or roadwork areas.',
      'It also prohibits overtaking at places or road sections with school or hospital signs, with other no-overtaking signs or markings, when an oncoming vehicle is approaching, or when two or more vehicles are traveling in a line ahead.',
      'When seeking to pass a vehicle in the same lane, the driver behind must first sound two short horn signals or flash the headlights once.',
      'The driver must not repeatedly sound the horn or flash the headlights to force the vehicle ahead to yield.',
      'The driver behind may pass only after the vehicle ahead has slowed and moved aside, or has indicated by hand signal or right turn signal that it is yielding.',
      'The passing driver must then signal left, pass on the left while keeping at least 0.5 meters from the vehicle being passed, establish a safe distance, signal right, and return safely to the original path of travel.',
    ];
    for (const rule of article101Rules) {
      expect(raw).toContain(rule);
      expect(loadedPublicContent).toContain(rule);
    }

    expect(raw).toContain('In an anonymized matter handled by this firm');
    expect(raw).toContain(
      'According to those assessments, A was found primarily responsible for the collision.',
    );
    expect(raw).toContain('That conclusion was limited to the facts of this case.');
    expect(raw).toContain(
      'The assessments considered several circumstances together: A attempted to pass two vehicles traveling in a line ahead, entered the oncoming lane, was traveling at a speed that left too little time to brake, and had not given the prescribed horn or headlight signal.',
    );
    expect(raw).toContain(
      'This case-specific result does not mean that one omitted signal will always determine liability.',
    );

    const forbiddenFormerClaims = [
      'high insurance coverage',
      'major financial harm',
      'pain of losing a friend',
      'torment A forever',
      'avoid bearing an excessive share of accident liability',
    ];
    for (const claim of forbiddenFormerClaims) {
      expect(raw).not.toContain(claim);
    }
    expect(raw).not.toMatch(/\bconsent\b/i);
    expect(raw).not.toMatch(/\binsurance\b/i);
    expect(raw).not.toMatch(/\baftereffects\b/i);
  });

  it('keeps column 010 fully English, legally qualified, and source-link complete', () => {
    const raw = fs.readFileSync(gymColumnPath, 'utf8');
    const post = getColumnPost('taiwan-gym-injury-lawsuit', 'en');
    expect(post).toBeTruthy();

    const exactTitle =
      'Taiwan Gym Injury Claims: Case Study, Deadlines, Evidence, and Damages';
    expect(raw.match(/^title:\s*"([^"]+)"$/m)?.[1]).toBe(exactTitle);
    expect(raw.match(/^#\s.+$/gm)).toEqual([`# ${exactTitle}`]);
    expect(post!.title).toBe(exactTitle);
    expect(raw.match(/^lastmod:\s*"([^"]+)"$/m)?.[1]).toBe('2026-07-25');
    expect(raw.match(/^date_display:\s*"([^"]+)"$/m)?.[1]).toBe(
      'September 13, 2025',
    );
    expect(post!.date).toBe('2026-07-25');
    expect(post!.dateDisplay).toBe('September 13, 2025');

    const loadedPublicContent = `${post!.title}\n${post!.content}`;
    expect(raw).not.toMatch(CJK_SCRIPTS);
    expect(loadedPublicContent).not.toMatch(CJK_SCRIPTS);

    const renderedWordCount = countRenderedEnglishWords(post!.content);
    expect(renderedWordCount).toBe(1214);
    expect(Math.ceil(renderedWordCount / 200)).toBe(7);
    expect(raw.match(/^read_time:\s*"([^"]+)"$/m)?.[1]).toBe('7 min read');
    expect(post!.readTime).toBe('7 min read');

    const mediaRecords = [
      {
        image: 'img-02.jpg',
        caption:
          'Male university student suffers a ruptured disc after deadlifting 90 kg and seeks damages from gym',
        url: 'https://tw.news.yahoo.com/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82-%E6%80%92%E5%91%8A%E5%81%A5%E8%BA%AB%E6%88%BF%E6%B1%82%E5%84%9F-095800997.html',
      },
      {
        image: 'img-03.jpg',
        caption:
          'Korean male university student ruptures a disc while deadlifting 90 kg and is awarded TWD 1.57 million at first instance; Fitness Factory confirms settlement on appeal',
        url: 'https://www.ettoday.net/amp/amp_news.php7?news_id=2475272&ref=mw&from=google.com',
      },
      {
        image: 'img-04.jpg',
        caption:
          'Korean male university student injured while deadlifting 90 kg is awarded TWD 1.57 million at first instance; Fitness Factory settles on appeal',
        url: 'https://tw.news.yahoo.com/%E9%9F%93%E7%94%B7%E5%A4%A7%E7%94%9F-%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E9%87%80%E5%82%B7%E7%8D%B2%E8%B3%A0157%E8%90%AC-%E5%81%A5%E8%BA%AB%E5%B7%A5%E5%BB%A0%E4%BA%8C%E5%AF%A9%E4%BD%8E%E8%AA%BF%E5%92%8C%E8%A7%A3-013448072.html',
      },
      {
        image: 'img-05.jpg',
        caption:
          'Male university student suffers a ruptured disc after deadlifting 90 kg and seeks damages from gym',
        url: 'https://news.ebc.net.tw/news/living/362075',
      },
      {
        image: 'img-06.jpg',
        caption:
          'PTT news: Korean male university student ruptures a disc while deadlifting 90 kg; Fitness Factory ordered to pay TWD 1.57 million at first instance',
        url: 'https://www.ptt.cc/bbs/MuscleBeach/M.1680935985.A.BF6.html',
      },
      {
        image: 'img-07.jpg',
        caption:
          "Blog: A 70 kg Korean male university student deadlifts 90 kg and ruptures a disc—more than TWD 1 million in damages? Was the gym at fault? What was the exerciser's mindset?",
        url: 'https://blog.udn.com/blackjack/179081715',
      },
      {
        image: 'img-08.jpg',
        caption:
          'Legal commentary: Male university student ruptures a disc while deadlifting; well-known gym ordered to pay TWD 1.57 million at first instance',
        url: 'https://lawdb.tw/2023/04/12/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%B7%B4%E7%A1%AC%E8%88%89%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82%EF%BC%8C%E7%9F%A5%E5%90%8D%E5%81%A5%E8%BA%AB%E6%88%BF%E5%88%A4%E8%B3%A0%EF%BC%91%EF%BC%95%EF%BC%97/',
      },
      {
        image: 'img-09.jpg',
        caption: 'Judgment review: Gym beginner asked to deadlift 90 kg, resulting in an acute disc rupture',
        url: 'https://www.instagram.com/p/Crp4vJag7v3/',
      },
      {
        image: 'img-10.jpg',
        caption:
          'Did a Korean male university student rupture a disc after deadlifting 90 kg during a personal-training session?',
      },
    ];
    const expectedCaptionOccurrences = new Map<string, number>();
    for (const { image, caption, url } of mediaRecords) {
      const imageMarkup = `![${caption}](../images/010-taiwan-gym-injury-lawsuit/${image})`;
      const mediaBlock = url
        ? `${imageMarkup}\n\n[${caption}](${url})`
        : `${imageMarkup}\n\n**${caption}**`;
      expect(raw).toContain(mediaBlock);
      if (url) {
        expect(loadedPublicContent).toContain(`[${caption}](${url})`);
      }
      expectedCaptionOccurrences.set(
        caption,
        (expectedCaptionOccurrences.get(caption) ?? 0) + 2,
      );
    }
    for (const [caption, occurrences] of expectedCaptionOccurrences) {
      expect(countOccurrences(raw, caption)).toBe(occurrences);
    }

    expect(countOccurrences(raw, 'featured-01.jpg')).toBe(2);
    for (let imageNumber = 1; imageNumber <= 10; imageNumber += 1) {
      expect(countOccurrences(raw, `img-${String(imageNumber).padStart(2, '0')}.jpg`)).toBe(1);
    }

    const mediaLinks = [
      'https://tw.news.yahoo.com/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82-%E6%80%92%E5%91%8A%E5%81%A5%E8%BA%AB%E6%88%BF%E6%B1%82%E5%84%9F-095800997.html',
      'https://www.ettoday.net/amp/amp_news.php7?news_id=2475272&ref=mw&from=google.com',
      'https://tw.news.yahoo.com/%E9%9F%93%E7%94%B7%E5%A4%A7%E7%94%9F-%E7%A1%AC%E8%88%8990%E5%85%AC%E6%96%A4-%E9%87%80%E5%82%B7%E7%8D%B2%E8%B3%A0157%E8%90%AC-%E5%81%A5%E8%BA%AB%E5%B7%A5%E5%BB%A0%E4%BA%8C%E5%AF%A9%E4%BD%8E%E8%AA%BF%E5%92%8C%E8%A7%A3-013448072.html',
      'https://news.ebc.net.tw/news/living/362075',
      'https://www.ptt.cc/bbs/MuscleBeach/M.1680935985.A.BF6.html',
      'https://blog.udn.com/blackjack/179081715',
      'https://lawdb.tw/2023/04/12/%E7%94%B7%E5%A4%A7%E7%94%9F%E7%B7%B4%E7%A1%AC%E8%88%89%E6%A4%8E%E9%96%93%E7%9B%A4%E7%A0%B4%E8%A3%82%EF%BC%8C%E7%9F%A5%E5%90%8D%E5%81%A5%E8%BA%AB%E6%88%BF%E5%88%A4%E8%B3%A0%EF%BC%91%EF%BC%95%EF%BC%97/',
      'https://www.instagram.com/p/Crp4vJag7v3/',
    ];
    const internalLinks = [
      '/en/taiwan-litigation-lawyer',
      '/en/korean-lawyer-in-taiwan',
      '/en/taiwan-lawyer',
    ];
    for (const link of [...mediaLinks, ...internalLinks]) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(
      raw.match(/\]\((\/en\/[^)]+)\)/g)?.map((link) => link.slice(2, -1)),
    ).toEqual(internalLinks);
    expect(raw).not.toContain('[![');
    expect(loadedPublicContent).not.toMatch(/\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)/i);

    const sourceUrl =
      'https://www.wei-wei-lawyer.com/post/taiwan-gym-injury-lawsuit';
    const judgmentUrl =
      'https://judgment.judicial.gov.tw/FJUD/data.aspx?ty=JD&id=TCDV,109,%E6%B6%88,7,20220124,1';
    expect(countOccurrences(raw, sourceUrl)).toBe(1);
    expect(countOccurrences(raw, judgmentUrl)).toBe(1);
    expect(countOccurrences(raw, 'TWD 1,579,589')).toBe(1);
    expect(raw).toContain(
      `[TWD 1,579,589](${judgmentUrl}) in damages`,
    );
    expect(raw).toContain(
      'In its January 24, 2022 first-instance judgment (109 Consumer No. 7), the Taichung District Court ordered the defendant to pay',
    );
    expect(raw).toContain(
      'Media reports later stated that the parties reached a settlement on appeal.',
    );
    expect(raw).not.toContain('The parties later reached a settlement on appeal.');
    expect(raw).not.toContain('TWD 1,570,000');
    expect(raw).not.toMatch(/\bsettlement (?:amount|of|for)\b[^\n]*\bTWD\b/i);

    const officialLawLinks = [
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=7&pcode=J0170001',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=287&pcode=C0000001',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=237&pcode=C0010001',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=197&pcode=B0000001',
      'https://law.moj.gov.tw/LawClass/LawSingle.aspx?flno=51&pcode=J0170001',
    ];
    for (const link of officialLawLinks) {
      expect(countOccurrences(raw, link)).toBe(1);
    }
    expect(raw).toContain(
      'a business operator providing services must ensure that the services meet the safety reasonably expected under the professional or technical standards current at the time',
    );
    expect(raw).toContain(
      'This rule does not mean that every gym injury establishes liability.',
    );
    expect(raw).toContain(
      'The applicable duty, breach, causation, damage, defenses, and evidence depend on the facts.',
    );
    expect(raw).toContain(
      'Possible contract, tort, and consumer-protection grounds depend on the facts.',
    );
    expect(raw).toContain("within six months after learning the offender's identity");
    expect(raw).toContain(
      'within two years after the claimant learns of both the injury and the person liable',
    );
    expect(raw).toContain('A ten-year longstop runs from the wrongful act.');

    const faqHeadings = [
      '1. What legal routes may be available after a gym injury in Taiwan?',
      '2. What time limits may apply?',
      '3. How can evidence be preserved after an accident?',
      '4. What categories of damages can you claim against a gym?',
      '5. If a gym has liability insurance, why might compensation still be disputed?',
    ];
    expect(
      raw.match(/^\*\*(\d\.[^*]+)\*\*$/gm)?.map((heading) => heading.slice(2, -2)),
    ).toEqual(faqHeadings);

    expect(raw).not.toContain('Civil Code Article 198');
    expect(raw).not.toMatch(/\b(?:win|won|victory|guarantee)\b/i);

    const forbiddenClaims = [
      'Koreans are very fond',
      'Taiwanese consumers often have a weaker',
      'almost impossible',
      'gym will refuse',
      'prevent the gym from destroying',
      'police can obtain',
      "until the plaintiff's retirement",
      'Taiwan gyms are usually insured',
      'insurers are often unwilling',
      'Be sure to pursue litigation',
      'Today I would like to talk about a case that became a major issue',
      'Taiwan’s largest gym',
      'the only listed fitness brand company',
      'major topic of discussion in Taiwan’s fitness industry',
    ];
    for (const claim of forbiddenClaims) {
      expect(raw).not.toContain(claim);
    }
  });
});
