import Link from 'next/link';
import ColumnContent from '@/components/ColumnContent';
import DraftStatusBanner from '@/components/semiconductor-drafts/DraftStatusBanner';
import {
  EXISTING_PUBLIC_RELATED_LINKS,
  SEMICONDUCTOR_DRAFT_CATEGORY_LABEL_KO,
  SEMICONDUCTOR_TOPIC_LABELS_KO,
  ctaKeyToInquiryKind,
  getRelatedSemiconductorDrafts,
  getSemiconductorServiceDraft,
  semiconductorDraftBodyWithoutLeadingTitle,
  semiconductorInquiryMailto,
  type SemiconductorDraftRecord,
} from '@/lib/semiconductor-drafts';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';

export default function SemiconductorColumnPreview({
  record,
  admin = false,
}: {
  record: SemiconductorDraftRecord;
  admin?: boolean;
}) {
  const service = getSemiconductorServiceDraft();
  const related = getRelatedSemiconductorDrafts(record);
  const inquiryKind = ctaKeyToInquiryKind(record.ctaKey);
  const indexHref = admin ? service.adminPreviewPath : service.previewPath;

  return (
    <main className="semi-draft-page">
      <section className="svc-hero" data-tone="dark">
        <div className="container svc-hero-inner">
          <Link href={indexHref} className="svc-back-link">
            ← {SEMICONDUCTOR_DRAFT_CATEGORY_LABEL_KO}
          </Link>
          {record.topicId ? (
            <p className="svc-col-badge" style={{ display: 'inline-block', marginTop: '1rem' }}>
              {SEMICONDUCTOR_TOPIC_LABELS_KO[record.topicId]}
            </p>
          ) : null}
          <h1 className="svc-hero-title">{record.title}</h1>
          <p className="svc-hero-subtitle">{record.excerpt}</p>
        </div>
      </section>

      <article className="svc-article">
        <div className="container svc-container">
          <div className="svc-body semi-draft-reading">
            <DraftStatusBanner record={record} />
            <ColumnContent
              content={semiconductorDraftBodyWithoutLeadingTitle(record)}
              locale="ko"
            />
          </div>
          <aside className="svc-sidebar">
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">관련 초안</h3>
              <ul className="svc-related-list">
                {related.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={admin ? item.adminPreviewPath : item.previewPath}
                      className="svc-related-link"
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">기존 공개 페이지</h3>
              <ul className="svc-related-list">
                {EXISTING_PUBLIC_RELATED_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="svc-related-link">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">상담 요청</h3>
              <p className="svc-sidebar-text">
                문의가 곧 수임은 아닙니다. 초기 메일에는 민감정보를 넣지 마세요.
              </p>
              <Link href="/ko/contact" className="button svc-sidebar-btn">공식 문의 페이지</Link>
              <a
                href={semiconductorInquiryMailto(inquiryKind)}
                className="button--outline svc-sidebar-btn"
                aria-label={`이메일 상담: ${CONSULTATION_EMAIL}`}
              >
                이메일 상담
              </a>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
