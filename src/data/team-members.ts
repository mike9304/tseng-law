import type { Locale } from '@/lib/locales';

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  email: string;
  photo: string;
  sourceUrl: string;
  intro: string[];
  education: string[];
  experience: string[];
};

export type TeamContent = {
  label: string;
  title: string;
  description: string;
  story: string[];
  members: TeamMember[];
};

export const teamContent: Record<Locale, TeamContent> = {
  ko: {
    label: 'OUR TEAM',
    title: '호정 한국·대만 업무팀',
    description:
      '법무법인 호정의 변호사·사무장·회계사 프로필입니다.',
    story: [
      '법무법인 호정은 한국·일본 고객의 대만 투자, 소송, 법률 자문을 지원하는 통합 실무팀을 운영합니다.',
      '법률, 회계, 세무 및 행정 실무를 연결해 사건 초기 검토부터 분쟁 대응까지 일관된 전략을 제공합니다.',
    ],
    members: [
      {
        id: 'tseng-junwei',
        name: '증준외',
        role: '대표 변호사',
        email: 'wei@hoveringlaw.com.tw',
        photo: '/images/team/tseng-junwei.png',
        sourceUrl: 'https://www.wei-wei-lawyer.com/about-8',
        intro: [
          '기업·개인 사건을 폭넓게 수행하며, 한국어·일본어 상담이 가능합니다.',
          '한국 유학생 헬스장 손해배상 사건에서 157만 대만달러 배상 판결을 이끈 사례가 있습니다.',
        ],
        education: [
          '국립 타이완 대학교 재무금융연구소 석사',
          '국립 정치 대학교 법학과·금융학과 복수전공 학사',
          '일본 고베 대학교·와세다 대학교 교환 학생',
        ],
        experience: ['추세법률사무소', '법무법인 호정', '법률지원재단 타이중지부 지원 변호사'],
      },
      {
        id: 'chang-rongxuan',
        name: '장용선',
        role: '대만 변호사',
        email: 'jhc@hoveringlaw.com.tw',
        photo: '/images/team/chang-rongxuan.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외',
        intro: [
          '교육부 법제처 근무 경험을 바탕으로 행정쟁송·민사 사건을 수행합니다.',
          '대학·교원 권리 분쟁, 민원·소청 사건 대응 경험이 풍부합니다.',
        ],
        education: ['국립 중흥대학 법학과 학사'],
        experience: ['교육부 법제처 사무원', '법무법인 호정 변호사'],
      },
      {
        id: 'son-jungmin',
        name: '손정민',
        role: '한국 사무장',
        email: 'wei@hoveringlaw.com.tw',
        photo: '/images/team/son-jungmin.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외-1',
        intro: [
          '한국 고객 상담 일정 조율과 문의 응대를 담당합니다.',
          '컴퓨터공학 기반의 문서·업무 시스템 관리로 변호사팀과 고객 간 의사소통을 지원합니다.',
        ],
        education: ['국립 대만 성공대 컴퓨터학 학사'],
        experience: ['법무법인 호정 한국 업무팀'],
      },
      {
        id: 'huang-shengping',
        name: '황승평',
        role: '협력 회계사',
        email: 'joe700619@chixin.com.tw',
        photo: '/images/team/huang-shengping.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외-2',
        intro: [
          '정치대학교 회계학 학사·석사 과정을 수료했고 회계사무소를 운영하고 있습니다.',
          '법률·회계·세무 이슈를 함께 검토해 기업 고객의 실행 리스크를 줄이는 역할을 맡고 있습니다.',
        ],
        education: ['국립 대만정치대학교 회계학 석사', '국립 대만정치대학교 회계학 학사'],
        experience: ['근신연합 회계사무소'],
      },
    ],
  },
  'zh-hant': {
    label: 'OUR TEAM',
    title: '昊鼎 韓國·台灣 業務團隊',
    description: '昊鼎國際法律事務所律師、事務長及會計師簡介。',
    story: [
      '昊鼎提供韓文、日文溝通的在台法律服務，涵蓋公司設立、訴訟與合規顧問。',
      '團隊整合法律、會計與行政實務，可在同一流程處理跨領域問題。',
    ],
    members: [
      {
        id: 'tseng-junwei',
        name: '曾雋崴',
        role: '代表律師',
        email: 'wei@hoveringlaw.com.tw',
        photo: '/images/team/tseng-junwei.png',
        sourceUrl: 'https://www.wei-wei-lawyer.com/about-8',
        intro: [
          '專精企業與個人案件，提供韓文與日文法律溝通。',
          '曾代理韓國留學生健身傷害求償案，獲判新台幣 157 萬元。',
        ],
        education: [
          '國立臺灣大學財務金融研究所碩士',
          '國立政治大學法律學系與金融學系雙主修學士',
          '日本神戶大學、早稻田大學交換',
        ],
        experience: ['趨勢法律事務所', '昊鼎國際法律事務所', '法律扶助基金會台中分會扶助律師'],
      },
      {
        id: 'chang-rongxuan',
        name: '張容瑄',
        role: '台灣律師',
        email: 'jhc@hoveringlaw.com.tw',
        photo: '/images/team/chang-rongxuan.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외',
        intro: [
          '具教育部法制處經歷，專長行政爭訟與民事案件。',
          '熟悉校園與教師權益、陳情及申訴相關爭議處理。',
        ],
        education: ['國立中興大學法律學系學士'],
        experience: ['教育部法制處', '昊鼎國際法律事務所 律師'],
      },
      {
        id: 'son-jungmin',
        name: '孫貞旻',
        role: '韓國事務長',
        email: 'wei@hoveringlaw.com.tw',
        photo: '/images/team/son-jungmin.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외-1',
        intro: [
          '負責韓國客戶諮詢安排與需求對接。',
          '以資訊工程背景支援文件流程與跨語系溝通。',
        ],
        education: ['國立成功大學資訊相關學士'],
        experience: ['昊鼎國際法律事務所 韓國業務團隊'],
      },
      {
        id: 'huang-shengping',
        name: '黃勝平',
        role: '合作會計師',
        email: 'joe700619@chixin.com.tw',
        photo: '/images/team/huang-shengping.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외-2',
        intro: [
          '政大會計學士與碩士，現為會計師事務所負責人。',
          '協助整合法律、稅務與財務風險評估。',
        ],
        education: ['國立政治大學會計學碩士', '國立政治大學會計學學士'],
        experience: ['勤信聯合會計師事務所'],
      },
    ],
  },
  en: {
    label: 'OUR TEAM',
    title: 'Hovering Korea-Taiwan Legal Team',
    description: 'Profiles of Hovering lawyers, operations manager, and accounting partner.',
    story: [
      'Hovering runs an integrated practice team supporting Taiwan investment, litigation, and legal advisory for Korean and Japanese clients.',
      'By combining legal, accounting, tax, and operational workflows, we provide consistent strategy from initial review through dispute handling.'
    ],
    members: [
      {
        id: 'tseng-junwei',
        name: 'Wei Tseng',
        role: 'Managing Attorney',
        email: 'wei@hoveringlaw.com.tw',
        photo: '/images/team/tseng-junwei.png',
        sourceUrl: 'https://www.wei-wei-lawyer.com/about-8',
        intro: [
          'Handles a wide range of corporate and individual matters with Korean and Japanese consultation support.',
          'Represented a Korean student in a gym injury case and obtained a TWD 1.57M damages ruling.'
        ],
        education: [
          'M.S., Institute of Finance, National Taiwan University',
          'B.A. (Double Major), Law and Finance, National Chengchi University',
          'Exchange Student, Kobe University and Waseda University'
        ],
        experience: ['Trend Law Office', 'Hovering International Law Firm', 'Legal Aid Foundation, Taichung Branch']
      },
      {
        id: 'chang-rongxuan',
        name: 'Rongxuan Chang',
        role: 'Taiwan Attorney',
        email: 'jhc@hoveringlaw.com.tw',
        photo: '/images/team/chang-rongxuan.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외',
        intro: [
          'Formerly worked in the Ministry of Education legal affairs division, focusing on administrative and civil disputes.',
          'Experienced in university, faculty rights, and administrative complaint matters.'
        ],
        education: ['LL.B., National Chung Hsing University'],
        experience: ['Ministry of Education, Legal Affairs Division', 'Attorney, Hovering International Law Firm']
      },
      {
        id: 'son-jungmin',
        name: 'Jungmin Son',
        role: 'Korea Operations Manager',
        email: 'wei@hoveringlaw.com.tw',
        photo: '/images/team/son-jungmin.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외-1',
        intro: [
          'Coordinates consultation scheduling and communications for Korean clients.',
          'Supports cross-team communication with document and workflow systems based on a computer science background.'
        ],
        education: ['B.S., Computer Science, National Cheng Kung University'],
        experience: ['Korea Business Team, Hovering International Law Firm']
      },
      {
        id: 'huang-shengping',
        name: 'Shengping Huang',
        role: 'Partner CPA',
        email: 'joe700619@chixin.com.tw',
        photo: '/images/team/huang-shengping.jpg',
        sourceUrl: 'https://www.wei-wei-lawyer.com/복제-대표변호사-증준외-2',
        intro: [
          'Completed accounting B.A. and M.A. programs at NCCU and currently leads an accounting firm.',
          'Supports integrated legal, tax, and financial risk analysis for corporate clients.'
        ],
        education: ['M.A. in Accounting, National Chengchi University', 'B.A. in Accounting, National Chengchi University'],
        experience: ['Chinshin CPA Firm']
      }
    ]
  },
};
