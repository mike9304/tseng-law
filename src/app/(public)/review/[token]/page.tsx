import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  resolveReviewTarget,
  verifyReviewToken,
} from '@/lib/builder/security/review-tokens';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Client review',
  robots: { index: false, follow: false },
  referrer: 'no-referrer',
};

interface ReviewPageProps {
  params: Promise<{ token: string }>;
}

const containerStyle: React.CSSProperties = {
  maxWidth: 980,
  margin: '0 auto',
  padding: 24,
  fontFamily: 'system-ui, sans-serif',
};

const noticeStyle: React.CSSProperties = {
  background: '#fef3c7',
  border: '1px solid #fcd34d',
  borderRadius: 8,
  padding: '10px 14px',
  fontSize: 13,
  color: '#78350f',
  marginBottom: 16,
};

const previewFrameStyle: React.CSSProperties = {
  width: '100%',
  minHeight: 720,
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  background: '#fff',
};

const sectionStyle: React.CSSProperties = {
  marginTop: 24,
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: 10,
  padding: 18,
};

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { token: encodedToken } = await params;
  const token = decodeURIComponent(encodedToken);
  const verified = await verifyReviewToken(token);
  if (!verified) {
    notFound();
  }
  const target = await resolveReviewTarget(verified);

  return (
    <div style={containerStyle}>
      <div style={noticeStyle}>
        Read-only client review. Comments are visible to the workspace owner.
        Session expires {new Date(verified.expiresAt).toLocaleString()}.
      </div>
      <h1 style={{ marginTop: 0 }}>Client review</h1>

      {target ? (
        <>
          <iframe
            title="client-review-preview"
            src={target.publicPath}
            style={previewFrameStyle}
            sandbox="allow-same-origin allow-scripts allow-forms"
            referrerPolicy="no-referrer"
          />

          <section style={sectionStyle}>
            <h2 style={{ marginTop: 0, fontSize: 15 }}>Leave a comment</h2>
            <ReviewCommentForm token={token} />
          </section>
        </>
      ) : (
        <section style={sectionStyle}>
          <p style={{ margin: 0 }}>
            This review target is unavailable. Ask the workspace owner for a new review link.
          </p>
        </section>
      )}
    </div>
  );
}

/**
 * Native form POST keeps the review credential out of the query string and
 * referrer. The endpoint ignores every client-supplied target or identity.
 */
function ReviewCommentForm({
  token,
}: {
  token: string;
}) {
  return (
    <form
      method="POST"
      action="/api/builder/collab/comments"
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <input type="hidden" name="reviewToken" value={token} />
      <textarea
        name="body"
        placeholder="Leave your feedback..."
        required
        rows={4}
        style={{
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #cbd5f5',
          fontSize: 13,
          fontFamily: 'inherit',
          resize: 'vertical',
        }}
      />
      <button
        type="submit"
        style={{
          alignSelf: 'flex-start',
          padding: '8px 14px',
          borderRadius: 6,
          background: '#0f172a',
          color: '#fff',
          border: 'none',
          fontSize: 13,
          cursor: 'pointer',
        }}
      >
        Send
      </button>
    </form>
  );
}
