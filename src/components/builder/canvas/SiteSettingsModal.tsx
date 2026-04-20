'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME, type BuilderSiteSettings, type BuilderTheme } from '@/lib/builder/site/types';

interface SiteSettingsForm {
  firmName: string;
  phone: string;
  email: string;
  address: string;
  businessHours: string;
  businessRegNumber: string;
  logo: string;
  favicon: string;
}

const EMPTY_SETTINGS: SiteSettingsForm = {
  firmName: '',
  phone: '',
  email: '',
  address: '',
  businessHours: '',
  businessRegNumber: '',
  logo: '',
  favicon: '',
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
  gap: 20,
};

const sectionStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
};

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: '0.76rem',
  fontWeight: 700,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: '#64748b',
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

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: '0.85rem',
  color: '#0f172a',
  outline: 'none',
  transition: 'border-color 150ms ease',
  boxSizing: 'border-box',
};

const footerStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
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
  background: '#116dff',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 120ms ease',
};

interface FieldDef {
  key: keyof SiteSettingsForm;
  label: string;
  placeholder: string;
  type?: string;
}

const FIELDS: FieldDef[] = [
  { key: 'firmName', label: '사무소 이름', placeholder: '예: 호정국제법률사무소' },
  { key: 'phone', label: '전화번호', placeholder: '예: +886-2-1234-5678', type: 'tel' },
  { key: 'email', label: '이메일', placeholder: '예: contact@example.com', type: 'email' },
  { key: 'address', label: '주소', placeholder: '사무소 주소' },
  { key: 'businessHours', label: '영업 시간', placeholder: '예: 월~금 09:00-18:00' },
  { key: 'businessRegNumber', label: '사업자 등록번호', placeholder: '사업자 등록번호' },
  { key: 'logo', label: '로고 URL', placeholder: 'https://example.com/logo.png', type: 'url' },
  { key: 'favicon', label: '파비콘 URL', placeholder: 'https://example.com/favicon.ico', type: 'url' },
];

function mergeTheme(theme?: Partial<BuilderTheme>): BuilderTheme {
  return {
    colors: { ...DEFAULT_THEME.colors, ...theme?.colors },
    fonts: { ...DEFAULT_THEME.fonts, ...theme?.fonts },
    radii: { ...DEFAULT_THEME.radii, ...theme?.radii },
  };
}

function toSettingsForm(settings?: Partial<BuilderSiteSettings>): SiteSettingsForm {
  return {
    firmName: settings?.firmName ?? '',
    phone: settings?.phone ?? '',
    email: settings?.email ?? '',
    address: settings?.address ?? '',
    businessHours: settings?.businessHours ?? '',
    businessRegNumber: settings?.businessRegNumber ?? '',
    logo: settings?.logo ?? '',
    favicon: settings?.favicon ?? '',
  };
}

function toSettingsPayload(settings: SiteSettingsForm): BuilderSiteSettings {
  return {
    firmName: settings.firmName,
    phone: settings.phone,
    email: settings.email,
    address: settings.address,
    businessHours: settings.businessHours,
    businessRegNumber: settings.businessRegNumber,
    logo: settings.logo,
    favicon: settings.favicon,
  };
}

function isValidHexColor(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value.trim());
}

interface SiteSettingsResponse {
  ok?: boolean;
  settings?: Partial<BuilderSiteSettings>;
  theme?: BuilderTheme;
  error?: string;
}

export default function SiteSettingsModal({
  open,
  locale,
  onSaved,
  onClose,
}: {
  open: boolean;
  locale: string;
  onSaved?: (payload: { settings: BuilderSiteSettings; theme: BuilderTheme }) => void;
  onClose: () => void;
}) {
  const [settings, setSettings] = useState<SiteSettingsForm>(EMPTY_SETTINGS);
  const [theme, setTheme] = useState<BuilderTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/builder/site/settings?locale=${encodeURIComponent(locale)}`, {
        credentials: 'same-origin',
      });
      const data = (await response.json().catch(() => ({}))) as SiteSettingsResponse;
      if (response.ok) {
        setSettings(toSettingsForm(data.settings));
        setTheme(mergeTheme(data.theme));
      } else {
        setError(data.error || '사이트 설정을 불러오지 못했습니다.');
      }
    } catch {
      setError('사이트 설정을 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    if (open) void fetchSettings();
  }, [open, fetchSettings]);

  useEffect(() => {
    if (!open) return undefined;
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const handleSave = async () => {
    if (!isValidHexColor(theme.colors.primary)) {
      setError('Primary color는 #RRGGBB 형식이어야 합니다.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        settings: toSettingsPayload(settings),
        theme,
      };
      const response = await fetch(`/api/builder/site/settings?locale=${encodeURIComponent(locale)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify(payload),
      });
      const data = (await response.json().catch(() => ({}))) as SiteSettingsResponse;
      if (!response.ok) {
        setError(data.error || '사이트 설정을 저장하지 못했습니다.');
        return;
      }

      onSaved?.({
        settings: payload.settings,
        theme: payload.theme,
      });
      onClose();
    } catch {
      setError('사이트 설정을 저장하지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (key: keyof SiteSettingsForm, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateThemeColor = (value: string) => {
    setTheme((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        primary: value,
      },
    }));
  };

  const updateThemeFont = (key: 'heading' | 'body', value: string) => {
    setTheme((prev) => ({
      ...prev,
      fonts: {
        ...prev.fonts,
        [key]: value,
      },
    }));
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
          <span style={titleStyle}>사이트 설정</span>
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
              <div style={sectionStyle}>
                <div style={sectionHeadingStyle}>기본 정보</div>
                {FIELDS.map((field) => (
                  <div key={field.key} style={fieldStyle}>
                    <label style={labelStyle}>{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      value={settings[field.key]}
                      placeholder={field.placeholder}
                      style={inputStyle}
                      onChange={(event) => updateField(field.key, event.target.value)}
                      onFocus={(event) => {
                        event.currentTarget.style.borderColor = '#116dff';
                      }}
                      onBlur={(event) => {
                        event.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    />
                  </div>
                ))}
              </div>

              <div style={sectionStyle}>
                <div style={sectionHeadingStyle}>테마</div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Primary color</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={isValidHexColor(theme.colors.primary) ? theme.colors.primary : DEFAULT_THEME.colors.primary}
                      style={{ width: 56, height: 38, padding: 4, border: '1px solid #e2e8f0', borderRadius: 8, background: '#fff', cursor: 'pointer' }}
                      onChange={(event) => updateThemeColor(event.target.value)}
                    />
                    <input
                      type="text"
                      value={theme.colors.primary}
                      placeholder="#123B63"
                      style={inputStyle}
                      onChange={(event) => updateThemeColor(event.target.value)}
                      onFocus={(event) => {
                        event.currentTarget.style.borderColor = '#116dff';
                      }}
                      onBlur={(event) => {
                        event.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    />
                  </div>
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Heading font</label>
                  <input
                    type="text"
                    value={theme.fonts.heading}
                    placeholder="예: Noto Sans KR, sans-serif"
                    style={inputStyle}
                    onChange={(event) => updateThemeFont('heading', event.target.value)}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor = '#116dff';
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  />
                </div>

                <div style={fieldStyle}>
                  <label style={labelStyle}>Body font</label>
                  <input
                    type="text"
                    value={theme.fonts.body}
                    placeholder="예: Noto Sans KR, sans-serif"
                    style={inputStyle}
                    onChange={(event) => updateThemeFont('body', event.target.value)}
                    onFocus={(event) => {
                      event.currentTarget.style.borderColor = '#116dff';
                    }}
                    onBlur={(event) => {
                      event.currentTarget.style.borderColor = '#e2e8f0';
                    }}
                  />
                </div>
              </div>
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
              disabled={saving || loading}
              onMouseEnter={(event) => {
                event.currentTarget.style.background = '#0b5cdb';
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background = '#116dff';
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
