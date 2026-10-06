import Link from 'next/link';
import { siteContent } from '@/data/site-content';
import { getConsultationCtaLabel, getConsultationPublicMailto } from '@/lib/consultation/public-contact';
import ZhHantMonoIcon from '@/components/zh-hant-icons/ZhHantMonoIcon';
import styles from '../ZhHantDesign.module.css';

/**
 * ko home: how a reader goes from a first email to retaining the firm, beside the four offices
 * (the zh-hant 委任流程 band, 2026-10-06). Each step restates existing ko site facts — no new claims:
 * 1 public-contact.ts ko (first contact: the matter's outline and contact details only; sensitive data later),
 * 2 PricingCards ko (「사건 내용을 확인한 후 견적을 안내드립니다」, 일반 법률상담 NT$ 3,000 / 1시간, and the
 *   disclaimer's basic-rate qualification 「사건의 특성·복합성·긴급도에 따라 변동될 수 있습니다」),
 * 3 PricingCards ko disclaimer (「정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다」),
 * 4 legal-pages ko 「정식 자문 또는 수임은 별도의 검토와 동의 절차가 완료된 경우에만 성립합니다」,
 *   team-members ko description and the four consultation languages.
 * Title: the contact page's 「상담 진행 흐름」.
 */
const STEPS = [
  { title: '이메일 문의', text: '사건 또는 업무의 개요와 연락처를 보내 주세요. 주민등록번호·여권번호·계좌번호 등 민감정보는 담당 변호사의 별도 안내 후 제출해 주세요.' },
  { title: '사건 내용 확인', text: '사건 내용을 확인한 후 견적을 안내드립니다. 일반 법률상담은 NT$ 3,000 / 1시간이며, 기본 기준으로 사건의 특성·복합성·긴급도에 따라 변동될 수 있습니다.' },
  { title: '서면 견적', text: '정확한 비용은 초기 상담 후 서면 견적으로 안내드립니다.' },
  { title: '수임과 진행', text: '정식 자문 또는 수임은 별도의 검토와 동의 절차가 완료된 경우에만 성립합니다. 이후 증준외 변호사가 이끄는 팀이 담당하며, 한국어·중국어·일본어·영어로 소통합니다.' },
] as const;

export default function KoEngagement() {
  const { contact } = siteContent.ko;
  return (
    <section id="process" className={styles.engagement} aria-labelledby="ko-process-title">
      <div className={`container ${styles.engagementGrid}`}>
        <div className={styles.engagementMain}>
          <h2 id="ko-process-title" className={styles.engagementTitle}>상담 진행 흐름</h2>
          <ol className={styles.engagementSteps}>
            {STEPS.map((step, index) => (
              <li key={step.title}>
                <span className={styles.engagementNo} aria-hidden>{index + 1}</span>
                <span className={styles.engagementStepTitle}>{step.title}</span>
                <span className={styles.engagementStepText}>{step.text}</span>
              </li>
            ))}
          </ol>
          <div className={styles.engagementActions}>
            <a href={getConsultationPublicMailto('ko')} className="button" aria-label={`이메일 상담 신청 — ${getConsultationCtaLabel('ko')}`}>
              이메일 상담 신청
            </a>
            <Link href="/ko/pricing" className={styles.engagementMore}>비용안내<ZhHantMonoIcon name="arrow-right" size={18} strokePx={1.6} className={styles.trailArrow} /></Link>
          </div>
        </div>
        <div className={styles.engagementOffices}>
          <p className={styles.engagementOfficesLabel}>{contact.locationsLabel}</p>
          <ul>
            {contact.locations.map((office) => (
              <li key={office.title}>
                <span className={styles.engagementOfficeName}>{office.title}</span>
                <span className={styles.engagementOfficeAddress}>{office.details[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
