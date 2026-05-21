import type { Metadata } from 'next';
import { getSdkDocSections } from '@/lib/builder/dev/sdk-docs';

export const dynamic = 'force-static';
export const metadata: Metadata = {
  title: '호정국제 사이트 에디터 · SDK 문서',
  robots: { index: false, follow: false },
};

const PAGE_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 32,
  padding: '32px 40px',
  maxWidth: 960,
  margin: '0 auto',
  fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  color: '#0f172a',
};

const SECTION_STYLE: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  padding: 24,
  background: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 12,
};

const CODE_STYLE: React.CSSProperties = {
  background: '#0f172a',
  color: '#e2e8f0',
  padding: 16,
  borderRadius: 8,
  fontSize: 12,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  whiteSpace: 'pre',
  overflowX: 'auto',
};

const TYPE_STYLE: React.CSSProperties = {
  background: '#f1f5f9',
  color: '#1e293b',
  padding: '6px 10px',
  borderRadius: 6,
  fontSize: 12,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
};

export default function BuilderSdkDocsPage() {
  const sections = getSdkDocSections();
  return (
    <main style={PAGE_STYLE}>
      <header>
        <h1 style={{ fontSize: 28, margin: 0 }}>Builder SDK</h1>
        <p style={{ color: '#475569', marginTop: 8 }}>
          Programmatic surface for the in-house builder. All examples assume a server context
          (Next.js Route Handler, Server Action, or background job).
        </p>
        <nav style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              style={{
                ...TYPE_STYLE,
                textDecoration: 'none',
              }}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </header>
      {sections.map((section) => (
        <section key={section.id} id={section.id} style={SECTION_STYLE}>
          <h2 style={{ fontSize: 20, margin: 0 }}>{section.title}</h2>
          {section.paragraphs.map((p, index) => (
            <p key={index} style={{ margin: 0, color: '#334155', lineHeight: 1.6 }}>
              {p}
            </p>
          ))}
          <div>
            <h3 style={{ fontSize: 13, margin: '8px 0', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Key types
            </h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: 0, padding: 0, listStyle: 'none' }}>
              {section.types.map((typeLine) => (
                <li key={typeLine}>
                  <code style={TYPE_STYLE}>{typeLine}</code>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ fontSize: 13, margin: '8px 0', color: '#475569', textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Example
            </h3>
            <pre style={CODE_STYLE}>{section.example}</pre>
          </div>
        </section>
      ))}
    </main>
  );
}