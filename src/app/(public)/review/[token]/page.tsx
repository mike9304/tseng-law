import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyReviewToken } from '@/lib/builder/security/review-tokens';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Client review',
  robots: { index: false, follow: false },
};

interface ReviewPageProps {
  params: { token: string };
}

const REVIEW_COOKIE = 'tseng-review-session';

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

async function setReviewCookie(token: string): Promise<void> {
  // next/headers cookies() is a server-side mutation here. Wrap defensively
  // because preview environments sometimes block mutating cookies in RSC.
  try {
    const jar = cookies();
    jar.set({
      name: REVIEW_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch {
    /* RSC may be read-only depending on render mode */
  }
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const token = decodeURIComponent(params.token);
  const verified = await verifyReviewToken(token);
  if (!verified) {
    notFound();
  }
  await setReviewCookie(token);

  const previewPath = `/preview/${encodeURIComponent(verified.branchOrPageId)}?reviewToken=${encodeURIComponent(token)}`;

  return (
    <div style={containerStyle}>
      <div style={noticeStyle}>
        Read-only client review. Comments are visible to the workspace owner.
        Session expires {new Date(verified.expiresAt).toLocaleString()}.
      </div>
      <h1 style={{ marginTop: 0 }}>Review: {verified.branchOrPageId}</h1>

      <iframe
        title="client-review-preview"
        src={previewPath}
        style={previewFrameStyle}
        sandbox="allow-same-origin allow-scripts allow-forms"
      />

      <section style={sectionStyle}>
        <h2 style={{ marginTop: 0, fontSize: 15 }}>Leave a comment</h2>
        <ReviewCommentForm
          branchOrPageId={verified.branchOrPageId}
          token={token}
        />
      </section>
    </div>
  );
}

/**
 * Client-side comment form. Uses the existing builder comments API
 * (POST /api/builder/collab/comments) with the review token in the
 * `x-review-token` header — the API route should consult that header
 * via verifyReviewToken to accept anonymous client comments.
 */
function ReviewCommentForm({
  branchOrPageId,
  token,
}: {
  branchOrPageId: string;
  token: string;
}) {
  return (
    <form
      method="POST"
      action="/api/builder/collab/comments"
      style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <input type="hidden" name="pageId" value={branchOrPageId} />
      <input type="hidden" name="reviewToken" value={token} />
      <input
        name="author"
        placeholder="Your name"
        required
        style={{
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #cbd5f5',
          fontSize: 13,
        }}
      />
      <textarea
        name="text"
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