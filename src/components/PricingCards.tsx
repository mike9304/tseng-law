import type { Locale } from '@/lib/locales';
import Link from 'next/link';
import PricingIcon, { type PricingIconName } from '@/components/PricingIcon';

type PricingItem = {
  icon: PricingIconName;
  title: string;
  price: string;
  unit: string;
  details: string[];
  note?: string;
  highlighted?: boolean;
};

type PricingContent = {
  currency: string;
  items: PricingItem[];
  disclaimer: string;
  ctaLabel: string;
  ctaHref: string;
};

const pricingData: Record<Locale, PricingContent> = {
  ko: {
    currency: 'NTD (대만달러)',
    items: [
      {
        icon: 'consultation',
        title: '일반 법률상담',
        price: 'NT$ 3,000',
        unit: '/ 1시간',
        details: [
          '대면 또는 화상 상담',
          '한국어·중국어 상담 가능',
          '법률 이슈 분석 및 방향 제시',
          '사전 예약 필수'
        ]
      },
      {
        icon: 'litigation',
        title: '민사·형사 소송',
        price: '견적 문의',
        unit: '',
        details: [
          '민사소송 (손해배상, 계약분쟁 등)',
          '형사소송 (고소, 변호)',
          '사건 유형·복합성에 따라 비용 상이',
          '정확한 견적은 상담 후 안내'
        ],
        note: '사건 내용을 확인한 후 견적을 안내드립니다. 먼저 상담을 예약해 주세요.',
        highlighted: true
      },
      {
        icon: 'company',
        title: '대만 법인설립',
        price: 'NT$ 50,000',
        unit: '',
        details: [
          '자본금 400만 NTD 이하 기준',
          '단일 주주 기준',
          '투자 허가 + 법인 등기 + 사업자 등록 포함',
          '은행 동행 시 추가 비용 발생',
          '거류증(ARC) 발급 대행 시 추가 비용 발생'
        ],
        note: '자본금 초과·복수 주주·특수 법인(지사, 합자 등)은 별도 견적 문의가 필요합니다.'
      },
      {
        icon: 'retainer',
        title: '연간 법률고문',
        price: 'NT$ 50,000',
        unit: '/ 1년',
        details: [
          '상시 법률 자문 서비스',
          '계약서 검토 및 리스크 분석',
          '노동법·상법 관련 상시 자문',
          '월별 분납 상담 가능'
        ]
      }
    ],
    disclaimer:
      '상기 비용은 기본 기준이며, 사건의 특성·복합성·긴급도에 따라 변동될 수 있습니다. 정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다.',
    ctaLabel: '상담 예약하기',
    ctaHref: '/ko/contact'
  },
  'zh-hant': {
    currency: 'NTD (新台幣)',
    items: [
      {
        icon: 'consultation',
        title: '一般法律諮詢',
        price: 'NT$ 3,000',
        unit: '/ 1小時',
        details: [
          '面談或視訊諮詢',
          '韓語·中文諮詢皆可',
          '法律問題分析與方向建議',
          '須事先預約'
        ]
      },
      {
        icon: 'litigation',
        title: '民事·刑事訴訟',
        price: '報價諮詢',
        unit: '',
        details: [
          '民事訴訟（損害賠償、合約糾紛等）',
          '刑事訴訟（告訴、辯護）',
          '依案件類型與複雜度費用有所不同',
          '確切報價於諮詢後提供'
        ],
        note: '確認案件內容後提供報價，請先預約諮詢。',
        highlighted: true
      },
      {
        icon: 'company',
        title: '台灣公司設立',
        price: 'NT$ 50,000',
        unit: '',
        details: [
          '資本額 400萬 NTD 以下',
          '單一股東',
          '含投資許可 + 公司登記 + 營業登記',
          '銀行陪同另計費用',
          '居留證（ARC）代辦另計費用'
        ],
        note: '資本額超過、多位股東或特殊法人（分公司、合資等）需另行詢價。'
      },
      {
        icon: 'retainer',
        title: '年度法律顧問',
        price: 'NT$ 50,000',
        unit: '/ 1年',
        details: [
          '常態法律諮詢服務',
          '合約審閱與風險分析',
          '勞動法·商法相關常態顧問',
          '可商議按月分期付款'
        ]
      }
    ],
    disclaimer:
      '以上費用為基本標準，依案件特性、複雜度及急迫程度可能有所調整。確切費用於初次諮詢後以書面報價方式提供。',
    ctaLabel: '預約諮詢',
    ctaHref: '/zh-hant/contact'
  },
  en: {
    currency: 'NTD (New Taiwan Dollar)',
    items: [
      {
        icon: 'consultation',
        title: 'General Legal Consultation',
        price: 'NT$ 3,000',
        unit: '/ 1 hour',
        details: [
          'In-person or video consultation',
          'Available in Korean & Chinese',
          'Legal issue analysis & guidance',
          'Appointment required'
        ]
      },
      {
        icon: 'litigation',
        title: 'Civil & Criminal Litigation',
        price: 'Request a Quote',
        unit: '',
        details: [
          'Civil litigation (damages, contract disputes, etc.)',
          'Criminal litigation (complaints, defense)',
          'Fees vary by case type and complexity',
          'Exact quote provided after consultation'
        ],
        note: 'We provide a quote after reviewing your case. Please book a consultation first.',
        highlighted: true
      },
      {
        icon: 'company',
        title: 'Taiwan Company Setup',
        price: 'NT$ 50,000',
        unit: '',
        details: [
          'Capital under NTD 4 million',
          'Single shareholder',
          'Includes investment permit + registration + business license',
          'Bank accompaniment: additional fee',
          'ARC (residence permit) processing: additional fee'
        ],
        note: 'Higher capital, multiple shareholders, or special entities (branch, JV, etc.) require a separate quote.'
      },
      {
        icon: 'retainer',
        title: 'Annual Legal Retainer',
        price: 'NT$ 50,000',
        unit: '/ 1 year',
        details: [
          'Ongoing legal advisory service',
          'Contract review & risk analysis',
          'Labor & commercial law counsel',
          'Monthly installment available'
        ]
      }
    ],
    disclaimer:
      'Fees above are baseline standards and may vary based on case characteristics, complexity, and urgency. Exact fees will be provided in writing after the initial consultation.',
    ctaLabel: 'Book a Consultation',
    ctaHref: '/en/contact'
  }
};

export default function PricingCards({ locale }: { locale: Locale }) {
  const data = pricingData[locale];

  return (
    <section className="section pricing-section">
      <div className="container">
        <p className="pricing-currency">{data.currency}</p>

        <div className="pricing-grid">
          {data.items.map((item) => (
            <div key={item.title} className={`card pricing-card${item.highlighted ? ' pricing-card--highlight' : ''}`}>
              <div className="pricing-card-icon" aria-hidden>
                <PricingIcon name={item.icon} />
              </div>
              <h3 className="pricing-card-title">{item.title}</h3>
              <div className="pricing-card-price">
                <span className="pricing-amount">{item.price}</span>
                {item.unit && <span className="pricing-unit">{item.unit}</span>}
              </div>
              <ul className="pricing-card-details">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              {item.note && <p className="pricing-card-note">{item.note}</p>}
            </div>
          ))}
        </div>

        <div className="pricing-disclaimer">
          <p>{data.disclaimer}</p>
        </div>

        <div className="pricing-cta">
          <Link href={data.ctaHref} className="button">
            {data.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
