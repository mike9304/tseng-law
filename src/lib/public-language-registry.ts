import {
  PUBLIC_LANGUAGE_AUTONYMS,
  type PublicLocale8,
} from '@/lib/public-guidance';

export type LanguageRegion = 'asia-pacific' | 'middle-east' | 'europe' | 'americas';

export interface PublicLanguageEntry {
  locale: PublicLocale8;
  autonym: string;
  englishName: string;
  region: LanguageRegion;
  /** Native-script region/country label in Tesla's country-name slot. */
  regionLabel: string;
  rtl?: boolean;
}

export const LANGUAGE_REGION_ORDER: readonly LanguageRegion[] = [
  'asia-pacific',
  'middle-east',
  'europe',
  'americas',
];

export const PUBLIC_LANGUAGE_REGISTRY: readonly PublicLanguageEntry[] = [
  {
    locale: 'ko',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.ko,
    englishName: 'Korean',
    region: 'asia-pacific',
    regionLabel: '대한민국',
  },
  {
    locale: 'zh-hant',
    autonym: PUBLIC_LANGUAGE_AUTONYMS['zh-hant'],
    englishName: 'Traditional Chinese',
    region: 'asia-pacific',
    regionLabel: '台灣',
  },
  {
    locale: 'ja',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.ja,
    englishName: 'Japanese',
    region: 'asia-pacific',
    regionLabel: '日本',
  },
  {
    locale: 'vi',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.vi,
    englishName: 'Vietnamese',
    region: 'asia-pacific',
    regionLabel: 'Việt Nam',
  },
  {
    locale: 'id',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.id,
    englishName: 'Indonesian',
    region: 'asia-pacific',
    regionLabel: 'Indonesia',
  },
  {
    locale: 'th',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.th,
    englishName: 'Thai',
    region: 'asia-pacific',
    regionLabel: 'ประเทศไทย',
  },
  {
    locale: 'fil',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.fil,
    englishName: 'Filipino',
    region: 'asia-pacific',
    regionLabel: 'Pilipinas',
  },
  {
    locale: 'ar',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.ar,
    englishName: 'Arabic',
    region: 'middle-east',
    regionLabel: 'الشرق الأوسط',
    rtl: true,
  },
  {
    locale: 'de',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.de,
    englishName: 'German',
    region: 'europe',
    regionLabel: 'Deutschsprachiger Raum',
  },
  {
    locale: 'es',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.es,
    englishName: 'Spanish',
    region: 'europe',
    regionLabel: 'España y América Latina',
  },
  {
    locale: 'en',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.en,
    englishName: 'English',
    region: 'americas',
    regionLabel: 'Global / English',
  },
];

export const LANGUAGE_REGION_LABELS: Record<PublicLocale8, Record<LanguageRegion, string>> = {
  ko: {
    'asia-pacific': '아시아·태평양',
    'middle-east': '중동',
    europe: '유럽',
    americas: '아메리카',
  },
  'zh-hant': {
    'asia-pacific': '亞太地區',
    'middle-east': '中東',
    europe: '歐洲',
    americas: '美洲',
  },
  en: {
    'asia-pacific': 'Asia Pacific',
    'middle-east': 'Middle East',
    europe: 'Europe',
    americas: 'Americas',
  },
  ja: {
    'asia-pacific': 'アジア太平洋',
    'middle-east': '中東',
    europe: 'ヨーロッパ',
    americas: 'アメリカ大陸',
  },
  vi: {
    'asia-pacific': 'Châu Á – Thái Bình Dương',
    'middle-east': 'Trung Đông',
    europe: 'Châu Âu',
    americas: 'Châu Mỹ',
  },
  id: {
    'asia-pacific': 'Asia Pasifik',
    'middle-east': 'Timur Tengah',
    europe: 'Eropa',
    americas: 'Amerika',
  },
  th: {
    'asia-pacific': 'เอเชียแปซิฟิก',
    'middle-east': 'ตะวันออกกลาง',
    europe: 'ยุโรป',
    americas: 'ทวีปอเมริกา',
  },
  fil: {
    'asia-pacific': 'Asya Pasipiko',
    'middle-east': 'Gitnang Silangan',
    europe: 'Europa',
    americas: 'Amerika',
  },
  ar: {
    'asia-pacific': 'آسيا والمحيط الهادئ',
    'middle-east': 'الشرق الأوسط',
    europe: 'أوروبا',
    americas: 'الأمريكتان',
  },
  de: {
    'asia-pacific': 'Asien-Pazifik',
    'middle-east': 'Naher Osten',
    europe: 'Europa',
    americas: 'Amerika',
  },
  es: {
    'asia-pacific': 'Asia-Pacífico',
    'middle-east': 'Oriente Medio',
    europe: 'Europa',
    americas: 'América',
  },
};

export const LANGUAGE_PICKER_COPY: Record<
  PublicLocale8,
  { open: string; title: string; close: string; current: string }
> = {
  ko: {
    open: '지역 및 언어 선택',
    title: '지역과 언어를 선택하세요',
    close: '닫기',
    current: '현재 언어',
  },
  'zh-hant': {
    open: '選擇地區與語言',
    title: '請選擇您的地區與語言',
    close: '關閉',
    current: '目前語言',
  },
  en: {
    open: 'Select region and language',
    title: 'Select your region and language',
    close: 'Close',
    current: 'Current language',
  },
  ja: {
    open: '地域と言語を選択',
    title: '地域と言語を選択してください',
    close: '閉じる',
    current: '現在の言語',
  },
  vi: {
    open: 'Chọn khu vực và ngôn ngữ',
    title: 'Quý vị hãy chọn khu vực và ngôn ngữ',
    close: 'Đóng',
    current: 'Ngôn ngữ hiện tại',
  },
  id: {
    open: 'Pilih wilayah dan bahasa',
    title: 'Silakan pilih wilayah dan bahasa',
    close: 'Tutup',
    current: 'Bahasa saat ini',
  },
  th: {
    open: 'เลือกภูมิภาคและภาษา',
    title: 'กรุณาเลือกภูมิภาคและภาษา',
    close: 'ปิด',
    current: 'ภาษาปัจจุบัน',
  },
  fil: {
    open: 'Pumili ng rehiyon at wika',
    title: 'Mangyaring pumili ng rehiyon at wika',
    close: 'Isara',
    current: 'Kasalukuyang wika',
  },
  ar: {
    open: 'اختيار المنطقة واللغة',
    title: 'يرجى اختيار منطقتكم ولغتكم',
    close: 'إغلاق',
    current: 'اللغة الحالية',
  },
  de: {
    open: 'Region und Sprache wählen',
    title: 'Bitte wählen Sie Ihre Region und Sprache',
    close: 'Schließen',
    current: 'Aktuelle Sprache',
  },
  es: {
    open: 'Seleccionar región e idioma',
    title: 'Seleccione su región e idioma',
    close: 'Cerrar',
    current: 'Idioma actual',
  },
};

export function publicLanguageHtmlLang(locale: PublicLocale8): string {
  return locale === 'zh-hant' ? 'zh-Hant' : locale;
}

export function groupedPublicLanguages(uiLocale: PublicLocale8): ReadonlyArray<{
  region: LanguageRegion;
  heading: string;
  entries: readonly PublicLanguageEntry[];
}> {
  return LANGUAGE_REGION_ORDER.flatMap((region) => {
    const entries = PUBLIC_LANGUAGE_REGISTRY.filter((entry) => entry.region === region);
    if (entries.length === 0) return [];
    return [
      {
        region,
        heading: LANGUAGE_REGION_LABELS[uiLocale][region],
        entries,
      },
    ];
  });
}
