import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentSiteMember } from '@/lib/builder/members/current-member';
import {
  listCustomerBillingDocuments,
  partitionCustomerBillingDocuments,
  type CustomerBillingDocumentDto,
} from '@/lib/builder/billing-customer-portal';
import { defaultLocale, type Locale } from '@/lib/locales';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Billing portal',
  robots: { index: false, follow: false },
};

interface CopyBundle {
  title: string;
  signedOut: string;
  signInCta: string;
  empty: string;
  unpaidHeading: string;
  paidHeading: string;
  archivedHeading: string;
  openLabel: string;
  payLabel: string;
  renewNeeded: string;
  noLink: string;
  contactUs: string;
  emailLabel: string;
  totalLabel: string;
  balanceLabel: string;
  issuedLabel: string;
  shareUnavailable: string;
}

const COPY: Record<Locale, CopyBundle> = {
  ko: {
    title: '청구서 및 영수증',
    signedOut: '청구서를 보려면 회원 로그인이 필요합니다.',
    signInCta: '로그인 페이지로 이동',
    empty: '아직 발급된 청구서나 영수증이 없습니다.',
    unpaidHeading: '결제 대기 중인 청구서',
    paidHeading: '발급된 영수증 및 결제 완료',
    archivedHeading: '취소·대체된 문서',
    openLabel: '문서 열기',
    payLabel: '결제하기',
    renewNeeded: '금액 변경 — 새 결제 링크를 요청해 주세요.',
    noLink: '결제 링크를 사용할 수 없습니다.',
    contactUs: '담당자에게 문의하세요.',
    emailLabel: '이메일',
    totalLabel: '합계',
    balanceLabel: '미결제 잔액',
    issuedLabel: '발급일',
    shareUnavailable: '공유 링크는 담당자에게 요청해 주세요.',
  },
  en: {
    title: 'Billing portal',
    signedOut: 'Sign in to view your invoices and receipts.',
    signInCta: 'Go to sign in',
    empty: 'No invoices or receipts have been issued to your account yet.',
    unpaidHeading: 'Unpaid invoices',
    paidHeading: 'Issued receipts and paid invoices',
    archivedHeading: 'Voided / superseded documents',
    openLabel: 'Open document',
    payLabel: 'Pay invoice',
    renewNeeded: 'Balance changed — please request a new payment link.',
    noLink: 'No payment link available.',
    contactUs: 'Contact us to settle this invoice.',
    emailLabel: 'Email',
    totalLabel: 'Total',
    balanceLabel: 'Balance due',
    issuedLabel: 'Issued',
    shareUnavailable: 'Ask us for a share link if you need a copy.',
  },
  'zh-hant': {
    title: '帳單入口',
    signedOut: '請先登入會員以查看帳單。',
    signInCta: '前往登入',
    empty: '尚未為您的帳戶開立任何帳單或收據。',
    unpaidHeading: '尚未付款的帳單',
    paidHeading: '已開立的收據與已付款帳單',
    archivedHeading: '已作廢或被取代的文件',
    openLabel: '開啟文件',
    payLabel: '前往付款',
    renewNeeded: '金額已變動 — 請申請新的付款連結。',
    noLink: '目前無可用的付款連結。',
    contactUs: '請聯絡我們以結清此帳單。',
    emailLabel: '電子郵件',
    totalLabel: '合計',
    balanceLabel: '應付餘額',
    issuedLabel: '開立日期',
    shareUnavailable: '如需文件副本請聯絡我們索取分享連結。',
  },
};

const containerStyle: React.CSSProperties = {
  maxWidth: 920,
  margin: '0 auto',
  padding: '32px 20px',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
  color: '#0f172a',
};

const sectionStyle: React.CSSProperties = {
  marginTop: 28,
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: 20,
};

const cardStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: 16,
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  marginTop: 12,
  background: '#f8fafc',
};

const linkButton: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '8px 12px',
  borderRadius: 8,
  background: '#1d4ed8',
  color: '#ffffff',
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: 13,
};

const secondaryLink: React.CSSProperties = {
  ...linkButton,
  background: '#e2e8f0',
  color: '#1e293b',
};

const mutedStyle: React.CSSProperties = {
  color: '#64748b',
  fontSize: 13,
};

function copyFor(localeHint: string | undefined): { locale: Locale; copy: CopyBundle } {
  if (localeHint === 'en' || localeHint === 'zh-hant' || localeHint === 'ko') {
    return { locale: localeHint, copy: COPY[localeHint] };
  }
  return { locale: defaultLocale, copy: COPY[defaultLocale] };
}

function DocumentCard({ document, copy }: { document: CustomerBillingDocumentDto; copy: CopyBundle }): JSX.Element {
  const issued = new Date(document.issuedAt).toLocaleString();
  const showPay = document.type === 'invoice' && document.balanceDue > 0 && Boolean(document.paymentLinkPath);
  const renewMessage = document.type === 'invoice'
    && document.balanceDue > 0
    && !document.paymentLinkPath
    && (document.paymentLinkRenewalNeeded ? copy.renewNeeded : copy.noLink);
  return (
    <article style={cardStyle} data-billing-document-card={document.documentId}>
      <header style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <strong style={{ fontSize: 15 }}>{document.typeLabel} · {document.number}</strong>
        <span style={mutedStyle}>{document.statusLabel}</span>
      </header>
      <div style={mutedStyle}>{document.contextLabel}</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 4 }}>
        <div>
          <div style={mutedStyle}>{copy.totalLabel}</div>
          <div style={{ fontWeight: 600 }}>{document.totalLabel}</div>
        </div>
        <div>
          <div style={mutedStyle}>{copy.balanceLabel}</div>
          <div style={{ fontWeight: 600 }}>{document.balanceDueLabel}</div>
        </div>
      </div>
      <div style={mutedStyle}>{copy.issuedLabel}: {issued}</div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
        {document.sharePath ? (
          <a href={document.sharePath} style={secondaryLink} target="_blank" rel="noreferrer">
            {copy.openLabel}
          </a>
        ) : (
          <span style={mutedStyle}>{copy.shareUnavailable}</span>
        )}
        {showPay ? (
          <a href={document.paymentLinkPath} style={linkButton} data-billing-pay-link={document.documentId}>
            {copy.payLabel}
          </a>
        ) : null}
        {renewMessage ? <span style={mutedStyle}>{renewMessage}</span> : null}
      </div>
    </article>
  );
}

function DocumentSection({
  heading,
  documents,
  copy,
}: {
  heading: string;
  documents: CustomerBillingDocumentDto[];
  copy: CopyBundle;
}): JSX.Element | null {
  if (documents.length === 0) return null;
  return (
    <section style={sectionStyle}>
      <h2 style={{ margin: 0, fontSize: 18 }}>{heading}</h2>
      {documents.map((document) => (
        <DocumentCard key={document.documentId} document={document} copy={copy} />
      ))}
    </section>
  );
}

export default async function CustomerBillingPortalPage(): Promise<JSX.Element> {
  const member = await getCurrentSiteMember();
  const { locale, copy } = copyFor(member?.locale);

  if (!member) {
    return (
      <main style={containerStyle} data-billing-portal-state="signed-out">
        <h1 style={{ marginTop: 0 }}>{copy.title}</h1>
        <p>{copy.signedOut}</p>
        <Link href={`/${locale}/login?next=${encodeURIComponent('/account/billing')}`} style={linkButton}>
          {copy.signInCta}
        </Link>
      </main>
    );
  }

  const documents = await listCustomerBillingDocuments(member.email);
  const { unpaidInvoices, paidReceipts, archived } = partitionCustomerBillingDocuments(documents);

  return (
    <main style={containerStyle} data-billing-portal-state="signed-in">
      <header>
        <h1 style={{ marginTop: 0 }}>{copy.title}</h1>
        <p style={mutedStyle}>{copy.emailLabel}: {member.email}</p>
      </header>
      {documents.length === 0 ? (
        <section style={sectionStyle}>
          <p style={{ margin: 0 }}>{copy.empty}</p>
        </section>
      ) : (
        <>
          <DocumentSection heading={copy.unpaidHeading} documents={unpaidInvoices} copy={copy} />
          <DocumentSection heading={copy.paidHeading} documents={paidReceipts} copy={copy} />
          <DocumentSection heading={copy.archivedHeading} documents={archived} copy={copy} />
        </>
      )}
      <footer style={{ marginTop: 28 }}>
        <p style={mutedStyle}>{copy.contactUs}</p>
      </footer>
    </main>
  );
}