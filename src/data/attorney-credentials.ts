/** Facts read from the firm's official profile on 2026-11-16.
 * Role wording follows the user's 2026-10-01 zh-hant instruction, not a firm-head claim.
 * These language tests are not Korean or Japanese bar qualifications.
 */
export const ATTORNEY_CREDENTIAL_SOURCE_URL = 'https://www.hoveringlaw.com.tw/zh/wei.html';
export const zhAttorneyCredentials = [
  { label: '台灣律師', value: '曾雋崴律師｜主持律師' },
  { label: '韓文', value: '韓國語能力測驗 TOPIK 6' },
  { label: '日文', value: '日本語能力測驗 N1' },
] as const;
export const attorneyLanguageCredentials = [
  { '@type': 'EducationalOccupationalCredential', name: 'TOPIK Level 6', description: 'Test of Proficiency in Korean', credentialCategory: 'Language proficiency test' },
  { '@type': 'EducationalOccupationalCredential', name: 'JLPT N1', description: 'Japanese-Language Proficiency Test', credentialCategory: 'Language proficiency test' },
] as const;
export const zhAttorneyLanguageCredentials = [
  { '@type': 'EducationalOccupationalCredential', name: 'TOPIK 6', description: '韓國語能力測驗', credentialCategory: '語言能力測驗' },
  { '@type': 'EducationalOccupationalCredential', name: '日本語能力測驗 N1', description: '日本語能力測驗', credentialCategory: '語言能力測驗' },
] as const;
