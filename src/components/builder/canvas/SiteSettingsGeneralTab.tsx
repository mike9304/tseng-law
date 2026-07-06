import { getSiteSettingsCopy } from './site-settings-copy';
import type { Locale } from '@/lib/locales';
import styles from './SiteSettingsGeneralTab.module.css';

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

interface SiteSettingsGeneralTabProps {
  settings: SiteSettingsGeneralValues;
  onUpdateField: (key: SiteSettingsGeneralFieldKey, value: string) => void;
  locale: Locale;
}

export function SiteSettingsGeneralTab({
  settings,
  onUpdateField,
  locale,
}: SiteSettingsGeneralTabProps) {
  const copy = getSiteSettingsCopy(locale);
  const fields = copy.general.fields as Array<{
    key: SiteSettingsGeneralFieldKey;
    label: string;
    placeholder: string;
    type?: string;
  }>;
  return (
    <div className={styles.root}>
      <div className={styles.sectionHeading}>{copy.general.heading}</div>
      {fields.map((field) => (
        <div key={field.key} className={styles.field}>
          <label className={styles.label}>{field.label}</label>
          <input
            type={field.type || 'text'}
            value={settings[field.key] ?? ''}
            placeholder={field.placeholder}
            className={styles.input}
            onChange={(event) => onUpdateField(field.key, event.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
