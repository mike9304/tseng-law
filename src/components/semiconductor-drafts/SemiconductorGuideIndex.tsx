import Link from 'next/link';
import ColumnContent from '@/components/ColumnContent';
import DraftStatusBanner from '@/components/semiconductor-drafts/DraftStatusBanner';
import {
  EXISTING_PUBLIC_RELATED_LINKS,
  SEMICONDUCTOR_DRAFT_CATEGORY_LABEL_KO,
  SEMICONDUCTOR_TOPIC_LABELS_KO,
  ctaKeyToInquiryKind,
  getSemiconductorServiceDraft,
  listSemiconductorArticleDrafts,
  semiconductorServiceBodyWithDraftLinks,
  semiconductorInquiryMailto,
  type SemiconductorDraftRecord,
  type SemiconductorTopicId,
} from '@/lib/semiconductor-drafts';
import { CONSULTATION_EMAIL } from '@/lib/consultation/public-contact';

const TOPIC_ORDER: SemiconductorTopicId[] = [
  'taiwan-entry',
  'commercial-contracts',
  'transaction-disputes',
];

function articleHref(record: SemiconductorDraftRecord, admin: boolean): string {
  return admin ? record.adminPreviewPath : record.previewPath;
}

export default function SemiconductorGuideIndex({
  admin = false,
}: {
  admin?: boolean;
}) {
  const service = getSemiconductorServiceDraft();
  const articles = listSemiconductorArticleDrafts();
  const byTopic = new Map(articles.map((article) => [article.topicId, article]));

  return (
    <main className="semi-draft-page">
      <section className="svc-hero" data-tone="dark">
        <div className="container svc-hero-inner">
          <p className="svc-back-link" style={{ opacity: 0.8 }}>
            {SEMICONDUCTOR_DRAFT_CATEGORY_LABEL_KO} · 미리보기
          </p>
          <h1 className="svc-hero-title">{service.title}</h1>
          <p className="svc-hero-subtitle">{service.metaDescription}</p>
        </div>
      </section>

      <article className="svc-article">
        <div className="container svc-container">
          <div className="svc-body semi-draft-reading">
            <DraftStatusBanner record={service} />
            <ColumnContent
              content={semiconductorServiceBodyWithDraftLinks(service, admin)}
              locale="ko"
            />

            <h2 className="svc-keypoints-title">주제별 초안 칼럼</h2>
            <div className="svc-columns-grid">
              {TOPIC_ORDER.map((topicId) => {
                const article = byTopic.get(topicId);
                if (!article) return null;
                return (
                  <Link
                    key={topicId}
                    href={articleHref(article, admin)}
                    className="svc-col-card"
                  >
                    <span className="svc-col-badge">{SEMICONDUCTOR_TOPIC_LABELS_KO[topicId]}</span>
                    <h3 className="svc-col-card-title">{article.title}</h3>
                    <p className="svc-col-card-summary">{article.excerpt}</p>
                    <span className="svc-col-card-link">초안 전문 읽기 →</span>
                  </Link>
                );
              })}
            </div>

            <h2 className="svc-keypoints-title">기존 공개 안내</h2>
            <ul className="svc-keypoints-list">
              {EXISTING_PUBLIC_RELATED_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="link-underline">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <aside className="svc-sidebar">
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">기업 상담 요청</h3>
              <p className="svc-sidebar-text">
                초기 문의에는 회사명, 본사 소재국, 상대방 회사명, 문의 유형, 비기밀 개요, 희망 상담 언어만 적어 주세요. 기밀자료는 이해충돌 확인 후 별도 전달합니다.
              </p>
              <a href="/ko/contact" className="button svc-sidebar-btn">공식 문의 페이지</a>
              <a
                href={semiconductorInquiryMailto('taiwan-entry')}
                className="button--outline svc-sidebar-btn"
                aria-label={`이메일 상담: ${CONSULTATION_EMAIL}`}
              >
                이메일 상담
              </a>
            </div>
            <div className="svc-sidebar-card">
              <h3 className="svc-sidebar-title">문의 유형</h3>
              <ul className="svc-related-list">
                {articles.map((article) => (
                  <li key={article.id}>
                    <a
                      href={semiconductorInquiryMailto(ctaKeyToInquiryKind(article.ctaKey))}
                      className="svc-related-link"
                    >
                      {article.topicId
                        ? SEMICONDUCTOR_TOPIC_LABELS_KO[article.topicId]
                        : article.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}
