/**
 * Core guidance pages for the four new guidance languages.
 *
 * Guidance is published in the page language; consultations with an attorney
 * are handled only in English, Chinese, Japanese and Korean. Every locale below
 * is written entirely in its own language — there is no English or Korean
 * paragraph fallback, and no locale reuses another locale's strings.
 *
 * Nothing here promises interpreting, a reply time, availability, an
 * appointment, a fee figure, a residence or work-status outcome, or a case
 * result. Statements about the firm, its practice areas and its attorney are
 * limited to what the existing site data already states.
 *
 * The locale union is intentionally local to this module: the public
 * `SiteLocale` union is still four languages, and this content must not widen it.
 */

import { ID_PRIVACY_POLICY_LABEL } from '@/data/guidance-privacy-label';

export type GuidanceLocale = 'vi' | 'id' | 'th' | 'fil';

export type GuidancePageKey =
  | 'home'
  | 'services'
  | 'about'
  | 'lawyers'
  | 'pricing'
  | 'contact'
  | 'faq'
  | 'privacy'
  | 'disclaimer'
  | 'columns';

export interface GuidancePage {
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  sections: Array<{
    heading: string;
    paragraphs: string[];
    items?: string[];
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Home-page-only copy for the guidance locales.
 *
 * The guidance home renders the same section sequence as the English home
 * (hero -> column archive -> services -> image band -> closing bands). Every
 * other string on that page is reused from `pages.home`, `pages.services` and
 * `pages.columns`; the fields below are the ones the shared home layout needs
 * and the guidance pages did not already provide.
 *
 * Same limits as the rest of this module: no interpreting promise, no reply
 * time, no appointment, no fee figure, no case result, and no claim that the
 * columns exist in the page language when they do not.
 */
export interface GuidanceHomeCopy {
  /** aria-label of the hero scroll arrow. */
  heroScrollLabel: string;
  /** Secondary hero button pointing at the locale column index. */
  heroColumnsCtaLabel: string;
  /** Per-card link label on the six service cards. */
  servicesDetailLabel: string;
  /** Sentence under the service cards, split around the contact link. */
  servicesAssistanceBefore: string;
  servicesAssistanceLinkLabel: string;
  servicesAssistanceAfter: string;
  /** Column archive labels. */
  columnsViewAllLabel: string;
  columnsReadMoreLabel: string;
  columnsReviewLabel: string;
  /** Badge + note shown when the listed columns are still in their source language. */
  columnsOriginalLanguageBadge: string;
  columnsOriginalLanguageNote: string;
  /** Alt text and video control labels for the editorial image band. */
  imageBandAlt: string;
  videoPauseLabel: string;
  videoPlayLabel: string;
  videoReplayLabel: string;
}

export interface GuidanceLocaleContent {
  languageName: string;
  nav: Record<GuidancePageKey, string>;
  contactCta: string;
  footerNotice: string;
  skipLink: string;
  menuLabel: string;
  languageLabel: string;
  notFoundTitle: string;
  notFoundText: string;
  backHomeLabel: string;
  readSourceLabel: string;
  home: GuidanceHomeCopy;
  pages: Record<GuidancePageKey, GuidancePage>;
}

export const guidanceContent: Record<GuidanceLocale, GuidanceLocaleContent> = {
  vi: {
    languageName: 'Tiếng Việt',
    nav: {
      home: 'Trang chủ',
      services: 'Lĩnh vực dịch vụ',
      about: 'Về văn phòng',
      lawyers: 'Luật sư',
      pricing: 'Phạm vi và chi phí',
      contact: 'Liên hệ',
      faq: 'Câu hỏi thường gặp',
      privacy: 'Quyền riêng tư',
      disclaimer: 'Tuyên bố miễn trừ trách nhiệm',
      columns: 'Bài viết',
    },
    contactCta: 'Gửi yêu cầu tư vấn',
    footerNotice:
      'Trang tiếng Việt này chỉ cung cấp thông tin hướng dẫn chung về công việc của văn phòng theo pháp luật Đài Loan. Đây không phải ý kiến pháp lý cho vụ việc cụ thể, và việc gửi thông tin qua trang này không tự nó tạo lập quan hệ giữa luật sư và khách hàng.',
    skipLink: 'Bỏ qua phần điều hướng, đến nội dung chính',
    menuLabel: 'Danh mục trang',
    languageLabel: 'Ngôn ngữ hiển thị',
    notFoundTitle: 'Không tìm thấy trang',
    notFoundText:
      'Trang quý vị tìm không tồn tại hoặc đã chuyển sang địa chỉ khác. Quý vị có thể quay lại trang chủ tiếng Việt để xem các mục hướng dẫn hiện có.',
    backHomeLabel: 'Quay lại trang chủ',
    readSourceLabel: 'Mở danh mục bài viết bằng ngôn ngữ gốc',
    home: {
      heroScrollLabel: 'Cuộn xuống',
      heroColumnsCtaLabel: 'Xem bài viết',
      servicesDetailLabel: 'Xem chi tiết',
      servicesAssistanceBefore:
        'Nếu quý vị chưa rõ vụ việc của mình thuộc nhóm nào, trang ',
      servicesAssistanceLinkLabel: 'Liên hệ',
      servicesAssistanceAfter:
        ' hướng dẫn cách viết phần tóm tắt để luật sư xem xét.',
      columnsViewAllLabel: 'Xem tất cả bài viết',
      columnsReadMoreLabel: 'Đọc tiếp',
      columnsReviewLabel: 'Luật sư Wei Tseng rà soát',
      columnsOriginalLanguageBadge: 'Ngôn ngữ gốc',
      columnsOriginalLanguageNote:
        'Các bài viết dưới đây chưa có bản tiếng Việt. Danh sách giữ nguyên ngôn ngữ gốc và mở ra trang bằng ngôn ngữ đó; nội dung không được dịch tự động.',
      imageBandAlt:
        'Nhà tam hợp viện truyền thống Đài Loan (三合院) bên cạnh gian nhà hiện đại dưới ánh sáng ban ngày',
      videoPauseLabel: 'Tạm dừng video',
      videoPlayLabel: 'Phát video',
      videoReplayLabel: 'Phát lại video',
    },
    pages: {
      home: {
        eyebrow: 'HƯỚNG DẪN',
        title: 'Dịch vụ pháp lý tại Đài Loan — hướng dẫn bằng tiếng Việt',
        description:
          'Giới thiệu chung bằng tiếng Việt về phạm vi công việc của Hovering International Law Firm tại Đài Loan, ngôn ngữ tư vấn và cách bắt đầu liên hệ.',
        intro:
          'Hovering International Law Firm hỗ trợ khách hàng nước ngoài, kể cả những người đang ở Đài Loan, trong các vụ việc theo pháp luật Đài Loan: đầu tư và thành lập doanh nghiệp, tranh chấp dân sự, hôn nhân và gia đình, lao động, hình sự và sở hữu trí tuệ. Phần tiếng Việt này giúp quý vị nắm được công việc nào thuộc phạm vi hỗ trợ, cần chuẩn bị gì và liên hệ ra sao. Đây là thông tin chung, không phải ý kiến pháp lý cho vụ việc riêng của quý vị.',
        sections: [
          {
            heading: 'Văn phòng hỗ trợ những gì',
            paragraphs: [
              'Hovering International Law Firm là văn phòng luật sư có trụ sở tại Đài Loan, hành nghề theo pháp luật Đài Loan và có các cơ sở tại Đài Bắc (臺北), Cao Hùng (高雄), Đài Trung (臺中) và Bình Đông (屏東). Văn phòng nhận cả công việc tư vấn cho doanh nghiệp lẫn các vụ việc tranh tụng, và hỗ trợ khách hàng nước ngoài trong những thủ tục cần thực hiện tại Đài Loan.',
              'Toàn bộ nội dung ở đây mang tính tham khảo chung. Kết luận của một vụ việc phụ thuộc vào tình tiết cụ thể, quy định được áp dụng và thời điểm phát sinh, nên phần hướng dẫn này không thay thế cho việc trao đổi trực tiếp với luật sư về hồ sơ của quý vị.',
            ],
          },
          {
            heading: 'Ngôn ngữ của trang và ngôn ngữ tư vấn là hai việc khác nhau',
            paragraphs: [
              'Trang này được viết bằng tiếng Việt, nhưng việc tư vấn thực tế với luật sư chỉ được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn. Đọc được hướng dẫn bằng tiếng Việt không có nghĩa là buổi trao đổi với luật sư sẽ diễn ra bằng tiếng Việt.',
              'Chúng tôi không cam kết bố trí phiên dịch, không cam kết trả lời trong một khoảng thời gian nhất định và không xác nhận lịch hẹn qua trang này. Nếu quý vị không sử dụng được cả bốn ngôn ngữ nêu trên, phần “Liên hệ” giải thích cách chúng tôi xác nhận phương thức trao đổi.',
            ],
          },
          {
            heading: 'Những nhóm công việc mà văn phòng nhận xử lý',
            paragraphs: [
              'Phạm vi công việc của văn phòng gồm sáu nhóm dưới đây. Trang “Lĩnh vực dịch vụ” trình bày chi tiết hơn từng nhóm và nêu rõ những điều không được bảo đảm.',
            ],
            items: [
              'Đầu tư và thành lập doanh nghiệp tại Đài Loan',
              'Tranh chấp dân sự và yêu cầu bồi thường',
              'Vụ việc hôn nhân, gia đình và thừa kế',
              'Tranh chấp lao động và việc làm',
              'Vụ việc hình sự',
              'Sở hữu trí tuệ: nhãn hiệu, sáng chế và quyền tác giả',
            ],
          },
          {
            heading: 'Nên bắt đầu như thế nào',
            paragraphs: [
              'Quý vị nên đọc trang “Lĩnh vực dịch vụ” để xem vụ việc của mình có nằm trong phạm vi công việc hay không, sau đó xem trang “Phạm vi và chi phí” cùng trang “Liên hệ” để biết cách xác định phạm vi và xác nhận phí trước khi công việc bắt đầu.',
              'Khi gửi yêu cầu, quý vị có thể viết tóm tắt bằng ngôn ngữ của mình. Phần nội dung gốc được giữ nguyên như quý vị đã viết và không được dịch tự động. Một yêu cầu đã gửi là yêu cầu đang chờ xem xét: việc gửi yêu cầu chưa phải là buổi tư vấn đã diễn ra, cũng chưa phải lịch hẹn đã được xác nhận.',
            ],
          },
        ],
      },
      services: {
        eyebrow: 'LĨNH VỰC DỊCH VỤ',
        title: 'Các lĩnh vực mà văn phòng nhận xử lý',
        description:
          'Sáu nhóm công việc thuộc phạm vi dịch vụ của văn phòng tại Đài Loan, cùng những giới hạn cần biết trước khi liên hệ.',
        intro:
          'Dưới đây là các nhóm công việc mà văn phòng thực tế nhận xử lý, kèm những điểm thường được hỏi ở giai đoạn đầu. Phần mô tả này giúp quý vị xác định vụ việc của mình có thuộc phạm vi hỗ trợ hay không; đây là thông tin chung, không phải phân tích pháp lý cho một hồ sơ cụ thể.',
        sections: [
          {
            heading: 'Đầu tư và thành lập doanh nghiệp tại Đài Loan',
            paragraphs: [
              'Văn phòng hỗ trợ nhà đầu tư và doanh nghiệp nước ngoài khi thành lập hoặc vận hành pháp nhân tại Đài Loan: lựa chọn hình thức pháp nhân, chuẩn bị và nộp hồ sơ, chuyển vốn, thủ tục ngân hàng, xem xét địa điểm kinh doanh và các yêu cầu riêng của từng ngành nghề. Văn phòng cũng hỗ trợ các vấn đề kế toán và thuế phát sinh từ việc thành lập và vận hành công ty tại Đài Loan.',
              'Trình tự và thời gian thực hiện thay đổi tùy theo hình thức pháp nhân được chọn, tùy nhà đầu tư, ngành nghề, ngân hàng liên quan và tài liệu hiện có. Việc thành lập công ty không tự động làm phát sinh tư cách cư trú (居留) hay giấy phép làm việc (工作許可): đó là các thủ tục riêng biệt, được xem xét theo từng hồ sơ.',
            ],
          },
          {
            heading: 'Tranh chấp dân sự và yêu cầu bồi thường',
            paragraphs: [
              'Nhóm này gồm tranh chấp hợp đồng, yêu cầu bồi thường thiệt hại ngoài hợp đồng và tranh chấp tiêu dùng. Công việc thường bắt đầu bằng việc sắp xếp lại diễn biến sự việc, xác định tài liệu và chứng cứ đang có, rồi mới bàn đến phương án xử lý.',
              'Thời hạn (kể cả thời hiệu khởi kiện) và mức độ đầy đủ của chứng cứ ảnh hưởng lớn đến cách tiến hành một vụ việc dân sự, vì vậy quý vị nên nêu sớm các mốc thời gian mà mình biết. Nếu quý vị còn giữ hợp đồng, tin nhắn trao đổi, chứng từ thanh toán hay ảnh chụp hiện trường, hãy nói rõ ngay từ đầu.',
            ],
          },
          {
            heading: 'Hôn nhân, gia đình và thừa kế',
            paragraphs: [
              'Văn phòng nhận các vụ việc về ly hôn (離婚), phân chia tài sản, việc thực hiện và gánh vác quyền, nghĩa vụ đối với con chưa thành niên (未成年子女權利義務之行使或負擔), thăm nom con (會面交往) và thừa kế (繼承), kể cả khi các bên hoặc tài sản ở nhiều quốc gia khác nhau. Những vụ việc có yếu tố nước ngoài thường cần xem xét thêm về giấy tờ hộ tịch (戶籍), hình thức văn bản và cách chứng minh tại Đài Loan.',
              'Vì các vấn đề gia đình thường đi kèm thời hạn và nhiều thủ tục song song, phần tóm tắt ban đầu nên nêu rõ quan hệ giữa các bên, nơi cư trú hiện tại và những thủ tục đã hoặc đang tiến hành.',
            ],
          },
          {
            heading: 'Tranh chấp lao động và việc làm',
            paragraphs: [
              'Nhóm này gồm chấm dứt hợp đồng lao động (勞動契約), trợ cấp thôi việc theo pháp luật Đài Loan (資遣費; xin đừng coi là đồng nhất với các chế độ tương tự của nước khác), tiền lương và các tranh chấp phát sinh từ điều khoản của hợp đồng lao động, cho cả phía người lao động và phía người sử dụng lao động. Khi xem xét, chúng tôi tách bạch căn cứ chấm dứt quan hệ lao động với các vấn đề về thông báo, khoản phải trả và thời hạn.',
              'Hợp đồng lao động, nội quy lao động (工作規則), bảng lương và trao đổi giữa hai bên thường là tài liệu quyết định. Nếu quý vị còn giữ những tài liệu này, hãy nêu trong phần tóm tắt để việc xem xét ban đầu chính xác hơn.',
            ],
          },
          {
            heading: 'Vụ việc hình sự',
            paragraphs: [
              'Văn phòng hỗ trợ ở giai đoạn điều tra và giai đoạn xét xử, cho cả người bị tình nghi hoặc bị cáo và người bị hại, cũng như đánh giá rủi ro hình sự phát sinh trong hoạt động kinh doanh.',
              'Vụ việc hình sự thường có thời hạn ngắn và các mốc thủ tục cố định, vì vậy nếu quý vị đã nhận được giấy tờ của cơ quan có thẩm quyền, hãy nêu ngày ghi trên giấy tờ đó ngay khi liên hệ để nội dung được xem xét đúng thứ tự ưu tiên.',
            ],
          },
          {
            heading: 'Sở hữu trí tuệ',
            paragraphs: [
              'Văn phòng hỗ trợ đăng ký nhãn hiệu (商標) và sáng chế (專利), các vấn đề về quyền tác giả, cũng như tranh chấp liên quan đến các quyền này tại Đài Loan.',
              'Với nhóm việc này, thứ tự thực hiện rất quan trọng: phạm vi bảo hộ, thời điểm nộp đơn và tình trạng sử dụng trên thực tế đều ảnh hưởng đến phương án. Việc nộp đơn không tự nó bảo đảm được cấp văn bằng bảo hộ.',
            ],
          },
          {
            heading: 'Phạm vi và cách xác nhận',
            paragraphs: [
              'Văn phòng làm việc theo pháp luật Đài Loan và nhận những vụ việc thuộc các nhóm nêu trên. Phạm vi cụ thể của từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi.',
              'Tư cách cư trú, giấy phép làm việc và những vấn đề tương tự được xem xét trên cơ sở hồ sơ và tình tiết của từng người, chứ không suy ra từ quốc tịch. Nếu vụ việc có phần liên quan đến các nội dung này, quý vị nên nêu rõ khi liên hệ để luật sư xác định đúng nhóm việc; trang này không cam kết kết quả hay thời gian phản hồi.',
            ],
          },
        ],
      },
      about: {
        eyebrow: 'VỀ VĂN PHÒNG',
        title: 'Về Hovering International Law Firm',
        description:
          'Thông tin cơ bản về văn phòng luật sư tại Đài Loan, các cơ sở của văn phòng và công việc có yếu tố nước ngoài.',
        intro:
          'Hovering International Law Firm là văn phòng luật sư tại Đài Loan với đội ngũ luật sư làm việc ở nhiều lĩnh vực khác nhau, từ tư vấn doanh nghiệp đến tranh tụng. Phần này giới thiệu quá trình hình thành, các cơ sở và mảng công việc có yếu tố nước ngoài của văn phòng.',
        sections: [
          {
            heading: 'Thành lập và cơ cấu',
            paragraphs: [
              'Hovering International Law Firm (昊鼎國際法律事務所) được thành lập năm 2016 bởi các luật sư tốt nghiệp Đại học Quốc lập Đài Loan (國立臺灣大學). Tên gọi trong tiếng Trung ghép chữ 昊 mang nghĩa “bầu trời rộng lớn” và chữ 鼎 mang nghĩa “nền móng vững chắc”, thể hiện định hướng của văn phòng khi thành lập.',
              'Văn phòng có các cơ sở tại Đài Bắc (臺北), Cao Hùng (高雄), Đài Trung (臺中) và Bình Đông (屏東). Cơ sở Cao Hùng tập trung vào quản trị doanh nghiệp và các tranh chấp dân sự, hình sự, hành chính thông thường. Cơ sở Đài Trung xử lý các vụ việc về xây dựng, sở hữu trí tuệ và các công việc liên quan đến Hàn Quốc, Nhật Bản. Cơ sở Bình Đông được mở năm 2017 để phục vụ nhu cầu của địa phương.',
              'Bên cạnh hoạt động luật sư, năm 2020 văn phòng kế toán Hovering Accounting Office được thành lập, cung cấp dịch vụ kế toán và hoạch định thuế cho chủ doanh nghiệp và cá nhân có tài sản lớn.',
            ],
          },
          {
            heading: 'Công việc có yếu tố nước ngoài',
            paragraphs: [
              'Công việc có yếu tố nước ngoài của văn phòng gồm thành lập công ty, hồ sơ thị thực, đăng ký nhãn hiệu và sáng chế, đánh giá rủi ro pháp lý và tư vấn thuế doanh nghiệp. Cơ sở Đài Trung chuyên trách các vụ việc về xây dựng, sở hữu trí tuệ và các công việc liên quan đến Hàn Quốc, Nhật Bản. Luật sư Wei Tseng (曾雋崴) phụ trách khách hàng Hàn Quốc, Nhật Bản và khách hàng quốc tế khác trong các nhóm việc nêu trên.',
              'Việc chúng tôi có thể tiếp nhận một vụ việc hay không phụ thuộc vào nội dung vụ việc và ngôn ngữ trao đổi. Nếu vụ việc của quý vị thuộc các nhóm công việc nêu trên và có thể trao đổi bằng một trong bốn ngôn ngữ tư vấn, quý vị có thể gửi tóm tắt để luật sư xem xét.',
            ],
          },
          {
            heading: 'Khi quý vị liên hệ với văn phòng',
            paragraphs: [
              'Sau khi nhận được tóm tắt của quý vị, luật sư sẽ xem xét nội dung rồi trao đổi về phạm vi công việc có thể thực hiện, tài liệu cần bổ sung và các bước tiếp theo. Với những vụ việc phát sinh vấn đề kế toán hoặc thuế, văn phòng có thể phối hợp cùng bộ phận kế toán để xử lý trong cùng một quy trình.',
              'Kết quả của mỗi vụ việc phụ thuộc vào tình tiết và hồ sơ cụ thể, nên chúng tôi không đưa ra cam kết về kết quả. Khi quý vị cần một câu trả lời chắc chắn cho trường hợp của mình, cách duy nhất là trao đổi trực tiếp với luật sư về hồ sơ đó bằng một trong bốn ngôn ngữ tư vấn.',
            ],
          },
        ],
      },
      lawyers: {
        eyebrow: 'LUẬT SƯ',
        title: 'Đội ngũ quốc tế Hovering',
        description:
          'Hồ sơ của các luật sư, quản lý nghiệp vụ và kế toán viên hợp tác của Hovering.',
        // WO-O33: `/en/lawyers` is header -> roster -> key facts. The three
        // prose cards this page used to carry were a duplicate of the key-facts
        // rows, a third copy of the consultation-language notice, and a
        // jurisdiction disclaimer that belongs on the disclaimer page, so the
        // card grid is gone. With no cards there is no lede above them either.
        intro: '',
        sections: [],
      },
      pricing: {
        eyebrow: 'PHẠM VI VÀ CHI PHÍ',
        title: 'Cách xác định phạm vi công việc và chi phí',
        description:
          'Giải thích trình tự xác định phạm vi công việc, xác nhận phí và lý do trang này không công bố bảng giá.',
        intro:
          'Trang này giải thích cách chi phí được xác định, chứ không nêu con số. Mức phí phụ thuộc vào phạm vi công việc của từng vụ việc và chỉ có ý nghĩa sau khi phạm vi đó được xác định rõ.',
        sections: [
          {
            heading: 'Trước tiên là xác định phạm vi công việc',
            paragraphs: [
              'Cùng một loại vụ việc vẫn có thể khác nhau rất nhiều về khối lượng công việc, tùy vào số bên liên quan, tài liệu hiện có, thời hạn phải tuân thủ và việc thủ tục đã bắt đầu hay chưa. Vì vậy, bước đầu tiên luôn là làm rõ công việc cần thực hiện gồm những gì và không gồm những gì.',
              'Phần tóm tắt quý vị gửi ở bước đầu chính là cơ sở cho việc xác định phạm vi này. Tóm tắt càng rõ về diễn biến, mong muốn và thời hạn thì việc xác định phạm vi càng chính xác.',
            ],
          },
          {
            heading: 'Phí được xác nhận trước khi công việc bắt đầu',
            paragraphs: [
              'Khi phạm vi công việc đã rõ, mức phí và cách tính phí được trao đổi và xác nhận với quý vị trước khi công việc bắt đầu. Nếu phạm vi thay đổi trong quá trình thực hiện, phần thay đổi đó cũng cần được xác nhận lại.',
              'Trang này không phải là báo giá và không tạo ra nghĩa vụ thanh toán nào. Việc gửi yêu cầu qua trang này cũng không phát sinh chi phí.',
            ],
          },
          {
            heading: 'Buổi tư vấn có thể là dịch vụ có thu phí',
            paragraphs: [
              'Buổi tư vấn với luật sư có thể là dịch vụ có thu phí. Trang này không tuyên bố rằng buổi tư vấn đầu tiên là miễn phí, và quý vị không nên hiểu bất kỳ nội dung nào ở đây theo nghĩa đó.',
              'Nếu buổi tư vấn có thu phí, mức phí và cách thanh toán được nêu rõ trước khi buổi tư vấn diễn ra.',
            ],
          },
          {
            heading: 'Vì sao trang này không đăng bảng giá',
            paragraphs: [
              'Chi phí phụ thuộc vào từng vụ việc: khối lượng công việc cần thực hiện, số bên liên quan, tài liệu hiện có, thời hạn phải tuân thủ và việc thủ tục đã bắt đầu hay chưa. Một con số đăng sẵn sẽ không nói lên chi phí cho hồ sơ của quý vị, nên thay vì đăng bảng giá, chúng tôi xác định phạm vi công việc cho từng vụ việc rồi báo mức phí tương ứng để quý vị cân nhắc trước khi công việc bắt đầu.',
              'Ngoài thù lao luật sư, một vụ việc còn có thể phát sinh các khoản phải nộp cho tòa án, cơ quan nhà nước hoặc bên thứ ba. Những khoản này tách biệt với thù lao luật sư và phụ thuộc vào từng thủ tục cụ thể.',
            ],
          },
        ],
      },
      contact: {
        eyebrow: 'LIÊN HỆ',
        title: 'Cách liên hệ với văn phòng',
        description:
          'Ngôn ngữ của trang, ngôn ngữ tư vấn, cách xử lý khi quý vị không dùng được bốn ngôn ngữ đó, và những điều không được bảo đảm.',
        intro:
          'Trước khi liên hệ, xin lưu ý ba điều tách biệt dưới đây. Ba điều này dễ bị nhầm lẫn với nhau, nhưng mỗi điều có ý nghĩa riêng.',
        sections: [
          {
            heading: 'Ba điều cần phân biệt',
            paragraphs: [
              'Ngôn ngữ hiển thị của trang, ngôn ngữ tư vấn với luật sư và ngôn ngữ quý vị dùng để viết tin nhắn là ba việc độc lập với nhau.',
            ],
            items: [
              'Ngôn ngữ của trang: phần hướng dẫn này được viết bằng tiếng Việt.',
              'Ngôn ngữ tư vấn: việc tư vấn với luật sư được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
              'Ngôn ngữ quý vị viết: quý vị có thể viết tóm tắt bằng ngôn ngữ của mình, và nội dung gốc được giữ nguyên.',
            ],
          },
          {
            heading: 'Nếu quý vị không dùng được cả bốn ngôn ngữ tư vấn',
            paragraphs: [
              'Trong biểu mẫu liên hệ, quý vị có thể chọn mục “Cần xác nhận cách liên hệ”. Văn phòng sẽ dùng thư trả lời để xác nhận phương thức trao đổi, nếu có phương thức khả thi; đây không phải cam kết rằng sẽ có cách trao đổi phù hợp, cũng không phải cam kết về thời gian phản hồi.',
              'Đây chỉ là bước xác nhận, không phải lời hứa. Chúng tôi không cam kết bố trí phiên dịch, không cam kết hỗ trợ bằng tiếng Việt hay bất kỳ ngôn ngữ nào ngoài bốn ngôn ngữ nêu trên, và không cam kết rằng mọi vụ việc đều có thể tiếp nhận.',
            ],
          },
          {
            heading: 'Nên viết gì trong tin nhắn đầu tiên',
            paragraphs: [
              'Nên nêu: chuyện gì đã xảy ra, quý vị muốn được hỗ trợ điều gì, vụ việc liên quan đến Đài Loan như thế nào, và thời hạn nếu quý vị đã biết. Nếu đã nhận được giấy tờ của tòa án hay cơ quan nhà nước, hãy nêu ngày ghi trên giấy tờ đó.',
              'Chưa cần gửi số hộ chiếu, số giấy tờ tùy thân, thông tin tài khoản ngân hàng, hồ sơ y tế hay toàn bộ tập chứng cứ ở bước đầu. Hãy chờ hướng dẫn của luật sư rồi gửi tài liệu nhạy cảm theo cách an toàn.',
            ],
          },
          {
            heading: 'Những điều trang này không bảo đảm',
            paragraphs: [
              'Chúng tôi không cam kết thời gian phản hồi, không xác nhận lịch hẹn qua trang này, không cam kết một luật sư nhất định sẽ phụ trách vụ việc và không bố trí phiên dịch. Việc dịch văn bản là chuyện riêng: tin nhắn quý vị gửi không được dịch tự động.',
              'Khi quý vị gửi yêu cầu, nội dung được lưu lại và chờ xem xét. Nếu sau một thời gian quý vị chưa nhận được phản hồi, quý vị có thể gửi lại qua địa chỉ thư điện tử được nêu trên trang liên hệ.',
            ],
          },
        ],
      },
      faq: {
        eyebrow: 'CÂU HỎI THƯỜNG GẶP',
        title: 'Câu hỏi thường gặp',
        description:
          'Giải đáp về phạm vi công việc, cách chuẩn bị, ngôn ngữ, chi phí và ý nghĩa của việc gửi yêu cầu.',
        intro:
          'Những câu hỏi dưới đây được trả lời ở mức thông tin chung. Câu trả lời cho vụ việc cụ thể của quý vị chỉ có thể được đưa ra sau khi luật sư xem xét hồ sơ.',
        sections: [
          {
            heading: 'Cách sử dụng phần này',
            paragraphs: [
              'Nếu quý vị không tìm thấy câu trả lời cho tình huống của mình, đó thường là dấu hiệu cho thấy câu trả lời phụ thuộc vào tình tiết cụ thể. Trong trường hợp đó, hãy nêu tình tiết trong phần tóm tắt khi liên hệ, thay vì suy đoán từ nội dung ở đây.',
            ],
          },
        ],
        faqs: [
          {
            question: 'Văn phòng nhận những loại vụ việc nào?',
            answer:
              'Văn phòng nhận các vụ việc thuộc sáu nhóm: đầu tư và thành lập doanh nghiệp tại Đài Loan, tranh chấp dân sự và bồi thường, hôn nhân, gia đình và thừa kế, tranh chấp lao động, vụ việc hình sự, và sở hữu trí tuệ. Việc có nhận một vụ việc cụ thể hay không được quyết định sau khi xem xét nội dung.',
          },
          {
            question: 'Tôi nên chuẩn bị gì trước khi liên hệ?',
            answer:
              'Hãy chuẩn bị một bản tóm tắt ngắn về diễn biến sự việc, điều quý vị mong muốn, mối liên hệ của vụ việc với Đài Loan và thời hạn nếu có. Nếu đã có giấy tờ của tòa án hoặc cơ quan nhà nước, hãy nêu ngày ghi trên giấy tờ. Chưa cần gửi giấy tờ tùy thân hay toàn bộ chứng cứ ở bước này.',
          },
          {
            question: 'Tôi có thể được tư vấn bằng tiếng Việt không?',
            answer:
              'Không. Phần hướng dẫn này được viết bằng tiếng Việt, nhưng việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn. Chúng tôi cũng không cam kết bố trí phiên dịch. Việc dịch văn bản là chuyện riêng: nội dung gốc quý vị viết được lưu giữ nguyên văn và không được dịch tự động.',
          },
          {
            question: 'Nếu tôi không dùng được cả bốn ngôn ngữ đó thì sao?',
            answer:
              'Quý vị hãy chọn mục “Cần xác nhận cách liên hệ” khi gửi yêu cầu. Văn phòng sẽ dùng thư trả lời để xác nhận phương thức trao đổi, nếu có phương thức khả thi. Đây là bước xác nhận, không phải cam kết rằng chúng tôi có thể hỗ trợ bằng ngôn ngữ khác.',
          },
          {
            question: 'Nội dung tôi viết bằng tiếng Việt sẽ được xử lý ra sao?',
            answer:
              'Nội dung gốc quý vị viết được lưu giữ nguyên văn và không được dịch tự động. Khi cần, ngôn ngữ trao đổi tiếp theo sẽ được xác nhận cùng với quý vị.',
          },
          {
            question: 'Gửi yêu cầu xong có nghĩa là tôi đã được tư vấn chưa?',
            answer:
              'Chưa. Yêu cầu đã gửi là yêu cầu đang chờ luật sư xem xét. Đó không phải ý kiến pháp lý, không phải lịch hẹn đã xác nhận, và bản thân việc gửi yêu cầu không tạo lập quan hệ giữa luật sư và khách hàng.',
          },
          {
            question: 'Chi phí được tính như thế nào?',
            answer:
              'Phạm vi công việc được xác định trước, sau đó mức phí và cách tính phí được xác nhận với quý vị trước khi công việc bắt đầu. Trang này không công bố con số cụ thể và không tuyên bố rằng buổi tư vấn đầu tiên là miễn phí.',
          },
          {
            question: 'Việc của tôi rất gấp thì phải làm sao?',
            answer:
              'Hãy nêu rõ thời hạn hoặc ngày ghi trên giấy tờ ngay ở phần đầu của tóm tắt, để luật sư thấy các mốc thời gian đó khi xem xét. Trang này không có đường dây nóng và không bảo đảm thời gian phản hồi; nếu vụ việc gấp đến mức không thể chờ, quý vị nên đồng thời tìm phương án khác tại nơi mình đang ở.',
          },
        ],
      },
      privacy: {
        eyebrow: 'QUYỀN RIÊNG TƯ',
        title: 'Thông tin được thu thập qua biểu mẫu liên hệ',
        description:
          'Những thông tin biểu mẫu liên hệ ở phần tiếng Việt thu thập, cách xử lý nội dung gốc và cách quý vị liên hệ về dữ liệu của mình.',
        intro:
          'Phần này chỉ nói về biểu mẫu liên hệ trên các trang hướng dẫn này. Nội dung ở đây mô tả cách thông tin được xử lý, không phải một cam kết kỹ thuật.',
        sections: [
          {
            heading: 'Những thông tin được thu thập',
            paragraphs: [
              'Khi quý vị gửi yêu cầu qua biểu mẫu ở phần này, các thông tin sau được ghi nhận:',
            ],
            items: [
              'Tên quý vị cung cấp',
              'Địa chỉ thư điện tử để liên hệ lại',
              'Ngôn ngữ hiển thị của trang khi quý vị gửi',
              'Ngôn ngữ quý vị dùng để viết nội dung',
              'Ngôn ngữ quý vị mong muốn dùng khi tư vấn',
              'Nội dung gốc quý vị viết',
              'Việc quý vị đồng ý gửi yêu cầu',
              'Mã tiếp nhận dùng để tìm lại yêu cầu của quý vị',
            ],
          },
          {
            heading: 'Nội dung gốc được giữ nguyên',
            paragraphs: [
              'Nội dung quý vị viết được lưu đúng như quý vị đã viết và không được dịch tự động. Nếu cần bản dịch để xử lý vụ việc, việc đó được trao đổi riêng với quý vị.',
              'Vì nội dung gốc được lưu giữ, xin đừng viết những thông tin chưa cần thiết ở bước đầu, chẳng hạn số hộ chiếu, số giấy tờ tùy thân hay thông tin tài khoản ngân hàng.',
            ],
          },
          {
            heading: 'Nơi lưu trữ và người có thể xem',
            paragraphs: [
              'Nội dung quý vị gửi được lưu ở khu vực không công khai và chỉ những người được ủy quyền tại văn phòng mới được phép truy cập để xử lý yêu cầu.',
              'Trang này không đưa ra bảo đảm tuyệt đối về an toàn thông tin. Không có hệ thống truyền và lưu trữ nào là an toàn tuyệt đối, vì vậy tài liệu nhạy cảm chỉ nên được gửi theo hướng dẫn riêng của luật sư.',
            ],
          },
          {
            heading: 'Mục đích sử dụng',
            paragraphs: [
              'Thông tin quý vị gửi được dùng để xem xét yêu cầu, liên hệ lại với quý vị, xác nhận cách trao đổi và xử lý vụ việc nếu công việc được bắt đầu.',
              'Thông tin này không được dùng cho mục đích tiếp thị nếu quý vị không đồng ý riêng cho việc đó.',
            ],
          },
          {
            heading: 'Thông báo và mã tiếp nhận',
            paragraphs: [
              'Khi một yêu cầu được gửi thành công, hệ thống sẽ thông báo cho văn phòng. Nếu việc thông báo chưa được xác nhận, nội dung quý vị viết vẫn được lưu lại và không bị mất.',
              'Mã tiếp nhận được tạo ra để tìm lại yêu cầu của quý vị trong hồ sơ. Mã này hiện ra sau khi yêu cầu được lưu, và quý vị có thể nêu lại khi liên hệ để chúng tôi tìm đúng nội dung đã gửi.',
            ],
          },
          {
            heading: 'Quyền của quý vị và cách liên hệ',
            paragraphs: [
              'Quý vị có thể yêu cầu xem, sửa hoặc xóa thông tin của mình, hoặc rút lại sự đồng ý, bằng cách liên hệ qua địa chỉ thư điện tử được nêu trên trang liên hệ. Nếu có nghĩa vụ lưu giữ theo quy định hoặc do một vụ việc đang được thực hiện, chúng tôi sẽ nêu lý do giới hạn.',
              'Trang này không nêu một thời hạn lưu trữ cố định, vì thời hạn thực tế phụ thuộc vào việc vụ việc có được tiếp tục hay không và các nghĩa vụ lưu giữ liên quan. Nếu quý vị muốn thông tin của mình được xóa sớm hơn, hãy nêu yêu cầu đó khi liên hệ.',
            ],
          },
          {
            heading: 'Nơi lưu trữ dữ liệu và các nhà cung cấp dịch vụ',
            paragraphs: [
              'Trang web này được lưu trữ trên Vercel, và nội dung quý vị gửi được giữ trong kho lưu trữ đối tượng không công khai của dịch vụ đó. Thư điện tử được gửi qua dịch vụ thư mà văn phòng đang sử dụng.',
              'Máy chủ của một số nhà cung cấp dịch vụ có thể đặt ngoài Đài Loan, khi đó thông tin của quý vị có thể được lưu và xử lý tại nơi đó. Khi mục đích lưu giữ đã đạt được, thông tin được xóa không chậm trễ; thông tin có nghĩa vụ lưu giữ theo quy định thì được giữ trong thời hạn tương ứng. Mọi yêu cầu liên quan đến dữ liệu cá nhân được tiếp nhận tại wei@hoveringlaw.com.tw.',
            ],
          },
        ],
      },
      disclaimer: {
        eyebrow: 'TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM',
        title: 'Phạm vi và giới hạn của thông tin trên trang này',
        description:
          'Tính chất của thông tin chung, phạm vi pháp luật áp dụng, và điều kiện để quan hệ luật sư – khách hàng được hình thành.',
        intro:
          'Phần này nêu rõ những gì các trang hướng dẫn tiếng Việt có thể và không thể làm được cho quý vị.',
        sections: [
          {
            heading: 'Chỉ là thông tin chung',
            paragraphs: [
              'Nội dung trên các trang này được viết để cung cấp thông tin chung. Đây không phải ý kiến pháp lý cho vụ việc của quý vị, và không thể thay thế cho việc xem xét hồ sơ cụ thể.',
              'Kết luận của một vụ việc phụ thuộc vào tình tiết, quy định được áp dụng và thời điểm, nên hai tình huống trông giống nhau vẫn có thể dẫn đến kết quả khác nhau.',
            ],
          },
          {
            heading: 'Phạm vi pháp luật',
            paragraphs: [
              'Văn phòng hành nghề theo pháp luật Đài Loan, và các trang này chỉ nói về công việc trong phạm vi đó.',
              'Nội dung trên các trang này không phải ý kiến pháp lý theo pháp luật của bất kỳ thẩm quyền nào khác ngoài Đài Loan, kể cả pháp luật nơi quý vị cư trú. Nếu vụ việc của quý vị có phần thuộc thẩm quyền của nước khác, chúng tôi sẽ cùng quý vị xác nhận phần đó cần đến chuyên gia có tư cách phù hợp nào.',
            ],
          },
          {
            heading: 'Không tự động phát sinh quan hệ luật sư – khách hàng',
            paragraphs: [
              'Việc đọc trang này, gửi biểu mẫu hay gửi thư điện tử không tự nó tạo lập quan hệ giữa luật sư và khách hàng.',
              'Quan hệ đó chỉ hình thành sau khi vụ việc được xem xét và hai bên cùng xác nhận việc nhận thực hiện công việc.',
            ],
          },
          {
            heading: 'Không bảo đảm kết quả',
            paragraphs: [
              'Không có nội dung nào trên các trang này là cam kết về kết quả của một vụ việc, về việc một hồ sơ sẽ được chấp thuận, hay về tư cách lưu trú và tư cách làm việc.',
              'Các đường dẫn ra bên ngoài được cung cấp để quý vị tiện tham khảo; chúng tôi không bảo đảm về tính chính xác hay tính cập nhật của nội dung do bên thứ ba đăng tải.',
            ],
          },
        ],
      },
      columns: {
        eyebrow: 'BÀI VIẾT',
        title: 'Bài viết về pháp luật Đài Loan',
        description:
          'Các bài viết bằng tiếng Việt giải thích những chủ đề pháp luật Đài Loan thường gặp. Đây là thông tin chung tại thời điểm đăng, không phải ý kiến pháp lý cho vụ việc của quý vị.',
        intro:
          'Văn phòng có đăng các bài viết giải thích những chủ đề pháp luật Đài Loan thường gặp. Những bài đã có bằng tiếng Việt được liệt kê ngay trên trang này; ngoài ra còn có bốn liên kết, mỗi liên kết mở danh mục bài viết của một ngôn ngữ gốc.',
        sections: [
          {
            heading: 'Bốn danh mục theo ngôn ngữ',
            paragraphs: [
              'Mục này gồm bốn liên kết: danh mục bài viết tiếng Hàn, danh mục tiếng Trung, danh mục tiếng Anh và danh mục tiếng Nhật. Mỗi liên kết ghi rõ ngôn ngữ của danh mục đó, để quý vị biết trước mình sẽ mở nội dung bằng ngôn ngữ nào.',
              'Bốn danh mục đó là danh mục theo ngôn ngữ gốc, không phải danh sách bản dịch. Những bài đã có bằng tiếng Việt được liệt kê riêng ngay trên trang này.',
            ],
          },
          {
            heading: 'Liên kết dẫn tới đâu',
            paragraphs: [
              'Khi quý vị chọn một trong bốn liên kết, danh mục bài viết của ngôn ngữ đó sẽ mở ra. Từ danh mục, quý vị tự chọn bài muốn đọc, và toàn bộ nội dung hiển thị bằng ngôn ngữ gốc của bài.',
              'Trang này không tóm tắt nội dung bài viết, và cũng không bảo đảm rằng một chủ đề nhất định có mặt trong cả bốn ngôn ngữ. Mỗi danh mục chỉ chứa những bài đã được đăng bằng ngôn ngữ đó.',
            ],
          },
          {
            heading: 'Giá trị tham khảo của bài viết',
            paragraphs: [
              'Các bài viết được soạn để cung cấp thông tin chung tại thời điểm đăng. Quy định và cách áp dụng có thể thay đổi, và một bài viết không phản ánh đầy đủ tình tiết trong vụ việc của quý vị.',
              'Vì vậy, xin đừng dựa vào một bài viết để quyết định hành động trong vụ việc thật. Hãy dùng bài viết để hiểu bối cảnh chung; quyết định trong vụ việc thật cần trao đổi riêng với luật sư về hồ sơ đó, và trang này không phải bước tư vấn.',
            ],
          },
        ],
      },
    },
  },
  id: {
    languageName: 'Bahasa Indonesia',
    nav: {
      home: 'Beranda',
      services: 'Bidang layanan',
      about: 'Tentang kantor',
      lawyers: 'Advokat',
      pricing: 'Lingkup dan biaya',
      contact: 'Kontak',
      faq: 'Pertanyaan umum',
      privacy: ID_PRIVACY_POLICY_LABEL,
      disclaimer: 'Penafian',
      columns: 'Artikel',
    },
    contactCta: 'Kirim permintaan konsultasi',
    footerNotice:
      'Halaman berbahasa Indonesia ini hanya memuat panduan umum tentang pekerjaan kantor kami menurut hukum Taiwan. Ini bukan nasihat hukum untuk perkara tertentu, dan mengirim pesan melalui halaman ini dengan sendirinya tidak membentuk hubungan antara advokat dan klien.',
    skipLink: 'Lewati navigasi, langsung ke isi utama',
    menuLabel: 'Daftar halaman',
    languageLabel: 'Bahasa tampilan',
    notFoundTitle: 'Halaman tidak ditemukan',
    notFoundText:
      'Halaman yang Anda cari tidak ada atau sudah dipindahkan ke alamat lain. Anda dapat kembali ke beranda berbahasa Indonesia untuk melihat panduan yang tersedia.',
    backHomeLabel: 'Kembali ke beranda',
    readSourceLabel: 'Buka daftar artikel dalam bahasa aslinya',
    home: {
      heroScrollLabel: 'Gulir ke bawah',
      heroColumnsCtaLabel: 'Lihat artikel',
      servicesDetailLabel: 'Lihat detail',
      servicesAssistanceBefore:
        'Jika Anda belum yakin perkara Anda termasuk kelompok yang mana, halaman ',
      servicesAssistanceLinkLabel: 'Kontak',
      servicesAssistanceAfter:
        ' menjelaskan cara menyusun ringkasan yang akan ditinjau advokat.',
      columnsViewAllLabel: 'Lihat semua artikel',
      columnsReadMoreLabel: 'Baca selengkapnya',
      columnsReviewLabel: 'Ditinjau oleh Advokat Wei Tseng',
      columnsOriginalLanguageBadge: 'Bahasa asli',
      columnsOriginalLanguageNote:
        'Artikel di bawah ini belum tersedia dalam bahasa Indonesia. Daftar ini tetap dalam bahasa aslinya dan terbuka pada halaman berbahasa tersebut; isinya tidak diterjemahkan secara otomatis.',
      imageBandAlt:
        'Rumah tradisional Taiwan (三合院) dan paviliun modern dalam cahaya siang hari',
      videoPauseLabel: 'Jeda video',
      videoPlayLabel: 'Putar video',
      videoReplayLabel: 'Putar ulang video',
    },
    pages: {
      home: {
        eyebrow: 'PANDUAN',
        title: 'Layanan hukum di Taiwan — panduan berbahasa Indonesia',
        description:
          'Penjelasan umum dalam bahasa Indonesia mengenai lingkup pekerjaan Hovering International Law Firm di Taiwan, bahasa konsultasi, dan cara memulai kontak.',
        intro:
          'Hovering International Law Firm mendampingi klien dari luar negeri, termasuk mereka yang berada di Taiwan, dalam perkara menurut hukum Taiwan: investasi dan pendirian perusahaan, sengketa perdata, perkara perkawinan dan keluarga, ketenagakerjaan, pidana, dan kekayaan intelektual. Bagian berbahasa Indonesia ini membantu Anda mengetahui pekerjaan apa yang termasuk dalam lingkup kami, apa yang perlu disiapkan, dan bagaimana cara menghubungi kami. Ini keterangan umum, bukan nasihat hukum untuk perkara Anda sendiri.',
        sections: [
          {
            heading: 'Apa yang kami kerjakan',
            paragraphs: [
              'Hovering International Law Firm adalah kantor advokat yang berkedudukan di Taiwan, bekerja berdasarkan hukum Taiwan, dan memiliki kantor di Taipei (臺北), Kaohsiung (高雄), Taichung (臺中), serta Pingtung (屏東). Kami menangani konsultasi hukum bagi perusahaan sekaligus perkara yang beracara di pengadilan, dan mendampingi klien dari luar negeri dalam proses yang harus ditempuh di Taiwan.',
              'Seluruh isi di sini bersifat umum. Kesimpulan sebuah perkara bergantung pada fakta, ketentuan yang berlaku, dan waktunya, sehingga panduan ini tidak menggantikan pembicaraan langsung dengan advokat mengenai berkas Anda.',
            ],
          },
          {
            heading: 'Bahasa halaman dan bahasa konsultasi adalah dua hal berbeda',
            paragraphs: [
              'Halaman ini ditulis dalam bahasa Indonesia, tetapi konsultasi dengan advokat hanya dilayani dalam empat bahasa: bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea. Membaca panduan dalam bahasa Indonesia tidak berarti pembicaraan dengan advokat akan berlangsung dalam bahasa Indonesia.',
              'Kami tidak menjanjikan penerjemah, tidak menjanjikan balasan dalam jangka waktu tertentu, dan tidak memastikan janji temu melalui halaman ini. Jika keempat bahasa tersebut tidak dapat Anda gunakan, halaman “Kontak” menjelaskan cara kami memastikan cara berkomunikasi.',
            ],
          },
          {
            heading: 'Jenis perkara yang kami tangani',
            paragraphs: [
              'Lingkup pekerjaan kantor mencakup enam kelompok berikut. Halaman “Bidang layanan” menjelaskan masing-masing kelompok lebih rinci sekaligus menyebutkan hal-hal yang tidak dijamin.',
            ],
            items: [
              'Investasi dan pendirian perusahaan di Taiwan',
              'Sengketa perdata dan tuntutan ganti rugi',
              'Perkara perkawinan, keluarga, dan waris',
              'Sengketa ketenagakerjaan dan hubungan kerja',
              'Perkara pidana',
              'Kekayaan intelektual: merek, paten, dan hak cipta',
            ],
          },
          {
            heading: 'Dari mana sebaiknya Anda mulai',
            paragraphs: [
              'Bacalah halaman “Bidang layanan” untuk memastikan perkara Anda termasuk dalam lingkup pekerjaan kami, lalu halaman “Lingkup dan biaya” serta “Kontak” untuk mengetahui bagaimana lingkup ditetapkan dan biaya dipastikan sebelum pekerjaan dimulai.',
              'Saat mengirim pesan, Anda boleh menulis ringkasannya dalam bahasa Anda sendiri. Teks asli disimpan persis seperti yang Anda tulis dan tidak diterjemahkan secara otomatis. Pesan yang terkirim berarti permintaan yang menunggu ditinjau: itu belum berarti konsultasi telah berlangsung, dan belum berarti janji temu sudah dipastikan.',
            ],
          },
        ],
      },
      services: {
        eyebrow: 'BIDANG LAYANAN',
        title: 'Bidang perkara yang kami tangani',
        description:
          'Enam kelompok pekerjaan yang termasuk dalam lingkup layanan kantor di Taiwan, beserta batasan yang perlu Anda ketahui lebih dulu.',
        intro:
          'Berikut kelompok pekerjaan yang benar-benar kami tangani, beserta hal-hal yang biasa ditanyakan pada tahap awal. Uraian ini membantu Anda menilai apakah perkara Anda termasuk dalam lingkup kami; sifatnya keterangan umum, bukan analisis hukum atas satu berkas tertentu.',
        sections: [
          {
            heading: 'Investasi dan pendirian perusahaan di Taiwan',
            paragraphs: [
              'Kami mendampingi investor dan perusahaan asing yang mendirikan atau menjalankan badan usaha di Taiwan: pemilihan bentuk badan usaha, penyiapan dan pengajuan berkas, pengiriman modal, urusan perbankan, penilaian tempat usaha, serta persyaratan yang khusus berlaku bagi bidang usaha tertentu. Kami juga membantu urusan akuntansi dan perpajakan yang timbul dari pendirian dan pengoperasian perusahaan di Taiwan.',
              'Urutan dan lamanya proses berbeda-beda menurut bentuk badan usaha yang dipilih, investornya, bidang usahanya, bank yang terlibat, dan dokumen yang tersedia. Pendirian perusahaan tidak dengan sendirinya menghasilkan izin tinggal (居留) atau izin kerja (工作許可): keduanya adalah proses tersendiri yang dinilai menurut keadaan masing-masing orang.',
            ],
          },
          {
            heading: 'Sengketa perdata dan ganti rugi',
            paragraphs: [
              'Kelompok ini mencakup sengketa perjanjian, tuntutan ganti rugi atas perbuatan melawan hukum, dan sengketa konsumen. Pekerjaan biasanya dimulai dengan menyusun kronologi kejadian, memeriksa dokumen dan bukti yang ada, baru kemudian membahas langkah penyelesaian.',
              'Tenggat waktu, termasuk jangka waktu yang ditetapkan undang-undang untuk mengajukan gugatan, dan kelengkapan bukti sangat memengaruhi jalannya perkara perdata, jadi sebutkanlah sejak awal tanggal-tanggal yang Anda ketahui. Jika Anda masih menyimpan perjanjian, percakapan, bukti pembayaran, atau foto keadaan di lapangan, sebutkan hal itu sejak pesan pertama.',
            ],
          },
          {
            heading: 'Perkawinan, keluarga, dan waris',
            paragraphs: [
              'Kami menangani perkara perceraian (離婚), pembagian harta, pelaksanaan dan pemikulan hak serta kewajiban terhadap anak yang belum dewasa (未成年子女權利義務之行使或負擔), hak menjenguk anak (會面交往), dan waris (繼承), termasuk ketika para pihak atau hartanya berada di negara yang berbeda. Perkara keluarga lintas negara umumnya memerlukan pemeriksaan tambahan atas dokumen kependudukan (戶籍), bentuk surat, dan cara pembuktiannya di Taiwan.',
              'Karena perkara keluarga sering disertai tenggat waktu dan beberapa prosedur yang berjalan bersamaan, ringkasan awal sebaiknya menyebutkan hubungan antarpihak, tempat tinggal saat ini, dan prosedur yang sudah atau sedang berjalan.',
            ],
          },
          {
            heading: 'Sengketa ketenagakerjaan dan hubungan kerja',
            paragraphs: [
              'Kelompok ini mencakup pemutusan hubungan kerja, pesangon menurut hukum Taiwan (資遣費; jangan disamakan dengan lembaga serupa di negara lain), upah, dan sengketa yang timbul dari ketentuan perjanjian kerja (勞動契約), baik dari sisi pekerja maupun sisi pemberi kerja. Dalam meninjau perkara, kami memisahkan dasar pemutusan hubungan kerja dari persoalan pemberitahuan, pembayaran, dan tenggat waktu.',
              'Perjanjian kerja, peraturan perusahaan (工作規則), slip gaji, dan percakapan antara kedua pihak biasanya menjadi dokumen yang menentukan. Jika Anda masih menyimpannya, sebutkan hal itu dalam ringkasan agar peninjauan awal lebih tepat.',
            ],
          },
          {
            heading: 'Perkara pidana',
            paragraphs: [
              'Kami mendampingi pada tahap penyidikan maupun pemeriksaan di pengadilan, baik bagi tersangka atau terdakwa maupun bagi korban, serta menilai risiko pidana yang timbul dalam kegiatan usaha.',
              'Perkara pidana umumnya memiliki tenggat waktu pendek dan tahapan yang sudah tertentu, jadi apabila Anda sudah menerima surat dari aparat penegak hukum atau pengadilan, sebutkan tanggal pada surat itu sejak awal agar isinya ditinjau menurut urutan kepentingannya.',
            ],
          },
          {
            heading: 'Kekayaan intelektual',
            paragraphs: [
              'Kami membantu pendaftaran merek (商標) dan paten (專利), urusan hak cipta, serta sengketa yang berkaitan dengan hak-hak tersebut di Taiwan.',
              'Pada kelompok ini urutan langkah sangat menentukan: lingkup perlindungan, waktu pengajuan, dan pemakaian secara nyata semuanya memengaruhi pilihan langkah. Mengajukan permohonan dengan sendirinya tidak menjamin permohonan itu dikabulkan.',
            ],
          },
          {
            heading: 'Lingkup dan cara memastikannya',
            paragraphs: [
              'Kantor kami bekerja berdasarkan hukum Taiwan dan menangani perkara yang termasuk dalam kelompok di atas. Lingkup setiap perkara dipastikan tersendiri setelah advokat meninjau isi pesan Anda.',
              'Status tinggal, izin kerja, dan hal-hal sejenis dinilai dari berkas dan keadaan masing-masing orang, tidak disimpulkan dari kewarganegaraan. Jika ada bagian perkara Anda yang menyangkut hal-hal itu, sebutkanlah saat menghubungi kami agar advokat dapat menentukan kelompok pekerjaannya; halaman ini tidak menjanjikan hasil maupun waktu balasan.',
            ],
          },
        ],
      },
      about: {
        eyebrow: 'TENTANG KANTOR',
        title: 'Tentang Hovering International Law Firm',
        description:
          'Keterangan dasar tentang kantor advokat di Taiwan ini, kantor-kantor cabangnya, dan pekerjaan yang melibatkan pihak asing.',
        intro:
          'Hovering International Law Firm adalah kantor advokat di Taiwan dengan para advokat yang bekerja pada berbagai bidang, mulai dari konsultasi hukum bagi perusahaan sampai beracara di pengadilan. Bagian ini menjelaskan bagaimana kantor ini berdiri, cabang-cabangnya, dan pekerjaan yang melibatkan pihak asing.',
        sections: [
          {
            heading: 'Pendirian dan susunan kantor',
            paragraphs: [
              'Hovering International Law Firm (昊鼎國際法律事務所) didirikan pada 2016 oleh para advokat lulusan Universitas Nasional Taiwan (國立臺灣大學). Nama Tionghoanya, 昊鼎, menggabungkan aksara 昊 yang berarti “langit yang luas” dan aksara 鼎 yang berarti “dasar yang kokoh”, yang mencerminkan arah kantor sejak awal berdiri.',
              'Kami memiliki kantor di Taipei (臺北), Kaohsiung (高雄), Taichung (臺中), dan Pingtung (屏東). Kantor Kaohsiung berfokus pada tata kelola perusahaan dan menangani sengketa perdata, pidana, serta administrasi secara umum. Kantor Taichung menangani perkara konstruksi, kekayaan intelektual, dan urusan yang berkaitan dengan Korea dan Jepang. Kantor Pingtung dibuka pada 2017 untuk melayani kebutuhan setempat.',
              'Selain pekerjaan advokat, pada 2020 berdiri pula Hovering Accounting Office, yang menyediakan layanan akuntansi dan perencanaan pajak bagi pemilik usaha dan perorangan berkekayaan besar.',
            ],
          },
          {
            heading: 'Pekerjaan yang melibatkan pihak asing',
            paragraphs: [
              'Pekerjaan lintas negara kami mencakup pendirian perusahaan, pengurusan visa, pendaftaran merek dan paten, penilaian risiko hukum, dan konsultasi pajak perusahaan. Kantor Taichung secara khusus menangani perkara konstruksi, kekayaan intelektual, dan urusan yang berkaitan dengan Korea serta Jepang. Advokat Wei Tseng (曾雋崴) mendampingi klien dari Korea, Jepang, dan klien internasional lainnya pada kelompok pekerjaan di atas.',
              'Dapat atau tidaknya kami menangani suatu perkara bergantung pada isi perkara itu dan pada bahasa yang dipakai berkomunikasi. Jika perkara Anda termasuk kelompok pekerjaan di atas dan dapat dibicarakan dalam salah satu dari empat bahasa konsultasi, Anda dapat mengirimkan ringkasannya untuk ditinjau advokat.',
            ],
          },
          {
            heading: 'Ketika Anda menghubungi kami',
            paragraphs: [
              'Setelah ringkasan Anda kami terima, advokat meninjau isinya lalu membicarakan lingkup pekerjaan yang dapat dikerjakan, dokumen yang masih diperlukan, dan langkah selanjutnya. Untuk perkara yang menimbulkan persoalan akuntansi atau perpajakan, kantor dapat bekerja bersama bagian akuntansi dalam satu alur penanganan.',
              'Hasil setiap perkara bergantung pada faktanya dan pada berkas yang ada, sehingga kami tidak menjanjikan hasil. Bila Anda memerlukan jawaban yang pasti untuk keadaan Anda, berkas itu perlu dibicarakan langsung dengan advokat dalam salah satu dari empat bahasa konsultasi.',
            ],
          },
        ],
      },
      lawyers: {
        eyebrow: 'ADVOKAT',
        title: 'Tim Internasional Hovering',
        description:
          'Profil para advokat, manajer operasional, dan akuntan mitra Hovering.',
        // WO-O33: `/en/lawyers` is header -> roster -> key facts. The three
        // prose cards this page used to carry were a duplicate of the key-facts
        // rows, a third copy of the consultation-language notice, and a
        // jurisdiction disclaimer that belongs on the disclaimer page, so the
        // card grid is gone. With no cards there is no lede above them either.
        intro: '',
        sections: [],
      },
      pricing: {
        eyebrow: 'LINGKUP DAN BIAYA',
        title: 'Bagaimana lingkup pekerjaan dan biaya ditetapkan',
        description:
          'Penjelasan tentang urutan penetapan lingkup pekerjaan, pemastian biaya, dan alasan halaman ini tidak memuat daftar tarif.',
        intro:
          'Halaman ini menjelaskan bagaimana biaya ditetapkan, bukan menyebutkan angkanya. Besarnya biaya bergantung pada lingkup pekerjaan tiap perkara dan baru bermakna setelah lingkup itu jelas.',
        sections: [
          {
            heading: 'Langkah pertama adalah menetapkan lingkup pekerjaan',
            paragraphs: [
              'Perkara yang jenisnya sama dapat sangat berbeda beban kerjanya, tergantung jumlah pihak, dokumen yang tersedia, tenggat waktu yang harus dipenuhi, dan apakah suatu prosedur sudah dimulai. Karena itu langkah pertama selalu memperjelas apa yang termasuk dan apa yang tidak termasuk dalam pekerjaan.',
              'Ringkasan yang Anda kirim pada tahap awal menjadi dasar penetapan lingkup ini. Semakin jelas ringkasan itu menerangkan kejadian, harapan Anda, dan tenggat waktunya, semakin tepat lingkup yang dapat ditetapkan.',
            ],
          },
          {
            heading: 'Biaya dipastikan sebelum pekerjaan dimulai',
            paragraphs: [
              'Setelah lingkup pekerjaan jelas, besaran dan cara penghitungan biaya dibicarakan dan dipastikan bersama Anda sebelum pekerjaan dimulai. Jika lingkupnya berubah di tengah jalan, perubahan itu pun perlu dipastikan kembali.',
              'Halaman ini bukan penawaran harga dan tidak menimbulkan kewajiban pembayaran apa pun. Mengirim permintaan melalui halaman ini juga tidak dikenai biaya.',
            ],
          },
          {
            heading: 'Konsultasi dapat merupakan layanan berbayar',
            paragraphs: [
              'Konsultasi dengan advokat dapat merupakan layanan berbayar. Halaman ini tidak menyatakan bahwa konsultasi pertama gratis, dan tidak ada bagian di sini yang boleh dipahami demikian.',
              'Apabila konsultasi dikenai biaya, besaran dan cara pembayarannya diberitahukan sebelum konsultasi berlangsung.',
            ],
          },
          {
            heading: 'Mengapa halaman ini tidak memuat tarif',
            paragraphs: [
              'Besarnya biaya bergantung pada perkaranya sendiri: banyaknya pekerjaan yang harus dilakukan, jumlah pihak, dokumen yang tersedia, tenggat waktu yang berlaku, dan apakah suatu prosedur sudah dimulai. Angka yang dipasang di muka tidak akan menunjukkan biaya untuk berkas Anda; karena itu, alih-alih memuat daftar tarif, kami menetapkan lebih dulu lingkup pekerjaan bagi perkara Anda lalu menyampaikan biayanya untuk Anda pertimbangkan sebelum pekerjaan dimulai.',
              'Selain honorarium advokat, sebuah perkara dapat menimbulkan pungutan yang harus dibayarkan kepada pengadilan, instansi pemerintah, atau pihak ketiga. Pungutan itu terpisah dari honorarium advokat dan bergantung pada prosedur yang ditempuh.',
            ],
          },
        ],
      },
      contact: {
        eyebrow: 'KONTAK',
        title: 'Cara menghubungi kantor kami',
        description:
          'Bahasa halaman, bahasa konsultasi, cara menanganinya jika keempat bahasa itu tidak dapat Anda gunakan, dan hal-hal yang tidak dijamin.',
        intro:
          'Sebelum menghubungi kami, perhatikan tiga hal terpisah berikut. Ketiganya kerap tertukar, padahal maknanya berbeda.',
        sections: [
          {
            heading: 'Tiga hal yang perlu dibedakan',
            paragraphs: [
              'Bahasa tampilan halaman, bahasa konsultasi dengan advokat, dan bahasa yang Anda pakai menulis pesan adalah tiga hal yang berdiri sendiri.',
            ],
            items: [
              'Bahasa halaman: panduan ini ditulis dalam bahasa Indonesia.',
              'Bahasa konsultasi: konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
              'Bahasa tulisan Anda: Anda boleh menulis ringkasan dalam bahasa Anda sendiri, dan teks aslinya disimpan apa adanya.',
            ],
          },
          {
            heading: 'Jika keempat bahasa konsultasi itu tidak dapat Anda gunakan',
            paragraphs: [
              'Pada formulir kontak Anda dapat memilih “Perlu konfirmasi cara berkomunikasi”. Kami akan membalas untuk memastikan cara berkomunikasi jika ada cara yang memungkinkan, tetapi layanan dalam bahasa lain tidak dijamin dan waktu balasan tidak dijanjikan.',
              'Ini hanyalah langkah pemastian, bukan janji. Kami tidak menjanjikan penerjemah, tidak menjanjikan layanan dalam bahasa Indonesia atau bahasa lain di luar keempat bahasa tersebut, dan tidak menjanjikan bahwa setiap perkara dapat kami terima.',
            ],
          },
          {
            heading: 'Apa yang sebaiknya ditulis pada pesan pertama',
            paragraphs: [
              'Sebutkan apa yang terjadi, bantuan apa yang Anda perlukan, apa kaitan perkara itu dengan Taiwan, dan tenggat waktu jika Anda mengetahuinya. Jika Anda sudah menerima surat dari pengadilan atau instansi pemerintah, sebutkan tanggal pada surat tersebut.',
              'Pada tahap awal Anda belum perlu mengirim nomor paspor, nomor identitas, data rekening bank, rekam medis, atau seluruh berkas bukti. Tunggulah petunjuk dari advokat, lalu kirim bahan yang sensitif dengan cara yang aman.',
            ],
          },
          {
            heading: 'Hal-hal yang tidak dijamin halaman ini',
            paragraphs: [
              'Kami tidak menjanjikan waktu balasan, tidak memastikan janji temu melalui halaman ini, tidak menjanjikan advokat tertentu yang akan menangani perkara, dan tidak menyediakan penerjemah. Penerjemahan tulisan adalah hal terpisah: pesan yang Anda kirim tidak diterjemahkan secara otomatis.',
              'Ketika Anda mengirim permintaan, isinya tersimpan dan menunggu ditinjau. Jika setelah beberapa waktu Anda belum menerima balasan, Anda dapat mengirim ulang melalui alamat email yang tertera pada halaman kontak.',
            ],
          },
        ],
      },
      faq: {
        eyebrow: 'PERTANYAAN UMUM',
        title: 'Pertanyaan yang sering diajukan',
        description:
          'Penjelasan mengenai lingkup pekerjaan, persiapan, bahasa, biaya, dan arti dari mengirim permintaan konsultasi.',
        intro:
          'Pertanyaan di bawah ini dijawab pada tingkat keterangan umum. Jawaban untuk perkara Anda sendiri baru dapat diberikan setelah advokat meninjau berkasnya.',
        sections: [
          {
            heading: 'Cara memakai bagian ini',
            paragraphs: [
              'Jika Anda tidak menemukan jawaban untuk keadaan Anda, biasanya itu pertanda bahwa jawabannya bergantung pada fakta yang khusus. Dalam hal itu, tuliskan fakta tersebut pada ringkasan ketika menghubungi kami, alih-alih menyimpulkannya sendiri dari halaman ini.',
            ],
          },
        ],
        faqs: [
          {
            question: 'Perkara jenis apa yang ditangani kantor ini?',
            answer:
              'Kami menangani enam kelompok perkara: investasi dan pendirian perusahaan di Taiwan, sengketa perdata dan ganti rugi, perkara perkawinan, keluarga, dan waris, sengketa ketenagakerjaan, perkara pidana, dan kekayaan intelektual. Diterima atau tidaknya suatu perkara diputuskan setelah isinya ditinjau.',
          },
          {
            question: 'Apa yang perlu saya siapkan sebelum menghubungi kantor?',
            answer:
              'Siapkan ringkasan singkat tentang urutan kejadian, apa yang Anda harapkan, kaitan perkara dengan Taiwan, dan tenggat waktu jika ada. Jika sudah ada surat dari pengadilan atau instansi pemerintah, sebutkan tanggalnya. Pada tahap ini Anda belum perlu mengirim dokumen identitas atau seluruh bukti.',
          },
          {
            question: 'Bisakah saya berkonsultasi dalam bahasa Indonesia?',
            answer:
              'Tidak. Panduan ini ditulis dalam bahasa Indonesia, tetapi konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea. Kami juga tidak menjanjikan penerjemah. Penerjemahan tulisan adalah hal terpisah: teks asli yang Anda tulis disimpan apa adanya dan tidak diterjemahkan secara otomatis.',
          },
          {
            question: 'Bagaimana jika keempat bahasa itu tidak dapat saya gunakan?',
            answer:
              'Pilihlah “Perlu konfirmasi cara berkomunikasi” ketika mengirim permintaan. Kami akan membalas untuk memastikan cara berkomunikasi, tetapi layanan dalam bahasa lain tidak dijamin. Ini langkah pemastian, bukan janji bahwa kami dapat melayani dalam bahasa lain.',
          },
          {
            question: 'Bagaimana tulisan saya dalam bahasa Indonesia diperlakukan?',
            answer:
              'Teks asli yang Anda tulis disimpan apa adanya dan tidak diterjemahkan secara otomatis. Bila diperlukan, bahasa untuk komunikasi selanjutnya dipastikan bersama Anda.',
          },
          {
            question: 'Jika permintaan sudah terkirim, apakah konsultasi sudah berlangsung?',
            answer:
              'Belum. Permintaan yang terkirim berarti permintaan yang menunggu ditinjau advokat. Itu bukan nasihat hukum, bukan janji temu yang sudah dipastikan, dan pengirimannya sendiri tidak membentuk hubungan antara advokat dan klien.',
          },
          {
            question: 'Bagaimana biaya dihitung?',
            answer:
              'Lingkup pekerjaan ditetapkan lebih dulu, lalu besaran dan cara penghitungan biaya dipastikan bersama Anda sebelum pekerjaan dimulai. Halaman ini tidak memuat angka dan tidak menyatakan bahwa konsultasi pertama gratis.',
          },
          {
            question: 'Bagaimana jika urusan saya sangat mendesak?',
            answer:
              'Sebutkan tenggat waktu atau tanggal pada surat resmi di bagian awal ringkasan Anda agar advokat melihat tanggal-tanggal itu saat meninjau. Halaman ini tidak memiliki saluran darurat dan tidak menjamin waktu balasan; jika urusan Anda tidak dapat menunggu, sebaiknya Anda sekaligus mencari jalan lain di tempat Anda berada.',
          },
        ],
      },
      privacy: {
        eyebrow: 'PRIVASI',
        title: 'Data yang dikumpulkan melalui formulir kontak',
        description:
          'Apa yang dikumpulkan formulir kontak pada bagian berbahasa Indonesia, bagaimana teks asli diperlakukan, dan cara menghubungi kami mengenai data Anda.',
        intro:
          'Bagian ini hanya membahas formulir kontak pada halaman panduan ini. Isinya menggambarkan cara data diperlakukan, bukan sebuah jaminan teknis.',
        sections: [
          {
            heading: 'Data yang dikumpulkan',
            paragraphs: [
              'Ketika Anda mengirim permintaan melalui formulir pada bagian ini, hal-hal berikut dicatat:',
            ],
            items: [
              'Nama yang Anda cantumkan',
              'Alamat email untuk membalas',
              'Bahasa tampilan halaman saat Anda mengirim',
              'Bahasa yang Anda pakai untuk menulis',
              'Bahasa konsultasi yang Anda inginkan',
              'Teks asli yang Anda tulis',
              'Persetujuan Anda untuk mengirim permintaan',
              'Nomor penerimaan untuk menemukan kembali permintaan Anda',
            ],
          },
          {
            heading: 'Teks asli disimpan apa adanya',
            paragraphs: [
              'Tulisan Anda disimpan persis seperti yang Anda tulis dan tidak diterjemahkan secara otomatis. Jika terjemahan diperlukan untuk menangani perkara, hal itu dibicarakan tersendiri dengan Anda.',
              'Karena teks asli disimpan, mohon jangan menuliskan hal yang belum diperlukan pada tahap awal, seperti nomor paspor, nomor identitas, atau data rekening bank.',
            ],
          },
          {
            heading: 'Tempat penyimpanan dan siapa yang dapat melihatnya',
            paragraphs: [
              'Isi kiriman Anda disimpan di tempat yang tidak terbuka untuk umum, dan hanya orang yang berwenang di kantor kami yang boleh mengaksesnya untuk menangani permintaan tersebut.',
              'Halaman ini tidak memberikan jaminan keamanan yang mutlak. Tidak ada jalur pengiriman maupun penyimpanan yang sepenuhnya aman, sehingga bahan yang sensitif sebaiknya dikirim hanya menurut petunjuk khusus dari advokat.',
            ],
          },
          {
            heading: 'Tujuan penggunaan',
            paragraphs: [
              'Data yang Anda kirim digunakan untuk meninjau permintaan, menghubungi Anda kembali, memastikan cara berkomunikasi, dan menangani perkara apabila pekerjaan jadi dimulai.',
              'Data ini tidak digunakan untuk pemasaran tanpa persetujuan Anda yang diberikan tersendiri untuk keperluan itu.',
            ],
          },
          {
            heading: 'Pemberitahuan dan nomor penerimaan',
            paragraphs: [
              'Ketika sebuah permintaan berhasil dikirim, sistem memberitahukannya kepada kantor. Jika pemberitahuan itu belum terkonfirmasi, tulisan Anda tetap tersimpan dan tidak hilang.',
              'Nomor penerimaan dibuat untuk menemukan kembali permintaan Anda dalam catatan kami. Nomor itu ditampilkan setelah permintaan tersimpan, dan Anda dapat menyebutkannya saat menghubungi kami lagi agar kami menemukan kiriman yang tepat.',
            ],
          },
          {
            heading: 'Hak Anda dan cara menghubungi kami',
            paragraphs: [
              'Anda dapat meminta akses, perbaikan, atau penghapusan data Anda, atau menarik persetujuan, melalui alamat email yang tertera pada halaman kontak. Jika ada kewajiban penyimpanan menurut ketentuan yang berlaku atau karena perkara yang sedang berjalan, kami akan menerangkan alasan pembatasannya.',
              'Halaman ini tidak menyebutkan jangka waktu penyimpanan yang tetap, karena jangka waktu sebenarnya bergantung pada dilanjutkan atau tidaknya perkara serta kewajiban penyimpanan yang terkait. Jika Anda ingin data Anda dihapus lebih awal, sampaikan permintaan itu ketika menghubungi kami.',
            ],
          },
          {
            heading: 'Tempat penyimpanan data dan penyedia layanan',
            paragraphs: [
              'Situs ini dihosting di Vercel, dan kiriman Anda disimpan di penyimpanan objek yang tidak terbuka untuk umum pada layanan tersebut. Email dikirim melalui layanan email yang digunakan kantor kami.',
              'Server sebagian penyedia layanan dapat berada di luar Taiwan, sehingga data Anda dapat disimpan dan diproses di sana. Setelah tujuan penyimpanannya tercapai, data dihapus tanpa penundaan; data yang wajib disimpan menurut ketentuan yang berlaku disimpan selama jangka waktu tersebut. Permintaan yang berkaitan dengan data pribadi diterima di wei@hoveringlaw.com.tw.',
            ],
          },
        ],
      },
      disclaimer: {
        eyebrow: 'PENAFIAN',
        title: 'Lingkup dan batas keterangan pada halaman ini',
        description:
          'Sifat keterangan umum, lingkup hukum yang berlaku, dan syarat terbentuknya hubungan antara advokat dan klien.',
        intro:
          'Bagian ini menegaskan apa yang dapat dan tidak dapat dilakukan oleh halaman panduan berbahasa Indonesia ini untuk Anda.',
        sections: [
          {
            heading: 'Hanya keterangan umum',
            paragraphs: [
              'Isi halaman-halaman ini ditulis sebagai keterangan umum. Ini bukan nasihat hukum untuk perkara Anda, dan tidak menggantikan peninjauan atas berkas Anda sendiri.',
              'Kesimpulan sebuah perkara bergantung pada fakta, ketentuan yang berlaku, dan waktunya, sehingga dua keadaan yang tampak serupa tetap dapat berakhir berbeda.',
            ],
          },
          {
            heading: 'Lingkup hukum',
            paragraphs: [
              'Kantor kami berpraktik menurut hukum Taiwan, dan halaman ini hanya membicarakan pekerjaan dalam lingkup itu.',
              'Isi halaman-halaman ini bukan nasihat menurut hukum yurisdiksi mana pun selain Taiwan, termasuk hukum tempat Anda tinggal. Jika ada bagian perkara Anda yang tunduk pada yurisdiksi lain, kami memastikan bersama Anda tenaga profesional berkualifikasi mana yang diperlukan untuk bagian tersebut.',
            ],
          },
          {
            heading: 'Hubungan advokat dan klien tidak terbentuk dengan sendirinya',
            paragraphs: [
              'Membaca halaman ini, mengirim formulir, atau mengirim email dengan sendirinya tidak membentuk hubungan antara advokat dan klien.',
              'Hubungan itu baru terbentuk setelah perkara ditinjau dan kedua pihak sama-sama memastikan penerimaan pekerjaan tersebut.',
            ],
          },
          {
            heading: 'Tidak ada jaminan hasil',
            paragraphs: [
              'Tidak ada bagian dari halaman ini yang merupakan janji atas hasil suatu perkara, atas dikabulkannya suatu permohonan, atau atas status tinggal dan status kerja.',
              'Tautan ke luar disediakan untuk kemudahan Anda; kami tidak menjamin ketepatan maupun kemutakhiran isi yang dimuat pihak ketiga.',
            ],
          },
        ],
      },
      columns: {
        eyebrow: 'ARTIKEL',
        title: 'Artikel tentang hukum Taiwan',
        description:
          'Artikel berbahasa Indonesia yang menjelaskan topik hukum Taiwan yang sering ditanyakan. Isinya keterangan umum pada saat penerbitannya, bukan nasihat hukum untuk perkara Anda.',
        intro:
          'Kantor kami memuat artikel yang menjelaskan topik hukum Taiwan yang sering ditanyakan. Artikel yang sudah tersedia dalam bahasa Indonesia dimuat di halaman ini; selain itu ada empat tautan, masing-masing membuka daftar artikel untuk satu bahasa aslinya.',
        sections: [
          {
            heading: 'Empat daftar menurut bahasa',
            paragraphs: [
              'Bagian ini berisi empat tautan: daftar artikel berbahasa Korea, daftar berbahasa Tionghoa, daftar berbahasa Inggris, dan daftar berbahasa Jepang. Setiap tautan mencantumkan bahasa daftarnya, sehingga Anda tahu lebih dulu isi dalam bahasa apa yang akan terbuka.',
              'Keempat daftar itu adalah daftar menurut bahasa asli artikelnya, bukan daftar terjemahan. Artikel yang sudah tersedia dalam bahasa Indonesia dimuat tersendiri di halaman ini.',
            ],
          },
          {
            heading: 'Ke mana tautannya membawa Anda',
            paragraphs: [
              'Ketika Anda memilih salah satu dari keempat tautan itu, daftar artikel untuk bahasa tersebut akan terbuka. Dari daftar itu Anda sendiri yang memilih tulisan yang ingin dibaca, dan seluruh isinya tampil dalam bahasa asli artikel.',
              'Halaman ini tidak meringkas isi artikel, dan tidak menjamin bahwa suatu topik tersedia dalam keempat bahasa itu. Setiap daftar hanya memuat tulisan yang memang terbit dalam bahasa tersebut.',
            ],
          },
          {
            heading: 'Sejauh mana artikel dapat dijadikan acuan',
            paragraphs: [
              'Artikel ditulis sebagai keterangan umum pada saat penerbitannya. Ketentuan dan cara penerapannya dapat berubah, dan sebuah artikel tidak memuat seluruh keadaan dalam perkara Anda.',
              'Karena itu, mohon jangan menjadikan sebuah artikel sebagai dasar untuk bertindak dalam perkara yang sebenarnya. Gunakan artikel untuk memahami gambaran umumnya, lalu bicarakan berkas Anda secara tersendiri dengan advokat; halaman ini bukan tahap konsultasi.',
            ],
          },
        ],
      },
    },
  },
  th: {
    languageName: 'ภาษาไทย',
    nav: {
      home: 'หน้าแรก',
      services: 'งานที่รับดำเนินการ',
      about: 'เกี่ยวกับสำนักงาน',
      lawyers: 'ทนายความ',
      pricing: 'ขอบเขตและค่าใช้จ่าย',
      contact: 'ติดต่อ',
      faq: 'คำถามที่พบบ่อย',
      privacy: 'ความเป็นส่วนตัว',
      disclaimer: 'ข้อจำกัดความรับผิด',
      columns: 'บทความ',
    },
    contactCta: 'ส่งเรื่องเพื่อขอคำปรึกษา',
    footerNotice:
      'หน้าภาษาไทยนี้เป็นข้อมูลแนะนำทั่วไปเกี่ยวกับงานของสำนักงานภายใต้กฎหมายไต้หวันเท่านั้น ไม่ใช่ความเห็นทางกฎหมายสำหรับเรื่องเฉพาะราย และการส่งข้อความผ่านหน้านี้ไม่ได้ทำให้เกิดความสัมพันธ์ระหว่างทนายความกับลูกความโดยอัตโนมัติ',
    skipLink: 'ข้ามเมนู ไปยังเนื้อหาหลัก',
    menuLabel: 'รายการหน้า',
    languageLabel: 'ภาษาที่แสดง',
    notFoundTitle: 'ไม่พบหน้าที่ต้องการ',
    notFoundText:
      'หน้าที่ท่านกำลังค้นหาไม่มีอยู่ หรือถูกย้ายไปยังที่อยู่อื่นแล้ว ท่านสามารถกลับไปยังหน้าแรกภาษาไทยเพื่อดูหัวข้อแนะนำที่มีอยู่ในขณะนี้',
    backHomeLabel: 'กลับไปหน้าแรก',
    readSourceLabel: 'เปิดสารบัญบทความในภาษาต้นฉบับ',
    home: {
      heroScrollLabel: 'เลื่อนลง',
      heroColumnsCtaLabel: 'ดูบทความ',
      servicesDetailLabel: 'ดูรายละเอียด',
      servicesAssistanceBefore:
        'หากยังไม่แน่ใจว่าเรื่องของท่านอยู่ในกลุ่มงานใด หน้า ',
      servicesAssistanceLinkLabel: 'ติดต่อ',
      servicesAssistanceAfter:
        ' อธิบายวิธีเขียนสรุปเรื่องเพื่อให้ทนายความพิจารณา',
      columnsViewAllLabel: 'ดูบทความทั้งหมด',
      columnsReadMoreLabel: 'อ่านต่อ',
      columnsReviewLabel: 'ตรวจสอบโดยทนายความ Wei Tseng',
      columnsOriginalLanguageBadge: 'ภาษาต้นฉบับ',
      columnsOriginalLanguageNote:
        'บทความด้านล่างยังไม่มีฉบับภาษาไทย รายการนี้คงไว้ตามภาษาต้นฉบับและจะเปิดหน้าในภาษานั้น เนื้อหาไม่ได้ผ่านการแปลอัตโนมัติ',
      imageBandAlt:
        'บ้านลานสามด้านแบบดั้งเดิมของไต้หวัน (三合院) และศาลาสมัยใหม่ในแสงกลางวัน',
      videoPauseLabel: 'หยุดวิดีโอชั่วคราว',
      videoPlayLabel: 'เล่นวิดีโอ',
      videoReplayLabel: 'เล่นวิดีโออีกครั้ง',
    },
    pages: {
      home: {
        eyebrow: 'ข้อมูลแนะนำ',
        title: 'บริการทางกฎหมายในไต้หวัน — ข้อมูลแนะนำภาษาไทย',
        description:
          'คำอธิบายทั่วไปเป็นภาษาไทยเกี่ยวกับขอบเขตงานของ Hovering International Law Firm ในไต้หวัน ภาษาที่ใช้ให้คำปรึกษา และวิธีเริ่มต้นติดต่อ',
        intro:
          'Hovering International Law Firm ให้ความช่วยเหลือแก่ลูกความจากต่างประเทศ รวมถึงผู้ที่อยู่ในไต้หวัน ในเรื่องที่อยู่ภายใต้กฎหมายไต้หวัน ได้แก่ การลงทุนและการจัดตั้งบริษัท ข้อพิพาททางแพ่ง คดีการสมรสและครอบครัว ข้อพิพาทแรงงาน คดีอาญา และทรัพย์สินทางปัญญา ส่วนภาษาไทยนี้ช่วยให้ท่านทราบว่างานใดอยู่ในขอบเขตที่เรารับดำเนินการ ควรเตรียมสิ่งใด และติดต่อได้อย่างไร เนื้อหานี้เป็นข้อมูลทั่วไป ไม่ใช่ความเห็นทางกฎหมายสำหรับเรื่องเฉพาะของท่าน',
        sections: [
          {
            heading: 'สำนักงานให้ความช่วยเหลือด้านใดบ้าง',
            paragraphs: [
              'Hovering International Law Firm เป็นสำนักงานกฎหมายที่ตั้งอยู่ในไต้หวัน ทำงานภายใต้กฎหมายไต้หวัน และมีที่ทำการที่ไทเป (臺北) เกาสง (高雄) ไถจง (臺中) และผิงตง (屏東) สำนักงานรับทั้งงานที่ปรึกษาสำหรับองค์กรธุรกิจและงานคดีในศาล พร้อมทั้งช่วยเหลือลูกความจากต่างประเทศในกระบวนการที่ต้องดำเนินการในไต้หวัน',
              'เนื้อหาทั้งหมดในหน้านี้เป็นข้อมูลทั่วไป ผลของแต่ละเรื่องขึ้นอยู่กับข้อเท็จจริง กฎเกณฑ์ที่ใช้บังคับ และช่วงเวลาที่เกิดเหตุ ข้อมูลแนะนำนี้จึงไม่อาจใช้แทนการพูดคุยกับทนายความเกี่ยวกับเอกสารและข้อเท็จจริงของท่านโดยตรง',
            ],
          },
          {
            heading: 'ภาษาของหน้าเว็บกับภาษาที่ใช้ให้คำปรึกษาเป็นคนละเรื่องกัน',
            paragraphs: [
              'หน้านี้เขียนเป็นภาษาไทย แต่การให้คำปรึกษาจริงกับทนายความดำเนินการเพียง 4 ภาษา ได้แก่ ภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี การที่ท่านอ่านข้อมูลแนะนำเป็นภาษาไทยได้ ไม่ได้หมายความว่าการปรึกษาจะดำเนินเป็นภาษาไทย',
              'เราไม่รับประกันว่าจะจัดล่ามให้ ไม่รับประกันว่าจะตอบกลับภายในระยะเวลาใด และไม่ได้ยืนยันการนัดหมายผ่านหน้านี้ หากท่านไม่สะดวกทั้ง 4 ภาษาข้างต้น หน้า “ติดต่อ” อธิบายวิธีที่เราจะยืนยันช่องทางการสื่อสารร่วมกับท่าน',
            ],
          },
          {
            heading: 'ประเภทงานที่สำนักงานรับดำเนินการ',
            paragraphs: [
              'ขอบเขตงานของสำนักงานประกอบด้วย 6 กลุ่มต่อไปนี้ หน้า “งานที่รับดำเนินการ” อธิบายแต่ละกลุ่มโดยละเอียดขึ้น พร้อมระบุสิ่งที่ไม่ได้รับประกันไว้ด้วย',
            ],
            items: [
              'การลงทุนและการจัดตั้งบริษัทในไต้หวัน',
              'ข้อพิพาททางแพ่งและการเรียกค่าสินไหมทดแทน',
              'คดีการสมรส ครอบครัว และมรดก',
              'ข้อพิพาทแรงงานและการจ้างงาน',
              'คดีอาญา',
              'ทรัพย์สินทางปัญญา ได้แก่ เครื่องหมายการค้า สิทธิบัตร และลิขสิทธิ์',
            ],
          },
          {
            heading: 'ควรเริ่มต้นอย่างไร',
            paragraphs: [
              'ขอแนะนำให้อ่านหน้า “งานที่รับดำเนินการ” เพื่อดูว่าเรื่องของท่านอยู่ในขอบเขตที่สำนักงานรับดำเนินการหรือไม่ จากนั้นจึงดูหน้า “ขอบเขตและค่าใช้จ่าย” และหน้า “ติดต่อ” เพื่อทราบวิธีกำหนดขอบเขตงานและยืนยันค่าใช้จ่ายก่อนเริ่มงาน',
              'เมื่อส่งเรื่องเข้ามา ท่านจะเขียนสรุปด้วยภาษาของท่านเองก็ได้ ข้อความต้นฉบับจะถูกเก็บไว้ตามที่ท่านเขียนและไม่มีการแปลโดยอัตโนมัติ เรื่องที่ส่งแล้วคือเรื่องที่รอการตรวจสอบ ยังไม่ใช่การปรึกษาที่เสร็จสิ้น และยังไม่ใช่การนัดหมายที่ได้รับการยืนยัน',
            ],
          },
        ],
      },
      services: {
        eyebrow: 'งานที่รับดำเนินการ',
        title: 'ประเภทเรื่องที่สำนักงานรับดำเนินการ',
        description:
          'งาน 6 กลุ่มที่อยู่ในขอบเขตการให้บริการของสำนักงานในไต้หวัน พร้อมข้อจำกัดที่ควรทราบไว้ก่อนติดต่อ',
        intro:
          'ต่อไปนี้คือกลุ่มงานที่สำนักงานรับดำเนินการจริง พร้อมประเด็นที่มักถูกถามในช่วงแรก คำอธิบายนี้ช่วยให้ท่านพิจารณาว่าเรื่องของท่านอยู่ในขอบเขตที่เรารับดำเนินการหรือไม่ โดยเป็นข้อมูลทั่วไป ไม่ใช่การวิเคราะห์ทางกฎหมายสำหรับเอกสารเฉพาะเรื่องใดเรื่องหนึ่ง',
        sections: [
          {
            heading: 'การลงทุนและการจัดตั้งบริษัทในไต้หวัน',
            paragraphs: [
              'สำนักงานให้ความช่วยเหลือแก่นักลงทุนและบริษัทต่างชาติที่จัดตั้งหรือดำเนินกิจการในไต้หวัน ทั้งการเลือกรูปแบบนิติบุคคล การเตรียมและยื่นเอกสาร การนำเงินลงทุนเข้าประเทศ การดำเนินการกับธนาคาร การพิจารณาสถานประกอบการ และเงื่อนไขเฉพาะของแต่ละประเภทธุรกิจ นอกจากนี้ยังช่วยดูแลเรื่องบัญชีและภาษีที่เกิดจากการจัดตั้งและการดำเนินกิจการในไต้หวันด้วย',
              'ลำดับขั้นตอนและระยะเวลาแตกต่างกันไปตามรูปแบบนิติบุคคลที่เลือก ผู้ลงทุน ประเภทธุรกิจ ธนาคารที่เกี่ยวข้อง และเอกสารที่มีอยู่ ทั้งนี้ การจัดตั้งบริษัทไม่ได้ทำให้ได้สถานะการมีถิ่นที่อยู่ (居留) หรือใบอนุญาตทำงาน (工作許可) โดยอัตโนมัติ เพราะเป็นคนละกระบวนการกัน และต้องพิจารณาเป็นรายกรณี',
            ],
          },
          {
            heading: 'ข้อพิพาททางแพ่งและการเรียกค่าสินไหมทดแทน',
            paragraphs: [
              'กลุ่มนี้ครอบคลุมข้อพิพาทตามสัญญา การเรียกค่าสินไหมทดแทนจากการละเมิด และข้อพิพาทของผู้บริโภค งานมักเริ่มจากการจัดลำดับเหตุการณ์ตามเวลา ตรวจดูเอกสารและพยานหลักฐานที่มีอยู่ แล้วจึงพิจารณาแนวทางดำเนินการ',
              'อายุความตามกฎหมายและความครบถ้วนของพยานหลักฐานมีผลอย่างมากต่อการดำเนินคดีแพ่ง ท่านจึงควรแจ้งวันที่ต่าง ๆ ที่ทราบตั้งแต่ต้น หากท่านยังเก็บสัญญา ข้อความที่ติดต่อกัน หลักฐานการชำระเงิน หรือภาพถ่ายเหตุการณ์ไว้ โปรดแจ้งให้ทราบตั้งแต่แรก',
            ],
          },
          {
            heading: 'คดีการสมรส ครอบครัว และมรดก',
            paragraphs: [
              'สำนักงานรับดำเนินการเรื่องการหย่า (離婚) การแบ่งทรัพย์สิน การใช้และการรับภาระสิทธิและหน้าที่ต่อบุตรผู้เยาว์ (未成年子女權利義務之行使或負擔) การพบและติดต่อกับบุตร (會面交往) และมรดก (繼承) รวมถึงกรณีที่คู่กรณีหรือทรัพย์สินอยู่คนละประเทศ คดีครอบครัวที่มีองค์ประกอบต่างประเทศมักต้องตรวจสอบเพิ่มเติมเกี่ยวกับเอกสารทะเบียนราษฎร (戶籍) รูปแบบของเอกสาร และวิธีพิสูจน์ในไต้หวัน',
              'เนื่องจากเรื่องครอบครัวมักมีกำหนดเวลาและมีหลายกระบวนการดำเนินไปพร้อมกัน สรุปเรื่องในครั้งแรกจึงควรระบุความสัมพันธ์ระหว่างคู่กรณี ที่อยู่ปัจจุบัน และกระบวนการที่ดำเนินไปแล้วหรือกำลังดำเนินอยู่',
            ],
          },
          {
            heading: 'ข้อพิพาทแรงงานและการจ้างงาน',
            paragraphs: [
              'กลุ่มนี้ครอบคลุมการเลิกจ้าง ค่าชดเชยตามกฎหมายไต้หวัน (資遣費 ซึ่งไม่ควรถือว่าเหมือนกับระบบทำนองเดียวกันของประเทศอื่น) ค่าจ้าง และข้อพิพาทที่เกิดจากข้อกำหนดในสัญญาจ้างแรงงาน (勞動契約) ทั้งในฝ่ายลูกจ้างและฝ่ายนายจ้าง ในการตรวจสอบ เราจะแยกเหตุแห่งการเลิกจ้างออกจากประเด็นเรื่องการบอกกล่าว เงินที่ต้องจ่าย และกำหนดเวลา',
              'สัญญาจ้างแรงงาน ข้อบังคับเกี่ยวกับการทำงาน (工作規則) สลิปเงินเดือน และข้อความที่ติดต่อกันระหว่างสองฝ่าย มักเป็นเอกสารสำคัญ หากท่านยังเก็บเอกสารเหล่านี้ไว้ โปรดระบุไว้ในสรุปเรื่องด้วย เพื่อให้การตรวจสอบเบื้องต้นแม่นยำขึ้น',
            ],
          },
          {
            heading: 'คดีอาญา',
            paragraphs: [
              'สำนักงานให้ความช่วยเหลือทั้งในชั้นสอบสวนและชั้นพิจารณาของศาล ทั้งฝ่ายผู้ถูกกล่าวหาหรือจำเลย และฝ่ายผู้เสียหาย รวมถึงการประเมินความเสี่ยงทางอาญาที่เกิดขึ้นในการประกอบธุรกิจ',
              'คดีอาญามักมีกำหนดเวลาสั้นและมีขั้นตอนที่กำหนดไว้แน่นอน หากท่านได้รับหมายหรือหนังสือจากเจ้าพนักงานแล้ว โปรดแจ้งวันที่ปรากฏในเอกสารนั้นตั้งแต่ต้น เพื่อให้เรื่องได้รับการตรวจสอบตามลำดับความเร่งด่วน',
            ],
          },
          {
            heading: 'ทรัพย์สินทางปัญญา',
            paragraphs: [
              'สำนักงานช่วยดำเนินการจดทะเบียนเครื่องหมายการค้า (商標) และสิทธิบัตร (專利) เรื่องเกี่ยวกับลิขสิทธิ์ ตลอดจนข้อพิพาทที่เกี่ยวข้องกับสิทธิเหล่านี้ในไต้หวัน',
              'งานกลุ่มนี้ลำดับการดำเนินการมีความสำคัญมาก ทั้งขอบเขตความคุ้มครอง ช่วงเวลาที่ยื่นคำขอ และสภาพการใช้งานจริง ล้วนมีผลต่อแนวทางที่เลือก ทั้งนี้ การยื่นคำขอไม่ได้เป็นหลักประกันว่าคำขอนั้นจะได้รับอนุมัติ',
            ],
          },
          {
            heading: 'ขอบเขตและการยืนยัน',
            paragraphs: [
              'สำนักงานทำงานภายใต้กฎหมายไต้หวัน และรับเรื่องที่อยู่ในกลุ่มงานข้างต้น ส่วนขอบเขตของแต่ละเรื่องจะได้รับการยืนยันเป็นการเฉพาะ หลังจากทนายความตรวจสอบเนื้อหาที่ท่านส่งมาแล้ว',
              'สถานะการพำนัก ใบอนุญาตทำงาน และเรื่องทำนองเดียวกัน พิจารณาจากเอกสารและข้อเท็จจริงของแต่ละราย ไม่ได้อนุมานจากสัญชาติ หากเรื่องของท่านมีส่วนที่เกี่ยวข้องกับประเด็นเหล่านี้ โปรดระบุไว้เมื่อติดต่อเข้ามา เพื่อให้ทนายความพิจารณาได้ว่าเรื่องของท่านอยู่ในกลุ่มงานใด ทั้งนี้ หน้านี้ไม่รับประกันผลและไม่รับประกันระยะเวลาตอบกลับ',
            ],
          },
        ],
      },
      about: {
        eyebrow: 'เกี่ยวกับสำนักงาน',
        title: 'เกี่ยวกับ Hovering International Law Firm',
        description:
          'ข้อมูลพื้นฐานเกี่ยวกับสำนักงานกฎหมายในไต้หวันแห่งนี้ สำนักงานสาขา และงานที่เกี่ยวข้องกับต่างประเทศ',
        intro:
          'Hovering International Law Firm เป็นสำนักงานกฎหมายในไต้หวัน โดยมีทนายความที่ทำงานในหลากหลายสาขา ตั้งแต่งานที่ปรึกษาสำหรับองค์กรธุรกิจไปจนถึงงานคดีในศาล ส่วนนี้อธิบายความเป็นมาของสำนักงาน สำนักงานสาขา และงานที่เกี่ยวข้องกับต่างประเทศ',
        sections: [
          {
            heading: 'การก่อตั้งและโครงสร้าง',
            paragraphs: [
              'Hovering International Law Firm (昊鼎國際法律事務所) ก่อตั้งขึ้นในปี 2016 โดยกลุ่มทนายความที่จบการศึกษาจากมหาวิทยาลัยแห่งชาติไต้หวัน (國立臺灣大學) ชื่อภาษาจีนของสำนักงานประกอบด้วยอักษรสองตัว คือ 昊 หมายถึงท้องฟ้าอันกว้างใหญ่ และ 鼎 หมายถึงรากฐานอันมั่นคง ซึ่งสะท้อนแนวทางของสำนักงานตั้งแต่เริ่มก่อตั้ง',
              'สำนักงานมีที่ทำการที่ไทเป (臺北) เกาสง (高雄) ไถจง (臺中) และผิงตง (屏東) สาขาเกาสงเน้นงานด้านการกำกับดูแลกิจการ พร้อมทั้งรับข้อพิพาททางแพ่ง อาญา และปกครองทั่วไป สาขาไถจงรับงานก่อสร้าง ทรัพย์สินทางปัญญา และงานที่เกี่ยวข้องกับเกาหลีและญี่ปุ่น ส่วนสาขาผิงตงเปิดขึ้นในปี 2017 เพื่อรองรับความต้องการในพื้นที่',
              'นอกจากงานด้านทนายความแล้ว ในปี 2020 ได้มีการก่อตั้ง Hovering Accounting Office ซึ่งให้บริการด้านบัญชีและการวางแผนภาษีแก่เจ้าของกิจการและบุคคลที่มีสินทรัพย์สูง',
            ],
          },
          {
            heading: 'งานที่เกี่ยวข้องกับต่างประเทศ',
            paragraphs: [
              'งานที่เกี่ยวข้องกับต่างประเทศของสำนักงานประกอบด้วยการจัดตั้งบริษัท การยื่นขอวีซ่า การจดทะเบียนเครื่องหมายการค้าและสิทธิบัตร การประเมินความเสี่ยงทางกฎหมาย และการให้คำปรึกษาด้านภาษีนิติบุคคล โดยสาขาไถจงรับงานก่อสร้าง ทรัพย์สินทางปัญญา และงานที่เกี่ยวข้องกับเกาหลีและญี่ปุ่นเป็นการเฉพาะ ส่วนทนายความ Wei Tseng (曾雋崴) ดูแลลูกความชาวเกาหลี ชาวญี่ปุ่น และลูกความต่างชาติอื่น ๆ ในกลุ่มงานข้างต้น',
              'การที่เราจะรับดำเนินการเรื่องใดได้หรือไม่ ขึ้นอยู่กับเนื้อหาของเรื่องนั้นและภาษาที่ใช้สื่อสาร หากเรื่องของท่านอยู่ในกลุ่มงานข้างต้น และสื่อสารกันได้ด้วยภาษาใดภาษาหนึ่งใน 4 ภาษาที่ใช้ให้คำปรึกษา ท่านสามารถส่งสรุปเรื่องเข้ามาเพื่อให้ทนายความตรวจสอบได้',
            ],
          },
          {
            heading: 'เมื่อท่านติดต่อเข้ามา',
            paragraphs: [
              'เมื่อได้รับสรุปเรื่องของท่านแล้ว ทนายความจะตรวจสอบเนื้อหา จากนั้นจึงหารือเกี่ยวกับขอบเขตงานที่ดำเนินการได้ เอกสารที่ยังต้องเพิ่มเติม และขั้นตอนถัดไป สำหรับเรื่องที่มีประเด็นด้านบัญชีหรือภาษี สำนักงานสามารถทำงานร่วมกับส่วนงานบัญชีในกระบวนการเดียวกันได้',
              'ผลของแต่ละเรื่องขึ้นอยู่กับข้อเท็จจริงและเอกสารเฉพาะราย เราจึงไม่รับประกันผล หากท่านต้องการคำตอบที่แน่นอนสำหรับกรณีของท่าน วิธีเดียวคือการปรึกษาทนายความโดยตรงจากเอกสารและข้อเท็จจริงนั้น ในภาษาใดภาษาหนึ่งจาก 4 ภาษาที่ใช้ให้คำปรึกษา',
            ],
          },
        ],
      },
      lawyers: {
        eyebrow: 'ทนายความ',
        title: 'ทีมงานระหว่างประเทศ Hovering',
        description:
          'ประวัติของทนายความ ผู้จัดการงาน และผู้สอบบัญชีพันธมิตรของ Hovering',
        // WO-O33: `/en/lawyers` is header -> roster -> key facts. The three
        // prose cards this page used to carry were a duplicate of the key-facts
        // rows, a third copy of the consultation-language notice, and a
        // jurisdiction disclaimer that belongs on the disclaimer page, so the
        // card grid is gone. With no cards there is no lede above them either.
        intro: '',
        sections: [],
      },
      pricing: {
        eyebrow: 'ขอบเขตและค่าใช้จ่าย',
        title: 'การกำหนดขอบเขตงานและค่าใช้จ่าย',
        description:
          'คำอธิบายลำดับการกำหนดขอบเขตงาน การยืนยันค่าใช้จ่าย และเหตุผลที่หน้านี้ไม่ได้แสดงอัตราค่าบริการ',
        intro:
          'หน้านี้อธิบายวิธีกำหนดค่าใช้จ่าย ไม่ได้ระบุตัวเลข จำนวนค่าใช้จ่ายขึ้นอยู่กับขอบเขตงานของแต่ละเรื่อง และจะมีความหมายก็ต่อเมื่อขอบเขตดังกล่าวชัดเจนแล้ว',
        sections: [
          {
            heading: 'ขั้นแรกคือการกำหนดขอบเขตงาน',
            paragraphs: [
              'เรื่องประเภทเดียวกันอาจมีปริมาณงานต่างกันมาก ขึ้นอยู่กับจำนวนคู่กรณี เอกสารที่มีอยู่ กำหนดเวลาที่ต้องปฏิบัติตาม และการที่กระบวนการได้เริ่มไปแล้วหรือยัง ด้วยเหตุนี้ ขั้นตอนแรกจึงเป็นการทำให้ชัดเจนว่างานที่จะดำเนินการรวมถึงอะไรบ้าง และไม่รวมอะไรบ้าง',
              'สรุปเรื่องที่ท่านส่งมาในตอนแรกคือพื้นฐานของการกำหนดขอบเขตนี้ ยิ่งสรุปชัดเจนว่าเกิดอะไรขึ้น ท่านต้องการอะไร และมีกำหนดเวลาใด การกำหนดขอบเขตก็ยิ่งแม่นยำ',
            ],
          },
          {
            heading: 'ค่าใช้จ่ายจะได้รับการยืนยันก่อนเริ่มงาน',
            paragraphs: [
              'เมื่อขอบเขตงานชัดเจนแล้ว จำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการหารือและยืนยันกับท่านก่อนเริ่มงาน หากขอบเขตงานเปลี่ยนแปลงระหว่างดำเนินการ ส่วนที่เปลี่ยนแปลงนั้นก็ต้องได้รับการยืนยันใหม่เช่นกัน',
              'หน้านี้ไม่ใช่ใบเสนอราคา และไม่ก่อให้เกิดภาระการชำระเงินใด ๆ การส่งเรื่องเข้ามาผ่านหน้านี้ก็ไม่มีค่าใช้จ่าย',
            ],
          },
          {
            heading: 'การปรึกษาอาจเป็นบริการที่มีค่าใช้จ่าย',
            paragraphs: [
              'การปรึกษากับทนายความอาจเป็นบริการที่มีค่าใช้จ่าย หน้านี้ไม่ได้ระบุว่าการปรึกษาครั้งแรกไม่เสียค่าใช้จ่าย และไม่ควรตีความข้อความใดในหน้านี้ไปในความหมายนั้น',
              'หากการปรึกษามีค่าใช้จ่าย จำนวนเงินและวิธีชำระจะได้รับการแจ้งให้ทราบก่อนการปรึกษาจะเริ่มขึ้น',
            ],
          },
          {
            heading: 'เหตุใดหน้านี้จึงไม่แสดงอัตราค่าบริการ',
            paragraphs: [
              'ค่าใช้จ่ายขึ้นอยู่กับแต่ละเรื่อง ทั้งปริมาณงานที่ต้องทำ จำนวนคู่กรณี เอกสารที่มีอยู่ กำหนดเวลาที่ต้องปฏิบัติตาม และการที่กระบวนการได้เริ่มไปแล้วหรือยัง ตัวเลขที่ประกาศไว้ล่วงหน้าจึงไม่อาจบอกค่าใช้จ่ายสำหรับเรื่องของท่านได้ ด้วยเหตุนี้ แทนที่จะแสดงอัตราค่าบริการ เราจะกำหนดขอบเขตงานของเรื่องของท่านก่อน แล้วจึงแจ้งค่าใช้จ่ายที่ตรงกับขอบเขตนั้น เพื่อให้ท่านพิจารณาก่อนเริ่มงาน',
              'นอกจากค่าทนายความแล้ว เรื่องหนึ่ง ๆ ยังอาจมีค่าธรรมเนียมที่ต้องชำระต่อศาล หน่วยงานของรัฐ หรือบุคคลภายนอก ค่าใช้จ่ายส่วนนี้แยกต่างหากจากค่าทนายความ และขึ้นอยู่กับกระบวนการที่ดำเนินการ',
            ],
          },
        ],
      },
      contact: {
        eyebrow: 'ติดต่อ',
        title: 'วิธีติดต่อสำนักงาน',
        description:
          'ภาษาของหน้าเว็บ ภาษาที่ใช้ให้คำปรึกษา แนวทางเมื่อท่านไม่สะดวกทั้ง 4 ภาษา และสิ่งที่ไม่ได้รับประกัน',
        intro:
          'ก่อนติดต่อเข้ามา โปรดแยกแยะ 3 เรื่องต่อไปนี้ออกจากกัน ทั้งสามเรื่องมักถูกเข้าใจปะปนกัน ทั้งที่มีความหมายต่างกัน',
        sections: [
          {
            heading: '3 เรื่องที่ต้องแยกจากกัน',
            paragraphs: [
              'ภาษาที่ใช้แสดงหน้าเว็บ ภาษาที่ใช้ปรึกษากับทนายความ และภาษาที่ท่านใช้เขียนข้อความ เป็นสามเรื่องที่เป็นอิสระจากกัน',
            ],
            items: [
              'ภาษาของหน้าเว็บ: ข้อมูลแนะนำส่วนนี้จัดทำเป็นภาษาไทย',
              'ภาษาที่ใช้ให้คำปรึกษา: การปรึกษากับทนายความดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
              'ภาษาที่ท่านเขียน: ท่านเขียนสรุปเรื่องด้วยภาษาของท่านเองได้ และข้อความต้นฉบับจะถูกเก็บไว้ตามเดิม',
            ],
          },
          {
            heading: 'หากท่านไม่สะดวกทั้ง 4 ภาษาที่ใช้ให้คำปรึกษา',
            paragraphs: [
              'ในแบบฟอร์มติดต่อ ท่านสามารถเลือก “ต้องยืนยันวิธีติดต่อ” ได้ จากนั้นเราจะตอบกลับเพื่อยืนยันวิธีสื่อสารที่เป็นไปได้ร่วมกับท่าน ทั้งนี้ เราไม่รับประกันว่าจะรองรับภาษาอื่นได้ และไม่รับประกันระยะเวลาตอบกลับ',
              'ขั้นตอนนี้เป็นเพียงการยืนยัน ไม่ใช่คำมั่นสัญญา เราไม่รับประกันว่าจะจัดล่ามให้ ไม่รับประกันว่าจะให้บริการเป็นภาษาไทยหรือภาษาอื่นนอกเหนือจาก 4 ภาษาข้างต้น และไม่รับประกันว่าจะรับดำเนินการได้ทุกเรื่อง',
            ],
          },
          {
            heading: 'ควรเขียนอะไรในข้อความแรก',
            paragraphs: [
              'ควรระบุว่าเกิดอะไรขึ้น ท่านต้องการความช่วยเหลือด้านใด เรื่องนี้เกี่ยวข้องกับไต้หวันอย่างไร และมีกำหนดเวลาหรือไม่หากท่านทราบ หากได้รับหมายหรือหนังสือจากศาลหรือหน่วยงานของรัฐแล้ว โปรดแจ้งวันที่ปรากฏในเอกสารนั้นด้วย',
              'ในขั้นแรกยังไม่จำเป็นต้องส่งเลขหนังสือเดินทาง เลขบัตรประจำตัว ข้อมูลบัญชีธนาคาร เวชระเบียน หรือแฟ้มพยานหลักฐานทั้งหมด โปรดรอคำแนะนำจากทนายความ แล้วจึงส่งเอกสารที่มีความอ่อนไหวด้วยวิธีที่ปลอดภัย',
            ],
          },
          {
            heading: 'สิ่งที่หน้านี้ไม่ได้รับประกัน',
            paragraphs: [
              'เราไม่รับประกันระยะเวลาในการตอบกลับ ไม่ได้ยืนยันการนัดหมายผ่านหน้านี้ ไม่รับประกันว่าทนายความคนใดจะเป็นผู้รับผิดชอบเรื่อง และไม่ได้จัดล่ามให้ ส่วนการแปลข้อความเป็นคนละเรื่องกัน ข้อความที่ท่านส่งมาจะไม่ถูกแปลโดยอัตโนมัติ',
              'เมื่อท่านส่งเรื่องเข้ามา เนื้อหาจะถูกบันทึกไว้และรอการตรวจสอบ หากผ่านไประยะหนึ่งแล้วท่านยังไม่ได้รับการติดต่อกลับ ท่านสามารถส่งเรื่องซ้ำได้ทางอีเมลตามที่อยู่ในหน้าติดต่อ',
            ],
          },
        ],
      },
      faq: {
        eyebrow: 'คำถามที่พบบ่อย',
        title: 'คำถามที่พบบ่อย',
        description:
          'คำอธิบายเกี่ยวกับขอบเขตงาน การเตรียมตัว ภาษา ค่าใช้จ่าย และความหมายของการส่งเรื่องเข้ามา',
        intro:
          'คำถามด้านล่างนี้ตอบไว้ในระดับข้อมูลทั่วไป คำตอบสำหรับเรื่องเฉพาะของท่านจะให้ได้ก็ต่อเมื่อทนายความได้ตรวจสอบเอกสารและข้อเท็จจริงแล้ว',
        sections: [
          {
            heading: 'วิธีใช้ส่วนนี้',
            paragraphs: [
              'หากท่านไม่พบคำตอบสำหรับสถานการณ์ของท่าน โดยทั่วไปนั่นเป็นสัญญาณว่าคำตอบขึ้นอยู่กับข้อเท็จจริงเฉพาะราย ในกรณีเช่นนี้ โปรดเขียนข้อเท็จจริงดังกล่าวไว้ในสรุปเรื่องเมื่อติดต่อเข้ามา แทนการอนุมานเอาเองจากเนื้อหาในหน้านี้',
            ],
          },
        ],
        faqs: [
          {
            question: 'สำนักงานรับเรื่องประเภทใดบ้าง',
            answer:
              'สำนักงานรับงาน 6 กลุ่ม ได้แก่ การลงทุนและการจัดตั้งบริษัทในไต้หวัน ข้อพิพาททางแพ่งและการเรียกค่าสินไหมทดแทน คดีการสมรส ครอบครัว และมรดก ข้อพิพาทแรงงาน คดีอาญา และทรัพย์สินทางปัญญา ส่วนการจะรับเรื่องใดเรื่องหนึ่งหรือไม่ จะพิจารณาหลังตรวจสอบเนื้อหาแล้ว',
          },
          {
            question: 'ควรเตรียมอะไรก่อนติดต่อ',
            answer:
              'โปรดเตรียมสรุปสั้น ๆ เกี่ยวกับลำดับเหตุการณ์ สิ่งที่ท่านต้องการ ความเกี่ยวข้องของเรื่องกับไต้หวัน และกำหนดเวลาหากมี หากมีหมายหรือหนังสือจากศาลหรือหน่วยงานของรัฐแล้ว โปรดแจ้งวันที่ในเอกสารด้วย ในขั้นนี้ยังไม่จำเป็นต้องส่งเอกสารแสดงตนหรือพยานหลักฐานทั้งหมด',
          },
          {
            question: 'ปรึกษาเป็นภาษาไทยได้หรือไม่',
            answer:
              'ไม่ได้ ข้อมูลแนะนำส่วนนี้จัดทำเป็นภาษาไทย แต่การปรึกษากับทนายความดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี ทั้งนี้ สำนักงานไม่ได้จัดล่ามให้ ส่วนการแปลข้อความเป็นคนละเรื่องกัน ข้อความต้นฉบับที่ท่านเขียนจะถูกเก็บไว้ตามเดิมและไม่มีการแปลโดยอัตโนมัติ',
          },
          {
            question: 'หากไม่สะดวกทั้ง 4 ภาษานั้นจะทำอย่างไร',
            answer:
              'โปรดเลือก “ต้องยืนยันวิธีติดต่อ” เมื่อส่งเรื่องเข้ามา เราจะตอบกลับเพื่อยืนยันวิธีสื่อสารที่เป็นไปได้ร่วมกับท่าน ขั้นตอนนี้เป็นการยืนยัน ไม่ใช่คำมั่นว่าเราจะให้บริการเป็นภาษาอื่นได้',
          },
          {
            question: 'ข้อความที่เขียนเป็นภาษาไทยจะถูกจัดการอย่างไร',
            answer:
              'ข้อความต้นฉบับที่ท่านเขียนจะถูกเก็บไว้ตามเดิมและไม่มีการแปลโดยอัตโนมัติ หากจำเป็น ภาษาที่จะใช้สื่อสารในขั้นถัดไปจะยืนยันร่วมกับท่าน',
          },
          {
            question: 'ส่งเรื่องแล้วถือว่าได้รับคำปรึกษาแล้วหรือไม่',
            answer:
              'ยังไม่ถือว่าได้รับ เรื่องที่ส่งแล้วคือเรื่องที่รอทนายความตรวจสอบ ไม่ใช่ความเห็นทางกฎหมาย ไม่ใช่การนัดหมายที่ยืนยันแล้ว และการส่งเรื่องเองก็ไม่ได้ทำให้เกิดความสัมพันธ์ระหว่างทนายความกับลูกความ',
          },
          {
            question: 'ค่าใช้จ่ายคิดอย่างไร',
            answer:
              'จะกำหนดขอบเขตงานก่อน จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน หน้านี้ไม่ได้แสดงตัวเลข และไม่ได้ระบุว่าการปรึกษาครั้งแรกไม่เสียค่าใช้จ่าย',
          },
          {
            question: 'หากเรื่องของท่านเร่งด่วนมากจะทำอย่างไร',
            answer:
              'โปรดระบุกำหนดเวลา หรือวันที่ปรากฏในเอกสารทางการ ไว้ตั้งแต่ต้นของสรุปเรื่อง เพื่อให้ทนายความเห็นกำหนดเวลาเหล่านั้นเมื่อตรวจสอบ ทั้งนี้ หน้านี้ไม่มีสายด่วนและไม่รับประกันระยะเวลาตอบกลับ หากเรื่องเร่งด่วนจนรอไม่ได้ ท่านควรหาช่องทางอื่นในพื้นที่ของท่านควบคู่ไปด้วย',
          },
        ],
      },
      privacy: {
        eyebrow: 'ความเป็นส่วนตัว',
        title: 'ข้อมูลที่เก็บผ่านแบบฟอร์มติดต่อ',
        description:
          'แบบฟอร์มติดต่อในส่วนภาษาไทยเก็บข้อมูลใดบ้าง ข้อความต้นฉบับได้รับการจัดการอย่างไร และท่านติดต่อเรื่องข้อมูลของท่านได้อย่างไร',
        intro:
          'ส่วนนี้กล่าวถึงเฉพาะแบบฟอร์มติดต่อในหน้าข้อมูลแนะนำเหล่านี้ เนื้อหาที่ระบุไว้เป็นคำอธิบายวิธีจัดการข้อมูล ไม่ใช่คำรับประกันทางเทคนิค',
        sections: [
          {
            heading: 'ข้อมูลที่เก็บ',
            paragraphs: [
              'เมื่อท่านส่งเรื่องผ่านแบบฟอร์มในส่วนนี้ ระบบจะบันทึกข้อมูลต่อไปนี้',
            ],
            items: [
              'ชื่อที่ท่านกรอก',
              'ที่อยู่อีเมลสำหรับติดต่อกลับ',
              'ภาษาที่แสดงบนหน้าเว็บขณะที่ท่านส่ง',
              'ภาษาที่ท่านใช้เขียน',
              'ภาษาที่ท่านต้องการใช้ในการปรึกษา',
              'ข้อความต้นฉบับที่ท่านเขียน',
              'การให้ความยินยอมส่งเรื่องของท่าน',
              'หมายเลขรับเรื่องสำหรับใช้ค้นหาเรื่องของท่าน',
            ],
          },
          {
            heading: 'ข้อความต้นฉบับถูกเก็บไว้ตามเดิม',
            paragraphs: [
              'ข้อความที่ท่านเขียนจะถูกเก็บไว้ตามที่ท่านเขียนทุกประการ และไม่มีการแปลโดยอัตโนมัติ หากจำเป็นต้องมีคำแปลเพื่อดำเนินเรื่อง เราจะหารือกับท่านเป็นการเฉพาะ',
              'เนื่องจากข้อความต้นฉบับถูกเก็บไว้ จึงขอความกรุณาอย่าเขียนข้อมูลที่ยังไม่จำเป็นในขั้นแรก เช่น เลขหนังสือเดินทาง เลขบัตรประจำตัว หรือข้อมูลบัญชีธนาคาร',
            ],
          },
          {
            heading: 'จัดเก็บไว้ที่ใดและใครเข้าถึงได้',
            paragraphs: [
              'เนื้อหาที่ท่านส่งมาจะถูกจัดเก็บในพื้นที่ที่ไม่เปิดเผยต่อสาธารณะ และมีเพียงผู้ที่ได้รับมอบหมายในสำนักงานเท่านั้นที่เข้าถึงได้เพื่อดำเนินการกับเรื่องดังกล่าว',
              'หน้านี้ไม่ได้ให้คำรับประกันความปลอดภัยอย่างเด็ดขาด ไม่มีช่องทางส่งหรือระบบจัดเก็บใดปลอดภัยโดยสมบูรณ์ ดังนั้นเอกสารที่มีความอ่อนไหวจึงควรส่งตามคำแนะนำเฉพาะของทนายความเท่านั้น',
            ],
          },
          {
            heading: 'วัตถุประสงค์ในการใช้',
            paragraphs: [
              'ข้อมูลที่ท่านส่งมาจะใช้เพื่อตรวจสอบเรื่อง ติดต่อกลับหาท่าน ยืนยันวิธีสื่อสาร และดำเนินการกับเรื่องนั้นหากมีการเริ่มงานจริง',
              'ข้อมูลนี้จะไม่ถูกนำไปใช้เพื่อการตลาด หากท่านไม่ได้ให้ความยินยอมสำหรับวัตถุประสงค์ดังกล่าวเป็นการเฉพาะ',
            ],
          },
          {
            heading: 'การแจ้งเตือนและหมายเลขรับเรื่อง',
            paragraphs: [
              'เมื่อส่งเรื่องสำเร็จ ระบบจะแจ้งไปยังสำนักงาน หากการแจ้งเตือนนั้นยังยืนยันไม่ได้ ข้อความที่ท่านเขียนยังคงถูกบันทึกไว้และไม่สูญหาย',
              'หมายเลขรับเรื่องสร้างขึ้นเพื่อใช้ค้นหาเรื่องของท่านในบันทึกของเรา โดยจะแสดงให้เห็นหลังจากบันทึกเรื่องแล้ว และท่านสามารถแจ้งหมายเลขนี้เมื่อติดต่อกลับมาอีกครั้ง เพื่อให้เราค้นหาเรื่องที่ท่านส่งได้ถูกต้อง',
            ],
          },
          {
            heading: 'สิทธิของท่านและช่องทางติดต่อ',
            paragraphs: [
              'ท่านสามารถขอเข้าถึง แก้ไข หรือลบข้อมูลของท่าน หรือถอนความยินยอม ได้ทางอีเมลตามที่อยู่ในหน้าติดต่อ หากมีหน้าที่ต้องเก็บรักษาตามกฎเกณฑ์ที่ใช้บังคับ หรือเนื่องจากมีเรื่องที่กำลังดำเนินอยู่ เราจะชี้แจงเหตุผลของข้อจำกัดนั้น',
              'หน้านี้ไม่ได้ระบุระยะเวลาเก็บรักษาที่ตายตัว เพราะระยะเวลาจริงขึ้นอยู่กับว่าเรื่องนั้นดำเนินต่อไปหรือไม่ และหน้าที่ในการเก็บรักษาที่เกี่ยวข้อง หากท่านประสงค์ให้ลบข้อมูลของท่านเร็วกว่านั้น โปรดแจ้งความประสงค์ดังกล่าวเมื่อติดต่อเข้ามา',
            ],
          },
          {
            heading: 'สถานที่จัดเก็บข้อมูลและผู้ให้บริการ',
            paragraphs: [
              'เว็บไซต์นี้ใช้บริการโฮสติงของ Vercel และเรื่องที่ท่านส่งมาจะถูกเก็บไว้ในพื้นที่จัดเก็บข้อมูลแบบไม่เปิดเผยต่อสาธารณะของบริการดังกล่าว ส่วนอีเมลจะถูกส่งผ่านบริการอีเมลที่สำนักงานใช้อยู่',
              'เซิร์ฟเวอร์ของผู้ให้บริการบางรายอาจตั้งอยู่นอกไต้หวัน ซึ่งในกรณีนั้นข้อมูลของท่านอาจถูกจัดเก็บและประมวลผลในพื้นที่ดังกล่าว เมื่อบรรลุวัตถุประสงค์ของการเก็บรักษาแล้ว ข้อมูลจะถูกลบโดยไม่ชักช้า ส่วนข้อมูลที่มีหน้าที่ต้องเก็บรักษาตามกฎเกณฑ์ที่ใช้บังคับจะถูกเก็บไว้ตลอดระยะเวลาดังกล่าว คำขอที่เกี่ยวกับข้อมูลส่วนบุคคลสามารถส่งได้ที่ wei@hoveringlaw.com.tw',
            ],
          },
        ],
      },
      disclaimer: {
        eyebrow: 'ข้อจำกัดความรับผิด',
        title: 'ขอบเขตและข้อจำกัดของข้อมูลในหน้านี้',
        description:
          'ลักษณะของข้อมูลทั่วไป ขอบเขตของกฎหมายที่ใช้บังคับ และเงื่อนไขการเกิดความสัมพันธ์ระหว่างทนายความกับลูกความ',
        intro:
          'ส่วนนี้ระบุให้ชัดเจนว่าหน้าข้อมูลแนะนำภาษาไทยเหล่านี้ทำอะไรให้ท่านได้ และทำอะไรให้ไม่ได้',
        sections: [
          {
            heading: 'เป็นข้อมูลทั่วไปเท่านั้น',
            paragraphs: [
              'เนื้อหาในหน้าเหล่านี้เขียนขึ้นเพื่อให้ข้อมูลทั่วไป ไม่ใช่ความเห็นทางกฎหมายสำหรับเรื่องของท่าน และไม่อาจใช้แทนการตรวจสอบเอกสารและข้อเท็จจริงเฉพาะรายได้',
              'ผลของแต่ละเรื่องขึ้นอยู่กับข้อเท็จจริง กฎเกณฑ์ที่ใช้บังคับ และช่วงเวลา ดังนั้นสองสถานการณ์ที่ดูคล้ายกันจึงอาจมีผลต่างกันได้',
            ],
          },
          {
            heading: 'ขอบเขตของกฎหมาย',
            paragraphs: [
              'สำนักงานประกอบวิชาชีพภายใต้กฎหมายไต้หวัน และหน้าเหล่านี้กล่าวถึงงานภายในขอบเขตดังกล่าวเท่านั้น',
              'เนื้อหาในหน้าเหล่านี้ไม่ใช่ความเห็นตามกฎหมายของเขตอำนาจอื่นใดนอกจากไต้หวัน รวมถึงกฎหมายของประเทศที่ท่านพำนักอยู่ หากเรื่องของท่านมีส่วนที่อยู่ภายใต้เขตอำนาจอื่น เราจะยืนยันร่วมกับท่านว่าส่วนนั้นต้องอาศัยผู้เชี่ยวชาญที่มีคุณสมบัติเหมาะสมด้านใด',
            ],
          },
          {
            heading: 'ความสัมพันธ์ระหว่างทนายความกับลูกความไม่เกิดขึ้นโดยอัตโนมัติ',
            paragraphs: [
              'การอ่านหน้านี้ การส่งแบบฟอร์ม หรือการส่งอีเมล เพียงอย่างเดียวไม่ได้ทำให้เกิดความสัมพันธ์ระหว่างทนายความกับลูกความ',
              'ความสัมพันธ์ดังกล่าวเกิดขึ้นเมื่อได้ตรวจสอบเรื่องแล้ว และทั้งสองฝ่ายยืนยันการรับดำเนินการร่วมกันเท่านั้น',
            ],
          },
          {
            heading: 'ไม่มีการรับประกันผล',
            paragraphs: [
              'ไม่มีข้อความใดในหน้าเหล่านี้ที่เป็นคำมั่นเกี่ยวกับผลของเรื่องใดเรื่องหนึ่ง การอนุมัติคำขอ หรือสถานะการพำนักและสถานะการทำงาน',
              'ลิงก์ไปยังเว็บไซต์ภายนอกจัดไว้เพื่อความสะดวกของท่าน เราไม่รับประกันความถูกต้องหรือความเป็นปัจจุบันของเนื้อหาที่บุคคลภายนอกเผยแพร่',
            ],
          },
        ],
      },
      columns: {
        eyebrow: 'บทความ',
        title: 'บทความเกี่ยวกับกฎหมายไต้หวัน',
        description:
          'บทความภาษาไทยที่อธิบายหัวข้อกฎหมายไต้หวันซึ่งมีผู้สอบถามบ่อย เป็นข้อมูลทั่วไป ณ เวลาที่เผยแพร่ ไม่ใช่ความเห็นทางกฎหมายสำหรับเรื่องของท่าน',
        intro:
          'สำนักงานเผยแพร่บทความอธิบายหัวข้อกฎหมายไต้หวันที่มีผู้สอบถามบ่อย บทความที่มีฉบับภาษาไทยแล้วจะแสดงอยู่ในหน้านี้ นอกจากนี้ยังมีลิงก์ 4 รายการ โดยแต่ละลิงก์จะเปิดสารบัญบทความของภาษาต้นฉบับหนึ่งภาษา',
        sections: [
          {
            heading: 'สารบัญ 4 ภาษา',
            paragraphs: [
              'ส่วนนี้ประกอบด้วยลิงก์ 4 รายการ ได้แก่ สารบัญบทความภาษาเกาหลี สารบัญภาษาจีน สารบัญภาษาอังกฤษ และสารบัญภาษาญี่ปุ่น แต่ละลิงก์ระบุภาษาของสารบัญนั้นไว้ เพื่อให้ท่านทราบล่วงหน้าว่ากำลังจะเปิดเนื้อหาในภาษาใด',
              'สารบัญทั้ง 4 รายการนี้เป็นสารบัญตามภาษาต้นฉบับ ไม่ใช่รายการคำแปล ส่วนบทความที่มีฉบับภาษาไทยแล้วจะแสดงแยกไว้ในหน้านี้',
            ],
          },
          {
            heading: 'ลิงก์จะพาท่านไปที่ใด',
            paragraphs: [
              'เมื่อท่านเลือกลิงก์ใดลิงก์หนึ่งใน 4 รายการ สารบัญบทความของภาษานั้นจะเปิดขึ้น จากสารบัญ ท่านเลือกบทความที่ต้องการอ่านได้เอง โดยเนื้อหาทั้งหมดจะแสดงเป็นภาษาต้นฉบับของบทความ',
              'หน้านี้ไม่ได้สรุปเนื้อหาของบทความ และไม่รับประกันว่าหัวข้อหนึ่ง ๆ จะมีอยู่ครบทั้ง 4 ภาษา สารบัญแต่ละภาษาบรรจุเฉพาะบทความที่เผยแพร่ในภาษานั้น',
            ],
          },
          {
            heading: 'บทความใช้อ้างอิงได้เพียงใด',
            paragraphs: [
              'บทความเขียนขึ้นเพื่อให้ข้อมูลทั่วไป ณ เวลาที่เผยแพร่ กฎเกณฑ์และแนวทางการปรับใช้อาจเปลี่ยนแปลงได้ และบทความหนึ่งย่อมไม่ครอบคลุมข้อเท็จจริงทั้งหมดในเรื่องของท่าน',
              'ด้วยเหตุนี้ โปรดอย่าใช้บทความเป็นเกณฑ์ตัดสินใจดำเนินการในเรื่องจริง ขอให้ใช้บทความเพื่อทำความเข้าใจภาพรวม แล้วจึงปรึกษาเกี่ยวกับเอกสารและข้อเท็จจริงของท่านเป็นการเฉพาะ ทั้งนี้ หน้านี้ไม่ใช่ขั้นตอนการให้คำปรึกษา',
            ],
          },
        ],
      },
    },
  },
  fil: {
    languageName: 'Filipino',
    nav: {
      home: 'Unang pahina',
      services: 'Mga larangan ng serbisyo',
      about: 'Tungkol sa tanggapan',
      lawyers: 'Mga abogado',
      pricing: 'Saklaw at bayarin',
      contact: 'Kontak',
      faq: 'Mga madalas itanong',
      privacy: 'Patakaran sa pribasiya',
      disclaimer: 'Paunawa at limitasyon',
      columns: 'Mga artikulo',
    },
    contactCta: 'Ipadala ang inyong katanungan',
    footerNotice:
      'Ang pahinang ito sa Filipino ay pangkalahatang gabay lamang tungkol sa gawain ng tanggapan sa ilalim ng batas ng Taiwan. Hindi ito legal na payo para sa isang tiyak na usapin, at ang pagpapadala ng mensahe sa pahinang ito ay hindi bumubuo ng ugnayan ng abogado at kliyente.',
    skipLink: 'Laktawan ang menu, dumiretso sa pangunahing nilalaman',
    menuLabel: 'Menu ng mga pahina',
    languageLabel: 'Wika ng pahina',
    notFoundTitle: 'Hindi natagpuan ang pahina',
    notFoundText:
      'Wala ang pahinang hinahanap ninyo, o inilipat na ito sa ibang address. Maaari kayong bumalik sa unang pahina sa Filipino upang makita ang mga gabay na nandito.',
    backHomeLabel: 'Bumalik sa unang pahina',
    readSourceLabel: 'Buksan ang talaan ng mga artikulo sa orihinal na wika',
    home: {
      heroScrollLabel: 'Mag-scroll pababa',
      heroColumnsCtaLabel: 'Tingnan ang mga artikulo',
      servicesDetailLabel: 'Tingnan ang detalye',
      servicesAssistanceBefore:
        'Kung hindi pa tiyak kung saang grupo nabibilang ang inyong usapin, ipinapaliwanag ng pahinang ',
      servicesAssistanceLinkLabel: 'Kontak',
      servicesAssistanceAfter:
        ' kung paano isulat ang buod na susuriin ng abogado.',
      columnsViewAllLabel: 'Tingnan ang lahat ng artikulo',
      columnsReadMoreLabel: 'Basahin pa',
      columnsReviewLabel: 'Sinuri ni Abogado Wei Tseng',
      columnsOriginalLanguageBadge: 'Orihinal na wika (original language)',
      columnsOriginalLanguageNote:
        'Wala pang bersyong Filipino ng mga artikulo sa ibaba. Nananatili sa orihinal na wika ang listahan at bubukas ito sa pahina sa wikang iyon; hindi ito awtomatikong isinasalin.',
      imageBandAlt:
        'Tradisyonal na sanheyuan ng Taiwan (三合院) at makabagong pabelyon sa liwanag ng araw',
      videoPauseLabel: 'I-pause ang video',
      videoPlayLabel: 'I-play ang video',
      videoReplayLabel: 'I-play muli ang video',
    },
    pages: {
      home: {
        eyebrow: 'GABAY',
        title: 'Mga serbisyong legal sa Taiwan — gabay sa Filipino',
        description:
          'Pangkalahatang paliwanag sa Filipino tungkol sa saklaw ng gawain ng Hovering International Law Firm sa Taiwan, ang mga wika ng konsultasyon, at kung paano magsimulang makipag-ugnayan.',
        intro:
          'Tumutulong ang Hovering International Law Firm sa mga dayuhang kliyente, kabilang ang mga nasa Taiwan, para sa mga usaping nasa ilalim ng batas ng Taiwan: pamumuhunan at pagtatatag ng kompanya, sibil na alitan, usaping pag-aasawa at pampamilya, paggawa, kriminal, at intelektuwal na ari-arian. Tutulungan kayo ng bahaging Filipino na ito na malaman kung anong gawain ang saklaw namin, ano ang dapat ihanda, at paano makipag-ugnayan. Pangkalahatang impormasyon ito, hindi legal na payo para sa sarili ninyong usapin.',
        sections: [
          {
            heading: 'Ano ang tinutulungan namin',
            paragraphs: [
              'Ang Hovering International Law Firm ay tanggapan ng mga abogadong nakabase sa Taiwan, gumagawa sa ilalim ng batas ng Taiwan, at may mga tanggapan sa Taipei (臺北), Kaohsiung (高雄), Taichung (臺中), at Pingtung (屏東). Humahawak kami ng gawaing pagpapayo para sa mga kompanya at gayundin ng mga usaping dinadala sa korte, at tumutulong kami sa mga dayuhang kliyente sa mga hakbang na kailangang gawin sa Taiwan.',
              'Pangkalahatan ang lahat ng nilalaman dito. Ang kalalabasan ng isang usapin ay nakadepende sa mga totoong pangyayari, sa mga tuntuning umiiral, at sa panahong naganap ito. Kaya hindi kayang palitan ng gabay na ito ang tuwirang pag-uusap sa abogado tungkol sa mga dokumento ninyo.',
            ],
          },
          {
            heading: 'Magkaibang bagay ang wika ng pahina at ang wika ng konsultasyon',
            paragraphs: [
              'Nakasulat sa Filipino ang pahinang ito, ngunit ang aktwal na konsultasyon sa abogado ay isinasagawa lamang sa apat na wika: Ingles, Tsino, Hapon, at Koreano. Ang pagkakabasa ninyo ng gabay sa Filipino ay hindi nangangahulugang sa Filipino gagawin ang pag-uusap sa abogado.',
              'Hindi kami nangangako ng interpreter (tagapagsalin) para sa pag-uusap, hindi kami nangangako ng sagot sa loob ng takdang panahon, at hindi kinukumpirma ang appointment sa pahinang ito. Kung hindi ninyo magagamit ang apat na wikang nabanggit, ipinapaliwanag ng pahinang “Kontak” kung paano namin kinukumpirma ang paraan ng pakikipag-usap.',
            ],
          },
          {
            heading: 'Mga uri ng usaping hinahawakan ng tanggapan',
            paragraphs: [
              'Anim na pangkat ang saklaw ng gawain ng tanggapan. Mas detalyadong ipinapaliwanag ng pahinang “Mga larangan ng serbisyo” ang bawat pangkat at ang mga bagay na hindi ginagarantiya.',
            ],
            items: [
              'Pamumuhunan at pagtatatag ng kompanya sa Taiwan',
              'Sibil na alitan at paghahabol ng danyos',
              'Usaping pag-aasawa, pampamilya, at pagmamana',
              'Alitan sa paggawa at empleo',
              'Usaping kriminal',
              'Intelektuwal na ari-arian: trademark (marka ng kalakal), patent (patente), at copyright (karapatang-sipi)',
            ],
          },
          {
            heading: 'Saan kayo dapat magsimula',
            paragraphs: [
              'Basahin muna ang pahinang “Mga larangan ng serbisyo” upang makita kung kabilang sa saklaw ng gawain ang usapin ninyo, saka ang pahinang “Saklaw at bayarin” at “Kontak” upang malaman kung paano itinatakda ang saklaw at kinukumpirma ang bayarin bago magsimula ang trabaho.',
              'Kapag nagpadala kayo ng mensahe, maaari ninyong isulat ang buod sa sarili ninyong wika. Iniingatan ang orihinal na teksto gaya ng pagkakasulat ninyo at hindi ito awtomatikong isinasalin. Ang naipadalang mensahe ay isang usaping naghihintay ng pagsusuri: hindi pa ito natapos na konsultasyon, at hindi pa ito kumpirmadong appointment (takdang pagkikita).',
            ],
          },
        ],
      },
      services: {
        eyebrow: 'MGA SERBISYO',
        title: 'Mga usaping hinahawakan ng tanggapan',
        description:
          'Anim na pangkat ng gawaing saklaw ng serbisyo ng tanggapan sa Taiwan, kasama ang mga limitasyong dapat ninyong malaman nang maaga.',
        intro:
          'Narito ang mga pangkat ng gawaing talagang hinahawakan ng tanggapan, kasama ang mga bagay na madalas itanong sa simula. Tinutulungan kayo ng paglalarawang ito na matantiya kung kabilang dito ang usapin ninyo; pangkalahatang impormasyon ito, hindi legal na pagsusuri sa isang tiyak na dokumento.',
        sections: [
          {
            heading: 'Pamumuhunan at pagtatatag ng kompanya sa Taiwan',
            paragraphs: [
              'Tumutulong ang tanggapan sa mga dayuhang mamumuhunan at kompanyang nagtatatag o nagpapatakbo ng negosyo sa Taiwan: pagpili ng anyo ng entidad, paghahanda at paghahain ng mga dokumento, pagpapadala ng puhunan, mga hakbang sa bangko, pagsusuri sa lugar ng negosyo, at ang mga kahingiang natatangi sa bawat uri ng industriya. Tumutulong din kami sa mga usaping pang-akawnting at pagbubuwis na nagmumula sa pagtatatag at pagpapatakbo ng kompanya sa Taiwan.',
              'Nagkakaiba-iba ang pagkakasunod-sunod at haba ng proseso ayon sa napiling anyo ng entidad, sa mamumuhunan, sa uri ng negosyo, sa mga bangkong kasangkot, at sa mga dokumentong nasa kamay. Hindi awtomatikong nagbibigay ng karapatang manirahan (居留) o work permit (permit sa trabaho, 工作許可) ang pagtatatag ng kompanya: magkahiwalay na proseso ang mga ito at sinusuri nang isa-isa.',
            ],
          },
          {
            heading: 'Sibil na alitan at paghahabol ng danyos',
            paragraphs: [
              'Kabilang dito ang mga alitan sa kontrata, paghahabol ng danyos dahil sa tort o pagkakasala sa labas ng kontrata, at mga alitan ng mamimili. Karaniwang nagsisimula ang trabaho sa muling pagsasaayos ng pagkakasunod-sunod ng mga pangyayari at sa pagtingin sa mga dokumento at ebidensiyang nasa kamay, saka lamang pag-uusapan ang paraan ng pagharap dito.',
              'Malaki ang epekto ng mga takdang panahon, kasama ang panahong itinakda ng batas para maghain ng kaso, at ng kabuuan ng ebidensiya sa isang sibil na usapin, kaya banggitin agad ang mga petsang alam ninyo. Kung nasa inyo pa ang kontrata, ang mga palitan ng mensahe, ang patunay ng bayad, o mga larawan ng pangyayari, sabihin ninyo ito mula sa unang mensahe.',
            ],
          },
          {
            heading: 'Usaping pag-aasawa, pampamilya, at pagmamana',
            paragraphs: [
              'Hinahawakan ng tanggapan ang mga usapin ng diborsiyo sa ilalim ng batas ng Taiwan (離婚), paghahati ng ari-arian, paggamit at pagtupad ng karapatan at tungkulin sa menor de edad na anak (未成年子女權利義務之行使或負擔), pagdalaw sa anak (會面交往), at pagmamana (繼承), pati na kapag nasa magkaibang bansa ang mga panig o ang ari-arian. Ang mga usaping pampamilyang may kaugnayan sa ibang bansa ay karaniwang nangangailangan ng dagdag na pagsusuri sa mga dokumento ng katayuang sibil (戶籍), sa anyo ng mga papeles, at sa paraan ng pagpapatunay ng mga ito sa Taiwan.',
              'Dahil madalas may takdang panahon ang mga usaping pampamilya at sabay-sabay ang ilang hakbang, mabuting banggitin sa unang buod ang ugnayan ng mga panig, ang kasalukuyang tirahan, at ang mga hakbang na natapos o kasalukuyang isinasagawa.',
            ],
          },
          {
            heading: 'Alitan sa paggawa at empleo',
            paragraphs: [
              'Kabilang dito ang pagtatapos ng empleo, ang separation pay sa ilalim ng batas ng Taiwan (資遣費, na huwag ituring na katumbas ng katulad na sistema sa ibang bansa), sahod, at mga alitang nagmumula sa mga probisyon ng kontrata sa trabaho (勞動契約), para man sa panig ng manggagawa o ng employer. Sa pagsusuri, hiwalay naming tinitingnan ang batayan ng pagtatapos ng empleo at ang mga usapin ng abiso, ng dapat bayaran, at ng takdang panahon.',
              'Karaniwang ang kontrata sa trabaho, ang patakaran sa trabaho (工作規則), ang talaan ng sahod, at ang mga palitan ng mensahe ng dalawang panig ang nagpapasya sa usapin. Kung nasa inyo pa ang mga ito, banggitin ninyo sa buod upang mas maging tumpak ang paunang pagsusuri.',
            ],
          },
          {
            heading: 'Usaping kriminal',
            paragraphs: [
              'Tumutulong ang tanggapan sa yugto ng imbestigasyon at sa yugto ng paglilitis, para sa panig ng pinararatangan o nasasakdal at para rin sa panig ng biktima, pati sa pagtaya ng panganib na kriminal na maaaring lumitaw sa pagnenegosyo.',
              'Karaniwang maikli ang mga takdang panahon sa usaping kriminal at nakatakda ang mga yugto nito, kaya kung may natanggap na kayong papeles mula sa awtoridad, banggitin ninyo agad ang petsang nakasulat doon upang masuri ang usapin ayon sa pagkaapurahan nito.',
            ],
          },
          {
            heading: 'Intelektuwal na ari-arian',
            paragraphs: [
              'Tumutulong ang tanggapan sa pagpaparehistro ng trademark (marka ng kalakal, 商標) at patent (patente, 專利), sa mga usapin ng copyright (karapatang-sipi), at sa mga alitang may kaugnayan sa mga karapatang ito sa Taiwan.',
              'Sa pangkat na ito, mahalaga ang pagkakasunod-sunod ng mga hakbang: ang saklaw ng proteksiyon, ang panahon ng paghahain, at ang aktwal na paggamit ay pawang nakaaapekto sa pipiliing paraan. Ang paghahain ng aplikasyon ay hindi katiyakan na maaaprubahan ito.',
            ],
          },
          {
            heading: 'Saklaw at kung paano ito kinukumpirma',
            paragraphs: [
              'Gumagawa ang tanggapan sa ilalim ng batas ng Taiwan at tumatanggap ng mga usaping kabilang sa mga pangkat sa itaas. Hiwalay na kinukumpirma ang saklaw ng bawat usapin matapos suriin ng abogado ang ipinadala ninyo.',
              'Ang katayuan sa paninirahan, ang permiso sa trabaho, at ang mga katulad nito ay sinusuri batay sa mga dokumento at pangyayaring natatangi sa bawat tao, hindi hinuhugot sa pagkamamamayan. Kung may bahagi ng usapin ninyo na may kinalaman dito, banggitin ninyo kapag nakipag-ugnayan kayo upang matukoy ng abogado kung saang pangkat ng gawain kabilang ang usapin ninyo; walang ipinapangakong resulta at walang ipinapangakong panahon ng pagsagot ang pahinang ito.',
            ],
          },
        ],
      },
      about: {
        eyebrow: 'TUNGKOL SA TANGGAPAN',
        title: 'Tungkol sa Hovering International Law Firm',
        description:
          'Batayang impormasyon tungkol sa tanggapan ng mga abogado sa Taiwan, sa mga tanggapan nito, at sa gawaing may kaugnayan sa ibang bansa.',
        intro:
          'Ang Hovering International Law Firm ay tanggapan ng mga abogado sa Taiwan na may mga abogadong gumagawa sa iba-ibang larangan, mula sa pagpapayo sa mga kompanya hanggang sa paglilitis sa korte. Ipinapaliwanag ng bahaging ito kung paano nabuo ang tanggapan, ang mga tanggapan nito, at ang gawaing may kaugnayan sa ibang bansa.',
        sections: [
          {
            heading: 'Pagkakatatag at kaayusan',
            paragraphs: [
              'Itinatag ang Hovering International Law Firm (昊鼎國際法律事務所) noong 2016 ng mga abogadong nagmula sa National Taiwan University (國立臺灣大學). Pinagsasama ng pangalang Tsino nito ang dalawang karakter na 昊 (“malawak na kalangitan”) at 鼎 (“matatag na pundasyon”), na sumasalamin sa direksiyon ng tanggapan mula sa simula.',
              'May mga tanggapan ito sa Taipei (臺北), Kaohsiung (高雄), Taichung (臺中), at Pingtung (屏東). Nakatuon ang tanggapan sa Kaohsiung sa corporate governance (pamamahalang pangkorporasyon) at humahawak din ng karaniwang sibil, kriminal, at administratibong alitan; hinahawakan ng tanggapan sa Taichung ang mga usapin ng konstruksiyon, intelektuwal na ari-arian, at gawaing may kaugnayan sa Korea at Japan; binuksan naman noong 2017 ang tanggapan sa Pingtung para sa pangangailangan ng lugar na iyon.',
              'Bukod sa gawaing legal, itinatag noong 2020 ang Hovering Accounting Office, na nagbibigay ng serbisyong pang-akawnting at pagpaplano sa buwis para sa mga may-ari ng negosyo at sa mga indibidwal na may malaking ari-arian.',
            ],
          },
          {
            heading: 'Gawaing may kaugnayan sa ibang bansa',
            paragraphs: [
              'Kabilang sa gawain naming may kaugnayan sa ibang bansa ang pagtatatag ng kompanya, aplikasyon sa visa, pagpaparehistro ng marka ng kalakal at patente, pagtaya ng panganib na legal, at konsultasyon sa buwis ng kompanya. Natatanging hinahawakan ng tanggapan sa Taichung ang mga usapin ng konstruksiyon, intelektuwal na ari-arian, at ang mga may kaugnayan sa Korea at Japan. Si Abogado Wei Tseng (曾雋崴) naman ang tumutulong sa mga kliyenteng Koreano, Hapon, at sa iba pang internasyonal na kliyente sa mga pangkat ng gawaing nabanggit.',
              'Nakadepende sa nilalaman ng usapin at sa wikang gagamitin kung matatanggap namin ito. Kung kabilang ang usapin ninyo sa mga pangkat ng gawain sa itaas at maipapaliwanag ito sa isa sa apat na wika ng konsultasyon, maaari ninyong ipadala ang buod nito upang suriin ng abogado.',
            ],
          },
          {
            heading: 'Kapag nakipag-ugnayan kayo sa amin',
            paragraphs: [
              'Matapos matanggap ang buod ninyo, sinusuri ito ng abogado at saka pag-uusapan ang saklaw ng trabahong maaaring gawin, ang mga dokumentong kailangan pa, at ang susunod na hakbang. Sa mga usaping may kaakibat na tanong sa akawnting o buwis, maaaring makipagtulungan ang tanggapan sa bahaging pang-akawnting sa loob ng iisang daloy ng pagtatrabaho.',
              'Nakadepende sa mga pangyayari at sa mga dokumento ang kalalabasan ng bawat usapin, kaya wala kaming ipinapangakong resulta. Kung kailangan ninyo ng tiyak na sagot para sa sitwasyon ninyo, ang tanging paraan ay ang tuwirang pag-uusap sa abogado batay sa mga dokumentong iyon, sa isa sa apat na wika ng konsultasyon.',
            ],
          },
        ],
      },
      lawyers: {
        eyebrow: 'MGA ABOGADO',
        title: 'Pandaigdigang koponan ng Hovering',
        description:
          'Mga profile ng mga abogado, tagapamahala ng operasyon, at kasosyong akawntant ng Hovering.',
        // WO-O33: `/en/lawyers` is header -> roster -> key facts. The three
        // prose cards this page used to carry were a duplicate of the key-facts
        // rows, a third copy of the consultation-language notice, and a
        // jurisdiction disclaimer that belongs on the disclaimer page, so the
        // card grid is gone. With no cards there is no lede above them either.
        intro: '',
        sections: [],
      },
      pricing: {
        eyebrow: 'SAKLAW AT BAYARIN',
        title: 'Paano itinatakda ang saklaw ng trabaho at ang bayarin',
        description:
          'Paliwanag sa pagkakasunod-sunod ng pagtatakda ng saklaw, ng pagkumpirma ng bayarin, at ng dahilan kung bakit walang listahan ng presyo ang pahinang ito.',
        intro:
          'Ipinapaliwanag ng pahinang ito kung paano itinatakda ang bayarin, hindi kung magkano ito. Nakadepende ang halaga sa saklaw ng trabaho sa bawat usapin, at may kabuluhan lamang ito kapag malinaw na ang saklaw na iyon.',
        sections: [
          {
            heading: 'Ang unang hakbang ay ang pagtatakda ng saklaw',
            paragraphs: [
              'Malaki ang maaaring pagkakaiba ng dami ng trabaho sa dalawang usaping magkatulad ang uri, depende sa bilang ng mga panig, sa mga dokumentong nasa kamay, sa mga takdang panahong dapat sundin, at sa nasimulan na o hindi pa ang isang hakbang. Kaya ang unang gawain ay ang paglilinaw kung ano ang kasama at kung ano ang hindi kasama sa trabaho.',
              'Ang buod na ipinadala ninyo sa simula ang batayan ng pagtatakdang ito. Habang mas malinaw ang buod tungkol sa nangyari, sa hinihiling ninyo, at sa mga takdang panahon, mas tumpak ang maitatakdang saklaw.',
            ],
          },
          {
            heading: 'Kinukumpirma ang bayarin bago magsimula ang trabaho',
            paragraphs: [
              'Kapag malinaw na ang saklaw, ang halaga at ang paraan ng pagkuwenta ng bayarin ay pinag-uusapan at kinukumpirma kasama kayo bago magsimula ang trabaho. Kung magbago ang saklaw habang isinasagawa ito, kailangan ding kumpirmahing muli ang pagbabagong iyon.',
              'Hindi ito panukala ng presyo at wala itong nililikhang obligasyon sa pagbabayad. Wala ring bayad ang pagpapadala ng mensahe sa pahinang ito.',
            ],
          },
          {
            heading: 'Maaaring bayad ang konsultasyon',
            paragraphs: [
              'Maaaring bayad na serbisyo ang konsultasyon sa abogado. Hindi sinasabi ng pahinang ito na libre ang unang konsultasyon, at walang bahagi rito ang dapat unawain sa ganoong kahulugan.',
              'Kung may bayad ang konsultasyon, ipinaaalam ang halaga at ang paraan ng pagbabayad bago ito maganap.',
            ],
          },
          {
            heading: 'Bakit walang listahan ng presyo dito',
            paragraphs: [
              'Nakadepende sa mismong usapin ang halaga: kung gaano karaming trabaho ang kailangan, ilan ang mga panig, anong mga dokumento ang nasa kamay, anong mga takdang panahon ang dapat sundin, at nasimulan na ba ang isang hakbang o hindi pa. Hindi masasabi ng isang nakapaskil na halaga kung magkano ang para sa usapin ninyo; kaya sa halip na maglathala ng listahan ng presyo, itinatakda muna namin ang saklaw ng trabaho para sa usapin ninyo at saka ipinaaalam ang katumbas nitong bayarin upang mapag-isipan ninyo bago magsimula ang trabaho.',
              'Bukod sa bayad sa abogado, maaaring may mga singil ang isang usapin na babayaran sa korte, sa ahensiya ng pamahalaan, o sa ibang partido. Hiwalay ang mga ito sa bayad sa abogado at nakadepende sa hakbang na isasagawa.',
            ],
          },
        ],
      },
      contact: {
        eyebrow: 'KONTAK',
        title: 'Paano makipag-ugnayan sa tanggapan',
        description:
          'Ang wika ng pahina, ang mga wika ng konsultasyon, ang gagawin kung hindi ninyo magagamit ang apat na wikang iyon, at ang mga bagay na hindi ginagarantiya.',
        intro:
          'Bago kayo makipag-ugnayan, pansinin ang tatlong magkahiwalay na bagay sa ibaba. Madalas itong pinaghahalo, gayong magkaiba ang kahulugan ng bawat isa.',
        sections: [
          {
            heading: 'Tatlong bagay na dapat paghiwalayin',
            paragraphs: [
              'Magkahiwalay na bagay ang wika ng pahina, ang wika ng konsultasyon sa abogado, at ang wikang ginagamit ninyo sa pagsulat ng mensahe.',
            ],
            items: [
              'Wika ng pahina: nakasulat sa Filipino ang gabay na ito.',
              'Wika ng konsultasyon: isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
              'Wika ng pagsulat ninyo: maaari ninyong isulat ang buod sa sarili ninyong wika, at iniingatan ang orihinal na teksto gaya ng pagkakasulat ninyo.',
            ],
          },
          {
            heading: 'Kung hindi ninyo magagamit ang apat na wika ng konsultasyon',
            paragraphs: [
              'Sa form ng kontak, maaari ninyong piliin ang “Kailangang kumpirmahin ang paraan ng pakikipag-ugnayan”. Sasagot kami upang magkasamang kumpirmahin kung paano tayo makakapag-usap kung may posibleng paraan, ngunit hindi garantisado ang serbisyo sa ibang wika at walang pangako sa panahon ng pagsagot.',
              'Hakbang lamang ito ng pagkumpirma, hindi pangako. Hindi kami nangangako ng interpreter para sa pasalitang pag-uusap, hindi kami nangangako ng serbisyo sa Filipino o sa alinmang wikang wala sa apat na nabanggit, at hindi kami nangangakong matatanggap ang bawat usapin.',
            ],
          },
          {
            heading: 'Ano ang dapat isulat sa unang mensahe',
            paragraphs: [
              'Isulat kung ano ang nangyari, anong tulong ang kailangan ninyo, ano ang kaugnayan ng usapin sa Taiwan, at kung may takdang petsa na alam ninyo. Kung may natanggap na kayong papeles mula sa korte o sa ahensiya ng pamahalaan, banggitin ang petsang nakasulat doon.',
              'Sa unang yugto ay hindi pa ninyo kailangang ipadala ang numero ng pasaporte, numero ng ID, detalye ng bank account, talaang medikal, o buong hanay ng ebidensiya. Hintayin ang tagubilin ng abogado, at saka ipadala ang mga sensitibong dokumento sa ligtas na paraan.',
            ],
          },
          {
            heading: 'Ang mga hindi ginagarantiya ng pahinang ito',
            paragraphs: [
              'Hindi kami nangangako ng panahon ng pagsagot, hindi namin kinukumpirma ang appointment sa pahinang ito, hindi namin ipinapangako kung sinong abogado ang hahawak ng usapin, at hindi kami nagbibigay ng interpreter (tagapagsalin) para sa pasalitang pag-uusap. Hiwalay dito ang usapin ng nakasulat na salin: hindi awtomatikong isinasalin ang mensaheng ipinadala ninyo.',
              'Kapag nagpadala kayo ng mensahe, naitatala ang nilalaman nito at naghihintay ng pagsusuri. Kung lumipas na ang ilang panahon at wala kayong natatanggap na sagot, maaari ninyo itong ipadalang muli sa email address na nasa pahina ng kontak.',
            ],
          },
        ],
      },
      faq: {
        eyebrow: 'MGA MADALAS ITANONG',
        title: 'Mga madalas itanong',
        description:
          'Paliwanag tungkol sa saklaw ng gawain, sa paghahanda, sa wika, sa bayarin, at sa kahulugan ng pagpapadala ng mensahe.',
        intro:
          'Sinasagot ang mga tanong sa ibaba sa antas ng pangkalahatang impormasyon. Ang sagot para sa sarili ninyong usapin ay maibibigay lamang matapos suriin ng abogado ang mga dokumento at pangyayari.',
        sections: [
          {
            heading: 'Paano gamitin ang bahaging ito',
            paragraphs: [
              'Kung wala kayong makitang sagot para sa sitwasyon ninyo, kadalasan ay tanda iyon na nakadepende ang sagot sa mga natatanging pangyayari. Sa ganoong pagkakataon, isulat ninyo na lamang ang mga pangyayaring iyon sa buod kapag nakipag-ugnayan kayo, sa halip na maghinuha mula sa nilalaman dito.',
            ],
          },
        ],
        faqs: [
          {
            question: 'Anong mga usapin ang tinatanggap ng tanggapan?',
            answer:
              'Tumatanggap ang tanggapan ng anim na pangkat ng usapin: pamumuhunan at pagtatatag ng kompanya sa Taiwan, sibil na alitan at danyos, usaping pag-aasawa, pampamilya, at pagmamana, alitan sa paggawa, usaping kriminal, at intelektuwal na ari-arian. Ang pagtanggap sa isang tiyak na usapin ay napagpapasyahan pagkatapos suriin ang nilalaman nito.',
          },
          {
            question: 'Ano ang dapat kong ihanda bago makipag-ugnayan?',
            answer:
              'Maghanda ng maikling buod tungkol sa pagkakasunod-sunod ng mga pangyayari, sa hinihiling ninyo, sa kaugnayan ng usapin sa Taiwan, at sa takdang panahon kung mayroon. Kung may papeles na kayo mula sa korte o sa ahensiya ng pamahalaan, banggitin ang petsa nito. Sa yugtong ito ay hindi pa ninyo kailangang ipadala ang mga dokumento ng pagkakakilanlan o ang buong ebidensiya.',
          },
          {
            question: 'Maaari ba ang konsultasyon sa Filipino?',
            answer:
              'Hindi. Nakasulat sa Filipino ang gabay na ito, ngunit ang konsultasyon sa abogado ay isinasagawa lamang sa Ingles, Tsino, Hapon, at Koreano. Hindi rin kami nangangako ng interpreter para sa pasalitang pag-uusap. Hiwalay dito ang nakasulat na salin: iniingatan ang orihinal na teksto gaya ng pagkakasulat ninyo, at hindi ito awtomatikong isinasalin.',
          },
          {
            question: 'Paano kung hindi ko magamit ang apat na wikang iyon?',
            answer:
              'Piliin ang “Kailangang kumpirmahin ang paraan ng pakikipag-ugnayan” kapag nagpadala kayo ng mensahe. Sasagot kami upang magkasamang kumpirmahin kung paano tayo maaaring mag-usap. Hakbang ito ng pagkumpirma, hindi pangako na kaya naming maglingkod sa ibang wika.',
          },
          {
            question: 'Paano hahawakan ang tekstong Filipino na isinulat ko?',
            answer:
              'Iniingatan ang orihinal na teksto gaya ng pagkakasulat ninyo at hindi ito awtomatikong isinasalin. Kung kakailanganin, kukumpirmahin naming kasama kayo kung anong wika ang gagamitin sa susunod na palitan.',
          },
          {
            question: 'Kapag naipadala ko na ang mensahe, konsultado na ba ako?',
            answer:
              'Hindi pa. Ang naipadalang mensahe ay usaping naghihintay ng pagsusuri ng abogado. Hindi ito legal na payo, hindi ito kumpirmadong appointment, at ang pagpapadala mismo ay hindi bumubuo ng ugnayan ng abogado at kliyente.',
          },
          {
            question: 'Paano kinukuwenta ang bayarin?',
            answer:
              'Itinatakda muna ang saklaw ng trabaho, saka kinukumpirma kasama kayo ang halaga at ang paraan ng pagkuwenta bago magsimula ang trabaho. Walang halagang nakalathala sa pahinang ito, at hindi rin sinasabi rito na libre ang unang konsultasyon.',
          },
          {
            question: 'Paano kung napakadalian ng usapin ko?',
            answer:
              'Ilagay agad sa simula ng buod ang takdang petsa o ang petsang nakasulat sa opisyal na papeles, upang makita ng abogado ang mga petsang iyon sa pagsusuri. Walang hotline ang pahinang ito at walang garantiya sa panahon ng pagsagot; kung hindi na kayang hintayin ang usapin, mabuting maghanap din kayo ng ibang paraan sa lugar ninyo.',
          },
        ],
      },
      privacy: {
        eyebrow: 'PRIBASIYA',
        title: 'Impormasyong kinokolekta sa form ng kontak',
        description:
          'Ano ang kinokolekta ng form ng kontak sa bahaging Filipino, paano hinahawakan ang orihinal na teksto, at paano kayo makikipag-ugnayan tungkol sa impormasyon ninyo.',
        intro:
          'Ang bahaging ito ay tungkol lamang sa form ng kontak sa mga pahina ng gabay na ito. Naglalarawan ito kung paano hinahawakan ang impormasyon, hindi ito teknikal na garantiya.',
        sections: [
          {
            heading: 'Ang mga impormasyong kinokolekta',
            paragraphs: [
              'Kapag nagpadala kayo ng mensahe sa form ng bahaging ito, naitatala ang mga sumusunod:',
            ],
            items: [
              'Ang pangalang inilagay ninyo',
              'Ang email address na pagpapadalhan ng sagot',
              'Ang wika ng pahina noong nagpadala kayo',
              'Ang wikang ginamit ninyo sa pagsulat',
              'Ang wikang nais ninyo para sa konsultasyon',
              'Ang orihinal na tekstong isinulat ninyo',
              'Ang pagsang-ayon ninyong ipadala ang mensahe',
              'Ang numero ng pagtanggap na panghanap sa mensahe ninyo',
            ],
          },
          {
            heading: 'Iniingatan ang orihinal na teksto',
            paragraphs: [
              'Iniimbak ang isinulat ninyo nang eksakto gaya ng pagkakasulat ninyo, at hindi ito awtomatikong isinasalin. Kung kailangan ng salin upang maasikaso ang usapin, hiwalay itong pag-uusapan kasama kayo.',
              'Dahil iniingatan ang orihinal na teksto, huwag munang isulat ang mga bagay na hindi pa kailangan sa unang yugto, gaya ng numero ng pasaporte, numero ng ID, o detalye ng bank account.',
            ],
          },
          {
            heading: 'Saan iniimbak at sino ang makakakita',
            paragraphs: [
              'Iniimbak ang ipinadala ninyo sa isang lugar na hindi bukas sa publiko, at ang mga awtorisadong tao lamang sa tanggapan ang maaaring maka-access dito upang asikasuhin ang mensahe.',
              'Hindi nagbibigay ang pahinang ito ng ganap na garantiya sa seguridad. Walang daan ng pagpapadala o paraan ng pag-iimbak na ganap na ligtas, kaya ang mga sensitibong dokumento ay dapat ipadala lamang ayon sa tiyak na tagubilin ng abogado.',
            ],
          },
          {
            heading: 'Layunin ng paggamit',
            paragraphs: [
              'Ginagamit ang ipinadala ninyo upang suriin ang mensahe, upang makabalik sa inyo, upang kumpirmahin ang paraan ng pag-uusap, at upang asikasuhin ang usapin kung magsisimula ang trabaho.',
              'Hindi ginagamit ang impormasyong ito para sa marketing kung wala kayong hiwalay na pagsang-ayon para sa layuning iyon.',
            ],
          },
          {
            heading: 'Abiso at numero ng pagtanggap',
            paragraphs: [
              'Kapag matagumpay na naipadala ang mensahe, may abisong ipinapadala sa tanggapan. Kung hindi pa nakukumpirma ang abisong iyon, nananatiling nakatala ang isinulat ninyo at hindi ito nawawala.',
              'Nilikha ang numero ng pagtanggap upang matagpuan ang mensahe ninyo sa aming talaan. Ipinapakita ito matapos maitala ang mensahe, at maaari ninyong banggitin ang numerong ito kapag muli kayong nakipag-ugnayan upang matiyak naming tama ang mensaheng aming hahanapin.',
            ],
          },
          {
            heading: 'Ang mga karapatan ninyo at ang paraan ng pakikipag-ugnayan',
            paragraphs: [
              'Maaari kayong humiling na makita, maitama, o mabura ang impormasyon ninyo, o bawiin ang pagsang-ayon ninyo, sa pamamagitan ng email address na nasa pahina ng kontak. Kung may tungkuling mag-ingat ng talaan alinsunod sa mga umiiral na tuntunin, o dahil sa isang usaping kasalukuyang isinasagawa, ipapaliwanag namin ang dahilan ng limitasyon.',
              'Hindi nagsasaad ang pahinang ito ng nakatakdang haba ng pag-iingat, dahil nakadepende ang aktwal na haba kung magpapatuloy ba ang usapin at kung anong tungkuling mag-ingat ang kaugnay nito. Kung nais ninyong mabura nang mas maaga ang impormasyon ninyo, banggitin ninyo ang kahilingang iyon kapag nakipag-ugnayan kayo.',
            ],
          },
          {
            heading: 'Saan nakaimbak ang impormasyon at ang mga tagapaglaan ng serbisyo',
            paragraphs: [
              'Naka-host sa Vercel ang website na ito, at iniimbak ang ipinadala ninyo sa pribadong object storage ng serbisyong iyon — hindi ito bukas sa publiko. Ipinapadala naman ang email sa pamamagitan ng serbisyo ng email na ginagamit ng tanggapan.',
              'Maaaring nasa labas ng Taiwan ang mga server ng ilang tagapaglaan ng serbisyo, kaya maaaring maimbak at maproseso roon ang impormasyon ninyo. Kapag natupad na ang layunin ng pag-iingat, binubura ang impormasyon nang walang pagkaantala; iniingatan naman sa buong takdang panahon ang impormasyong may tungkuling itago alinsunod sa mga umiiral na tuntunin. Tinatanggap sa wei@hoveringlaw.com.tw ang mga kahilingang may kinalaman sa personal na impormasyon.',
            ],
          },
        ],
      },
      disclaimer: {
        eyebrow: 'PAUNAWA',
        title: 'Saklaw at limitasyon ng impormasyon sa pahinang ito',
        description:
          'Ang katangian ng pangkalahatang impormasyon, ang saklaw ng batas na iniiral, at ang kondisyon ng pagbuo ng ugnayan ng abogado at kliyente.',
        intro:
          'Nililinaw ng bahaging ito kung ano ang kaya at hindi kayang gawin para sa inyo ng mga pahina ng gabay na ito sa Filipino.',
        sections: [
          {
            heading: 'Pangkalahatang impormasyon lamang',
            paragraphs: [
              'Isinulat ang nilalaman ng mga pahinang ito bilang pangkalahatang impormasyon. Hindi ito legal na payo para sa usapin ninyo, at hindi nito kayang palitan ang pagsusuri sa sarili ninyong mga dokumento at pangyayari.',
              'Nakadepende ang kalalabasan ng isang usapin sa mga totoong pangyayari, sa mga tuntuning umiiral, at sa panahon, kaya ang dalawang sitwasyong magkamukha ay maaari pa ring magkaiba ng bunga.',
            ],
          },
          {
            heading: 'Saklaw ng batas',
            paragraphs: [
              'Nagpapraktis ang tanggapan sa ilalim ng batas ng Taiwan, at tungkol lamang sa gawaing nasa saklaw na iyon ang mga pahinang ito.',
              'Hindi payo ang nilalaman ng mga pahinang ito sa ilalim ng batas ng alinmang hurisdiksiyon maliban sa Taiwan, kabilang ang batas ng lugar na tinitirhan ninyo. Kung may bahagi ng usapin ninyo na nasa ilalim ng ibang hurisdiksiyon, kukumpirmahin naming kasama kayo kung anong propesyonal na may tamang kwalipikasyon ang kailangan para roon.',
            ],
          },
          {
            heading: 'Hindi kusang nabubuo ang ugnayan ng abogado at kliyente',
            paragraphs: [
              'Ang pagbabasa ng pahinang ito, ang pagpapadala ng form, o ang pagpapadala ng email ay hindi bumubuo ng ugnayan ng abogado at kliyente.',
              'Nabubuo lamang ang ugnayang iyon matapos masuri ang usapin at matapos kumpirmahin ng dalawang panig ang pagtanggap sa trabaho.',
            ],
          },
          {
            heading: 'Walang garantiya ng resulta',
            paragraphs: [
              'Walang bahagi ng mga pahinang ito ang pangako tungkol sa kalalabasan ng isang usapin, sa pag-apruba ng isang aplikasyon, o sa katayuan sa paninirahan at sa trabaho.',
              'Ibinibigay ang mga panlabas na link para sa kaginhawahan ninyo; hindi namin ginagarantiyahan ang katumpakan o pagiging napapanahon ng nilalamang inilathala ng ibang partido.',
            ],
          },
        ],
      },
      columns: {
        eyebrow: 'MGA ARTIKULO',
        title: 'Mga artikulo tungkol sa batas ng Taiwan',
        description:
          'Mga artikulo sa Filipino na nagpapaliwanag ng mga paksa sa batas ng Taiwan na madalas itanong. Pangkalahatang impormasyon ito noong panahong inilathala, hindi legal na payo para sa usapin ninyo.',
        intro:
          'Naglalathala ang tanggapan ng mga artikulong nagpapaliwanag ng mga paksa sa batas ng Taiwan na madalas itanong. Nakalista sa pahinang ito ang mga artikulong mayroon nang bersyon sa Filipino; bukod doon ay may apat na link, at bubuksan ng bawat isa ang talaan ng mga artikulo para sa isang orihinal na wika.',
        sections: [
          {
            heading: 'Apat na talaan ayon sa wika',
            paragraphs: [
              'Apat na link ang nasa bahaging ito: ang talaan ng mga artikulong Koreano, ang talaang Tsino, ang talaang Ingles, at ang talaang Hapon. Nakasaad sa bawat link ang wika ng talaang iyon, upang alam ninyo na kaagad kung anong wika ang bubuksan ninyo.',
              'Talaan ayon sa orihinal na wika ang apat na ito, hindi listahan ng mga salin. Hiwalay na nakalista sa pahinang ito ang mga artikulong mayroon nang bersyon sa Filipino.',
            ],
          },
          {
            heading: 'Saan kayo dadalhin ng link',
            paragraphs: [
              'Kapag pumili kayo ng isa sa apat na link, bubuksan nito ang talaan ng mga artikulo para sa wikang iyon. Mula sa talaan, kayo na mismo ang pipili ng artikulong babasahin, at nasa orihinal na wika ng artikulo ang buong nilalaman nito.',
              'Hindi binubuod ng pahinang ito ang nilalaman ng mga artikulo, at hindi rin nito ginagarantiyang nasa apat na wika ang isang partikular na paksa. Ang nasa bawat talaan ay ang mga artikulong nalathala sa wikang iyon.',
            ],
          },
          {
            heading: 'Hanggang saan magagamit ang artikulo bilang sanggunian',
            paragraphs: [
              'Isinulat ang mga artikulo bilang pangkalahatang impormasyon noong panahong inilathala ang mga ito. Maaaring magbago ang mga tuntunin at ang paraan ng paglalapat ng mga ito, at hindi saklaw ng isang artikulo ang lahat ng pangyayari sa usapin ninyo.',
              'Kaya huwag gawing batayan ang isang artikulo sa pagpapasyang kumilos sa totoong usapin. Gamitin ang artikulo upang maunawaan ang pangkalahatang larawan, at pag-usapan nang hiwalay ang sarili ninyong mga dokumento kasama ang abogado; hindi hakbang ng konsultasyon ang pahinang ito.',
            ],
          },
        ],
      },
    },
  },
};
