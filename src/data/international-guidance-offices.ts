import type { GuidanceLocale } from '@/data/international-guidance-content';

/**
 * Display copy for the office band rendered on the guidance-locale `contact`
 * page (vi/id/th/fil).
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
    mapPreviewLabel: 'Preview ng mapa',
    koreaOfficeTitle: 'Tanggapan sa Korea',
    koreaAddressCardLabel: 'Address ng tanggapan sa Korea',
    koreaMapLinkLabel: 'Tingnan sa Naver Map',
    reviewCountWord: 'review',
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
    copyEmailLabel: 'Salin alamat surel',
    emailCopiedMessage: 'Alamat surel telah disalin.',
    officialConsultationEmailLabel: 'Surel resmi untuk konsultasi',
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
};
