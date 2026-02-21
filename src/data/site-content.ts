import type { Locale } from '@/lib/locales';

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
        { label: '고객후기', href: '/ko/reviews' }
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
          tag: 'Guide',
          href: '/ko/services#investment'
        },
        {
          title: '부동산·건설·금융 분쟁 대응',
          summary: '부동산, 건설, 금융·보험 관련 분쟁과 소송 대응을 안내합니다.',
          date: '상시',
          tag: 'Guide',
          href: '/ko/services#real-estate'
        },
        {
          title: '지적재산권·노사·형사/민사/가사',
          summary: '특허·상표·저작권 및 노사·형사·민사·가사 사건을 폭넓게 다룹니다.',
          date: '상시',
          tag: 'Guide',
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
              tag: 'Notice',
              href: '/ko/services#investment'
            },
            {
              title: '법률 자문 프로세스 안내',
              meta: '안내',
              tag: 'Notice',
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
              tag: 'Seminar',
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
          tag: 'Guide',
          href: '/ko/services#investment'
        },
        {
          title: '비자 신청 준비 가이드',
          summary: '필요 서류와 준비 흐름을 정리합니다.',
          tag: 'Guide',
          href: '/ko/services#investment'
        },
        {
          title: '상표·특허 출원 기본',
          summary: '지적재산권 보호를 위한 기본 절차를 안내합니다.',
          tag: 'Guide',
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
      title: '영상 및 외부 채널',
      description: '유튜브 채널과 블로그 등 외부 채널을 안내합니다.',
      featured: {
        title: 'WEI Lawyer 유튜브 채널',
        duration: 'YouTube',
        href: 'https://www.youtube.com/@weilawyer',
        image: '/images/video-feature.svg'
      },
      items: [
        {
          title: '네이버 블로그: 대만변호사 증준외',
          duration: 'Blog',
          href: 'https://blog.naver.com/wei_lawyer/223461663913',
          image: '/images/video-1.svg'
        },
        {
          title: '개인 사이트: 대만변호사 증준외',
          duration: 'Website',
          href: 'https://www.wei-wei-lawyer.com/',
          image: '/images/video-2.svg'
        },
        {
          title: '법무법인 호정',
          duration: 'Website',
          href: 'https://www.hoveringlaw.com.tw/kr/wei.html',
          image: '/images/video-3.svg'
        },
        {
          title: '연락처 안내',
          duration: 'Contact',
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
        { label: '전화', value: '+82-10-2992-9304', href: 'tel:+821029929304' },
        { label: '카카오톡', value: '채널 상담', href: 'https://pf.kakao.com/_hojeong/chat' },
        { label: 'LINE', value: 'LINE 상담', href: 'https://lin.ee/hojeong' },
        { label: '이메일', value: 'wei@hoveringlaw.com.tw', href: 'mailto:wei@hoveringlaw.com.tw' }
      ],
      cta: { label: '상담 예약', href: '/ko/contact' }
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
            'Tel: 04-2326-1862',
            'Fax: 04-2326-1863'
          ]
        },
        {
          title: '타이베이 사무소',
          details: [
            '台北市大同區承德路一段35號7樓之2',
            'Tel: 04-2326-1862',
            'Fax: 04-2326-1863'
          ]
        }
      ],
      cta: { label: '문의 페이지', href: '/ko/contact' }
    },
    footer: {
      note: '한국어·일본어 상담 및 대만 전역 사건 지원.',
      columns: [
        {
          title: '법인',
          links: [
            { label: '법인소개', href: '/ko/about' },
            { label: '변호사', href: '/ko/lawyers' },
            { label: '연락처', href: '/ko/contact' }
          ]
        },
        {
          title: '업무',
          links: [
            { label: '대만 투자', href: '/ko/services#investment' },
            { label: '부동산·건설', href: '/ko/services#real-estate' },
            { label: '지적재산권', href: '/ko/services#ip' }
          ]
        },
        {
          title: '콘텐츠',
          links: [
            { label: '칼럼', href: '/ko/columns' },
            { label: '영상', href: '/ko/videos' },
            { label: 'FAQ', href: '/ko/faq' }
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
      description: '精通韓語、日語，提供台灣法律專業協助。'
    },
    nav: {
      primary: [
        { label: '服務領域', href: '/zh-hant/services' },
        { label: '律師介紹', href: '/zh-hant/lawyers' },
        { label: '收費標準', href: '/zh-hant/pricing' },
        { label: '昊鼎專欄', href: '/zh-hant/columns' },
        { label: '媒體中心', href: '/zh-hant/videos' },
        { label: '客戶評價', href: '/zh-hant/reviews' }
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
            description: '為韓國、日本客戶提供在台投資及訴訟支援。',
            href: '/zh-hant/services'
          },
          {
            title: '韓語、日語溝通',
            description: '以韓語與日語清楚說明法律重點。',
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
      title: '以韓語清楚說明台灣法律。',
      subtitle: '精通韓語、日語的團隊協助處理台灣法律議題。',
      typingPhrases: [
        '台灣投資與公司設立起點',
        '台灣訴訟與實務經驗',
        '台灣唯一韓語法律服務',
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
        "「昊」代表廣闊視野，「鼎」代表穩健基礎。憑藉韓語與日語溝通能力，從投資、公司設立到訴訟提供一站式法律支援。",
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
          tag: 'Guide',
          href: '/zh-hant/services#investment'
        },
        {
          title: '不動產/工程/金融爭議處理',
          summary: '不動產、工程與金融保險相關訴訟與爭議應對。',
          date: '常設',
          tag: 'Guide',
          href: '/zh-hant/services#real-estate'
        },
        {
          title: '智慧財產與勞資、刑民家事',
          summary: '涵蓋專利、商標、著作權與勞資、刑民家事案件。',
          date: '常設',
          tag: 'Guide',
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
              tag: 'Notice',
              href: '/zh-hant/services#investment'
            },
            {
              title: '法律顧問流程說明',
              meta: '說明',
              tag: 'Notice',
              href: '/zh-hant/faq'
            }
          ]
        },
        {
          id: 'media',
          label: '媒體',
          items: [
            {
              title: 'Naver 部落格：대만변호사 증준외',
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
              tag: 'Seminar',
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
            '子公司 vs 分公司 vs 有限公司型態比較',
            '投審會核准程序代辦',
            '資本額匯入、籌備帳戶與正式帳戶轉換',
            '營業場所土地使用分區預先確認',
            '特殊行業許可：化妝品（PIF）、物流（運輸執照）等',
            '解散清算程序與合法資本回收',
          ],
          relatedColumns: [
            { title: '台灣公司設立基礎篇', slug: 'taiwan-company-establishment-basics' },
            { title: '子公司 VS 分公司', slug: 'taiwan-company-subsidiary-vs-branch' },
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
          tag: 'Guide',
          href: '/zh-hant/services#investment'
        },
        {
          title: '簽證申請準備指引',
          summary: '所需文件與申請流程重點。',
          tag: 'Guide',
          href: '/zh-hant/services#investment'
        },
        {
          title: '商標/專利申請入門',
          summary: '智慧財產權保護的基本流程。',
          tag: 'Guide',
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
      title: '影音與外部平台',
      description: '提供 YouTube 與部落格等外部連結。',
      featured: {
        title: 'WEI Lawyer YouTube 頻道',
        duration: 'YouTube',
        href: 'https://www.youtube.com/@weilawyer',
        image: '/images/video-feature.svg'
      },
      items: [
        {
          title: 'Naver 部落格：대만변호사 증준외',
          duration: 'Blog',
          href: 'https://blog.naver.com/wei_lawyer/223461663913',
          image: '/images/video-1.svg'
        },
        {
          title: '個人網頁：台灣律師 曾俊瑋',
          duration: 'Website',
          href: 'https://www.wei-wei-lawyer.com/',
          image: '/images/video-2.svg'
        },
        {
          title: '昊鼎國際法律事務所',
          duration: 'Website',
          href: 'https://www.hoveringlaw.com.tw/zh/wei.html',
          image: '/images/video-3.svg'
        },
        {
          title: '聯絡我們',
          duration: 'Contact',
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
        { label: '電話', value: '+82-10-2992-9304', href: 'tel:+821029929304' },
        { label: 'LINE', value: 'LINE 諮詢', href: 'https://lin.ee/hojeong' },
        { label: 'KakaoTalk', value: 'KakaoTalk 諮詢', href: 'https://pf.kakao.com/_hojeong/chat' },
        { label: '電子郵件', value: 'wei@hoveringlaw.com.tw', href: 'mailto:wei@hoveringlaw.com.tw' }
      ],
      cta: { label: '預約諮詢', href: '/zh-hant/contact' }
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
            'Tel: 04-2326-1862',
            'Fax: 04-2326-1863'
          ]
        },
        {
          title: '台北所',
          details: [
            '台北市大同區承德路一段35號7樓之2',
            'Tel: 04-2326-1862',
            'Fax: 04-2326-1863'
          ]
        }
      ],
      cta: { label: '聯絡頁', href: '/zh-hant/contact' }
    },
    footer: {
      note: '提供韓語、日語諮詢，服務台灣全境案件。',
      columns: [
        {
          title: '事務所',
          links: [
            { label: '事務所介紹', href: '/zh-hant/about' },
            { label: '律師', href: '/zh-hant/lawyers' },
            { label: '聯絡', href: '/zh-hant/contact' }
          ]
        },
        {
          title: '服務',
          links: [
            { label: '在台投資', href: '/zh-hant/services#investment' },
            { label: '不動產/工程', href: '/zh-hant/services#real-estate' },
            { label: '智慧財產權', href: '/zh-hant/services#ip' }
          ]
        },
        {
          title: '內容',
          links: [
            { label: '洞見', href: '/zh-hant/columns' },
            { label: '影音', href: '/zh-hant/videos' },
            { label: 'FAQ', href: '/zh-hant/faq' }
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
        { label: 'Reviews', href: '/en/reviews' }
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
      highlightWords: ['Investment', 'Incorporation', 'Litigation', 'One-stop']
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
              meta: 'Pending',
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
          relatedColumns: [
            { title: 'Taiwan Divorce Litigation Q&A', slug: 'taiwan-divorce-lawsuit-qna' },
            { title: 'Inheritance & Custody Analysis', slug: 'taiwan-inheritance-custody-analysis' }
          ]
        },
        {
          title: 'Labor & Employment',
          description: 'Dismissal, severance, labor contracts, and workforce compliance in Taiwan.',
          href: '/en/services#labor',
          relatedColumns: [
            { title: 'Taiwan Severance Law', slug: 'taiwan-labor-severance-law' },
            { title: 'Voluntary Resignation Exceptions', slug: 'taiwan-voluntary-resignation-severance' },
            { title: 'Mandatory Employment Term Issues', slug: 'taiwan-mandatory-employment-period' }
          ]
        },
        {
          title: 'Criminal Litigation',
          description: 'Investigation-stage support, defense, victim representation, and regulatory risk checks.',
          href: '/en/services#criminal'
        },
        {
          title: 'IP & Financial Disputes',
          description: 'Trademark, patent, and copyright strategy plus finance and investment disputes.',
          href: '/en/services#ip'
        }
      ]
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
          title: 'Taiwan Investment Briefing (Coming Soon)',
          summary: 'Practical updates for cross-border investment planning.',
          date: 'Coming Soon',
          href: '/en/columns'
        },
        {
          title: 'Real Estate & Construction Briefing (Coming Soon)',
          summary: 'Core legal points from current real estate disputes.',
          date: 'Coming Soon',
          href: '/en/columns'
        }
      ]
    },
    videos: {
      ...base.videos,
      label: 'CHANNELS',
      title: 'Videos & External Channels',
      description: 'Explore legal explainers via YouTube, blog, and website channels.',
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
          href: 'https://www.hoveringlaw.com.tw/kr/wei.html',
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
        { label: 'Phone (Korea)', value: '+82-10-2992-9304', href: 'tel:+821029929304' },
        { label: 'KakaoTalk', value: 'Channel Chat', href: 'https://pf.kakao.com/_hojeong/chat' },
        { label: 'LINE', value: 'LINE Chat', href: 'https://lin.ee/hojeong' },
        { label: 'Email', value: 'wei@hoveringlaw.com.tw', href: 'mailto:wei@hoveringlaw.com.tw' }
      ],
      cta: { label: 'Book Consultation', href: '/en/contact' }
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
          title: 'Taichung Office',
          details: ['臺中市北區館前路19號樓之1', 'Tel: 04-2326-1862', 'Fax: 04-2326-1863']
        },
        {
          title: 'Kaohsiung Office',
          details: ['高雄市左營區安吉街233號', 'Tel: 07-557-9797']
        },
        {
          title: 'Taipei Office',
          details: ['台北市大同區承德路一段35號7樓之2', 'Tel: 04-2326-1862', 'Fax: 04-2326-1863']
        }
      ],
      cta: { label: 'Contact Page', href: '/en/contact' }
    },
    footer: {
      ...base.footer,
      note: 'Consultation in Korean, Japanese, and English for Taiwan-wide legal matters.',
      columns: [
        {
          title: 'Firm',
          links: [
            { label: 'About', href: '/en/about' },
            { label: 'Lawyers', href: '/en/lawyers' },
            { label: 'Contact', href: '/en/contact' }
          ]
        },
        {
          title: 'Services',
          links: [
            { label: 'Taiwan Investment', href: '/en/services#investment' },
            { label: 'Real Estate & Construction', href: '/en/services#real-estate' },
            { label: 'Intellectual Property', href: '/en/services#ip' }
          ]
        },
        {
          title: 'Content',
          links: [
            { label: 'Columns', href: '/en/columns' },
            { label: 'Videos', href: '/en/videos' },
            { label: 'FAQ', href: '/en/faq' }
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

export const siteContent: Record<Locale, SiteContent> = {
  ...baseSiteContent,
  en: buildEnglishSiteContent(baseSiteContent.ko)
};
