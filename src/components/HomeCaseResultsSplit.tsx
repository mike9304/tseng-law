import Image from 'next/image';
import type { Locale } from '@/lib/locales';
import SmartLink from '@/components/SmartLink';

const copyByLocale = {
  ko: {
    label: 'RESULTS',
    title: '한국 학생 헬스장 부상 사건,\n157만 TWD 승소',
    description:
      '한국 대학생이 대만 헬스장에서 트레이너 지도 중 중상을 입은 사건에서 손해배상 청구를 진행해 1심에서 157만 TWD 판결을 받았습니다.',
    summary:
      '사실관계 입증, 손해 산정, 협상·소송 전략을 통합해 결과를 도출한 대표 사례입니다.',
    cta: '소송사례 더 보기'
  },
  'zh-hant': {
    label: 'RESULTS',
    title: '韓國學生健身房受傷案件，\n一審獲判 157 萬 TWD',
    description:
      '韓國大學生於台灣健身房在教練指導下受傷後提出損害賠償請求，一審取得 157 萬 TWD 判決。',
    summary: '本案整合事實證明、損害計算與訴訟策略，屬代表性實績案例。',
    cta: '查看更多案例'
  },
  en: {
    label: 'RESULTS',
    title: 'Korean Student Gym Injury Case,\nTWD 1.57M First-Instance Win',
    description:
      'In a case where a Korean university student suffered a serious injury during trainer-guided exercise at a Taiwan gym, we pursued damages and obtained a TWD 1.57M ruling in first instance.',
    summary:
      'This is a representative result built on integrated fact proof, damage calculation, negotiation, and litigation strategy.',
    cta: 'View More Case Results'
  }
} as const;

export default function HomeCaseResultsSplit({ locale }: { locale: Locale }) {
  const copy = copyByLocale[locale];

  return (
    <section className="section section--dark split-section split--img-right" id="results" data-tone="dark">
      <div className="split-content">
        <div className="section-label">{copy.label}</div>
        <h2 className="split-title">
          {copy.title.split('\n').map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h2>
        <div className="split-divider" />
        <p className="split-text">{copy.description}</p>
        <p className="split-text">{copy.summary}</p>
        <SmartLink className="link-underline" href={`/${locale}/columns`}>
          {copy.cta} →
        </SmartLink>
      </div>
      <div className="split-image">
        <Image src="/images/feature-1.svg" alt={copy.title.replace('\n', ' ')} width={1200} height={900} />
      </div>
    </section>
  );
}
