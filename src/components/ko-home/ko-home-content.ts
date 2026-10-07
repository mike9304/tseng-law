/**
 * Content for the ko home (Korean identity, 2026-10-06; operator: 「한국도 한국 개성으로 디자인 해봐」; 2026-10-07:
 * 「한국 세종로펌 디자인으로 비슷하게 변형, 색감도 비슷하게」 — the layout grammar and palette of a Korean big-firm site,
 * never its logo, photography or wording). Every line restates existing ko site copy — no new claims. Sources are cited
 * per block.
 */

/** The first-screen photograph: the site's own Taipei 101 blue-hour picture (an earlier home hero poster). Decorative —
 *  the h1 over it carries the meaning. The tower stands at ~80% of the width, so phones crop towards it. */
export const KO_HERO_IMAGE = { src: '/images/hero-taipei-101-blue-hour.webp', width: 1600, height: 900 } as const;

/**
 * The first-screen glossary: Taiwan legal terms as the firm's ko columns print them, 「한국어(漢字)」 — 대표사무소(辦事處),
 * 퇴직금(資遣費), 조정(調解), 유산세(遺產稅), 이민서(移民署), 경시계좌(警示帳戶) (src/content/columns/*.md, checked
 * 2026-10-06; ko-home-identity.test.ts pins each pair to a ko column). The area is the ko service or column topic the term belongs to. Each row runs the site search for
 * the Korean term, which lists the columns, FAQ and pages about it.
 */
export const KO_LEDGER = [
  { han: '辦事處', ko: '대표사무소', area: '투자·법인설립' },
  { han: '資遣費', ko: '퇴직금', area: '노동·고용' },
  { han: '調解', ko: '조정', area: '노동·민사' },
  { han: '遺產稅', ko: '유산세', area: '상속' },
  { han: '移民署', ko: '이민서', area: '비자·체류' },
  { han: '警示帳戶', ko: '경시계좌', area: '사기·형사' },
] as const;

/** Search shortcuts under the first screen: matters Korean readers bring to a Taiwan lawyer. */
export const KO_SEARCH_CHIPS = ['회사설립', '비자', '이혼', '상속', '교통사고', '퇴직금'] as const;

/**
 * Entry points by reader situation. Titles and lines restate the ko services (site-content ko services.items), the
 * company-setup / dispute paths of the former hero (multilingual-international-v2 ko), the traffic-accident board
 * and the 「한국어 가능한 대만 변호사」 landing (site-content ko).
 */
export const KO_SITUATIONS = [
  {
    title: '대만 진출 기업',
    text: '법인 형태 선택부터 투자심의위원회 승인, 업종별 인허가, 상표 선등록 확인까지.',
    links: [
      { label: '대만 회사설립 상담하기', href: '/ko/taiwan-company-setup-lawyer' },
      { label: '대만 회사설립 가이드 읽기', href: '/ko/guides/taiwan-company-setup' },
      { label: '노동법·고용분쟁', href: '/ko/services/labor' },
      { label: '지적재산·금융분쟁', href: '/ko/services/ip' },
    ],
  },
  {
    title: '분쟁과 소송',
    text: '계약 분쟁과 손해배상, 소비자 피해, 형사 절차의 수사 대응.',
    links: [
      { label: '대만 분쟁 상담하기', href: '/ko/taiwan-litigation-lawyer' },
      { label: '민사소송·손해배상', href: '/ko/services/civil' },
      { label: '교통사고', href: '/ko/traffic-accidents' },
      { label: '형사소송', href: '/ko/services/criminal' },
    ],
  },
  {
    title: '대만의 가족과 생활',
    text: '이혼과 재산분할, 친권, 상속.',
    links: [
      { label: '가사소송', href: '/ko/services/family' },
      { label: '한국어 가능한 대만 변호사', href: '/ko/korean-lawyer-in-taiwan' },
    ],
  },
] as const;

/**
 * How a first email becomes a retained matter — a real sequence, so the steps are numbered. Each step restates ko
 * site facts: public-contact.ts ko (outline and contact details first; sensitive data only when the attorney asks),
 * PricingCards ko (「사건 내용을 확인한 후 견적을 안내드립니다」, 일반 법률상담 NT$ 3,000 / 1시간, and the disclaimer's
 * 「사건의 특성·복합성·긴급도에 따라 변동될 수 있습니다」 / 「정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다」),
 * legal-pages ko (「정식 자문 또는 수임은 별도의 검토와 동의 절차가 완료된 경우에만 성립합니다」), team-members ko and the
 * four consultation languages. Title: the contact page's 「상담 진행 흐름」.
 */
export const KO_PROCESS = [
  { title: '이메일 문의', text: '사건 또는 업무의 개요와 연락처를 보내 주세요. 주민등록번호·여권번호·계좌번호 등 민감정보는 담당 변호사의 별도 안내 후 제출해 주세요.' },
  { title: '사건 내용 확인', text: '사건 내용을 확인한 후 견적을 안내드립니다. 일반 법률상담은 NT$ 3,000 / 1시간이며, 사건의 특성·복합성·긴급도에 따라 변동될 수 있습니다.' },
  { title: '서면 견적', text: '정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다.' },
  { title: '수임과 진행', text: '정식 자문 또는 수임은 별도의 검토와 동의 절차가 완료된 경우에만 성립합니다. 이후 증준외 변호사가 이끄는 팀이 담당하며, 한국어·중국어·일본어·영어로 소통합니다.' },
] as const;
