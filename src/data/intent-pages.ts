import type { SiteLocale } from '@/lib/locales';
import type { FAQItem } from '@/data/faq-content';

export const intentPageSlugs = [
  'taiwan-lawyer',
  'taiwan-company-setup-lawyer',
  'taiwan-litigation-lawyer',
] as const;

export type IntentPageSlug = (typeof intentPageSlugs)[number];

export type IntentPageContent = {
  slug: IntentPageSlug;
  label: string;
  title: string;
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
  columnSlugs: string[];
  faq: FAQItem[];
};

export const intentPages: Record<SiteLocale, Record<IntentPageSlug, IntentPageContent>> = {
  ko: {
    'taiwan-lawyer': {
      slug: 'taiwan-lawyer',
      label: '검색 가이드',
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
      label: '검색 가이드',
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
      label: '검색 가이드',
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
  },
  'zh-hant': {
    'taiwan-lawyer': {
      slug: 'taiwan-lawyer',
      label: '搜尋指南',
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
      label: '搜尋指南',
      title: '台灣公司設立律師指南',
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
      label: '搜尋指南',
      title: '台灣訴訟律師指南',
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
        'English-speaking attorneys are available for consultation, in person or by video. Japanese, Korean, and Chinese are also available.',
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
      label: 'SEARCH GUIDE',
      title: 'Taiwan Company Setup Lawyer for Overseas Businesses',
      description: 'A focused guide on how a Taiwan company setup lawyer helps overseas businesses with entity choice, investment approval, registration, and operating contracts.',
      keywords: ['Taiwan company setup lawyer', 'Taiwan incorporation lawyer', 'Taiwan investment lawyer', 'Wei Tseng attorney', 'Taiwan subsidiary branch', 'Taiwan branch vs subsidiary', 'Taiwan residence permit assistance', 'Taiwan tax accounting assistance'],
      searchTerms: ['Taiwan company setup lawyer', 'Taiwan incorporation lawyer', 'Taiwan investment lawyer', 'Taiwan branch vs subsidiary'],
      heroPoints: [
        'Entity choice, investment approval, capital remittance, registration, and operating contracts should be reviewed as one Taiwan-law process.',
        'The guide explains subsidiary, branch, and representative-office choices from the perspective of overseas parents and investors entering Taiwan — not limited to one home country.',
        'English-speaking attorneys are available for consultation, in person or by video. Initial review can start remotely.',
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
            'Yes. English-speaking attorneys can begin an initial review by email or video. Local filings, bank work, and in-person steps are mapped after that first consultation. Current consultation structure is on the Service Fees page.',
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
      label: 'SEARCH GUIDE',
      title: 'Taiwan Litigation Lawyer for Contract Disputes & Civil Claims',
      description: 'A practical guide for overseas companies and individuals looking for a Taiwan litigation lawyer for contract disputes, unpaid invoices, civil claims, criminal matters, and family disputes. English-speaking attorneys are available.',
      keywords: ['Taiwan litigation lawyer', 'Taiwan civil litigation lawyer', 'Taiwan damages lawyer', 'Taiwan criminal lawyer', 'Wei Tseng attorney', 'sue a company in Taiwan', 'Taiwan debt recovery lawyer', 'Taiwan commercial dispute lawyer'],
      searchTerms: ['Taiwan litigation lawyer', 'Taiwan civil litigation lawyer', 'Taiwan damages lawyer', 'Taiwan debt recovery', 'sue a Taiwanese company'],
      heroPoints: [
        'We handle Taiwan contract disputes and unpaid invoices, as well as civil claims, criminal matters, and family disputes according to the case.',
        'English-speaking attorneys are available for consultation, in person or by video. Early review can start from outside Taiwan.',
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
  },
  ja: {
    'taiwan-lawyer': {
      slug: 'taiwan-lawyer',
      label: '検索ガイド',
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
      label: '検索ガイド',
      title: '台湾会社設立・法人設立の弁護士｜手続き・費用・期間',
      description: '日本企業の台湾進出に向けた会社設立の手続き・費用・期間と、子会社・支店・駐在員事務所の違いを日本語で解説します。投資審査から銀行口座開設、就労許可証までを一貫してサポートします。',
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
            '一般的に約3ヶ月前後を見込みますが、投資承認の対象かどうか、資本金送金の時期、業種別許可の必要性によって変わることがあります。設立後の就労許可証・居留証の取得には、さらに約1ヶ月が目安です（詳細は台湾法人設立総合ガイドをご覧ください）。',
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
      ],
    },
    'taiwan-litigation-lawyer': {
      slug: 'taiwan-litigation-lawyer',
      label: '検索ガイド',
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
  },
};

export function getIntentPage(locale: SiteLocale, slug: string): IntentPageContent | undefined {
  if (!intentPageSlugs.includes(slug as IntentPageSlug)) {
    return undefined;
  }

  return intentPages[locale][slug as IntentPageSlug];
}
