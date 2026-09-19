import type { SiteLocale } from '@/lib/locales';
import type { FAQItem } from '@/data/faq-content';

export const intentPageSlugs = [
  'taiwan-lawyer',
  'taiwan-company-setup-lawyer',
  'taiwan-litigation-lawyer',
  'taiwan-semiconductor-supplier-legal',
] as const;

export type IntentPageSlug = (typeof intentPageSlugs)[number];

export const DEFAULT_INTENT_TOP_FAQ_IDS = ['faq-0', 'faq-1', 'faq-2'] as const;

export type IntentPageContent = {
  slug: IntentPageSlug;
  /** 화면 H1과 빵부스러기에 그대로 노출되는 제목. */
  title: string;
  /**
   * `<title>`·og:title 전용 제목. SEO용 파이프 제목을 화면 H1에서 분리하려는
   * 페이지만 채우며, 비어 있으면 `title`을 그대로 쓴다.
   */
  seoTitle?: string;
  label: string;
  description: string;
  keywords: string[];
  searchTerms: string[];
  heroPoints: string[];
  idealFor: string[];
  reviewPoints: string[];
  processFlow: string[];
  prepareChecklist: string[];
  cautionPoints: string[];
  serviceSlugs: string[];
  /**
   * 서비스 카드 본문을 이 페이지 맥락으로 덮어쓴다. 키는 `serviceSlugs`의 값이며,
   * 없는 키는 공용 서비스 소개(`service-details`)를 그대로 쓴다.
   */
  serviceBlurbs?: Record<string, string>;
  /** 사이드바 변호사 카드 제목의 페이지별 문구. 없으면 로케일 공용 문구. */
  attorneyHeadingOverride?: string;
  /** 하단 CTA 본문의 페이지별 문구. 없으면 로케일 공용 문구. */
  ctaTextOverride?: string;
  columnSlugs: string[];
  faq: FAQItem[];
  /** FAQ entries shown above Related Services. `faq-N` selects `faq[N]`. */
  topFaqIds?: readonly string[];
};

export const intentPages: Record<SiteLocale, Record<IntentPageSlug, IntentPageContent>> = {
  ko: {
    'taiwan-lawyer': {
      slug: 'taiwan-lawyer',
      label: '상담 안내',
      title: '대만변호사 | 한국어 상담·소송·법인설립 지원',
      description: '한국 고객이 찾는 대만변호사의 한국어 상담, 소송, 대만 법인설립 지원 범위와 진행 방식, 관련 서비스와 칼럼을 정리한 안내 페이지입니다.',
      keywords: ['대만변호사', '증준외 변호사', '한국어 가능한 대만 변호사', '대만 소송 변호사', '대만 회사설립 변호사', '대만법인설립'],
      searchTerms: ['대만변호사', '증준외 변호사', '한국어 가능한 대만 변호사', '대만법인설립'],
      heroPoints: [
        '한국 고객의 대만 법인설립(회사설립), 투자, 민사·형사·가사 분쟁을 한국어로 연결합니다.',
        '초기 사실관계 정리부터 문서 검토, 절차 설계, 소송 대응까지 한 흐름으로 검토합니다.',
        '증준외 대만 변호사 프로필, 공개 칼럼, YouTube·블로그 채널까지 함께 확인할 수 있습니다.',
      ],
      idealFor: [
        '대만 법률문제를 한국어로 설명받고 싶은 경우',
        '대만 변호사와 바로 연결해야 하는 회사설립·투자 이슈',
        '민사소송, 손해배상, 교통사고, 이혼·상속 등 분쟁 사건',
        '초기 상담 전에 준비 자료와 절차를 먼저 확인하고 싶은 경우',
      ],
      reviewPoints: [
        '사건 유형에 따라 관할, 일정, 증거 확보 방식이 달라집니다.',
        '한국 본사 구조와 대만 현지 절차를 함께 맞춰야 하는 경우가 많습니다.',
        '외국인 사건은 통역, 위임장, 송달, 출입국 이슈까지 함께 점검해야 합니다.',
        '법률자문과 실제 집행 가능성은 한 번에 같이 봐야 합니다.',
      ],
      processFlow: [
        '사건 또는 사업 목적을 먼저 정리하고, 관련 계약서·증거가 어느 정도 있는지 1차로 확인합니다.',
        '대만 기준 관할, 절차, 예상 일정, 현지 출석 필요 여부를 구분해 상담 우선순위를 정합니다.',
        '상담 후 바로 진행 가능한 단계와 추가 확인이 필요한 단계를 나눠 실제 실행 순서를 제안합니다.',
      ],
      prepareChecklist: [
        '계약서, 이메일, 메신저 대화, 견적서, 송금 내역',
        '상대방 기본 정보와 회사명·주소·대표자 정보',
        '사건 발생일, 현재 진행 상태, 급한 일정',
        '사진·영상·진단서·등기부 등 핵심 증빙',
      ],
      cautionPoints: [
        '한국에서 익숙한 방식이 대만 절차와 다를 수 있습니다.',
        '번역만 맞추고 서류 형식이나 위임장 요건을 놓치기 쉽습니다.',
        '초기 연락 기록을 정리하지 않으면 이후 입증이 어려워질 수 있습니다.',
        '비자·체류 상태가 사건 대응 일정에 영향을 주는 경우가 있습니다.',
      ],
      serviceSlugs: ['investment', 'civil', 'family'],
      columnSlugs: ['taiwan-company-establishment-basics', 'taiwan-gym-injury-lawsuit', 'taiwan-divorce-lawsuit-qna'],
      faq: [
        {
          question: '대만변호사를 찾을 때 가장 먼저 확인해야 할 점은 무엇인가요?',
          answer:
            '사건 유형과 언어 대응 여부를 먼저 확인하는 것이 좋습니다. 한국 고객의 경우 한국어 커뮤니케이션, 대만 현지 절차 경험, 위임장과 송달 처리 경험이 함께 중요합니다.',
        },
        {
          question: '한국에서 바로 상담을 시작할 수 있나요?',
          answer:
            '가능합니다. 이메일과 화상 상담으로 사실관계를 먼저 정리한 뒤, 필요한 경우 대만 현지 절차와 서류 준비 순서를 안내합니다.',
        },
        {
          question: '대만변호사 상담 전에는 어떤 자료를 준비하면 좋나요?',
          answer:
            '계약서, 견적서, 상대방 정보, 사건 발생일, 현재 진행 상태, 사진·영상·진단서 같은 핵심 증거를 먼저 정리하면 상담 정확도가 올라갑니다.',
        },
      ],
    },
    'taiwan-company-setup-lawyer': {
      slug: 'taiwan-company-setup-lawyer',
      label: '상담 안내',
      title: '대만 법인설립·회사설립 변호사 | 절차·비용·기간',
      description: '대만 법인설립(회사설립)의 절차, 비용, 기간과 투자 승인, 지사·자회사 선택, 인허가 및 운영 리스크까지 검토하는 대만 변호사 상담 안내입니다.',
      keywords: ['대만 회사설립 변호사', '대만 법인설립 변호사', '대만 투자 변호사', '증준외 변호사', '대만 자회사 지사', '대만법인설립'],
      searchTerms: ['대만 회사설립 변호사', '대만 법인설립 변호사', '대만 투자 변호사', '대만법인설립'],
      heroPoints: [
        '법인 형태 선택, 투자 승인, 자본금 송금, 등기, 인허가를 한 흐름으로 검토합니다.',
        '자회사·지사·연락사무소 구조 차이와 업종별 규제를 한국 고객 관점에서 정리합니다.',
        '법인설립(회사설립) 이후 비자, 상표, 계약, 고용 리스크까지 이어서 볼 수 있습니다.',
      ],
      idealFor: [
        '한국 본사 기준으로 대만 법인 구조를 결정해야 하는 경우',
        '지사와 자회사 중 어느 형태가 맞는지 비교가 필요한 경우',
        '화장품·물류 등 업종별 인허가를 병행해야 하는 경우',
        '설립 이후 비자, 상표, 근로계약까지 같이 검토하고 싶은 경우',
      ],
      reviewPoints: [
        '투자 승인과 자본금 송금 단계는 일정과 서류 누락에 민감합니다.',
        '영업 주소, 업종 코드, 실질 운영 구조가 맞지 않으면 후속 절차가 지연될 수 있습니다.',
        '특수 업종은 회사설립만으로 끝나지 않고 별도 허가가 필요합니다.',
        '회사설립 후 계약·노무·상표 전략까지 같이 설계해야 운영 리스크가 줄어듭니다.',
      ],
      processFlow: [
        '진출 목적과 매출 구조를 기준으로 자회사·지사·연락사무소 중 어떤 형태가 맞는지 먼저 비교합니다.',
        '투자 승인 필요 여부, 자본금 규모, 주주 구조, 영업 주소를 정리해 설립 전제조건을 확정합니다.',
        '등기 이후 은행, 세무, 비자, 상표, 고용계약까지 이어지는 일정을 한 번에 설계합니다.',
      ],
      prepareChecklist: [
        '한국 본사 등기서류, 주주구조, 대표자 정보',
        '예상 업종, 영업모델, 대만 영업주소 후보',
        '예상 자본금, 송금 계획, 현지 인력 채용 여부',
        '필요한 인허가 또는 제품·서비스 규제 정보',
      ],
      cautionPoints: [
        '업종 코드와 실제 사업 내용이 다르면 허가 단계에서 지연될 수 있습니다.',
        '은행 계좌 개설은 설립 완료와 별개로 시간이 더 걸릴 수 있습니다.',
        '화장품·물류·식품·플랫폼 업종은 추가 규제가 붙을 수 있습니다.',
        '비자와 노동계약을 나중에 따로 보면 일정이 늘어집니다.',
      ],
      serviceSlugs: ['investment', 'ip', 'labor'],
      columnSlugs: [
        'taiwan-company-establishment-basics',
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
        'taiwan-logistics-business-setup',
      ],
      faq: [
        {
          question: '대만 회사설립은 보통 얼마나 걸리나요?',
          answer:
            '일반적으로 약 3개월 전후를 예상하지만, 투자 승인 대상 여부, 자본금 송금 시점, 업종별 허가 필요성에 따라 달라질 수 있습니다.',
        },
        {
          question: '지사와 자회사 중 어느 쪽이 더 많이 선택되나요?',
          answer:
            '책임 구조, 세무, 향후 투자 계획에 따라 달라집니다. 독립 운영과 현지 확장을 고려하면 자회사를, 본사 직결 구조를 원하면 지사를 검토하는 경우가 많습니다.',
        },
        {
          question: '회사설립만 맡기면 끝나는 건가요?',
          answer:
            '실무상은 그렇지 않습니다. 법인등기 이후 은행, 세무, 비자, 상표, 근로계약, 업종별 인허가까지 이어지는 경우가 많아 초기 설계부터 함께 보는 편이 효율적입니다.',
        },
      ],
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: '상담 안내',
      title: '대만 소송 변호사 | 민사·형사·노동 한국어 대응',
      description: '대만 민사소송, 손해배상, 형사 대응, 가사 분쟁에서 한국 고객이 먼저 확인해야 할 포인트를 정리한 안내입니다.',
      keywords: ['대만 소송 변호사', '대만 민사소송 변호사', '대만 손해배상 변호사', '대만 형사소송 변호사', '증준외 변호사'],
      searchTerms: ['대만 소송 변호사', '대만 민사소송 변호사', '대만 손해배상 변호사'],
      heroPoints: [
        '민사소송, 손해배상, 교통사고, 형사 절차, 이혼·상속 분쟁까지 사건 유형별 대응 흐름을 정리합니다.',
        '외국인 사건은 증거 확보, 번역, 송달, 출입국 이슈를 함께 봐야 합니다.',
        '증준외 대만 변호사의 관련 사례와 칼럼을 함께 연결해 실제 판단 기준을 확인할 수 있습니다.',
      ],
      idealFor: [
        '대만에서 사고, 손해, 계약 분쟁이 발생한 경우',
        '형사 고소 또는 경찰 조사 대응이 필요한 경우',
        '국제이혼, 친권, 상속처럼 한국과 대만 법이 함께 얽히는 경우',
        '소송 전에 합의 가능성과 증거 방향을 먼저 점검하고 싶은 경우',
      ],
      reviewPoints: [
        '초기 사실관계 정리와 증거 확보 속도가 결과에 큰 영향을 줍니다.',
        '형사 절차와 민사 손해배상을 같이 설계하면 전략이 달라질 수 있습니다.',
        '외국인 사건은 언어와 문서 번역보다도 절차 일정 관리가 더 중요할 때가 많습니다.',
        '합의 여부를 판단하기 전 손해 산정과 책임 구조를 먼저 확인해야 합니다.',
      ],
      processFlow: [
        '사실관계, 상대방, 손해 범위를 먼저 시간순으로 정리해 사건 구조를 잡습니다.',
        '민사·형사·가사 중 어떤 절차를 병행해야 하는지 구분하고 우선순위를 정합니다.',
        '합의 가능성, 증거 부족 부분, 출석 필요 단계까지 함께 검토해 대응 전략을 나눕니다.',
      ],
      prepareChecklist: [
        '사건 경위서, 계약서, 통화·메신저 기록',
        '진단서, 사진, 영상, 영수증, 경찰 자료',
        '상대방 인적사항 또는 회사 정보',
        '현재 진행 중인 조사·재판·합의 여부',
      ],
      cautionPoints: [
        '초기 진술과 제출 자료가 뒤집히면 신뢰도가 크게 떨어집니다.',
        '형사 고소만 하고 민사 손해 산정을 늦추는 경우가 많습니다.',
        '외국인 사건은 송달과 일정 관리가 생각보다 오래 걸릴 수 있습니다.',
        '감정적으로 대응하면 합의와 소송 전략이 모두 흔들릴 수 있습니다.',
      ],
      serviceSlugs: ['civil', 'criminal', 'family'],
      columnSlugs: [
        'taiwan-gym-injury-lawsuit',
        'taiwan-traffic-accident-procedure',
        'taiwan-divorce-lawsuit-qna',
        'taiwan-inheritance-custody-analysis',
      ],
      faq: [
        {
          question: '대만 소송은 한국에 있어도 진행할 수 있나요?',
          answer:
            '사건에 따라 가능합니다. 위임장, 문서 준비, 연락 체계를 먼저 정리하면 한국에 있으면서 초기 대응을 시작할 수 있고, 출석이 필요한 단계만 별도로 검토할 수 있습니다.',
        },
        {
          question: '형사와 민사를 같이 검토해야 하는 경우가 있나요?',
          answer:
            '교통사고, 상해, 사기, 횡령처럼 사실관계가 겹치는 사건은 형사 절차와 민사 손해배상 전략을 함께 짜는 편이 많습니다.',
        },
        {
          question: '소송 전에 합의가 가능한지도 같이 봐주나요?',
          answer:
            '가능합니다. 다만 합의가 유리한지 판단하려면 손해 범위, 책임 비율, 증거 상태를 먼저 검토해야 하므로 사건 자료를 함께 보는 것이 좋습니다.',
        },
      ],
    },
    'taiwan-semiconductor-supplier-legal': {
      slug: 'taiwan-semiconductor-supplier-legal',
      label: '검색 가이드',
      title: '대만 반도체 소재·장비 공급사를 위한 법무 안내',
      seoTitle: '대만 반도체 소재·장비 공급사 법무 | 법인설립·계약·고용·미수금',
      description:
        '대만 팹·패키징 업체에 소재나 장비를 납품하는 한국 공급사가 현지 법인, 공급 계약, 기술 인력 체류, 대금 회수를 어떻게 준비하는지 정리했습니다. 상담은 영어·중국어·한국어·일본어로 합니다.',
      keywords: [
        '대만 반도체 소재 장비',
        '대만 반도체 공급사 법무',
        '대만 법인설립',
        '대만 공급 계약',
        '대만 미수금',
      ],
      searchTerms: [
        '대만 반도체 소재 장비 법무',
        '대만 반도체 공급사 법인설립',
        '대만 장비 공급사 계약',
      ],
      attorneyHeadingOverride: '반도체 공급사 사안을 맡는 대만 변호사',
      ctaTextOverride:
        '현지 법인이 정말 필요한지, 계약서만 손보면 되는지는 거래처 요구와 거래 규모, 앞으로의 물량 계획에 따라 답이 다릅니다. 견적서, 공급 계약서, 거래처가 보낸 요구 사항을 보내주시면 증준외 대만 변호사가 먼저 방향을 잡아 드립니다.',
      heroPoints: [
        // REVIEW: 변호사 검수 필요 — 거래처의 벤더 등록 요구를 법인 없이 충족할 수 있는지에 대한 판단이 걸린 문장
        '대만 팹이나 OSAT(후공정 패키징·테스트) 업체가 벤더 등록을 요구하면서 현지 법인을 함께 요청하는 경우가 있습니다. 법인이 실제로 필요한 요구인지, 지사나 기존 대리점 구조로도 납품이 이어지는지를 거래처가 보낸 서식을 놓고 확인합니다.',
        // REVIEW: 변호사 검수 필요 — 품질보증·납기 지연·리콜 비용 분담 조항의 검토 범위를 언급
        '소재는 정기 납품, 장비는 설치와 현장 대응까지 이어지기 때문에 계약서에서 볼 조항이 달라집니다. 품질보증 범위, 납기가 밀렸을 때의 처리, 리콜이 났을 때 비용을 누가 부담하는지를 계약서 문언 그대로 짚습니다.',
        // REVIEW: 변호사 검수 필요 — 기술자 체류 절차와 법인 형태 선택의 연계를 서술
        '장비 설치나 라인 대응으로 한국 기술자가 자주 오간다면, 어떤 법인 형태와 체류 절차를 준비할지 설립 단계에서 같이 검토합니다.',
      ],
      idealFor: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요건과 현지 법인 필요 여부의 연결
        '대만 팹·OSAT·부품업체가 벤더 등록을 요구해 현지 법인이 필요한지 판단해야 하는 경우',
        '지금까지 대만 대리점을 거쳐 넘기던 물량을 최종 고객과 직접 계약으로 바꾸려는 경우',
        '장비 설치와 정기 점검 때문에 한국 기술자가 반복해서 대만에 들어가야 하는 경우',
        // REVIEW: 변호사 검수 필요 — 근로계약 조건 설계를 언급
        '현지 A/S 인력을 처음 채용하면서 근로계약 조건을 어떻게 정할지 확인이 필요한 경우',
        '납품과 검수는 끝났는데 대금이 몇 달째 들어오지 않는 경우',
      ],
      reviewPoints: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요구의 성격에 따라 필요한 조직 형태가 달라진다는 서술
        '거래처의 벤더 등록 요구가 정확히 무엇을 뜻하는지는 서식마다 다릅니다. 구매 담당자가 보낸 서식과 메일을 함께 보는 편이 빠릅니다.',
        // REVIEW: 변호사 검수 필요 — 검수·인수 시점이 대금 청구와 하자 대응에 미치는 영향을 서술
        '장비 공급은 검수 기준과 인수 시점을 어디에 두느냐에 따라 대금 청구와 하자 대응 순서가 달라지므로 계약서 문언부터 짚습니다.',
        // REVIEW: 변호사 검수 필요 — 기술자 체류와 현지 채용 일정의 연계를 서술
        '한국 기술자의 체류 준비와 현지 채용은 설립 일정과 붙여 봐야 실제로 라인 대응이 가능한 시점이 나옵니다.',
      ],
      processFlow: [
        // REVIEW: 변호사 검수 필요 — 현지 법인 없이 납품 가능한 구조인지 확인한다는 서술
        '거래처가 보낸 벤더 등록 서식과 구매 조건서를 먼저 읽고, 현지 법인 없이 납품이 되는 구조인지 확인합니다.',
        '법인이 필요하다면 자회사·지사·연락사무소를 세무 처리, 계약 체결 주체, 현지 채용 계획 세 가지 기준으로 비교합니다.',
        '등기 완료 예정일을 기준으로 공급 계약 서명, 기술자 출장, 현지 직원 채용 시점을 역산해 하나의 일정표로 맞춥니다.',
      ],
      prepareChecklist: [
        '거래처가 보낸 벤더 등록 서식, 구매 조건서, 최근 견적서와 발주서',
        '현재 쓰고 있는 공급 계약서·NDA·대리점 계약서(한국어본과 영문본 모두)',
        '대만에 보낼 기술자 수와 체류 기간, 현지에서 채용할 인원 계획',
        '대금이 밀린 건이 있으면 청구서, 납품·검수 기록, 독촉 메일, 상대 회사 등기 정보',
      ],
      cautionPoints: [
        '벤더 등록 마감에 맞추려고 법인 형태를 먼저 정해 버리면, 뒤늦게 세무나 채용 계획과 어긋나 다시 바꾸는 경우가 있습니다.',
        // REVIEW: 변호사 검수 필요 — 한국 본사 양식 계약서를 번역만 해서 쓸 때의 위험을 서술
        '한국 본사 양식을 번역만 해서 쓰면 품질보증 범위나 납기 지연 처리 조항이 대만 거래처의 구매 조건과 맞물리지 않을 수 있습니다.',
        '은행 계좌 개설은 등기 완료와 별개로 시간이 더 걸려, 첫 대금 입금 일정이 밀리기도 합니다.',
        // REVIEW: 변호사 검수 필요 — 기술자 출장·체류 준비 일정에 관한 서술
        '기술자 출장이 잦아질 것을 늦게 파악하면 체류 준비가 촉박해집니다.',
      ],
      serviceSlugs: ['investment', 'civil', 'labor', 'ip'],
      serviceBlurbs: {
        investment:
          '대만 팹·패키징 거래처와 직접 계약하려면 자회사·지사·연락사무소 중 어떤 형태가 맞는지, 투자 승인과 등기 일정이 어떻게 잡히는지 확인합니다.',
        civil:
          '납품은 끝났는데 대금이 들어오지 않거나 납기와 검수를 두고 다툼이 생겼을 때 협상부터 소송까지 대응합니다.',
        // REVIEW: 변호사 검수 필요 — 근로계약서와 계약 종료 조건 검토를 언급
        labor:
          '대만에서 A/S·기술 인력을 채용할 때 근로계약서와 계약 종료 조건을 어떻게 정리할지 검토합니다.',
        ip: '브랜드나 특허를 보유하고 있다면 대만 등록 여부부터 짚어 드립니다.',
      },
      columnSlugs: [
        'taiwan-company-establishment-basics',
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-labor-severance-law',
        'taiwan-mandatory-employment-period',
      ],
      faq: [
        {
          question: '거래처가 벤더 등록에 현지 법인을 요구하는데 지사로도 되나요?',
          // REVIEW: 변호사 검수 필요 — 벤더 등록 요건을 지사가 충족하는지에 대한 검토 절차 서술
          answer:
            '사안별로 다릅니다. 벤더 등록 서식이 요구하는 것이 대만 사업자 등록번호인지, 대만에서 발행되는 송장인지, 현지 담당 인력인지를 먼저 확인합니다. 그다음 자회사와 지사가 세무, 계약 체결 주체, 채용 범위에서 어떻게 다른지 놓고 어느 쪽이 그 요구를 충족하는지 같이 봅니다.',
        },
        {
          question: '장비 설치 기술자가 단기간 머물 때 무엇을 준비하나요?',
          // REVIEW: 변호사 검수 필요 — 체류 자격·절차 준비를 언급(구체 요건은 단정하지 않음)
          answer:
            '체류 기간, 현지에서 하는 업무 내용, 급여를 어디서 지급하는지에 따라 준비할 절차가 달라집니다. 출장 일정, 현장에서 맡을 작업 범위, 계약 상대가 누구인지를 정리해 주시면 어떤 절차를 밟아야 하는지 확인해 드립니다.',
        },
        {
          question: '한국에서 쓰던 NDA·공급계약서를 그대로 써도 되나요?',
          // REVIEW: 변호사 검수 필요 — 준거법·분쟁해결·품질보증·리콜 비용 조항 검토를 언급
          answer:
            '그대로 쓰기 전에 준거법과 분쟁 해결 조항, 품질보증 범위, 납기 지연과 리콜 비용 분담, 기술자료 제공 범위를 거래처 구매 조건과 나란히 놓고 봅니다. 본사 양식과 거래처가 보낸 구매 조건을 같이 주시면 어디를 고쳐야 하는지 짚어 드립니다.',
        },
        {
          question: '대만 대리점을 거쳐 넘기던 물량을 직접 계약으로 바꾸려면 무엇을 보나요?',
          // REVIEW: 변호사 검수 필요 — 기존 대리점 계약의 기간·해지·독점 조항 검토를 언급
          answer:
            '기존 대리점 계약의 기간, 해지 조건, 독점 여부를 먼저 확인하고, 직접 계약으로 바꿨을 때 대만에서 누가 송장을 발행하고 A/S를 맡는지 정리합니다. 대리점 계약서와 최근 거래 내역을 보면서 순서를 잡습니다.',
        },
        {
          question: '설립 기간과 비용은 어느 정도로 잡나요?',
          answer:
            '대만 회사설립은 흔히 약 3개월을 기준으로 잡지만 투자 승인 대상 여부, 자본금 송금 시점, 업종 표기에 따라 달라집니다. 통상적인 대만 회사설립은 NT$50,000부터이고, 일반 법률상담은 대면 또는 화상으로 시간당 NT$3,000입니다. 사건 수임 비용은 자료를 확인한 뒤 별도로 안내합니다.',
        },
        {
          question: '납품은 끝났는데 대금이 계속 밀리면 어떻게 하나요?',
          // REVIEW: 변호사 검수 필요 — 회수 경로(협상·민사·집행) 비교를 언급
          answer:
            '밀린 금액과 경과 기간, 상대 회사의 현재 상태, 계약서의 관할과 준거법 조항을 먼저 확인합니다. 그다음 통지와 협상으로 정리할지, 민사절차와 집행까지 갈지 선택지를 비교해 안내합니다.',
        },
      ],
    },
  },
  'zh-hant': {
    'taiwan-lawyer': {
      slug: 'taiwan-lawyer',
      label: '諮詢說明',
      title: '台灣律師指南',
      description: '整理韓國客戶常找的台灣律師諮詢範圍、聯絡方式、相關服務與文章入口。',
      keywords: ['台灣律師', '曾雋崴律師', '韓文 台灣律師', '台灣訴訟律師', '台灣公司設立律師'],
      searchTerms: ['台灣律師', '曾雋崴律師', '韓文 台灣律師'],
      heroPoints: [
        '具備韓國、台灣跨境實務經驗，協助韓國客戶處理在台公司設立、投資、民刑事與家事爭議。',
        '從初步事實整理、文件審閱、程序設計到實際訴訟應對，可在同一流程內檢視。',
        '可同時查看曾雋崴律師簡介、公開專欄與 YouTube／部落格內容。',
      ],
      idealFor: [
        '希望藉由韓、台跨境實務經驗理解台灣法律問題的人',
        '需要直接連結台灣本地律師處理投資或公司設立事項的人',
        '涉及民事訴訟、損害賠償、車禍、離婚或繼承爭議的人',
        '想先確認諮詢前該準備哪些資料與流程的人',
      ],
      reviewPoints: [
        '不同案件類型的管轄、時程與證據保全方式都不同。',
        '韓國總公司結構與台灣在地程序常常需要一起調整。',
        '外國人案件除了翻譯之外，送達、委任與出入境也要同時考量。',
        '法律意見與實際執行可行性應一起檢視。',
      ],
      processFlow: [
        '先整理案件或商業目的，確認契約與證據目前掌握到什麼程度。',
        '依台灣法下的管轄、程序、預估時程與是否需親自出席，安排諮詢重點。',
        '諮詢後把可立即推進的事項與仍需補件確認的部分分開處理。',
      ],
      prepareChecklist: [
        '契約、Email、通訊紀錄、報價單、匯款資料',
        '對方基本資訊、公司名稱、地址、代表人資訊',
        '事件發生日期、目前進度、緊急時程',
        '照片、影片、診斷書、登記資料等核心證據',
      ],
      cautionPoints: [
        '在韓國熟悉的做法，不一定和台灣程序完全相同。',
        '只做翻譯卻忽略文件格式或委任要求，常導致重工。',
        '若未先整理初期聯絡紀錄，後續舉證會變得困難。',
        '簽證與停留身分有時也會影響案件處理節奏。',
      ],
      serviceSlugs: ['investment', 'civil', 'family'],
      columnSlugs: ['taiwan-company-establishment-basics', 'taiwan-gym-injury-lawsuit', 'taiwan-divorce-lawsuit-qna'],
      faq: [
        {
          question: '找台灣律師時，最先要確認什麼？',
          answer:
            '建議先確認案件類型與語言對接能力。對韓國客戶而言，韓文溝通、台灣在地程序經驗、以及處理委任與送達文件的能力都很重要。',
        },
        {
          question: '人在韓國，也能先開始諮詢嗎？',
          answer:
            '可以。可先透過 Email 或視訊諮詢整理事實，再依案件需要安排台灣在地程序與文件準備。',
        },
        {
          question: '諮詢前應該先整理哪些資料？',
          answer:
            '契約、報價、對方資訊、事件發生日、目前進度，以及照片、影片、診斷書等核心證據，都建議先整理。',
        },
      ],
    },
    'taiwan-company-setup-lawyer': {
      slug: 'taiwan-company-setup-lawyer',
      label: '諮詢說明',
      title: '台灣公司設立法律諮詢',
      description: '整理台灣公司設立、投資核准、分公司與子公司選擇、許可與營運風險等律師諮詢重點。',
      keywords: ['台灣公司設立律師', '台灣法人設立律師', '台灣投資律師', '曾雋崴律師', '台灣子公司 分公司'],
      searchTerms: ['台灣公司設立律師', '台灣法人設立律師', '台灣投資律師'],
      heroPoints: [
        '從公司型態選擇、投資核准、資本匯入、登記到許可申辦，採一條龍檢視。',
        '以韓國客戶角度說明子公司、分公司與聯絡處的差異。',
        '公司設立後的簽證、商標、契約與勞動風險，也能接續規劃。',
      ],
      idealFor: [
        '需要依韓國總公司結構規劃台灣法人型態的人',
        '正在比較分公司與子公司差異的人',
        '需同時處理化妝品、物流等特定產業許可的人',
        '希望設立後把簽證、商標、勞動契約一起規劃的人',
      ],
      reviewPoints: [
        '投資核准與資本匯入常是最容易延誤的環節。',
        '營業地址、行業別與實際營運模式若不一致，後續流程可能受阻。',
        '特殊產業不是完成登記就結束，還有額外許可要同步處理。',
        '若能在設立階段就考慮契約、勞動與商標，營運風險會更低。',
      ],
      processFlow: [
        '先依進入台灣市場的目的與營收結構，比較子公司、分公司與聯絡處。',
        '確認投資核准、資本額、股東結構與營業地址後，再安排設立順序。',
        '把登記後的銀行、稅務、簽證、商標與勞動流程一起排進時程表。',
      ],
      prepareChecklist: [
        '韓國母公司的登記文件、股權結構、代表人資訊',
        '預計經營項目、商業模式、台灣營業地址候選',
        '預計資本額、匯款安排、是否招募在地人員',
        '需要的產業許可或產品服務法規資訊',
      ],
      cautionPoints: [
        '若行業別和實際營運內容不一致，後續許可可能被卡住。',
        '銀行開戶常與公司設立完成時間不同步，需預留時間。',
        '化妝品、物流、食品、平台等產業常有附加規範。',
        '若把簽證與勞動安排延後處理，整體上線時間會被拉長。',
      ],
      serviceSlugs: ['investment', 'ip', 'labor'],
      columnSlugs: [
        'taiwan-company-establishment-basics',
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
        'taiwan-logistics-business-setup',
      ],
      faq: [
        {
          question: '台灣公司設立通常需要多久？',
          answer:
            '一般約 3 個月左右，但仍需視投資審查、資本匯入時間與產業許可需求而定。',
        },
        {
          question: '分公司與子公司，哪一種更常見？',
          answer:
            '取決於責任結構、稅務與未來投資規劃。若想獨立營運與擴張，常考慮子公司；若想維持母公司直接延伸，則可能考慮分公司。',
        },
        {
          question: '只處理公司登記就夠了嗎？',
          answer:
            '通常不夠。完成登記後，銀行、稅務、簽證、商標、勞動契約與產業許可常需要接續處理，因此建議一開始就整體規劃。',
        },
      ],
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: '諮詢說明',
      title: '台灣訴訟法律諮詢',
      description: '整理台灣民事訴訟、損害賠償、刑事應對與家事爭議中，韓國客戶最先需要確認的重點。',
      keywords: ['台灣訴訟律師', '台灣民事訴訟律師', '台灣損害賠償律師', '台灣刑事律師', '曾雋崴律師'],
      searchTerms: ['台灣訴訟律師', '台灣民事訴訟律師', '台灣損害賠償律師'],
      heroPoints: [
        '涵蓋民事訴訟、損害賠償、車禍、刑事程序與離婚、繼承等家事爭議。',
        '外國人案件需要把證據保全、翻譯、送達與出入境問題一起處理。',
        '可直接連結曾雋崴律師的相關案例與實務文章。',
      ],
      idealFor: [
        '在台灣發生事故、損害或契約爭議的人',
        '需要處理刑事告訴或警詢應對的人',
        '涉及跨國離婚、親權、繼承等韓台雙方法律問題的人',
        '希望在起訴前先確認和解與證據方向的人',
      ],
      reviewPoints: [
        '初期事實整理與證據保全速度，常會左右結果。',
        '刑事程序與民事損害賠償若併行，整體策略會不同。',
        '外國人案件中，程序時程控管往往比單純翻譯更重要。',
        '在判斷是否和解前，應先確認損害範圍與責任結構。',
      ],
      processFlow: [
        '先按時間順序整理事實、對方資訊與損害範圍，建立案件骨架。',
        '區分民事、刑事、家事中哪些程序需要同時推進，哪些可分開處理。',
        '一併評估和解可能性、證據缺口與是否需要到庭出席。',
      ],
      prepareChecklist: [
        '案件經過說明、契約、通話或通訊紀錄',
        '診斷書、照片、影片、收據、警方資料',
        '對方個人資料或公司資訊',
        '目前是否已有調查、訴訟或和解進行中',
      ],
      cautionPoints: [
        '若初期陳述與後續提交資料不一致，可信度會明顯下降。',
        '很多人只先處理刑事告訴，卻太晚準備民事損害計算。',
        '外國人案件中，送達與程序時程往往比想像中更久。',
        '若情緒先行，和解與訴訟策略都容易失衡。',
      ],
      serviceSlugs: ['civil', 'criminal', 'family'],
      columnSlugs: [
        'taiwan-gym-injury-lawsuit',
        'taiwan-traffic-accident-procedure',
        'taiwan-divorce-lawsuit-qna',
        'taiwan-inheritance-custody-analysis',
      ],
      faq: [
        {
          question: '人在韓國，也能先進行台灣訴訟諮詢嗎？',
          answer:
            '可以。先整理委任、文件與聯絡方式後，可在韓國先啟動初步分析，再視案件需求安排後續出席與程序。',
        },
        {
          question: '刑事與民事需要一起考量嗎？',
          answer:
            '像車禍、傷害、詐欺、侵占等案件，常需要同時評估刑事程序與民事損害賠償策略。',
        },
        {
          question: '訴訟前也能幫忙評估是否適合和解嗎？',
          answer:
            '可以，但是否適合和解仍需先看損害範圍、責任比例與目前證據狀態。',
        },
      ],
    },
    'taiwan-semiconductor-supplier-legal': {
      slug: 'taiwan-semiconductor-supplier-legal',
      label: '搜尋指南',
      title: '海外半導體材料與設備供應商的台灣法務說明',
      seoTitle: '台灣半導體材料與設備供應商法務 | 公司設立、契約、勞動、欠款追索',
      description:
        '寫給向台灣晶圓廠、封裝測試廠供貨的海外半導體材料與設備供應商：在台據點、供應契約、技術人員停留、帳款回收要怎麼準備。諮詢提供英語、中文、韓語、日語。',
      keywords: [
        '台灣半導體材料設備',
        '台灣半導體供應商法務',
        '台灣公司設立',
        '台灣供應契約',
        '台灣欠款追索',
      ],
      searchTerms: [
        '台灣半導體材料設備法務',
        '台灣半導體供應商公司設立',
        '台灣設備供應商契約',
      ],
      attorneyHeadingOverride: '處理半導體供應商案件的台灣律師',
      ctaTextOverride:
        '是否真的需要在台公司、還是只調整契約即可，要看客戶要求和交易規模、以及後續量的規劃，答案並不相同。請把報價單、供應契約、以及客戶寄來的供應商登錄文件寄給我們，曾雋崴律師會先幫您整理方向。',
      heroPoints: [
        // REVIEW: 변호사 검수 필요 — 거래처의 벤더 등록 요구를 법인 없이 충족할 수 있는지에 대한 판단이 걸린 문장
        '台灣晶圓廠或 OSAT（後段封裝測試）要求供應商登錄時，有時會一併要求設立在地公司。我們會依對方寄來的表格，確認這是不是真正需要法人的條件，或是分公司、既有代理商結構也能繼續供貨。',
        // REVIEW: 변호사 검수 필요 — 품질보증·납기 지연·리콜 비용 분담 조항의 검토 범위를 언급
        '材料多半是定期交貨，設備則常接到安裝與現場對應，契約裡要看的條款因此不同。品質保證範圍、交期延誤時怎麼處理、召回費用由誰負擔，我們會依契約文字本身逐項核對。',
        // REVIEW: 변호사 검수 필요 — 기술자 체류 절차와 법인 형태 선택의 연계를 서술
        '若因設備安裝或產線對應，海外技術人員會反覆入境，設立階段就會一併檢視該準備哪一種公司型態與停留程序。',
      ],
      idealFor: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요건과 현지 법인 필요 여부의 연결
        '台灣晶圓廠、OSAT 或零件廠要求供應商登錄，需要判斷是否必須設立在地公司',
        '過去經台灣代理商出貨，現在要改與終端客戶直接簽約',
        '設備安裝與定期點檢，讓海外技術人員必須反覆進入台灣',
        // REVIEW: 변호사 검수 필요 — 근로계약 조건 설계를 언급
        '第一次聘僱在地維修人力，需要確認勞動契約條件怎麼定',
        '交貨與驗收都結束了，帳款卻好幾個月沒進來',
      ],
      reviewPoints: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요구의 성격에 따라 필요한 조직 형태가 달라진다는 서술
        '客戶的供應商登錄要求究竟指什麼，每份表格都不一樣。把採購寄來的表格和郵件一起看會比較快。',
        // REVIEW: 변호사 검수 필요 — 검수·인수 시점이 대금 청구와 하자 대응에 미치는 영향을 서술
        '設備供應會因驗收標準和點交時點設在哪裡，而改變請款與瑕疵處理的順序，所以會先從契約文字看起。',
        // REVIEW: 변호사 검수 필요 — 기술자 체류와 현지 채용 일정의 연계를 서술
        '海外技術人員的停留準備與在地聘僱，必須和設立時程對在一起，才能看出實際能支援產線的時間。',
      ],
      processFlow: [
        // REVIEW: 변호사 검수 필요 — 현지 법인 없이 납품 가능한 구조인지 확인한다는 서술
        '先讀客戶寄來的供應商登錄表格與採購條件，確認有沒有可能在沒有台灣公司的情況下繼續供貨。',
        '若需要設立，再以稅務處理、簽約主體、在地聘僱計畫三個標準，比較子公司、分公司與辦事處。',
        '以預定完成登記的日期往回推，把供應契約簽署、技術人員出差、在地員工到職排成同一張時程表。',
      ],
      prepareChecklist: [
        '客戶寄來的供應商登錄表格、採購條件、近期報價單與訂單',
        '目前使用的供應契約、NDA、代理商契約（母公司語文本與英文本）',
        '將派遣來台的技術人員人數與停留期間，以及預計在台聘僱的人數',
        '若有帳款遲延：發票、交貨與驗收紀錄、催款郵件、對方公司的登記資料',
      ],
      cautionPoints: [
        '為了趕上供應商登錄截止日而先決定公司型態，後來常會和稅務或聘僱計畫衝突，再改一次。',
        // REVIEW: 변호사 검수 필요 — 해외 모회사 양식 계약서를 번역만 해서 쓸 때의 위험을 서술
        '只把海外母公司範本翻譯後直接使用，品質保證範圍或交期延誤條款可能對不上台灣客戶的採購條件。',
        '銀行開戶往往在登記完成後還要再花時間，第一筆貨款入帳也可能往後延。',
        // REVIEW: 변호사 검수 필요 — 기술자 출장·체류 준비 일정에 관한 서술
        '很晚才發現技術人員會頻繁出差，停留準備就會變得很趕。',
      ],
      serviceSlugs: ['investment', 'civil', 'labor', 'ip'],
      serviceBlurbs: {
        investment:
          '若要與台灣晶圓廠、封裝廠直接簽約，我們會確認子公司、分公司、辦事處哪一種較合適，以及投審會與登記時程如何安排。',
        civil:
          '貨已交完但帳款未進，或交期、驗收發生爭議時，從協商到訴訟都會處理。',
        // REVIEW: 변호사 검수 필요 — 근로계약서와 계약 종료 조건 검토를 언급
        labor:
          '在台灣聘僱維修或技術人員時，會檢視勞動契約與契約結束條件該如何整理。',
        ip: '若已有品牌或專利，會先確認是否已在台灣註冊。',
      },
      columnSlugs: [
        'taiwan-company-establishment-basics',
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-labor-severance-law',
        'taiwan-mandatory-employment-period',
      ],
      faq: [
        {
          question: '客戶供應商登錄要求設立在地公司，分公司可以嗎？',
          // REVIEW: 변호사 검수 필요 — 벤더 등록 요건을 지사가 충족하는지에 대한 검토 절차 서술
          answer:
            '要看個案。我們會先確認供應商登錄表格要的是台灣統一編號、在台灣開立的發票，還是在地承辦人力。接著再把子公司與分公司在稅務、簽約主體、聘僱範圍上的差異攤開，一起看哪一種能對上那項要求。',
        },
        {
          question: '設備安裝技術人員只作短期停留時，要準備什麼？',
          // REVIEW: 변호사 검수 필요 — 체류 자격·절차 준비를 언급(구체 요건은 단정하지 않음)
          answer:
            '停留多久、在現場做哪些工作、薪資從哪裡發，會讓該走的程序不一樣。請先整理出差行程、現場工作範圍、契約相對人是誰，我們再確認該走哪些步驟。',
        },
        {
          question: '海外母公司原本使用的 NDA、供應契約，可以直接拿來用嗎？',
          // REVIEW: 변호사 검수 필요 — 준거법·분쟁해결·품질보증·리콜 비용 조항 검토를 언급
          answer:
            '直接使用前，會把準據法與爭議解決、品質保證範圍、交期延誤與召回費用分擔、技術資料提供範圍，和客戶採購條件對在一起看。請把母公司範本和客戶寄來的採購條件一併提供，我們會標出哪裡需要改。',
        },
        {
          question: '從台灣代理商轉成與客戶直接簽約時，要先看什麼？',
          // REVIEW: 변호사 검수 필요 — 기존 대리점 계약의 기간·해지·독점 조항 검토를 언급
          answer:
            '會先確認現有代理商契約的期間、終止條件、是否獨家，再整理改成直接契約後，在台灣由誰開立發票、誰負責維修。會看代理商契約和近期交易紀錄來排順序。',
        },
        {
          question: '設立期間和費用大概怎麼抓？',
          answer:
            '台灣公司設立實務上常以約 3 個月為規劃基準，但仍視是否屬投審會審查、資金匯入時點、營業項目記載而異。通常的台灣公司設立自 NT$50,000 起，一般法律諮詢為面談或視訊每小時 NT$3,000。案件委任費用會在檢視資料後另行說明。',
        },
        {
          question: '貨已交完，帳款一直沒進來，怎麼辦？',
          // REVIEW: 변호사 검수 필요 — 회수 경로(협상·민사·집행) 비교를 언급
          answer:
            '會先確認積欠金額與經過時間、對方公司目前狀況、契約的管轄與準據法條款。再比較以通知、協商收斂，或走到民事程序與強制執行，把選項說明清楚。',
        },
      ],
    },
  },
  en: {
    'taiwan-lawyer': {
      slug: 'taiwan-lawyer',
      label: 'SEARCH GUIDE',
      title: 'Taiwan Lawyer for Litigation, Company Setup & Business Advice',
      description:
        'Taiwan legal support for overseas companies and individuals on litigation, company setup, and business advice, with consultations in English.',
      keywords: ['Taiwan lawyer', 'Wei Tseng attorney', 'Taiwan lawyer for overseas clients', 'Taiwan litigation lawyer', 'Taiwan company setup lawyer', 'law firm in Taipei for foreigners', 'Taiwan lawyer for foreigners', 'English speaking lawyer in Taipei', 'Taiwan residence permit assistance', 'Taiwan tax accounting assistance'],
      searchTerms: ['Taiwan lawyer', 'Wei Tseng attorney', 'Taiwan lawyer for overseas clients', 'English speaking lawyer Taipei'],
      heroPoints: [
        'This page connects overseas and international clients to Taiwan legal support for company setup, investment, and disputes.',
        'The firm provides consultations in English, Chinese, Korean, and Japanese, in person or by video. Attorney Wei Tseng works with clients directly in Korean, Chinese, and Japanese.',
        'The firm assists with Taiwan company formation, litigation across practice areas, residence-permit procedures, and tax-accounting assistance.',
        'Initial fact review, document analysis, procedure planning, and dispute handling can be assessed in one flow.',
        'You can review Attorney Wei Tseng’s profile, columns, and public channels from the same entry point.',
        'The firm is based in Taipei and works with international clients on Taiwan company setup, disputes, employment, and regulatory matters.',
      ],
      idealFor: [
        'Clients who want Taiwan legal issues explained in English or another working language',
        'Businesses that need a Taiwan lawyer for incorporation or investment matters',
        'Individuals dealing with civil, criminal, traffic, divorce, or inheritance disputes in Taiwan',
        'Anyone who wants to understand consultation steps and materials before reaching out',
        'Foreign residents and business owners in Taiwan who need a local law firm in Taipei',
        'Overseas companies entering Taiwan or facing a dispute with a Taiwanese counterparty',
        'Clients who need residence-permit assistance connected to a Taiwan matter',
        'Clients who need tax-accounting assistance for a Taiwan company or dispute',
      ],
      reviewPoints: [
        'Jurisdiction, timing, and evidence strategy vary by case type.',
        'For overseas companies, Taiwan procedure often needs to be aligned with headquarters or home-jurisdiction structure.',
        'Foreign-national matters frequently require attention to service, powers of attorney, and immigration issues.',
        'Legal analysis and practical enforceability should be reviewed together.',
        'Official government pages linked from this guide are reference destinations. They do not decide eligibility, acceptance, or outcome.',
      ],
      processFlow: [
        'Start with a brief first email: the issue or business goal, the Taiwan connection, any deadline, and how we can reach you. Time zone and how you found us are optional.',
        'Separate jurisdiction, procedure, timing, and appearance requirements under Taiwan practice before the first action is taken.',
        'After consultation, split the matter into items that can move immediately and items that still require fact or document confirmation.',
      ],
      prepareChecklist: [
        'Brief initial summary: the issue or business model, the Taiwan connection, key dates or a deadline, preferred language, and how we can reach you',
        'Optional: time zone or preferred contact window, and how you found this page',
        'Organize for later attorney instructions: contracts, emails, chat records, quotations, and payment records — do not send originals in the first email',
        'Organize for later: counterparty identity, company name, address, and representative details',
        'Organize for later: photos, videos, registry documents, or other core evidence; medical or bank records only after the attorney asks for them',
      ],
      cautionPoints: [
        'A process that feels standard in a home jurisdiction may work differently in Taiwan.',
        'Clients often focus on translation but miss format or power-of-attorney requirements.',
        'If early contact records are not organized, later proof becomes harder.',
        'Visa or immigration status can sometimes affect litigation or meeting logistics.',
      ],
      serviceSlugs: ['investment', 'civil', 'family'],
      columnSlugs: ['taiwan-company-establishment-basics', 'taiwan-gym-injury-lawsuit', 'taiwan-divorce-lawsuit-qna'],
      topFaqIds: DEFAULT_INTENT_TOP_FAQ_IDS,
      faq: [
        {
          question: 'What should I check first when looking for a Taiwan lawyer?',
          answer:
            'Start with the case type and the lawyer’s language and procedural fit. For overseas and international clients, English or multilingual communication, Taiwan local procedure experience, and document-handling capability all matter.',
        },
        {
          question: 'Can consultation begin while I am still outside Taiwan?',
          answer:
            'Yes. Initial review can begin through email, messaging, or video consultation, followed by guidance on Taiwan filings and required documents.',
        },
        {
          question: 'What materials are useful before consultation?',
          answer:
            'Start with a brief summary of the issue or business, the Taiwan connection, key dates or a deadline, preferred language, and contact details. Contracts, notices, counterpart details, and other evidence can be organized for later attorney instructions.',
        },
        {
          question: 'How much does a consultation cost?',
          answer: 'A general legal consultation is NT$3,000 per hour, in person or by video. For case work, we provide a quote after reviewing your documents — the Service Fees page lists the current structure, including Taiwan company setup from NT$50,000 for standard cases.',
        },
        {
          question: 'Do I need to visit Taipei for the first consultation?',
          answer: 'No. Consultations are available in person or by video, so an initial review can usually be completed from overseas once your documents and timeline are organized.',
        },
        {
          question: 'Do you assist with Taiwan residence permits?',
          answer:
            'Yes. The firm assists with Taiwan residence-permit procedures connected to a Taiwan matter, such as post-incorporation work and stay arrangements. Related official reference links are listed on this page.',
        },
        {
          question: 'Do you assist with Taiwan tax and accounting issues?',
          answer:
            'Yes. The firm assists with Taiwan tax and accounting matters for a company or dispute. Related official reference links are listed on this page.',
        },
        {
          question: 'Do you advise on the law of another country?',
          answer: 'This is a Taiwan law firm. We advise on Taiwan law.',
        },
      ],
    },
    'taiwan-company-setup-lawyer': {
      slug: 'taiwan-company-setup-lawyer',
      label: 'Company Formation Legal Services',
      title: 'Taiwan Company Setup Lawyer for Overseas Businesses',
      description: 'Legal services for overseas businesses covering entity choice, investment approval, registration, and operating contracts.',
      keywords: ['Taiwan company setup lawyer', 'Taiwan incorporation lawyer', 'Taiwan investment lawyer', 'Wei Tseng attorney', 'Taiwan subsidiary branch', 'Taiwan branch vs subsidiary', 'Taiwan residence permit assistance', 'Taiwan tax accounting assistance'],
      searchTerms: ['Taiwan company setup lawyer', 'Taiwan incorporation lawyer', 'Taiwan investment lawyer', 'Taiwan branch vs subsidiary'],
      heroPoints: [
        'Entity choice, investment approval, capital remittance, registration, and operating contracts should be reviewed as one Taiwan-law process.',
        'This page explains subsidiary, branch, and representative-office choices from the perspective of overseas parents and investors entering Taiwan — not limited to one home country.',
        'The firm provides consultations in English, Chinese, Korean, and Japanese, in person or by video. Attorney Wei Tseng works with clients directly in Korean, Chinese, and Japanese. Initial review can start remotely.',
        'After registration, the firm can assist with residence-permit procedures and tax-accounting assistance for the Taiwan operation.',
        'Official government pages are linked as reference destinations; they do not decide eligibility on their own.',
      ],
      idealFor: [
        'Overseas companies choosing a Taiwan subsidiary, branch, or representative office',
        'Teams comparing branch versus subsidiary setup against the parent’s commercial goal',
        'Companies entering regulated sectors such as cosmetics or logistics',
        'Clients who want setup, residence-permit assistance, trademarks, and employment issues reviewed together',
        'Clients who need tax-accounting assistance for the Taiwan entity',
      ],
      reviewPoints: [
        'Investment approval and capital-remittance steps are often the most timing-sensitive.',
        'Business address, industry code, and actual operating model need to match.',
        'Regulated sectors require more than incorporation alone.',
        'Contracts, labor structure, and trademarks should be considered at the setup stage.',
        'Official Invest Taiwan, immigration, and tax pages linked from this guide are reference destinations.',
      ],
      processFlow: [
        'Compare subsidiary, branch, and representative-office structures based on the commercial goal and revenue flow of the overseas parent or investor.',
        'Confirm investment review needs, capital amount, shareholder structure, and business address before filing.',
        'Map the sequence after registration as well, including banking, tax-accounting assistance, residence-permit assistance, trademarks, and employment documents.',
        'Initial review can start by email or video from outside Taiwan; local filings are mapped after the first consultation.',
      ],
      prepareChecklist: [
        'Brief initial summary: the planned Taiwan business model, the overseas parent or investor, the Taiwan connection, key dates or a deadline, preferred language, and contact details',
        'Optional: time zone or preferred contact window, and how you found this page',
        'Organize for later attorney instructions: overseas parent or investor registry documents, shareholder structure, and director details — do not send originals in the first email',
        'Organize for later: planned business scope, operating model, candidate Taiwan address, and operating contracts',
        'Organize for later: expected capital amount, remittance plan, hiring plan in Taiwan, and any permit or sector-specific information already identified',
      ],
      cautionPoints: [
        'If the industry code does not match the real business model, permit work may stall later.',
        'Bank account opening often takes longer than clients expect, even after registration is done.',
        'Cosmetics, logistics, food, platform, and similar sectors may require additional approvals.',
        'If visas and labor structuring are treated as an afterthought, the launch timeline usually slips.',
      ],
      serviceSlugs: ['investment', 'ip', 'labor'],
      columnSlugs: [
        'taiwan-company-establishment-basics',
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
        'taiwan-logistics-business-setup',
      ],
      topFaqIds: DEFAULT_INTENT_TOP_FAQ_IDS,
      faq: [
        {
          question: 'How long does Taiwan company setup usually take?',
          answer:
            'A common planning assumption is around three months, but the timeline depends on investment review, capital timing, and sector-specific permits.',
        },
        {
          question: 'Which is more common: branch or subsidiary?',
          answer:
            'That depends on liability structure, tax considerations, and expansion plans. Subsidiaries are common for independent local operations, while branches can fit direct parent-company control.',
        },
        {
          question: 'Is company registration alone enough?',
          answer:
            'Usually not. Banking, tax-accounting assistance, residence-permit assistance, trademarks, labor arrangements, and industry permits often follow immediately after registration.',
        },
        {
          question: 'Can company setup review start while the parent is still outside Taiwan?',
          answer:
            'Yes. Initial review can begin by email or video. Local filings, bank work, and in-person steps are mapped after that first consultation. Current consultation structure is on the Service Fees page.',
        },
        {
          question: 'Do you assist with residence permits after company setup?',
          answer:
            'Yes. The firm assists with Taiwan residence-permit procedures connected to the company or assignment. Related official reference links are listed on this page.',
        },
        {
          question: 'Do you assist with tax and accounting for the Taiwan entity?',
          answer:
            'Yes. The firm assists with Taiwan tax and accounting matters for the entity. Related official reference links are listed on this page.',
        },
        {
          question: 'Where can I see current company-setup fees?',
          answer: 'See the Service Fees page for the current consultation and company-setup fee structure.',
        },
      ],
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: 'Litigation and Dispute Intake',
      title: 'Taiwan Litigation Lawyer for Contract Disputes & Civil Claims',
      description: 'A Taiwan litigation lawyer guide for overseas companies and individuals covering contract disputes, unpaid invoices, civil claims, criminal and family matters.',
      keywords: ['Taiwan litigation lawyer', 'Taiwan civil litigation lawyer', 'Taiwan damages lawyer', 'Taiwan criminal lawyer', 'Wei Tseng attorney', 'sue a company in Taiwan', 'Taiwan debt recovery lawyer', 'Taiwan commercial dispute lawyer'],
      searchTerms: ['Taiwan litigation lawyer', 'Taiwan civil litigation lawyer', 'Taiwan damages lawyer', 'Taiwan debt recovery', 'sue a Taiwanese company'],
      heroPoints: [
        'We handle Taiwan contract disputes and unpaid invoices, as well as civil claims, criminal matters, and family disputes according to the case.',
        'The firm provides consultations in English, Chinese, Korean, and Japanese, in person or by video. Attorney Wei Tseng works with clients directly in Korean, Chinese, and Japanese. Early review can start from outside Taiwan.',
        'Foreign-national matters often require combined review of evidence, translation, service, deadlines, and immigration-related issues.',
        'Attorney Wei Tseng’s related case references and columns are linked directly for context.',
      ],
      idealFor: [
        'Clients dealing with accidents, damages, or contract disputes in Taiwan',
        'People who need criminal-complaint strategy or police-investigation support',
        'Cross-border divorce, custody, or inheritance matters involving a home jurisdiction and Taiwan',
        'Cases where pre-litigation settlement and evidence strategy need to be reviewed early',
        'Overseas companies with unpaid invoices or contract breaches by a Taiwanese counterparty',
        'International clients who need a Taiwan court or settlement strategy managed remotely',
      ],
      reviewPoints: [
        'Early fact development and evidence preservation can materially affect the outcome.',
        'Civil damages and criminal procedure sometimes need to be designed together.',
        'For foreign clients, timeline control is often as important as translation.',
        'Settlement should be evaluated only after liability and damages are analyzed.',
        'The first email should identify the Taiwan counterparty or other Taiwan connection and any deadline.',
      ],
      processFlow: [
        'Send a brief first email covering the contract or claim issue, the Taiwan connection, any deadline, and how we can reach you. Time zone and how you found us are optional.',
        'Then determine which parts belong in civil, criminal, or family procedure and whether any of them should move together.',
        'Review settlement potential, evidence gaps, and attendance requirements before choosing the first procedural step.',
      ],
      prepareChecklist: [
        'Brief initial summary: the contract or claim issue, the Taiwan connection, key dates or a deadline, preferred language, and contact details',
        'Optional: time zone or preferred contact window, and how you found this page',
        'Organize for later attorney instructions: a written timeline, contracts, and call or chat records — do not send originals in the first email',
        'Organize for later: counterparty personal or company identification details needed for the matter',
        'Organize for later: photos, videos, receipts, police materials, and any existing investigation, court case, or settlement discussion; medical or bank records only after the attorney asks for them',
      ],
      cautionPoints: [
        'If the first narrative changes later, credibility can drop quickly.',
        'Clients often focus on the criminal complaint first and delay civil damage calculation.',
        'For foreign-national matters, service and calendar control can take longer than expected.',
        'Emotional reactions often distort both settlement judgment and litigation strategy.',
      ],
      serviceSlugs: ['civil', 'criminal', 'family'],
      columnSlugs: [
        'taiwan-gym-injury-lawsuit',
        'taiwan-traffic-accident-procedure',
        'taiwan-divorce-lawsuit-qna',
        'taiwan-inheritance-custody-analysis',
      ],
      topFaqIds: DEFAULT_INTENT_TOP_FAQ_IDS,
      faq: [
        {
          question: 'Can a Taiwan litigation matter start while I am still overseas?',
          answer:
            'Yes. Early review can begin remotely once the core documents, timeline, and authorization structure are organized.',
        },
        {
          question: 'Do criminal and civil issues need to be reviewed together?',
          answer:
            'Often yes. Traffic, injury, fraud, and embezzlement-type matters may require coordinated criminal and civil strategy.',
        },
        {
          question: 'Can you also assess whether settlement makes sense before filing?',
          answer:
            'Yes, but that assessment should be made after reviewing damages, liability structure, and the current evidence record.',
        },
        {
          question: 'Can a foreign company take action against a Taiwanese company without visiting Taiwan?',
          answer: 'In many civil matters the early phase — document review, demand letters, and settlement contact — can be handled remotely with a power of attorney. Whether court appearance is needed depends on the procedure and its stage; we map this out during the initial consultation.',
        },
        {
          question: 'How do you handle unpaid invoices or contract breaches by a Taiwanese counterparty?',
          answer: 'We start from the contract, invoices, and correspondence to assess liability and the recoverable amount, then compare a negotiated settlement, civil action, and enforcement options before recommending a path.',
        },
        {
          question: 'What does a litigation consultation cost?',
          answer: 'An initial consultation is NT$3,000 per hour, in person or by video. Case fees are quoted separately after the facts and documents are reviewed — see the Service Fees page for the current structure.',
        },
        {
          question: 'Can you tell me whether my dispute is worth pursuing before I commit?',
          answer: 'Yes. The first step is an assessment of liability, evidence, and likely recovery against cost and timeline — and we will tell you plainly when a claim is not worth pursuing.',
        },
        {
          question: 'What should the first email include?',
          answer:
            'A brief description of the issue, the Taiwan connection, any deadline, preferred language, and how we can reach you. Time zone and how you found us are optional. Sensitive IDs can wait until the attorney asks.',
        },
      ],
    },
    'taiwan-semiconductor-supplier-legal': {
      slug: 'taiwan-semiconductor-supplier-legal',
      label: 'SEARCH GUIDE',
      title: 'Legal guidance for overseas semiconductor materials and equipment suppliers in Taiwan',
      seoTitle: 'Taiwan Legal Support for Overseas Semiconductor Materials and Equipment Suppliers',
      description:
        'A briefing for overseas semiconductor materials and equipment suppliers that sell into Taiwan fabs and packaging houses: local entity choice, supply contracts, technician stays, and collections. Consultations are in English, Chinese, Korean, and Japanese.',
      keywords: [
        'Taiwan semiconductor supplier legal',
        'semiconductor materials equipment Taiwan',
        'Taiwan company setup',
        'Taiwan supply contract',
        'Taiwan unpaid invoices',
      ],
      searchTerms: [
        'Taiwan semiconductor materials equipment legal',
        'semiconductor supplier company setup Taiwan',
        'Taiwan equipment supplier contracts',
      ],
      attorneyHeadingOverride: 'Taiwan attorney for semiconductor supplier matters',
      ctaTextOverride:
        'Whether you actually need a Taiwan entity, or whether a contract review is enough, depends on what the customer is asking for, the size of the account, and the volume you expect next. Send the quotation, the supply agreement, and the vendor pack the customer sent, and Attorney Wei Tseng will outline a direction first.',
      heroPoints: [
        // REVIEW: 변호사 검수 필요 — 거래처의 벤더 등록 요구를 법인 없이 충족할 수 있는지에 대한 판단이 걸린 문장
        'Taiwan fabs and OSAT (backend packaging and test) houses sometimes ask for vendor registration together with a local entity. We sit with the forms they sent and check whether that is a genuine entity requirement, or whether supply can continue through a branch or the current distributor.',
        // REVIEW: 변호사 검수 필요 — 품질보증·납기 지연·리콜 비용 분담 조항의 검토 범위를 언급
        'Materials usually move on a repeating delivery cycle; equipment often includes tool set-up and on-site response, so the clauses that matter are not the same. We read the warranty scope, late-delivery handling, and who bears recall costs from the contract wording itself.',
        // REVIEW: 변호사 검수 필요 — 기술자 체류 절차와 법인 형태 선택의 연계를 서술
        'If home-country technicians will keep flying in for equipment set-up or on-site production support, we review which entity form and stay procedure to prepare while the company is still being formed.',
      ],
      idealFor: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요건과 현지 법인 필요 여부의 연결
        'A Taiwan fab, OSAT, or parts maker has asked for vendor registration and you need to decide whether a local entity is required',
        'You have been shipping through a Taiwan distributor and now want a direct contract with the end customer',
        'Equipment set-up and scheduled maintenance mean home-country technicians will enter Taiwan repeatedly',
        // REVIEW: 변호사 검수 필요 — 근로계약 조건 설계를 언급
        'You are hiring local field-service staff for the first time and need the employment terms checked',
        'Delivery and acceptance are done, but payment has not arrived for months',
      ],
      reviewPoints: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요구의 성격에 따라 필요한 조직 형태가 달라진다는 서술
        'What vendor registration actually requires differs from form to form. It is faster to read the pack and the emails from purchasing together.',
        // REVIEW: 변호사 검수 필요 — 검수·인수 시점이 대금 청구와 하자 대응에 미치는 영향을 서술
        'On equipment supply, where you put the inspection standard and the acceptance date changes the order of invoicing and defect response, so we start from the contract wording.',
        // REVIEW: 변호사 검수 필요 — 기술자 체류와 현지 채용 일정의 연계를 서술
        'Home-country technician stays and local hiring have to be lined up with the incorporation calendar, or the date you can actually staff the production floor will slip.',
      ],
      processFlow: [
        // REVIEW: 변호사 검수 필요 — 현지 법인 없이 납품 가능한 구조인지 확인한다는 서술
        'We first read the vendor-registration pack and purchasing terms the customer sent, and check whether supply can proceed without a Taiwan entity.',
        'If an entity is needed, we compare a subsidiary, a branch, and a representative office on tax treatment, who signs the contract, and the local hiring plan.',
        'Working back from the expected registration date, we put contract signing, technician travel, and local hiring on one calendar.',
      ],
      prepareChecklist: [
        'The vendor-registration pack, purchasing terms, and recent quotations and purchase orders from the customer',
        'The supply agreement, NDA, and distributor agreement you currently use (home-country original and English)',
        'How many technicians will travel, for how long, and how many people you plan to hire in Taiwan',
        'If invoices are overdue: the invoices, delivery and acceptance records, demand emails, and the counterparty company registry details',
      ],
      cautionPoints: [
        'If you lock the entity form just to hit a vendor-registration deadline, it often collides later with tax or hiring plans and has to be unwound.',
        // REVIEW: 변호사 검수 필요 — 본사 소재국 양식 계약서를 번역만 해서 쓸 때의 위험을 서술
        'Translating a home-country template and using it as-is can leave the warranty scope or late-delivery clauses out of step with the Taiwan customer purchasing terms.',
        'Opening a bank account takes extra time after registration is done, and the first payment can land later than planned.',
        // REVIEW: 변호사 검수 필요 — 기술자 출장·체류 준비 일정에 관한 서술
        'If you only notice late that technician travel will be frequent, stay preparations get squeezed.',
      ],
      serviceSlugs: ['investment', 'civil', 'labor', 'ip'],
      serviceBlurbs: {
        investment:
          'To contract with a Taiwan fab or packaging house, we check which of a subsidiary, branch, or representative office fits, and how investment approval and registration timing run.',
        civil:
          'When delivery is done but payment has not arrived, or a dispute opens over timing and inspection, we handle the matter from negotiation through a civil action.',
        // REVIEW: 변호사 검수 필요 — 근로계약서와 계약 종료 조건 검토를 언급
        labor:
          'When you hire field-service or technical staff in Taiwan, we review how to set the employment contract and the terms on which it can end.',
        ip: 'If you hold a brand or patents, we start by checking whether they are registered in Taiwan.',
      },
      columnSlugs: [
        'taiwan-company-establishment-basics',
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-labor-severance-law',
        'taiwan-mandatory-employment-period',
      ],
      faq: [
        {
          question: 'The customer wants a local entity for vendor registration. Will a branch do?',
          // REVIEW: 변호사 검수 필요 — 벤더 등록 요건을 지사가 충족하는지에 대한 검토 절차 서술
          answer:
            'It depends on the file. We first check whether the vendor pack is asking for a Taiwan business registration number, invoices issued in Taiwan, or staff on the ground. We then put a subsidiary and a branch side by side on tax, contracting party, and hiring scope, and look with you at which one meets that request.',
        },
        {
          question: 'What should we prepare when equipment technicians will stay only a short time?',
          // REVIEW: 변호사 검수 필요 — 체류 자격·절차 준비를 언급(구체 요건은 단정하지 않음)
          answer:
            'The procedure to prepare changes with the length of stay, the work they will do on site, and where payroll is paid. Share the travel dates, the scope of work on the floor, and who the contracting party is, and we will confirm which steps to take.',
        },
        {
          question: 'Can we keep using our home-country NDA and supply agreement as they are?',
          // REVIEW: 변호사 검수 필요 — 준거법·분쟁해결·품질보증·리콜 비용 조항 검토를 언급
          answer:
            'Before you do, we check governing law and dispute resolution, warranty scope, late delivery and recall-cost sharing, and the range of technical data you must hand over, against the customer purchasing terms. Send the headquarters template and the purchasing terms they sent, and we will mark what needs to change.',
        },
        {
          question: 'What do you look at when we move from a distributor to a direct contract?',
          // REVIEW: 변호사 검수 필요 — 기존 대리점 계약의 기간·해지·독점 조항 검토를 언급
          answer:
            'We first check the term, termination, and exclusivity of the current distributor agreement, then sort out who will issue invoices in Taiwan and who will cover field service after the switch. We set the sequence from the distributor contract and the recent trading history.',
        },
        {
          question: 'What timeline and cost should we plan for company setup?',
          answer:
            'Taiwan company setup is commonly planned around three months, but it moves with whether investment review applies, when capital is remitted, and how the business scope is stated. A standard Taiwan company setup starts from NT$50,000, and a general legal consultation is NT$3,000 per hour in person or by video. Engagement fees for a matter are quoted separately after we have seen the documents.',
        },
        {
          question: 'Delivery is finished, but payment keeps slipping. What happens next?',
          // REVIEW: 변호사 검수 필요 — 회수 경로(협상·민사·집행) 비교를 언급
          answer:
            'We first confirm the amount and how long it has been overdue, the current state of the counterparty, and the jurisdiction and governing-law clauses in the contract. We then compare whether to close it by notice and negotiation, or to go through a civil action and enforcement, and walk you through the options.',
        },
      ],
    },
  },
  ja: {
    'taiwan-lawyer': {
      slug: 'taiwan-lawyer',
      label: '相談案内',
      title: '台湾弁護士｜日本語で相談できる台北の法律事務所',
      description: '日本企業・在台日本人の方が台湾弁護士に相談する際の範囲と進め方をまとめた案内ページです。会社設立・投資、民事・労働・家事・刑事事件、化粧品規制（PIF）まで、日本語で直接ご相談いただけます。',
      keywords: ['台湾弁護士', '日本語対応 台湾 弁護士', '台北 法律事務所 日本語', '台湾 会社設立 弁護士', '台湾 訴訟 弁護士', '曾雋崴弁護士'],
      searchTerms: ['台湾 弁護士 日本語', '台北 弁護士', '台湾 法律相談 日本語', '台湾 会社設立'],
      heroPoints: [
        '日本企業の台湾進出（会社設立・投資審査）から、現地での契約・労務・紛争対応まで、日本語で一貫してサポートします。',
        '初回相談は対面またはオンライン（ビデオ）で、日本からでもご相談を開始できます。',
        '台湾弁護士・曾雋崴（国立政治大学 法学・金融、国立台湾大学 財務金融修士）が直接対応します。',
      ],
      idealFor: [
        '台湾に子会社・支店・駐在員事務所を設立したい日本企業',
        '台湾の取引先との契約トラブル・未払い・損害賠償を日本語で相談したい方',
        '台湾在住の日本人の方の労働・家事（離婚・相続）・交通事故などの法律問題',
        '相談前に手続きと必要資料を先に把握しておきたい方',
      ],
      reviewPoints: [
        '案件の類型によって管轄、スケジュール、証拠確保の方法が異なります。',
        '日本本社の構造と台湾現地の手続きをあわせて調整する必要があるケースが少なくありません。',
        '外国人案件は通訳、委任状、送達、出入国の問題まであわせて確認する必要があります。',
        '法律上の助言と実際の執行可能性は一度に確認すべきです。',
      ],
      processFlow: [
        '案件または事業の目的を先に整理し、関連契約書・証拠がどの程度あるかを一次確認します。',
        '台湾基準の管轄、手続き、予想スケジュール、現地出席の要否を分けて相談の優先順位を決めます。',
        '相談後すぐに進められる段階と追加確認が必要な段階に分けて、実際の実行順序をご提案します。',
      ],
      prepareChecklist: [
        '初回の簡潔な概要：争点または事業モデル、台湾との接点、重要な日付・期限、希望言語、連絡先',
        '後ほど弁護士の案内に従って整理する資料：契約書、メール、メッセンジャーのやり取り、見積書、送金記録（原本は初回メールに添付しない）',
        '後ほど整理する情報：相手方の基本情報と会社名・住所・代表者情報',
        '後ほど整理する証拠：写真・動画・登記簿などの核心資料。診断書や口座情報などの機微情報は、弁護士の指示後にのみご提出ください',
      ],
      cautionPoints: [
        '日本で一般的な方法が台湾の手続きと異なる場合があります。',
        '翻訳だけ合わせて書類の形式や委任状の要件を見落としがちです。',
        '初期の連絡記録を整理しないと、その後の立証が難しくなることがあります。',
        'ビザ・在留の状態が案件対応のスケジュールに影響する場合があります。',
      ],
      serviceSlugs: ['investment', 'civil', 'family'],
      columnSlugs: ['taiwan-company-establishment-basics', 'taiwan-gym-injury-lawsuit', 'taiwan-divorce-lawsuit-qna'],
      faq: [
        {
          question: '日本にいながら相談を始められますか？',
          answer: 'はい。資料・時系列・委任の形を整理していただければ、初回の検討はオンラインで進められます。出席が必要な段階のみ別途ご案内します。',
        },
        {
          question: '相談料はいくらですか？',
          answer: '一般法律相談は1時間NT$3,000（対面またはビデオ）です。案件の費用は資料を確認したうえで別途お見積りします。標準的な台湾会社設立はNT$50,000からです（費用のご案内ページ参照）。',
        },
        {
          question: '日本語での契約書や証拠でも対応できますか？',
          answer: 'はい。日本語の資料をもとに検討を始め、台湾の手続きに必要な中国語書類への対応も含めてご案内します。',
        },
      ],
    },
    'taiwan-company-setup-lawyer': {
      slug: 'taiwan-company-setup-lawyer',
      label: '相談案内',
      title: '台湾会社設立・法人設立の弁護士｜手続き・費用・期間',
      description: '日本企業の台湾進出に向けた会社設立の手続き・費用・期間と、子会社・支店・駐在員事務所の違いを日本語で解説します。投資審査から銀行口座開設、就業許可までを一貫してサポートします。',
      keywords: ['台湾会社設立弁護士', '台湾法人設立弁護士', '台湾投資弁護士', '曾雋崴弁護士', '台湾子会社 支店', '台湾法人設立'],
      searchTerms: ['台湾会社設立弁護士', '台湾法人設立弁護士', '台湾投資弁護士', '台湾法人設立'],
      heroPoints: [
        '法人形態の選択、投資承認、資本金送金、登記、許認可を一つの流れで検討します。',
        '子会社・支店・連絡事務所の構造の違いと業種別規制を日本のクライアントの視点で整理します。',
        '法人設立（会社設立）後のビザ、商標、契約、雇用リスクまで引き続きご検討いただけます。',
      ],
      idealFor: [
        '日本本社基準で台湾法人の構造を決める必要がある場合',
        '支店と子会社のどちらの形態が適切か比較が必要な場合',
        '化粧品・物流など業種別の許認可を並行する必要がある場合',
        '設立後のビザ、商標、労働契約まであわせて検討したい場合',
      ],
      reviewPoints: [
        '投資承認と資本金送金の段階はスケジュールと書類の漏れに敏感です。',
        '営業住所、業種コード、実質的な運営構造が合わないと後続手続きが遅れることがあります。',
        '特殊業種は会社設立だけで終わらず、別途許可が必要です。',
        '会社設立後の契約・労務・商標戦略まであわせて設計すると運営リスクが減ります。',
      ],
      processFlow: [
        '進出目的と売上構造を基準に、子会社・支店・連絡事務所のどの形態が適切か先に比較します。',
        '投資承認の要否、資本金規模、株主構成、営業住所を整理して設立の前提条件を確定します。',
        '登記後の銀行、税務、ビザ、商標、雇用契約まで続くスケジュールを一度に設計します。',
      ],
      prepareChecklist: [
        '初回の簡潔な概要：予定している台湾の事業モデル、海外の親会社または投資者、重要な日付・期限、希望言語、連絡先',
        '後ほど弁護士の案内に従って整理する資料：日本本社または海外投資者の登記書類、株主構成、代表者情報（原本は初回メールに添付しない）',
        '後ほど整理する情報：予定業種、営業モデル、台湾の営業住所候補、運営契約',
        '後ほど整理する情報：予定資本金、送金計画、現地人材採用の有無、必要な許認可または製品・サービス規制情報',
      ],
      cautionPoints: [
        '業種コードと実際の事業内容が異なると許可段階で遅れることがあります。',
        '銀行口座の開設は設立完了とは別にさらに時間がかかることがあります。',
        '化粧品・物流・食品・プラットフォーム業種は追加規制が付くことがあります。',
        'ビザと労働契約を後で別に検討するとスケジュールが長くなります。',
      ],
      serviceSlugs: ['investment', 'ip', 'labor'],
      columnSlugs: [
        'taiwan-company-establishment-basics',
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide',
        'taiwan-logistics-business-setup',
      ],
      faq: [
        {
          question: '台湾の会社設立は通常どのくらいかかりますか？',
          answer:
            '一般的に約3ヶ月前後を見込みますが、投資承認の対象かどうか、資本金送金の時期、業種別許可の必要性によって変わることがあります。',
        },
        {
          question: '支店と子会社のどちらが多く選ばれますか？',
          answer:
            '責任構造、税務、今後の投資計画によって異なります。独立運営と現地拡張を考える場合は子会社を、本社直結の構造を希望する場合は支店を検討するケースが多いです。',
        },
        {
          question: '会社設立だけ依頼すれば終わりですか？',
          answer:
            '実務上はそうではありません。法人登記後に銀行、税務、ビザ、商標、労働契約、業種別許認可まで続く場合が多く、初期設計からあわせて検討する方が効率的です。',
        },
        {
          question: '設立にはどのくらいかかりますか？',
          answer: '会社設立自体はおおむね3か月、その後の就業許可・居留証に約1か月が目安です（詳細は台湾法人設立総合ガイドをご覧ください）。',
        },
      ],
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: '相談案内',
      title: '台湾訴訟弁護士｜民事・労働・家事 日本語対応',
      description: '台湾での契約紛争・未払い請求、民事訴訟、損害賠償、労働紛争、刑事対応、離婚・相続について、日本企業・在台日本人の方が最初に確認すべきポイントをまとめました。日本語で直接ご相談いただけます。',
      keywords: ['台湾訴訟弁護士', '台湾民事訴訟弁護士', '台湾損害賠償弁護士', '台湾刑事訴訟弁護士', '曾雋崴弁護士'],
      searchTerms: ['台湾訴訟弁護士', '台湾民事訴訟弁護士', '台湾損害賠償弁護士'],
      heroPoints: [
        '台湾の契約紛争・未払い請求のほか、民事訴訟、損害賠償、交通事故、刑事手続き、離婚・相続紛争まで、案件類型別の対応の流れを整理します。',
        '外国人案件は証拠確保、翻訳、送達、出入国の問題をあわせて検討する必要があります。',
        '曾雋崴台湾弁護士の関連事例とコラムをあわせてつなぎ、実際の判断基準をご確認いただけます。',
      ],
      idealFor: [
        '台湾で事故、損害、契約紛争が発生した場合',
        '刑事告訴または警察捜査への対応が必要な場合',
        '国際離婚、親権、相続のように日本と台湾の法があわせて絡む場合',
        '訴訟前に示談の可能性と証拠の方向を先に確認したい場合',
      ],
      reviewPoints: [
        '初期の事実関係の整理と証拠確保のスピードが結果に大きく影響します。',
        '刑事手続きと民事損害賠償をあわせて設計すると戦略が変わることがあります。',
        '外国人案件は言語や文書翻訳よりも手続きスケジュールの管理がより重要な場合が多いです。',
        '示談の可否を判断する前に損害の算定と責任構造を先に確認する必要があります。',
      ],
      processFlow: [
        '事実関係、相手方、損害の範囲をまず時系列で整理して案件の構造を固めます。',
        '民事・刑事・家事のうちどの手続きを並行すべきかを分けて優先順位を決めます。',
        '示談の可能性、証拠の不足部分、出席が必要な段階まであわせて検討し、対応戦略を分けます。',
      ],
      prepareChecklist: [
        '初回の簡潔な概要：契約または請求の争点、台湾との接点、重要な日付・期限、希望言語、連絡先',
        '後ほど弁護士の案内に従って整理する資料：事件経緯書、契約書、通話・メッセンジャー記録（原本は初回メールに添付しない）',
        '後ほど整理する情報：相手方の身分事項または会社情報',
        '後ほど整理する証拠：写真、動画、領収書、警察資料、現在進行中の捜査・裁判・示談の有無。診断書や口座情報などの機微情報は、弁護士の指示後にのみご提出ください',
      ],
      cautionPoints: [
        '初期の陳述と提出資料が覆ると信頼性が大きく下がります。',
        '刑事告訴だけ先に行い、民事損害の算定を遅らせるケースが多いです。',
        '外国人案件は送達とスケジュール管理が思ったより長くかかることがあります。',
        '感情的に対応すると示談と訴訟戦略の両方が揺らぐことがあります。',
      ],
      serviceSlugs: ['civil', 'criminal', 'family'],
      columnSlugs: [
        'taiwan-gym-injury-lawsuit',
        'taiwan-traffic-accident-procedure',
        'taiwan-divorce-lawsuit-qna',
        'taiwan-inheritance-custody-analysis',
      ],
      faq: [
        {
          question: '台湾の訴訟は日本にいても進められますか？',
          answer:
            '案件によって可能です。委任状、書類準備、連絡体制を先に整理すれば、日本にいながら初期対応を始められ、出席が必要な段階だけ別途検討できます。',
        },
        {
          question: '刑事と民事をあわせて検討すべき場合がありますか？',
          answer:
            '交通事故、傷害、詐欺、横領のように事実関係が重なる案件は、刑事手続きと民事損害賠償の戦略をあわせて立てる場合が多いです。',
        },
        {
          question: '訴訟前に示談が可能かどうかも見ていただけますか？',
          answer:
            '可能です。ただし示談が有利かどうかを判断するには損害の範囲、責任割合、証拠の状態を先に検討する必要があるため、案件資料をあわせて確認するのがよいです。',
        },
        {
          question: '台湾の取引先からの未払い・契約違反にはどう対応しますか？',
          answer: '契約書・請求書・やり取りをもとに責任と回収可能額を検討し、交渉による和解、民事訴訟、強制執行の選択肢を比較してご提案します。',
        },
      ],
    },
    'taiwan-semiconductor-supplier-legal': {
      slug: 'taiwan-semiconductor-supplier-legal',
      label: '検索ガイド',
      title: '台湾の半導体材料・装置サプライヤー向け法務案内',
      seoTitle: '台湾の半導体素材・装置サプライヤー法務 | 会社設立・契約・労務・売掛',
      description:
        '台湾のファブやパッケージング先へ材料・装置を納入する日本のサプライヤーが、現地法人、供給契約、技術者の滞在、代金回収をどう準備するかを整理した案内です。相談は英語・中国語・韓国語・日本語で行います。',
      keywords: [
        '台湾 半導体 素材 装置',
        '台湾 半導体 サプライヤー 法務',
        '台湾会社設立',
        '台湾 供給契約',
        '台湾 売掛',
      ],
      searchTerms: [
        '台湾 半導体素材 装置 法務',
        '台湾 半導体サプライヤー 会社設立',
        '台湾 装置サプライヤー 契約',
      ],
      attorneyHeadingOverride: '半導体サプライヤーの案件を担当する台湾弁護士',
      ctaTextOverride:
        '現地法人が本当に必要か、契約書の手直しだけで足りるかは、取引先の要望と取引規模、今後の数量計画によって異なります。見積書、供給契約書、取引先から届いた提出書類をお送りいただければ、曾雋崴台湾弁護士が先に方針を整理いたします。',
      heroPoints: [
        // REVIEW: 변호사 검수 필요 — 거래처의 벤더 등록 요구를 법인 없이 충족할 수 있는지에 대한 판단이 걸린 문장
        '台湾のファブやOSAT（後工程のパッケージング・テスト）がベンダー登録とあわせて現地法人を求めることがあります。法人が実際に必要な求めなのか、支店や既存の代理店のまま納入が続くのかを、先方から届いた書式を手元に置き確認します。',
        // REVIEW: 변호사 검수 필요 — 품질보증·납기 지연·리콜 비용 분담 조항의 검토 범위를 언급
        '材料は定期納入、装置は設置と現場対応まで続くことが多いため、契約書で見る条項が変わります。品質保証の範囲、納期が遅れたときの処理、リコール時の費用負担を、契約書の文言どおりに確認します。',
        // REVIEW: 변호사 검수 필요 — 기술자 체류 절차와 법인 형태 선택의 연계를 서술
        '装置の設置やライン対応で日本の技術者が頻繁に出入りする場合は、どの法人形態と滞在手続を準備するかを設立の段階で一緒に検討します。',
      ],
      idealFor: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요건과 현지 법인 필요 여부의 연결
        '台湾のファブ・OSAT・部品メーカーがベンダー登録を求め、現地法人が必要かを判断しなければならない場合',
        'これまで台湾の代理店経由で納入していた取引を、最終顧客との直接契約に切り替えたい場合',
        '装置の設置と定期点検のため、日本の技術者が繰り返し台湾に入る場合',
        // REVIEW: 변호사 검수 필요 — 근로계약 조건 설계를 언급
        '現地の保守担当を初めて雇用し、労働契約の条件をどう定めるか確認が必要な場合',
        '納入と検収は終わっているのに、代金が何か月も入ってこない場合',
      ],
      reviewPoints: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요구의 성격에 따라 필요한 조직 형태가 달라진다는 서술
        '取引先のベンダー登録の求めが何を指すかは書式ごとに違います。購買担当から届いた書式とメールを一緒に見る方が早いです。',
        // REVIEW: 변호사 검수 필요 — 검수·인수 시점이 대금 청구와 하자 대응에 미치는 영향을 서술
        '装置の供給では、検収基準と引渡し時点をどこに置くかで請求と不具合対応の順序が変わるため、契約書の文言から確認します。',
        // REVIEW: 변호사 검수 필요 — 기술자 체류와 현지 채용 일정의 연계를 서술
        '日本の技術者の滞在準備と現地採用は、設立日程と重ねて見ないと、実際にいつからライン対応できるかが見えてきません。',
      ],
      processFlow: [
        // REVIEW: 변호사 검수 필요 — 현지 법인 없이 납품 가능한 구조인지 확인한다는 서술
        '取引先から届いたベンダー登録の書式と購買条件を先に読み、現地法人なしでも納入を続けられるかを確認します。',
        '法人が必要であれば、子会社・支店・駐在員事務所を、税務、契約の締結主体、現地採用計画の三つの基準で比較します。',
        '登記完了の予定日を起点に、供給契約の署名、技術者の出張、現地社員の採用時期を逆算し、一つの日程表に合わせます。',
      ],
      prepareChecklist: [
        '取引先から届いたベンダー登録の書式、購買条件書、直近の見積書と発注書',
        '現在使っている供給契約書・NDA・代理店契約書（日本語版と英語版の両方）',
        '台湾に送る技術者の人数と滞在期間、現地で採用する人数の計画',
        '代金が滞っている件があれば、請求書、納入・検収記録、督促メール、相手会社の登記情報',
      ],
      cautionPoints: [
        'ベンダー登録の締切に間に合わせようと法人形態を先に決めてしまうと、後から税務や採用計画と食い違い、作り直すことがあります。',
        // REVIEW: 변호사 검수 필요 — 일본 본사 양식 계약서를 번역만 해서 쓸 때의 위험을 서술
        '日本本社の書式を翻訳しただけで使うと、品質保証の範囲や納期遅延の処理が、台湾の取引先の購買条件と噛み合わないことがあります。',
        '銀行口座の開設は登記完了とは別に時間がかかり、最初の入金日程が後ろにずれることもあります。',
        // REVIEW: 변호사 검수 필요 — 기술자 출장·체류 준비 일정에 관한 서술
        '技術者の出張が増えることに遅く気づくと、滞在の準備期間が足りなくなります。',
      ],
      serviceSlugs: ['investment', 'civil', 'labor', 'ip'],
      serviceBlurbs: {
        investment:
          '台湾のファブ・パッケージング先と直接契約するには、子会社・支店・駐在員事務所のどれが合うか、投資承認と登記の日程がどう組まれるかを確認します。',
        civil:
          '納入は終わっているのに代金が入らないとき、納期や検収を巡って争いになったときは、交渉から訴訟まで対応します。',
        // REVIEW: 변호사 검수 필요 — 근로계약서와 계약 종료 조건 검토를 언급
        labor:
          '台湾で保守・技術の人材を雇用するとき、労働契約書と契約終了の条件をどう整理するかを検討します。',
        ip: 'ブランドや特許をお持ちであれば、台湾での登録の有無から確認いたします。',
      },
      columnSlugs: [
        'taiwan-company-establishment-basics',
        'taiwan-company-subsidiary-vs-branch',
        'taiwan-labor-severance-law',
        'taiwan-mandatory-employment-period',
      ],
      faq: [
        {
          question: '取引先がベンダー登録に現地法人を求めています。支店でも足りますか？',
          // REVIEW: 변호사 검수 필요 — 벤더 등록 요건을 지사가 충족하는지에 대한 검토 절차 서술
          answer:
            '事案ごとに異なります。ベンダー登録の書式が求めているのが台湾の事業者登録番号なのか、台湾で発行される請求書なのか、現地の担当者なのかを先に確認します。そのうえで子会社と支店が税務、契約の締結主体、採用の範囲でどう違うかを並べ、どちらがその求めを満たすかを一緒に見ます。',
        },
        {
          question: '装置の設置技術者が短期間滞在するとき、何を準備しますか？',
          // REVIEW: 변호사 검수 필요 — 체류 자격·절차 준비를 언급(구체 요건은 단정하지 않음)
          answer:
            '滞在期間、現地で行う業務の内容、給与をどこから支払うかによって、準備する手続が変わります。出張日程、現場で担う作業範囲、契約の相手方が誰かを整理していただければ、どの手続を踏むべきか確認いたします。',
        },
        {
          question: '日本で使っていたNDA・供給契約書をそのまま使ってもよいですか？',
          // REVIEW: 변호사 검수 필요 — 준거법·분쟁해결·품질보증·리콜 비용 조항 검토를 언급
          answer:
            'そのまま使う前に、準拠法と紛争解決条項、品質保証の範囲、納期遅延とリコール費用の分担、技術資料の提供範囲を、取引先の購買条件と並べて見ます。本社書式と先方から届いた購買条件を一緒にいただければ、どこを直すべきかお示しします。',
        },
        {
          question: '台湾の代理店経由だった数量を直接契約に切り替えるとき、何を見ますか？',
          // REVIEW: 변호사 검수 필요 — 기존 대리점 계약의 기간·해지·독점 조항 검토를 언급
          answer:
            '既存の代理店契約の期間、解除条件、独占の有無を先に確認し、直接契約に変えたときに台湾で誰が請求書を発行し、保守を担うかを整理します。代理店契約書と直近の取引経緯を見ながら順序を決めます。',
        },
        {
          question: '設立の期間と費用はどの程度で見ますか？',
          answer:
            '台湾の会社設立はよく約3か月を目安にしますが、投資承認の対象かどうか、資本金の送金時期、業種の記載によって変わります。通常の台湾会社設立はNT$50,000から、一般法律相談は対面またはビデオで1時間NT$3,000です。事件の委任費用は資料を確認したうえで別途ご案内します。',
        },
        {
          question: '納入は終わっているのに代金が入りません。どうしますか？',
          // REVIEW: 변호사 검수 필요 — 회수 경로(협상·민사·집행) 비교를 언급
          answer:
            '滞っている金額と経過期間、相手会社の現在の状態、契約書の管轄と準拠法の条項を先に確認します。そのうえで通知と交渉で収めるか、民事手続と強制執行まで進むか、選択肢を比較してご案内します。',
        },
      ],
    },
  },
};

export function getIntentPage(locale: SiteLocale, slug: string): IntentPageContent | undefined {
  if (!intentPageSlugs.includes(slug as IntentPageSlug)) {
    return undefined;
  }

  return intentPages[locale][slug as IntentPageSlug];
}

export function getIntentTopFaqs(page: IntentPageContent): FAQItem[] {
  const ids = page.topFaqIds;
  if (!ids?.length) {
    return [];
  }
  const selected: FAQItem[] = [];

  for (const id of ids) {
    if (selected.length >= 3) {
      break;
    }
    const indexed = /^faq-(\d+)$/.exec(id);
    if (!indexed) {
      continue;
    }
    const item = page.faq[Number(indexed[1])];
    if (item) {
      selected.push(item);
    }
  }

  return selected;
}
