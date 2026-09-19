import type { GuidanceLocale } from '@/data/international-guidance-content';

/**
 * Display copy for the office band rendered on the guidance-locale `contact`
 * page (vi/id/th/fil/ar).
 *
 * Same rule as `international-guidance-team.ts`: display strings only. The
 * addresses, phone numbers, fax numbers, map links and photographs are read
 * from `taiwanOfficeData.en` / `taipeiPhotos` in `OfficeMapTabs`, the canonical
 * record, and are never retyped here. Only the city names, the field labels and
 * the photo alt-text are written in the page language.
 *
 * The band states no opening hours, no appointment, and no reply time, because
 * the canonical record states none.
 */

export type GuidanceOfficeId = 'taipei' | 'taichung' | 'kaohsiung' | 'pingtung';

export interface GuidanceOfficeCopy {
  label: string;
  title: string;
  description: string;
  /** Singular kicker above an office card ("Office" on /en). */
  officeLabel: string;
  phoneLabel: string;
  faxLabel: string;
  mapLinkLabel: string;
  /** Kicker over the embedded Google map preview panel. */
  mapPreviewLabel: string;
  /** Tab-panel labels for the Korea office block the English tabs also render. */
  koreaOfficeTitle: string;
  koreaAddressCardLabel: string;
  koreaMapLinkLabel: string;
  /** Word after the Google review count ("reviews" on /en). */
  reviewCountWord: string;
  /** alt text for `/images/office/taipei-01..03.jpg`, in that order. */
  photoAlts: [string, string, string];
  officeTitles: Record<GuidanceOfficeId, string>;
}

export const guidanceOfficeCopy: Record<GuidanceLocale, GuidanceOfficeCopy> = {
  vi: {
    label: 'OFFICES',
    title: 'Văn phòng',
    description: 'Địa chỉ các văn phòng tại Đài Loan của Hovering International Law Firm.',
    officeLabel: 'Văn phòng',
    mapPreviewLabel: 'Xem trước bản đồ',
    koreaOfficeTitle: 'Văn phòng Hàn Quốc',
    koreaAddressCardLabel: 'Địa chỉ văn phòng Hàn Quốc',
    koreaMapLinkLabel: 'Xem trên Naver Map',
    reviewCountWord: 'đánh giá',
    phoneLabel: 'Điện thoại',
    faxLabel: 'Fax',
    mapLinkLabel: 'Xem trên bản đồ',
    photoAlts: [
      'Phòng tiếp khách của văn phòng Đài Bắc, Hovering International Law Firm',
      'Phòng làm việc của luật sư tại văn phòng Đài Bắc, Hovering International Law Firm',
      'Phòng họp của văn phòng Đài Bắc, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Đài Bắc',
      taichung: 'Đài Trung',
      kaohsiung: 'Cao Hùng',
      pingtung: 'Bình Đông',
    },
  },
  id: {
    label: 'OFFICES',
    title: 'Kantor',
    description: 'Alamat kantor Hovering International Law Firm di Taiwan.',
    officeLabel: 'Kantor',
    mapPreviewLabel: 'Pratinjau peta',
    koreaOfficeTitle: 'Kantor Korea',
    koreaAddressCardLabel: 'Alamat kantor Korea',
    koreaMapLinkLabel: 'Lihat di Naver Map',
    reviewCountWord: 'ulasan',
    phoneLabel: 'Telepon',
    faxLabel: 'Faks',
    mapLinkLabel: 'Lihat di peta',
    photoAlts: [
      'Ruang tamu kantor Taipei, Hovering International Law Firm',
      'Ruang kerja advokat di kantor Taipei, Hovering International Law Firm',
      'Ruang rapat kantor Taipei, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipei',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  th: {
    label: 'OFFICES',
    title: 'สำนักงาน',
    description: 'ที่อยู่สำนักงานของ Hovering International Law Firm ในไต้หวัน',
    officeLabel: 'สำนักงาน',
    mapPreviewLabel: 'ตัวอย่างแผนที่',
    koreaOfficeTitle: 'สำนักงานเกาหลี',
    koreaAddressCardLabel: 'ที่อยู่สำนักงานเกาหลี',
    koreaMapLinkLabel: 'ดูบน Naver Map',
    reviewCountWord: 'รีวิว',
    phoneLabel: 'โทรศัพท์',
    faxLabel: 'โทรสาร',
    mapLinkLabel: 'ดูบนแผนที่',
    photoAlts: [
      'ห้องรับรองของสำนักงานไทเป Hovering International Law Firm',
      'ห้องทำงานของทนายความที่สำนักงานไทเป Hovering International Law Firm',
      'ห้องประชุมของสำนักงานไทเป Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'ไทเป',
      taichung: 'ไถจง',
      kaohsiung: 'เกาสง',
      pingtung: 'ผิงตง',
    },
  },
  fil: {
    label: 'OFFICES',
    title: 'Mga tanggapan',
    description: 'Mga address ng tanggapan ng Hovering International Law Firm sa Taiwan.',
    officeLabel: 'Tanggapan',
    mapPreviewLabel: 'Paunang tanaw ng mapa',
    koreaOfficeTitle: 'Tanggapan sa Korea',
    koreaAddressCardLabel: 'Address ng tanggapan sa Korea',
    koreaMapLinkLabel: 'Tingnan sa Naver Map',
    reviewCountWord: 'pagsusuri',
    phoneLabel: 'Telepono',
    faxLabel: 'Fax',
    mapLinkLabel: 'Tingnan sa mapa',
    photoAlts: [
      'Silid-tanggapan ng tanggapan sa Taipei, Hovering International Law Firm',
      'Silid-trabaho ng abogado sa tanggapan sa Taipei, Hovering International Law Firm',
      'Silid-pulungan ng tanggapan sa Taipei, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipei',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  ar: {
    label: 'OFFICES',
    title: 'المكاتب',
    description: 'عناوين مكاتب Hovering International Law Firm في تايوان.',
    officeLabel: 'مكتب',
    mapPreviewLabel: 'معاينة الخريطة',
    koreaOfficeTitle: 'مكتب كوريا',
    koreaAddressCardLabel: 'عنوان مكتب كوريا',
    koreaMapLinkLabel: 'عرض على Naver Map',
    reviewCountWord: 'تقييمات',
    phoneLabel: 'الهاتف',
    faxLabel: 'الفاكس',
    mapLinkLabel: 'عرض على الخريطة',
    photoAlts: [
      'غرفة استقبال مكتب تايبيه، Hovering International Law Firm',
      'غرفة عمل المحامين في مكتب تايبيه، Hovering International Law Firm',
      'قاعة الاجتماعات في مكتب تايبيه، Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'تايبيه',
      taichung: 'تايتشونغ',
      kaohsiung: 'كاوهسيونغ',
      pingtung: 'بينغتونغ',
    },
  },
  de: {
    label: 'OFFICES',
    title: 'Büros',
    description: 'Anschriften der Büros von Hovering International Law Firm in Taiwan.',
    officeLabel: 'Büro',
    mapPreviewLabel: 'Kartenvorschau',
    koreaOfficeTitle: 'Büro Korea',
    koreaAddressCardLabel: 'Anschrift des Büros in Korea',
    koreaMapLinkLabel: 'In Naver Map ansehen',
    reviewCountWord: 'Bewertungen',
    phoneLabel: 'Telefon',
    faxLabel: 'Fax',
    mapLinkLabel: 'Auf der Karte ansehen',
    photoAlts: [
      'Empfangsraum des Büros Taipeh, Hovering International Law Firm',
      'Anwaltszimmer im Büro Taipeh, Hovering International Law Firm',
      'Besprechungsraum im Büro Taipeh, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipeh',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  es: {
    label: 'OFFICES',
    title: 'Oficinas',
    description: 'Direcciones de las oficinas de Hovering International Law Firm en Taiwán.',
    officeLabel: 'Oficina',
    mapPreviewLabel: 'Vista previa del mapa',
    koreaOfficeTitle: 'Oficina de Corea',
    koreaAddressCardLabel: 'Dirección de la oficina de Corea',
    koreaMapLinkLabel: 'Ver en Naver Map',
    reviewCountWord: 'opiniones',
    phoneLabel: 'Teléfono',
    faxLabel: 'Fax',
    mapLinkLabel: 'Ver en el mapa',
    photoAlts: [
      'Sala de recepción de la oficina de Taipéi, Hovering International Law Firm',
      'Despacho de abogados en la oficina de Taipéi, Hovering International Law Firm',
      'Sala de reuniones de la oficina de Taipéi, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipéi',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  fr: {
    label: 'OFFICES',
    title: 'Bureaux',
    description: 'Adresses des bureaux de Hovering International Law Firm à Taïwan.',
    officeLabel: 'Bureau',
    mapPreviewLabel: 'Aperçu de la carte',
    koreaOfficeTitle: 'Bureau Corée',
    koreaAddressCardLabel: 'Adresse du bureau en Corée',
    koreaMapLinkLabel: 'Voir sur Naver Map',
    reviewCountWord: 'avis',
    phoneLabel: 'Téléphone',
    faxLabel: 'Fax',
    mapLinkLabel: 'Voir sur la carte',
    photoAlts: [
      'Salle d’accueil du bureau de Taipei, Hovering International Law Firm',
      'Cabinet d’avocat au bureau de Taipei, Hovering International Law Firm',
      'Salle de réunion du bureau de Taipei, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipei',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  pt: {
    label: 'OFFICES',
    title: 'Escritórios',
    description: 'Moradas dos escritórios de Hovering International Law Firm em Taiwan.',
    officeLabel: 'Escritório',
    mapPreviewLabel: 'Pré-visualização do mapa',
    koreaOfficeTitle: 'Escritório da Coreia',
    koreaAddressCardLabel: 'Morada do escritório da Coreia',
    koreaMapLinkLabel: 'Ver no Naver Map',
    reviewCountWord: 'opiniões',
    phoneLabel: 'Telefone',
    faxLabel: 'Fax',
    mapLinkLabel: 'Ver no mapa',
    photoAlts: [
      'Sala de receção do escritório de Taipé, Hovering International Law Firm',
      'Gabinete de advocacia no escritório de Taipé, Hovering International Law Firm',
      'Sala de reuniões do escritório de Taipé, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipé',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  'zh-hans': {
    label: 'OFFICES',
    title: '办公室',
    description: 'Hovering International Law Firm 在台湾的办公室地址。',
    officeLabel: '办公室',
    mapPreviewLabel: '地图预览',
    koreaOfficeTitle: '韩国办公室',
    koreaAddressCardLabel: '韩国办公室地址',
    koreaMapLinkLabel: '在 Naver Map 查看',
    reviewCountWord: '评价',
    phoneLabel: '电话',
    faxLabel: '传真',
    mapLinkLabel: '在地图上查看',
    photoAlts: [
      'Hovering International Law Firm 台北办公室接待室',
      'Hovering International Law Firm 台北办公室律师室',
      'Hovering International Law Firm 台北办公室会议室',
    ],
    officeTitles: {
      taipei: '台北',
      taichung: '台中',
      kaohsiung: '高雄',
      pingtung: '屏东',
    },
  },
  ms: {
    label: 'OFFICES',
    title: 'Pejabat',
    description: 'Alamat pejabat Hovering International Law Firm di Taiwan.',
    officeLabel: 'Pejabat',
    mapPreviewLabel: 'Pratonton peta',
    koreaOfficeTitle: 'Pejabat Korea',
    koreaAddressCardLabel: 'Alamat pejabat Korea',
    koreaMapLinkLabel: 'Lihat di Naver Map',
    reviewCountWord: 'ulasan',
    phoneLabel: 'Telefon',
    faxLabel: 'Faks',
    mapLinkLabel: 'Lihat di peta',
    photoAlts: [
      'Bilik penerimaan pejabat Taipei, Hovering International Law Firm',
      'Bilik peguam di pejabat Taipei, Hovering International Law Firm',
      'Bilik mesyuarat pejabat Taipei, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipei',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  ru: {
    label: 'OFFICES',
    title: 'Офисы',
    description: 'Адреса офисов Hovering International Law Firm на Тайване.',
    officeLabel: 'Офис',
    mapPreviewLabel: 'Предпросмотр карты',
    koreaOfficeTitle: 'Офис Корея',
    koreaAddressCardLabel: 'Адрес офиса в Корее',
    koreaMapLinkLabel: 'Смотреть в Naver Map',
    reviewCountWord: 'отзывов',
    phoneLabel: 'Телефон',
    faxLabel: 'Факс',
    mapLinkLabel: 'Смотреть на карте',
    photoAlts: [
      'Приёмная офиса в Тайбэе, Hovering International Law Firm',
      'Кабинет адвоката в офисе в Тайбэе, Hovering International Law Firm',
      'Переговорная офиса в Тайбэе, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Тайбэй',
      taichung: 'Тайчжун',
      kaohsiung: 'Гаосюн',
      pingtung: 'Пиндун',
    },
  },
  tr: {
    label: 'OFFICES',
    title: 'Ofisler',
    description: 'Hovering International Law Firm’in Tayvan’daki ofis adresleri.',
    officeLabel: 'Ofis',
    mapPreviewLabel: 'Harita önizlemesi',
    koreaOfficeTitle: 'Kore ofisi',
    koreaAddressCardLabel: 'Kore ofisinin adresi',
    koreaMapLinkLabel: 'Naver Map’te görün',
    reviewCountWord: 'değerlendirme',
    phoneLabel: 'Telefon',
    faxLabel: 'Faks',
    mapLinkLabel: 'Haritada görün',
    photoAlts: [
      'Taipei ofisinin kabul salonu, Hovering International Law Firm',
      'Taipei ofisindeki avukat odası, Hovering International Law Firm',
      'Taipei ofisinin toplantı salonu, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipei',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  it: {
    label: 'OFFICES',
    title: 'Uffici',
    description: 'Indirizzi degli uffici di Hovering International Law Firm a Taiwan.',
    officeLabel: 'Ufficio',
    mapPreviewLabel: 'Anteprima della mappa',
    koreaOfficeTitle: 'Ufficio Corea',
    koreaAddressCardLabel: 'Indirizzo dell’ufficio in Corea',
    koreaMapLinkLabel: 'Vedere su Naver Map',
    reviewCountWord: 'recensioni',
    phoneLabel: 'Telefono',
    faxLabel: 'Fax',
    mapLinkLabel: 'Vedere sulla mappa',
    photoAlts: [
      'Sala di accoglienza dell’ufficio Taipei, Hovering International Law Firm',
      'Studio dell’avvocata o dell’avvocato nell’ufficio Taipei, Hovering International Law Firm',
      'Sala riunioni dell’ufficio Taipei, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipei',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  nl: {
    label: 'OFFICES',
    title: 'Kantoren',
    description: 'Adressen van de kantoren van Hovering International Law Firm in Taiwan.',
    officeLabel: 'Kantoor',
    mapPreviewLabel: 'Kaartvoorvertoning',
    koreaOfficeTitle: 'Kantoor Korea',
    koreaAddressCardLabel: 'Adres van het kantoor in Korea',
    koreaMapLinkLabel: 'Bekijken in Naver Map',
    reviewCountWord: 'beoordelingen',
    phoneLabel: 'Telefoon',
    faxLabel: 'Fax',
    mapLinkLabel: 'Op de kaart bekijken',
    photoAlts: [
      'Ontvangstruimte van het kantoor Taipei, Hovering International Law Firm',
      'Advocatenkamer in het kantoor Taipei, Hovering International Law Firm',
      'Vergaderruimte in het kantoor Taipei, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipei',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
  pl: {
    label: 'OFFICES',
    title: 'Biura',
    description: 'Adresy biur Hovering International Law Firm na Tajwanie.',
    officeLabel: 'Biuro',
    mapPreviewLabel: 'Podgląd mapy',
    koreaOfficeTitle: 'Biuro w Korei',
    koreaAddressCardLabel: 'Adres biura w Korei',
    koreaMapLinkLabel: 'Zobaczyć w Naver Map',
    reviewCountWord: 'opinii',
    phoneLabel: 'Telefon',
    faxLabel: 'Faks',
    mapLinkLabel: 'Zobaczyć na mapie',
    photoAlts: [
      'Hol przyjęć biura Taipei, Hovering International Law Firm',
      'Gabinet adwokata w biurze Taipei, Hovering International Law Firm',
      'Sala konferencyjna biura Taipei, Hovering International Law Firm',
    ],
    officeTitles: {
      taipei: 'Taipei',
      taichung: 'Taichung',
      kaohsiung: 'Kaohsiung',
      pingtung: 'Pingtung',
    },
  },
};

/**
 * Footer chrome labels for the guidance locales.
 *
 * The footer is shared across all eight public locales and falls back to the
 * English site content for the four guidance ones, which left six English
 * strings on an otherwise fully localized page: the "Offices" heading and its
 * quick-link aria-label, the office names, "Follow", "Sitemap" and
 * "Copy email address". These are chrome labels only — no address, phone
 * number, e-mail address or link target is restated here.
 */
export interface GuidanceFooterCopy {
  officeLabel: string;
  officeQuickLinksLabel: string;
  followLabel: string;
  blogLabel: string;
  websiteLabel: string;
  sitemapLabel: string;
  copyEmailLabel: string;
  emailCopiedMessage: string;
  officialConsultationEmailLabel: string;
}

export const guidanceFooterCopy: Record<GuidanceLocale, GuidanceFooterCopy> = {
  vi: {
    officeLabel: 'Văn phòng',
    officeQuickLinksLabel: 'Liên kết nhanh đến các văn phòng',
    followLabel: 'Theo dõi',
    blogLabel: 'Blog',
    websiteLabel: 'Trang web chính thức',
    sitemapLabel: 'Sơ đồ trang web',
    copyEmailLabel: 'Sao chép địa chỉ email',
    emailCopiedMessage: 'Đã sao chép địa chỉ email.',
    officialConsultationEmailLabel: 'Email tư vấn chính thức',
  },
  id: {
    officeLabel: 'Kantor',
    officeQuickLinksLabel: 'Tautan cepat ke lokasi kantor',
    followLabel: 'Ikuti',
    blogLabel: 'Blog',
    websiteLabel: 'Situs resmi',
    sitemapLabel: 'Peta situs',
    copyEmailLabel: 'Salin alamat email',
    emailCopiedMessage: 'Alamat email telah disalin.',
    officialConsultationEmailLabel: 'Email resmi untuk konsultasi',
  },
  th: {
    officeLabel: 'สำนักงาน',
    officeQuickLinksLabel: 'ลิงก์ลัดไปยังที่ตั้งสำนักงาน',
    followLabel: 'ติดตาม',
    blogLabel: 'บล็อก',
    websiteLabel: 'เว็บไซต์ทางการ',
    sitemapLabel: 'แผนผังเว็บไซต์',
    copyEmailLabel: 'คัดลอกที่อยู่อีเมล',
    emailCopiedMessage: 'คัดลอกที่อยู่อีเมลแล้ว',
    officialConsultationEmailLabel: 'อีเมลทางการสำหรับการปรึกษา',
  },
  fil: {
    officeLabel: 'Mga tanggapan',
    officeQuickLinksLabel: 'Mabilisang link sa mga tanggapan',
    followLabel: 'Sundan',
    blogLabel: 'Blog',
    websiteLabel: 'Opisyal na website',
    sitemapLabel: 'Mapa ng site',
    copyEmailLabel: 'Kopyahin ang email address',
    emailCopiedMessage: 'Nakopya ang email address.',
    officialConsultationEmailLabel: 'Opisyal na email para sa konsultasyon',
  },
  ar: {
    officeLabel: 'المكاتب',
    officeQuickLinksLabel: 'روابط سريعة إلى مواقع المكاتب',
    followLabel: 'تابعنا',
    blogLabel: 'المدونة',
    websiteLabel: 'الموقع الرسمي',
    sitemapLabel: 'خريطة الموقع',
    copyEmailLabel: 'نسخ عنوان البريد الإلكتروني',
    emailCopiedMessage: 'تم نسخ عنوان البريد الإلكتروني.',
    officialConsultationEmailLabel: 'البريد الإلكتروني الرسمي للاستشارات',
  },
  de: {
    officeLabel: 'Büros',
    officeQuickLinksLabel: 'Schnellzugriff auf die Bürostandorte',
    followLabel: 'Folgen',
    blogLabel: 'Blog',
    websiteLabel: 'Offizielle Website',
    sitemapLabel: 'Sitemap',
    copyEmailLabel: 'E-Mail-Adresse kopieren',
    emailCopiedMessage: 'E-Mail-Adresse wurde kopiert.',
    officialConsultationEmailLabel: 'Offizielle E-Mail für die Beratung',
  },
  es: {
    officeLabel: 'Oficinas',
    officeQuickLinksLabel: 'Enlaces rápidos a las oficinas',
    followLabel: 'Seguir',
    blogLabel: 'Blog',
    websiteLabel: 'Sitio oficial',
    sitemapLabel: 'Mapa del sitio',
    copyEmailLabel: 'Copiar la dirección de correo',
    emailCopiedMessage: 'Se copió la dirección de correo.',
    officialConsultationEmailLabel: 'Correo oficial para consultas',
  },
  fr: {
    officeLabel: 'Bureaux',
    officeQuickLinksLabel: 'Accès rapide aux bureaux',
    followLabel: 'Suivre',
    blogLabel: 'Blog',
    websiteLabel: 'Site officiel',
    sitemapLabel: 'Plan du site',
    copyEmailLabel: 'Copier l’adresse de courrier',
    emailCopiedMessage: 'L’adresse de courrier a été copiée.',
    officialConsultationEmailLabel: 'Courrier officiel pour la consultation',
  },
  pt: {
    officeLabel: 'Escritórios',
    officeQuickLinksLabel: 'Ligações rápidas para os escritórios',
    followLabel: 'Seguir',
    blogLabel: 'Blog',
    websiteLabel: 'Sítio oficial',
    sitemapLabel: 'Mapa do sítio',
    copyEmailLabel: 'Copiar o endereço de correio',
    emailCopiedMessage: 'O endereço de correio foi copiado.',
    officialConsultationEmailLabel: 'Correio oficial para consultas',
  },
  'zh-hans': {
    officeLabel: '办公室',
    officeQuickLinksLabel: '办公室快捷链接',
    followLabel: '关注',
    blogLabel: '博客',
    websiteLabel: '官方网站',
    sitemapLabel: '网站地图',
    copyEmailLabel: '复制电子邮件地址',
    emailCopiedMessage: '已复制电子邮件地址。',
    officialConsultationEmailLabel: '正式咨询电子邮件',
  },
  ms: {
    officeLabel: 'Pejabat',
    officeQuickLinksLabel: 'Pautan pantas ke pejabat',
    followLabel: 'Ikuti',
    blogLabel: 'Blog',
    websiteLabel: 'Laman rasmi',
    sitemapLabel: 'Peta laman',
    copyEmailLabel: 'Salin alamat e-mel',
    emailCopiedMessage: 'Alamat e-mel telah disalin.',
    officialConsultationEmailLabel: 'E-mel rasmi untuk perundingan',
  },
  ru: {
    officeLabel: 'Офисы',
    officeQuickLinksLabel: 'Быстрые ссылки на офисы',
    followLabel: 'Подписаться',
    blogLabel: 'Блог',
    websiteLabel: 'Официальный сайт',
    sitemapLabel: 'Карта сайта',
    copyEmailLabel: 'Скопировать адрес электронной почты',
    emailCopiedMessage: 'Адрес электронной почты скопирован.',
    officialConsultationEmailLabel: 'Официальная почта для консультации',
  },
  tr: {
    officeLabel: 'Ofisler',
    officeQuickLinksLabel: 'Ofislere hızlı bağlantılar',
    followLabel: 'Takip',
    blogLabel: 'Blog',
    websiteLabel: 'Resmi site',
    sitemapLabel: 'Site haritası',
    copyEmailLabel: 'E-posta adresini kopyalayın',
    emailCopiedMessage: 'E-posta adresi kopyalandı.',
    officialConsultationEmailLabel: 'Görüşme için resmi e-posta',
  },
  it: {
    officeLabel: 'Uffici',
    officeQuickLinksLabel: 'Collegamenti rapidi agli uffici',
    followLabel: 'Seguire',
    blogLabel: 'Blog',
    websiteLabel: 'Sito ufficiale',
    sitemapLabel: 'Mappa del sito',
    copyEmailLabel: 'Copiare l’indirizzo di posta elettronica',
    emailCopiedMessage: 'L’indirizzo di posta elettronica è stato copiato.',
    officialConsultationEmailLabel: 'Posta elettronica ufficiale per la consulenza',
  },
  nl: {
    officeLabel: 'Kantoren',
    officeQuickLinksLabel: 'Snelle koppelingen naar de kantoren',
    followLabel: 'Volgen',
    blogLabel: 'Blog',
    websiteLabel: 'Officiële site',
    sitemapLabel: 'Sitemap',
    copyEmailLabel: 'E-mailadres kopiëren',
    emailCopiedMessage: 'E-mailadres is gekopieerd.',
    officialConsultationEmailLabel: 'Officieel e-mailadres voor de consultatie',
  },
  pl: {
    officeLabel: 'Biura',
    officeQuickLinksLabel: 'Szybkie łącza do biur',
    followLabel: 'Obserwuj',
    blogLabel: 'Blog',
    websiteLabel: 'Oficjalna strona',
    sitemapLabel: 'Mapa witryny',
    copyEmailLabel: 'Skopiować adres poczty elektronicznej',
    emailCopiedMessage: 'Adres poczty elektronicznej został skopiowany.',
    officialConsultationEmailLabel: 'Oficjalna poczta do konsultacji',
  },
};
