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
      title: '한국어로 상담하는 대만 변호사',
      seoTitle: '대만변호사 | 한국어 상담·소송·법인설립 지원',
      description:
        '대만 회사 설립·투자와 민사·형사·가사 분쟁을 한국어로 상담합니다.',
      keywords: ['대만변호사', '증준외 변호사', '한국어 가능한 대만 변호사', '대만 소송 변호사', '대만 회사설립 변호사', '대만법인설립'],
      searchTerms: ['대만변호사', '증준외 변호사', '한국어 가능한 대만 변호사', '대만법인설립'],
      heroPoints: [
        '초기 사실관계 정리, 문서 검토, 절차 설계, 소송 대응까지 이어서 검토합니다.',
        '상담은 한국어·중국어·일본어·영어로 진행합니다.',
      ],
      idealFor: [
        '대만 법률문제를 한국어로 설명받고 싶은 경우',
        '대만 변호사와 바로 연결해야 하는 회사설립·투자 이슈',
        '민사소송, 손해배상, 교통사고, 이혼·상속 등 분쟁 사건',
        '절차와 준비 자료를 정리한 뒤 연락하려는 경우',
      ],
      reviewPoints: [
        '사건 유형에 따라 관할, 일정, 증거 확보 방식이 달라집니다.',
        '한국 본사 구조와 대만 현지 절차를 함께 맞춰야 하는 경우가 많습니다.',
        '외국인 사건은 통역, 위임장, 송달, 출입국 이슈까지 함께 점검해야 합니다.',
        '법률 검토와 함께 실제 집행 가능성도 확인해야 합니다.',
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
            '계약서와 견적서, 상대방 정보, 사건 발생일과 현재 진행 상태를 정리해 주세요. 사진·영상·진단서 등 관련 증거도 준비해 주세요.',
        },
      ],
    },
    'taiwan-company-setup-lawyer': {
      slug: 'taiwan-company-setup-lawyer',
      label: '상담 안내',
      title: '한국 기업의 대만 법인 설립 상담',
      seoTitle: '대만 법인설립·회사설립 변호사 | 절차·비용·기간',
      description:
        "대만 진출을 준비하는 한국 기업의 회사 설립을 지원합니다. 자회사·지사·연락사무소 중 어떤 형태가 맞는지부터 필요한 허가와 설립 후 법률 문제까지 한국어로 상담합니다.",
      keywords: ['대만 회사설립 변호사', '대만 법인설립 변호사', '대만 투자 변호사', '증준외 변호사', '대만 자회사 지사', '대만법인설립'],
      searchTerms: ['대만 회사설립 변호사', '대만 법인설립 변호사', '대만 투자 변호사', '대만법인설립'],
      heroPoints: [
        "설립 형태에 따른 책임과 세무 문제를 비교하고, 회사명 예비심사·해당되는 외국인 투자 승인·등기 등 필요한 절차를 안내합니다.",
        "대만에서 사용할 계약서와 근로계약, 비자와 상표등록에 관한 문제도 검토합니다."
      ],
      idealFor: [],
      reviewPoints: [
        "외국인 투자 승인이 필요한지, 자본금을 언제 송금할 수 있는지 확인합니다.",
        "등기할 주소와 업종이 실제 사업 내용에 맞는지 살펴봅니다.",
        "회사 등기 외에 업종별 인허가나 등록이 필요한지 검토합니다."
      ],
      processFlow: [
        "진출 목적과 사업 계획을 듣고 자회사·지사·연락사무소의 차이와 필요한 절차를 설명합니다.",
        "회사명 예비심사(예약)를 진행하고, 외국인 투자 승인이 필요한 경우 승인을 받습니다.",
        "설립준비 계좌 개설과 자본금 송금을 진행한 뒤, 해당되는 투자금액 심사와 회사 등기를 준비합니다.",
        "정식 계좌와 세무 등록, 비자·상표·고용 관련 절차는 사업 계획에 맞춰 별도로 준비합니다."
      ],
      prepareChecklist: [
        "한국 본사 등기서류, 주주 구성, 대표자 정보",
        "예정 업종과 사업 내용, 대만 사무실 주소 후보",
        "예상 자본금과 송금 계획, 현지 직원 채용 계획",
        "이미 확인한 인허가 사항이나 제품·서비스 규제 자료"
      ],
      cautionPoints: [
        "회사 등기가 끝나도 은행 계좌 개설에 시간이 더 걸릴 수 있습니다.",
        "대만에 체류하거나 현지에서 일할 예정이라면, 회사 설립과 별도로 비자와 취업허가 요건을 확인해야 합니다."
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
          "question": "대만 회사설립은 보통 얼마나 걸리나요?",
          "answer": "보통 약 3개월 전후를 잡지만, 회사명 예비심사·외국인 투자 승인 필요 여부, 자본금 송금 시점, 업종별 허가에 따라 달라집니다."
        },
        {
          "question": "지사와 자회사는 어떤 기준으로 선택하나요?",
          "answer": "본사의 책임 범위, 세무 처리, 향후 투자 계획을 함께 고려합니다. 자회사는 대만에 별도 법인을 세우는 방식이고, 지사는 한국 본사의 일부로 대만에서 사업하는 방식입니다. 각각의 차이를 비교한 뒤 사업 계획에 맞춰 정합니다."
        },
        {
          "question": "회사 등기 외에 어떤 준비가 필요한가요?",
          "answer": "업종에 따라 추가 허가나 등록이 필요할 수 있습니다. 은행·세무 업무와 비자, 상표, 근로계약도 사업 계획에 맞춰 함께 확인합니다."
        }
      ],
      serviceBlurbs: {
        "investment": "대만 회사 설립과 해당되는 외국인 투자 승인, 업종별 인허가 절차를 검토합니다.",
        "ip": "대만에서 사용할 상표와 지식재산 보호, 금융·투자 관련 분쟁을 상담합니다.",
        "labor": "현지 직원의 근로계약을 검토하고, 해고·퇴직금 등 고용 과정에서 생기는 분쟁에 대응합니다."
      },
      ctaTextOverride: "예정 업종과 설립 희망 시기, 연락처를 간단히 보내 주세요. 자회사나 지사 등 고려 중인 형태가 있다면 함께 알려 주세요. 수임 가능 여부와 이해충돌 여부를 확인한 뒤 상담 범위와 비용을 안내합니다. 민감한 서류는 변호사 안내 후 보내 주세요.",
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: '상담 안내',
      title: '대만 소송·분쟁 한국어 상담',
      seoTitle: '대만 소송 변호사 | 민사·형사·노동 한국어 대응',
      description:
        '대만에서 민사·손해배상·형사·가사 분쟁이 생겼을 때 한국 고객이 먼저 확인할 관할, 증거, 일정을 정리합니다.',
      keywords: ['대만 소송 변호사', '대만 민사소송 변호사', '대만 손해배상 변호사', '대만 형사소송 변호사', '증준외 변호사'],
      searchTerms: ['대만 소송 변호사', '대만 민사소송 변호사', '대만 손해배상 변호사'],
      heroPoints: [
        '민사소송, 손해배상, 교통사고, 형사 절차, 이혼·상속 분쟁까지 사건 유형별 대응 흐름을 정리합니다.',
        '외국인 사건은 증거 확보, 번역, 송달, 출입국 이슈를 함께 봐야 합니다.',
      ],
      idealFor: [
        '대만에서 사고, 손해, 계약 분쟁이 발생한 경우',
        '형사 고소 또는 경찰 조사 대응이 필요한 경우',
        '국제이혼, 친권, 상속처럼 한국과 대만 법이 함께 얽히는 경우',
        '소송 전에 합의 가능성과 증거 확보 방법을 점검하고 싶은 경우',
      ],
      reviewPoints: [
        '초기에 사건 경위를 정리하고, 필요한 증거의 확보 방법과 시점을 확인합니다.',
        '형사 절차와 민사 손해배상을 함께 검토하면 대응 순서가 달라질 수 있습니다.',
        '외국인 사건은 통역·번역 준비와 절차별 기한을 함께 확인해야 합니다.',
        '합의 여부를 판단하기 전 손해 산정과 책임 구조를 먼저 확인해야 합니다.',
      ],
      processFlow: [
        '사건 경위를 시간순으로 정리하고, 상대방 정보와 손해 범위를 확인합니다.',
        '민사·형사·가사 중 어떤 절차를 병행해야 하는지 구분하고 우선순위를 정합니다.',
        '합의 가능성, 부족한 증거, 출석이 필요한 단계를 검토해 대응 방안을 정합니다.',
      ],
      prepareChecklist: [
        '사건 경위서, 계약서, 통화·메신저 기록',
        '진단서, 사진, 영상, 영수증, 경찰 자료',
        '상대방 인적사항 또는 회사 정보',
        '현재 진행 중인 조사·재판·합의 여부',
      ],
      cautionPoints: [
        '형사 고소만 하고 민사 손해 산정을 늦추는 경우가 많습니다.',
        '외국인 사건은 송달과 일정 관리가 생각보다 오래 걸릴 수 있습니다.',
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
            '교통사고, 상해, 사기, 횡령처럼 사실관계가 겹치는 사건은 형사 절차와 민사 손해배상 문제를 함께 검토하는 경우가 많습니다.',
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
      ctaTextOverride:
        '거래 개요, 상대방, 계약·납기·대금 조건을 먼저 간단히 보내 주세요. 필요하면 견적서·계약서·거래처 요구 서류를 변호사 안내 후 추가로 받습니다.',
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
        '한국 기술자의 체류 준비와 현지 채용 일정을 설립 일정과 함께 검토해, 라인 대응을 시작할 수 있는 시점을 확인합니다.',
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
          '대만 팹·패키징 거래처와 직접 계약하려면 자회사·지사·연락사무소 중 어떤 형태가 맞는지, 필요 시 외국인 투자 승인과 등기 일정이 어떻게 잡히는지 확인합니다.',
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
      description: '整理韓國客戶常詢問的台灣律師諮詢範圍、聯絡方式、相關服務與專欄文章。',
      keywords: ['台灣律師', '曾雋崴律師', '韓文 台灣律師', '台灣訴訟律師', '台灣公司設立律師'],
      searchTerms: ['台灣律師', '曾雋崴律師', '韓文 台灣律師'],
      heroPoints: [
        '具備韓國、台灣跨境實務經驗，協助韓國客戶處理在台公司設立、投資、民事、刑事與家事爭議。',
        '可一併檢視初步事實整理、文件審閱、程序規劃及訴訟階段的相關事項。',
      ],
      idealFor: [
        '希望借重台韓跨境實務經驗，釐清台灣法律問題的人',
        '需要直接找台灣在地律師處理投資或公司設立事項的人',
        '涉及民事訴訟、損害賠償、車禍、離婚或繼承爭議的人',
        '想先整理諮詢所需資料與流程的人',
      ],
      reviewPoints: [
        '不同案件類型的管轄、時程與證據保全方式都不同。',
        '韓國總公司的組織架構與台灣應辦程序，常須一併考量。',
        '外國人案件除了翻譯之外，送達、委任與入出境也要同時考量。',
        '法律意見在實務上是否可行，也應一併檢視。',
      ],
      processFlow: [
        '先整理案件經過或釐清商業目的，確認目前已掌握哪些契約與證據。',
        '依管轄、程序、預估時程及是否須本人到場，決定諮詢重點。',
        '諮詢後，區分可立即處理的事項與仍須補件確認的部分。',
      ],
      prepareChecklist: [
        '契約、Email、通訊紀錄、報價單、匯款資料',
        '對方基本資訊、公司名稱、地址、代表人資訊',
        '事件發生日期、目前進度、急迫事項的期限',
        '照片、影片、診斷書、登記資料等核心證據',
      ],
      cautionPoints: [
        '在韓國熟悉的做法，不一定和台灣程序完全相同。',
        '只做翻譯卻忽略文件格式或委任要求，常須重新處理。',
        '若未先整理初期聯絡紀錄，後續舉證會變得困難。',
        '簽證與在台停留身分，有時也會影響案件進度。',
      ],
      serviceSlugs: ['investment', 'civil', 'family'],
      columnSlugs: ['taiwan-company-establishment-basics', 'taiwan-gym-injury-lawsuit', 'taiwan-divorce-lawsuit-qna'],
      faq: [
        {
          question: '找台灣律師時，最先要確認什麼？',
          answer:
            '建議先確認案件類型，以及能否以您熟悉的語言溝通。對韓國客戶而言，能否以韓文溝通、是否熟悉台灣在地程序、能否處理委任與送達文件，都很重要。',
        },
        {
          question: '人在韓國，也能先開始諮詢嗎？',
          answer:
            '可以。可先透過電子郵件或視訊諮詢整理事實，再視案件需要安排台灣的在地程序與文件準備。',
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
        '涵蓋公司型態選擇、投資核准、資本匯入、登記與許可申請。',
        '從韓國客戶的角度，說明子公司、分公司與辦事處的差異。',
        '公司設立後的簽證、商標、契約，以及勞動風險的因應，也能接續規劃。',
      ],
      idealFor: [
        '需要依韓國總公司結構規劃台灣法人型態的人',
        '正在比較分公司與子公司差異的人',
        '需同時處理化粧品、物流等特定產業許可的人',
        '希望設立後一併規劃簽證、商標與勞動契約的人',
      ],
      reviewPoints: [
        '投資核准與資本匯入常是最容易延誤的環節。',
        '營業地址、行業別與實際營運模式若不一致，後續流程可能受阻。',
        '公司登記之外，應依實際營業項目確認許可、登錄等程序，以及開業前須完成的事項。',
        '設立階段宜一併考慮契約、勞動與商標。',
      ],
      processFlow: [
        '先依進入台灣市場的目的與營收結構，比較子公司、分公司與辦事處。',
        '完成公司名稱預查（保留）後，若屬外國投資核准事項再申請核准；並整理資本額、股東結構與營業地址。',
        '開立籌備處帳戶後匯入資本，完成適用的投資資本審定與公司登記，再辦理正式帳戶、稅籍、簽證、商標與勞動等後續事項。',
      ],
      prepareChecklist: [
        '韓國母公司的登記文件、股權結構、代表人資訊',
        '預計營業項目、商業模式、可能的台灣營業地址',
        '預計資本額、匯款安排、是否聘僱在地員工',
        '所需的產業許可，或產品、服務相關法規資訊',
      ],
      cautionPoints: [
        '若行業別和實際營運內容不一致，後續許可可能被卡住。',
        '銀行開戶常與公司設立完成時間不同步，需預留時間。',
        '化粧品、物流、食品、平台等產業，常有額外的法規要求。',
        '若把簽證與勞動安排延後處理，整體開業時程會被拉長。',
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
            '一般約需 3 個月，但仍須視公司名稱預查、外國投資核准與否、資本匯入時間與產業許可需求而定。',
        },
        {
          question: '分公司與子公司，該如何選擇？',
          answer:
            '要看責任歸屬、稅務與未來投資規劃。若希望獨立營運、日後擴張，多會考慮子公司；若希望作為母公司的直接延伸，則可考慮分公司。',
        },
        {
          question: '只處理公司登記就夠了嗎？',
          answer:
            '還須依營業內容確認銀行帳戶、稅籍、簽證、商標與勞動契約等事項。部分產業許可須在公司登記前取得，其他開業程序則須依適用規定安排，因此宜在設立前一併確認時程。',
        },
      ],
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: '諮詢說明',
      title: '台灣訴訟法律諮詢',
      description: '整理韓國客戶面對台灣民事訴訟、損害賠償、刑事程序與家事爭議時，應先確認的重點。',
      keywords: ['台灣訴訟律師', '台灣民事訴訟律師', '台灣損害賠償律師', '台灣刑事律師', '曾雋崴律師'],
      searchTerms: ['台灣訴訟律師', '台灣民事訴訟律師', '台灣損害賠償律師'],
      heroPoints: [
        '涵蓋民事訴訟、損害賠償、車禍、刑事程序與離婚、繼承等家事爭議。',
        '外國人案件需要把證據保全、翻譯、送達與入出境問題一起處理。',
      ],
      idealFor: [
        '在台灣發生事故、損害或契約爭議的人',
        '需要提出刑事告訴，或須接受警詢的人',
        '涉及跨國離婚、親權、繼承等台韓兩地法律問題的人',
        '希望在起訴前，先評估和解可能性與證據的人',
      ],
      reviewPoints: [
        '初期事實整理與證據保全宜及早進行。',
        '刑事程序與民事損害賠償若併行，整體策略會不同。',
        '安排送達與文件提出期限時，也要預留翻譯所需時間。',
        '在判斷是否和解前，應先確認損害範圍與責任歸屬。',
      ],
      processFlow: [
        '先按時間順序整理案件經過，確認對方資訊與損害範圍。',
        '區分民事、刑事、家事中哪些程序需要同時推進，哪些可分開處理。',
        '一併評估和解可能性、證據缺口，以及是否須親自到庭。',
      ],
      prepareChecklist: [
        '案件經過說明、契約、通話或通訊紀錄',
        '診斷書、照片、影片、收據、警方資料',
        '對方個人資料或公司資訊',
        '目前是否正在進行調查、訴訟或和解協商',
      ],
      cautionPoints: [
        '若初期陳述與後續提交資料不一致，可信度會明顯下降。',
        '不少人只先提出刑事告訴，民事損害的計算卻準備得太晚。',
        '外國人案件中，送達與其他程序所需的時間，往往比預期長。',
        '情緒容易干擾對和解與訴訟策略的判斷。',
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
          question: '人在韓國，也能先諮詢台灣的訴訟嗎？',
          answer:
            '可以。備妥委任文件並確認聯絡方式後，人在韓國也可先請律師進行初步分析，再依案件需要安排後續程序，並確認是否須到場。',
        },
        {
          question: '刑事與民事需要一起考量嗎？',
          answer:
            '車禍、傷害、詐欺、侵占等案件，常需同時評估刑事程序與民事損害賠償的策略。',
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
      label: '諮詢說明',
      title: '海外半導體材料與設備供應商的台灣法務說明',
      seoTitle: '海外半導體材料與設備供應商在台法務 | 公司設立、契約、勞動、帳款回收',
      description:
        '寫給向台灣晶圓廠、封裝測試廠供貨的海外半導體材料與設備供應商：在台據點、供應契約、技術人員停留、帳款回收要怎麼準備。諮詢可使用英文、中文、韓文、日文。',
      keywords: [
        '台灣半導體材料設備',
        '台灣半導體供應商法務',
        '台灣公司設立',
        '台灣供應契約',
        '台灣帳款回收',
      ],
      searchTerms: [
        '台灣半導體材料設備法務',
        '台灣半導體供應商公司設立',
        '台灣設備供應商契約',
      ],
      ctaTextOverride:
        '究竟需要設立在台公司，還是調整契約即可，須依客戶要求、交易規模與日後出貨量判斷。請先簡述交易內容、與台灣的關聯、希望時程或期限，以及聯絡方式。我們會先確認是否適合承接及有無利益衝突，再說明服務範圍與費用；報價單、供應契約及供應商登錄文件，請待律師指示後再提供。',
      heroPoints: [
        // REVIEW: 변호사 검수 필요 — 거래처의 벤더 등록 요구를 법인 없이 충족할 수 있는지에 대한 판단이 걸린 문장
        '台灣晶圓廠或 OSAT（後段封裝測試）要求供應商登錄時，有時會一併要求設立在地公司。我們會依對方寄來的表格，確認是否非設立法人不可，或以分公司、既有代理商架構仍可繼續供貨。',
        // REVIEW: 변호사 검수 필요 — 품질보증·납기 지연·리콜 비용 분담 조항의 검토 범위를 언급
        '材料多為定期交貨，設備則常涉及安裝與現場服務，契約需要檢視的條款也因此不同。品質保證範圍、交期延誤如何處理、召回費用由誰負擔，我們會依契約文字逐項核對。',
        // REVIEW: 변호사 검수 필요 — 기술자 체류 절차와 법인 형태 선택의 연계를 서술
        '若海外技術人員須因設備安裝或產線支援反覆入境，設立階段就會一併檢視適合的公司型態與停留程序。',
      ],
      idealFor: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요건과 현지 법인 필요 여부의 연결
        '台灣晶圓廠、OSAT 或零件廠要求供應商登錄，需要判斷是否必須設立在地公司',
        '過去經台灣代理商出貨，現在要改與終端客戶直接簽約',
        '因設備安裝與定期檢修，海外技術人員須反覆入境台灣',
        // REVIEW: 변호사 검수 필요 — 근로계약 조건 설계를 언급
        '首次在台聘僱維修人員，需要確認勞動契約條件如何訂定',
        '交貨與驗收都結束了，帳款卻好幾個月沒進來',
      ],
      reviewPoints: [
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요구의 성격에 따라 필요한 조직 형태가 달라진다는 서술
        '客戶所謂的供應商登錄要求，每份表格內容都不同。把採購部門寄來的表格與往來郵件一起看，較能快速釐清。',
        // REVIEW: 변호사 검수 필요 — 검수·인수 시점이 대금 청구와 하자 대응에 미치는 영향을 서술
        '設備供應案中，驗收標準與點交時點如何約定，會影響請款與瑕疵處理的先後，因此會先從契約文字看起。',
        // REVIEW: 변호사 검수 필요 — 기술자 체류와 현지 채용 일정의 연계를 서술
        '海外技術人員的停留準備與在地聘僱，須與設立時程互相配合，才能掌握實際可支援產線的時間點。',
      ],
      processFlow: [
        // REVIEW: 변호사 검수 필요 — 현지 법인 없이 납품 가능한 구조인지 확인한다는 서술
        '先閱讀客戶寄來的供應商登錄表格與採購條件，確認不設台灣公司，是否仍能繼續供貨。',
        '若需在台設立據點，再以稅務處理、簽約主體、在地聘僱計畫三個標準，比較子公司、分公司與辦事處。',
        '以預定完成登記的日期往回推，把供應契約簽署、技術人員出差、在地員工到職排成同一張時程表。',
      ],
      prepareChecklist: [
        '客戶寄來的供應商登錄表格、採購條件、近期報價單與訂單',
        '目前使用的供應契約、NDA、代理商契約（母公司使用的語言版本及英文版本）',
        '預計派遣來台的技術人員人數與停留期間，以及預計在台聘僱人數',
        '若帳款逾期未付：發票、交貨與驗收紀錄、催款郵件、對方公司的登記資料',
      ],
      cautionPoints: [
        '為趕上供應商登錄期限而倉促決定公司型態，事後常與稅務或聘僱計畫衝突，只好重新調整。',
        // REVIEW: 변호사 검수 필요 — 해외 모회사 양식 계약서를 번역만 해서 쓸 때의 위험을 서술
        '若直接翻譯並使用海外母公司範本，其中的品質保證範圍或交期延誤條款，可能與台灣客戶的採購條件不一致。',
        '銀行開戶往往在登記完成後還要再花時間，第一筆貨款入帳也可能往後延。',
        // REVIEW: 변호사 검수 필요 — 기술자 출장·체류 준비 일정에 관한 서술
        '若太晚才發現技術人員須頻繁來台，停留相關準備就會相當倉促。',
      ],
      serviceSlugs: ['investment', 'civil', 'labor', 'ip'],
      serviceBlurbs: {
        investment:
          '與台灣晶圓廠、封裝測試廠直接交易前，會先確認是否需要在台設立據點。若有需要，再比較子公司、分公司與辦事處，並確認適用的投資審查及登記時程。',
        civil:
          '貨已交完但帳款未進，或交期、驗收發生爭議時，可以從協商談起，必要時再評估訴訟。',
        // REVIEW: 변호사 검수 필요 — 근로계약서와 계약 종료 조건 검토를 언급
        labor:
          '在台灣聘僱維修或技術人員時，會檢視勞動契約內容及終止契約的條件。',
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
          question: '客戶若要求為供應商登錄而在台設立公司，分公司可以嗎？',
          // REVIEW: 변호사 검수 필요 — 벤더 등록 요건을 지사가 충족하는지에 대한 검토 절차 서술
          answer:
            '須視個案而定。我們會先確認供應商登錄表格要求的是台灣統一編號、在台開立的發票，還是在地承辦人員；再比較子公司與分公司在稅務、簽約主體、聘僱範圍上的差異，判斷哪一種符合該項要求。',
        },
        {
          question: '設備安裝技術人員僅短期來台時，要準備什麼？',
          // REVIEW: 변호사 검수 필요 — 체류 자격·절차 준비를 언급(구체 요건은 단정하지 않음)
          answer:
            '適用程序會因停留期間、現場工作內容及薪資由誰支付而不同。請先整理出差行程、現場工作範圍及契約相對人，我們再確認應辦理哪些程序。',
        },
        {
          question: '海外母公司原本使用的 NDA、供應契約，可以直接拿來用嗎？',
          // REVIEW: 변호사 검수 필요 — 준거법·분쟁해결·품질보증·리콜 비용 조항 검토를 언급
          answer:
            '直接使用前，我們會將準據法與爭議解決、品質保證範圍、交期延誤與召回費用分擔、技術資料提供範圍等條款，與客戶的採購條件逐一比對。請一併提供母公司範本與客戶寄來的採購條件，我們會標出需要修改之處。',
        },
        {
          question: '原本經台灣代理商出貨，改為與客戶直接簽約時，要先看什麼？',
          // REVIEW: 변호사 검수 필요 — 기존 대리점 계약의 기간·해지·독점 조항 검토를 언급
          answer:
            '我們會先確認現有代理商契約的期間、終止條件及是否為獨家代理，再整理改為直接簽約後，在台由誰開立發票、由誰負責維修。處理順序會依代理商契約與近期交易紀錄安排。',
        },
        {
          question: '設立需要多久？費用大約多少？',
          answer:
            '實務上，台灣公司設立多以約 3 個月作為規劃基準，但仍視是否須經經濟部投資審議司審查、資金匯入時點及營業項目登記而定。一般台灣公司設立費用自 NT$50,000 起；一般法律諮詢為面談或視訊，每小時 NT$3,000。案件委任費用於檢視資料後另行說明。',
        },
        {
          question: '貨已交完，帳款一直沒進來，怎麼辦？',
          // REVIEW: 변호사 검수 필요 — 회수 경로(협상·민사·집행) 비교를 언급
          answer:
            '我們會先確認積欠金額與拖欠時間、對方公司目前狀況，以及契約中的管轄與準據法條款；再比較通知、協商、民事程序與強制執行等處理選項，並向您說明清楚。',
        },
      ],
    },
  },
  en: {
    'taiwan-lawyer': {
      slug: 'taiwan-lawyer',
      label: 'Legal consultation',
      title: 'Taiwan Lawyer for Litigation, Company Setup & Business Advice',
      seoTitle: 'Taiwan Lawyer for Litigation & Company Setup',
      description:
        'Taiwan legal support for overseas companies and individuals on litigation, company setup, and business advice, with consultations in English.',
      keywords: ['Taiwan lawyer', 'Wei Tseng attorney', 'Taiwan lawyer for overseas clients', 'Taiwan litigation lawyer', 'Taiwan company setup lawyer', 'law firm in Taipei for foreigners', 'Taiwan lawyer for foreigners', 'English speaking lawyer in Taipei', 'Taiwan residence permit assistance', 'Taiwan tax accounting assistance'],
      searchTerms: ['Taiwan lawyer', 'Wei Tseng attorney', 'Taiwan lawyer for overseas clients', 'English speaking lawyer Taipei'],
      heroPoints: [
        'Taiwan company setup, investment, and civil, criminal, and family disputes for overseas clients.',
        'Attorney Wei Tseng consults directly in English, Chinese, Korean, and Japanese, in person in Taipei or by video.',
        'The firm also assists with residence-permit procedures and tax-accounting matters connected to a Taiwan matter.',
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
        'We review the relevant Taiwan procedures, deadlines, and whether in-person attendance is needed.',
        'After the consultation, we explain which steps can proceed and what further information is needed.',
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
            'Check whether the lawyer handles your type of matter, can communicate in your preferred language, and has experience with the relevant Taiwan procedures and documents.',
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
      seoTitle: 'Taiwan Company Setup Lawyer for Foreign Firms',
      description: 'Legal services for overseas businesses covering entity choice, investment approval, registration, and operating contracts.',
      keywords: ['Taiwan company setup lawyer', 'Taiwan incorporation lawyer', 'Taiwan investment lawyer', 'Wei Tseng attorney', 'Taiwan subsidiary branch', 'Taiwan branch vs subsidiary', 'Taiwan residence permit assistance', 'Taiwan tax accounting assistance'],
      searchTerms: ['Taiwan company setup lawyer', 'Taiwan incorporation lawyer', 'Taiwan investment lawyer', 'Taiwan branch vs subsidiary'],
      heroPoints: [
        'We review entity choice, investment approval, capital remittance, registration, and operating contracts together under Taiwan law.',
        'We compare subsidiaries, branches, and representative offices for overseas parent companies and investors entering Taiwan.',
        'Attorney Wei Tseng consults directly in English, Chinese, Korean, and Japanese, in person in Taipei or by video. Initial review can start remotely.',
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
        'Reserve the company name first, then apply for foreign investment approval when required; align capital amount, shareholder structure, and business address.',
        'Open the preparatory bank account, remit capital, complete the applicable capital verification, and register the company. Plan the operating account and any tax, visa, trademark or employment steps alongside this work.',
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
          question: 'How should we choose between a branch and a subsidiary?',
          answer:
            'That depends on liability structure, tax considerations, and expansion plans. Subsidiaries are common for independent local operations, while branches can fit direct parent-company control.',
        },
        {
          question: 'Is company registration alone enough?',
          answer:
            'Registration is one part of the setup. Banking, tax and accounting arrangements, residence permits, trademarks, employment matters and industry permits may also need attention, depending on the business. We review the required steps and timing together.',
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
          answer:
            'A general legal consultation is NT$3,000 per hour, in person or by video; standard Taiwan company setup starts from NT$50,000. The Service Fees page lists the current structure.',
        },
      ],
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: 'Litigation and Dispute Intake',
      title: 'Taiwan Litigation Lawyer for Contract Disputes & Civil Claims',
      seoTitle: 'Taiwan Contract & Civil Litigation Lawyer',
      description: 'A Taiwan litigation lawyer guide for overseas companies and individuals covering contract disputes, unpaid invoices, civil claims, criminal and family matters.',
      keywords: ['Taiwan litigation lawyer', 'Taiwan civil litigation lawyer', 'Taiwan damages lawyer', 'Taiwan criminal lawyer', 'Wei Tseng attorney', 'sue a company in Taiwan', 'Taiwan debt recovery lawyer', 'Taiwan commercial dispute lawyer'],
      searchTerms: ['Taiwan litigation lawyer', 'Taiwan civil litigation lawyer', 'Taiwan damages lawyer', 'Taiwan debt recovery', 'sue a Taiwanese company'],
      heroPoints: [
        'We handle Taiwan contract disputes and unpaid invoices, as well as civil claims, criminal matters, and family disputes according to the case.',
        'Attorney Wei Tseng consults directly in English, Chinese, Korean, and Japanese, in person in Taipei or by video. Early review can start from outside Taiwan.',
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
        'For foreign clients, we review procedural deadlines alongside translation needs.',
        'Settlement should be evaluated only after liability and damages are analyzed.',
        'The first email should identify the Taiwan counterparty or other Taiwan connection and any deadline.',
      ],
      processFlow: [
        'Send a brief first email covering the contract or claim issue, the Taiwan connection, any deadline, and how we can reach you. Time zone and how you found us are optional.',
        'We assess whether civil, criminal, or family proceedings are appropriate and whether they should be coordinated.',
        'We review settlement options, gaps in the evidence, and attendance requirements before recommending the first procedural step.',
      ],
      prepareChecklist: [
        'Brief initial summary: the contract or claim issue, the Taiwan connection, key dates or a deadline, preferred language, and contact details',
        'Optional: time zone or preferred contact window, and how you found this page',
        'Organize for later attorney instructions: a written timeline, contracts, and call or chat records — do not send originals in the first email',
        'Organize for later: counterparty personal or company identification details needed for the matter',
        'Organize for later: photos, videos, receipts, police materials, and any existing investigation, court case, or settlement discussion; medical or bank records only after the attorney asks for them',
      ],
      cautionPoints: [
        'Clients often focus on the criminal complaint first and delay civil damage calculation.',
        'In matters involving foreign nationals, serving documents and scheduling procedural steps can take longer than expected.',
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
      label: 'Semiconductor suppliers',
      title: 'Taiwan Legal Counsel for Semiconductor Suppliers',
      seoTitle: 'Taiwan Semiconductor Supplier Legal Support',
      description:
        'For overseas semiconductor materials and equipment suppliers to Taiwan fabs and OSAT houses: entity choice, supply contracts, technician stays, and collections.',
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
      ctaTextOverride:
        'Whether you need a Taiwan entity or a contract review depends on the customer’s requirements, the size of the account, and expected future business. Start with a brief summary of those points. The quotation, supply agreement, and vendor-registration documents can follow after attorney instructions.',
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
        'Vendor-registration requirements vary. We review the documents alongside emails from the customer’s purchasing team.',
        // REVIEW: 변호사 검수 필요 — 검수·인수 시점이 대금 청구와 하자 대응에 미치는 영향을 서술
        'For equipment supply, the contract’s inspection requirements and acceptance date affect invoicing and the response to defects, so we review those terms together.',
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
        'If repeated technician visits are planned late, there may be too little time to arrange their stay.',
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
            'It depends on the customer’s requirements. We first check whether the vendor pack is asking for a Taiwan business registration number, invoices issued in Taiwan, or staff on the ground. We then put a subsidiary and a branch side by side on tax, contracting party, and hiring scope, and look with you at which one meets that request.',
        },
        {
          question: 'What should we prepare when equipment technicians will stay only a short time?',
          // REVIEW: 변호사 검수 필요 — 체류 자격·절차 준비를 언급(구체 요건은 단정하지 않음)
          answer:
            'The required procedures depend on the length of stay, the work on site, and where payroll is paid. Share the travel dates, the scope of work on the floor, and who the contracting party is, and we will confirm which steps to take.',
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
            'Taiwan company setup is commonly planned around three months, but the timing depends on whether investment review applies, when capital is remitted, and how the business scope is stated. A standard Taiwan company setup starts from NT$50,000, and a general legal consultation is NT$3,000 per hour in person or by video. Engagement fees for a matter are quoted separately after we have seen the documents.',
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
        '台湾に子会社・支店・代表者事務所（いわゆる駐在員事務所）を設立したい日本企業',
        '台湾の取引先との契約トラブル・未払い・損害賠償を日本語で相談したい方',
        '台湾在住の日本人の方の労働・家事（離婚・相続）・交通事故などの法律問題',
        '相談前に手続きと必要資料を先に把握しておきたい方',
      ],
      reviewPoints: [
        '案件の類型によって管轄、スケジュール、証拠確保の方法が異なります。',
        '日本本社の構造と台湾現地の手続きをあわせて調整する必要があるケースが少なくありません。',
        '外国人案件は通訳、委任状、送達、出入国の問題まであわせて確認する必要があります。',
        '法的な検討とあわせて、実際の執行可能性も確認します。',
      ],
      processFlow: [
        'ご相談の目的を伺い、関連する契約書や証拠の有無を確認します。',
        '台湾での管轄や手続、見込まれる期間、出席の要否を確認し、優先して対応すべき事項を決めます。',
        'すぐに進められる手続と追加確認が必要な事項を分け、対応の順序をご提案します。',
      ],
      prepareChecklist: [
        '初回の簡潔な概要：争点または事業モデル、台湾との接点、重要な日付・期限、希望言語、連絡先',
        '後ほど弁護士の案内に従って整理する資料：契約書、メール、メッセンジャーのやり取り、見積書、送金記録（原本は初回メールに添付しない）',
        '後ほど整理する情報：相手方の基本情報と会社名・住所・代表者情報',
        '後ほど整理する証拠：写真・動画・登記簿などの核心資料。診断書や口座情報などの機微情報は、弁護士の指示後にのみご提出ください',
      ],
      cautionPoints: [
        '日本で一般的な方法が台湾の手続きと異なる場合があります。',
        '翻訳の内容だけでなく、書類の形式や委任状の要件も確認してください。',
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
          answer: '一般法律相談は対面またはビデオで1時間3,000新台湾ドル（NT$）です。案件の費用は資料を確認したうえで別途お見積りします。標準的な台湾会社設立はNT$50,000からです（費用のご案内ページ参照）。',
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
      title: '台湾での会社設立のご相談',
      seoTitle: '台湾会社設立・法人設立の弁護士｜手続き・費用・期間',
      description: '日本企業の台湾進出に向けた会社設立の手続き・費用・期間と、子会社・支店・代表者事務所（いわゆる駐在員事務所）の違いを日本語で解説します。投資審査、銀行口座、就業許可など必要な手続きについて日本語で相談できます。',
      keywords: ['台湾会社設立弁護士', '台湾法人設立弁護士', '台湾投資弁護士', '曾雋崴弁護士', '台湾子会社 支店', '台湾法人設立'],
      searchTerms: ['台湾会社設立弁護士', '台湾法人設立弁護士', '台湾投資弁護士', '台湾法人設立'],
      heroPoints: [
        '法人形態の選択、投資承認の要否、資本金送金、登記、業種別許認可まで、案件ごとに確認すべき点を整理します。',
        '設立後のビザ、商標、契約、雇用についてもご相談いただけます。',
      ],
      idealFor: [
        '日本本社基準で台湾法人の構造を決める必要がある場合',
        '支店と子会社のどちらの形態が適切か比較が必要な場合',
        '会社設立と並行して、化粧品・物流などの業種別の許認可を確認する必要がある場合',
        '設立後のビザ、商標、労働契約まであわせて検討したい場合',
      ],
      reviewPoints: [
        '投資承認と資本金送金の段階は、必要書類とスケジュールの確認が早めに必要です。',
        '営業住所、業種コード、実質的な運営構造が合わないと後続手続きが遅れることがあります。',
        '会社登記とは別に、事業内容に応じた許認可や登録などの手続が必要になる場合があります。',
      ],
      processFlow: [
        '進出目的と売上構造を基準に、子会社・支店・代表者事務所のどの形態が適切か先に比較します。',
        '会社名の事前審査・予約の後、外国投資承認が必要な事業であれば承認を申請し、資本金規模・株主構成・営業住所を整理します。',
        '会社設立準備用の銀行口座を開設して資本金を送金し、送金後の資本金査定（投資額の確認）を経て会社登記を申請します。登記後は正式な銀行口座・税務・ビザ・商標・雇用契約など、案件に応じた後続手続きをあわせて整理します。',
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
        'ビザや現地雇用が必要な場合は、設立手続きと別に日程を見ておくと整理しやすくなります。',
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
            '投資承認の要否、送金・銀行審査、業種別許可により大きく異なります。就業許可・居留は会社設立とは別手続きで、時期の目安も案件ごとに変わります。詳細は台湾法人設立総合ガイドもご参照ください。',
        },
        {
          question: '支店と子会社はどの基準で選びますか？',
          answer:
            '責任構造、税務、今後の投資計画によって異なります。独立運営と現地拡張を考える場合は子会社を、本社直結の構造を希望する場合は支店を検討するケースが多いです。',
        },
        {
          question: '会社登記のほかに、どのような手続が必要ですか？',
          answer:
            '事業内容に応じて、銀行口座、税務、ビザ、商標、雇用契約などの準備が必要になります。業種別の許認可には登記前に必要なものもあるため、設立段階から全体の日程を確認します。',
        },
      ],
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: '相談案内',
      title: '台湾での訴訟・紛争のご相談',
      seoTitle: '台湾訴訟弁護士｜民事・労働・家事 日本語対応',
      description: '台湾での契約紛争・未払い請求、民事訴訟、損害賠償、労働紛争、刑事対応、離婚・相続について、日本企業・在台日本人の方が最初に確認すべきポイントをまとめました。日本語で直接ご相談いただけます。',
      keywords: ['台湾訴訟弁護士', '台湾民事訴訟弁護士', '台湾損害賠償弁護士', '台湾刑事訴訟弁護士', '曾雋崴弁護士'],
      searchTerms: ['台湾訴訟弁護士', '台湾民事訴訟弁護士', '台湾損害賠償弁護士'],
      heroPoints: [
        '台湾の契約紛争・未払い請求、民事訴訟、損害賠償、交通事故、刑事手続き、離婚・相続紛争について、案件類型ごとに管轄・証拠・手続きの確認ポイントを整理します。',
        '外国人案件は証拠確保、翻訳、送達、出入国の問題をあわせて検討する必要があります。',
      ],
      idealFor: [
        '台湾で事故、損害、契約紛争が発生した場合',
        '刑事告訴または警察捜査への対応が必要な場合',
        '国際離婚、親権、相続のように日本と台湾の法があわせて絡む場合',
        '訴訟前に示談の可能性と必要な証拠を確認したい場合',
      ],
      reviewPoints: [
        '初期の事実関係の整理と証拠確保のスピードが結果に大きく影響します。',
        '刑事手続きと民事損害賠償をあわせて設計すると戦略が変わることがあります。',
        '翻訳に必要な時間も含め、送達や提出期限を確認します。',
        '示談の可否を判断する前に損害の算定と責任構造を先に確認する必要があります。',
      ],
      processFlow: [
        '出来事を時系列で整理し、相手方と損害の範囲を確認します。',
        '必要な民事・刑事・家事の手続を確認し、並行して進めるか、どれを先に進めるかを検討します。',
        '示談の可能性、追加で必要な証拠、出席の要否を踏まえ、対応方針をご提案します。',
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
        '国外への送達が必要な場合は、その期間も見込んで手続の日程を検討します。',
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
      label: '相談案内',
      title: '台湾の半導体材料・装置サプライヤー向け法務案内',
      seoTitle: '台湾の半導体素材・装置サプライヤー法務 | 会社設立・契約・労務・売掛',
      description:
        '台湾のファブやパッケージング・テスト企業へ材料・装置を納入する日本のサプライヤーが、現地法人、供給契約、技術者の滞在、代金回収をどう準備するかを整理した案内です。相談は日本語・中国語・英語・韓国語で行います。',
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
      ctaTextOverride:
        '現地法人の設立が必要か、契約の見直しで対応できるかは、取引先の条件、取引規模、今後の数量計画によって異なります。まずは取引の概要、台湾との関係、希望時期・期限、連絡先をお知らせください。受任可否と利益相反を確認したうえで、相談範囲と費用をご案内します。見積書や契約書などの資料は、弁護士の案内後にご提出ください。',
      heroPoints: [
        // REVIEW: 변호사 검수 필요 — 거래처의 벤더 등록 요구를 법인 없이 충족할 수 있는지에 대한 판단이 걸린 문장
        '台湾のファブやOSAT（後工程のパッケージング・テスト）がベンダー登録とあわせて現地法人を求めることがあります。現地法人の設立が必須なのか、支店や既存の代理店を通じた納入でも条件を満たせるのか、先方の書式を確認します。',
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
        // REVIEW: 변호사 검수 필요 — 검수·인수 시점이 대금 청구와 하자 대응에 미치는 영향을 서술
        '装置の供給では、検収基準と引渡し時点をどこに置くかで請求と不具合対応の順序が変わるため、契約書の文言から確認します。',
        // REVIEW: 변호사 검수 필요 — 기술자 체류와 현지 채용 일정의 연계를 서술
        '日本の技術者の滞在準備と現地採用は、設立日程と重ねて見ないと、実際にいつからライン対応できるかが見えてきません。',
      ],
      processFlow: [
        // REVIEW: 변호사 검수 필요 — 현지 법인 없이 납품 가능한 구조인지 확인한다는 서술
        '取引先から届いたベンダー登録の書式と購買条件を先に読み、現地法人なしでも納入を続けられるかを確認します。',
        // REVIEW: 변호사 검수 필요 — 벤더 등록 요구의 성격에 따라 필요한 조직 형태가 달라진다는 서술
        '台湾に拠点を設ける場合は、子会社・支店・代表者事務所（いわゆる駐在員事務所）を、税務、契約の締結主体、現地採用計画の三つの基準で比較します。',
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
        '技術者の出張が増える見込みがある場合は、滞在に必要な手続の準備期間を確保してください。',
      ],
      serviceSlugs: ['investment', 'civil', 'labor', 'ip'],
      serviceBlurbs: {
        investment:
          '台湾のファブやパッケージング・テスト企業との直接取引に向け、台湾拠点の要否を確認します。拠点を設ける場合は、子会社・支店・代表者事務所の違いと、必要な投資承認・登記の日程を検討します。',
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
          question: '台湾の代理店経由の取引を直接契約に切り替えるとき、何を確認しますか？',
          // REVIEW: 변호사 검수 필요 — 기존 대리점 계약의 기간·해지·독점 조항 검토를 언급
          answer:
            '既存の代理店契約の期間、解除条件、独占の有無を先に確認し、直接契約に変えたときに台湾で誰が請求書を発行し、保守を担うかを整理します。代理店契約書と直近の取引経緯を見ながら順序を決めます。',
        },
        {
          question: '設立にかかる期間と費用はどのくらいですか？',
          answer:
            '台湾の会社設立は約3か月を目安としますが、投資承認の対象かどうか、資本金の送金時期、業種の記載によって変わります。通常の台湾会社設立は50,000新台湾ドル（NT$）から、一般法律相談は対面またはビデオで1時間NT$3,000です。事件の委任費用は資料を確認したうえで別途ご案内します。',
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
