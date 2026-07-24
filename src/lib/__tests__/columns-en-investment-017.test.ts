import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { describe, expect, it } from 'vitest';
import { getColumnPost } from '@/lib/columns';

const columnPath = path.join(
  process.cwd(),
  'src/content/columns-en/017-taiwan-logistics-business-setup.md',
);
const raw = fs.readFileSync(columnPath, 'utf8');
const parsed = matter(raw);
const post = getColumnPost('taiwan-logistics-business-setup', 'en');
const aliasPost = getColumnPost('logistics-business', 'en');

function countOccurrences(value: string, needle: string) {
  return value.split(needle).length - 1;
}

function extractBodySections(content: string) {
  return Array.from(
    content.matchAll(/^## \d+\. (.+)\n\n([^\n]+)$/gm),
    (match) => ({
      heading: match[1],
      a: match[2],
    }),
  );
}

function countVisibleEnglishWords(content: string) {
  const visibleText = content
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/[“”*_`]/g, ' ');

  return (
    visibleText.match(/[A-Za-z0-9]+(?:[.’-][A-Za-z0-9]+)*/g)?.length ?? 0
  );
}

const faq = [
  {
    q: 'Does every logistics-related business in Taiwan need a motor freight carrier license (汽車貨運業)?',
    a: 'Not necessarily. “Logistics” is a broad business term, so a company’s name or registered business activities do not by themselves determine whether a license is required. A company may fall within Taiwan’s regulated motor freight carrier category if it transports other parties’ goods by motor vehicle for compensation. Warehousing, packing, systems operations, shipping one’s own goods, and freight forwarding or other transportation-intermediary services require a fact-specific analysis of the contracts, transportation responsibility, compensation structure, and actual vehicle operations.',
  },
  {
    q: 'What capital, vehicle, and procedural requirements apply to a new general motor freight carrier business?',
    a: 'As a general rule, a new motor freight carrier business must have at least NT$25 million in capital and at least 20 new freight trucks. A business limited to household-goods moving is subject to the separate thresholds of NT$10 million and at least eight new freight trucks. A carrier operating in Kinmen or Lienchiang (Matsu) is subject to the separate thresholds of NT$10 million and at least five new freight trucks, together with geographic operating restrictions. A narrowly defined individual small-truck carrier route has separate requirements, including one personally owned small truck no more than two years old, the appropriate occupational driver’s license, and household registration within the competent authority’s jurisdiction. Foreign-investment review, Ministry of Transportation and Communications approval, establishment-preparation approval (籌設許可), company or business registration, vehicle and facility preparation, the operating license, and trade-association membership must be analyzed as distinct requirements.',
  },
  {
    q: 'Does acquiring a licensed company automatically transfer its motor freight carrier license to the buyer?',
    a: 'No. In a share acquisition, the buyer does not acquire or receive a transfer of the license; the target company remains the same legal entity and continues to hold its license. In a business or asset acquisition, the target’s license does not automatically pass to the buyer. Counsel should verify the license’s validity and authorized scope, vehicles and commercial license plates, parking facilities, trade-association membership, violations and unpaid liabilities, insurance, liens, and change-of-control clauses, and should identify the required foreign-investment approvals and highway authority approvals or change filings.',
  },
  {
    q: 'If our company outsources the actual transportation to a licensed Taiwanese carrier, do we avoid both carrier licensing and work-permit requirements?',
    a: 'There is no categorical answer. The analysis depends on whether the outsourcing company is acting as the shipper or a transportation intermediary, or instead contracts as the carrier and receives the freight charge directly. Verify the contractor’s operating license and commercial vehicles, and align the contract with actual operations so the arrangement does not become license lending or unlicensed carriage. Shareholder or investor status also does not by itself authorize work in Taiwan. A foreign national who will work or manage operations in Taiwan should determine the applicable work-permit requirements and immigration status before beginning those activities.',
  },
];

const bodySections = [
  {
    heading: 'When a Logistics Business Is a Regulated Motor Freight Carrier',
    a: faq[0].a,
  },
  {
    heading: 'Forming a New Motor Freight Carrier Business',
    a: faq[1].a,
  },
  {
    heading: 'Acquiring an Existing Carrier',
    a: faq[2].a,
  },
  {
    heading: 'Outsourcing Transportation and Foreign-National Work Authorization',
    a: faq[3].a,
  },
];

describe('English investment column 017 — logistics and motor freight', () => {
  it('publishes the contracted frontmatter and four exact FAQs', () => {
    const title =
      'Taiwan Logistics Businesses and Motor Freight Carrier Licensing: Formation, Acquisition, and Outsourcing';

    expect(parsed.data.title).toBe(title);
    expect(parsed.data.url).toBe(
      'https://www.wei-wei-lawyer.com/post/taiwan-logistics-business-setup',
    );
    expect(parsed.data.lastmod).toBe('2026-07-25');
    expect(parsed.data.date_display).toBe('September 13, 2025');
    expect(parsed.data.read_time).toBe('12 min read');
    expect(parsed.data.categories).toEqual(['Taiwan Company Formation']);
    expect(parsed.data.featured_image).toBe(
      '../images/017-taiwan-logistics-business-setup/featured-01.jpg',
    );
    expect(parsed.content).toContain(`# ${title}`);
    expect(parsed.data.faq).toEqual(faq);

    expect(post).toBeTruthy();
    expect(post?.slug).toBe('taiwan-logistics-business-setup');
    expect(post?.title).toBe(title);
    expect(post?.date).toBe('2026-07-25');
    expect(post?.dateDisplay).toBe('September 13, 2025');
    expect(post?.readTime).toBe('12 min read');
    expect(post?.category).toBe('formation');
    expect(post?.categoryLabel).toBe('Company Setup');
    expect(post?.faq).toEqual(faq);
  });

  it('aligns each ordered numbered heading with its exact FAQ answer', () => {
    expect(extractBodySections(parsed.content)).toEqual(bodySections);
    expect(extractBodySections(post?.content ?? '')).toEqual(bodySections);
  });

  it('uses a substance-over-form licensing analysis and identifies the authorities', () => {
    const requiredPhrases = [
      'Warehousing, packing, logistics systems, freight forwarding, shipping a company’s own goods',
      'who receives the transportation charge',
      'who dispatches the vehicles',
      'who controls the drivers and vehicles',
      'Taiwan’s Highway Act (公路法)',
      'contracts as the carrier, receives the freight charge, dispatches the vehicles',
      'who bears responsibility for loss, damage, delay, and third-party claims',
      'how warehousing, packing, information systems, freight forwarding, and other ancillary services are separated from the physical transportation',
      'Under Article 3 of the Highway Act, the central highway authority is the Ministry of Transportation and Communications (MOTC).',
      'Providing services commonly described as “logistics”',
      'The Directorate General of Highways and its relevant offices provide current application instructions and administrative guidance.',
      'the competent authority before selecting its registered business activities',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('states every capital and vehicle route and narrowly states the plate limitation', () => {
    const requiredPhrases = [
      'at least NT$25 million in capital and at least 20 new freight trucks',
      'at least NT$10 million in capital and at least eight new freight trucks',
      'at least NT$10 million in capital and at least five new freight trucks',
      'authorized operating area is geographically restricted',
      'household registration within the competent authority’s jurisdiction',
      'one personally owned small truck no more than two years old',
      'It is not the usual means by which a foreign legal entity enters the regulated carrier market.',
      'For a newly established motor transportation enterprise, commercial vehicle plates issued to its vehicles may not be surrendered for deregistration (繳銷) or transferred through a change in registered vehicle ownership (過戶轉讓) during the first year after issuance.',
      'Scrapping, replacement, and other forms of disposition should be assessed separately under the highway authority’s current rules.',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('separates Article 35 sector approval, investment routes, and formation steps', () => {
    const requiredPhrases = [
      'Under Article 35 of the Highway Act, a foreign individual or foreign legal entity must first obtain approval from the MOTC, the central highway authority, before applying to invest in and operate a motor freight carrier.',
      'Department of Investment Review, Ministry of Economic Affairs (MOEA)',
      'Investments in listed or over-the-counter securities',
      'branches of foreign companies',
      'science-park or industrial-park authorities',
      'investments from the Mainland Area',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }

    const setupSection = parsed.content.slice(
      parsed.content.indexOf('### Typical Formation Sequence'),
      parsed.content.indexOf('## 3.'),
    );
    const sequence = [
      'Define the proposed operations',
      'Obtain the applicable foreign-investment approval',
      'Apply for establishment-preparation approval',
      'Complete the company or business registration',
      'Apply for the operating license',
    ];
    const positions = sequence.map((step) => setupSection.indexOf(step));
    expect(positions.every((position) => position >= 0)).toBe(true);
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
  });

  it('qualifies facility evidence, preparation periods, and commencement', () => {
    const requiredPhrases = [
      'evidence of ownership or a right to use them',
      'It is not accurate to state categorically that every operator must lease its own dedicated parking lot.',
      'articles of incorporation, shareholder register, parking-facility approvals',
      'maintenance agreement, vehicle purchase documents, and vehicle list',
      'generally must be completed within six months',
      'An additional extension of up to six months may be available in special circumstances.',
      'generally must begin operations within one month',
      'submit a copy of a valid membership certificate issued by the relevant trade association to the competent highway authority',
      'cure application deficiencies and secure land, facilities, vehicles, insurance, and other operational necessities',
      'the entire process therefore cannot be reduced to a single guaranteed timetable',
      'is not the total time required to establish a motor freight carrier',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('distinguishes share purchases, asset deals, Article 23 changes, and diligence', () => {
    const requiredPhrases = [
      'The funds remitted for the shares are the purchase price, not paid-in capital.',
      'MOEA preapproval',
      'post-remittance verification of the investment amount (投資額審定)',
      'the seller’s operating license does not automatically vest in the purchaser',
      'Article 23 of the Motor Transportation Enterprise Regulations (汽車運輸業管理規則)',
      'a transfer of the business and for changes to the organization, name, address, responsible person, capital or assets, and parking facilities',
      'authorized business type, territory and conditions',
      'administrative sanctions, and unpaid taxes, fees, fines, or other liabilities',
      'liens, leases, and financing',
      'material contracts with shippers, service providers, systems vendors, and warehouses, including change-of-control clauses',
      'representations and warranties, conditions precedent',
      'price adjustments, indemnification, closing deliverables, working capital',
      'transfer of vehicles and contracts',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('qualifies outsourcing and separates investment, work, and immigration status', () => {
    const requiredPhrases = [
      'a licensed Taiwanese motor freight carrier to perform the physical transportation',
      'merely the shipper or a transportation intermediary',
      'contracts as the carrier and receives the freight charge',
      'The arrangement must not permit license lending or physical carriage by an unlicensed operator.',
      'dependence on the licensed operator, service levels, cargo loss, damage, and delay',
      'protection of personal information and logistics data, subcontracting, indemnification',
      'the orderly transition of data, cargo, and customer-service responsibilities when the relationship ends',
      'does not itself confer authorization to work or immigration status',
      'determine whether the actual role requires a work permit before beginning that work',
      'administrative fines and an order to leave Taiwan',
      'generally prescribe a three-year bar on entry in unauthorized-work cases',
      'circumstances in which the bar may be waived or shortened',
      'A third party’s report does not mechanically determine the result',
    ];

    for (const phrase of requiredPhrases) {
      expect(raw).toContain(phrase);
      expect(post?.content).toContain(phrase);
    }
  });

  it('uses all official sources, both images, and exactly the three safe English links', () => {
    const officialSources = [
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040001',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040004',
      'https://law.moj.gov.tw/LawClass/LawAll.aspx?pcode=K0040003',
      'https://www.thb.gov.tw/cp.aspx?n=392',
      'https://www.thb.gov.tw/cp.aspx?n=507',
      'https://cyi2.thb.gov.tw/cp.aspx?n=1962',
      'https://www.thb.gov.tw/cl.aspx?n=259',
      'https://www.thb.gov.tw/cp.aspx?n=356',
      'https://www.mvdis.gov.tw/webMvdisLaw/Download.aspx?ID=22746&type=Law',
      'https://law.moea.gov.tw/LawContent.aspx?id=FL011158&media=print',
      'https://mnscdn.moea.gov.tw/Mns/dir/content/Content.aspx?menu_id=42885',
      'https://www.moea.gov.tw/Mns/dir/investment/wHandDirApply_File.ashx?file_id=49',
      'https://laws.mol.gov.tw/FLAW/FLAWDOC01.aspx?flno=43&id=FL015128',
      'https://laws.mol.gov.tw/flaw/FLAWDOC01.aspx?flno=68&id=FL015128',
      'https://www.immigration.gov.tw/5475/5478/141478/141482/148796/cp',
    ];
    const images = [
      '../images/017-taiwan-logistics-business-setup/featured-01.jpg',
      '../images/017-taiwan-logistics-business-setup/img-01.jpg',
    ];
    const internalLinks = [
      '/en/services#investment',
      '/en/lawyers/wei-tseng',
      '/en/contact',
    ];

    for (const source of officialSources) {
      expect(countOccurrences(raw, source)).toBe(1);
    }
    expect(countOccurrences(raw, images[0])).toBe(2);
    expect(countOccurrences(raw, images[1])).toBe(1);
    expect(post?.featuredImage).toBe(
      '/images/blog/017-taiwan-logistics-business-setup/featured-01.jpg',
    );
    for (const link of internalLinks) {
      expect(countOccurrences(raw, link)).toBe(1);
      expect(post?.content).toContain(`(${link})`);
    }

    const bodyLinks =
      parsed.content.match(/\]\((\/(?:en|ko|ja|zh-hant)\/[^)]+)\)/g) ?? [];
    expect(bodyLinks).toEqual([
      '](/en/services#investment)',
      '](/en/lawyers/wei-tseng)',
      '](/en/contact)',
    ]);
  });

  it('ends with the contracted disclaimer and canonical attorney identity', () => {
    expect(parsed.content).toContain(
      'This article is an educational overview of the general legal framework and is not legal advice for any specific matter.',
    );
    expect(parsed.content).toContain(
      'Licensing standards, application forms, and agency practice may change.',
    );
    expect(
      parsed.content
        .trimEnd()
        .endsWith('**Wei Tseng (曾雋崴), Taiwan Attorney**'),
    ).toBe(true);
    expect(post?.content).toContain('**Wei Tseng (曾雋崴), Taiwan Attorney**');
  });

  it('contains substantial English prose and locks the final 200-wpm read time', () => {
    const visibleWords = countVisibleEnglishWords(parsed.content);
    const minutes = Math.ceil(visibleWords / 200);

    expect(visibleWords).toBe(2340);
    expect(visibleWords).toBeGreaterThan(2000);
    expect(minutes).toBe(12);
    expect(parsed.data.read_time).toBe(`${minutes} min read`);
    expect(post?.readTime).toBe(`${minutes} min read`);
  });

  it('resolves the canonical and alias slugs to the same complete English post', () => {
    expect(post).toBeTruthy();
    expect(aliasPost).toBeTruthy();
    expect(aliasPost?.slug).toBe('taiwan-logistics-business-setup');
    expect(aliasPost?.title).toBe(post?.title);
    expect(aliasPost?.content).toBe(post?.content);
    expect(post?.content.length).toBeGreaterThan(12000);
  });

  it('contains no forbidden legacy claims, language leakage, or unsafe identity', () => {
    const forbiddenStrings = [
      'Coupang',
      'Investment Commission',
      'all foreign investment',
      'hold the 20 trucks for one year',
      'no concern about obtaining',
      'Remit capital',
      'company transfer',
      'outsourcing volume',
      'least investment and smallest risk',
      'if reported, entry to Taiwan may be banned for three years',
      'helped Korean enterprises successfully',
      'matching logistics companies',
      'company accounting',
      'automobile freight transport business',
      'preparatory establishment permit official document',
      'apply for filing',
      'Providing services that fall within a broad commercial understanding of logistics',
      'its responsible offices provide current application instructions',
      'to the responsible authority before selecting its registered business activities',
      '### Capital and Vehicle Requirements, Including Narrow Alternatives',
      'For a company forming a general motor freight carrier',
      'The individual small-truck carrier route is a narrow regime',
      'The order and responsible filing office',
      'corrections, land and facilities, vehicles, insurance, and other preparations depends on the matter',
      'documentary evidence and primary records should be checked against the responsible authority’s records',
      'indemnification, delivery, working capital, and transition of vehicles and contracts',
      'generally provide a three-year entry-bar period for unauthorized work',
      'directions on entry-bar periods',
      'Scrapping, replacement, and other treatment should be checked separately',
      'the contract still should address dependency on the licensed operator',
      'cargo loss, damage and delay',
      'the transition of data, cargo, and customer service when the relationship ends',
      'the responsible authorities assess the facts',
      '/ko/',
      '/ja/',
      '/zh-hant/',
      '曾俊瑋',
    ];

    for (const phrase of forbiddenStrings) {
      expect(raw).not.toContain(phrase);
    }
    expect(raw).not.toMatch(/[\uac00-\ud7af]/u);
    expect(raw).not.toMatch(/[\u3040-\u30ff]/u);
  });
});
