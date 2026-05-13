import {
  fieldStyle,
  inputStyle,
  labelStyle,
  sectionHeadingStyle,
  sectionStyle,
} from './SiteSettingsModal.styles';

export type SiteSettingsGeneralFieldKey =
  | 'firmName'
  | 'phone'
  | 'email'
  | 'address'
  | 'businessHours'
  | 'businessRegNumber'
  | 'logo'
  | 'logoDark'
  | 'favicon'
  | 'ogImage';

type SiteSettingsGeneralValues = Record<SiteSettingsGeneralFieldKey, string>;

interface FieldDef {
  key: SiteSettingsGeneralFieldKey;
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
  { key: 'logoDark', label: '다크 로고 URL', placeholder: 'https://example.com/logo-dark.png', type: 'url' },
  { key: 'favicon', label: '파비콘 URL', placeholder: 'https://example.com/favicon.ico', type: 'url' },
  { key: 'ogImage', label: 'OG 이미지 URL', placeholder: 'https://example.com/social-card.png', type: 'url' },
];

interface SiteSettingsGeneralTabProps {
  settings: SiteSettingsGeneralValues;
  onUpdateField: (key: SiteSettingsGeneralFieldKey, value: string) => void;
}

export function SiteSettingsGeneralTab({
  settings,
  onUpdateField,
}: SiteSettingsGeneralTabProps) {
  return (
    <div style={sectionStyle}>
      <div style={sectionHeadingStyle}>기본 정보</div>
      {FIELDS.map((field) => (
        <div key={field.key} style={fieldStyle}>
          <label style={labelStyle}>{field.label}</label>
          <input
            type={field.type || 'text'}
            value={settings[field.key] ?? ''}
            placeholder={field.placeholder}
            style={inputStyle}
            onChange={(event) => onUpdateField(field.key, event.target.value)}
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
  );
}
