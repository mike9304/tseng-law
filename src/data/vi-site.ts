import type { ZhHantMonoIconName } from '@/components/zh-hant-icons/ZhHantMonoIcon';

/** Presentation copy only. People, offices, service detail and disclosures stay in their canonical packs. */
export const viSiteCopy = {
  home: {
    title: 'Dịch vụ pháp lý\ntại Đài Loan.',
    description: 'Tư vấn và giải quyết tranh chấp cho cá nhân, gia đình và doanh nghiệp theo pháp luật Đài Loan.',
    audience: 'Thông tin bằng tiếng Việt dành cho quý vị đang làm việc, học tập, sinh sống hoặc kinh doanh tại Đài Loan.',
    servicesAction: 'Các lĩnh vực hỗ trợ',
    articlesAction: 'Bài viết pháp luật',
    issuesAction: 'Pháp luật qua tin tức',
    teamAction: 'Luật sư và đội ngũ',
  },
  services: {
    title: 'Công việc, gia đình và kinh doanh',
    description: 'Tư vấn và giải quyết tranh chấp về lao động, gia đình, dân sự, hình sự, đầu tư và sở hữu trí tuệ.',
    detailAction: 'Phạm vi hỗ trợ',
    allAction: 'Xem các dịch vụ',
    scopeTitle: 'Phạm vi của từng vụ việc',
    criminalAction: 'Bài viết về tố tụng hình sự',
  },
  columns: {
    title: 'Pháp luật Đài Loan, bằng tiếng Việt',
    description: 'Bài viết về những vấn đề pháp lý trong đời sống và hoạt động kinh doanh tại Đài Loan.',
    allAction: 'Tất cả bài viết',
    readAction: 'Đọc bài viết',
    issueTitle: 'Pháp luật qua tin tức',
    issueDescription: 'Tin tức về Đài Loan và Việt Nam cùng những vấn đề pháp lý liên quan.',
    issueAction: 'Xem chuyên mục',
  },
  team: {
    title: 'Luật sư Wei Tseng và đội ngũ',
    description: 'Đội ngũ xử lý các vấn đề pháp luật Đài Loan và vụ việc giữa Hàn Quốc và Đài Loan.',
    action: 'Tìm hiểu đội ngũ',
    aboutAction: 'Về văn phòng',
  },
  faq: {
    title: 'Trao đổi với văn phòng',
    allAction: 'Các câu hỏi thường gặp',
  },
  offices: {
    title: 'Các văn phòng tại Đài Loan',
    description: 'Địa chỉ và đường đi tới văn phòng tại Đài Bắc, Đài Trung, Cao Hùng và Bình Đông.',
    action: 'Địa chỉ và bản đồ',
  },
  contact: {
    title: 'Trao đổi về vụ việc của quý vị',
    description: 'Quý vị có thể gửi một bản tóm tắt về vụ việc, mối liên hệ với Đài Loan và thời hạn đang cần giải quyết. Phạm vi công việc và chi phí được xác nhận riêng trước khi bắt đầu.',
    emailLabel: 'Email liên hệ',
    disclosureLabel: 'Ngôn ngữ và việc tiếp nhận yêu cầu',
    formAction: 'Biểu mẫu liên hệ',
    privacyAction: 'Cách xử lý thông tin cá nhân',
    preparationTitle: 'Nội dung trao đổi ban đầu',
    receiptTitle: 'Sau khi gửi yêu cầu',
    officeAction: 'Địa chỉ văn phòng',
  },
  navigation: {
    breadcrumbLabel: 'Đường dẫn trang',
    pageContents: 'Nội dung trang',
    serviceContents: 'Lĩnh vực dịch vụ',
    backHome: 'Trang chủ',
  },
} as const;

export type ViServiceId = 'employment' | 'family' | 'civil' | 'criminal' | 'business' | 'intellectual-property';

export interface ViServicePresentation {
  id: ViServiceId;
  sectionIndex: number;
  title: string;
  summary: string;
  icon: ZhHantMonoIconName;
}

/** Order prioritizes common personal matters without expanding the published six service areas. */
export const viServicePresentation: readonly ViServicePresentation[] = [
  {
    id: 'employment',
    sectionIndex: 3,
    title: 'Lao động và việc làm',
    summary: 'Tiền lương, chấm dứt hợp đồng và tranh chấp giữa người lao động với người sử dụng lao động.',
    icon: 'labor',
  },
  {
    id: 'family',
    sectionIndex: 2,
    title: 'Hôn nhân và gia đình',
    summary: 'Ly hôn, tài sản, việc chăm sóc và thăm nom con, thừa kế và vụ việc có yếu tố nước ngoài.',
    icon: 'family',
  },
  {
    id: 'civil',
    sectionIndex: 1,
    title: 'Dân sự và bồi thường',
    summary: 'Tranh chấp hợp đồng, thiệt hại ngoài hợp đồng và các vấn đề bảo vệ quyền lợi người tiêu dùng.',
    icon: 'civil',
  },
  {
    id: 'criminal',
    sectionIndex: 4,
    title: 'Vụ việc hình sự',
    summary: 'Hỗ trợ người bị tình nghi, bị cáo và người bị hại trong quá trình điều tra, xét xử.',
    icon: 'criminal',
  },
  {
    id: 'business',
    sectionIndex: 0,
    title: 'Đầu tư và doanh nghiệp',
    summary: 'Thành lập công ty, đầu tư, hợp đồng và các vấn đề pháp lý khi kinh doanh tại Đài Loan.',
    icon: 'company',
  },
  {
    id: 'intellectual-property',
    sectionIndex: 5,
    title: 'Sở hữu trí tuệ',
    summary: 'Đăng ký và bảo vệ nhãn hiệu, sáng chế, quyền tác giả; giải quyết tranh chấp liên quan.',
    icon: 'ip',
  },
];
