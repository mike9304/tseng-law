import Link from 'next/link';
import {
  partitionCustomerBillingDocuments,
  type CustomerBillingDocumentDto,
} from '@/lib/builder/billing-customer-portal';
import type { Locale } from '@/lib/locales';
import { CopyLinkButton } from '@/components/members/CopyLinkButton';
import { RenewPaymentLinkButton } from '@/components/members/RenewPaymentLinkButton';
import { SendDocumentEmailButton } from '@/components/members/SendDocumentEmailButton';

type CopyBundle = {
  title: string;
  signedOut: string;
  signInCta: string;
  empty: string;
  unpaidHeading: string;
  paidHeading: string;
  archivedHeading: string;
  openLabel: string;
  downloadLabel: string;
  copyLabel: string;
  copiedLabel: string;
  copyPayLabel: string;
  copiedPayLabel: string;
  emailLabel: string;
  emailedLabel: string;
  emailingLabel: string;
  emailFailedLabel: string;
  payLabel: string;
  renewLabel: string;
  renewingLabel: string;
  renewedLabel: string;
  renewFailedLabel: string;
  renewNeeded: string;
  noLink: string;
  contactUs: string;
  memberEmailLabel: string;
  totalLabel: string;
  balanceLabel: string;
  issuedLabel: string;
  shareUnavailable: string;
};

export const BILLING_COPY: Record<Locale, CopyBundle> = {
  ko: {
    title: '청구서 및 영수증',
    signedOut: '청구서를 보려면 회원 로그인이 필요합니다.',
    signInCta: '로그인 페이지로 이동',
    empty: '아직 발급된 청구서나 영수증이 없습니다.',
    unpaidHeading: '결제 대기 중인 청구서',
    paidHeading: '발급된 영수증 및 결제 완료',
    archivedHeading: '취소·대체된 문서',
    openLabel: '문서 열기',
    downloadLabel: 'PDF 다운로드',
    copyLabel: 'PDF 링크 복사',
    copiedLabel: '복사됨',
    copyPayLabel: '결제 링크 복사',
    copiedPayLabel: '복사됨',
    emailLabel: '이메일로 보내기',
    emailedLabel: '발송됨',
    emailingLabel: '발송 중...',
    emailFailedLabel: '발송 실패',
    payLabel: '결제하기',
    renewLabel: '새 결제 링크 요청',
    renewingLabel: '요청 중...',
    renewedLabel: '요청됨',
    renewFailedLabel: '요청 실패',
    renewNeeded: '금액 변경 — 새 결제 링크를 요청해 주세요.',
    noLink: '결제 링크를 사용할 수 없습니다.',
    contactUs: '담당자에게 문의하세요.',
    memberEmailLabel: '이메일',
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
    downloadLabel: 'Download PDF',
    copyLabel: 'Copy PDF link',
    copiedLabel: 'Copied',
    copyPayLabel: 'Copy payment link',
    copiedPayLabel: 'Copied',
    emailLabel: 'Email me a copy',
    emailedLabel: 'Sent',
    emailingLabel: 'Sending...',
    emailFailedLabel: 'Send failed',
    payLabel: 'Pay invoice',
    renewLabel: 'Request new payment link',
    renewingLabel: 'Requesting...',
    renewedLabel: 'Requested',
    renewFailedLabel: 'Request failed',
    renewNeeded: 'Balance changed — please request a new payment link.',
    noLink: 'No payment link available.',
    contactUs: 'Contact us to settle this invoice.',
    memberEmailLabel: 'Email',
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
    downloadLabel: '下載 PDF',
    copyLabel: '複製 PDF 連結',
    copiedLabel: '已複製',
    copyPayLabel: '複製付款連結',
    copiedPayLabel: '已複製',
    emailLabel: '寄送副本',
    emailedLabel: '已寄出',
    emailingLabel: '寄送中...',
    emailFailedLabel: '寄送失敗',
    payLabel: '前往付款',
    renewLabel: '申請新的付款連結',
    renewingLabel: '申請中...',
    renewedLabel: '已申請',
    renewFailedLabel: '申請失敗',
    renewNeeded: '金額已變動 — 請申請新的付款連結。',
    noLink: '目前無可用的付款連結。',
    contactUs: '請聯絡我們以結清此帳單。',
    memberEmailLabel: '電子郵件',
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

function DocumentCard({ document, copy }: { document: CustomerBillingDocumentDto; copy: CopyBundle }): JSX.Element {
  const issued = new Date(document.issuedAt).toLocaleString();
  const showPay = document.type === 'invoice' && document.balanceDue > 0 && Boolean(document.paymentLinkPath);
  const renewMessage = document.type === 'invoice'
    && document.balanceDue > 0
    && !document.paymentLinkPath
    && (document.paymentLinkRenewalNeeded ? copy.renewNeeded : copy.noLink);
  const showRenew = document.type === 'invoice' && document.balanceDue > 0 && (!document.paymentLinkPath || document.paymentLinkRenewalNeeded);
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
        {document.downloadPath ? (
          <a href={document.downloadPath} style={secondaryLink} download data-billing-download-link={document.documentId}>
            {copy.downloadLabel}
          </a>
        ) : null}
        {document.downloadPath ? (
          <CopyLinkButton
            copiedLabel={copy.copiedLabel}
            dataCopyLink={document.documentId}
            href={document.downloadPath}
            label={copy.copyLabel}
            style={{ ...secondaryLink, border: 'none', cursor: 'pointer' }}
          />
        ) : null}
        {document.source === 'booking' ? (
          <SendDocumentEmailButton
            dataSendEmail={document.documentId}
            failedLabel={copy.emailFailedLabel}
            href={`/${document.locale}/account/bookings/${document.ownerLabel}/documents/${document.documentId}/email`}
            label={copy.emailLabel}
            pendingLabel={copy.emailingLabel}
            sentLabel={copy.emailedLabel}
            style={{ ...secondaryLink, border: 'none', cursor: 'pointer' }}
          />
        ) : null}
        {showPay ? (
          <a href={document.paymentLinkPath} style={linkButton} data-billing-pay-link={document.documentId}>
            {copy.payLabel}
          </a>
        ) : null}
        {showPay ? (
          <CopyLinkButton
            copiedLabel={copy.copiedPayLabel}
            dataCopyLink={`pay-${document.documentId}`}
            href={document.paymentLinkPath}
            label={copy.copyPayLabel}
            style={{ ...secondaryLink, border: 'none', cursor: 'pointer' }}
          />
        ) : null}
        {showRenew ? (
          <RenewPaymentLinkButton
            dataRenewPaymentLink={document.documentId}
            failedLabel={copy.renewFailedLabel}
            href={`/${document.locale}/account/billing/documents/${document.documentId}/payment-link`}
            label={copy.renewLabel}
            pendingLabel={copy.renewingLabel}
            renewedLabel={copy.renewedLabel}
            style={{ ...secondaryLink, border: 'none', cursor: 'pointer' }}
          />
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

export function BillingPortalView({
  locale,
  memberEmail,
  documents,
  signedOut,
  signInHref,
}: {
  locale: Locale;
  memberEmail?: string;
  documents: CustomerBillingDocumentDto[];
  signedOut?: boolean;
  signInHref?: string;
}): JSX.Element {
  const copy = BILLING_COPY[locale];
  if (signedOut) {
    return (
      <main style={containerStyle} data-billing-portal-state="signed-out">
        <h1 style={{ marginTop: 0 }}>{copy.title}</h1>
        <p>{copy.signedOut}</p>
        <Link href={signInHref ?? `/${locale}/login?next=${encodeURIComponent('/account/billing')}`} style={linkButton}>
          {copy.signInCta}
        </Link>
      </main>
    );
  }

  const { unpaidInvoices, paidReceipts, archived } = partitionCustomerBillingDocuments(documents);

  return (
    <main style={containerStyle} data-billing-portal-state="signed-in">
      <header>
        <h1 style={{ marginTop: 0 }}>{copy.title}</h1>
        <p style={mutedStyle}>{copy.memberEmailLabel}: {memberEmail ?? ''}</p>
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
