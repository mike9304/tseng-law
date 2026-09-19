import {
  PUBLIC_LANGUAGE_AUTONYMS,
  type PublicLocale8,
} from '@/lib/public-guidance';

export type LanguageRegion = 'global' | 'asia-pacific' | 'middle-east' | 'europe' | 'americas';

export interface PublicLanguageEntry {
  locale: PublicLocale8;
  autonym: string;
  englishName: string;
  region: LanguageRegion;
}

export const LANGUAGE_REGION_ORDER: readonly LanguageRegion[] = [
  'global',
  'asia-pacific',
  'middle-east',
  'europe',
  'americas',
];

export const PUBLIC_LANGUAGE_REGISTRY: readonly PublicLanguageEntry[] = [
  {
    locale: 'en',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.en,
    englishName: 'English',
    region: 'global',
  },
  {
    locale: 'ko',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.ko,
    englishName: 'Korean',
    region: 'asia-pacific',
  },
  {
    locale: 'zh-hant',
    autonym: PUBLIC_LANGUAGE_AUTONYMS['zh-hant'],
    englishName: 'Traditional Chinese',
    region: 'asia-pacific',
  },
  {
    locale: 'ja',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.ja,
    englishName: 'Japanese',
    region: 'asia-pacific',
  },
  {
    locale: 'vi',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.vi,
    englishName: 'Vietnamese',
    region: 'asia-pacific',
  },
  {
    locale: 'id',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.id,
    englishName: 'Indonesian',
    region: 'asia-pacific',
  },
  {
    locale: 'th',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.th,
    englishName: 'Thai',
    region: 'asia-pacific',
  },
  {
    locale: 'fil',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.fil,
    englishName: 'Filipino',
    region: 'asia-pacific',
  },
  {
    locale: 'ar',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.ar,
    englishName: 'Arabic',
    region: 'middle-east',
  },
  {
    locale: 'de',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.de,
    englishName: 'German',
    region: 'europe',
  },
  {
    locale: 'es',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.es,
    englishName: 'Spanish',
    region: 'europe',
  },
  {
    locale: 'fr',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.fr,
    englishName: 'French',
    region: 'europe',
  },
  {
    locale: 'pt',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.pt,
    englishName: 'Portuguese',
    region: 'europe',
  },
  {
    locale: 'zh-hans',
    autonym: PUBLIC_LANGUAGE_AUTONYMS['zh-hans'],
    englishName: 'Simplified Chinese',
    region: 'asia-pacific',
  },
  {
    locale: 'ms',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.ms,
    englishName: 'Malay',
    region: 'asia-pacific',
  },
  {
    locale: 'ru',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.ru,
    englishName: 'Russian',
    region: 'europe',
  },
  {
    locale: 'tr',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.tr,
    englishName: 'Turkish',
    region: 'europe',
  },
  {
    locale: 'it',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.it,
    englishName: 'Italian',
    region: 'europe',
  },
  {
    locale: 'nl',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.nl,
    englishName: 'Dutch',
    region: 'europe',
  },
  {
    locale: 'pl',
    autonym: PUBLIC_LANGUAGE_AUTONYMS.pl,
    englishName: 'Polish',
    region: 'europe',
  },
];

export const LANGUAGE_REGION_LABELS: Record<PublicLocale8, Record<LanguageRegion, string>> = {
  ko: {
    global: '글로벌',
    'asia-pacific': '아시아·태평양',
    'middle-east': '중동',
    europe: '유럽',
    americas: '아메리카',
  },
  'zh-hant': {
    global: '全球',
    'asia-pacific': '亞太地區',
    'middle-east': '中東',
    europe: '歐洲',
    americas: '美洲',
  },
  en: {
    global: 'Global',
    'asia-pacific': 'Asia Pacific',
    'middle-east': 'Middle East',
    europe: 'Europe',
    americas: 'Americas',
  },
  ja: {
    global: 'グローバル',
    'asia-pacific': 'アジア太平洋',
    'middle-east': '中東',
    europe: 'ヨーロッパ',
    americas: 'アメリカ大陸',
  },
  vi: {
    global: 'Toàn cầu',
    'asia-pacific': 'Châu Á – Thái Bình Dương',
    'middle-east': 'Trung Đông',
    europe: 'Châu Âu',
    americas: 'Châu Mỹ',
  },
  id: {
    global: 'Global',
    'asia-pacific': 'Asia Pasifik',
    'middle-east': 'Timur Tengah',
    europe: 'Eropa',
    americas: 'Amerika',
  },
  th: {
    global: 'ทั่วโลก',
    'asia-pacific': 'เอเชียแปซิฟิก',
    'middle-east': 'ตะวันออกกลาง',
    europe: 'ยุโรป',
    americas: 'ทวีปอเมริกา',
  },
  fil: {
    global: 'Global',
    'asia-pacific': 'Asya Pasipiko',
    'middle-east': 'Gitnang Silangan',
    europe: 'Europa',
    americas: 'Amerika',
  },
  ar: {
    global: 'عالمي',
    'asia-pacific': 'آسيا والمحيط الهادئ',
    'middle-east': 'الشرق الأوسط',
    europe: 'أوروبا',
    americas: 'الأمريكتان',
  },
  de: {
    global: 'Global',
    'asia-pacific': 'Asien-Pazifik',
    'middle-east': 'Naher Osten',
    europe: 'Europa',
    americas: 'Amerika',
  },
  es: {
    global: 'Global',
    'asia-pacific': 'Asia-Pacífico',
    'middle-east': 'Oriente Medio',
    europe: 'Europa',
    americas: 'América',
  },
  fr: {
    global: 'International',
    'asia-pacific': 'Asie-Pacifique',
    'middle-east': 'Moyen-Orient',
    europe: 'Europe',
    americas: 'Amériques',
  },
  pt: {
    global: 'Global',
    'asia-pacific': 'Ásia-Pacífico',
    'middle-east': 'Médio Oriente',
    europe: 'Europa',
    americas: 'Américas',
  },
  'zh-hans': {
    global: '全球',
    'asia-pacific': '亚太地区',
    'middle-east': '中东',
    europe: '欧洲',
    americas: '美洲',
  },
  ms: {
    global: 'Global',
    'asia-pacific': 'Asia Pasifik',
    'middle-east': 'Timur Tengah',
    europe: 'Eropah',
    americas: 'Amerika',
  },
  ru: {
    global: 'Глобально',
    'asia-pacific': 'Азиатско-Тихоокеанский регион',
    'middle-east': 'Ближний Восток',
    europe: 'Европа',
    americas: 'Америка',
  },
  tr: {
    global: 'Küresel',
    'asia-pacific': 'Asya-Pasifik',
    'middle-east': 'Ortadoğu',
    europe: 'Avrupa',
    americas: 'Amerika',
  },
  it: {
    global: 'Globale',
    'asia-pacific': 'Asia-Pacifico',
    'middle-east': 'Medio Oriente',
    europe: 'Europa',
    americas: 'Americhe',
  },
  nl: {
    global: 'Globaal',
    'asia-pacific': 'Azië-Pacific',
    'middle-east': 'Midden-Oosten',
    europe: 'Europa',
    americas: 'Amerika',
  },
  pl: {
    global: 'Globalnie',
    'asia-pacific': 'Azja i Pacyfik',
    'middle-east': 'Bliski Wschód',
    europe: 'Europa',
    americas: 'Ameryki',
  },
};

export const LANGUAGE_PICKER_COPY: Record<
  PublicLocale8,
  { open: string; title: string; close: string; current: string }
> = {
  ko: {
    open: '지역 및 언어 선택',
    title: '지역과 언어를 선택해 주세요',
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
    title: 'Vui lòng chọn khu vực và ngôn ngữ của quý vị',
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
  fr: {
    open: 'Choisir la région et la langue',
    title: 'Veuillez choisir votre région et votre langue',
    close: 'Fermer',
    current: 'Langue actuelle',
  },
  pt: {
    open: 'Escolher a região e a língua',
    title: 'Escolha a sua região e a sua língua',
    close: 'Fechar',
    current: 'Língua atual',
  },
  'zh-hans': {
    open: '选择地区与语言',
    title: '请选择您的地区与语言',
    close: '关闭',
    current: '目前语言',
  },
  ms: {
    open: 'Pilih wilayah dan bahasa',
    title: 'Sila pilih wilayah dan bahasa anda',
    close: 'Tutup',
    current: 'Bahasa semasa',
  },
  ru: {
    open: 'Выбрать регион и язык',
    title: 'Выберите регион и язык',
    close: 'Закрыть',
    current: 'Текущий язык',
  },
  tr: {
    open: 'Bölge ve dil seçin',
    title: 'Lütfen bölgenizi ve dilinizi seçin',
    close: 'Kapat',
    current: 'Geçerli dil',
  },
  it: {
    open: 'Scegliere regione e lingua',
    title: 'Scelga la Sua regione e la Sua lingua',
    close: 'Chiudere',
    current: 'Lingua attuale',
  },
  nl: {
    open: 'Regio en taal kiezen',
    title: 'Kies uw regio en taal',
    close: 'Sluiten',
    current: 'Huidige taal',
  },
  pl: {
    open: 'Wybierz region i język',
    title: 'Prosimy wybrać region i język',
    close: 'Zamknij',
    current: 'Bieżący język',
  },
};

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
