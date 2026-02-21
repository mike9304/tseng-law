'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function ColumnContent({ content }: { content: string }) {
  return (
    <div className="column-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <span className="column-img-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={alt || ''} loading="lazy" decoding="async" style={{ width: '100%', height: 'auto', borderRadius: '8px' }} />
              </span>
            );
          },
          h2: ({ children }) => <h2 className="blog-heading">{children}</h2>,
          h3: ({ children }) => <h3 className="blog-heading" style={{ fontSize: '1.25rem' }}>{children}</h3>,
          p: ({ children }) => <p className="blog-paragraph">{children}</p>,
          table: ({ children }) => (
            <div className="column-table-wrap"><table>{children}</table></div>
          ),
          strong: ({ children }) => <strong style={{ fontWeight: 600 }}>{children}</strong>,
          a: ({ href, children }) => (
            <a href={href || '#'} target="_blank" rel="noopener noreferrer" className="link-underline">{children}</a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
