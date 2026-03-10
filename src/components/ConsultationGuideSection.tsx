import type { Locale } from '@/lib/locales';
import SectionLabel from '@/components/SectionLabel';
import OrnamentDivider from '@/components/OrnamentDivider';

const guideCopy = {
  ko: {
    label: 'GUIDE',
    title: '상담 전 확인 사항',
    description: '문의 채널과 준비 자료를 미리 확인하면 상담 연결과 답변 정리가 더 빨라집니다.',
    cards: [
      {
        title: '가능한 상담 채널',
        items: [
          '카카오톡, LINE, 이메일, 전화로 문의를 접수할 수 있습니다.',
          '타이베이 대면 상담과 Zoom 또는 Google Meet 화상 상담이 가능합니다.',
          '한국어, 중국어, 영어 기준으로 기본 상담 흐름을 안내합니다.',
        ],
      },
      {
        title: '미리 준비하면 좋은 자료',
        items: [
          '계약서, 견적서, 공문, 이메일, 메신저 대화 등 핵심 문서',
          '회사명 또는 당사자 정보, 사건 발생일, 현재 진행 상태',
          '사진, 영상, 판결문, 신고서 등 사실관계를 보여주는 자료',
        ],
      },
      {
        title: '상담 진행 흐름',
        items: [
          '문의 접수 후 사건 유형과 긴급도를 먼저 확인합니다.',
          '필요한 경우 추가 자료를 요청하고 상담 방식을 안내합니다.',
          '예약 확정 후 변호사 또는 실무팀과 상담을 진행합니다.',
        ],
      },
    ],
  },
  'zh-hant': {
    label: 'GUIDE',
    title: '諮詢前可先確認的事項',
    description: '先整理聯絡方式與案件資料，可讓諮詢安排與後續回覆更有效率。',
    cards: [
      {
        title: '可使用的聯絡方式',
        items: [
          '可透過 KakaoTalk、LINE、電子郵件與電話提出詢問。',
          '提供台北面談，以及 Zoom 或 Google Meet 視訊諮詢。',
          '以韓文、中文、英文為主進行基本諮詢安排。',
        ],
      },
      {
        title: '建議先準備的資料',
        items: [
          '契約、報價單、公文、電子郵件與訊息紀錄等核心文件',
          '公司名稱或當事人資訊、事件發生時間、目前進度',
          '照片、影片、判決、申報文件等可佐證事實的資料',
        ],
      },
      {
        title: '諮詢流程',
        items: [
          '收到詢問後，先確認案件類型與急迫程度。',
          '如有需要，會請您補充資料並安排適合的諮詢方式。',
          '預約確認後，再由律師或實務團隊進行正式諮詢。',
        ],
      },
    ],
  },
  en: {
    label: 'GUIDE',
    title: 'Before You Contact Us',
    description: 'Preparing the right materials in advance helps us route your inquiry and structure the consultation more efficiently.',
    cards: [
      {
        title: 'Available channels',
        items: [
          'You can reach us through KakaoTalk, LINE, email, or phone.',
          'We offer in-person meetings in Taipei and video consultations via Zoom or Google Meet.',
          'Initial consultation coordination is handled in Korean, Chinese, and English.',
        ],
      },
      {
        title: 'Useful materials to prepare',
        items: [
          'Key documents such as contracts, notices, emails, invoices, or chat records',
          'Party or company details, timeline of events, and current procedural status',
          'Photos, videos, judgments, or filings that help establish the facts',
        ],
      },
      {
        title: 'Consultation flow',
        items: [
          'We first review the inquiry type and urgency.',
          'If needed, we request additional materials and suggest the right consultation format.',
          'After scheduling is confirmed, the consultation proceeds with the lawyer or practice team.',
        ],
      },
    ],
  },
} as const;

export default function ConsultationGuideSection({ locale }: { locale: Locale }) {
  const content = guideCopy[locale];

  return (
    <section className="section section--gray consultation-guide-section">
      <div className="container">
        <SectionLabel>{content.label}</SectionLabel>
        <h2 className="section-title">{content.title}</h2>
        <p className="section-lede">{content.description}</p>
        <OrnamentDivider />
        <div className="grid-bento contact-grid reveal-stagger">
          {content.cards.map((card) => (
            <article key={card.title} className="card legal-card">
              <h3 className="card-title">{card.title}</h3>
              <ul className="contact-list legal-card-list">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
