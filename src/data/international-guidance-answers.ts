/**
 * Answer-first summary blocks for the four guidance languages.
 *
 * These blocks exist so that a generative engine quoting one of the guidance
 * pages quotes a short, self-contained, accurate paragraph instead of stitching
 * one together from the body copy. Every sentence below restates a fact that is
 * already published in `guidanceContent[locale].pages[key]`; nothing here adds a
 * new legal statement, a figure, a promise, or a case outcome.
 *
 * Language contract (identical to the guidance pages themselves): the page is
 * written in the guidance language, but a consultation with an attorney is held
 * only in English, Chinese, Japanese and Korean. No answer below names the
 * guidance language at all, so no sentence can be read as an offer of a
 * consultation, interpreting, or support in Vietnamese, Indonesian, Thai or
 * Filipino.
 *
 * The content module (`international-guidance-content.ts`) is intentionally not
 * touched by this file: only its two types are imported.
 */

import type {
  GuidanceLocale,
  GuidancePageKey,
} from '@/data/international-guidance-content';

export interface GuidanceAnswer {
  /**
   * 40–80 words (Thai: 120–400 characters) restating the page in one block:
   * the direct answer, one sentence on the consultation languages.
   */
  answer: string;
  /**
   * One or two supporting links. Site-internal paths only, each one an existing
   * guidance route in the same language.
   */
  sources: string[];
}

export const guidanceAnswers: Record<
  GuidanceLocale,
  Partial<Record<GuidancePageKey, GuidanceAnswer>>
> = {
  vi: {
    services: {
      answer:
        'Văn phòng nhận sáu nhóm công việc theo pháp luật Đài Loan: đầu tư, thành lập doanh nghiệp, tranh chấp dân sự và yêu cầu bồi thường, hôn nhân, gia đình và thừa kế, tranh chấp lao động, hình sự và sở hữu trí tuệ. Phạm vi từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi. Tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/faq', '/vi/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm là văn phòng luật tại Đài Loan, thành lập năm 2016 bởi các luật sư xuất thân từ Đại học Quốc lập Đài Loan, có cơ sở tại Đài Bắc, Cao Hùng, Đài Trung và Bình Đông. Từ năm 2020 văn phòng có thêm bộ phận kế toán. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/lawyers', '/vi/services'],
    },
    lawyers: {
      answer:
        'Yêu cầu gửi từ nước ngoài do văn phòng tiếp nhận và xem xét, không tự động chuyển cho một luật sư nhất định. Luật sư Wei Tseng (曾雋崴) có tư cách hành nghề tại Đài Loan và là luật sư điều hành của văn phòng, làm việc với khách hàng Hàn Quốc, Nhật Bản và khách hàng quốc tế. Việc tư vấn được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/about', '/vi/contact'],
    },
    pricing: {
      answer:
        'Trang này không công bố bảng giá. Phạm vi công việc được xác định trước từ tóm tắt quý vị gửi, sau đó mức phí và cách tính phí được xác nhận trước khi công việc bắt đầu. Ngoài thù lao luật sư còn có thể phát sinh khoản nộp cho tòa án hoặc cơ quan nhà nước. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/contact', '/vi/faq'],
    },
    contact: {
      answer:
        'Quý vị gửi tóm tắt qua biểu mẫu liên hệ: chuyện gì đã xảy ra, quý vị cần hỗ trợ gì, vụ việc liên quan đến Đài Loan ra sao và thời hạn nếu có. Bước đầu chưa cần gửi giấy tờ tùy thân hay toàn bộ chứng cứ. Văn phòng không cam kết thời gian phản hồi. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/faq', '/vi/pricing'],
    },
    faq: {
      answer:
        'Phần hỏi đáp trả lời ở mức thông tin chung: sáu nhóm công việc, cách chuẩn bị tóm tắt, cách xác định chi phí và ý nghĩa của việc gửi yêu cầu. Yêu cầu đã gửi là yêu cầu đang chờ luật sư xem xét, không tạo lập quan hệ giữa luật sư và khách hàng. Việc tư vấn được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/contact', '/vi/services'],
    },
  },
  id: {
    services: {
      answer:
        'Kantor menangani enam kelompok perkara berdasarkan hukum Taiwan: investasi dan pendirian perusahaan di Taiwan, sengketa perdata dan ganti rugi, perkara perkawinan, keluarga, dan waris, sengketa ketenagakerjaan, perkara pidana, serta kekayaan intelektual. Lingkup setiap perkara dipastikan tersendiri setelah advokat meninjau isi pesan Anda. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/faq', '/id/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm adalah kantor advokat di Taiwan yang didirikan pada 2016 oleh para advokat lulusan Universitas Nasional Taiwan (國立臺灣大學), dengan kantor di Taipei, Kaohsiung, Taichung, dan Pingtung. Sejak 2020 kantor juga memiliki bagian akuntansi, dan kantor Taichung menangani urusan yang berkaitan dengan Korea dan Jepang. Hasil setiap perkara bergantung pada faktanya, sehingga kami tidak menjanjikan hasil. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/lawyers', '/id/services'],
    },
    lawyers: {
      answer:
        'Permintaan dari luar negeri diterima dan ditinjau oleh kantor, tanpa penugasan otomatis kepada advokat tertentu. Wei Tseng (曾雋崴) adalah advokat berizin praktik di Taiwan dan advokat pengelola di Hovering International Law Firm, yang bekerja untuk klien dari Korea, Jepang, dan klien internasional lainnya. Konsultasi di kantor dilayani dalam empat bahasa: bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea, dan itu adalah lingkup kantor secara keseluruhan.',
      sources: ['/id/about', '/id/contact'],
    },
    pricing: {
      answer:
        'Halaman ini tidak memuat daftar tarif. Lingkup pekerjaan ditetapkan lebih dulu berdasarkan ringkasan yang Anda kirim, lalu besaran dan cara penghitungan biaya dipastikan bersama Anda sebelum pekerjaan dimulai. Pertemuan dengan advokat dapat merupakan layanan berbayar, dan selain honorarium advokat dapat timbul pungutan untuk pengadilan atau instansi pemerintah. Konsultasi dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/contact', '/id/faq'],
    },
    contact: {
      answer:
        'Kirimkan ringkasan melalui formulir kontak: apa yang terjadi, bantuan apa yang Anda perlukan, apa kaitan perkara itu dengan Taiwan, dan tenggat waktu jika Anda mengetahuinya. Pada tahap awal Anda belum perlu mengirim dokumen identitas atau seluruh bukti. Kantor tidak menjanjikan waktu balasan dan tidak memastikan janji temu melalui halaman ini. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/faq', '/id/pricing'],
    },
    faq: {
      answer:
        'Bagian tanya jawab menjelaskan pada tingkat keterangan umum: enam kelompok perkara, persiapan sebelum menghubungi kantor, cara biaya ditetapkan, dan arti dari mengirim permintaan. Permintaan yang terkirim berarti permintaan yang menunggu ditinjau advokat; itu bukan nasihat hukum, bukan janji temu, dan tidak membentuk hubungan antara advokat dan klien. Konsultasi dengan advokat dilayani dalam bahasa Inggris, bahasa Tionghoa (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/contact', '/id/services'],
    },
  },
  th: {
    services: {
      answer:
        'สำนักงานรับดำเนินการงาน 6 กลุ่มภายใต้กฎหมายไต้หวัน ได้แก่ การลงทุนและการจัดตั้งบริษัทในไต้หวัน ข้อพิพาททางแพ่งและการเรียกค่าสินไหมทดแทน คดีครอบครัวและมรดก ข้อพิพาทแรงงาน คดีอาญา และทรัพย์สินทางปัญญา ส่วนขอบเขตของแต่ละเรื่องจะได้รับการยืนยันเป็นการเฉพาะ หลังจากทนายความตรวจสอบเนื้อหาที่ท่านส่งมาแล้ว การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/faq', '/th/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm เป็นสำนักงานกฎหมายในไต้หวัน ก่อตั้งขึ้นในปี 2016 โดยกลุ่มทนายความที่จบการศึกษาจากมหาวิทยาลัยแห่งชาติไต้หวัน (國立臺灣大學) มีที่ทำการที่ไทเป เกาสง ไถจง และผิงตง และมีส่วนงานบัญชีตั้งแต่ปี 2020 โดยสาขาไถจงรับงานที่เกี่ยวข้องกับเกาหลีและญี่ปุ่น การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/lawyers', '/th/services'],
    },
    lawyers: {
      answer:
        'เรื่องที่ติดต่อเข้ามาจากต่างประเทศ สำนักงานเป็นผู้รับเรื่องและตรวจสอบ ไม่มีการมอบหมายให้ทนายความคนใดคนหนึ่งโดยอัตโนมัติ Wei Tseng (曾雋崴) เป็นทนายความที่มีคุณสมบัติประกอบวิชาชีพในไต้หวัน และเป็นทนายความผู้บริหารของสำนักงาน ทำงานให้แก่ลูกความชาวเกาหลี ชาวญี่ปุ่น และลูกความต่างชาติรายอื่น การให้คำปรึกษาของสำนักงานดำเนินการใน 4 ภาษา ได้แก่ ภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/about', '/th/contact'],
    },
    pricing: {
      answer:
        'หน้านี้ไม่แสดงอัตราค่าบริการ สำนักงานจะกำหนดขอบเขตงานก่อนจากสรุปเรื่องที่ท่านส่งมา จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน การพบทนายความอาจเป็นบริการที่มีค่าใช้จ่าย และนอกจากค่าทนายความยังอาจมีค่าธรรมเนียมที่ต้องชำระต่อศาลหรือหน่วยงานของรัฐ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/contact', '/th/faq'],
    },
    contact: {
      answer:
        'โปรดส่งสรุปเรื่องผ่านแบบฟอร์มติดต่อ โดยระบุว่าเกิดอะไรขึ้น ท่านต้องการความช่วยเหลือด้านใด เรื่องนี้เกี่ยวข้องกับไต้หวันอย่างไร และมีกำหนดเวลาหรือไม่ ในขั้นแรกยังไม่จำเป็นต้องส่งเอกสารแสดงตนหรือพยานหลักฐานทั้งหมด สำนักงานไม่รับประกันระยะเวลาตอบกลับและไม่ได้ยืนยันการนัดหมายผ่านหน้านี้ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/faq', '/th/pricing'],
    },
    faq: {
      answer:
        'ส่วนคำถามที่พบบ่อยตอบไว้ในระดับข้อมูลทั่วไป ทั้งกลุ่มงาน 6 กลุ่ม การเตรียมตัวก่อนติดต่อ วิธีกำหนดค่าใช้จ่าย และความหมายของการส่งเรื่องเข้ามา เรื่องที่ส่งแล้วคือเรื่องที่รอทนายความตรวจสอบ ไม่ใช่ความเห็นทางกฎหมาย และไม่ได้ทำให้เกิดความสัมพันธ์ระหว่างทนายความกับลูกความ การให้คำปรึกษาดำเนินการเป็นภาษาอังกฤษ ภาษาจีน ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/contact', '/th/services'],
    },
  },
  fil: {
    services: {
      answer:
        'Anim na pangkat ng usapin ang hinahawakan ng tanggapan sa ilalim ng batas ng Taiwan: pamumuhunan at pagtatatag ng kompanya sa Taiwan, sibil na hidwaan at danyos, usaping pampamilya at pagmamana, hidwaan sa paggawa, usaping kriminal, at intelektuwal na ari-arian. Hiwalay na kinukumpirma ang saklaw ng bawat usapin matapos suriin ng abogado ang ipinadala ninyo. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/faq', '/fil/contact'],
    },
    about: {
      answer:
        'Ang Hovering International Law Firm ay tanggapan ng mga abogado sa Taiwan na itinatag noong 2016 ng mga abogadong nagmula sa National Taiwan University, na may mga tanggapan sa Taipei, Kaohsiung, Taichung, at Pingtung. Mula noong 2020 ay may bahagi rin itong pang-akawnting, at hinahawakan ng tanggapan sa Taichung ang gawaing may kaugnayan sa Korea at Japan. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/lawyers', '/fil/services'],
    },
    lawyers: {
      answer:
        'Ang tanggapan ang tumatanggap at sumusuri sa mga usaping mula sa ibang bansa, at walang awtomatikong pagkakatalaga sa isang tiyak na abogado. Si Wei Tseng (曾雋崴) ay abogadong kwalipikadong magpraktis sa Taiwan at ang namamahalang abogado ng tanggapan, na gumagawa para sa mga kliyenteng Koreano, Hapon, at iba pang dayuhang kliyente. Isinasagawa ang konsultasyon sa tanggapan sa apat na wika: Ingles, Tsino, Hapon, at Koreano. Saklaw ito ng buong tanggapan, hindi ng isang tiyak na abogado.',
      sources: ['/fil/about', '/fil/contact'],
    },
    pricing: {
      answer:
        'Walang listahan ng presyo sa pahinang ito. Itinatakda muna ang saklaw ng trabaho batay sa buod na ipinadala ninyo, saka kinukumpirma kasama kayo ang halaga at ang paraan ng pagkuwenta bago magsimula ang trabaho. Maaaring bayad na serbisyo ang pagharap sa abogado, at maaari ring may singil na babayaran sa korte o sa ahensiya ng pamahalaan. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/contact', '/fil/faq'],
    },
    contact: {
      answer:
        'Ipadala ang buod sa pamamagitan ng form ng kontak: kung ano ang nangyari, anong tulong ang kailangan ninyo, ano ang kaugnayan ng usapin sa Taiwan, at kung may takdang petsa na alam ninyo. Sa unang yugto ay hindi pa ninyo kailangang ipadala ang mga dokumento ng pagkakakilanlan o ang buong ebidensiya. Walang ipinapangakong panahon ng pagsagot at walang kinukumpirmang appointment dito. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/faq', '/fil/pricing'],
    },
    faq: {
      answer:
        'Sinasagot ng bahaging ito ang mga madalas itanong sa antas ng pangkalahatang impormasyon: ang anim na pangkat ng usapin, ang paghahanda bago makipag-ugnayan, ang pagtatakda ng bayarin, at ang kahulugan ng pagpapadala ng mensahe. Ang naipadalang mensahe ay naghihintay pa ng pagsusuri ng abogado at hindi bumubuo ng ugnayan ng abogado at kliyente. Isinasagawa ang konsultasyon sa abogado sa Ingles, Tsino, Hapon, at Koreano.',
      sources: ['/fil/contact', '/fil/services'],
    },
  },
};
