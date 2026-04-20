'use client';

import { useCallback, useEffect, useState } from 'react';

interface SeoFormState {
  title: string;
  description: string;
  ogImage: string;
  canonical: string;
  noIndex: boolean;
}

const EMPTY_SEO: SeoFormState = {
  title: '',
  description: '',
  ogImage: '',
  canonical: '',
  noIndex: false,
};

const backdropStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9000,
  background: 'rgba(15, 23, 42, 0.45)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fadeIn 150ms ease',
};

const panelStyle: React.CSSProperties = {
  width: 560,
  maxWidth: '92vw',
  maxHeight: '85vh',
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 24px 64px rgba(15, 23, 42, 0.18)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  animation: 'fadeIn 180ms ease',
  transform: 'scale(1)',
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid #e2e8f0',
};

const titleStyle: React.CSSProperties = {
  fontSize: '1rem',
  fontWeight: 700,
  color: '#0f172a',
};

const closeBtnStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: '0.78rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#64748b',
  cursor: 'pointer',
};

const formStyle: React.CSSProperties = {
  flex: 1,
  overflowY: 'auto',
  padding: '16px 20px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const fieldStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.78rem',
  fontWeight: 600,
  color: '#334155',
};

const helpTextStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: '#64748b',
  lineHeight: 1.5,
};

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: '0.85rem',
  color: '#0f172a',
  outline: 'none',
  transition: 'border-color 150ms ease',
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 104,
  resize: 'vertical',
  fontFamily: 'inherit',
};

const checkboxRowStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 10,
  background: '#f8fafc',
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 20px',
  borderTop: '1px solid #e2e8f0',
};

const statusStyle: React.CSSProperties = {
  minHeight: 18,
  fontSize: '0.78rem',
  color: '#dc2626',
};

const cancelBtnStyle: React.CSSProperties = {
  padding: '8px 18px',
  fontSize: '0.82rem',
  fontWeight: 600,
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  background: '#fff',
  color: '#334155',
  cursor: 'pointer',
};

const saveBtnStyle: React.CSSProperties = {
  padding: '8px 18px',
  fontSize: '0.82rem',
  fontWeight: 600,
  border: 'none',
  borderRadius: 8,
  background: '#123b63',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 120ms ease',
};

interface SeoResponse {
  ok?: boolean;
  seo?: {
    title?: string;
    description?: string;
    ogImage?: string;
    canonical?: string;
    noIndex?: boolean;
  };
  error?: string;
}

export default function SeoPanel({
  open,
  pageId,
  locale,
  onClose,
}: {
  open: boolean;
  pageId: string;
  locale: string;
  onClose: () => void;
}) {
  const [form, setForm] = useState<SeoFormState>(EMPTY_SEO);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSeo = useCallback(async () => {
    if (!pageId) {
      setForm(EMPTY_SEO);
      setError('현재 선택된 페이지가 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/builder/site/pages/${pageId}/seo?locale=${encodeURIComponent(locale)}`,
        {
          credentials: 'same-origin',
        },
      );
      const payload = (await response.json().catch(() => ({}))) as SeoResponse;

      if (!response.ok) {
        setError(payload.error || 'SEO 메타데이터를 불러오지 못했습니다.');
        return;
      }

      setForm({
        title: payload.seo?.title ?? '',
        description: payload.seo?.description ?? '',
        ogImage: payload.seo?.ogImage ?? '',
        canonical: payload.seo?.canonical ?? '',
        noIndex: Boolean(payload.seo?.noIndex),
      });
    } catch {
      setError('SEO 메타데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [locale, pageId]);

  useEffect(() => {
    if (open) {
      void fetchSeo();
    }
  }, [fetchSeo, open]);

  useEffect(() => {
    if (!open) return undefined;

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose, open]);

  const handleSave = async () => {
    if (!pageId) {
      setError('현재 선택된 페이지가 없습니다.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/builder/site/pages/${pageId}/seo?locale=${encodeURIComponent(locale)}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify(form),
        },
      );
      const payload = (await response.json().catch(() => ({}))) as SeoResponse;

      if (!response.ok) {
        setError(payload.error || 'SEO 메타데이터를 저장하지 못했습니다.');
        return;
      }

      onClose();
    } catch {
      setError('SEO 메타데이터를 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof SeoFormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  if (!open) return null;

  return (
    <div
      style={backdropStyle}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div style={panelStyle}>
        <div style={headerStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={titleStyle}>페이지 SEO</span>
            <span style={helpTextStyle}>현재 페이지의 title, description, OG image, canonical, noindex 값을 저장합니다.</span>
          </div>
          <button type="button" style={closeBtnStyle} onClick={onClose}>
            닫기
          </button>
        </div>

        <div style={formStyle}>
          {loading ? (
            <div style={{ padding: 16, textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              로딩 중...
            </div>
          ) : (
            <>
              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="builder-seo-title">Title</label>
                <input
                  id="builder-seo-title"
                  type="text"
                  value={form.title}
                  placeholder="예: 국제 소송 전문 로펌 | 호정국제"
                  style={inputStyle}
                  onChange={(event) => updateField('title', event.target.value)}
                  onFocus={(event) => {
                    event.currentTarget.style.borderColor = '#123b63';
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="builder-seo-description">Description</label>
                <textarea
                  id="builder-seo-description"
                  value={form.description}
                  placeholder="검색 결과에 노출할 페이지 설명을 입력하세요."
                  style={textareaStyle}
                  onChange={(event) => updateField('description', event.target.value)}
                  onFocus={(event) => {
                    event.currentTarget.style.borderColor = '#123b63';
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="builder-seo-og-image">OG image URL</label>
                <input
                  id="builder-seo-og-image"
                  type="url"
                  value={form.ogImage}
                  placeholder="https://example.com/og-image.png"
                  style={inputStyle}
                  onChange={(event) => updateField('ogImage', event.target.value)}
                  onFocus={(event) => {
                    event.currentTarget.style.borderColor = '#123b63';
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              <div style={fieldStyle}>
                <label style={labelStyle} htmlFor="builder-seo-canonical">Canonical URL</label>
                <input
                  id="builder-seo-canonical"
                  type="url"
                  value={form.canonical}
                  placeholder="https://example.com/ko/p/page-slug"
                  style={inputStyle}
                  onChange={(event) => updateField('canonical', event.target.value)}
                  onFocus={(event) => {
                    event.currentTarget.style.borderColor = '#123b63';
                  }}
                  onBlur={(event) => {
                    event.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                />
              </div>

              <label style={checkboxRowStyle} htmlFor="builder-seo-noindex">
                <input
                  id="builder-seo-noindex"
                  type="checkbox"
                  checked={form.noIndex}
                  onChange={(event) => updateField('noIndex', event.target.checked)}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ ...labelStyle, color: '#0f172a' }}>noindex</span>
                  <span style={helpTextStyle}>검색 엔진이 이 페이지를 색인하지 않도록 합니다.</span>
                </div>
              </label>
            </>
          )}
        </div>

        <div style={footerStyle}>
          <span style={statusStyle}>{error ?? ''}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" style={cancelBtnStyle} onClick={onClose}>
              취소
            </button>
            <button
              type="button"
              style={saveBtnStyle}
              onClick={handleSave}
              disabled={saving || loading || !pageId}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = '#0f2f4f';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = '#123b63';
              }}
            >
              {saving ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
