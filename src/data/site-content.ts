export type NavItem = {
  label: string;
  href: string;
};

export type FeaturedItem = {
  title: string;
  summary: string;
  meta?: string;
  tag?: string;
  href: string;
  image: string;
};

export type HeroHighlightItem = {
  title: string;
  summary: string;
  meta?: string;
  href: string;
  image: string;
};

export type UpdateItem = {
  title: string;
  meta?: string;
  tag?: string;
  href: string;
};

export type MajorNewsItem = {
  title: string;
  summary: string;
  date?: string;
  tag?: string;
  href: string;
};

export type CaseGuideItem = {
  title: string;
  summary: string;
  tag?: string;
  href: string;
};

export type AchievementItem = {
  title: string;
  amount: string;
  summary: string;
  image: string;
  tag?: string;
  href: string;
};

export type NewsletterItem = {
  title: string;
  summary?: string;
  date?: string;
  href: string;
};

export type VideoItem = {
  title: string;
  duration?: string;
  href: string;
  image: string;
};

export type SiteContent = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    primary: NavItem[];
    servicesMenu: {
      label: string;
      categories: NavItem[];
      featured: { title: string; description: string; href: string }[];
      topics: string[];
    };
    insightsMenu: {
      label: string;
      categories: NavItem[];
      featured: { title: string; description: string; href: string }[];
      topics: string[];
    };
    cta: NavItem;
    searchLabel: string;
    languageLabel: string;
  };
  hero: {
    label: string;
    title: string;
    subtitle: string;
    typingPhrases: string[];
    searchPlaceholder: string;
    searchButton: string;
    keywordsLabel: string;
    keywords: string[];
    quickLinksLabel: string;
    quickLinks: NavItem[];
    secondaryLinks: NavItem[];
  };
  heroHighlights: {
    label: string;
    items: HeroHighlightItem[];
  };
  achievements: {
    label: string;
    title: string;
    items: AchievementItem[];
  };
  stats: {
    label: string;
    title: string;
    description: string;
    highlightWords?: string[];
    items: { target: number; suffix?: string; label: string }[];
  };
  majorNews: {
    label: string;
    title: string;
    items: MajorNewsItem[];
  };
  firmUpdates: {
    label: string;
    title: string;
    tabs: { id: string; label: string; items: UpdateItem[] }[];
  };
  featured: {
    label: string;
    title: string;
    items: FeaturedItem[];
  };
  services: {
    label: string;
    title: string;
    description: string;
    items: { title: string; description: string; href: string; details?: string[]; relatedColumns?: { title: string; slug: string }[] }[];
  };
  homeAttorney: {
    label: string;
    title: string;
    summary: string;
    ctaLabel: string;
  };
  homeResults: {
    label: string;
    title: string;
    description: string;
    summary: string;
    ctaLabel: string;
  };
  updates: {
    label: string;
    title: string;
    tabs: { id: string; label: string; items: UpdateItem[] }[];
  };
  caseGuides: {
    label: string;
    title: string;
    description: string;
    items: CaseGuideItem[];
  };
  newsletters: {
    label: string;
    title: string;
    items: NewsletterItem[];
  };
  videos: {
    label: string;
    title: string;
    description: string;
    items: VideoItem[];
    featured: VideoItem;
    cta: NavItem;
  };
  warning: {
    label: string;
    title: string;
    message: string;
    cta: NavItem;
  };
  quickContact: {
    buttonLabel: string;
    panelTitle: string;
    actions: { label: string; value: string; href: string }[];
    cta: NavItem;
  };
  contact: {
    label: string;
    title: string;
    description: string;
    inquiriesLabel: string;
    inquiries: { title: string; details: string[] }[];
    locationsLabel: string;
    locations: { title: string; details: string[] }[];
    cta: NavItem;
  };
  homeContactCta: {
    title: string;
    description: string;
  };
  footer: {
    note: string;
    columns: { title: string; links: NavItem[] }[];
    legal: string;
  };
  search: {
    title: string;
    placeholder: string;
    tabs: { id: string; label: string }[];
    suggestions: string[];
  };
};

const baseSiteContent: Record<'ko' | 'zh-hant', SiteContent> = {
  ko: {
    meta: {
      title: '법무법인 호정 (昊鼎國際法律事務所)',
      description: '대만 법률을 한국어로 명확하게 안내합니다. 한국어·일본어 상담 가능.'
    },
    nav: {
      primary: [
        { label: '업무분야', href: '/ko/services' },
        { label: '변호사소개', href: '/ko/lawyers' },
        { label: '비용안내', href: '/ko/pricing' },
        { label: '호정칼럼', href: '/ko/columns' },
        { label: '미디어센터', href: '/ko/videos' },
        { label: '오시는길', href: '/ko/contact#offices' }
      ],
      servicesMenu: {
        label: '업무분야',
        categories: [
          { label: '대만 투자·회사 설립', href: '/ko/services#investment' },
          { label: '비자 신청', href: '/ko/services#investment' },
          { label: '상표·특허', href: '/ko/services#ip' },
          { label: '법적 위험 분석', href: '/ko/services#investment' },
          { label: '세무 상담', href: '/ko/services#investment' },
          { label: '부동산·건설', href: '/ko/services#real-estate' },
          { label: '금융·보험', href: '/ko/services#finance' },
          { label: '노사·형사·민사·가사', href: '/ko/services#labor' }
        ],
        featured: [
          {
            title: '대만 투자 및 소송 전 과정 지원',
            description: '회사 설립부터 소송까지 한국·일본 고객을 위한 실무 지원을 제공합니다.',
            href: '/ko/services'
          },
          {
            title: '한국어·일본어 커뮤니케이션',
            description: '한국어 및 일본어로 명확한 법률 설명을 제공합니다.',
            href: '/ko/about'
          }
        ],
        topics: ['대만 투자', '회사 설립', '비자 신청', '지적재산권']
      },
      insightsMenu: {
        label: '칼럼',
        categories: [
          { label: '블로그', href: '/ko/columns' },
          { label: '유튜브 채널', href: '/ko/videos' },
          { label: 'FAQ', href: '/ko/faq' },
          { label: '업무분야 안내', href: '/ko/services' },
          { label: '연락처', href: '/ko/contact' }
        ],
        featured: [
          {
            title: 'WEI Lawyer 유튜브 채널',
            description: '대만 법률 정보를 영상으로 확인할 수 있습니다.',
            href: '/ko/videos'
          },
          {
            title: '네이버 블로그',
            description: '대만 법률 관련 글을 블로그에서 확인하세요.',
            href: '/ko/columns'
          }
        ],
        topics: ['네이버 블로그', 'WEI Lawyer', '대만 법률', '상담 절차']
      },
      cta: { label: '상담 문의', href: '/ko/contact' },
      searchLabel: '검색',
      languageLabel: '언어'
    },
    hero: {
      label: 'TAIWAN LEGAL',
      title: '대만 법률을 한국어로 명확하게.',
      subtitle:
        '한국어, 일본어 소통에 능통한 전문가들이 복잡한 대만 법률 문제를 명확하게 안내해드립니다.',
      typingPhrases: [
        '대만 투자, 법인설립의 시작',
        '대만 소송, 승소의 경험',
        '대만 유일의 한국어 법률서비스',
        '한국 기업의 대만 진출 파트너'
      ],
      searchPlaceholder: '어떻게 도와드릴까요?',
      searchButton: '검색',
      keywordsLabel: '추천 키워드',
      keywords: ['대만 투자', '회사 설립', '비자 신청', '상표·특허', '부동산 소송', '금융·보험', '노사 분쟁', '형사·민사·가사'],
      quickLinksLabel: '추천 분류',
      quickLinks: [
        { label: '업무분야', href: '/ko/services' },
        { label: '변호사', href: '/ko/lawyers' },
        { label: '칼럼', href: '/ko/columns' },
        { label: '영상', href: '/ko/videos' },
        { label: 'FAQ', href: '/ko/faq' }
      ],
      secondaryLinks: [
        { label: '업무분야 보기', href: '/ko/services' },
        { label: '문의하기', href: '/ko/contact' }
      ]
    },
    heroHighlights: {
      label: '주요 콘텐츠',
      items: [
        {
          title: '대만 투자·회사 설립',
          summary: '설립·비자·세무까지 흐름을 안내합니다.',
          meta: 'Guide',
          href: '/ko/services#investment',
          image: '/images/feature-1.svg'
        },
        {
          title: '부동산·건설 분쟁',
          summary: '매매·임대·공사 분쟁 대응.',
          meta: 'Guide',
          href: '/ko/services#real-estate',
          image: '/images/feature-2.svg'
        },
        {
          title: '지적재산권',
          summary: '특허·상표·저작권 보호.',
          meta: 'Guide',
          href: '/ko/services#ip',
          image: '/images/feature-3.svg'
        },
        {
          title: '노사·형사·민사·가사',
          summary: '노사 및 형사·민사·가사 사건.',
          meta: 'Guide',
          href: '/ko/services#labor',
          image: '/images/feature-2.svg'
        }
      ]
    },
    achievements: {
      label: 'RESULTS',
      title: '주요 실적',
      items: [
        {
          title: '헬스장 사고',
          amount: '157만 TWD',
          summary: '헬스장 부상 사건에서 손해배상 승소.',
          image: '/images/feature-1.svg',
          tag: '민사',
          href: '/ko/columns'
        },
        {
          title: '의료분쟁',
          amount: '300만 TWD',
          summary: '의료분쟁 사건에서 배상 판결.',
          image: '/images/feature-2.svg',
          tag: '의료',
          href: '/ko/columns'
        },
        {
          title: '투자손실 회수',
          amount: '수백만 TWD',
          summary: '금융·투자 관련 손실 회수 지원.',
          image: '/images/feature-3.svg',
          tag: '금융',
          href: '/ko/columns'
        },
        {
          title: '의료과실 사건',
          amount: '290만 TWD',
          summary: '의료과실 관련 손해배상 사건 대응.',
          image: '/images/feature-2.svg',
          tag: '의료',
          href: '/ko/columns'
        },
        {
          title: '이혼 재산분할',
          amount: '600만 TWD',
          summary: '가사소송 재산분할 사건 수행.',
          image: '/images/feature-1.svg',
          tag: '가사',
          href: '/ko/columns'
        },
        {
          title: '화장품 분쟁',
          amount: '30만 TWD',
          summary: '화장품 관련 거래 분쟁 해결.',
          image: '/images/feature-3.svg',
          tag: '상사',
          href: '/ko/columns'
        }
      ]
    },
    stats: {
      label: 'ABOUT',
      title: '복잡한 대만 법률을 명확하게 안내합니다',
      description:
        "'호'(昊)는 광대한 하늘을, '정'(鼎)은 안정된 기초를 뜻합니다. 한국어·일본어 소통을 바탕으로 투자, 법인설립, 소송까지 원스톱으로 지원합니다.",
      highlightWords: ['한국어', '일본어', '투자', '법인설립', '소송', '원스톱'],
      items: [
        { target: 10, suffix: '+', label: '년 경력' },
        { target: 500, suffix: '+', label: '처리 사건' },
        { target: 5, label: '사무소' },
        { target: 4, label: '개국어 지원' }
      ]
    },
    majorNews: {
      label: 'MAJOR NEWS',
      title: '주요 안내',
      items: [
        {
          title: '대만 투자·회사 설립 안내',
          summary: '회사 설립, 비자 신청, 상표·특허, 세무 상담 등 투자 전 과정을 지원합니다.',
          date: '상시',
          tag: '가이드',
          href: '/ko/services#investment'
        },
        {
          title: '부동산·건설·금융 분쟁 대응',
          summary: '부동산, 건설, 금융·보험 관련 분쟁과 소송 대응을 안내합니다.',
          date: '상시',
          tag: '가이드',
          href: '/ko/services#real-estate'
        },
        {
          title: '지적재산권·노사·형사/민사/가사',
          summary: '특허·상표·저작권 및 노사·형사·민사·가사 사건을 폭넓게 다룹니다.',
          date: '상시',
          tag: '가이드',
          href: '/ko/services#ip'
        }
      ]
    },
    firmUpdates: {
      label: 'UPDATES',
      title: '법인 업데이트',
      tabs: [
        {
          id: 'news',
          label: '법무 소식',
          items: [
            {
              title: '대만 투자 상담 가이드 안내',
              meta: '안내',
              tag: '공지',
              href: '/ko/services#investment'
            },
            {
              title: '법률 자문 프로세스 안내',
              meta: '안내',
              tag: '공지',
              href: '/ko/faq'
            }
          ]
        },
        {
          id: 'media',
          label: '미디어',
          items: [
            {
              title: '네이버 블로그: 대만변호사 증준외',
              meta: '채널',
              tag: 'Media',
              href: 'https://blog.naver.com/wei_lawyer/223461663913'
            },
            {
              title: 'WEI Lawyer 유튜브 채널',
              meta: '채널',
              tag: 'Media',
              href: 'https://www.youtube.com/@weilawyer'
            }
          ]
        },
        {
          id: 'seminar',
          label: '세미나',
          items: [
            {
              title: '세미나 자료 준비 중',
              meta: '준비중',
              tag: '세미나',
              href: '/ko/contact'
            }
          ]
        }
      ]
    },
    featured: {
      label: 'FEATURED',
      title: '주요 업무 영역',
      items: [
        {
          title: '대만 투자·회사 설립',
          summary:
            '회사 설립, 비자 신청, 상표·특허 신청, 법적 위험 분석, 세무 상담 등 투자 전 과정을 지원합니다.',
          meta: '업무',
          tag: '투자·자문',
          href: '/ko/services#investment',
          image: '/images/feature-1.svg'
        },
        {
          title: '부동산·건설·금융 소송',
          summary: '부동산, 건설, 금융·보험 관련 분쟁 및 소송을 대응합니다.',
          meta: '소송',
          tag: '분쟁',
          href: '/ko/services#real-estate',
          image: '/images/feature-2.svg'
        },
        {
          title: '지적재산권·노사·형사/민사/가사',
          summary: '특허·상표·저작권과 노사, 형사·민사·가사 사건을 폭넓게 다룹니다.',
          meta: '소송',
          tag: '전문영역',
          href: '/ko/services#ip',
          image: '/images/feature-3.svg'
        }
      ]
    },
    services: {
      label: 'SERVICES',
      title: '주요 서비스',
      description: '대만 내 투자, 소송, 자문 전반을 구조화하여 제공합니다.',
      items: [
        {
          title: '투자·법인설립',
          description: '한국 기업의 대만 진출을 위한 법인 형태 선택(자회사·지사·유한회사)부터 투자심의위원회 승인, 자본금 송금, 은행 계좌 개설, 영업장소 확보까지 전 과정을 지원합니다. 화장품·물류 등 업종별 인허가 요건과 해산·청산을 통한 자본금 회수 절차까지 안내합니다.',
          href: '/ko/services#investment',
          details: [
            '법인 형태 비교: 자회사 vs 지사 vs 유한회사',
            '투자심의위원회(투심회) 승인 절차 대행',
            '자본금 송금·예비계좌·정식계좌 전환',
            '영업장소 용도지역 적합성 사전 확인',
            '업종별 인허가: 화장품(PIF), 물류(운송면허) 등',
            '해산·청산 절차를 통한 합법적 자본금 회수',
          ],
          relatedColumns: [
            { title: '대만 회사설립 기초편', slug: 'taiwan-company-establishment-basics' },
            { title: '자회사 VS 지사 비교', slug: 'taiwan-company-subsidiary-vs-branch' },
            { title: '심화편 1: 비자·거류증', slug: 'taiwan-company-establishment-advanced-1' },
            { title: '심화편 2: 자본금·계좌', slug: 'taiwan-company-establishment-advanced-2' },
            { title: '심화편 3: 영업장소 찾기', slug: 'taiwan-company-setup-pitch-location' },
            { title: '화장품 시장 진출 가이드', slug: 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide' },
            { title: '물류업 경영 방법', slug: 'taiwan-logistics-business-setup' },
            { title: '자본금 회수 방법', slug: 'withdraw-capital-taiwan-company' },
          ]
        },
        {
          title: '민사소송·손해배상',
          description: '계약 분쟁, 손해배상, 소비자 피해 등 민사 사건 전반을 대응합니다. 한국 유학생 헬스장 부상 사건에서 157만 대만달러 배상 판결을 이끌어낸 실적이 있으며, 외국인 의뢰인의 대만 소송 절차를 한국어로 밀착 지원합니다.',
          href: '/ko/services#civil',
          details: [
            '손해배상 청구 소송 (인신사고·재산피해)',
            '계약 불이행·상사 분쟁 대응',
            '소비자 피해 구제 및 기업 상대 소송',
            '교통사고 과실 비율 분석 및 배상 청구',
            '외국인 의뢰인 대상 한국어 소송 지원',
          ],
          relatedColumns: [
            { title: '헬스장 부상 소송 (157만 TWD)', slug: 'taiwan-gym-injury-lawsuit' },
            { title: '교통사고 발생시 대응', slug: 'taiwan-traffic-accident-procedure' },
            { title: '추월 사고 책임 분석', slug: 'taiwan-overtaking-accident-liability' },
          ]
        },
        {
          title: '가사소송',
          description: '이혼, 재산분할, 친권, 상속 등 가사 사건을 대응합니다. 한국-대만 국제결혼 증가에 따른 협의이혼·조정이혼 절차, 외국인 배우자의 호적 등록 문제, 상속 순위 및 잔여재산 분배 청구까지 전략적으로 지원합니다.',
          href: '/ko/services#family',
          details: [
            '협의이혼: 증인 2인 확보 및 호적 등록',
            '조정이혼·재판이혼 절차 대리',
            '친권(양육권) 결정 및 면접교섭권',
            '대만 상속법: 배우자·자녀 상속분 계산',
            '잔여재산 분배 청구 (혼인 기간별 차이)',
          ],
          relatedColumns: [
            { title: '이혼 조정·소송 Q&A', slug: 'taiwan-divorce-lawsuit-qna' },
            { title: '유산·친권 이슈 분석', slug: 'taiwan-inheritance-custody-analysis' },
          ]
        },
        {
          title: '노동법·고용분쟁',
          description: '대만 노동기준법에 따른 해고·퇴직금·근로계약 분쟁을 다룹니다. 한국과 다른 대만 퇴직금 산정 방식(근속연수 × 0.5개월분, 최대 6개월), 자발적 퇴사에서도 퇴직금을 청구할 수 있는 예외 사유, 의무재직 약정의 유효성 판단 등을 실무 경험을 바탕으로 자문합니다.',
          href: '/ko/services#labor',
          details: [
            '경제성 해고 시 퇴직금 산정 (0.5개월×근속연수)',
            '자발적 퇴사 시 퇴직금 예외: 임금 미지급·폭행·보험 미가입 등',
            '의무재직 약정(최저복무기간) 유효성 검토',
            '한국 기업의 대만 직원 채용 관련 노동법 자문',
          ],
          relatedColumns: [
            { title: '대만 퇴직금 제도 한국과 비교', slug: 'taiwan-labor-severance-law' },
            { title: '자발적 퇴사 퇴직금 예외', slug: 'taiwan-voluntary-resignation-severance' },
            { title: '의무재직 약정 문제', slug: 'taiwan-mandatory-employment-period' },
          ]
        },
        {
          title: '형사소송',
          description: '대만 형사 절차에서의 수사 대응, 피의자·피해자 대리, 변호인 접견을 수행합니다. 규제 위반에 따른 형사 처벌 리스크(자본금 불법 인출 시 최대 5년 이하 징역, 업종 무허가 영업 등) 사전 점검과 방어 전략을 제공합니다.',
          href: '/ko/services#criminal',
          details: [
            '형사 수사 단계 변호인 접견·자문',
            '피해자 대리 및 고소·고발 절차',
            '규제 위반 형사 리스크 사전 점검',
            '외국인 피의자 한국어 통역 지원 소송',
          ]
        },
        {
          title: '지적재산·금융분쟁',
          description: '상표·특허·저작권 등 지적재산 보호와 금융·투자 관련 분쟁을 대응합니다. 대만 진출 시 상표 선등록 확인, 브랜드 보호 전략, 금융상품·투자계약 분쟁의 사실관계 분석 및 소송을 지원합니다.',
          href: '/ko/services#ip',
          details: [
            '대만 상표 선출원 확인 및 등록 대행',
            '특허·저작권 침해 분쟁 대응',
            '금융상품·투자계약 관련 분쟁 소송',
            '브랜드·디자인 보호 전략 자문',
          ]
        }
      ]
    },
    homeAttorney: {
      label: 'ABOUT',
      title: '증준외 변호사, 한국 고객을 위한 대만 법률 파트너',
      summary: '10년 이상 실무 경험, SBS 모닝와이드 출연, WEI Lawyer 채널 운영을 통해 실제 사례 중심의 법률 지원을 이어가고 있습니다.',
      ctaLabel: '변호사 프로필 보기'
    },
    homeResults: {
      label: 'RESULTS',
      title: '한국 학생 헬스장 부상 사건,\n157만 TWD 승소',
      description: '한국 대학생이 대만 헬스장에서 트레이너 지도 중 중상을 입은 사건에서 손해배상 청구를 진행해 1심에서 157만 TWD 판결을 받았습니다.',
      summary: '사실관계 입증, 손해 산정, 협상·소송 전략을 통합해 결과를 도출한 대표 사례입니다.',
      ctaLabel: '소송사례 더 보기'
    },
    updates: {
      label: 'PROFILE',
      title: '증준외 변호사 소개',
      tabs: [
        {
          id: 'education',
          label: '학력',
          items: [
            {
              title: '국립 타이완 대학교 재무금융연구소 석사',
              meta: '석사',
              tag: '학력',
              href: '/ko/about'
            },
            {
              title: '국립 정치 대학교 법학과·금융학과 복수전공 학사',
              meta: '학사',
              tag: '학력',
              href: '/ko/about'
            },
            {
              title: '일본 고베 대학교, 일본 와세다 대학교 교환 학생',
              meta: '교환',
              tag: '학력',
              href: '/ko/about'
            }
          ]
        },
        {
          id: 'experience',
          label: '경력',
          items: [
            {
              title: '추세법률사무소',
              meta: '경력',
              tag: '경력',
              href: '/ko/about'
            },
            {
              title: '법무법인 호정',
              meta: '경력',
              tag: '경력',
              href: '/ko/about'
            },
            {
              title: '법률지원재단 타이중지부 지원 변호사',
              meta: '경력',
              tag: '경력',
              href: '/ko/about'
            }
          ]
        },
        {
          id: 'practice',
          label: '실무 분야',
          items: [
            {
              title: '대만 투자 및 한국·일본 등 국제 사건',
              meta: '국제',
              tag: '실무',
              href: '/ko/services#investment'
            },
            {
              title: '금융 소비, 보험 청구 소송',
              meta: '금융',
              tag: '실무',
              href: '/ko/services#finance'
            },
            {
              title: '부동산 소송(매매, 임대, 도시 재개발, 공사)',
              meta: '부동산',
              tag: '실무',
              href: '/ko/services#real-estate'
            },
            {
              title: '지적재산권 소송(특허, 상표, 저작권)',
              meta: '지재권',
              tag: '실무',
              href: '/ko/services#ip'
            },
            {
              title: '일반 형사, 민사, 가사, 노사 사건',
              meta: '일반',
              tag: '실무',
              href: '/ko/services#labor'
            }
          ]
        }
      ]
    },
    caseGuides: {
      label: 'CASE GUIDES',
      title: '업무 가이드',
      description: '실무에 필요한 체크리스트와 가이드를 제공합니다.',
      items: [
        {
          title: '대만 투자·회사 설립 체크리스트',
          summary: '설립 전 준비 사항과 주요 절차를 요약합니다.',
          tag: '가이드',
          href: '/ko/services#investment'
        },
        {
          title: '비자 신청 준비 가이드',
          summary: '필요 서류와 준비 흐름을 정리합니다.',
          tag: '가이드',
          href: '/ko/services#investment'
        },
        {
          title: '상표·특허 출원 기본',
          summary: '지적재산권 보호를 위한 기본 절차를 안내합니다.',
          tag: '가이드',
          href: '/ko/services#ip'
        }
      ]
    },
    newsletters: {
      label: 'NEWSLETTER',
      title: '법률 브리핑',
      items: [
        {
          title: '대만 투자 브리핑 (준비 중)',
          summary: '투자 관련 최신 실무 포인트를 정리합니다.',
          date: '준비 중',
          href: '/ko/columns'
        },
        {
          title: '부동산·건설 브리핑 (준비 중)',
          summary: '부동산 분쟁 관련 주요 포인트를 정리합니다.',
          date: '준비 중',
          href: '/ko/columns'
        }
      ]
    },
    videos: {
      label: 'CHANNELS',
      title: '증준외 변호사 공개 채널',
      description: 'YouTube, 블로그, 개인 사이트와 공식 프로필 등 증준외 변호사의 공개 채널을 모았습니다.',
      featured: {
        title: 'WEI Lawyer 유튜브 채널',
        duration: 'YouTube',
        href: 'https://www.youtube.com/@weilawyer',
        image: '/images/video-feature.svg'
      },
      items: [
        {
          title: '네이버 블로그: 대만변호사 증준외',
          duration: '블로그',
          href: 'https://blog.naver.com/wei_lawyer/223461663913',
          image: '/images/video-1.svg'
        },
        {
          title: '개인 사이트: 대만변호사 증준외',
          duration: '웹사이트',
          href: 'https://www.wei-wei-lawyer.com/',
          image: '/images/video-2.svg'
        },
        {
          title: '법무법인 호정',
          duration: '웹사이트',
          href: 'https://www.hoveringlaw.com.tw/kr/wei.html',
          image: '/images/video-3.svg'
        },
        {
          title: '연락처 안내',
          duration: '문의',
          href: '/ko/contact',
          image: '/images/video-4.svg'
        }
      ],
      cta: { label: '채널 바로가기', href: '/ko/videos' }
    },
    warning: {
      label: 'NOTICE',
      title: '사칭·피싱 주의 안내',
      message:
        '법무법인 또는 변호사를 사칭한 연락이 의심되는 경우, 링크나 파일을 열지 마시고 공식 채널로 확인해 주세요.',
      cta: { label: '연락처 확인', href: '/ko/contact' }
    },
    quickContact: {
      buttonLabel: '빠른 상담 열기',
      panelTitle: '빠른 상담',
      actions: [
        { label: 'AI 상담', value: 'AI가 초기 안내를 도와드립니다', href: '#ai-consultation' },
        { label: '이메일', value: 'wei@hoveringlaw.com.tw', href: 'mailto:wei@hoveringlaw.com.tw' },
        { label: '전화 (한국)', value: '010-2992-9304', href: 'tel:+821029929304' },
      ],
      cta: { label: '상담 페이지', href: '/ko/contact' }
    },
    contact: {
      label: 'CONTACT',
      title: '문의 및 연락처',
      description: '문의 유형별 연락처를 우선 안내합니다.',
      inquiriesLabel: '문의 유형',
      inquiries: [
        {
          title: '사업·투자 문의',
          details: ['전화: +82-10-2992-9304', '이메일: wei@hoveringlaw.com.tw']
        },
        {
          title: '미디어 문의',
          details: [
            '이메일: wei@hoveringlaw.com.tw',
            '카카오톡: 채널 상담',
            '접수 시 제목에 [미디어 문의] 표기'
          ]
        },
        {
          title: '채용 문의',
          details: [
            '이메일: wei@hoveringlaw.com.tw',
            '전화: +82-10-2992-9304',
            '접수 시 제목에 [채용 문의] 표기'
          ]
        },
        {
          title: '일반 문의',
          details: ['이메일: wei@hoveringlaw.com.tw']
        }
      ],
      locationsLabel: '사무소 위치',
      locations: [
        {
          title: '타이베이 사무소',
          details: [
            '台北市大同區承德路一段35號7樓之2'
          ]
        },
        {
          title: '타이중 사무소',
          details: [
            '臺中市北區館前路19號樓之1',
            'Tel: 04-2326-1862',
            'Fax: 04-2326-1863'
          ]
        },
        {
          title: '가오슝 사무소',
          details: [
            '高雄市左營區安吉街233號',
            'Tel: 07-557-9797'
          ]
        }
      ],
      cta: { label: '문의 페이지', href: '/ko/contact' }
    },
    homeContactCta: {
      title: '대만 법률 이슈, 지금 바로 상담하세요.',
      description: '사업·소송·법인설립 문의를 유형별로 빠르게 연결해드립니다.'
    },
    footer: {
      note: '한국어·일본어 소통을 바탕으로 대만 전역의 자문과 분쟁 업무를 맡고 있습니다.',
      columns: [
        {
          title: '사무소',
          links: [
            { label: '사무소 소개', href: '/ko/about' },
            { label: '변호사 소개', href: '/ko/lawyers' },
            { label: '상담 문의', href: '/ko/contact' }
          ]
        },
        {
          title: '주요 업무',
          links: [
            { label: '대만 투자·법인 설립', href: '/ko/services#investment' },
            { label: '부동산·건설 분쟁', href: '/ko/services#real-estate' },
            { label: '상표·지식재산', href: '/ko/services#ip' }
          ]
        },
        {
          title: '자료',
          links: [
            { label: '법률 칼럼', href: '/ko/columns' },
            { label: '영상 자료', href: '/ko/videos' },
            { label: '자주 묻는 질문', href: '/ko/faq' }
          ]
        },
        {
          title: '자주 찾는 주제',
          links: [
            { label: '대만 변호사', href: '/ko/taiwan-lawyer' },
            { label: '대만 회사설립', href: '/ko/taiwan-company-setup-lawyer' },
            { label: '대만 소송', href: '/ko/taiwan-litigation-lawyer' },
            { label: '대만 회사설립 종합 가이드', href: '/ko/guides/taiwan-company-setup' },
            { label: '한국어 가능한 대만 변호사', href: '/ko/korean-lawyer-in-taiwan' }
          ]
        }
      ],
      legal: '© 2026 법무법인 호정. All rights reserved.'
    },
    search: {
      title: '검색',
      placeholder: '어떻게 도와드릴까요?',
      tabs: [
        { id: 'services', label: '업무' },
        { id: 'insights', label: '칼럼' },
        { id: 'videos', label: '영상' },
        { id: 'faq', label: 'FAQ' }
      ],
      suggestions: ['대만 투자', '회사 설립', '부동산 소송', '지적재산권', '노사 분쟁']
    }
  },
  'zh-hant': {
    meta: {
      title: '昊鼎國際法律事務所',
      description: '深耕韓國、日本企業來台投資與訴訟需求，提供在地化台灣法律專業協助。'
    },
    nav: {
      primary: [
        { label: '服務領域', href: '/zh-hant/services' },
        { label: '律師介紹', href: '/zh-hant/lawyers' },
        { label: '收費標準', href: '/zh-hant/pricing' },
        { label: '昊鼎專欄', href: '/zh-hant/columns' },
        { label: '媒體中心', href: '/zh-hant/videos' },
        { label: '交通位置', href: '/zh-hant/contact#offices' }
      ],
      servicesMenu: {
        label: '服務領域',
        categories: [
          { label: '在台投資與公司設立', href: '/zh-hant/services#investment' },
          { label: '簽證申請', href: '/zh-hant/services#investment' },
          { label: '商標/專利', href: '/zh-hant/services#ip' },
          { label: '法律風險評估', href: '/zh-hant/services#investment' },
          { label: '稅務諮詢', href: '/zh-hant/services#investment' },
          { label: '不動產/工程', href: '/zh-hant/services#real-estate' },
          { label: '金融/保險', href: '/zh-hant/services#finance' },
          { label: '勞資/刑民/家事', href: '/zh-hant/services#labor' }
        ],
        featured: [
          {
            title: '投資與訴訟全流程協助',
            description: '協助韓國、日本企業來台投資，並為相關訴訟提供全流程支援。',
            href: '/zh-hant/services'
          },
          {
            title: '跨境法律溝通',
            description: '以韓語、日語及中文提供清楚的法律說明。',
            href: '/zh-hant/about'
          }
        ],
        topics: ['在台投資', '公司設立', '簽證申請', '智慧財產權']
      },
      insightsMenu: {
        label: '洞見',
        categories: [
          { label: '部落格', href: '/zh-hant/columns' },
          { label: 'YouTube 頻道', href: '/zh-hant/videos' },
          { label: 'FAQ', href: '/zh-hant/faq' },
          { label: '服務領域', href: '/zh-hant/services' },
          { label: '聯絡我們', href: '/zh-hant/contact' }
        ],
        featured: [
          {
            title: 'WEI Lawyer YouTube 頻道',
            description: '以影片方式整理台灣法律要點。',
            href: '/zh-hant/videos'
          },
          {
            title: 'Naver 部落格',
            description: '在部落格查看相關文章。',
            href: '/zh-hant/columns'
          }
        ],
        topics: ['Naver 部落格', 'WEI Lawyer', '台灣法律', '諮詢流程']
      },
      cta: { label: '聯絡諮詢', href: '/zh-hant/contact' },
      searchLabel: '搜尋',
      languageLabel: '語言'
    },
    hero: {
      label: 'TAIWAN LEGAL',
      title: '台灣法律，清楚說明。',
      subtitle: '具備韓國、日本跨境實務經驗的專業團隊，協助處理台灣法律議題。',
      typingPhrases: [
        '台灣投資與公司設立起點',
        '台灣訴訟與實務經驗',
        '台灣、韓國跨境法律的可靠夥伴',
        '韓國企業在台拓展夥伴'
      ],
      searchPlaceholder: '我們可以如何協助您？',
      searchButton: '搜尋',
      keywordsLabel: '推薦關鍵字',
      keywords: ['在台投資', '公司設立', '簽證申請', '商標/專利', '不動產訴訟', '金融/保險', '勞資爭議', '刑民家事'],
      quickLinksLabel: '推薦分類',
      quickLinks: [
        { label: '服務領域', href: '/zh-hant/services' },
        { label: '律師', href: '/zh-hant/lawyers' },
        { label: '洞見', href: '/zh-hant/columns' },
        { label: '影音', href: '/zh-hant/videos' },
        { label: 'FAQ', href: '/zh-hant/faq' }
      ],
      secondaryLinks: [
        { label: '查看服務領域', href: '/zh-hant/services' },
        { label: '聯絡我們', href: '/zh-hant/contact' }
      ]
    },
    heroHighlights: {
      label: '重點內容',
      items: [
        {
          title: '在台投資與公司設立',
          summary: '設立、簽證與稅務流程重點。',
          meta: 'Guide',
          href: '/zh-hant/services#investment',
          image: '/images/feature-1.svg'
        },
        {
          title: '不動產/工程爭議',
          summary: '買賣、租賃、工程爭議處理。',
          meta: 'Guide',
          href: '/zh-hant/services#real-estate',
          image: '/images/feature-2.svg'
        },
        {
          title: '智慧財產權',
          summary: '專利、商標、著作權保護。',
          meta: 'Guide',
          href: '/zh-hant/services#ip',
          image: '/images/feature-3.svg'
        },
        {
          title: '勞資/刑民/家事',
          summary: '勞資與刑民家事案件。',
          meta: 'Guide',
          href: '/zh-hant/services#labor',
          image: '/images/feature-2.svg'
        }
      ]
    },
    achievements: {
      label: 'RESULTS',
      title: '主要實績',
      items: [
        {
          title: '健身房事故',
          amount: '157萬 TWD',
          summary: '健身房受傷案件獲賠償判決。',
          image: '/images/feature-1.svg',
          tag: '民事',
          href: '/zh-hant/columns'
        },
        {
          title: '醫療糾紛',
          amount: '300萬 TWD',
          summary: '醫療糾紛案件獲得賠償。',
          image: '/images/feature-2.svg',
          tag: '醫療',
          href: '/zh-hant/columns'
        },
        {
          title: '投資損失回收',
          amount: '數百萬 TWD',
          summary: '金融投資爭議之損失回收支援。',
          image: '/images/feature-3.svg',
          tag: '金融',
          href: '/zh-hant/columns'
        },
        {
          title: '醫療過失',
          amount: '290萬 TWD',
          summary: '醫療過失損害賠償案件。',
          image: '/images/feature-2.svg',
          tag: '醫療',
          href: '/zh-hant/columns'
        },
        {
          title: '離婚財產分配',
          amount: '600萬 TWD',
          summary: '家事訴訟中的財產分割。',
          image: '/images/feature-1.svg',
          tag: '家事',
          href: '/zh-hant/columns'
        },
        {
          title: '化妝品爭議',
          amount: '30萬 TWD',
          summary: '化妝品交易糾紛處理。',
          image: '/images/feature-3.svg',
          tag: '商務',
          href: '/zh-hant/columns'
        }
      ]
    },
    stats: {
      label: 'ABOUT',
      title: '以清晰方式處理複雜的台灣法律',
      description:
        "「昊」代表廣闊視野，「鼎」代表穩健基礎。憑藉在韓國、日本市場的實務經驗與跨境法律網絡，從投資、公司設立到訴訟提供一站式法律支援。",
      highlightWords: ['韓語', '日語', '投資', '公司設立', '訴訟', '一站式'],
      items: [
        { target: 10, suffix: '+', label: '年經驗' },
        { target: 500, suffix: '+', label: '處理案件' },
        { target: 5, label: '辦公據點' },
        { target: 4, label: '語言服務' }
      ]
    },
    majorNews: {
      label: 'MAJOR NEWS',
      title: '重要資訊',
      items: [
        {
          title: '在台投資與公司設立指南',
          summary: '提供公司設立、簽證申請、商標/專利與稅務諮詢等協助。',
          date: '常設',
          tag: '指南',
          href: '/zh-hant/services#investment'
        },
        {
          title: '不動產/工程/金融爭議處理',
          summary: '不動產、工程與金融保險相關訴訟與爭議應對。',
          date: '常設',
          tag: '指南',
          href: '/zh-hant/services#real-estate'
        },
        {
          title: '智慧財產與勞資、刑民家事',
          summary: '涵蓋專利、商標、著作權與勞資、刑民家事案件。',
          date: '常設',
          tag: '指南',
          href: '/zh-hant/services#ip'
        }
      ]
    },
    firmUpdates: {
      label: 'UPDATES',
      title: '事務所更新',
      tabs: [
        {
          id: 'news',
          label: '事務所消息',
          items: [
            {
              title: '在台投資諮詢指南說明',
              meta: '說明',
              tag: '公告',
              href: '/zh-hant/services#investment'
            },
            {
              title: '法律顧問流程說明',
              meta: '說明',
              tag: '公告',
              href: '/zh-hant/faq'
            }
          ]
        },
        {
          id: 'media',
          label: '媒體',
          items: [
            {
              title: 'Naver 部落格：台灣律師 曾俊瑋',
              meta: '頻道',
              tag: 'Media',
              href: 'https://blog.naver.com/wei_lawyer/223461663913'
            },
            {
              title: 'WEI Lawyer YouTube 頻道',
              meta: '頻道',
              tag: 'Media',
              href: 'https://www.youtube.com/@weilawyer'
            }
          ]
        },
        {
          id: 'seminar',
          label: '研討會',
          items: [
            {
              title: '研討會資料準備中',
              meta: '準備中',
              tag: '研討會',
              href: '/zh-hant/contact'
            }
          ]
        }
      ]
    },
    featured: {
      label: 'FEATURED',
      title: '核心服務範圍',
      items: [
        {
          title: '在台投資與公司設立',
          summary:
            '提供公司設立、簽證申請、商標/專利申請、法律風險評估與稅務諮詢等協助。',
          meta: '服務',
          tag: '投資/顧問',
          href: '/zh-hant/services#investment',
          image: '/images/feature-1.svg'
        },
        {
          title: '不動產/工程/金融訴訟',
          summary: '處理不動產、工程、金融保險相關訴訟與爭議。',
          meta: '訴訟',
          tag: '爭議',
          href: '/zh-hant/services#real-estate',
          image: '/images/feature-2.svg'
        },
        {
          title: '智慧財產與勞資、刑民家事',
          summary: '涵蓋專利、商標、著作權與勞資、刑民家事案件。',
          meta: '訴訟',
          tag: '專業領域',
          href: '/zh-hant/services#ip',
          image: '/images/feature-3.svg'
        }
      ]
    },
    services: {
      label: 'SERVICES',
      title: '主要服務',
      description: '涵蓋在台投資、訴訟與法律顧問全流程。',
      items: [
        {
          title: '投資·公司設立',
          description: '從公司型態選擇（子公司、分公司、有限公司）到投審會審查、資本匯入、銀行開戶、營業場所確認，全程協助韓國企業落地台灣。涵蓋化妝品 PIF 登錄、物流業運輸執照等特殊行業許可，以及解散清算程序。',
          href: '/zh-hant/services#investment',
          details: [
            '公司型態比較：子公司、分公司、有限公司',
            '投審會核准程序代辦',
            '資本額匯入、籌備帳戶與正式帳戶轉換',
            '營業場所土地使用分區預先確認',
            '特殊行業許可：化妝品（PIF）、物流（運輸執照）等',
            '解散清算程序與合法資本回收',
          ],
          relatedColumns: [
            { title: '台灣公司設立基礎篇', slug: 'taiwan-company-establishment-basics' },
            { title: '子公司與分公司比較', slug: 'taiwan-company-subsidiary-vs-branch' },
            { title: '進階篇 1：簽證與居留', slug: 'taiwan-company-establishment-advanced-1' },
            { title: '進階篇 2：資本與帳戶', slug: 'taiwan-company-establishment-advanced-2' },
            { title: '進階篇 3：營業場所', slug: 'taiwan-company-setup-pitch-location' },
            { title: '化妝品市場進入指南', slug: 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide' },
            { title: '物流業經營方式', slug: 'taiwan-logistics-business-setup' },
            { title: '資本額回收方法', slug: 'withdraw-capital-taiwan-company' },
          ]
        },
        {
          title: '民事訴訟·損害賠償',
          description: '處理契約糾紛、損害賠償、消費者權益等民事案件。曾代理韓國留學生健身房受傷案，獲判新台幣 157 萬元賠償。以中韓雙語全程支援外國當事人之台灣訴訟程序。',
          href: '/zh-hant/services#civil',
          details: [
            '人身傷害與財產損害賠償訴訟',
            '契約違約與商務糾紛應對',
            '消費者保護與企業訴訟',
            '交通事故過失比例分析與求償',
            '外國當事人韓語訴訟支援',
          ],
          relatedColumns: [
            { title: '健身房受傷訴訟（157萬 TWD）', slug: 'taiwan-gym-injury-lawsuit' },
            { title: '交通事故處理程序', slug: 'taiwan-traffic-accident-procedure' },
            { title: '超車事故責任分析', slug: 'taiwan-overtaking-accident-liability' },
          ]
        },
        {
          title: '家事訴訟',
          description: '處理離婚、財產分配、親權、繼承等家事案件。因應韓台跨國婚姻增加，協助協議離婚程序、法院調解與裁判離婚，外籍配偶戶籍登記問題，以及法定繼承順位與剩餘財產分配請求。',
          href: '/zh-hant/services#family',
          details: [
            '協議離婚：二位證人及戶政登記',
            '調解離婚與裁判離婚程序代理',
            '親權（監護權）與探視權',
            '台灣繼承法：配偶與子女應繼分計算',
            '剩餘財產分配請求權（婚姻存續期間差異）',
          ],
          relatedColumns: [
            { title: '離婚調解訴訟 Q&A', slug: 'taiwan-divorce-lawsuit-qna' },
            { title: '遺產與親權分析', slug: 'taiwan-inheritance-custody-analysis' },
          ]
        },
        {
          title: '勞動法·僱傭爭議',
          description: '處理台灣勞基法下的解僱、資遣費與勞動契約爭議。台灣資遣費計算方式與韓國不同（年資×0.5個月，上限6個月），並協助判斷自願離職仍可請求資遣費之例外事由、最低服務年限條款效力等。',
          href: '/zh-hant/services#labor',
          details: [
            '經濟性解僱之資遣費計算（0.5個月×年資）',
            '自願離職資遣費例外：欠薪、暴力、未投保等',
            '最低服務年限條款效力審查',
            '韓國企業在台僱用相關勞動法諮詢',
          ],
          relatedColumns: [
            { title: '台灣資遣費制度比較', slug: 'taiwan-labor-severance-law' },
            { title: '自願離職資遣費例外', slug: 'taiwan-voluntary-resignation-severance' },
            { title: '最低服務年限爭議', slug: 'taiwan-mandatory-employment-period' },
          ]
        },
        {
          title: '刑事訴訟',
          description: '台灣刑事程序中偵查應對、被告與被害人代理、律師接見。提供法規違反刑事風險預檢（非法提取資本最高5年有期徒刑、無照營業等）與防禦策略。',
          href: '/zh-hant/services#criminal',
          details: [
            '偵查階段律師接見與諮詢',
            '被害人代理與告訴程序',
            '法規違反刑事風險預檢',
            '外籍被告韓語口譯訴訟支援',
          ]
        },
        {
          title: '智慧財產·金融爭議',
          description: '商標、專利、著作權等智慧財產保護，以及金融投資相關爭議處理。協助確認台灣商標先申請狀態、品牌保護策略、金融商品與投資契約爭議之分析與訴訟。',
          href: '/zh-hant/services#ip',
          details: [
            '台灣商標先申請確認與註冊代辦',
            '專利與著作權侵權爭議應對',
            '金融商品與投資契約爭議訴訟',
            '品牌與設計保護策略諮詢',
          ]
        }
      ]
    },
    homeAttorney: {
      label: 'ABOUT',
      title: '曾俊瑋律師，韓國、台灣跨境法律的實務夥伴',
      summary: '具備 10+ 年實務經驗、豐富媒體採訪經歷與持續內容產出，提供以實際案例為核心的法律協助。',
      ctaLabel: '查看律師簡介'
    },
    homeResults: {
      label: 'RESULTS',
      title: '韓國學生健身房受傷案件，\n一審獲判 157 萬 TWD',
      description: '韓國大學生於台灣健身房在教練指導下受傷後提出損害賠償請求，一審取得 157 萬 TWD 判決。',
      summary: '本案整合事實證明、損害計算與訴訟策略，屬代表性實績案例。',
      ctaLabel: '查看更多案例'
    },
    updates: {
      label: 'PROFILE',
      title: '曾俊瑋 律師',
      tabs: [
        {
          id: 'education',
          label: '學歷',
          items: [
            {
              title: '國立台灣大學財務金融研究所 碩士',
              meta: '碩士',
              tag: '學歷',
              href: '/zh-hant/about'
            },
            {
              title: '國立政治大學金融系 學士',
              meta: '學士',
              tag: '學歷',
              href: '/zh-hant/about'
            },
            {
              title: '國立政治大學法律系 學士',
              meta: '學士',
              tag: '學歷',
              href: '/zh-hant/about'
            },
            {
              title: '日本神戶大學、早稻田大學交換聽講生',
              meta: '交換',
              tag: '學歷',
              href: '/zh-hant/about'
            }
          ]
        },
        {
          id: 'experience',
          label: '工作經歷',
          items: [
            {
              title: '趨勢法律事務所',
              meta: '經歷',
              tag: '經歷',
              href: '/zh-hant/about'
            },
            {
              title: '昊鼎國際法律事務所',
              meta: '經歷',
              tag: '經歷',
              href: '/zh-hant/about'
            },
            {
              title: '財團法人法律扶助基金會台中分會扶助律師',
              meta: '經歷',
              tag: '經歷',
              href: '/zh-hant/about'
            }
          ]
        },
        {
          id: 'practice',
          label: '執業領域',
          items: [
            {
              title: '在台投資及韓國、日本等涉外案件',
              meta: '涉外',
              tag: '執業',
              href: '/zh-hant/services#investment'
            },
            {
              title: '金融消費、保險理賠訴訟',
              meta: '金融',
              tag: '執業',
              href: '/zh-hant/services#finance'
            },
            {
              title: '不動產訴訟(買賣、租賃、都更、工程)',
              meta: '不動產',
              tag: '執業',
              href: '/zh-hant/services#real-estate'
            },
            {
              title: '智慧財產權訴訟(專利、商標、著作權)',
              meta: '智財',
              tag: '執業',
              href: '/zh-hant/services#ip'
            },
            {
              title: '一般刑事、民事、家事、勞資案件',
              meta: '一般',
              tag: '執業',
              href: '/zh-hant/services#labor'
            }
          ]
        }
      ]
    },
    caseGuides: {
      label: 'CASE GUIDES',
      title: '實務指南',
      description: '整理投資與訴訟流程的實務重點。',
      items: [
        {
          title: '在台投資與公司設立清單',
          summary: '公司設立前的準備事項與流程重點。',
          tag: '指南',
          href: '/zh-hant/services#investment'
        },
        {
          title: '簽證申請準備指引',
          summary: '所需文件與申請流程重點。',
          tag: '指南',
          href: '/zh-hant/services#investment'
        },
        {
          title: '商標/專利申請入門',
          summary: '智慧財產權保護的基本流程。',
          tag: '指南',
          href: '/zh-hant/services#ip'
        }
      ]
    },
    newsletters: {
      label: 'NEWSLETTER',
      title: '法律簡報',
      items: [
        {
          title: '投資法規簡報（準備中）',
          summary: '整理投資相關重點與注意事項。',
          date: '準備中',
          href: '/zh-hant/columns'
        },
        {
          title: '不動產/工程簡報（準備中）',
          summary: '整理不動產爭議的實務重點。',
          date: '準備中',
          href: '/zh-hant/columns'
        }
      ]
    },
    videos: {
      label: 'CHANNELS',
      title: '曾俊瑋律師公開頻道',
      description: '集中整理曾俊瑋律師的 YouTube、部落格、個人網站與官方簡介。',
      featured: {
        title: 'WEI Lawyer YouTube 頻道',
        duration: 'YouTube',
        href: 'https://www.youtube.com/@weilawyer',
        image: '/images/video-feature.svg'
      },
      items: [
        {
          title: 'Naver 部落格：台灣律師 曾俊瑋',
          duration: '部落格',
          href: 'https://blog.naver.com/wei_lawyer/223461663913',
          image: '/images/video-1.svg'
        },
        {
          title: '個人網頁：台灣律師 曾俊瑋',
          duration: '網站',
          href: 'https://www.wei-wei-lawyer.com/',
          image: '/images/video-2.svg'
        },
        {
          title: '昊鼎國際法律事務所',
          duration: '網站',
          href: 'https://www.hoveringlaw.com.tw/zh/wei.html',
          image: '/images/video-3.svg'
        },
        {
          title: '聯絡我們',
          duration: '聯絡',
          href: '/zh-hant/contact',
          image: '/images/video-4.svg'
        }
      ],
      cta: { label: '查看更多', href: '/zh-hant/videos' }
    },
    warning: {
      label: 'NOTICE',
      title: '防詐與冒名提醒',
      message: '若遇到疑似冒名或釣魚訊息，請勿開啟連結或檔案，並透過官方管道確認。',
      cta: { label: '查看聯絡方式', href: '/zh-hant/contact' }
    },
    quickContact: {
      buttonLabel: '開啟快速諮詢',
      panelTitle: '快速諮詢',
      actions: [
        { label: 'AI 諮詢', value: 'AI 協助初步引導', href: '#ai-consultation' },
        { label: '電子郵件', value: 'wei@hoveringlaw.com.tw', href: 'mailto:wei@hoveringlaw.com.tw' },
        { label: '電話 (韓國)', value: '+82-10-2992-9304', href: 'tel:+821029929304' },
      ],
      cta: { label: '諮詢頁面', href: '/zh-hant/contact' }
    },
    contact: {
      label: 'CONTACT',
      title: '聯絡與諮詢',
      description: '依照詢問類型提供聯絡方式。',
      inquiriesLabel: '詢問類型',
      inquiries: [
        {
          title: '商務/投資詢問',
          details: ['電話: +82-10-2992-9304', 'Email: wei@hoveringlaw.com.tw']
        },
        {
          title: '媒體詢問',
          details: [
            'Email: wei@hoveringlaw.com.tw',
            'KakaoTalk: 頻道諮詢',
            '來信標題請註明 [媒體詢問]'
          ]
        },
        {
          title: '招募詢問',
          details: [
            'Email: wei@hoveringlaw.com.tw',
            '電話: +82-10-2992-9304',
            '來信標題請註明 [招募詢問]'
          ]
        },
        {
          title: '一般詢問',
          details: ['Email: wei@hoveringlaw.com.tw']
        }
      ],
      locationsLabel: '事務所據點',
      locations: [
        {
          title: '台北所',
          details: [
            '台北市大同區承德路一段35號7樓之2'
          ]
        },
        {
          title: '台中所',
          details: [
            '臺中市北區館前路19號樓之1',
            'Tel: 04-2326-1862',
            'Fax: 04-2326-1863'
          ]
        },
        {
          title: '高雄所',
          details: [
            '高雄市左營區安吉街233號',
            'Tel: 07-557-9797'
          ]
        }
      ],
      cta: { label: '聯絡頁', href: '/zh-hant/contact' }
    },
    homeContactCta: {
      title: '台灣法律議題，立即諮詢。',
      description: '依案件類型安排投資、訴訟與公司設立諮詢流程。'
    },
    footer: {
      note: '深耕韓國、日本跨境法律事務，承辦台灣各地的法律顧問與爭議案件。',
      columns: [
        {
          title: '事務所',
          links: [
            { label: '事務所簡介', href: '/zh-hant/about' },
            { label: '律師介紹', href: '/zh-hant/lawyers' },
            { label: '預約諮詢', href: '/zh-hant/contact' }
          ]
        },
        {
          title: '主要服務',
          links: [
            { label: '台灣投資與公司設立', href: '/zh-hant/services#investment' },
            { label: '不動產與工程爭議', href: '/zh-hant/services#real-estate' },
            { label: '商標與智慧財產', href: '/zh-hant/services#ip' }
          ]
        },
        {
          title: '資料',
          links: [
            { label: '法律專欄', href: '/zh-hant/columns' },
            { label: '影音內容', href: '/zh-hant/videos' },
            { label: '常見問題', href: '/zh-hant/faq' }
          ]
        },
        {
          title: '常見主題',
          links: [
            { label: '台灣律師', href: '/zh-hant/taiwan-lawyer' },
            { label: '台灣公司設立', href: '/zh-hant/taiwan-company-setup-lawyer' },
            { label: '台灣訴訟', href: '/zh-hant/taiwan-litigation-lawyer' },
            { label: '台灣公司設立完整指南', href: '/zh-hant/guides/taiwan-company-setup' },
            { label: '會說韓文的台灣律師', href: '/zh-hant/korean-lawyer-in-taiwan' }
          ]
        }
      ],
      legal: '© 2026 昊鼎國際法律事務所. All rights reserved.'
    },
    search: {
      title: '搜尋',
      placeholder: '我們可以如何協助您？',
      tabs: [
        { id: 'services', label: '服務' },
        { id: 'insights', label: '洞見' },
        { id: 'videos', label: '影音' },
        { id: 'faq', label: 'FAQ' }
      ],
      suggestions: ['在台投資', '公司設立', '不動產訴訟', '智慧財產權', '勞資爭議']
    }
  }
};

function buildEnglishSiteContent(base: SiteContent): SiteContent {
  return {
    ...base,
    meta: {
      title: 'Hovering International Law Firm',
      description: 'Practical Taiwan legal support in English, Korean, and Japanese.'
    },
    nav: {
      ...base.nav,
      primary: [
        { label: 'Services', href: '/en/services' },
        { label: 'Lawyers', href: '/en/lawyers' },
        { label: 'Pricing', href: '/en/pricing' },
        { label: 'Columns', href: '/en/columns' },
        { label: 'Media Center', href: '/en/videos' },
        { label: 'Directions', href: '/en/contact#offices' }
      ],
      servicesMenu: {
        ...base.nav.servicesMenu,
        label: 'Services',
        categories: [
          { label: 'Taiwan Investment & Company Setup', href: '/en/services#investment' },
          { label: 'Visa Applications', href: '/en/services#investment' },
          { label: 'Trademark & Patent', href: '/en/services#ip' },
          { label: 'Legal Risk Review', href: '/en/services#investment' },
          { label: 'Tax Advisory', href: '/en/services#investment' },
          { label: 'Real Estate & Construction', href: '/en/services#real-estate' },
          { label: 'Finance & Insurance', href: '/en/services#finance' },
          { label: 'Labor / Criminal / Civil / Family', href: '/en/services#labor' }
        ],
        featured: [
          {
            title: 'End-to-End Support for Taiwan Investment and Litigation',
            description: 'From incorporation to dispute resolution, we provide practical support for international clients.',
            href: '/en/services'
          },
          {
            title: 'Multilingual Communication',
            description: 'We provide clear legal communication in Korean, Japanese, and English.',
            href: '/en/about'
          }
        ],
        topics: ['Taiwan Investment', 'Company Setup', 'Visa', 'Intellectual Property']
      },
      insightsMenu: {
        ...base.nav.insightsMenu,
        label: 'Columns',
        categories: [
          { label: 'Columns', href: '/en/columns' },
          { label: 'YouTube Channel', href: '/en/videos' },
          { label: 'FAQ', href: '/en/faq' },
          { label: 'Service Guide', href: '/en/services' },
          { label: 'Contact', href: '/en/contact' }
        ],
        featured: [
          {
            title: 'WEI Lawyer YouTube Channel',
            description: 'Explore practical Taiwan legal topics in video format.',
            href: '/en/videos'
          },
          {
            title: 'Blog & Columns',
            description: 'Browse legal insights and case-focused explanations.',
            href: '/en/columns'
          }
        ],
        topics: ['Columns', 'WEI Lawyer', 'Taiwan Law', 'Consultation Process']
      },
      cta: { label: 'Book Consultation', href: '/en/contact' },
      searchLabel: 'Search',
      languageLabel: 'Language'
    },
    hero: {
      ...base.hero,
      label: 'TAIWAN LEGAL',
      title: 'Taiwan Law, Clearly Explained.',
      subtitle:
        'Our multilingual legal team provides practical guidance for Taiwan investment, disputes, and cross-border matters.',
      typingPhrases: [
        'Start Your Taiwan Expansion with Confidence',
        'Practical Litigation Experience in Taiwan',
        'Multilingual Legal Support for International Clients',
        'Your Taiwan Legal Partner'
      ],
      searchPlaceholder: 'How can we help you?',
      searchButton: 'Search',
      keywordsLabel: 'Suggested Keywords',
      keywords: ['Taiwan Investment', 'Company Setup', 'Visa', 'Trademark & Patent', 'Real Estate Litigation', 'Labor Disputes'],
      quickLinksLabel: 'Quick Links',
      quickLinks: [
        { label: 'Services', href: '/en/services' },
        { label: 'Lawyers', href: '/en/lawyers' },
        { label: 'Columns', href: '/en/columns' },
        { label: 'Videos', href: '/en/videos' },
        { label: 'FAQ', href: '/en/faq' }
      ],
      secondaryLinks: [
        { label: 'View Services', href: '/en/services' },
        { label: 'Contact Us', href: '/en/contact' }
      ]
    },
    heroHighlights: {
      ...base.heroHighlights,
      label: 'Featured',
      items: [
        {
          title: 'Taiwan Investment & Company Setup',
          summary: 'From incorporation to visa and tax planning.',
          meta: 'Guide',
          href: '/en/services#investment',
          image: '/images/feature-1.svg'
        },
        {
          title: 'Real Estate & Construction Disputes',
          summary: 'Practical strategies for sales, lease, and construction conflicts.',
          meta: 'Guide',
          href: '/en/services#real-estate',
          image: '/images/feature-2.svg'
        },
        {
          title: 'Intellectual Property',
          summary: 'Trademark, patent, and copyright protection.',
          meta: 'Guide',
          href: '/en/services#ip',
          image: '/images/feature-3.svg'
        },
        {
          title: 'Labor / Criminal / Civil / Family',
          summary: 'Comprehensive dispute and litigation support.',
          meta: 'Guide',
          href: '/en/services#labor',
          image: '/images/feature-2.svg'
        }
      ]
    },
    achievements: {
      ...base.achievements,
      label: 'RESULTS',
      title: 'Representative Outcomes',
      items: [
        {
          title: 'Gym Injury Case',
          amount: 'TWD 1.57M',
          summary: 'Won damages in a gym injury case.',
          image: '/images/feature-1.svg',
          tag: 'Civil',
          href: '/en/columns'
        },
        {
          title: 'Medical Dispute',
          amount: 'TWD 3.0M',
          summary: 'Compensation awarded in a medical dispute.',
          image: '/images/feature-2.svg',
          tag: 'Medical',
          href: '/en/columns'
        },
        {
          title: 'Investment Loss Recovery',
          amount: 'Multi-million TWD',
          summary: 'Supported recovery in finance and investment disputes.',
          image: '/images/feature-3.svg',
          tag: 'Finance',
          href: '/en/columns'
        },
        {
          title: 'Medical Malpractice',
          amount: 'TWD 2.9M',
          summary: 'Handled malpractice damages claims.',
          image: '/images/feature-2.svg',
          tag: 'Medical',
          href: '/en/columns'
        },
        {
          title: 'Divorce Property Division',
          amount: 'TWD 6.0M',
          summary: 'Represented high-value family property claims.',
          image: '/images/feature-1.svg',
          tag: 'Family',
          href: '/en/columns'
        },
        {
          title: 'Cosmetics Trade Dispute',
          amount: 'TWD 0.3M',
          summary: 'Resolved a cosmetics-related commercial dispute.',
          image: '/images/feature-3.svg',
          tag: 'Commercial',
          href: '/en/columns'
        }
      ]
    },
    stats: {
      ...base.stats,
      label: 'ABOUT',
      title: 'A Clear Approach to Taiwan Legal Complexity',
      description:
        "The name 'Hovering' reflects both broad vision and stable foundations. We deliver one-stop support from investment and incorporation to litigation.",
      highlightWords: ['Investment', 'Incorporation', 'Litigation', 'One-stop'],
      items: [
        { target: 10, suffix: '+', label: 'Years of Experience' },
        { target: 500, suffix: '+', label: 'Matters Handled' },
        { target: 5, label: 'Office Locations' },
        { target: 4, label: 'Languages Supported' }
      ]
    },
    majorNews: {
      ...base.majorNews,
      label: 'MAJOR NEWS',
      title: 'Major Updates',
      items: [
        {
          title: 'Taiwan Investment & Incorporation Guide',
          summary: 'We support setup, visa applications, trademark/patent filing, and tax advisory.',
          date: 'Ongoing',
          tag: 'Guide',
          href: '/en/services#investment'
        },
        {
          title: 'Real Estate / Construction / Finance Disputes',
          summary: 'Litigation and dispute response for real estate, construction, finance, and insurance.',
          date: 'Ongoing',
          tag: 'Guide',
          href: '/en/services#real-estate'
        },
        {
          title: 'IP / Labor / Criminal / Civil / Family Matters',
          summary: 'Comprehensive handling across key litigation and advisory areas.',
          date: 'Ongoing',
          tag: 'Guide',
          href: '/en/services#ip'
        }
      ]
    },
    firmUpdates: {
      ...base.firmUpdates,
      label: 'UPDATES',
      title: 'Firm Updates',
      tabs: [
        {
          id: 'news',
          label: 'Notices',
          items: [
            {
              title: 'Taiwan Investment Consultation Guide',
              meta: 'Notice',
              tag: 'Notice',
              href: '/en/services#investment'
            },
            {
              title: 'Legal Consultation Process Overview',
              meta: 'Notice',
              tag: 'Notice',
              href: '/en/faq'
            }
          ]
        },
        {
          id: 'media',
          label: 'Media',
          items: [
            {
              title: 'Naver Blog: Taiwan Lawyer Wei Tseng',
              meta: 'Channel',
              tag: 'Media',
              href: 'https://blog.naver.com/wei_lawyer/223461663913'
            },
            {
              title: 'WEI Lawyer YouTube Channel',
              meta: 'Channel',
              tag: 'Media',
              href: 'https://www.youtube.com/@weilawyer'
            }
          ]
        },
        {
          id: 'seminar',
          label: 'Seminars',
          items: [
            {
              title: 'Seminar materials in preparation',
              meta: 'In Preparation',
              tag: 'Seminar',
              href: '/en/contact'
            }
          ]
        }
      ]
    },
    featured: {
      ...base.featured,
      label: 'FEATURED',
      title: 'Core Practice Areas',
      items: [
        {
          title: 'Taiwan Investment & Company Setup',
          summary: 'Complete support from company setup and visa to tax and compliance.',
          meta: 'Practice',
          tag: 'Investment / Advisory',
          href: '/en/services#investment',
          image: '/images/feature-1.svg'
        },
        {
          title: 'Real Estate / Construction / Finance Litigation',
          summary: 'Dispute resolution for real estate, construction, and finance matters.',
          meta: 'Litigation',
          tag: 'Disputes',
          href: '/en/services#real-estate',
          image: '/images/feature-2.svg'
        },
        {
          title: 'IP / Labor / Criminal / Civil / Family',
          summary: 'Broad support across contentious and advisory legal work.',
          meta: 'Litigation',
          tag: 'Specialized',
          href: '/en/services#ip',
          image: '/images/feature-3.svg'
        }
      ]
    },
    services: {
      ...base.services,
      label: 'SERVICES',
      title: 'Main Services',
      description: 'Structured support for investment, litigation, and advisory matters in Taiwan.',
      items: [
        {
          title: 'Investment & Incorporation',
          description: 'End-to-end support from entity structuring to approvals, banking, permits, and launch.',
          href: '/en/services#investment',
          details: [
            'Compare entity structures: subsidiary, branch, and limited company',
            'Investment Commission approval and application support',
            'Capital remittance, preparatory accounts, and conversion to operating accounts',
            'Advance review of zoning and permitted use for business premises',
            'Industry-specific permits, including cosmetics PIF and logistics licensing',
            'Lawful capital recovery through dissolution and liquidation'
          ],
          relatedColumns: [
            { title: 'Taiwan Company Setup Basics', slug: 'taiwan-company-establishment-basics' },
            { title: 'Subsidiary vs Branch', slug: 'taiwan-company-subsidiary-vs-branch' },
            { title: 'Advanced Guide 1: Visa & ARC', slug: 'taiwan-company-establishment-advanced-1' },
            { title: 'Advanced Guide 2: Capital & Accounts', slug: 'taiwan-company-establishment-advanced-2' },
            { title: 'Advanced Guide 3: Business Location', slug: 'taiwan-company-setup-pitch-location' },
            { title: 'Cosmetics Market Entry Guide', slug: 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide' },
            { title: 'Logistics Business Setup', slug: 'taiwan-logistics-business-setup' },
            { title: 'How to Recover Capital', slug: 'withdraw-capital-taiwan-company' }
          ]
        },
        {
          title: 'Civil Litigation & Damages',
          description: 'Contract disputes, tort claims, and consumer disputes with practical litigation strategy.',
          href: '/en/services#civil',
          details: [
            'Damages claims for personal injury and property loss',
            'Breach-of-contract and commercial dispute representation',
            'Consumer remedies and litigation against businesses',
            'Fault analysis and compensation claims after traffic accidents',
            'Korean-language litigation support for foreign clients'
          ],
          relatedColumns: [
            { title: 'Gym Injury Case (TWD 1.57M)', slug: 'taiwan-gym-injury-lawsuit' },
            { title: 'Traffic Accident Response', slug: 'taiwan-traffic-accident-procedure' },
            { title: 'Overtaking Accident Liability', slug: 'taiwan-overtaking-accident-liability' }
          ]
        },
        {
          title: 'Family Litigation',
          description: 'Divorce, property division, custody, and inheritance in cross-border family matters.',
          href: '/en/services#family',
          details: [
            'Divorce by agreement, including witness and household-registration requirements',
            'Representation in divorce mediation and court proceedings',
            'Parental rights, child custody, and visitation arrangements',
            'Taiwan inheritance shares for spouses and children',
            'Claims for distribution of remaining marital property'
          ],
          relatedColumns: [
            { title: 'Taiwan Divorce Litigation Q&A', slug: 'taiwan-divorce-lawsuit-qna' },
            { title: 'Inheritance & Custody Analysis', slug: 'taiwan-inheritance-custody-analysis' }
          ]
        },
        {
          title: 'Labor & Employment',
          description: 'Dismissal, severance, labor contracts, and workforce compliance in Taiwan.',
          href: '/en/services#labor',
          details: [
            'Severance calculations for economic dismissal',
            'Exceptions allowing severance after voluntary resignation',
            'Review of minimum service-period clauses',
            'Taiwan employment-law advice for Korean businesses'
          ],
          relatedColumns: [
            { title: 'Taiwan Severance Law', slug: 'taiwan-labor-severance-law' },
            { title: 'Voluntary Resignation Exceptions', slug: 'taiwan-voluntary-resignation-severance' },
            { title: 'Mandatory Employment Term Issues', slug: 'taiwan-mandatory-employment-period' }
          ]
        },
        {
          title: 'Criminal Litigation',
          description: 'Investigation-stage support, defense, victim representation, and regulatory risk checks.',
          href: '/en/services#criminal',
          details: [
            'Counsel and representation during criminal investigations',
            'Victim representation and criminal complaint procedures',
            'Advance assessment of regulatory and criminal exposure',
            'Korean-language interpretation support for foreign defendants'
          ]
        },
        {
          title: 'IP & Financial Disputes',
          description: 'Trademark, patent, and copyright strategy plus finance and investment disputes.',
          href: '/en/services#ip',
          details: [
            'Trademark clearance searches and Taiwan registration support',
            'Patent and copyright infringement disputes',
            'Litigation involving financial products and investment agreements',
            'Brand and design protection strategy'
          ]
        }
      ]
    },
    homeAttorney: {
      label: 'ABOUT',
      title: 'Attorney Wei Tseng, Taiwan Legal Partner for Korean Clients',
      summary: 'With 10+ years of practical experience, media appearances, and continuous legal content publishing, we focus on real case-driven support.',
      ctaLabel: 'View Lawyer Profile'
    },
    homeResults: {
      label: 'RESULTS',
      title: 'Korean Student Gym Injury Case,\nTWD 1.57M First-Instance Win',
      description: 'In a case where a Korean university student suffered a serious injury during trainer-guided exercise at a Taiwan gym, we pursued damages and obtained a TWD 1.57M ruling in first instance.',
      summary: 'This is a representative result built on integrated fact proof, damage calculation, negotiation, and litigation strategy.',
      ctaLabel: 'View More Case Results'
    },
    updates: {
      ...base.updates,
      label: 'PROFILE',
      title: 'Lawyer Wei Tseng Profile',
      tabs: [
        {
          id: 'education',
          label: 'Education',
          items: [
            {
              title: 'M.S. in Finance, National Taiwan University',
              meta: 'Master',
              tag: 'Education',
              href: '/en/about'
            },
            {
              title: 'B.A. in Law & Finance, National Chengchi University',
              meta: 'Bachelor',
              tag: 'Education',
              href: '/en/about'
            },
            {
              title: 'Exchange Programs at Kobe & Waseda University',
              meta: 'Exchange',
              tag: 'Education',
              href: '/en/about'
            }
          ]
        },
        {
          id: 'experience',
          label: 'Experience',
          items: [
            {
              title: 'Trend Law Office',
              meta: 'Experience',
              tag: 'Experience',
              href: '/en/about'
            },
            {
              title: 'Hovering International Law Firm',
              meta: 'Experience',
              tag: 'Experience',
              href: '/en/about'
            },
            {
              title: 'Legal Aid Foundation, Taichung Branch',
              meta: 'Experience',
              tag: 'Experience',
              href: '/en/about'
            }
          ]
        },
        {
          id: 'practice',
          label: 'Practice Areas',
          items: [
            {
              title: 'Taiwan investment and cross-border matters',
              meta: 'International',
              tag: 'Practice',
              href: '/en/services#investment'
            },
            {
              title: 'Financial consumer and insurance claims',
              meta: 'Finance',
              tag: 'Practice',
              href: '/en/services#finance'
            },
            {
              title: 'Real estate litigation (sale, lease, redevelopment, construction)',
              meta: 'Real Estate',
              tag: 'Practice',
              href: '/en/services#real-estate'
            },
            {
              title: 'IP litigation (patent, trademark, copyright)',
              meta: 'IP',
              tag: 'Practice',
              href: '/en/services#ip'
            },
            {
              title: 'General criminal, civil, family, and labor disputes',
              meta: 'General',
              tag: 'Practice',
              href: '/en/services#labor'
            }
          ]
        }
      ]
    },
    caseGuides: {
      ...base.caseGuides,
      label: 'CASE GUIDES',
      title: 'Practice Guides',
      description: 'Practical checklists and procedural guidance.',
      items: [
        {
          title: 'Taiwan Investment & Incorporation Checklist',
          summary: 'Key preparation points and process milestones before setup.',
          tag: 'Guide',
          href: '/en/services#investment'
        },
        {
          title: 'Visa Application Preparation Guide',
          summary: 'Required documents and process flow by visa type.',
          tag: 'Guide',
          href: '/en/services#investment'
        },
        {
          title: 'Trademark & Patent Filing Basics',
          summary: 'Core procedure for protecting intellectual property rights.',
          tag: 'Guide',
          href: '/en/services#ip'
        }
      ]
    },
    newsletters: {
      ...base.newsletters,
      label: 'NEWSLETTER',
      title: 'Legal Briefings',
      items: [
        {
          title: 'Taiwan Investment Legal Briefing (In Preparation)',
          summary: 'Key legal updates and structuring points for cross-border investment planning in Taiwan.',
          date: 'In Preparation',
          href: '/en/columns'
        },
        {
          title: 'Real Estate & Construction Legal Briefing (In Preparation)',
          summary: 'Practical dispute and compliance issues drawn from current Taiwan real estate matters.',
          date: 'In Preparation',
          href: '/en/columns'
        }
      ]
    },
    videos: {
      ...base.videos,
      label: 'CHANNELS',
      title: 'Attorney Wei Tseng Public Channels',
      description: 'Explore Wei Tseng’s YouTube, blog, personal website, and official firm profile from one page.',
      featured: {
        title: 'WEI Lawyer YouTube Channel',
        duration: 'YouTube',
        href: 'https://www.youtube.com/@weilawyer',
        image: '/images/video-feature.svg'
      },
      items: [
        {
          title: 'Naver Blog: Taiwan Lawyer Wei Tseng',
          duration: 'Blog',
          href: 'https://blog.naver.com/wei_lawyer/223461663913',
          image: '/images/video-1.svg'
        },
        {
          title: 'Personal Website: Taiwan Lawyer Wei Tseng',
          duration: 'Website',
          href: 'https://www.wei-wei-lawyer.com/',
          image: '/images/video-2.svg'
        },
        {
          title: 'Hovering International Law Firm',
          duration: 'Website',
          href: 'https://www.hoveringlaw.com.tw/en/wei.html',
          image: '/images/video-3.svg'
        },
        {
          title: 'Contact',
          duration: 'Contact',
          href: '/en/contact',
          image: '/images/video-4.svg'
        }
      ],
      cta: { label: 'Open Channel', href: '/en/videos' }
    },
    warning: {
      ...base.warning,
      label: 'NOTICE',
      title: 'Impersonation & Phishing Alert',
      message:
        'If you receive suspicious messages pretending to be our firm or lawyers, do not open links/files. Verify through official channels.',
      cta: { label: 'Check Contact Info', href: '/en/contact' }
    },
    quickContact: {
      ...base.quickContact,
      buttonLabel: 'Open Quick Consult',
      panelTitle: 'Quick Consult',
      actions: [
        { label: 'AI Consult', value: 'AI-assisted initial guidance', href: '#ai-consultation' },
        { label: 'Email', value: 'wei@hoveringlaw.com.tw', href: 'mailto:wei@hoveringlaw.com.tw' },
        { label: 'Phone (Korea)', value: '+82-10-2992-9304', href: 'tel:+821029929304' },
      ],
      cta: { label: 'Contact Page', href: '/en/contact' }
    },
    contact: {
      ...base.contact,
      label: 'CONTACT',
      title: 'Contact & Inquiry',
      description: 'Start with the right channel based on your inquiry type.',
      inquiriesLabel: 'Inquiry Types',
      inquiries: [
        {
          title: 'Business & Investment',
          details: ['Phone: +82-10-2992-9304', 'Email: wei@hoveringlaw.com.tw']
        },
        {
          title: 'Media Inquiry',
          details: [
            'Email: wei@hoveringlaw.com.tw',
            'KakaoTalk: Channel Chat',
            'Please use subject line [Media Inquiry]'
          ]
        },
        {
          title: 'Recruitment Inquiry',
          details: [
            'Email: wei@hoveringlaw.com.tw',
            'Phone: +82-10-2992-9304',
            'Please use subject line [Recruitment Inquiry]'
          ]
        },
        {
          title: 'General Inquiry',
          details: ['Email: wei@hoveringlaw.com.tw']
        }
      ],
      locationsLabel: 'Office Locations',
      locations: [
        {
          title: 'Taipei Office',
          details: ['7F-2, No. 35, Sec. 1, Chengde Rd., Datong Dist., Taipei City']
        },
        {
          title: 'Taichung Office',
          details: ['No. 19, Guanqian Rd., North Dist., Taichung City', 'Tel: 04-2326-1862', 'Fax: 04-2326-1863']
        },
        {
          title: 'Kaohsiung Office',
          details: ['No. 233, Anji St., Zuoying Dist., Kaohsiung City', 'Tel: 07-557-9797']
        }
      ],
      cta: { label: 'Contact Page', href: '/en/contact' }
    },
    homeContactCta: {
      title: 'Talk to us now about your Taiwan legal issue.',
      description: 'We quickly route business, litigation, and incorporation inquiries by case type.'
    },
    footer: {
      ...base.footer,
      note: 'Taiwan legal support for cross-border advisory work and disputes in Korean, Japanese, and English.',
      columns: [
        {
          title: 'Firm',
          links: [
            { label: 'About', href: '/en/about' },
            { label: 'Lawyers', href: '/en/lawyers' },
            { label: 'Consultation', href: '/en/contact' }
          ]
        },
        {
          title: 'Services',
          links: [
            { label: 'Investment & Company Setup', href: '/en/services#investment' },
            { label: 'Real Estate & Construction', href: '/en/services#real-estate' },
            { label: 'Trademarks & IP', href: '/en/services#ip' }
          ]
        },
        {
          title: 'Resources',
          links: [
            { label: 'Columns', href: '/en/columns' },
            { label: 'Videos', href: '/en/videos' },
            { label: 'Questions', href: '/en/faq' }
          ]
        },
        {
          title: 'Popular Topics',
          links: [
            { label: 'Taiwan Lawyer', href: '/en/taiwan-lawyer' },
            { label: 'Taiwan Company Setup', href: '/en/taiwan-company-setup-lawyer' },
            { label: 'Taiwan Litigation', href: '/en/taiwan-litigation-lawyer' },
            { label: 'Taiwan Company Setup Guide', href: '/en/guides/taiwan-company-setup' },
            { label: 'Korean-Speaking Taiwan Lawyer', href: '/en/korean-lawyer-in-taiwan' }
          ]
        }
      ],
      legal: '© 2026 Hovering International Law Firm. All rights reserved.'
    },
    search: {
      ...base.search,
      title: 'Search',
      placeholder: 'How can we help you?',
      tabs: [
        { id: 'services', label: 'Services' },
        { id: 'insights', label: 'Columns' },
        { id: 'videos', label: 'Videos' },
        { id: 'faq', label: 'FAQ' }
      ],
      suggestions: ['Taiwan Investment', 'Company Setup', 'Visa', 'Real Estate Litigation', 'Labor Disputes']
    }
  };
}

const englishSiteContent = buildEnglishSiteContent(baseSiteContent.ko);

function buildJapaneseSiteContent(base: SiteContent): SiteContent {
  return {
    ...base,
    meta: {
      title: '台湾弁護士・台湾訴訟・台湾会社設立',
      description:
        '台湾での会社設立、投資法務、民刑事訴訟について、韓国語・中国語・日本語で案内する昊鼎国際法律事務所の公式サイトです。'
    },
    nav: {
      ...base.nav,
      primary: [
        { label: '取扱業務', href: '/ja/services' },
        { label: '弁護士紹介', href: '/ja/lawyers' },
        { label: '費用案内', href: '/ja/pricing' },
        { label: 'コラム', href: '/ja/columns' },
        { label: 'メディアセンター', href: '/ja/videos' },
        { label: 'アクセス', href: '/ja/contact#offices' }
      ],
      servicesMenu: {
        ...base.nav.servicesMenu,
        label: '取扱業務',
        categories: [
          { label: '台湾投資・会社設立', href: '/ja/services#investment' },
          { label: 'ビザ申請', href: '/ja/services#investment' },
          { label: '商標・特許', href: '/ja/services#ip' },
          { label: '法的リスクレビュー', href: '/ja/services#investment' },
          { label: '税務相談', href: '/ja/services#investment' },
          { label: '不動産・建設', href: '/ja/services#real-estate' },
          { label: '金融・保険', href: '/ja/services#finance' },
          { label: '労使・刑事・民事・家事', href: '/ja/services#labor' }
        ],
        featured: [
          {
            title: '台湾投資と訴訟の一気通貫サポート',
            description: '会社設立から紛争解決まで、国際案件に実務的な支援を提供します。',
            href: '/ja/services'
          },
          {
            title: '多言語コミュニケーション',
            description: '韓国語・日本語・英語で分かりやすい法律コミュニケーションを行います。',
            href: '/ja/about'
          }
        ],
        topics: ['台湾投資', '会社設立', 'ビザ', '知的財産']
      },
      insightsMenu: {
        ...base.nav.insightsMenu,
        label: 'コラム',
        categories: [
          { label: 'コラム', href: '/ja/columns' },
          { label: 'YouTubeチャンネル', href: '/ja/videos' },
          { label: 'FAQ', href: '/ja/faq' },
          { label: 'サービス案内', href: '/ja/services' },
          { label: 'お問い合わせ', href: '/ja/contact' }
        ],
        featured: [
          {
            title: 'WEI Lawyer YouTubeチャンネル',
            description: '台湾法務の実務トピックを動画で解説します。',
            href: '/ja/videos'
          },
          {
            title: 'ブログ＆コラム',
            description: '法律解説と事例中心の記事をご覧いただけます。',
            href: '/ja/columns'
          }
        ],
        topics: ['コラム', 'WEI Lawyer', '台湾法', '相談の流れ']
      },
      cta: { label: '相談予約', href: '/ja/contact' },
      searchLabel: '検索',
      languageLabel: '言語'
    },
    hero: {
      ...base.hero,
      label: 'TAIWAN LEGAL',
      title: '台湾法を、分かりやすく。',
      subtitle:
        '多言語対応の法律チームが、台湾投資・紛争対応・クロスボーダー案件を実務的にサポートします。',
      typingPhrases: [
        '台湾進出を、確かな一歩から',
        '台湾訴訟の実務経験',
        '国際クライアント向け多言語法務',
        '台湾法務のパートナー'
      ],
      searchPlaceholder: 'どのようにお手伝いできますか？',
      searchButton: '検索',
      keywordsLabel: 'おすすめキーワード',
      keywords: ['台湾投資', '会社設立', 'ビザ', '商標・特許', '不動産訴訟', '労使紛争'],
      quickLinksLabel: 'クイックリンク',
      quickLinks: [
        { label: '取扱業務', href: '/ja/services' },
        { label: '弁護士', href: '/ja/lawyers' },
        { label: 'コラム', href: '/ja/columns' },
        { label: '動画', href: '/ja/videos' },
        { label: 'FAQ', href: '/ja/faq' }
      ],
      secondaryLinks: [
        { label: '取扱業務を見る', href: '/ja/services' },
        { label: 'お問い合わせ', href: '/ja/contact' }
      ]
    },
    heroHighlights: {
      ...base.heroHighlights,
      label: '注目コンテンツ',
      items: [
        {
          title: '台湾投資・会社設立',
          summary: '設立からビザ・税務計画まで。',
          meta: 'ガイド',
          href: '/ja/services#investment',
          image: '/images/feature-1.svg'
        },
        {
          title: '不動産・建設紛争',
          summary: '売買・賃貸・工事紛争への実務的対応。',
          meta: 'ガイド',
          href: '/ja/services#real-estate',
          image: '/images/feature-2.svg'
        },
        {
          title: '知的財産',
          summary: '商標・特許・著作権の保護。',
          meta: 'ガイド',
          href: '/ja/services#ip',
          image: '/images/feature-3.svg'
        },
        {
          title: '労使・刑事・民事・家事',
          summary: '紛争・訴訟の包括的サポート。',
          meta: 'ガイド',
          href: '/ja/services#labor',
          image: '/images/feature-2.svg'
        }
      ]
    },
    achievements: {
      ...base.achievements,
      label: 'RESULTS',
      title: '代表的な成果',
      items: [
        {
          title: 'ジム傷害事件',
          amount: 'TWD 1.57M',
          summary: 'ジムでの傷害事件で損害賠償を勝訴。',
          image: '/images/feature-1.svg',
          tag: '民事',
          href: '/ja/columns'
        },
        {
          title: '医療紛争',
          amount: 'TWD 3.0M',
          summary: '医療紛争で賠償判決を獲得。',
          image: '/images/feature-2.svg',
          tag: '医療',
          href: '/ja/columns'
        },
        {
          title: '投資損失の回収',
          amount: '数百万 TWD',
          summary: '金融・投資紛争での回収を支援。',
          image: '/images/feature-3.svg',
          tag: '金融',
          href: '/ja/columns'
        },
        {
          title: '医療過誤',
          amount: 'TWD 2.9M',
          summary: '医療過誤の損害賠償請求を担当。',
          image: '/images/feature-2.svg',
          tag: '医療',
          href: '/ja/columns'
        },
        {
          title: '離婚の財産分与',
          amount: 'TWD 6.0M',
          summary: '高額な家事財産分与請求を代理。',
          image: '/images/feature-1.svg',
          tag: '家事',
          href: '/ja/columns'
        },
        {
          title: '化粧品取引紛争',
          amount: 'TWD 0.3M',
          summary: '化粧品関連の商事紛争を解決。',
          image: '/images/feature-3.svg',
          tag: '商事',
          href: '/ja/columns'
        }
      ]
    },
    stats: {
      ...base.stats,
      label: 'ABOUT',
      title: '台湾法の複雑さを、明確に整理する',
      description:
        '「昊鼎」という名称は、広い視野と安定した基盤を表します。投資・会社設立から訴訟まで、ワンストップで支援します。',
      highlightWords: ['投資', '会社設立', '訴訟', 'ワンストップ'],
      items: [
        { target: 10, suffix: '+', label: '年の実務経験' },
        { target: 500, suffix: '+', label: '取扱案件' },
        { target: 5, label: 'オフィス拠点' },
        { target: 4, label: '対応言語' }
      ]
    },
    majorNews: {
      ...base.majorNews,
      label: 'MAJOR NEWS',
      title: '主要なお知らせ',
      items: [
        {
          title: '台湾投資・会社設立ガイド',
          summary: '設立、ビザ申請、商標・特許出願、税務相談まで支援します。',
          date: '常時',
          tag: 'ガイド',
          href: '/ja/services#investment'
        },
        {
          title: '不動産・建設・金融紛争',
          summary: '不動産、建設、金融・保険の紛争・訴訟対応。',
          date: '常時',
          tag: 'ガイド',
          href: '/ja/services#real-estate'
        },
        {
          title: '知財・労使・刑事・民事・家事',
          summary: '主要分野の訴訟・顧問を包括的に対応。',
          date: '常時',
          tag: 'ガイド',
          href: '/ja/services#ip'
        }
      ]
    },
    firmUpdates: {
      ...base.firmUpdates,
      label: 'UPDATES',
      title: '事務所アップデート',
      tabs: [
        {
          id: 'news',
          label: 'お知らせ',
          items: [
            {
              title: '台湾投資相談ガイド',
              meta: 'お知らせ',
              tag: 'お知らせ',
              href: '/ja/services#investment'
            },
            {
              title: '法律相談の流れ',
              meta: 'お知らせ',
              tag: 'お知らせ',
              href: '/ja/faq'
            }
          ]
        },
        {
          id: 'media',
          label: 'メディア',
          items: [
            {
              title: 'Naverブログ：台湾弁護士 曾俊瑋',
              meta: 'チャンネル',
              tag: 'メディア',
              href: 'https://blog.naver.com/wei_lawyer/223461663913'
            },
            {
              title: 'WEI Lawyer YouTubeチャンネル',
              meta: 'チャンネル',
              tag: 'メディア',
              href: 'https://www.youtube.com/@weilawyer'
            }
          ]
        },
        {
          id: 'seminar',
          label: 'セミナー',
          items: [
            {
              title: 'セミナー資料準備中',
              meta: '準備中',
              tag: 'セミナー',
              href: '/ja/contact'
            }
          ]
        }
      ]
    },
    featured: {
      ...base.featured,
      label: 'FEATURED',
      title: '主要取扱分野',
      items: [
        {
          title: '台湾投資・会社設立',
          summary: '会社設立・ビザから税務・コンプライアンスまで一貫支援。',
          meta: 'プラクティス',
          tag: '投資・顧問',
          href: '/ja/services#investment',
          image: '/images/feature-1.svg'
        },
        {
          title: '不動産・建設・金融訴訟',
          summary: '不動産、建設、金融案件の紛争解決。',
          meta: '訴訟',
          tag: '紛争',
          href: '/ja/services#real-estate',
          image: '/images/feature-2.svg'
        },
        {
          title: '知財・労使・刑事・民事・家事',
          summary: '争訟・顧問を幅広くカバー。',
          meta: '訴訟',
          tag: '専門分野',
          href: '/ja/services#ip',
          image: '/images/feature-3.svg'
        }
      ]
    },
    services: {
      ...base.services,
      label: 'SERVICES',
      title: '主要サービス',
      description: '台湾における投資・訴訟・顧問を体系的に支援します。',
      items: [
        {
          title: '投資・会社設立',
          description: '組織設計から許認可、銀行口座、各種許可、開業まで一気通貫で支援します。',
          href: '/ja/services#investment',
          details: [
            '子会社・支店・有限会社など組織形態の比較',
            '投資審議委員会（投審会）の承認・申請支援',
            '資本送金、準備口座、営業口座への転換',
            '事業所の用途・立地の事前確認',
            '化粧品PIFや物流許認可など業種別許可',
            '解散・清算による適法な資本回収'
          ],
          relatedColumns: [
            { title: '台湾会社設立の基本', slug: 'taiwan-company-establishment-basics' },
            { title: '子会社と支店の比較', slug: 'taiwan-company-subsidiary-vs-branch' },
            { title: '応用ガイド1：ビザとARC', slug: 'taiwan-company-establishment-advanced-1' },
            { title: '応用ガイド2：資本と口座', slug: 'taiwan-company-establishment-advanced-2' },
            { title: '応用ガイド3：事業所の所在地', slug: 'taiwan-company-setup-pitch-location' },
            { title: '化粧品市場参入ガイド', slug: 'taiwan-cosmetics-market-entry-company-setup-pif-registration-legal-sales-guide' },
            { title: '物流事業の設立', slug: 'taiwan-logistics-business-setup' },
            { title: '資本回収の方法', slug: 'withdraw-capital-taiwan-company' }
          ]
        },
        {
          title: '民事訴訟・損害賠償',
          description: '契約紛争、不法行為、消費者紛争に実務的な訴訟戦略で対応します。',
          href: '/ja/services#civil',
          details: [
            '人身・物的損害の損害賠償請求',
            '契約違反・商事紛争の代理',
            '消費者救済と事業者への訴訟',
            '交通事故後の過失分析と賠償請求',
            '外国人当事者向け多言語訴訟支援'
          ],
          relatedColumns: [
            { title: 'ジム傷害事件（TWD 1.57M）', slug: 'taiwan-gym-injury-lawsuit' },
            { title: '交通事故への対応', slug: 'taiwan-traffic-accident-procedure' },
            { title: '追越し事故の責任', slug: 'taiwan-overtaking-accident-liability' }
          ]
        },
        {
          title: '家事訴訟',
          description: '離婚、財産分与、親権、相続などクロスボーダー家事案件に対応します。',
          href: '/ja/services#family',
          details: [
            '協議離婚（証人・戸籍手続きを含む）',
            '離婚調停・裁判手続きの代理',
            '親権、監護、面会交流の調整',
            '配偶者・子の台湾相続分',
            '婚姻財産の残余分配請求'
          ],
          relatedColumns: [
            { title: '台湾離婚訴訟 Q&A', slug: 'taiwan-divorce-lawsuit-qna' },
            { title: '相続・監護の分析', slug: 'taiwan-inheritance-custody-analysis' }
          ]
        },
        {
          title: '労働・雇用',
          description: '解雇、退職金、労働契約、労務コンプライアンスを台湾法に沿って支援します。',
          href: '/ja/services#labor',
          details: [
            '経済的解雇における退職金の算定',
            '自己都合退職後も退職金が認められる例外',
            '最低服務期間条項のレビュー',
            '外国企業向け台湾労働法アドバイス'
          ],
          relatedColumns: [
            { title: '台湾の退職金制度', slug: 'taiwan-labor-severance-law' },
            { title: '自己都合退職の例外', slug: 'taiwan-voluntary-resignation-severance' },
            { title: '最低服務期間の問題', slug: 'taiwan-mandatory-employment-period' }
          ]
        },
        {
          title: '刑事訴訟',
          description: '捜査段階の支援、弁護、被害者代理、規制リスク確認を行います。',
          href: '/ja/services#criminal',
          details: [
            '刑事捜査段階の助言・代理',
            '被害者代理と刑事告訴手続き',
            '規制・刑事リスクの事前評価',
            '外国人被告人向け日本語通訳支援'
          ]
        },
        {
          title: '知財・金融紛争',
          description: '商標・特許・著作権戦略に加え、金融・投資紛争にも対応します。',
          href: '/ja/services#ip',
          details: [
            '商標クリアランス調査と台湾登録支援',
            '特許・著作権侵害紛争',
            '金融商品・投資契約に関する訴訟',
            'ブランド・デザイン保護戦略'
          ]
        }
      ]
    },
    homeAttorney: {
      label: 'ABOUT',
      title: '曾俊瑋弁護士——国際クライアントの台湾法パートナー',
      summary:
        '10年以上の実務経験、メディア出演、継続的な法律コンテンツ発信を通じて、実案中心の支援に注力しています。',
      ctaLabel: '弁護士プロフィールを見る'
    },
    homeResults: {
      label: 'RESULTS',
      title: '韓国人留学生ジム傷害事件、\n一審でTWD 1.57M勝訴',
      description:
        '台湾のジムでトレーナー指導下のトレーニング中に重傷を負った韓国人大学生の事件で、損害賠償を追及し、一審でTWD 1.57Mの判決を得ました。',
      summary: '事実立証、損害算定、交渉、訴訟戦略を一体で組み立てた代表的成果です。',
      ctaLabel: 'その他の実績を見る'
    },
    updates: {
      ...base.updates,
      label: 'PROFILE',
      title: '曾俊瑋弁護士プロフィール',
      tabs: [
        {
          id: 'education',
          label: '学歴',
          items: [
            {
              title: '国立台湾大学 金融学修士',
              meta: '修士',
              tag: '学歴',
              href: '/ja/about'
            },
            {
              title: '国立政治大学 法学・金融学士',
              meta: '学士',
              tag: '学歴',
              href: '/ja/about'
            },
            {
              title: '神戸大学・早稲田大学交換留学',
              meta: '交換留学',
              tag: '学歴',
              href: '/ja/about'
            }
          ]
        },
        {
          id: 'experience',
          label: '経歴',
          items: [
            {
              title: '趨勢法律事務所',
              meta: '経歴',
              tag: '経歴',
              href: '/ja/about'
            },
            {
              title: '昊鼎国際法律事務所',
              meta: '経歴',
              tag: '経歴',
              href: '/ja/about'
            },
            {
              title: '法律扶助基金会 台中分会',
              meta: '経歴',
              tag: '経歴',
              href: '/ja/about'
            }
          ]
        },
        {
          id: 'practice',
          label: '取扱分野',
          items: [
            {
              title: '台湾投資・クロスボーダー案件',
              meta: '国際',
              tag: '取扱',
              href: '/ja/services#investment'
            },
            {
              title: '金融消費者・保険請求',
              meta: '金融',
              tag: '取扱',
              href: '/ja/services#finance'
            },
            {
              title: '不動産訴訟（売買・賃貸・再開発・建設）',
              meta: '不動産',
              tag: '取扱',
              href: '/ja/services#real-estate'
            },
            {
              title: '知財訴訟（特許・商標・著作権）',
              meta: '知財',
              tag: '取扱',
              href: '/ja/services#ip'
            },
            {
              title: '刑事・民事・家事・労働の一般紛争',
              meta: '一般',
              tag: '取扱',
              href: '/ja/services#labor'
            }
          ]
        }
      ]
    },
    caseGuides: {
      ...base.caseGuides,
      label: 'CASE GUIDES',
      title: '実務ガイド',
      description: '実務チェックリストと手続きの案内。',
      items: [
        {
          title: '台湾投資・会社設立チェックリスト',
          summary: '設立前の準備ポイントと手続きの節目。',
          tag: 'ガイド',
          href: '/ja/services#investment'
        },
        {
          title: 'ビザ申請準備ガイド',
          summary: 'ビザ種別ごとの必要書類と手続きの流れ。',
          tag: 'ガイド',
          href: '/ja/services#investment'
        },
        {
          title: '商標・特許出願の基本',
          summary: '知的財産権保護の基本手続き。',
          tag: 'ガイド',
          href: '/ja/services#ip'
        }
      ]
    },
    newsletters: {
      ...base.newsletters,
      label: 'NEWSLETTER',
      title: '法律ブリーフィング',
      items: [
        {
          title: '台湾投資 法律ブリーフィング（準備中）',
          summary: '台湾へのクロスボーダー投資計画に関する法改正とストラクチャリングの要点。',
          date: '準備中',
          href: '/ja/columns'
        },
        {
          title: '不動産・建設 法律ブリーフィング（準備中）',
          summary: '台湾不動産実務から見た紛争・コンプライアンスの論点。',
          date: '準備中',
          href: '/ja/columns'
        }
      ]
    },
    videos: {
      ...base.videos,
      label: 'CHANNELS',
      title: '曾俊瑋弁護士の公開チャンネル',
      description: 'YouTube、ブログ、個人サイト、事務所公式プロフィールを一ページで確認できます。',
      featured: {
        title: 'WEI Lawyer YouTubeチャンネル',
        duration: 'YouTube',
        href: 'https://www.youtube.com/@weilawyer',
        image: '/images/video-feature.svg'
      },
      items: [
        {
          title: 'Naverブログ：台湾弁護士 曾俊瑋',
          duration: 'Blog',
          href: 'https://blog.naver.com/wei_lawyer/223461663913',
          image: '/images/video-1.svg'
        },
        {
          title: '個人サイト：台湾弁護士 曾俊瑋',
          duration: 'Website',
          href: 'https://www.wei-wei-lawyer.com/',
          image: '/images/video-2.svg'
        },
        {
          title: '昊鼎国際法律事務所',
          duration: 'Website',
          href: 'https://www.hoveringlaw.com.tw/en/wei.html',
          image: '/images/video-3.svg'
        },
        {
          title: 'お問い合わせ',
          duration: 'Contact',
          href: '/ja/contact',
          image: '/images/video-4.svg'
        }
      ],
      cta: { label: 'チャンネルを開く', href: '/ja/videos' }
    },
    warning: {
      ...base.warning,
      label: 'NOTICE',
      title: 'なりすまし・フィッシング注意',
      message:
        '当事務所や弁護士を装った不審なメッセージを受け取った場合は、リンクや添付ファイルを開かず、公式チャネルでご確認ください。',
      cta: { label: '連絡先を確認', href: '/ja/contact' }
    },
    quickContact: {
      ...base.quickContact,
      buttonLabel: 'クイック相談を開く',
      panelTitle: 'クイック相談',
      actions: [
        { label: 'AI相談', value: 'AIによる初期案内', href: '#ai-consultation' },
        { label: 'メール', value: 'wei@hoveringlaw.com.tw', href: 'mailto:wei@hoveringlaw.com.tw' },
        { label: '電話（韓国）', value: '+82-10-2992-9304', href: 'tel:+821029929304' }
      ],
      cta: { label: 'お問い合わせページ', href: '/ja/contact' }
    },
    contact: {
      ...base.contact,
      label: 'CONTACT',
      title: 'お問い合わせ',
      description: 'ご相談内容に応じた適切な窓口からご連絡ください。',
      inquiriesLabel: 'お問い合わせ種別',
      inquiries: [
        {
          title: 'ビジネス・投資',
          details: ['電話: +82-10-2992-9304', 'メール: wei@hoveringlaw.com.tw']
        },
        {
          title: 'メディア取材',
          details: [
            'メール: wei@hoveringlaw.com.tw',
            'KakaoTalk: チャネルチャット',
            '件名に【メディア取材】とご記入ください'
          ]
        },
        {
          title: '採用に関するお問い合わせ',
          details: [
            'メール: wei@hoveringlaw.com.tw',
            '電話: +82-10-2992-9304',
            '件名に【採用】とご記入ください'
          ]
        },
        {
          title: '一般のお問い合わせ',
          details: ['メール: wei@hoveringlaw.com.tw']
        }
      ],
      locationsLabel: 'オフィス所在地',
      locations: [
        {
          title: '台北オフィス',
          details: ['台北市大同区承徳路一段35号7F-2']
        },
        {
          title: '台中オフィス',
          details: ['台中市北区館前路19号', 'Tel: 04-2326-1862', 'Fax: 04-2326-1863']
        },
        {
          title: '高雄オフィス',
          details: ['高雄市左営区安吉街233号', 'Tel: 07-557-9797']
        }
      ],
      cta: { label: 'お問い合わせページ', href: '/ja/contact' }
    },
    homeContactCta: {
      title: '台湾の法律問題を、今すぐご相談ください。',
      description: 'ビジネス、訴訟、会社設立のご相談を案件種別に迅速に振り分けます。'
    },
    footer: {
      ...base.footer,
      note: '韓国語・日本語・英語で、台湾のクロスボーダー顧問と紛争対応を支援します。',
      columns: [
        {
          title: '事務所',
          links: [
            { label: '事務所紹介', href: '/ja/about' },
            { label: '弁護士', href: '/ja/lawyers' },
            { label: '相談', href: '/ja/contact' }
          ]
        },
        {
          title: '取扱業務',
          links: [
            { label: '投資・会社設立', href: '/ja/services#investment' },
            { label: '不動産・建設', href: '/ja/services#real-estate' },
            { label: '商標・知財', href: '/ja/services#ip' }
          ]
        },
        {
          title: 'リソース',
          links: [
            { label: 'コラム', href: '/ja/columns' },
            { label: '動画', href: '/ja/videos' },
            { label: 'よくある質問', href: '/ja/faq' }
          ]
        },
        {
          title: '人気トピック',
          links: [
            { label: '台湾弁護士', href: '/ja/taiwan-lawyer' },
            { label: '台湾会社設立', href: '/ja/taiwan-company-setup-lawyer' },
            { label: '台湾訴訟', href: '/ja/taiwan-litigation-lawyer' },
            { label: '台湾会社設立ガイド', href: '/ja/guides/taiwan-company-setup' },
            { label: '韓国語対応の台湾弁護士', href: '/ja/korean-lawyer-in-taiwan' }
          ]
        }
      ],
      legal: '© 2026 昊鼎国際法律事務所. All rights reserved.'
    },
    search: {
      ...base.search,
      title: '検索',
      placeholder: 'どのようにお手伝いできますか？',
      tabs: [
        { id: 'services', label: '取扱業務' },
        { id: 'insights', label: 'コラム' },
        { id: 'videos', label: '動画' },
        { id: 'faq', label: 'FAQ' }
      ],
      suggestions: ['台湾投資', '会社設立', 'ビザ', '不動産訴訟', '労使紛争']
    }
  };
}

const japaneseSiteContent = buildJapaneseSiteContent(baseSiteContent.ko);

export const siteContent: Record<import('@/lib/locales').SiteLocale, SiteContent> = {
  ...baseSiteContent,
  en: englishSiteContent,
  ja: japaneseSiteContent,
};
