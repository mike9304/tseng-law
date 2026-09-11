/**
 * Guidance pages outside the ten core keys.
 *
 * `international-guidance-content.ts` is owned by the translation lane, so any
 * page key added after the original ten lives here instead. Only its types are
 * imported from that module; its data is read for the core page titles the
 * related-links block needs, and never modified. A reader reaches these pages
 * from the sitemap, the locale llms.txt catalog and the related-links block on
 * `home` / `services` / `pricing` / `contact` — they are deliberately absent
 * from the header nav and footer columns, whose labels live in the
 * translation-lane file.
 *
 * Language contract (identical to the core pages): the page is written in the
 * guidance language, but a consultation with an attorney is held only in
 * English, Chinese, Japanese and Korean. Each page closes with the locale's own
 * published refusal answer, copied verbatim from the FAQ page, so nothing here
 * can be read as an offer of a consultation, interpreting, or support in
 * Vietnamese, Indonesian, Thai or Filipino.
 *
 * Source of every proposition below (hard rule 3 / YMYL): the English intent
 * pages already published at `/en/taiwan-company-setup-lawyer` and
 * `/en/taiwan-litigation-lawyer` (`intent-pages.ts`), plus this locale's own
 * `services` sections in the translation-lane module. Nothing here adds a legal
 * statement, a figure, a fee, a processing time, a promise of interpreting, a
 * reply time, an appointment, or a case result, so no sentence carries an
 * attorney-review marker. Fees are never quoted: the pages point at
 * `/{locale}/pricing` instead.
 */

import {
  guidanceContent,
  type GuidanceLocale,
  type GuidancePage,
} from '@/data/international-guidance-content';
import {
  isGuidanceExtraPageKey,
  type GuidanceCorePageKey,
  type GuidanceExtraPageKey,
  type GuidancePageKey,
} from '@/lib/public-guidance';

/**
 * The English landing each guidance page names in its own body copy. These are
 * the pages whose published facts the four translations restate, and the only
 * place a reader can hold the consultation itself.
 */
export const GUIDANCE_EXTRA_ENGLISH_LANDING_PATHS: Record<GuidanceExtraPageKey, string> = {
  'company-setup': '/en/taiwan-company-setup-lawyer',
  'debt-collection': '/en/taiwan-litigation-lawyer',
};

export const guidanceExtraContent: Record<
  GuidanceLocale,
  Record<GuidanceExtraPageKey, GuidancePage>
> = {
  vi: {
    'company-setup': {
      eyebrow: 'HƯỚNG DẪN',
      title: 'Thành lập công ty tại Đài Loan — hướng dẫn cho doanh nghiệp nước ngoài',
      description:
        'Hướng dẫn cho doanh nghiệp nước ngoài về chọn hình thức pháp nhân, thẩm định đầu tư, chuyển vốn, đăng ký và các bước sau khi đăng ký tại Đài Loan.',
      intro:
        'Việc chọn hình thức pháp nhân, thẩm định đầu tư, chuyển vốn, đăng ký và các hợp đồng vận hành nên được xem xét như một quy trình thống nhất theo pháp luật Đài Loan. Trang này trình bày các lựa chọn công ty con, chi nhánh và văn phòng đại diện từ góc nhìn của công ty mẹ và nhà đầu tư nước ngoài khi vào Đài Loan, không giới hạn ở một quốc gia cụ thể. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sections: [
        {
          heading: 'Chọn hình thức pháp nhân: công ty con, chi nhánh hay văn phòng đại diện',
          paragraphs: [
            'Lựa chọn giữa công ty con, chi nhánh và văn phòng đại diện phụ thuộc vào cơ cấu trách nhiệm, các vấn đề về thuế và kế hoạch mở rộng. Công ty con thường được dùng cho hoạt động độc lập tại Đài Loan, còn chi nhánh có thể phù hợp khi công ty mẹ trực tiếp điều hành.',
            'Văn phòng hỗ trợ nhà đầu tư và doanh nghiệp nước ngoài khi thành lập hoặc vận hành pháp nhân tại Đài Loan: lựa chọn hình thức pháp nhân, chuẩn bị và nộp hồ sơ, chuyển vốn, thủ tục ngân hàng, xem xét địa điểm kinh doanh và các yêu cầu riêng của từng ngành nghề.',
            'Việc thành lập công ty không tự động làm phát sinh tư cách cư trú (居留) hay giấy phép làm việc (工作許可): đó là các thủ tục riêng biệt, được xem xét theo từng hồ sơ.',
          ],
          items: [
            'Doanh nghiệp nước ngoài đang chọn giữa công ty con, chi nhánh và văn phòng đại diện tại Đài Loan',
            'Nhóm cần so sánh phương án chi nhánh và công ty con theo mục tiêu kinh doanh của công ty mẹ',
            'Doanh nghiệp bước vào những ngành có điều kiện như mỹ phẩm hoặc logistics',
            'Khách hàng muốn xem xét cùng lúc việc thành lập, thủ tục cư trú, nhãn hiệu và các vấn đề lao động',
            'Khách hàng cần hỗ trợ về thuế và kế toán cho pháp nhân tại Đài Loan',
          ],
        },
        {
          heading: 'Thẩm định đầu tư, chuyển vốn và đăng ký',
          paragraphs: [
            'Trước khi nộp hồ sơ, cần xác nhận yêu cầu thẩm định đầu tư, mức vốn, cơ cấu cổ đông và địa điểm kinh doanh. Trong thực tế, bước thẩm định đầu tư và bước chuyển vốn thường là những bước nhạy cảm nhất về thời điểm.',
            'Địa điểm kinh doanh, mã ngành nghề và mô hình hoạt động thực tế cần khớp với nhau. Với những ngành có điều kiện, chỉ hoàn tất việc đăng ký thành lập là chưa đủ.',
            'Trình tự và thời gian thực hiện thay đổi tùy theo hình thức pháp nhân được chọn, tùy nhà đầu tư, ngành nghề, ngân hàng liên quan và tài liệu hiện có.',
          ],
        },
        {
          heading: 'Sau khi đăng ký: ngân hàng, thuế – kế toán, cư trú, nhãn hiệu và lao động',
          paragraphs: [
            'Thứ tự công việc sau khi đăng ký cũng cần được sắp xếp từ đầu: thủ tục ngân hàng, hỗ trợ thuế và kế toán, hỗ trợ thủ tục cư trú, nhãn hiệu và các văn bản về lao động. Chỉ đăng ký công ty thường là chưa đủ, vì những việc này phát sinh ngay sau đó.',
            'Sau khi đăng ký, văn phòng có thể hỗ trợ các thủ tục về tư cách cư trú gắn với công ty hoặc với việc cử nhân sự, cũng như hỗ trợ các vấn đề thuế và kế toán phát sinh từ việc thành lập và vận hành công ty tại Đài Loan.',
            'Hợp đồng, cơ cấu lao động và nhãn hiệu nên được cân nhắc ngay từ giai đoạn thành lập, chứ không để lại sau.',
          ],
        },
        {
          heading: 'Nội dung nên có trong email đầu tiên',
          paragraphs: [
            'Bước xem xét ban đầu có thể bắt đầu từ ngoài Đài Loan qua email hoặc trao đổi trực tuyến; các thủ tục phải nộp tại Đài Loan được sắp xếp sau buổi trao đổi đầu tiên. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn, trực tiếp hoặc qua video.',
            'Bản tiếng Anh dành cho tư vấn: /en/taiwan-company-setup-lawyer',
            'Trang này không công bố con số. Phạm vi công việc được xác định trước, sau đó mức phí và cách tính phí được xác nhận với quý vị trước khi công việc bắt đầu; xem /vi/pricing.',
          ],
          items: [
            'Tóm tắt ngắn: mô hình kinh doanh dự kiến tại Đài Loan, công ty mẹ hoặc nhà đầu tư, mối liên hệ với Đài Loan, mốc thời gian hoặc thời hạn nếu có, và cách liên hệ với quý vị',
            'Không bắt buộc: múi giờ hoặc khung giờ thuận tiện, và cách quý vị tìm thấy trang này',
            'Chuẩn bị cho bước sau theo hướng dẫn của luật sư: giấy tờ đăng ký của công ty mẹ hoặc nhà đầu tư, cơ cấu cổ đông và thông tin người quản lý — chưa gửi bản gốc trong email đầu tiên',
            'Chuẩn bị cho bước sau: phạm vi kinh doanh dự kiến, mô hình vận hành, địa chỉ dự kiến tại Đài Loan và các hợp đồng vận hành',
            'Chuẩn bị cho bước sau: mức vốn dự kiến, kế hoạch chuyển vốn, kế hoạch tuyển dụng tại Đài Loan và các thông tin về giấy phép hoặc điều kiện ngành nghề mà quý vị đã nắm được',
          ],
        },
        {
          heading: 'Những điểm cần lưu ý',
          paragraphs: [
            'Nếu mã ngành nghề không khớp với mô hình kinh doanh thực tế, công việc xin giấy phép có thể bị đình trệ ở giai đoạn sau. Việc mở tài khoản ngân hàng cũng thường mất nhiều thời gian hơn khách hàng dự tính, kể cả khi đã đăng ký xong.',
            'Các ngành như mỹ phẩm, logistics, thực phẩm hay nền tảng trực tuyến có thể cần thêm những phê duyệt riêng. Nếu vấn đề thị thực và cơ cấu lao động bị để lại sau cùng, tiến độ khởi động thường bị lùi lại.',
            'Trang này là thông tin chung, không phải phân tích pháp lý cho một hồ sơ cụ thể, và không cam kết kết quả hay thời gian phản hồi.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Nên chọn chi nhánh hay công ty con?',
          answer:
            'Điều đó phụ thuộc vào cơ cấu trách nhiệm, các vấn đề về thuế và kế hoạch mở rộng. Công ty con thường được dùng cho hoạt động độc lập tại Đài Loan, còn chi nhánh có thể phù hợp khi công ty mẹ trực tiếp điều hành.',
        },
        {
          question: 'Chỉ đăng ký thành lập công ty đã đủ chưa?',
          answer:
            'Thường là chưa. Thủ tục ngân hàng, hỗ trợ thuế và kế toán, hỗ trợ thủ tục cư trú, nhãn hiệu, sắp xếp về lao động và giấy phép ngành nghề thường phát sinh ngay sau khi đăng ký.',
        },
        {
          question: 'Có thể bắt đầu xem xét khi công ty mẹ còn ở ngoài Đài Loan không?',
          answer:
            'Có. Bước xem xét ban đầu có thể bắt đầu qua email hoặc trao đổi trực tuyến. Các thủ tục phải nộp tại Đài Loan, việc làm với ngân hàng và những bước cần có mặt trực tiếp được sắp xếp sau buổi trao đổi đầu tiên.',
        },
        {
          question: 'Văn phòng có hỗ trợ thủ tục cư trú sau khi thành lập công ty không?',
          answer:
            'Có. Văn phòng hỗ trợ các thủ tục về tư cách cư trú tại Đài Loan gắn với công ty hoặc với việc cử nhân sự. Đây là thủ tục riêng và không tự động phát sinh từ việc thành lập công ty.',
        },
        {
          question: 'Văn phòng có hỗ trợ thuế và kế toán cho pháp nhân tại Đài Loan không?',
          answer:
            'Có. Văn phòng hỗ trợ các vấn đề thuế và kế toán phát sinh từ việc thành lập và vận hành công ty tại Đài Loan.',
        },
        {
          question: 'Xem chi phí ở đâu?',
          answer:
            'Xem trang “Phạm vi và chi phí” tại /vi/pricing. Trang này không công bố con số; phạm vi công việc được xác định trước, sau đó mức phí và cách tính phí được xác nhận với quý vị trước khi công việc bắt đầu.',
        },
        {
          question: 'Buổi trao đổi với luật sư được thực hiện bằng ngôn ngữ nào?',
          answer:
            'Không. Phần hướng dẫn này được viết bằng tiếng Việt, nhưng việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn. Chúng tôi cũng không cam kết bố trí phiên dịch. Việc dịch văn bản là chuyện riêng: nội dung gốc quý vị viết được lưu giữ nguyên văn và không được dịch tự động.',
        },
      ],
    },
    'debt-collection': {
      eyebrow: 'HƯỚNG DẪN',
      title: 'Thu hồi công nợ và tranh chấp hợp đồng tại Đài Loan — hướng dẫn cho doanh nghiệp nước ngoài',
      description:
        'Hướng dẫn cho doanh nghiệp nước ngoài có hóa đơn chưa thanh toán hoặc tranh chấp hợp đồng với đối tác Đài Loan: cách bắt đầu từ xa và các phương án xử lý.',
      intro:
        'Trang này dành cho doanh nghiệp nước ngoài có hóa đơn chưa được thanh toán hoặc bị vi phạm hợp đồng bởi một đối tác tại Đài Loan, và cho khách hàng quốc tế cần điều hành từ xa phương án tố tụng hoặc thương lượng tại Đài Loan. Đây là thông tin chung, không phải phân tích pháp lý cho một hồ sơ cụ thể. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sections: [
        {
          heading: 'Những tranh chấp thuộc phạm vi trang này',
          paragraphs: [
            'Nhóm công việc này gồm tranh chấp hợp đồng, yêu cầu bồi thường thiệt hại ngoài hợp đồng và tranh chấp tiêu dùng. Công việc thường bắt đầu bằng việc sắp xếp lại diễn biến sự việc, xác định tài liệu và chứng cứ đang có, rồi mới bàn đến phương án xử lý.',
            'Văn phòng làm việc theo pháp luật Đài Loan. Phạm vi cụ thể của từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi.',
          ],
          items: [
            'Doanh nghiệp nước ngoài có hóa đơn chưa được thanh toán hoặc bị đối tác tại Đài Loan vi phạm hợp đồng',
            'Khách hàng quốc tế cần điều hành từ xa phương án tố tụng hoặc thương lượng tại Đài Loan',
          ],
        },
        {
          heading: 'Bắt đầu vụ việc khi đang ở ngoài Đài Loan',
          paragraphs: [
            'Bước xem xét ban đầu có thể bắt đầu từ xa, sau khi các tài liệu cốt lõi, mốc thời gian và cơ cấu ủy quyền đã được sắp xếp.',
            'Trong nhiều vụ việc dân sự, giai đoạn đầu — xem xét tài liệu, gửi văn bản yêu cầu thanh toán và liên hệ thương lượng — có thể được xử lý từ xa trên cơ sở giấy ủy quyền. Việc có cần có mặt tại tòa hay không phụ thuộc vào thủ tục và giai đoạn của thủ tục đó; nội dung này được làm rõ trong buổi trao đổi đầu tiên.',
            'Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn. Bản tiếng Anh dành cho tư vấn: /en/taiwan-litigation-lawyer',
          ],
        },
        {
          heading: 'So sánh thương lượng, kiện dân sự và thi hành án',
          paragraphs: [
            'Công việc bắt đầu từ hợp đồng, hóa đơn và các trao đổi giữa hai bên để đánh giá trách nhiệm và phần có khả năng thu hồi, sau đó so sánh phương án thương lượng, khởi kiện dân sự và thi hành án trước khi đề xuất hướng đi.',
            'Việc đánh giá một phương án thương lượng chỉ nên được đưa ra sau khi đã xem xét thiệt hại, cơ cấu trách nhiệm và tình trạng chứng cứ hiện có.',
            'Sau đó cần xác định phần nào của vụ việc thuộc thủ tục dân sự, phần nào phải xử lý theo thủ tục khác, và liệu chúng có nên tiến hành song song hay không. Khả năng thương lượng, các khoảng trống về chứng cứ và yêu cầu về việc có mặt được xem xét trước khi chọn bước thủ tục đầu tiên.',
          ],
        },
        {
          heading: 'Nội dung nên có trong email đầu tiên',
          paragraphs: [
            'Email đầu tiên nên nêu rõ đối tác tại Đài Loan hoặc mối liên hệ khác với Đài Loan, cùng thời hạn nếu có. Múi giờ và cách quý vị tìm thấy trang này là thông tin không bắt buộc.',
            'Trang này không công bố con số. Phạm vi công việc được xác định trước, sau đó mức phí và cách tính phí được xác nhận với quý vị trước khi công việc bắt đầu; xem /vi/pricing.',
          ],
          items: [
            'Tóm tắt ngắn: vấn đề hợp đồng hoặc khoản yêu cầu thanh toán, mối liên hệ với Đài Loan, mốc thời gian hoặc thời hạn nếu có, và cách liên hệ với quý vị',
            'Không bắt buộc: múi giờ hoặc khung giờ thuận tiện, và cách quý vị tìm thấy trang này',
            'Chuẩn bị cho bước sau theo hướng dẫn của luật sư: bản mô tả diễn biến theo thời gian, hợp đồng, ghi nhận cuộc gọi hoặc tin nhắn trao đổi — chưa gửi bản gốc trong email đầu tiên',
            'Chuẩn bị cho bước sau: thông tin định danh cá nhân hoặc thông tin công ty của đối tác, ở mức vụ việc cần đến',
            'Chuẩn bị cho bước sau: ảnh, video, chứng từ thanh toán, tài liệu của cơ quan công an và mọi cuộc điều tra, vụ kiện hoặc thương lượng đang có; hồ sơ y tế hay sao kê ngân hàng chỉ gửi sau khi luật sư yêu cầu',
          ],
        },
        {
          heading: 'Những điểm cần lưu ý',
          paragraphs: [
            'Với vụ việc có yếu tố nước ngoài, việc tống đạt và kiểm soát lịch trình có thể mất nhiều thời gian hơn dự tính.',
            'Thời hạn, kể cả thời hiệu khởi kiện, và mức độ đầy đủ của chứng cứ ảnh hưởng lớn đến cách tiến hành một vụ việc dân sự, vì vậy quý vị nên nêu sớm các mốc thời gian mà mình biết. Nếu quý vị còn giữ hợp đồng, tin nhắn trao đổi hay chứng từ thanh toán, hãy nói rõ ngay từ đầu.',
            'Trang này là thông tin chung và không cam kết kết quả hay thời gian phản hồi.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Tôi có thể bắt đầu vụ việc tại Đài Loan khi đang ở nước ngoài không?',
          answer:
            'Có. Bước xem xét ban đầu có thể bắt đầu từ xa, sau khi các tài liệu cốt lõi, mốc thời gian và cơ cấu ủy quyền đã được sắp xếp.',
        },
        {
          question: 'Doanh nghiệp nước ngoài có thể hành động đối với một công ty Đài Loan mà không cần đến Đài Loan không?',
          answer:
            'Trong nhiều vụ việc dân sự, giai đoạn đầu — xem xét tài liệu, gửi văn bản yêu cầu thanh toán và liên hệ thương lượng — có thể được xử lý từ xa trên cơ sở giấy ủy quyền. Việc có cần có mặt tại tòa hay không phụ thuộc vào thủ tục và giai đoạn của thủ tục đó; nội dung này được làm rõ trong buổi trao đổi đầu tiên.',
        },
        {
          question: 'Hóa đơn chưa được thanh toán hoặc vi phạm hợp đồng của đối tác Đài Loan được xử lý ra sao?',
          answer:
            'Công việc bắt đầu từ hợp đồng, hóa đơn và các trao đổi giữa hai bên để đánh giá trách nhiệm và phần có khả năng thu hồi, sau đó so sánh phương án thương lượng, khởi kiện dân sự và thi hành án trước khi đề xuất hướng đi.',
        },
        {
          question: 'Có thể đánh giá phương án thương lượng trước khi khởi kiện không?',
          answer:
            'Có, nhưng việc đánh giá đó chỉ nên được đưa ra sau khi đã xem xét thiệt hại, cơ cấu trách nhiệm và tình trạng chứng cứ hiện có.',
        },
        {
          question: 'Văn phòng có cho biết vụ việc của tôi có đáng theo đuổi hay không?',
          answer:
            'Có. Bước đầu là đánh giá trách nhiệm, chứng cứ và khả năng thu hồi, đặt cạnh chi phí và thời gian dự kiến; khi một yêu cầu không đáng theo đuổi, văn phòng sẽ nói rõ điều đó.',
        },
        {
          question: 'Email đầu tiên nên có những gì?',
          answer:
            'Một mô tả ngắn về vấn đề, mối liên hệ với Đài Loan, thời hạn nếu có và cách liên hệ với quý vị. Múi giờ và cách quý vị tìm thấy trang này là thông tin không bắt buộc. Giấy tờ định danh có thể chờ đến khi luật sư yêu cầu.',
        },
        {
          question: 'Buổi trao đổi với luật sư được thực hiện bằng ngôn ngữ nào?',
          answer:
            'Không. Phần hướng dẫn này được viết bằng tiếng Việt, nhưng việc tư vấn với luật sư chỉ được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn. Chúng tôi cũng không cam kết bố trí phiên dịch. Việc dịch văn bản là chuyện riêng: nội dung gốc quý vị viết được lưu giữ nguyên văn và không được dịch tự động.',
        },
      ],
    },
  },
  id: {
    'company-setup': {
      eyebrow: 'PANDUAN',
      title: 'Pendirian perusahaan di Taiwan — panduan untuk perusahaan asing',
      description:
        'Panduan bagi perusahaan asing tentang pemilihan bentuk badan usaha, penilaian penanaman modal, pengiriman modal, pendaftaran, dan langkah sesudahnya di Taiwan.',
      intro:
        'Pemilihan bentuk badan usaha, penilaian penanaman modal, pengiriman modal, pendaftaran, dan perjanjian operasional sebaiknya ditinjau sebagai satu rangkaian proses menurut hukum Taiwan. Halaman ini menjelaskan pilihan anak perusahaan, kantor cabang, dan kantor perwakilan dari sudut pandang induk perusahaan serta investor asing yang masuk ke Taiwan, tidak terbatas pada satu negara asal. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sections: [
        {
          heading: 'Memilih bentuk badan usaha: anak perusahaan, kantor cabang, atau kantor perwakilan',
          paragraphs: [
            'Pilihan antara anak perusahaan, kantor cabang, dan kantor perwakilan bergantung pada susunan tanggung jawab, pertimbangan perpajakan, dan rencana perluasan usaha. Anak perusahaan lazim dipakai untuk kegiatan yang berdiri sendiri di Taiwan, sedangkan kantor cabang dapat cocok bila induk perusahaan mengendalikannya secara langsung.',
            'Kami mendampingi investor dan perusahaan asing yang mendirikan atau menjalankan badan usaha di Taiwan: pemilihan bentuk badan usaha, penyiapan dan pengajuan berkas, pengiriman modal, urusan perbankan, penilaian tempat usaha, serta persyaratan yang khusus berlaku bagi bidang usaha tertentu.',
            'Pendirian perusahaan tidak dengan sendirinya menghasilkan izin tinggal (居留) atau izin kerja (工作許可): keduanya adalah proses tersendiri yang dinilai menurut keadaan masing-masing orang.',
          ],
          items: [
            'Perusahaan asing yang sedang memilih anak perusahaan, kantor cabang, atau kantor perwakilan di Taiwan',
            'Tim yang membandingkan pendirian kantor cabang dengan anak perusahaan menurut tujuan usaha induk perusahaan',
            'Perusahaan yang memasuki bidang usaha dengan persyaratan khusus, misalnya kosmetik atau logistik',
            'Klien yang ingin meninjau sekaligus pendirian, urusan izin tinggal, merek, dan persoalan ketenagakerjaan',
            'Klien yang memerlukan pendampingan perpajakan dan akuntansi untuk badan usahanya di Taiwan',
          ],
        },
        {
          heading: 'Penilaian penanaman modal, pengiriman modal, dan pendaftaran',
          paragraphs: [
            'Sebelum berkas diajukan, pastikan lebih dulu kebutuhan penilaian penanaman modal, besaran modal, susunan pemegang saham, dan tempat usaha. Dalam praktik, tahap penilaian penanaman modal dan tahap pengiriman modal adalah tahap yang paling peka terhadap waktu.',
            'Tempat usaha, kode bidang usaha, dan model usaha yang benar-benar dijalankan harus saling cocok. Untuk bidang usaha dengan persyaratan khusus, menyelesaikan pendirian saja belum cukup.',
            'Urutan dan lamanya proses berbeda-beda menurut bentuk badan usaha yang dipilih, investornya, bidang usahanya, bank yang terlibat, dan dokumen yang tersedia.',
          ],
        },
        {
          heading: 'Setelah pendaftaran: bank, pajak dan akuntansi, izin tinggal, merek, dan ketenagakerjaan',
          paragraphs: [
            'Urutan langkah setelah pendaftaran pun perlu disusun sejak awal: urusan perbankan, pendampingan perpajakan dan akuntansi, pendampingan izin tinggal, merek, serta dokumen ketenagakerjaan. Pendaftaran perusahaan saja biasanya belum cukup karena hal-hal tersebut menyusul segera sesudahnya.',
            'Setelah pendaftaran, kami dapat mendampingi urusan izin tinggal di Taiwan yang berkaitan dengan perusahaan atau dengan penugasan pegawai, serta membantu urusan akuntansi dan perpajakan yang timbul dari pendirian dan pengoperasian perusahaan di Taiwan.',
            'Perjanjian, susunan ketenagakerjaan, dan merek sebaiknya dipikirkan sejak tahap pendirian, bukan ditunda.',
          ],
        },
        {
          heading: 'Isi pesan pertama Anda',
          paragraphs: [
            'Peninjauan awal dapat dimulai dari luar Taiwan melalui surel atau pertemuan video; pengajuan berkas di Taiwan disusun setelah pertemuan pertama. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea, secara tatap muka maupun video.',
            'Versi bahasa Inggris untuk konsultasi: /en/taiwan-company-setup-lawyer',
            'Halaman ini tidak memuat angka. Lingkup pekerjaan ditetapkan lebih dulu, lalu besaran dan cara penghitungan biaya dipastikan bersama Anda sebelum pekerjaan dimulai; lihat /id/pricing.',
          ],
          items: [
            'Ringkasan singkat: model usaha yang direncanakan di Taiwan, induk perusahaan atau investornya, kaitannya dengan Taiwan, tanggal penting atau tenggat waktu bila ada, dan cara kami menghubungi Anda',
            'Tidak wajib: zona waktu atau waktu yang Anda kehendaki untuk dihubungi, dan dari mana Anda menemukan halaman ini',
            'Siapkan untuk tahap berikutnya menurut arahan advokat: dokumen pendaftaran induk perusahaan atau investor, susunan pemegang saham, dan keterangan direksi — jangan kirim dokumen asli pada pesan pertama',
            'Siapkan untuk tahap berikutnya: rencana lingkup usaha, model pengoperasian, calon alamat di Taiwan, dan perjanjian operasional',
            'Siapkan untuk tahap berikutnya: perkiraan besaran modal, rencana pengiriman modal, rencana perekrutan di Taiwan, serta keterangan perizinan atau persyaratan bidang usaha yang sudah Anda ketahui',
          ],
        },
        {
          heading: 'Hal yang perlu diperhatikan',
          paragraphs: [
            'Jika kode bidang usaha tidak cocok dengan model usaha yang sebenarnya, urusan perizinan dapat tersendat pada tahap berikutnya. Pembukaan rekening bank pun sering memakan waktu lebih lama daripada perkiraan klien, sekalipun pendaftaran sudah selesai.',
            'Bidang usaha seperti kosmetik, logistik, pangan, dan platform daring dapat memerlukan persetujuan tambahan. Bila urusan visa dan penataan ketenagakerjaan baru dipikirkan belakangan, jadwal mulai beroperasi biasanya mundur.',
            'Halaman ini bersifat keterangan umum, bukan analisis hukum atas satu berkas tertentu, dan tidak menjanjikan hasil maupun waktu balasan.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Mana yang sebaiknya dipilih: kantor cabang atau anak perusahaan?',
          answer:
            'Hal itu bergantung pada susunan tanggung jawab, pertimbangan perpajakan, dan rencana perluasan usaha. Anak perusahaan lazim dipakai untuk kegiatan yang berdiri sendiri di Taiwan, sedangkan kantor cabang dapat cocok bila induk perusahaan mengendalikannya secara langsung.',
        },
        {
          question: 'Apakah pendaftaran perusahaan saja sudah cukup?',
          answer:
            'Biasanya belum. Urusan perbankan, pendampingan perpajakan dan akuntansi, pendampingan izin tinggal, merek, penataan ketenagakerjaan, dan perizinan bidang usaha umumnya menyusul segera setelah pendaftaran.',
        },
        {
          question: 'Bisakah peninjauan dimulai selagi induk perusahaan masih di luar Taiwan?',
          answer:
            'Bisa. Peninjauan awal dapat dimulai melalui surel atau pertemuan video. Pengajuan berkas di Taiwan, urusan bank, dan langkah yang menuntut kehadiran langsung disusun setelah pertemuan pertama itu.',
        },
        {
          question: 'Apakah kantor mendampingi urusan izin tinggal setelah perusahaan berdiri?',
          answer:
            'Ya. Kami mendampingi urusan izin tinggal di Taiwan yang berkaitan dengan perusahaan atau dengan penugasan pegawai. Itu proses tersendiri dan tidak timbul dengan sendirinya dari pendirian perusahaan.',
        },
        {
          question: 'Apakah kantor membantu urusan pajak dan akuntansi badan usaha di Taiwan?',
          answer:
            'Ya. Kami membantu urusan akuntansi dan perpajakan yang timbul dari pendirian dan pengoperasian perusahaan di Taiwan.',
        },
        {
          question: 'Di mana biaya dapat dilihat?',
          answer:
            'Lihat halaman “Lingkup dan biaya” di /id/pricing. Halaman ini tidak memuat angka; lingkup pekerjaan ditetapkan lebih dulu, lalu besaran dan cara penghitungan biaya dipastikan bersama Anda sebelum pekerjaan dimulai.',
        },
        {
          question: 'Dalam bahasa apa pertemuan dengan advokat dilakukan?',
          answer:
            'Tidak. Panduan ini ditulis dalam bahasa Indonesia, tetapi konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea. Kami juga tidak menjanjikan penerjemah. Penerjemahan tulisan adalah hal terpisah: teks asli yang Anda tulis disimpan apa adanya dan tidak diterjemahkan secara otomatis.',
        },
      ],
    },
    'debt-collection': {
      eyebrow: 'PANDUAN',
      title: 'Penagihan piutang dan sengketa kontrak di Taiwan — panduan untuk perusahaan asing',
      description:
        'Panduan bagi perusahaan asing dengan tagihan belum dibayar atau sengketa perjanjian di Taiwan: cara memulai dari luar negeri dan pilihan langkah penyelesaian.',
      intro:
        'Halaman ini ditujukan bagi perusahaan asing yang tagihannya belum dibayar atau perjanjiannya dilanggar oleh mitra di Taiwan, dan bagi klien internasional yang perlu mengendalikan langkah perkara atau perundingan di Taiwan dari jarak jauh. Sifatnya keterangan umum, bukan analisis hukum atas satu berkas tertentu. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sections: [
        {
          heading: 'Sengketa yang termasuk dalam halaman ini',
          paragraphs: [
            'Kelompok pekerjaan ini mencakup sengketa perjanjian, tuntutan ganti rugi atas perbuatan melawan hukum, dan sengketa konsumen. Pekerjaan biasanya dimulai dengan menyusun kronologi kejadian, memeriksa dokumen dan bukti yang ada, baru kemudian membahas langkah penyelesaian.',
            'Kantor kami bekerja berdasarkan hukum Taiwan. Lingkup setiap perkara dipastikan tersendiri setelah advokat meninjau isi pesan Anda.',
          ],
          items: [
            'Perusahaan asing yang tagihannya belum dibayar atau perjanjiannya dilanggar oleh mitra di Taiwan',
            'Klien internasional yang perlu mengendalikan langkah perkara atau perundingan di Taiwan dari jarak jauh',
          ],
        },
        {
          heading: 'Memulai perkara dari luar Taiwan',
          paragraphs: [
            'Peninjauan awal dapat dimulai dari jarak jauh setelah dokumen inti, kronologi waktu, dan susunan pemberian kuasa tertata.',
            'Pada banyak perkara perdata, tahap awal — pemeriksaan dokumen, surat penagihan, dan kontak untuk berunding — dapat ditangani dari jarak jauh dengan surat kuasa. Perlu tidaknya kehadiran di pengadilan bergantung pada jenis prosedur dan tahapnya; hal itu kami petakan pada pertemuan pertama.',
            'Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea. Versi bahasa Inggris untuk konsultasi: /en/taiwan-litigation-lawyer',
          ],
        },
        {
          heading: 'Membandingkan perundingan, gugatan perdata, dan pelaksanaan putusan',
          paragraphs: [
            'Kami mulai dari perjanjian, tagihan, dan surat-menyurat untuk menilai tanggung jawab serta bagian yang mungkin dapat ditagih, lalu membandingkan penyelesaian lewat perundingan, gugatan perdata, dan pelaksanaan putusan sebelum mengusulkan jalan yang ditempuh.',
            'Penilaian atas pilihan berunding sebaiknya diberikan hanya setelah kerugian, susunan tanggung jawab, dan keadaan bukti yang ada ditinjau.',
            'Sesudah itu ditentukan bagian mana dari perkara yang masuk prosedur perdata, bagian mana yang harus ditempuh lewat prosedur lain, dan apakah keduanya sebaiknya berjalan bersamaan. Peluang berunding, kekurangan bukti, dan keharusan hadir ditinjau sebelum langkah prosedur pertama dipilih.',
          ],
        },
        {
          heading: 'Isi pesan pertama Anda',
          paragraphs: [
            'Pesan pertama sebaiknya menyebutkan mitra di Taiwan atau kaitan lain perkara itu dengan Taiwan, beserta tenggat waktu bila ada. Zona waktu dan dari mana Anda menemukan halaman ini tidak wajib disebutkan.',
            'Halaman ini tidak memuat angka. Lingkup pekerjaan ditetapkan lebih dulu, lalu besaran dan cara penghitungan biaya dipastikan bersama Anda sebelum pekerjaan dimulai; lihat /id/pricing.',
          ],
          items: [
            'Ringkasan singkat: persoalan perjanjian atau tagihannya, kaitannya dengan Taiwan, tanggal penting atau tenggat waktu bila ada, dan cara kami menghubungi Anda',
            'Tidak wajib: zona waktu atau waktu yang Anda kehendaki untuk dihubungi, dan dari mana Anda menemukan halaman ini',
            'Siapkan untuk tahap berikutnya menurut arahan advokat: kronologi tertulis, perjanjian, serta catatan percakapan telepon atau pesan — jangan kirim dokumen asli pada pesan pertama',
            'Siapkan untuk tahap berikutnya: keterangan identitas pribadi atau identitas perusahaan pihak lawan sejauh diperlukan perkara',
            'Siapkan untuk tahap berikutnya: foto, video, bukti pembayaran, berkas kepolisian, serta penyidikan, perkara pengadilan, atau pembicaraan damai yang sedang berjalan; catatan medis atau rekening bank baru dikirim setelah diminta advokat',
          ],
        },
        {
          heading: 'Hal yang perlu diperhatikan',
          paragraphs: [
            'Pada perkara yang melibatkan warga negara asing, pemanggilan resmi dan pengendalian jadwal dapat memakan waktu lebih lama daripada perkiraan.',
            'Tenggat waktu, termasuk jangka waktu yang ditetapkan undang-undang untuk mengajukan gugatan, dan kelengkapan bukti sangat memengaruhi jalannya perkara perdata, jadi sebutkanlah sejak awal tanggal-tanggal yang Anda ketahui. Jika Anda masih menyimpan perjanjian, percakapan, atau bukti pembayaran, sebutkan hal itu sejak pesan pertama.',
            'Halaman ini bersifat keterangan umum dan tidak menjanjikan hasil maupun waktu balasan.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Bisakah perkara di Taiwan dimulai selagi saya masih di luar negeri?',
          answer:
            'Bisa. Peninjauan awal dapat dimulai dari jarak jauh setelah dokumen inti, kronologi waktu, dan susunan pemberian kuasa tertata.',
        },
        {
          question: 'Bisakah perusahaan asing menempuh langkah terhadap perusahaan Taiwan tanpa datang ke Taiwan?',
          answer:
            'Pada banyak perkara perdata, tahap awal — pemeriksaan dokumen, surat penagihan, dan kontak untuk berunding — dapat ditangani dari jarak jauh dengan surat kuasa. Perlu tidaknya kehadiran di pengadilan bergantung pada jenis prosedur dan tahapnya; hal itu kami petakan pada pertemuan pertama.',
        },
        {
          question: 'Bagaimana tagihan yang belum dibayar atau perjanjian yang dilanggar mitra Taiwan ditangani?',
          answer:
            'Kami mulai dari perjanjian, tagihan, dan surat-menyurat untuk menilai tanggung jawab serta bagian yang mungkin dapat ditagih, lalu membandingkan penyelesaian lewat perundingan, gugatan perdata, dan pelaksanaan putusan sebelum mengusulkan jalan yang ditempuh.',
        },
        {
          question: 'Bisakah pilihan berunding dinilai sebelum gugatan diajukan?',
          answer:
            'Bisa, tetapi penilaian itu sebaiknya diberikan hanya setelah kerugian, susunan tanggung jawab, dan keadaan bukti yang ada ditinjau.',
        },
        {
          question: 'Bisakah kantor menyatakan apakah sengketa saya layak ditempuh?',
          answer:
            'Bisa. Langkah pertama adalah menilai tanggung jawab, bukti, dan kemungkinan penagihan, lalu menimbangnya terhadap biaya dan waktu; bila suatu tuntutan tidak layak ditempuh, kami mengatakannya terus terang.',
        },
        {
          question: 'Apa yang perlu ada dalam pesan pertama?',
          answer:
            'Uraian singkat tentang persoalannya, kaitannya dengan Taiwan, tenggat waktu bila ada, dan cara kami menghubungi Anda. Zona waktu dan dari mana Anda menemukan halaman ini tidak wajib. Nomor identitas dapat menunggu sampai advokat memintanya.',
        },
        {
          question: 'Dalam bahasa apa pertemuan dengan advokat dilakukan?',
          answer:
            'Tidak. Panduan ini ditulis dalam bahasa Indonesia, tetapi konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea. Kami juga tidak menjanjikan penerjemah. Penerjemahan tulisan adalah hal terpisah: teks asli yang Anda tulis disimpan apa adanya dan tidak diterjemahkan secara otomatis.',
        },
      ],
    },
  },
  th: {
    'company-setup': {
      eyebrow: 'ข้อมูลแนะนำ',
      title: 'การจัดตั้งบริษัทในไต้หวัน — ข้อมูลแนะนำสำหรับบริษัทต่างชาติ',
      description:
        'ข้อมูลแนะนำสำหรับบริษัทและนักลงทุนต่างชาติ เรื่องการเลือกรูปแบบนิติบุคคล การตรวจสอบการลงทุน การนำเงินลงทุนเข้า การจดทะเบียน และขั้นตอนหลังการจดทะเบียนในไต้หวัน',
      intro:
        'การเลือกรูปแบบนิติบุคคล การตรวจสอบการลงทุน การนำเงินลงทุนเข้าประเทศ การจดทะเบียน และสัญญาที่ใช้ในการดำเนินกิจการ ควรพิจารณาเป็นกระบวนการเดียวกันภายใต้กฎหมายไต้หวัน หน้านี้อธิบายทางเลือกระหว่างบริษัทย่อย สาขา และสำนักงานผู้แทน จากมุมมองของบริษัทแม่และนักลงทุนต่างชาติที่เข้ามาในไต้หวัน โดยไม่จำกัดเฉพาะประเทศใดประเทศหนึ่ง การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sections: [
        {
          heading: 'การเลือกรูปแบบนิติบุคคล บริษัทย่อย สาขา หรือสำนักงานผู้แทน',
          paragraphs: [
            'การเลือกระหว่างบริษัทย่อย สาขา และสำนักงานผู้แทน ขึ้นอยู่กับโครงสร้างความรับผิด ประเด็นทางภาษี และแผนการขยายกิจการ บริษัทย่อยมักใช้กับการดำเนินกิจการที่เป็นอิสระในไต้หวัน ส่วนสาขาอาจเหมาะกับกรณีที่บริษัทแม่ควบคุมโดยตรง',
            'สำนักงานให้ความช่วยเหลือแก่นักลงทุนและบริษัทต่างชาติที่จัดตั้งหรือดำเนินกิจการในไต้หวัน ทั้งการเลือกรูปแบบนิติบุคคล การเตรียมและยื่นเอกสาร การนำเงินลงทุนเข้าประเทศ การดำเนินการกับธนาคาร การพิจารณาสถานประกอบการ และเงื่อนไขเฉพาะของแต่ละประเภทธุรกิจ',
            'ทั้งนี้ การจัดตั้งบริษัทไม่ได้ทำให้ได้สถานะการมีถิ่นที่อยู่ (居留) หรือใบอนุญาตทำงาน (工作許可) โดยอัตโนมัติ เพราะเป็นคนละกระบวนการกัน และต้องพิจารณาเป็นรายกรณี',
          ],
          items: [
            'บริษัทต่างชาติที่กำลังเลือกระหว่างบริษัทย่อย สาขา และสำนักงานผู้แทนในไต้หวัน',
            'ทีมงานที่ต้องเปรียบเทียบการตั้งสาขากับการตั้งบริษัทย่อย ตามเป้าหมายทางธุรกิจของบริษัทแม่',
            'บริษัทที่เข้าสู่ธุรกิจซึ่งมีเงื่อนไขเฉพาะ เช่น เครื่องสำอางหรือโลจิสติกส์',
            'ลูกความที่ต้องการพิจารณาการจัดตั้ง เรื่องถิ่นที่อยู่ เครื่องหมายการค้า และประเด็นแรงงานไปพร้อมกัน',
            'ลูกความที่ต้องการความช่วยเหลือด้านภาษีและบัญชีสำหรับนิติบุคคลในไต้หวัน',
          ],
        },
        {
          heading: 'การตรวจสอบการลงทุน การนำเงินลงทุนเข้า และการจดทะเบียน',
          paragraphs: [
            'ก่อนยื่นเอกสาร ควรยืนยันก่อนว่าต้องผ่านการตรวจสอบการลงทุนหรือไม่ จำนวนทุนเท่าใด โครงสร้างผู้ถือหุ้นเป็นอย่างไร และสถานประกอบการอยู่ที่ใด ในทางปฏิบัติ ขั้นตอนการตรวจสอบการลงทุนและขั้นตอนการนำเงินลงทุนเข้าเป็นขั้นตอนที่อ่อนไหวต่อเวลามากที่สุด',
            'สถานประกอบการ รหัสประเภทธุรกิจ และรูปแบบการดำเนินกิจการจริงต้องสอดคล้องกัน สำหรับธุรกิจที่มีเงื่อนไขเฉพาะ เพียงจดทะเบียนจัดตั้งให้เสร็จยังไม่เพียงพอ',
            'ลำดับขั้นตอนและระยะเวลาแตกต่างกันไปตามรูปแบบนิติบุคคลที่เลือก ผู้ลงทุน ประเภทธุรกิจ ธนาคารที่เกี่ยวข้อง และเอกสารที่มีอยู่',
          ],
        },
        {
          heading: 'หลังการจดทะเบียน ธนาคาร ภาษีและบัญชี ถิ่นที่อยู่ เครื่องหมายการค้า และแรงงาน',
          paragraphs: [
            'ลำดับงานหลังการจดทะเบียนก็ควรวางไว้ตั้งแต่ต้น ทั้งการดำเนินการกับธนาคาร ความช่วยเหลือด้านภาษีและบัญชี ความช่วยเหลือเรื่องถิ่นที่อยู่ เครื่องหมายการค้า และเอกสารด้านแรงงาน โดยทั่วไปการจดทะเบียนบริษัทเพียงอย่างเดียวยังไม่เพียงพอ เพราะงานเหล่านี้ตามมาทันทีหลังจากนั้น',
            'หลังการจดทะเบียน สำนักงานสามารถช่วยดำเนินการเรื่องถิ่นที่อยู่ในไต้หวันที่เกี่ยวข้องกับบริษัทหรือกับการส่งบุคลากรเข้ามาทำงาน รวมทั้งช่วยดูแลเรื่องบัญชีและภาษีที่เกิดจากการจัดตั้งและการดำเนินกิจการในไต้หวัน',
            'สัญญา โครงสร้างการจ้างงาน และเครื่องหมายการค้า ควรพิจารณาตั้งแต่ช่วงจัดตั้ง ไม่ควรปล่อยไว้ทีหลัง',
          ],
        },
        {
          heading: 'สิ่งที่ควรระบุในอีเมลฉบับแรก',
          paragraphs: [
            'การตรวจสอบเบื้องต้นเริ่มจากนอกไต้หวันได้ ทั้งทางอีเมลและทางวิดีโอ ส่วนการยื่นเอกสารในไต้หวันจะจัดลำดับหลังการปรึกษาครั้งแรก การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี ทั้งแบบพบกันโดยตรงและทางวิดีโอ',
            'ฉบับภาษาอังกฤษสำหรับการปรึกษา: /en/taiwan-company-setup-lawyer',
            'หน้านี้ไม่แสดงตัวเลข สำนักงานจะกำหนดขอบเขตงานก่อน จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน ดูได้ที่ /th/pricing',
          ],
          items: [
            'สรุปเรื่องอย่างย่อ รูปแบบธุรกิจที่วางแผนไว้ในไต้หวัน บริษัทแม่หรือผู้ลงทุน ความเกี่ยวข้องกับไต้หวัน วันสำคัญหรือกำหนดเวลาหากมี และช่องทางติดต่อท่าน',
            'ไม่บังคับ เขตเวลาหรือช่วงเวลาที่สะดวกให้ติดต่อ และท่านพบหน้านี้ได้อย่างไร',
            'เตรียมไว้สำหรับขั้นตอนถัดไปตามที่ทนายความแจ้ง เอกสารจดทะเบียนของบริษัทแม่หรือผู้ลงทุน โครงสร้างผู้ถือหุ้น และข้อมูลกรรมการ โดยยังไม่ต้องส่งต้นฉบับในอีเมลฉบับแรก',
            'เตรียมไว้สำหรับขั้นตอนถัดไป ขอบเขตธุรกิจที่วางแผนไว้ รูปแบบการดำเนินกิจการ ที่ตั้งที่คาดว่าจะใช้ในไต้หวัน และสัญญาที่ใช้ดำเนินกิจการ',
            'เตรียมไว้สำหรับขั้นตอนถัดไป จำนวนทุนที่คาดไว้ แผนการนำเงินลงทุนเข้า แผนการจ้างงานในไต้หวัน และข้อมูลเรื่องใบอนุญาตหรือเงื่อนไขเฉพาะของธุรกิจที่ท่านทราบแล้ว',
          ],
        },
        {
          heading: 'ข้อควรระวัง',
          paragraphs: [
            'หากรหัสประเภทธุรกิจไม่ตรงกับรูปแบบธุรกิจจริง งานขอใบอนุญาตอาจติดขัดในภายหลัง การเปิดบัญชีธนาคารเองก็มักใช้เวลานานกว่าที่ลูกความคาดไว้ แม้จดทะเบียนเสร็จแล้วก็ตาม',
            'ธุรกิจอย่างเครื่องสำอาง โลจิสติกส์ อาหาร และแพลตฟอร์มออนไลน์ อาจต้องขออนุมัติเพิ่มเติม หากปล่อยเรื่องวีซ่าและการวางโครงสร้างแรงงานไว้ทีหลัง กำหนดเวลาเริ่มดำเนินกิจการมักเลื่อนออกไป',
            'หน้านี้เป็นข้อมูลทั่วไป ไม่ใช่การวิเคราะห์ทางกฎหมายสำหรับเอกสารเฉพาะเรื่องใดเรื่องหนึ่ง และไม่ได้ให้คำมั่นเรื่องผลของเรื่องหรือระยะเวลาตอบกลับ',
          ],
        },
      ],
      faqs: [
        {
          question: 'ควรเลือกสาขาหรือบริษัทย่อย',
          answer:
            'ขึ้นอยู่กับโครงสร้างความรับผิด ประเด็นทางภาษี และแผนการขยายกิจการ บริษัทย่อยมักใช้กับการดำเนินกิจการที่เป็นอิสระในไต้หวัน ส่วนสาขาอาจเหมาะกับกรณีที่บริษัทแม่ควบคุมโดยตรง',
        },
        {
          question: 'จดทะเบียนบริษัทอย่างเดียวเพียงพอหรือไม่',
          answer:
            'โดยทั่วไปยังไม่เพียงพอ การดำเนินการกับธนาคาร ความช่วยเหลือด้านภาษีและบัญชี ความช่วยเหลือเรื่องถิ่นที่อยู่ เครื่องหมายการค้า การจัดการด้านแรงงาน และใบอนุญาตเฉพาะธุรกิจ มักตามมาทันทีหลังการจดทะเบียน',
        },
        {
          question: 'เริ่มตรวจสอบได้หรือไม่ ขณะที่บริษัทแม่ยังอยู่นอกไต้หวัน',
          answer:
            'ได้ การตรวจสอบเบื้องต้นเริ่มได้ทางอีเมลหรือทางวิดีโอ ส่วนการยื่นเอกสารในไต้หวัน งานที่ต้องทำกับธนาคาร และขั้นตอนที่ต้องไปด้วยตนเอง จะจัดลำดับหลังการปรึกษาครั้งแรก',
        },
        {
          question: 'สำนักงานช่วยเรื่องถิ่นที่อยู่หลังจัดตั้งบริษัทหรือไม่',
          answer:
            'ช่วย สำนักงานช่วยดำเนินการเรื่องถิ่นที่อยู่ในไต้หวันที่เกี่ยวข้องกับบริษัทหรือกับการส่งบุคลากรเข้ามาทำงาน ทั้งนี้เป็นคนละกระบวนการ และไม่ได้เกิดขึ้นเองจากการจัดตั้งบริษัท',
        },
        {
          question: 'สำนักงานช่วยเรื่องภาษีและบัญชีของนิติบุคคลในไต้หวันหรือไม่',
          answer:
            'ช่วย สำนักงานช่วยดูแลเรื่องบัญชีและภาษีที่เกิดจากการจัดตั้งและการดำเนินกิจการในไต้หวัน',
        },
        {
          question: 'ดูค่าใช้จ่ายได้ที่ไหน',
          answer:
            'ดูที่หน้า “ขอบเขตและค่าใช้จ่าย” ที่ /th/pricing หน้านี้ไม่แสดงตัวเลข สำนักงานจะกำหนดขอบเขตงานก่อน จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน',
        },
        {
          question: 'การพูดคุยกับทนายความดำเนินการด้วยภาษาใด',
          answer:
            'ไม่ได้ ข้อมูลแนะนำส่วนนี้จัดทำเป็นภาษาไทย แต่การปรึกษากับทนายความดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี ทั้งนี้ สำนักงานไม่ได้จัดล่ามให้ ส่วนการแปลข้อความเป็นคนละเรื่องกัน ข้อความต้นฉบับที่ท่านเขียนจะถูกเก็บไว้ตามเดิมและไม่มีการแปลโดยอัตโนมัติ',
        },
      ],
    },
    'debt-collection': {
      eyebrow: 'ข้อมูลแนะนำ',
      title: 'การติดตามหนี้ค้างชำระและข้อพิพาทตามสัญญาในไต้หวัน — ข้อมูลแนะนำสำหรับบริษัทต่างชาติ',
      description:
        'ข้อมูลแนะนำสำหรับบริษัทต่างชาติที่มีใบแจ้งหนี้ค้างชำระหรือมีข้อพิพาทตามสัญญากับคู่สัญญาในไต้หวัน ทั้งวิธีเริ่มเรื่องจากต่างประเทศและแนวทางดำเนินการที่มีอยู่',
      intro:
        'หน้านี้จัดทำขึ้นสำหรับบริษัทต่างชาติที่มีใบแจ้งหนี้ค้างชำระหรือถูกคู่สัญญาในไต้หวันผิดสัญญา และสำหรับลูกความต่างชาติที่ต้องบริหารแนวทางคดีหรือการเจรจาในไต้หวันจากระยะไกล เนื้อหานี้เป็นข้อมูลทั่วไป ไม่ใช่การวิเคราะห์ทางกฎหมายสำหรับเอกสารเฉพาะเรื่องใดเรื่องหนึ่ง การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sections: [
        {
          heading: 'ข้อพิพาทที่อยู่ในขอบเขตของหน้านี้',
          paragraphs: [
            'กลุ่มงานนี้ครอบคลุมข้อพิพาทตามสัญญา การเรียกค่าสินไหมทดแทนจากการละเมิด และข้อพิพาทของผู้บริโภค งานมักเริ่มจากการจัดลำดับเหตุการณ์ตามเวลา ตรวจดูเอกสารและพยานหลักฐานที่มีอยู่ แล้วจึงพิจารณาแนวทางดำเนินการ',
            'สำนักงานทำงานภายใต้กฎหมายไต้หวัน ส่วนขอบเขตของแต่ละเรื่องจะได้รับการยืนยันเป็นการเฉพาะ หลังจากทนายความตรวจสอบเนื้อหาที่ท่านส่งมาแล้ว',
          ],
          items: [
            'บริษัทต่างชาติที่มีใบแจ้งหนี้ค้างชำระ หรือถูกคู่สัญญาในไต้หวันผิดสัญญา',
            'ลูกความต่างชาติที่ต้องบริหารแนวทางคดีหรือการเจรจาในไต้หวันจากระยะไกล',
          ],
        },
        {
          heading: 'การเริ่มเรื่องขณะอยู่นอกไต้หวัน',
          paragraphs: [
            'การตรวจสอบเบื้องต้นเริ่มจากระยะไกลได้ หลังจากจัดเอกสารหลัก ลำดับเหตุการณ์ตามเวลา และโครงสร้างการมอบอำนาจไว้เรียบร้อยแล้ว',
            'ในคดีแพ่งจำนวนมาก ช่วงต้นของเรื่อง ทั้งการตรวจเอกสาร การมีหนังสือทวงถาม และการติดต่อเพื่อเจรจา ดำเนินการจากระยะไกลได้โดยอาศัยหนังสือมอบอำนาจ ส่วนจะต้องไปศาลด้วยตนเองหรือไม่ ขึ้นอยู่กับประเภทและขั้นตอนของกระบวนพิจารณา ซึ่งจะอธิบายให้ชัดเจนในการปรึกษาครั้งแรก',
            'การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี ฉบับภาษาอังกฤษสำหรับการปรึกษา: /en/taiwan-litigation-lawyer',
          ],
        },
        {
          heading: 'การเปรียบเทียบการเจรจา การฟ้องคดีแพ่ง และการบังคับคดี',
          paragraphs: [
            'งานเริ่มจากสัญญา ใบแจ้งหนี้ และข้อความที่ติดต่อกัน เพื่อประเมินความรับผิดและส่วนที่มีโอกาสได้รับชำระ จากนั้นจึงเปรียบเทียบการตกลงกันด้วยการเจรจา การฟ้องคดีแพ่ง และการบังคับคดี ก่อนเสนอแนวทางที่ควรเลือก',
            'การประเมินว่าควรเจรจาหรือไม่ ควรให้ความเห็นหลังจากพิจารณาความเสียหาย โครงสร้างความรับผิด และสภาพพยานหลักฐานที่มีอยู่แล้วเท่านั้น',
            'หลังจากนั้นจึงกำหนดว่าส่วนใดของเรื่องอยู่ในกระบวนพิจารณาคดีแพ่ง ส่วนใดต้องดำเนินตามกระบวนการอื่น และควรดำเนินไปพร้อมกันหรือไม่ ทั้งโอกาสในการเจรจา ช่องว่างของพยานหลักฐาน และความจำเป็นในการไปศาล จะได้รับการพิจารณาก่อนเลือกขั้นตอนแรก',
          ],
        },
        {
          heading: 'สิ่งที่ควรระบุในอีเมลฉบับแรก',
          paragraphs: [
            'อีเมลฉบับแรกควรระบุคู่สัญญาในไต้หวันหรือความเกี่ยวข้องอื่นกับไต้หวัน พร้อมกำหนดเวลาหากมี ส่วนเขตเวลาและการที่ท่านพบหน้านี้ได้อย่างไร ไม่จำเป็นต้องระบุ',
            'หน้านี้ไม่แสดงตัวเลข สำนักงานจะกำหนดขอบเขตงานก่อน จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน ดูได้ที่ /th/pricing',
          ],
          items: [
            'สรุปเรื่องอย่างย่อ ประเด็นตามสัญญาหรือจำนวนที่เรียกร้อง ความเกี่ยวข้องกับไต้หวัน วันสำคัญหรือกำหนดเวลาหากมี และช่องทางติดต่อท่าน',
            'ไม่บังคับ เขตเวลาหรือช่วงเวลาที่สะดวกให้ติดต่อ และท่านพบหน้านี้ได้อย่างไร',
            'เตรียมไว้สำหรับขั้นตอนถัดไปตามที่ทนายความแจ้ง ลำดับเหตุการณ์ที่เขียนไว้ สัญญา และบันทึกการโทรหรือข้อความที่ติดต่อกัน โดยยังไม่ต้องส่งต้นฉบับในอีเมลฉบับแรก',
            'เตรียมไว้สำหรับขั้นตอนถัดไป ข้อมูลระบุตัวบุคคลหรือข้อมูลบริษัทของคู่กรณี เท่าที่เรื่องจำเป็นต้องใช้',
            'เตรียมไว้สำหรับขั้นตอนถัดไป ภาพถ่าย วิดีโอ หลักฐานการชำระเงิน เอกสารของเจ้าพนักงานตำรวจ และการสอบสวน คดีในศาล หรือการเจรจาที่มีอยู่แล้ว ส่วนเวชระเบียนหรือรายการเดินบัญชีธนาคาร ให้ส่งหลังจากทนายความขอเท่านั้น',
          ],
        },
        {
          heading: 'ข้อควรระวัง',
          paragraphs: [
            'ในเรื่องที่เกี่ยวข้องกับคนต่างชาติ การส่งหมายและการควบคุมกำหนดนัดอาจใช้เวลานานกว่าที่คาดไว้',
            'อายุความตามกฎหมายและความครบถ้วนของพยานหลักฐานมีผลอย่างมากต่อการดำเนินคดีแพ่ง ท่านจึงควรแจ้งวันที่ต่าง ๆ ที่ทราบตั้งแต่ต้น หากท่านยังเก็บสัญญา ข้อความที่ติดต่อกัน หรือหลักฐานการชำระเงินไว้ โปรดแจ้งให้ทราบตั้งแต่แรก',
            'หน้านี้เป็นข้อมูลทั่วไป และไม่ได้ให้คำมั่นเรื่องผลของเรื่องหรือระยะเวลาตอบกลับ',
          ],
        },
      ],
      faqs: [
        {
          question: 'เริ่มเรื่องในไต้หวันขณะที่ยังอยู่ต่างประเทศได้หรือไม่',
          answer:
            'ได้ การตรวจสอบเบื้องต้นเริ่มจากระยะไกลได้ หลังจากจัดเอกสารหลัก ลำดับเหตุการณ์ตามเวลา และโครงสร้างการมอบอำนาจไว้เรียบร้อยแล้ว',
        },
        {
          question: 'บริษัทต่างชาติดำเนินการกับบริษัทไต้หวันโดยไม่ต้องเดินทางมาไต้หวันได้หรือไม่',
          answer:
            'ในคดีแพ่งจำนวนมาก ช่วงต้นของเรื่อง ทั้งการตรวจเอกสาร การมีหนังสือทวงถาม และการติดต่อเพื่อเจรจา ดำเนินการจากระยะไกลได้โดยอาศัยหนังสือมอบอำนาจ ส่วนจะต้องไปศาลด้วยตนเองหรือไม่ ขึ้นอยู่กับประเภทและขั้นตอนของกระบวนพิจารณา ซึ่งจะอธิบายให้ชัดเจนในการปรึกษาครั้งแรก',
        },
        {
          question: 'ใบแจ้งหนี้ค้างชำระหรือการผิดสัญญาของคู่สัญญาในไต้หวัน ดำเนินการอย่างไร',
          answer:
            'งานเริ่มจากสัญญา ใบแจ้งหนี้ และข้อความที่ติดต่อกัน เพื่อประเมินความรับผิดและส่วนที่มีโอกาสได้รับชำระ จากนั้นจึงเปรียบเทียบการตกลงกันด้วยการเจรจา การฟ้องคดีแพ่ง และการบังคับคดี ก่อนเสนอแนวทางที่ควรเลือก',
        },
        {
          question: 'ประเมินการเจรจาก่อนยื่นฟ้องได้หรือไม่',
          answer:
            'ได้ แต่ควรให้ความเห็นหลังจากพิจารณาความเสียหาย โครงสร้างความรับผิด และสภาพพยานหลักฐานที่มีอยู่แล้วเท่านั้น',
        },
        {
          question: 'สำนักงานบอกได้หรือไม่ว่าเรื่องของเราควรดำเนินต่อหรือไม่',
          answer:
            'บอกได้ ขั้นแรกคือประเมินความรับผิด พยานหลักฐาน และโอกาสที่จะได้รับชำระ เทียบกับค่าใช้จ่ายและระยะเวลาที่คาดไว้ หากเรื่องใดไม่ควรดำเนินต่อ สำนักงานจะแจ้งตามตรง',
        },
        {
          question: 'อีเมลฉบับแรกควรมีอะไรบ้าง',
          answer:
            'คำอธิบายสั้น ๆ เกี่ยวกับเรื่องที่เกิดขึ้น ความเกี่ยวข้องกับไต้หวัน กำหนดเวลาหากมี และช่องทางติดต่อท่าน ส่วนเขตเวลาและการที่ท่านพบหน้านี้ได้อย่างไร ไม่จำเป็นต้องระบุ ส่วนเลขประจำตัวต่าง ๆ รอจนกว่าทนายความจะขอก็ได้',
        },
        {
          question: 'การพูดคุยกับทนายความดำเนินการด้วยภาษาใด',
          answer:
            'ไม่ได้ ข้อมูลแนะนำส่วนนี้จัดทำเป็นภาษาไทย แต่การปรึกษากับทนายความดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี ทั้งนี้ สำนักงานไม่ได้จัดล่ามให้ ส่วนการแปลข้อความเป็นคนละเรื่องกัน ข้อความต้นฉบับที่ท่านเขียนจะถูกเก็บไว้ตามเดิมและไม่มีการแปลโดยอัตโนมัติ',
        },
      ],
    },
  },
  fil: {
    'company-setup': {
      eyebrow: 'GABAY',
      title: 'Pagtatatag ng kompanya sa Taiwan — gabay para sa mga dayuhang negosyo',
      description:
        'Gabay para sa mga dayuhang kompanya sa pagpili ng anyo ng entidad, pagsusuri sa pamumuhunan, pagpapadala ng puhunan, pagpaparehistro, at mga hakbang pagkatapos.',
      intro:
        'Ang pagpili ng anyo ng entidad, ang pagsusuri sa pamumuhunan, ang pagpapadala ng puhunan, ang pagpaparehistro, at ang mga kontrata sa pagpapatakbo ay mabuting tingnan bilang isang proseso sa ilalim ng batas ng Taiwan. Inilalahad ng pahinang ito ang pagpili sa pagitan ng subsidiary, sangay, at representative office mula sa pananaw ng dayuhang punong kompanya at mamumuhunang papasok sa Taiwan, at hindi ito nakatali sa iisang bansang pinagmulan. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sections: [
        {
          heading: 'Pagpili ng anyo ng entidad: subsidiary, sangay, o representative office',
          paragraphs: [
            'Nakasalalay sa istruktura ng pananagutan, sa mga usapin sa buwis, at sa plano ng pagpapalawak ang pagpili sa pagitan ng subsidiary, sangay, at representative office. Karaniwang ginagamit ang subsidiary para sa nagsasariling operasyon sa Taiwan, samantalang maaaring bagay ang sangay kapag tuwirang kontrolado ito ng punong kompanya.',
            'Tumutulong ang tanggapan sa mga dayuhang mamumuhunan at kompanyang nagtatatag o nagpapatakbo ng negosyo sa Taiwan: pagpili ng anyo ng entidad, paghahanda at paghahain ng mga dokumento, pagpapadala ng puhunan, mga hakbang sa bangko, pagsusuri sa lugar ng negosyo, at ang mga kahingiang natatangi sa bawat uri ng industriya.',
            'Hindi awtomatikong nagbibigay ng karapatang manirahan (居留) o work permit (permit sa trabaho, 工作許可) ang pagtatatag ng kompanya: magkahiwalay na proseso ang mga ito at sinusuri nang isa-isa.',
          ],
          items: [
            'Mga dayuhang kompanyang pumipili ng subsidiary, sangay, o representative office sa Taiwan',
            'Mga pangkat na naghahambing ng sangay at subsidiary ayon sa layuning pangkalakalan ng punong kompanya',
            'Mga kompanyang pumapasok sa mga sektor na may natatanging kahingian, gaya ng kosmetiko o lohistika',
            'Mga kliyenteng gustong tingnan nang sabay ang pagtatatag, ang usapin sa paninirahan, ang trademark, at ang mga usaping pang-empleo',
            'Mga kliyenteng nangangailangan ng tulong sa buwis at akawnting para sa entidad nila sa Taiwan',
          ],
        },
        {
          heading: 'Pagsusuri sa pamumuhunan, pagpapadala ng puhunan, at pagpaparehistro',
          paragraphs: [
            'Bago maghain, kumpirmahin muna kung kailangan ng pagsusuri sa pamumuhunan, kung magkano ang puhunan, ano ang istruktura ng mga shareholder, at saan ang lugar ng negosyo. Sa praktika, ang yugto ng pagsusuri sa pamumuhunan at ang yugto ng pagpapadala ng puhunan ang pinakamaselan sa usapin ng timing.',
            'Kailangang magtugma ang lugar ng negosyo, ang industry code, at ang tunay na modelo ng pagpapatakbo. Sa mga sektor na may natatanging kahingian, hindi sapat ang pagtatapos ng pagpaparehistro lamang.',
            'Nagkakaiba-iba ang pagkakasunod-sunod at haba ng proseso ayon sa napiling anyo ng entidad, sa mamumuhunan, sa uri ng negosyo, sa mga bangkong kasangkot, at sa mga dokumentong nasa kamay.',
          ],
        },
        {
          heading: 'Pagkatapos ng pagpaparehistro: bangko, buwis at akawnting, paninirahan, trademark, at paggawa',
          paragraphs: [
            'Dapat ding maisaayos mula sa simula ang sunod-sunod na gawain pagkatapos ng pagpaparehistro: ang mga hakbang sa bangko, ang tulong sa buwis at akawnting, ang tulong sa usapin ng paninirahan, ang trademark, at ang mga dokumento sa paggawa. Karaniwang hindi sapat ang pagpaparehistro lamang ng kompanya, dahil kaagad na sumusunod ang mga ito.',
            'Pagkatapos ng pagpaparehistro, matutulungan ng tanggapan ang mga hakbang sa paninirahan sa Taiwan na may kaugnayan sa kompanya o sa pagtatalaga ng tauhan, pati na ang mga usaping pang-akawnting at pagbubuwis na nagmumula sa pagtatatag at pagpapatakbo ng kompanya sa Taiwan.',
            'Mabuting isaalang-alang na sa yugto pa lamang ng pagtatatag ang mga kontrata, ang istruktura ng paggawa, at ang trademark, sa halip na ipagpaliban ang mga ito.',
          ],
        },
        {
          heading: 'Ang dapat nasa unang mensahe ninyo',
          paragraphs: [
            'Maaaring magsimula ang paunang pagsusuri mula sa labas ng Taiwan sa pamamagitan ng email o video; isinasaayos naman pagkatapos ng unang pag-uusap ang mga paghahaing gagawin sa Taiwan. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano, harapan man o sa video.',
            'Bersiyong Ingles para sa konsultasyon: /en/taiwan-company-setup-lawyer',
            'Walang bilang na nakasaad sa pahinang ito. Itinatakda muna ang saklaw ng trabaho, saka kinukumpirma kasama kayo ang halaga at ang paraan ng pagkuwenta bago magsimula ang trabaho; tingnan ang /fil/pricing.',
          ],
          items: [
            'Maikling buod: ang binabalak na modelo ng negosyo sa Taiwan, ang dayuhang punong kompanya o mamumuhunan, ang kaugnayan nito sa Taiwan, ang mahahalagang petsa o takdang panahon kung mayroon, at kung paano kayo maaabot',
            'Hindi kailangan: ang time zone o ang oras na nais ninyong makontak, at kung saan ninyo natagpuan ang pahinang ito',
            'Ihanda para sa susunod na yugto ayon sa bilin ng abogado: ang mga dokumento ng pagpaparehistro ng punong kompanya o mamumuhunan, ang istruktura ng mga shareholder, at ang detalye ng mga direktor — huwag ipadala ang orihinal sa unang mensahe',
            'Ihanda para sa susunod na yugto: ang binabalak na saklaw ng negosyo, ang modelo ng pagpapatakbo, ang posibleng address sa Taiwan, at ang mga kontrata sa pagpapatakbo',
            'Ihanda para sa susunod na yugto: ang inaasahang halaga ng puhunan, ang plano sa pagpapadala nito, ang plano sa pagkuha ng tauhan sa Taiwan, at ang anumang impormasyon sa permiso o kahingian ng sektor na alam na ninyo',
          ],
        },
        {
          heading: 'Mga dapat tandaan',
          paragraphs: [
            'Kung hindi tugma ang industry code sa tunay na modelo ng negosyo, maaaring maantala ang gawain sa permiso sa mga susunod na yugto. Ang pagbubukas ng bank account ay madalas ding mas matagal kaysa sa inaasahan ng kliyente, kahit tapos na ang pagpaparehistro.',
            'Maaaring mangailangan ng dagdag na pag-apruba ang mga sektor gaya ng kosmetiko, lohistika, pagkain, at platform. Kapag naiwan sa huli ang usapin ng visa at ang pagbuo ng istruktura ng paggawa, karaniwang naaantala ang takdang simula ng operasyon.',
            'Pangkalahatang impormasyon ang pahinang ito, hindi legal na pagsusuri sa isang tiyak na dokumento, at walang ipinapangakong resulta o panahon ng pagsagot.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Alin ang pipiliin: sangay o subsidiary?',
          answer:
            'Nakasalalay iyon sa istruktura ng pananagutan, sa mga usapin sa buwis, at sa plano ng pagpapalawak. Karaniwang ginagamit ang subsidiary para sa nagsasariling operasyon sa Taiwan, samantalang maaaring bagay ang sangay kapag tuwirang kontrolado ito ng punong kompanya.',
        },
        {
          question: 'Sapat na ba ang pagpaparehistro lamang ng kompanya?',
          answer:
            'Karaniwang hindi. Ang mga hakbang sa bangko, ang tulong sa buwis at akawnting, ang tulong sa usapin ng paninirahan, ang trademark, ang pag-aayos sa paggawa, at ang mga permiso ng industriya ay karaniwang sumusunod kaagad pagkatapos ng pagpaparehistro.',
        },
        {
          question: 'Maaari bang magsimula ang pagsusuri habang nasa labas pa ng Taiwan ang punong kompanya?',
          answer:
            'Oo. Maaaring magsimula ang paunang pagsusuri sa pamamagitan ng email o video. Isinasaayos pagkatapos ng unang pag-uusap ang mga paghahain sa Taiwan, ang gawain sa bangko, at ang mga hakbang na kailangang harapan.',
        },
        {
          question: 'Tumutulong ba kayo sa usapin ng paninirahan pagkatapos maitatag ang kompanya?',
          answer:
            'Oo. Tumutulong ang tanggapan sa mga hakbang sa paninirahan sa Taiwan na may kaugnayan sa kompanya o sa pagtatalaga ng tauhan. Hiwalay na proseso ito at hindi awtomatikong nagmumula sa pagtatatag ng kompanya.',
        },
        {
          question: 'Tumutulong ba kayo sa buwis at akawnting ng entidad sa Taiwan?',
          answer:
            'Oo. Tumutulong ang tanggapan sa mga usaping pang-akawnting at pagbubuwis na nagmumula sa pagtatatag at pagpapatakbo ng kompanya sa Taiwan.',
        },
        {
          question: 'Saan makikita ang bayarin?',
          answer:
            'Tingnan ang pahinang “Saklaw at bayarin” sa /fil/pricing. Walang bilang na nakasaad dito; itinatakda muna ang saklaw ng trabaho, saka kinukumpirma kasama kayo ang halaga at ang paraan ng pagkuwenta bago magsimula ang trabaho.',
        },
        {
          question: 'Anong wika ginagamit sa pag-uusap sa abogado?',
          answer:
            'Hindi. Nakasulat sa Filipino ang gabay na ito, ngunit ang konsultasyon sa abogado ay isinasagawa lamang sa Ingles, Tsino, Hapon, at Koreano. Hindi rin kami nangangako ng interpreter para sa pasalitang pag-uusap. Hiwalay dito ang nakasulat na salin: iniingatan ang orihinal na teksto gaya ng pagkakasulat ninyo, at hindi ito awtomatikong isinasalin.',
        },
      ],
    },
    'debt-collection': {
      eyebrow: 'GABAY',
      title: 'Paniningil ng hindi nabayarang utang at alitan sa kontrata sa Taiwan — gabay para sa mga dayuhang negosyo',
      description:
        'Gabay para sa mga dayuhang kompanyang may hindi nabayarang invoice o alitan sa kontrata sa Taiwan: kung paano magsimula mula sa ibang bansa at ang mga hakbang.',
      intro:
        'Para sa mga dayuhang kompanyang may hindi nabayarang invoice o nilabag na kontrata ng isang panig sa Taiwan ang pahinang ito, at para rin sa mga pandaigdigang kliyenteng kailangang pamahalaan mula sa malayo ang hakbang sa korte o sa pakikipag-ayos sa Taiwan. Pangkalahatang impormasyon ito, hindi legal na pagsusuri sa isang tiyak na dokumento. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sections: [
        {
          heading: 'Ang mga alitang saklaw ng pahinang ito',
          paragraphs: [
            'Kabilang sa pangkat na ito ang mga alitan sa kontrata, ang paghahabol ng danyos dahil sa tort o pagkakasala sa labas ng kontrata, at ang mga alitan ng mamimili. Karaniwang nagsisimula ang trabaho sa muling pagsasaayos ng pagkakasunod-sunod ng mga pangyayari at sa pagtingin sa mga dokumento at ebidensiyang nasa kamay, saka lamang pag-uusapan ang paraan ng pagharap dito.',
            'Gumagawa ang tanggapan sa ilalim ng batas ng Taiwan. Hiwalay na kinukumpirma ang saklaw ng bawat usapin matapos suriin ng abogado ang ipinadala ninyo.',
          ],
          items: [
            'Mga dayuhang kompanyang may hindi nabayarang invoice o nilabag na kontrata ng isang panig sa Taiwan',
            'Mga pandaigdigang kliyenteng kailangang pamahalaan mula sa malayo ang hakbang sa korte o sa pakikipag-ayos sa Taiwan',
          ],
        },
        {
          heading: 'Pagsisimula habang nasa labas ng Taiwan',
          paragraphs: [
            'Maaaring magsimula mula sa malayo ang paunang pagsusuri kapag naisaayos na ang mahahalagang dokumento, ang pagkakasunod-sunod ng mga petsa, at ang istruktura ng pagbibigay ng awtoridad.',
            'Sa maraming usaping sibil, ang unang yugto — ang pagsusuri ng dokumento, ang sulat ng paniningil, at ang pakikipag-ugnayan para sa pag-aayos — ay maaaring hawakan mula sa malayo sa bisa ng isang power of attorney. Ang pangangailangang humarap sa korte ay nakasalalay sa uri at yugto ng proseso; nililinaw ito sa unang konsultasyon.',
            'Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano. Bersiyong Ingles para sa konsultasyon: /en/taiwan-litigation-lawyer',
          ],
        },
        {
          heading: 'Paghahambing ng pakikipag-ayos, kasong sibil, at pagpapatupad',
          paragraphs: [
            'Nagsisimula kami sa kontrata, sa mga invoice, at sa mga palitan ng mensahe upang tayahin ang pananagutan at ang bahaging maaaring mabawi, saka ihahambing ang pag-aayos sa labas ng korte, ang kasong sibil, at ang pagpapatupad bago imungkahi ang landas na susundin.',
            'Ang pagtataya kung tama bang makipag-ayos ay dapat ibigay lamang matapos suriin ang danyos, ang istruktura ng pananagutan, at ang kasalukuyang kalagayan ng ebidensiya.',
            'Pagkatapos nito ay tinutukoy kung aling bahagi ng usapin ang nasa prosesong sibil, aling bahagi ang dapat dumaan sa ibang proseso, at kung dapat ba silang sabayan. Sinusuri ang posibilidad ng pag-aayos, ang mga puwang sa ebidensiya, at ang kahingian ng pagharap bago piliin ang unang hakbang sa proseso.',
          ],
        },
        {
          heading: 'Ang dapat nasa unang mensahe ninyo',
          paragraphs: [
            'Mabuting tukuyin sa unang mensahe ang panig sa Taiwan o ang iba pang kaugnayan ng usapin sa Taiwan, pati ang takdang panahon kung mayroon. Hindi kailangang banggitin ang time zone at kung saan ninyo natagpuan ang pahinang ito.',
            'Walang bilang na nakasaad sa pahinang ito. Itinatakda muna ang saklaw ng trabaho, saka kinukumpirma kasama kayo ang halaga at ang paraan ng pagkuwenta bago magsimula ang trabaho; tingnan ang /fil/pricing.',
          ],
          items: [
            'Maikling buod: ang usapin sa kontrata o ang inihahabol, ang kaugnayan nito sa Taiwan, ang mahahalagang petsa o takdang panahon kung mayroon, at kung paano kayo maaabot',
            'Hindi kailangan: ang time zone o ang oras na nais ninyong makontak, at kung saan ninyo natagpuan ang pahinang ito',
            'Ihanda para sa susunod na yugto ayon sa bilin ng abogado: ang nakasulat na pagkakasunod-sunod ng mga pangyayari, ang mga kontrata, at ang talaan ng tawag o chat — huwag ipadala ang orihinal sa unang mensahe',
            'Ihanda para sa susunod na yugto: ang detalye ng pagkakakilanlan ng tao o kompanyang kabilang panig, hanggang sa kailangan ng usapin',
            'Ihanda para sa susunod na yugto: mga larawan, video, resibo, materyales ng pulisya, at anumang imbestigasyon, kaso sa korte, o usapang pag-aayos na kasalukuyang umiiral; ang talaang medikal o talaan ng bangko ay ipapadala lamang kapag hiningi ng abogado',
          ],
        },
        {
          heading: 'Mga dapat tandaan',
          paragraphs: [
            'Sa mga usaping may kinalaman sa dayuhang mamamayan, ang paghahatid ng abiso at ang pagkontrol sa kalendaryo ay maaaring mas matagal kaysa sa inaasahan.',
            'Malaki ang epekto ng mga takdang panahon, kasama ang panahong itinakda ng batas para maghain ng kaso, at ng kabuuan ng ebidensiya sa isang sibil na usapin, kaya banggitin agad ang mga petsang alam ninyo. Kung nasa inyo pa ang kontrata, ang mga palitan ng mensahe, o ang patunay ng bayad, sabihin ninyo ito mula sa unang mensahe.',
            'Pangkalahatang impormasyon ang pahinang ito at walang ipinapangakong resulta o panahon ng pagsagot.',
          ],
        },
      ],
      faqs: [
        {
          question: 'Maaari bang magsimula ang usapin sa Taiwan habang nasa ibang bansa pa ako?',
          answer:
            'Oo. Maaaring magsimula mula sa malayo ang paunang pagsusuri kapag naisaayos na ang mahahalagang dokumento, ang pagkakasunod-sunod ng mga petsa, at ang istruktura ng pagbibigay ng awtoridad.',
        },
        {
          question: 'Makakakilos ba ang dayuhang kompanya laban sa kompanyang Taiwanese nang hindi pumupunta sa Taiwan?',
          answer:
            'Sa maraming usaping sibil, ang unang yugto — ang pagsusuri ng dokumento, ang sulat ng paniningil, at ang pakikipag-ugnayan para sa pag-aayos — ay maaaring hawakan mula sa malayo sa bisa ng isang power of attorney. Ang pangangailangang humarap sa korte ay nakasalalay sa uri at yugto ng proseso; nililinaw ito sa unang konsultasyon.',
        },
        {
          question: 'Paano hinahawakan ang hindi nabayarang invoice o nilabag na kontrata ng panig sa Taiwan?',
          answer:
            'Nagsisimula kami sa kontrata, sa mga invoice, at sa mga palitan ng mensahe upang tayahin ang pananagutan at ang bahaging maaaring mabawi, saka ihahambing ang pag-aayos sa labas ng korte, ang kasong sibil, at ang pagpapatupad bago imungkahi ang landas na susundin.',
        },
        {
          question: 'Matataya ba kung tama bang makipag-ayos bago maghain ng kaso?',
          answer:
            'Oo, ngunit dapat ibigay ang pagtatayang iyon matapos suriin ang danyos, ang istruktura ng pananagutan, at ang kasalukuyang kalagayan ng ebidensiya.',
        },
        {
          question: 'Masasabi ba ninyo kung sulit bang ituloy ang alitan ko?',
          answer:
            'Oo. Ang unang hakbang ay ang pagtataya sa pananagutan, sa ebidensiya, at sa maaaring mabawi, katapat ng gastos at ng panahong kakailanganin; kapag hindi sulit ituloy ang isang habol, tuwiran naming sinasabi iyon.',
        },
        {
          question: 'Ano ang dapat nasa unang mensahe?',
          answer:
            'Maikling paglalarawan ng usapin, ang kaugnayan nito sa Taiwan, ang takdang panahon kung mayroon, at kung paano kayo maaabot. Hindi kailangan ang time zone at kung saan ninyo natagpuan ang pahinang ito. Ang mga sensitibong numero ng pagkakakilanlan ay maaaring hintayin hanggang hingin ng abogado.',
        },
        {
          question: 'Anong wika ginagamit sa pag-uusap sa abogado?',
          answer:
            'Hindi. Nakasulat sa Filipino ang gabay na ito, ngunit ang konsultasyon sa abogado ay isinasagawa lamang sa Ingles, Tsino, Hapon, at Koreano. Hindi rin kami nangangako ng interpreter para sa pasalitang pag-uusap. Hiwalay dito ang nakasulat na salin: iniingatan ang orihinal na teksto gaya ng pagkakasulat ninyo, at hindi ito awtomatikong isinasalin.',
        },
      ],
    },
  },
};

/**
 * Core pages that link out to the pages above.
 *
 * The header nav is the translation lane's ten keys and does not change, so
 * these four core pages carry the only in-page route to the new guidance: the
 * home page, the services page that already describes both practice areas at
 * scope level, and the pricing and contact pages a reader lands on next.
 */
export const guidanceExtraRelated: Partial<
  Record<GuidanceCorePageKey, readonly GuidanceExtraPageKey[]>
> = {
  home: ['company-setup', 'debt-collection'],
  services: ['company-setup', 'debt-collection'],
  pricing: ['company-setup', 'debt-collection'],
  contact: ['company-setup', 'debt-collection'],
};

/** Heading of the related-links block, in each guidance language. */
export const guidanceExtraRelatedLabel: Record<GuidanceLocale, string> = {
  vi: 'Hướng dẫn liên quan',
  id: 'Panduan terkait',
  th: 'ข้อมูลแนะนำที่เกี่ยวข้อง',
  fil: 'Mga kaugnay na gabay',
};

/**
 * Short link labels. Each one is the subject of the page's own title, cut to a
 * length that reads as a list item; no label states anything the page does not.
 */
export const guidanceExtraLinkLabels: Record<
  GuidanceLocale,
  Record<GuidanceExtraPageKey, string>
> = {
  vi: {
    'company-setup': 'Thành lập công ty tại Đài Loan',
    'debt-collection': 'Thu hồi công nợ và tranh chấp hợp đồng',
  },
  id: {
    'company-setup': 'Pendirian perusahaan di Taiwan',
    'debt-collection': 'Penagihan piutang dan sengketa kontrak',
  },
  th: {
    'company-setup': 'การจัดตั้งบริษัทในไต้หวัน',
    'debt-collection': 'การติดตามหนี้ค้างชำระและข้อพิพาทตามสัญญา',
  },
  fil: {
    'company-setup': 'Pagtatatag ng kompanya sa Taiwan',
    'debt-collection': 'Paniningil ng utang at alitan sa kontrata',
  },
};

/** Label of the English landing link rendered on each page above. */
export const guidanceExtraEnglishLandingLabel: Record<GuidanceLocale, string> = {
  vi: 'Bản tiếng Anh dành cho tư vấn',
  id: 'Versi bahasa Inggris untuk konsultasi',
  th: 'ฉบับภาษาอังกฤษสำหรับการปรึกษา',
  fil: 'Bersiyong Ingles para sa konsultasyon',
};

/**
 * Single page lookup for both key families.
 *
 * Core keys stay in the translation-lane module; keys added afterwards live in
 * this file. Callers (the guidance body, its metadata, llms.txt) go through
 * here so neither module has to know about the other's key set.
 */
export function getGuidancePage(
  locale: GuidanceLocale,
  pageKey: GuidancePageKey,
): GuidancePage {
  return isGuidanceExtraPageKey(pageKey)
    ? guidanceExtraContent[locale][pageKey]
    : guidanceContent[locale].pages[pageKey];
}
