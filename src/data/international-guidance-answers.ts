/**
 * Answer-first summary blocks for the five guidance languages.
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
 * consultation, interpreting, or support in Vietnamese, Indonesian, Thai,
 * Filipino or Arabic.
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
        'Văn phòng nhận sáu lĩnh vực theo pháp luật Đài Loan: đầu tư và thành lập doanh nghiệp, tranh chấp dân sự và bồi thường, hôn nhân, gia đình và thừa kế, tranh chấp lao động, hình sự và sở hữu trí tuệ. Phạm vi từng vụ việc được xác nhận riêng sau khi luật sư xem xét nội dung quý vị gửi. Tư vấn chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/faq', '/vi/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm là văn phòng luật Đài Loan, thành lập năm 2016 bởi luật sư tốt nghiệp Đại học Quốc lập Đài Loan (國立臺灣大學), có văn phòng tại Đài Bắc, Cao Hùng, Đài Trung, Bình Đông. Từ 2020 có bộ phận kế toán; văn phòng Đài Trung phụ trách việc liên quan đến Hàn Quốc, Nhật Bản. Văn phòng không cam kết kết quả. Tư vấn chỉ bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/lawyers', '/vi/services'],
    },
    lawyers: {
      answer:
        'Trang này giới thiệu các luật sư, quản lý nghiệp vụ và kế toán sư hợp tác của Hovering. Luật sư Wei Tseng (曾雋崴) có tư cách hành nghề tại Đài Loan và là luật sư điều hành của văn phòng, làm việc với khách hàng Hàn Quốc, Nhật Bản và khách hàng quốc tế. Việc tư vấn của văn phòng chỉ được thực hiện bằng bốn ngôn ngữ: tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/about', '/vi/contact'],
    },
    pricing: {
      answer:
        'Trang này không công bố bảng giá. Phạm vi công việc được xác định từ tóm tắt quý vị gửi, rồi mức phí và cách tính được xác nhận trước khi bắt đầu. Buổi tư vấn có thể là dịch vụ có thu phí. Ngoài thù lao luật sư có thể có khoản nộp cho tòa án hoặc cơ quan nhà nước. Việc tư vấn chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/contact', '/vi/faq'],
    },
    contact: {
      answer:
        'Hãy gửi tóm tắt qua biểu mẫu liên hệ: chuyện gì đã xảy ra, cần hỗ trợ gì, vụ việc liên quan đến Đài Loan ra sao và thời hạn nếu có. Bước đầu chưa cần gửi giấy tờ tùy thân hay toàn bộ chứng cứ. Văn phòng không cam kết thời gian phản hồi, không xác nhận lịch hẹn qua đây. Việc tư vấn chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/faq', '/vi/pricing'],
    },
    faq: {
      answer:
        'Phần hỏi đáp trả lời ở mức thông tin chung: sáu lĩnh vực công việc, cách chuẩn bị tóm tắt, chi phí và ý nghĩa của việc gửi yêu cầu. Yêu cầu đã gửi đang chờ luật sư xem xét; không phải ý kiến pháp lý, không phải lịch hẹn, và không tạo lập quan hệ giữa luật sư và khách hàng. Việc tư vấn chỉ được thực hiện bằng tiếng Anh, tiếng Trung (中文), tiếng Nhật và tiếng Hàn.',
      sources: ['/vi/contact', '/vi/services'],
    },
  },
  id: {
    services: {
      answer:
        'Kantor menangani enam kelompok perkara berdasarkan hukum Taiwan: investasi dan pendirian perusahaan di Taiwan, sengketa perdata dan ganti rugi, perkara perkawinan, keluarga, dan waris, sengketa ketenagakerjaan, perkara pidana, serta kekayaan intelektual. Lingkup setiap perkara dipastikan tersendiri setelah advokat meninjau isi pesan Anda. Konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, bahasa Mandarin (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/faq', '/id/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm adalah kantor advokat di Taiwan yang didirikan pada 2016 oleh para advokat lulusan Universitas Nasional Taiwan (國立臺灣大學), dengan kantor di Taipei, Kaohsiung, Taichung, dan Pingtung. Sejak 2020 kantor juga memiliki bagian akuntansi, dan kantor Taichung menangani urusan yang berkaitan dengan Korea dan Jepang. Hasil setiap perkara bergantung pada faktanya, sehingga kami tidak menjanjikan hasil. Konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, bahasa Mandarin (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/lawyers', '/id/services'],
    },
    lawyers: {
      answer:
        'Halaman ini memuat profil para advokat, manajer operasional, dan akuntan mitra Hovering. Wei Tseng (曾雋崴) adalah advokat berizin praktik di Taiwan dan advokat pengelola di Hovering International Law Firm, yang bekerja untuk klien dari Korea, Jepang, dan klien internasional lainnya. Konsultasi di kantor hanya dilayani dalam empat bahasa: bahasa Inggris, bahasa Mandarin (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/about', '/id/contact'],
    },
    pricing: {
      answer:
        'Halaman ini tidak memuat daftar tarif. Lingkup pekerjaan ditetapkan lebih dulu berdasarkan ringkasan yang Anda kirim, lalu besaran dan cara penghitungan biaya dipastikan bersama Anda sebelum pekerjaan dimulai. Pertemuan dengan advokat dapat merupakan layanan berbayar, dan selain honorarium advokat dapat timbul biaya untuk pengadilan atau instansi pemerintah. Konsultasi hanya dilayani dalam bahasa Inggris, bahasa Mandarin (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/contact', '/id/faq'],
    },
    contact: {
      answer:
        'Kirimkan ringkasan melalui formulir kontak: apa yang terjadi, bantuan apa yang Anda perlukan, apa kaitan perkara itu dengan Taiwan, dan tenggat waktu jika Anda mengetahuinya. Pada tahap awal Anda belum perlu mengirim dokumen identitas atau seluruh bukti. Kantor tidak menjanjikan waktu balasan dan tidak memastikan janji temu melalui halaman ini. Konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, bahasa Mandarin (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/faq', '/id/pricing'],
    },
    faq: {
      answer:
        'Bagian tanya jawab menjelaskan pada tingkat keterangan umum: enam kelompok perkara, persiapan sebelum menghubungi kantor, cara biaya ditetapkan, dan arti dari mengirim permintaan. Permintaan yang terkirim berarti permintaan yang menunggu ditinjau advokat; itu bukan nasihat hukum, bukan janji temu, dan tidak membentuk hubungan antara advokat dan klien. Konsultasi dengan advokat hanya dilayani dalam bahasa Inggris, bahasa Mandarin (中文), bahasa Jepang, dan bahasa Korea.',
      sources: ['/id/contact', '/id/services'],
    },
  },
  th: {
    services: {
      answer:
        'สำนักงานรับดำเนินการงาน 6 กลุ่มภายใต้กฎหมายไต้หวัน ได้แก่ การลงทุนและการจัดตั้งบริษัทในไต้หวัน ข้อพิพาททางแพ่งและการเรียกค่าสินไหมทดแทน คดีการสมรส ครอบครัว และมรดก ข้อพิพาทแรงงาน คดีอาญา และทรัพย์สินทางปัญญา ส่วนขอบเขตของแต่ละเรื่องจะได้รับการยืนยันเป็นการเฉพาะ หลังจากทนายความตรวจสอบเนื้อหาที่ท่านส่งมาแล้ว การให้คำปรึกษาดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน (中文) ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/faq', '/th/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm เป็นสำนักงานกฎหมายในไต้หวัน ก่อตั้งขึ้นในปี 2016 โดยกลุ่มทนายความที่จบการศึกษาจากมหาวิทยาลัยแห่งชาติไต้หวัน (國立臺灣大學) มีที่ทำการที่ไทเป เกาสง ไถจง และผิงตง และมีส่วนงานบัญชีตั้งแต่ปี 2020 โดยสาขาไถจงรับงานที่เกี่ยวข้องกับเกาหลีและญี่ปุ่น ทั้งนี้ เราไม่รับประกันผล การให้คำปรึกษาดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน (中文) ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/lawyers', '/th/services'],
    },
    lawyers: {
      answer:
        'หน้านี้แนะนำประวัติของทนายความ ผู้จัดการงาน และหุ้นส่วนผู้สอบบัญชีของ Hovering โดย Wei Tseng (曾雋崴) เป็นทนายความที่มีคุณสมบัติประกอบวิชาชีพในไต้หวัน และเป็นทนายความผู้จัดการสำนักงาน ทำงานให้แก่ลูกความชาวเกาหลี ชาวญี่ปุ่น และลูกความต่างชาติรายอื่น การให้คำปรึกษาของสำนักงานดำเนินการเฉพาะ 4 ภาษา ได้แก่ ภาษาอังกฤษ ภาษาจีน (中文) ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/about', '/th/contact'],
    },
    pricing: {
      answer:
        'หน้านี้ไม่แสดงอัตราค่าบริการ สำนักงานจะกำหนดขอบเขตงานก่อนจากสรุปเรื่องที่ท่านส่งมา จากนั้นจำนวนเงินและวิธีคิดค่าใช้จ่ายจะได้รับการยืนยันกับท่านก่อนเริ่มงาน การปรึกษากับทนายความอาจเป็นบริการที่มีค่าใช้จ่าย และนอกจากค่าทนายความยังอาจมีค่าธรรมเนียมที่ต้องชำระต่อศาลหรือหน่วยงานของรัฐ การให้คำปรึกษาดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน (中文) ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/contact', '/th/faq'],
    },
    contact: {
      answer:
        'โปรดส่งสรุปเรื่องผ่านแบบฟอร์มติดต่อ โดยระบุว่าเกิดอะไรขึ้น ท่านต้องการความช่วยเหลือด้านใด เรื่องนี้เกี่ยวข้องกับไต้หวันอย่างไร และมีกำหนดเวลาหรือไม่ ในขั้นแรกยังไม่จำเป็นต้องส่งเอกสารแสดงตนหรือพยานหลักฐานทั้งหมด สำนักงานไม่รับประกันระยะเวลาตอบกลับและไม่ได้ยืนยันการนัดหมายผ่านหน้านี้ การให้คำปรึกษาดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน (中文) ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/faq', '/th/pricing'],
    },
    faq: {
      answer:
        'ส่วนคำถามที่พบบ่อยตอบไว้ในระดับข้อมูลทั่วไป ทั้งประเภทงาน 6 ประเภท การเตรียมตัวก่อนติดต่อ วิธีกำหนดค่าใช้จ่าย และความหมายของการส่งเรื่องเข้ามา เรื่องที่ส่งแล้วคือเรื่องที่รอทนายความตรวจสอบ ไม่ใช่ความเห็นทางกฎหมาย ไม่ใช่การนัดหมาย และไม่ได้ทำให้เกิดความสัมพันธ์ระหว่างทนายความกับลูกความ การให้คำปรึกษาดำเนินการเฉพาะภาษาอังกฤษ ภาษาจีน (中文) ภาษาญี่ปุ่น และภาษาเกาหลี',
      sources: ['/th/contact', '/th/services'],
    },
  },
  fil: {
    services: {
      answer:
        'Anim na larangan ng usapin ang hinahawakan ng tanggapan sa ilalim ng batas ng Taiwan: pamumuhunan at pagtatatag ng kompanya sa Taiwan, sibil na alitan at danyos, usaping pag-aasawa, pampamilya, at pagmamana, alitan sa paggawa, usaping kriminal, at intelektuwal na ari-arian. Hiwalay na kinukumpirma ang saklaw ng bawat usapin matapos suriin ng abogado ang ipinadala ninyo. Isinasagawa lamang sa Ingles, Tsino (中文), Hapon, at Koreano ang konsultasyon sa abogado.',
      sources: ['/fil/faq', '/fil/contact'],
    },
    about: {
      answer:
        'Ang Hovering International Law Firm ay tanggapan ng mga abogado sa Taiwan na itinatag noong 2016 ng mga abogadong nagmula sa National Taiwan University (國立臺灣大學), na may mga tanggapan sa Taipei, Kaohsiung, Taichung, at Pingtung. Mula noong 2020 ay may bahagi rin itong accounting, at hinahawakan ng tanggapan sa Taichung ang gawaing may kaugnayan sa Korea at Hapon. Wala kaming ipinapangakong resulta. Isinasagawa lamang sa Ingles, Tsino (中文), Hapon, at Koreano ang konsultasyon sa abogado.',
      sources: ['/fil/lawyers', '/fil/services'],
    },
    lawyers: {
      answer:
        'Inilalahad ng pahinang ito ang mga profile ng mga abogado, tagapamahala ng operasyon, at kasosyong CPA ng Hovering. Si Wei Tseng (曾雋崴) ay abogadang kwalipikadong magpraktis sa Taiwan at ang punong abogada ng tanggapan, na gumagawa para sa mga kliyenteng Koreano, Hapon, at iba pang dayuhang kliyente. Isinasagawa lamang sa apat na wika ang konsultasyon sa tanggapan: Ingles, Tsino (中文), Hapon, at Koreano.',
      sources: ['/fil/about', '/fil/contact'],
    },
    pricing: {
      answer:
        'Walang listahan ng presyo sa pahinang ito. Itinatakda muna ang saklaw ng trabaho batay sa buod na ipinadala ninyo, saka kinukumpirma kasama kayo ang halaga at ang paraan ng pagkuwenta bago magsimula ang trabaho. Maaaring bayad na serbisyo ang konsultasyon sa abogado, at maaari ring may singil na babayaran sa korte o sa ahensiya ng pamahalaan. Isinasagawa lamang sa Ingles, Tsino (中文), Hapon, at Koreano ang konsultasyon sa abogado.',
      sources: ['/fil/contact', '/fil/faq'],
    },
    contact: {
      answer:
        'Ipadala ang buod sa pamamagitan ng form ng katanungan: kung ano ang nangyari, anong tulong ang kailangan ninyo, ano ang kaugnayan ng usapin sa Taiwan, at kung may takdang petsa na alam ninyo. Sa unang yugto ay hindi pa ninyo kailangang ipadala ang mga dokumento ng pagkakakilanlan o ang buong ebidensiya. Walang ipinapangakong panahon ng pagsagot at walang kinukumpirmang appointment dito. Isinasagawa lamang sa Ingles, Tsino (中文), Hapon, at Koreano ang konsultasyon sa abogado.',
      sources: ['/fil/faq', '/fil/pricing'],
    },
    faq: {
      answer:
        'Sinasagot ng bahaging ito ang mga madalas itanong sa antas ng pangkalahatang impormasyon: ang anim na larangan ng usapin, ang paghahanda bago makipag-ugnayan, ang pagtatakda ng bayarin, at ang kahulugan ng pagpapadala ng mensahe. Ang naipadalang mensahe ay naghihintay pa ng pagsusuri ng abogado; hindi ito legal na payo, hindi ito appointment, at hindi ito bumubuo ng ugnayan ng abogado at kliyente. Isinasagawa lamang sa Ingles, Tsino (中文), Hapon, at Koreano ang konsultasyon sa abogado.',
      sources: ['/fil/contact', '/fil/services'],
    },
  },
  ar: {
    services: {
      answer:
        'يتولّى المكتب ستة مجالات من القضايا وفق القانون التايواني: الاستثمار وتأسيس الشركات في تايوان، والمنازعات المدنية ودعاوى التعويض، وقضايا الزواج والأسرة والميراث، ومنازعات العمل، والقضايا الجزائية، والملكية الفكرية. ويُؤكَّد نطاق كل قضية على حدة بعد مراجعة المحامي لما ترسله. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/faq', '/ar/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm مكتب محاماة في تايوان، تأسّس عام 2016 على يد محامين من خرّيجي الجامعة الوطنية التايوانية (國立臺灣大學)، وله مكاتب في تايبيه وكاوهسيونغ وتايتشونغ وبينغتونغ. ومنذ عام 2020 يضم قسمًا للمحاسبة، ويتولّى مكتب تايتشونغ الأعمال المتصلة بكوريا واليابان. ولا يقدّم المكتب أي التزام بالنتيجة. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/lawyers', '/ar/services'],
    },
    lawyers: {
      answer:
        'تعرض هذه الصفحة ملفات المحامين ومديري الأعمال والمحاسب الشريك في Hovering. والمحامية Wei Tseng (曾雋崴) محامية مؤهَّلة لمزاولة المهنة في تايوان والمحامية المديرة في المكتب، وتعمل مع العملاء من كوريا واليابان وسائر العملاء الدوليين. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/about', '/ar/contact'],
    },
    pricing: {
      answer:
        'لا تنشر هذه الصفحة قائمة أسعار. يُحدَّد نطاق العمل أولًا من الملخّص الذي ترسله، ثم تُؤكَّد معك الأتعاب وطريقة احتسابها قبل بدء العمل. وقد تكون الجلسة مع المحامي خدمة بمقابل، وقد تنشأ إلى جانب أتعاب المحاماة مبالغ تُدفَع للمحكمة أو لجهة حكومية. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/contact', '/ar/faq'],
    },
    contact: {
      answer:
        'أرسل ملخّصك عبر نموذج التواصل: ما الذي حدث، وما المساعدة التي تحتاج إليها، وما صلة القضية بتايوان، والمواعيد إن كنت تعرفها. ولا حاجة في المرحلة الأولى إلى إرسال وثائق الهوية أو ملف الأدلة كاملًا. ولا يلتزم المكتب بمدة للرد، ولا يؤكّد المواعيد عبر هذه الصفحة. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/faq', '/ar/pricing'],
    },
    faq: {
      answer:
        'يجيب قسم الأسئلة الشائعة على مستوى المعلومات العامة: مجالات العمل الستة، وكيفية تحضير الملخّص، وطريقة تحديد التكلفة، ومعنى إرسال الطلب. والطلب المُرسَل ينتظر مراجعة المحامي؛ فهو ليس رأيًا قانونيًا، وليس موعدًا مؤكّدًا، ولا يُنشئ علاقة بين المحامي والموكّل. الاستشارات تُقدَّم بالإنجليزية أو الصينية أو اليابانية أو الكورية.',
      sources: ['/ar/contact', '/ar/services'],
    },
  },
  de: {
    services: {
      answer:
        'Die Kanzlei bearbeitet sechs Tätigkeitsfelder des taiwanesischen Rechts: Investition und Gesellschaftsgründung, Zivilsachen und Schadensersatz, Ehe, Familie und Erbrecht, Arbeitsrecht, Strafsachen und geistiges Eigentum. Der Umfang jeder Sache wird gesondert bestätigt, nachdem eine Anwältin oder ein Anwalt den Inhalt geprüft hat. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/faq', '/de/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ist eine Anwaltskanzlei in Taiwan, 2016 gegründet von Absolventinnen und Absolventen der National Taiwan University (國立臺灣大學), mit Büros in Taipeh, Kaohsiung, Taichung und Pingtung. Seit 2020 gibt es eine Buchhaltungsabteilung; das Büro Taichung bearbeitet Angelegenheiten mit Bezug zu Korea und Japan. Die Kanzlei verspricht kein Ergebnis. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/lawyers', '/de/services'],
    },
    lawyers: {
      answer:
        'Diese Seite zeigt die Profile der Anwältinnen und Anwälte, der Betriebsleitung und der Wirtschaftsprüfungspartner von Hovering. Rechtsanwältin Wei Tseng (曾雋崴) ist in Taiwan zur anwaltlichen Tätigkeit zugelassen und geschäftsführende Anwältin der Kanzlei; sie arbeitet mit Mandanten aus Korea und Japan sowie mit weiteren internationalen Mandanten. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/about', '/de/contact'],
    },
    pricing: {
      answer:
        'Diese Seite veröffentlicht keine Preisliste. Zuerst wird der Arbeitsumfang aus der von Ihnen gesendeten Zusammenfassung festgelegt, danach werden Höhe und Berechnungsweise der Kosten mit Ihnen bestätigt, bevor die Arbeit beginnt. Die Beratung durch eine Anwältin oder einen Anwalt kann entgeltlich sein; neben dem Honorar können Gerichts- oder Behördenkosten entstehen. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/contact', '/de/faq'],
    },
    contact: {
      answer:
        'Senden Sie Ihre Zusammenfassung über das Kontaktformular: was geschehen ist, welche Hilfe Sie brauchen, welchen Bezug die Sache zu Taiwan hat und die Frist, falls Sie eine kennen. In der Anfangsphase müssen Sie noch keine Ausweisdokumente oder den gesamten Beweisbestand senden. Die Kanzlei verspricht keine Antwortfrist und bestätigt keinen Termin über diese Seite. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/faq', '/de/pricing'],
    },
    faq: {
      answer:
        'Dieser Teil beantwortet häufige Fragen auf der Ebene allgemeiner Angaben: die sechs Tätigkeitsfelder, die Vorbereitung vor dem Kontakt, die Festlegung der Kosten und die Bedeutung einer gesendeten Nachricht. Eine gesendete Anfrage wartet auf Prüfung durch eine Anwältin oder einen Anwalt; sie ist keine Rechtsberatung, kein Termin und begründet kein Mandatsverhältnis. Die Beratung erfolgt nur auf Englisch, Chinesisch, Japanisch und Koreanisch.',
      sources: ['/de/contact', '/de/services'],
    },
  },
  es: {
    services: {
      answer:
        'El despacho atiende seis áreas de práctica según el derecho de Taiwán: inversión y constitución de sociedades, litigios civiles y daños, matrimonio, familia y sucesiones, asuntos laborales, asuntos penales y propiedad intelectual. El alcance de cada asunto se confirma por separado después de que un abogado revise el contenido que usted envía. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',
      sources: ['/es/faq', '/es/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm es un despacho de abogados en Taiwán, fundado en 2016 por titulados de la National Taiwan University (國立臺灣大學), con oficinas en Taipéi, Kaohsiung, Taichung y Pingtung. Desde 2020 incluye un área de contabilidad, y la oficina de Taichung atiende asuntos relacionados con Corea y Japón. El despacho no promete un resultado. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',
      sources: ['/es/lawyers', '/es/services'],
    },
    lawyers: {
      answer:
        'Esta página muestra los perfiles de los abogados, de la dirección de operaciones y del auditor asociado de Hovering. La abogada Wei Tseng (曾雋崴) está habilitada para ejercer en Taiwán y es la abogada directora del despacho; trabaja con clientes de Corea, de Japón y con otros clientes internacionales. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',
      sources: ['/es/about', '/es/contact'],
    },
    pricing: {
      answer:
        'Esta página no publica una lista de precios. Primero se fija el alcance del trabajo a partir del resumen que usted envía, y después se confirman con usted la cuantía y el modo de cálculo antes de empezar. La consulta con un abogado puede ser un servicio de pago, y junto a los honorarios pueden surgir tasas judiciales o administrativas. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',
      sources: ['/es/contact', '/es/faq'],
    },
    contact: {
      answer:
        'Envíe su resumen a través del formulario de contacto: qué ocurrió, qué ayuda necesita, qué relación tiene el asunto con Taiwán y el plazo si lo conoce. En esta primera fase no hace falta enviar documentos de identidad ni el expediente completo de pruebas. El despacho no promete un plazo de respuesta y no confirma una cita a través de esta página. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',
      sources: ['/es/faq', '/es/pricing'],
    },
    faq: {
      answer:
        'Esta parte responde a preguntas frecuentes como información general: las seis áreas de práctica, la preparación antes del contacto, el modo de fijar los honorarios y el significado de enviar un mensaje. Una solicitud enviada espera la revisión de un abogado; no es asesoramiento jurídico, no es una cita y no crea una relación entre abogado y cliente. La consulta se realiza únicamente en inglés, chino, japonés y coreano.',
      sources: ['/es/contact', '/es/services'],
    },
  },
  fr: {
    services: {
      answer:
        'Le cabinet traite six domaines de travail selon le droit de Taïwan : investissement et constitution de sociétés, affaires civiles et dommages-intérêts, mariage, famille et successions, droit du travail, affaires pénales et propriété intellectuelle. L’étendue de chaque affaire est confirmée séparément après qu’une avocate ou un avocat a examiné le contenu que vous envoyez. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/faq', '/fr/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm est un cabinet d’avocats à Taïwan, fondé en 2016 par des diplômées et diplômés de la National Taiwan University (國立臺灣大學), avec des bureaux à Taipei, Kaohsiung, Taichung et Pingtung. Depuis 2020 il existe un service de comptabilité ; le bureau de Taichung traite des affaires liées à la Corée et au Japon. Le cabinet ne promet pas de résultat. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/lawyers', '/fr/services'],
    },
    lawyers: {
      answer:
        'Cette page présente les profils des avocates et avocats, de la direction des opérations et de l’expert-comptable associé de Hovering. L’avocate Wei Tseng (曾雋崴) est habilitée à exercer à Taïwan et elle est l’avocate dirigeante du cabinet ; elle travaille avec des clients de Corée, du Japon et d’autres clients internationaux. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/about', '/fr/contact'],
    },
    pricing: {
      answer:
        'Cette page ne publie pas de liste de prix. L’étendue du travail est d’abord fixée à partir du résumé que vous envoyez, puis le montant et le mode de calcul sont confirmés avec vous avant le début du travail. La consultation avec une avocate ou un avocat peut être une prestation payante ; outre les honoraires, des frais de tribunal ou d’autorité peuvent naître. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/contact', '/fr/faq'],
    },
    contact: {
      answer:
        'Envoyez votre résumé par le formulaire de contact : ce qui s’est passé, l’aide demandée, le lien avec Taïwan et le délai s’il existe. À ce stade, n’envoyez pas encore de pièces d’identité ni l’ensemble des preuves. Le cabinet ne promet pas de délai de réponse et ne confirme pas de rendez-vous par cette page. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/faq', '/fr/pricing'],
    },
    faq: {
      answer:
        'Cette partie répond à des questions fréquentes : les six domaines de travail, la préparation avant le contact, le mode de fixation des honoraires et le sens d’un message envoyé. Une demande envoyée attend l’examen d’une avocate ou d’un avocat ; ce n’est pas un avis juridique, ce n’est pas un rendez-vous, et cela ne crée pas de relation entre l’avocate ou l’avocat et le client. La consultation a lieu seulement en anglais, en chinois, en japonais et en coréen.',
      sources: ['/fr/contact', '/fr/services'],
    },
  },
  pt: {
    services: {
      answer:
        'O escritório trata seis grupos de trabalho segundo o direito de Taiwan: investimento e constituição de sociedades, litígios civis e indemnizações, casamento, família e sucessões, conflitos laborais, assuntos penais e propriedade intelectual. O âmbito de cada assunto confirma-se separadamente depois de uma advogada ou um advogado rever o conteúdo que envia. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/faq', '/pt/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm é um escritório de advogados em Taiwan, fundado em 2016 por diplomadas e diplomados da National Taiwan University (國立臺灣大學), com escritórios em Taipé, Kaohsiung, Taichung e Pingtung. Desde 2020 inclui uma área de contabilidade, e o escritório de Taichung trata assuntos relacionados com a Coreia e o Japão. O escritório não promete um resultado. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/lawyers', '/pt/services'],
    },
    lawyers: {
      answer:
        'Esta página mostra os perfis das advogadas e dos advogados, da direção de operações e do contabilista sócio de Hovering. A advogada Wei Tseng (曾雋崴) está habilitada a exercer em Taiwan e é a advogada diretora do escritório; trabalha com clientes da Coreia, do Japão e com outros clientes internacionais. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/about', '/pt/contact'],
    },
    pricing: {
      answer:
        'Esta página não publica uma lista de preços. Primeiro fixa-se o âmbito do trabalho a partir do resumo que envia, e depois confirmam-se consigo o montante e o modo de cálculo antes de começar. A consulta com uma advogada ou um advogado pode ser um serviço pago, e, para além dos honorários, podem surgir taxas judiciais ou administrativas. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/contact', '/pt/faq'],
    },
    contact: {
      answer:
        'Envie o seu resumo através do formulário de contacto: o que ocorreu, que ajuda precisa, que relação tem o assunto com Taiwan e o prazo se o conhecer. Nesta primeira fase não é preciso enviar documentos de identidade nem o processo completo de provas. O escritório não promete um prazo de resposta e não confirma uma marcação através desta página. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
      sources: ['/pt/faq', '/pt/pricing'],
    },
    faq: {
      answer:
        'Esta parte responde a perguntas frequentes no plano da informação geral: os seis grupos de trabalho, a preparação antes do contacto, o modo de fixar os honorários e o significado de enviar uma mensagem. Um pedido enviado espera a revisão de uma advogada ou de um advogado; não é parecer jurídico, não é uma marcação e não cria uma relação entre advogada ou advogado e cliente. A consulta realiza-se apenas em inglês, chinês, japonês e coreano.',
        sources: ['/pt/contact', '/pt/services'],
    },
  },
  'zh-hans': {
    services: {
      answer:
        '事务所依台湾法律处理六组工作：投资与公司设立、民事与损害赔偿、婚姻家庭与继承、劳动、刑事与知识产权。每一案件的范围在律师审阅您提交的内容后另行确认。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/faq', '/zh-hans/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm 是台湾律师事务所，2016 年由国立台湾大学（國立臺灣大學）出身的律师创立，办公室在台北、高雄、台中与屏东。自 2020 年起设有会计部门；台中办公室处理与韩国、日本有关的事项。事务所不承诺结果。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/lawyers', '/zh-hans/services'],
    },
    lawyers: {
      answer:
        '本页介绍 Hovering 的律师、运营主管与合作会计师。律师曾雋崴（Wei Tseng）具有台湾执业资格，为事务所主任律师，与来自韩国、日本及其他国家的委托人合作。事务所的咨询以英语、中文、日语和韩语四种语言进行。',
      sources: ['/zh-hans/about', '/zh-hans/contact'],
    },
    pricing: {
      answer:
        '本页不公布价目表。工作范围先根据您提交的摘要确定，费用金额与计算方式在开始工作前与您确认。与律师的咨询可以是有偿服务。除律师酬金外，还可能产生法院或行政机关费用。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/contact', '/zh-hans/faq'],
    },
    contact: {
      answer:
        '请通过联系表单提交摘要：发生了什么、需要何种协助、事项与台湾的关联，以及期限（若有）。初期不必发送身份证件或全部证据。事务所不承诺回复时限，也不通过本页确认预约。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/faq', '/zh-hans/pricing'],
    },
    faq: {
      answer:
        '问答部分在一般说明的层面回答：六组工作、联系前如何准备、费用如何确定，以及发送请求的含义。已发送的请求正在等待律师审阅；不是法律意见，不是预约，也不成立律师与委托人关系。咨询以英语、中文、日语和韩语进行。',
      sources: ['/zh-hans/contact', '/zh-hans/services'],
    },
  },
  ms: {
    services: {
      answer:
        'Firma mengendalikan enam bidang amalan menurut undang-undang Taiwan: pelaburan dan penubuhan syarikat, pertikaian sivil dan ganti rugi, perkahwinan, keluarga dan pusaka, pertikaian buruh, jenayah dan harta intelek. Skop setiap hal disahkan secara berasingan selepas peguam menyemak kandungan yang anda hantar. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/faq', '/ms/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ialah firma peguam di Taiwan, ditubuhkan pada 2016 oleh graduan National Taiwan University (國立臺灣大學), dengan pejabat di Taipei, Kaohsiung, Taichung dan Pingtung. Sejak 2020 terdapat bahagian perakaunan; pejabat Taichung mengendalikan hal yang berkaitan dengan Korea dan Jepun. Firma tidak menjanjikan hasil. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/lawyers', '/ms/services'],
    },
    lawyers: {
      answer:
        'Halaman ini memperkenalkan peguam, pengurusan operasi dan akauntan rakan kongsi Hovering. Peguam Wei Tseng (曾雋崴) mempunyai kelayakan untuk beramal di Taiwan dan ialah peguam pengarah firma; beliau bekerja dengan klien dari Korea, Jepun dan klien antarabangsa lain. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/about', '/ms/contact'],
    },
    pricing: {
      answer:
        'Halaman ini tidak menerbitkan senarai harga. Skop kerja ditetapkan dahulu daripada ringkasan yang anda hantar, kemudian jumlah dan cara pengiraan disahkan dengan anda sebelum kerja bermula. Perundingan dengan peguam boleh menjadi perkhidmatan berbayar; selain yuran, kos mahkamah atau pihak berkuasa boleh timbul. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/contact', '/ms/faq'],
    },
    contact: {
      answer:
        'Hantar ringkasan melalui borang pertanyaan: apa yang berlaku, bantuan yang diperlukan, kaitan dengan Taiwan dan tempoh jika ada. Pada peringkat ini belum perlu menghantar dokumen pengenalan atau seluruh bukti. Firma tidak menjanjikan tempoh jawapan dan tidak mengesahkan janji temu melalui halaman ini. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/faq', '/ms/pricing'],
    },
    faq: {
      answer:
        'Bahagian soalan menjawab pada tahap maklumat am: enam bidang amalan, persediaan sebelum hubungan, cara menetapkan yuran dan makna mesej yang dihantar. Permintaan yang dihantar menunggu semakan peguam; bukan nasihat undang-undang, bukan janji temu, dan tidak mewujudkan hubungan antara peguam dan klien. Perundingan hanya dijalankan dalam bahasa Inggeris, Cina, Jepun dan Korea.',
      sources: ['/ms/contact', '/ms/services'],
    },
  },
  ru: {
    services: {
      answer:
        'Фирма ведёт шесть групп работы по праву Тайваня: инвестиции и учреждение компаний, гражданские дела и возмещение вреда, брак, семья и наследство, трудовые споры, уголовные дела и интеллектуальная собственность. Объём каждого дела подтверждается отдельно после того, как адвокат рассмотрит содержание, которое Вы отправляете. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/faq', '/ru/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm — адвокатская фирма на Тайване, основанная в 2016 году выпускниками National Taiwan University (國立臺灣大學), с офисами в городах Тайбэй, Гаосюн, Тайчжун и Пиндун. С 2020 года есть бухгалтерское подразделение; офис в Тайчжуне ведёт дела, связанные с Кореей и Японией. Фирма не обещает результата. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/lawyers', '/ru/services'],
    },
    lawyers: {
      answer:
        'Эта страница представляет адвокатов, операционного менеджера и партнёра-бухгалтера Hovering. Адвокат Wei Tseng (曾雋崴) уполномочена вести адвокатскую деятельность на Тайване и возглавляет фирму; она работает с доверителями из Кореи и Японии, а также с иными иностранными доверителями. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/about', '/ru/contact'],
    },
    pricing: {
      answer:
        'Эта страница не публикует прейскурант. Объём работы сначала определяется по краткому изложению, которое Вы отправляете, затем размер и способ расчёта подтверждаются с Вами до начала работы. Консультация с адвокатом может быть возмездной услугой; помимо гонорара могут возникнуть судебные или административные расходы. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/contact', '/ru/faq'],
    },
    contact: {
      answer:
        'Отправьте краткое изложение через контактную форму: что произошло, какая помощь нужна, какая связь у дела с Тайванем и срок, если он есть. На этом этапе ещё не нужно отправлять документы, удостоверяющие личность, или все доказательства. Фирма не обещает срок ответа и не подтверждает запись через эту страницу. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/faq', '/ru/pricing'],
    },
    faq: {
      answer:
        'Этот раздел отвечает на частые вопросы на уровне общих сведений: шесть групп работы, подготовка до обращения, способ определения гонорара и смысл отправленного сообщения. Отправленный запрос ожидает рассмотрения адвокатом; это не юридическая консультация, не запись и не создаёт отношений между адвокатом и доверителем. Консультация проводится только на английском, китайском, японском и корейском языках.',
      sources: ['/ru/contact', '/ru/services'],
    },
  },
  tr: {
    services: {
      answer:
        'Büro, Tayvan hukukuna göre altı çalışma alanında iş yürütür: yatırım ve şirket kuruluşu, hukuk davaları ve tazminat, evlilik, aile ve miras, iş hukuku, ceza ve fikri mülkiyet. Her işin kapsamı, bir avukat gönderdiğiniz içeriği inceledikten sonra ayrıca doğrulanır. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/faq', '/tr/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm, 2016 yılında National Taiwan University (國立臺灣大學) mezunları tarafından kurulmuş, Taipei, Kaohsiung, Taichung ve Pingtung ofisleri olan bir Tayvan avukatlık bürosudur. 2020’den beri bir muhasebe birimi vardır; Taichung ofisi Kore ve Japonya bağlantılı işleri yürütür. Büro sonuç vaat etmez. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/lawyers', '/tr/services'],
    },
    lawyers: {
      answer:
        'Bu sayfa Hovering avukatlarının, operasyon yönetiminin ve bağlı muhasebe bürosunun profillerini gösterir. Avukat Wei Tseng (曾雋崴) Tayvan’da meslek yürütmeye yetkilidir ve büronun yönetici avukatıdır; Kore, Japonya ve diğer ülkelerden gelen müvekkillerle çalışır. Büro bir sonuç vaat etmez. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/about', '/tr/contact'],
    },
    pricing: {
      answer:
        'Bu sayfa fiyat listesi yayımlamaz. Çalışma kapsamı önce gönderdiğiniz özete göre belirlenir, sonra tutar ve hesaplanma biçimi işe başlamadan önce sizinle doğrulanır. Avukatla görüşme ücretli bir hizmet olabilir; ücretin yanında mahkeme veya idare giderleri doğabilir. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/contact', '/tr/faq'],
    },
    contact: {
      answer:
        'Özetinizi iletişim formu üzerinden gönderin: ne olduğu, hangi konuda yardıma ihtiyaç duyduğunuz, işin Tayvan ile ilişkisi ve varsa süre. Bu ilk aşamada kimlik belgesi veya tüm kanıtları göndermeniz gerekmez. Büro yanıt süresi vaat etmez ve bu sayfa üzerinden randevu doğrulamaz. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
      sources: ['/tr/faq', '/tr/pricing'],
    },
    faq: {
      answer:
        'Bu bölüm sık sorulan soruları genel bilgi düzleminde yanıtlar: altı çalışma alanı, iletişimden önce hazırlık, ücretin belirlenme biçimi ve bir ileti göndermenin anlamı. Gönderilen talep bir avukatın incelemesini bekler; hukuki görüş değildir, randevu değildir ve avukat ile müvekkil arasında ilişki kurmaz. Görüşme yalnızca İngilizce, Çince, Japonca ve Korece yapılır.',
        sources: ['/tr/contact', '/tr/services'],
    },
  },
  it: {
    services: {
      answer:
        'Lo studio tratta sei aree di attività secondo il diritto di Taiwan: investimento e costituzione di società, controversie civili e risarcimento, matrimonio, famiglia e successioni, lavoro, penale e proprietà intellettuale. L’ambito di ciascuna questione viene confermato separatamente dopo che un’avvocata o un avvocato ha esaminato il contenuto che Lei invia. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/faq', '/it/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm è uno studio legale a Taiwan, fondato nel 2016 da laureate e laureati della National Taiwan University (國立臺灣大學), con uffici a Taipei, Kaohsiung, Taichung e Pingtung. Dal 2020 esiste una sezione di contabilità; l’ufficio di Taichung tratta questioni collegate alla Corea e al Giappone. Lo studio non promette un risultato. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/lawyers', '/it/services'],
    },
    lawyers: {
      answer:
        'Questa pagina mostra i profili delle avvocate e degli avvocati, del responsabile operativo e del commercialista partner di Hovering. L’avvocata Wei Tseng (曾雋崴) è abilitata a Taiwan ed è l’avvocata dirigente dello studio; lavora con clienti dalla Corea, dal Giappone e con altri clienti internazionali. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/about', '/it/contact'],
    },
    pricing: {
      answer:
        'Questa pagina non pubblica un listino. Prima si fissa l’ambito di lavoro dal riassunto che Lei invia, poi importo e modo di calcolo dei costi si confermano con Lei prima che il lavoro inizi. La consulenza con un’avvocata o un avvocato può essere a pagamento; oltre all’onorario possono sorgere costi di tribunale o di autorità. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/contact', '/it/faq'],
    },
    contact: {
      answer:
        'Invii il riassunto tramite il modulo di contatto: che cosa è accaduto, di quale aiuto ha bisogno, quale nesso ha la questione con Taiwan e il termine, se lo conosce. Nella fase iniziale non deve ancora inviare documenti di identità o l’insieme delle prove. Lo studio non promette un termine di risposta e non conferma un appuntamento tramite questa pagina. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/faq', '/it/pricing'],
    },
    faq: {
      answer:
        'Questa parte risponde a domande frequenti al livello di indicazioni generali: le sei aree di attività, la preparazione prima del contatto, la fissazione dei costi e il significato di un messaggio inviato. Una richiesta inviata attende l’esame di un’avvocata o di un avvocato; non è un parere giuridico, non è un appuntamento e non costituisce un rapporto tra avvocata o avvocato e cliente. La consulenza si svolge soltanto in inglese, cinese, giapponese e coreano.',
      sources: ['/it/contact', '/it/services'],
    },
  },
  nl: {
    services: {
      answer:
        'Het kantoor behandelt zes praktijkgebieden van het Taiwanese recht: investering en oprichting van vennootschappen, civiele zaken en schadevergoeding, huwelijk, familie en erfrecht, arbeidsrecht, strafzaken en intellectuele eigendom. De omvang van elke zaak wordt afzonderlijk bevestigd nadat een advocaat de inhoud heeft beoordeeld die u stuurt. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/faq', '/nl/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm is een advocatenkantoor in Taiwan, in 2016 opgericht door afgestudeerden van de National Taiwan University (國立臺灣大學), met kantoren in Taipei, Kaohsiung, Taichung en Pingtung. Sinds 2020 is er een boekhoudafdeling; het kantoor Taichung behandelt zaken met betrekking tot Korea en Japan. Het kantoor belooft geen resultaat. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/lawyers', '/nl/services'],
    },
    lawyers: {
      answer:
        'Deze pagina toont de profielen van de advocaten, de bedrijfsleiding en het aangesloten accountantskantoor van Hovering. Advocaat Wei Tseng (曾雋崴) is bevoegd in Taiwan en is leidinggevend advocaat van het kantoor; zij werkt met cliënten uit Korea, Japan en andere internationale cliënten. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/about', '/nl/contact'],
    },
    pricing: {
      answer:
        'Deze pagina publiceert geen prijslijst. Eerst wordt de omvang van het werk vastgesteld uit de samenvatting die u stuurt, daarna worden hoogte en berekeningswijze van de kosten met u bevestigd voordat het werk begint. Het gesprek met een advocaat kan tegen betaling zijn; naast het honorarium kunnen gerechtelijke of bestuurlijke kosten ontstaan. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/contact', '/nl/faq'],
    },
    contact: {
      answer:
        'Stuur uw samenvatting via het contactformulier: wat er is gebeurd, welke hulp u nodig hebt, welk verband de zaak met Taiwan heeft en de termijn, als u er een kent. In de beginfase hoeft u nog geen identiteitsdocumenten of het gehele bewijs te sturen. Het kantoor belooft geen antwoordtermijn en bevestigt geen afspraak via deze pagina. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/faq', '/nl/pricing'],
    },
    faq: {
      answer:
        'Dit deel beantwoordt veelgestelde vragen op het niveau van algemene informatie: de zes praktijkgebieden, de voorbereiding vóór het contact, de vaststelling van de kosten en de betekenis van een verzonden bericht. Een verzonden verzoek wacht op beoordeling door een advocaat; het is geen juridisch advies, geen afspraak en schept geen relatie tussen advocaat en cliënt. De consultatie vindt alleen plaats in het Engels, Chinees, Japans en Koreaans.',
      sources: ['/nl/contact', '/nl/services'],
    },
  },
  pl: {
    services: {
      answer:
        'Kancelaria prowadzi sześć grup spraw według prawa Tajwanu: inwestycje i zakładanie spółek, sprawy cywilne i odszkodowania, małżeństwo, rodzina i spadki, prawo pracy, sprawy karne oraz własność intelektualną. Zakres każdej sprawy jest potwierdzany osobno po tym, jak adwokat rozpatrzy treść, którą Państwo wysyłają. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/faq', '/pl/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm jest kancelarią adwokacką na Tajwanie, założoną w 2016 r. przez absolwentów National Taiwan University (國立臺灣大學), z biurami w Tajpej, Kaohsiung, Taichung i Pingtung. Od 2020 r. istnieje dział księgowości; biuro w Taichung prowadzi sprawy związane z Koreą i Japonią. Kancelaria nie obiecuje wyniku. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/lawyers', '/pl/services'],
    },
    lawyers: {
      answer:
        'Ta strona pokazuje profile adwokatów, kierownictwa operacyjnego i partnerskiego biura rachunkowego Hovering. Adwokatka Wei Tseng (曾雋崴) jest uprawniona do wykonywania zawodu na Tajwanie i kieruje kancelarią; pracuje z klientami z Korei, Japonii i innymi klientami międzynarodowymi. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/about', '/pl/contact'],
    },
    pricing: {
      answer:
        'Ta strona nie publikuje cennika. Najpierw ustala się zakres pracy ze streszczenia, które Państwo wysyłają, a następnie wysokość i sposób obliczania kosztów potwierdza się z Państwem, zanim praca się zacznie. Rozmowa z adwokatem może być odpłatna; obok honorarium mogą powstać koszty sądowe lub urzędowe. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/contact', '/pl/faq'],
    },
    contact: {
      answer:
        'Prosimy wysłać streszczenie przez formularz kontaktowy: co się stało, jakiej pomocy potrzeba, jaki związek ma sprawa z Tajwanem oraz termin, jeśli jest znany. Na początku nie trzeba jeszcze wysyłać dokumentów tożsamości ani całości dowodów. Kancelaria nie obiecuje terminu odpowiedzi i nie potwierdza spotkania za pośrednictwem tej strony. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/faq', '/pl/pricing'],
    },
    faq: {
      answer:
        'Ta część odpowiada na częste pytania na poziomie informacji ogólnych: sześć grup spraw, przygotowanie przed kontaktem, ustalanie kosztów i znaczenie wysłanej wiadomości. Wysłany wniosek czeka na rozpatrzenie przez adwokata; nie jest poradą prawną, nie jest terminem i nie tworzy stosunku między adwokatem a klientem. Konsultacja odbywa się wyłącznie po angielsku, chińsku, japońsku i koreańsku.',
      sources: ['/pl/contact', '/pl/services'],
    },
  },
  hi: {
    services: {
      answer:
        'कार्यालय ताइवान के कानून के अनुसार छह कार्य-क्षेत्रों में सेवा देता है: निवेश और कंपनी स्थापना, दीवानी विवाद और हर्जाना, विवाह, परिवार और उत्तराधिकार, श्रम, आपराधिक तथा बौद्धिक संपदा। प्रत्येक मामले का दायरा उस सामग्री की जाँच के बाद अलग से पुष्ट होता है जिसे आप भेजते हैं। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/faq', '/hi/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ताइवान का एक कानून कार्यालय है, 2016 में National Taiwan University (國立臺灣大學) के स्नातकों द्वारा स्थापित, ताइपेई, काओश्युंग, ताइचुंग और पिंगतुंग में कार्यालयों के साथ। 2020 से लेखा विभाग है; ताइचुंग कार्यालय कोरिया और जापान से जुड़े मामलों का कार्य करता है। कार्यालय परिणाम का वादा नहीं करता। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/lawyers', '/hi/services'],
    },
    lawyers: {
      answer:
        'यह पृष्ठ Hovering के अधिवक्ताओं, संचालन प्रबंधन और साझेदार लेखाकार की प्रोफ़ाइलें दिखाता है। अधिवक्ता Wei Tseng (曾雋崴) ताइवान में अधिकृत हैं और कार्यालय की प्रबंध अधिवक्ता हैं; वह कोरिया, जापान और अन्य अंतरराष्ट्रीय मुवक्किलों के साथ कार्य करती हैं। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/about', '/hi/contact'],
    },
    pricing: {
      answer:
        'यह पृष्ठ मूल्य सूची प्रकाशित नहीं करता। पहले आपके भेजे सार से कार्य का दायरा तय होता है, फिर लागत की राशि और गणना का तरीका कार्य शुरू होने से पहले आपके साथ पुष्ट होता है। अधिवक्ता से बात सशुल्क हो सकती है; अधिवक्ता शुल्क के अतिरिक्त न्यायालय या प्राधिकरण की लागतें भी लग सकती हैं। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/contact', '/hi/faq'],
    },
    contact: {
      answer:
        'संपर्क फ़ॉर्म से अपना सार भेजें: क्या हुआ, किस सहायता की आवश्यकता है, मामले का ताइवान से क्या संबंध है और यदि ज्ञात हो तो समयसीमा। आरंभ में पहचान पत्र या संपूर्ण प्रमाण भेजना आवश्यक नहीं। कार्यालय उत्तर की समयसीमा का वादा नहीं करता और इस पृष्ठ से नियुक्ति की पुष्टि नहीं करता। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/faq', '/hi/pricing'],
    },
    faq: {
      answer:
        'यह भाग सामान्य जानकारी के स्तर पर बार-बार पूछे जाने वाले प्रश्नों का उत्तर देता है: छह कार्य-समूह, संपर्क से पहले तैयारी, लागत तय होने का तरीका और भेजे गए संदेश का अर्थ। भेजा गया अनुरोध अधिवक्ता की जाँच की प्रतीक्षा करता है; यह कानूनी राय नहीं है, नियुक्ति नहीं है और अधिवक्ता तथा मुवक्किल के बीच संबंध नहीं बनाता। परामर्श केवल अंग्रेज़ी, चीनी, जापानी और कोरियाई में होता है।',
      sources: ['/hi/contact', '/hi/services'],
    },
  },
  sv: {
    services: {
      answer:
        'Byrån arbetar inom sex områden enligt Taiwans rätt: investering och bolagsbildning, civilrättsliga tvister och skadestånd, äktenskap, familj och arv, arbetsrätt, straffrätt samt immaterialrätt. Omfattningen av varje ärende bekräftas separat efter att en advokat har granskat det innehåll du skickar. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/faq', '/sv/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm är en advokatbyrå i Taiwan, grundad 2016 av utexaminerade från National Taiwan University (國立臺灣大學), med kontor i Taipei, Kaohsiung, Taichung och Pingtung. Sedan 2020 finns en redovisningsavdelning; kontoret i Taichung behandlar ärenden med anknytning till Korea och Japan. Byrån lovar inget resultat. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/lawyers', '/sv/services'],
    },
    lawyers: {
      answer:
        'Den här sidan visar profiler för Hoverings advokater, operativa ledning och anknutna revisionsbyrå. Advokat Wei Tseng (曾雋崴) är behörig i Taiwan och är byråns ledande advokat; hon arbetar med klienter från Korea och Japan och med andra internationella klienter. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/about', '/sv/contact'],
    },
    pricing: {
      answer:
        'Den här sidan publicerar ingen prislista. Först fastställs arbetets omfattning utifrån den sammanfattning du skickar, därefter bekräftas belopp och beräkningssätt med dig innan arbetet börjar. Samtalet med en advokat kan ske mot betalning; utöver arvodet kan kostnader för domstol eller myndigheter tillkomma. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/contact', '/sv/faq'],
    },
    contact: {
      answer:
        'Skicka din sammanfattning via kontaktformuläret: vad som har hänt, vilken hjälp du behöver, vilket samband ärendet har med Taiwan och fristen, om du känner till den. I det första steget behöver du ännu inte skicka identitetshandlingar eller hela bevisningen. Byrån lovar ingen svarstid och bekräftar ingen tid via den här sidan. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/faq', '/sv/pricing'],
    },
    faq: {
      answer:
        'Den här delen besvarar vanliga frågor på en allmän nivå: de sex verksamhetsområdena, hur du förbereder dig före kontakten, hur kostnaderna fastställs och vad ett skickat meddelande betyder. En skickad begäran väntar på att granskas av en advokat; den är inte ett juridiskt yttrande, inte en tid och skapar inte ett förhållande mellan advokat och klient. Rådgivningen sker endast på engelska, kinesiska, japanska och koreanska.',
      sources: ['/sv/contact', '/sv/services'],
    },
  },
  da: {
    services: {
      answer:
        'Kontoret behandler seks praksisområder efter taiwansk ret: investering og selskabsstiftelse, civile tvister og erstatning, ægteskab, familie og arv, arbejdsret, strafferet samt immaterialret. Omfanget af hver sag bekræftes særskilt, efter at en advokat har gennemgået det indhold, du sender. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/faq', '/da/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm er et advokatkontor i Taiwan, grundlagt i 2016 af dimittender fra National Taiwan University (國立臺灣大學), med kontorer i Taipei, Kaohsiung, Taichung og Pingtung. Siden 2020 findes en regnskabsafdeling; kontoret i Taichung behandler sager med tilknytning til Korea og Japan. Kontoret lover intet resultat. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/lawyers', '/da/services'],
    },
    lawyers: {
      answer:
        'Denne side viser profiler for Hoverings advokater, den operative ledelse og det tilknyttede revisionskontor. Advokat Wei Tseng (曾雋崴) er beskikket som advokat i Taiwan og er kontorets ledende advokat; hun arbejder med klienter fra Korea, Japan og andre internationale klienter. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/about', '/da/contact'],
    },
    pricing: {
      answer:
        'Denne side offentliggør ingen prisliste. Først fastlægges arbejdets omfang ud fra det resumé, du sender, derefter bekræftes beløb og beregningsmåde med dig, før arbejdet begynder. Samtalen med en advokat kan være mod betaling; ud over honoraret kan rets- eller myndighedsomkostninger opstå. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/contact', '/da/faq'],
    },
    contact: {
      answer:
        'Send dit resumé via kontaktformularen: hvad der er sket, hvilken hjælp du har brug for, hvilken forbindelse sagen har med Taiwan, og fristen, hvis du kender den. I det første trin behøver du endnu ikke sende identitetsdokumenter eller hele beviset. Kontoret lover ingen svartid og bekræfter ingen tid via denne side. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/faq', '/da/pricing'],
    },
    faq: {
      answer:
        'Denne del besvarer hyppige spørgsmål på niveauet almindelig information: de seks praksisområder, forberedelsen før kontakten, hvordan omkostningerne fastlægges, og hvad en sendt meddelelse betyder. En sendt anmodning venter på en advokats gennemgang; den er ikke en juridisk udtalelse, ikke en tid og skaber ikke et forhold mellem advokat og klient. Rådgivningen foregår kun på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/da/contact', '/da/services'],
    },
  },
  nb: {
    services: {
      answer:
        'Kontoret behandler seks fagområder i taiwansk rett: investering og selskapsstiftelse, sivile tvister og erstatning, ekteskap, familie og arv, arbeidsrett, strafferett og immaterialrett. Omfanget i den enkelte sak bekreftes særskilt etter at en advokat har gjennomgått innholdet du sender inn. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/faq', '/nb/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm er et advokatkontor i Taiwan, grunnlagt i 2016 av jurister utdannet ved National Taiwan University (國立臺灣大學), med kontorer i Taipei, Kaohsiung, Taichung og Pingtung. Siden 2020 har kontoret også en regnskapsavdeling; kontoret i Taichung behandler saker med tilknytning til Korea og Japan. Kontoret lover ikke et resultat. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/lawyers', '/nb/services'],
    },
    lawyers: {
      answer:
        'Denne siden viser profiler for Hoverings advokater, den operative ledelsen og det tilknyttede revisjonskontoret. Advokat Wei Tseng (曾雋崴) har advokatbevilling i Taiwan og er kontorets ledende advokat; hun arbeider med klienter fra Korea og Japan og andre internasjonale klienter. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/about', '/nb/contact'],
    },
    pricing: {
      answer:
        'Denne siden publiserer ingen prisliste. Først fastsettes arbeidets omfang ut fra sammendraget du sender inn, deretter bekreftes beløp og beregningsmåte med deg før arbeidet begynner. Samtalen med en advokat kan være mot betaling; i tillegg til honoraret kan det påløpe retts- eller myndighetskostnader. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/contact', '/nb/faq'],
    },
    contact: {
      answer:
        'Send sammendraget ditt via kontaktskjemaet: hva som har skjedd, hvilken hjelp du trenger, hvilken tilknytning saken har til Taiwan, og fristen hvis du kjenner den. I første trinn trenger du ennå ikke sende identitetsdokumenter eller hele bevismaterialet. Kontoret lover ingen svartid og bekrefter ingen time via denne siden. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/faq', '/nb/pricing'],
    },
    faq: {
      answer:
        'Denne delen besvarer vanlige spørsmål på et alminnelig informasjonsnivå: de seks fagområdene, forberedelsen før kontakt, hvordan kostnadene fastsettes, og hva en innsendt melding betyr. En innsendt forespørsel venter på gjennomgang hos en advokat; den er ikke en juridisk uttalelse, ikke en time, og den skaper ikke et forhold mellom advokat og klient. Rådgivningen foregår bare på engelsk, kinesisk, japansk og koreansk.',
      sources: ['/nb/contact', '/nb/services'],
    },
  },
  fi: {
    services: {
      answer:
        'Toimisto käsittelee kuutta oikeudenalaa Taiwanin oikeuden mukaan: investoinnit ja yhtiön perustaminen, siviiliriidat ja vahingonkorvaus, avioliitto, perhe ja perintö, työ, rikosasiat sekä immateriaalioikeus. Kunkin asian laajuus vahvistetaan erikseen sen jälkeen, kun asianajaja on tarkastanut lähettämänne sisällön. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/faq', '/fi/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm on taiwanilainen asianajotoimisto, jonka National Taiwan Universityn (國立臺灣大學) valmistuneet perustivat vuonna 2016, toimistoilla Taipeissa, Kaohsiungissa, Taichungissa ja Pingtungissa. Vuodesta 2020 on kirjanpito-osasto; Taichungin toimisto käsittelee Korean ja Japanin yhteyden omaavia asioita. Toimisto ei lupaa tulosta. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/lawyers', '/fi/services'],
    },
    lawyers: {
      answer:
        'Tämä sivu esittelee Hoveringin asianajajat, operatiivisen johdon sekä yhteistyökumppanina toimivan tilitoimiston ja kertoo, mitä kukin heistä tekee. Asianajaja Wei Tseng (曾雋崴) on kelpoinen harjoittamaan asianajajan ammattia Taiwanissa ja on toimiston johtava asianajaja; hän avustaa päämiehiä Koreasta, Japanista ja muualta maailmasta. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/about', '/fi/contact'],
    },
    pricing: {
      answer:
        'Tämä sivu ei julkaise hinnastoa. Ensin työn laajuus vahvistetaan lähettämästänne yhteenvedosta, sen jälkeen määrä ja laskentatapa vahvistetaan kanssanne ennen työn alkamista. Keskustelu asianajajan kanssa voi olla maksullinen; palkkion lisäksi voi syntyä tuomioistuin- tai viranomaiskuluja. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/contact', '/fi/faq'],
    },
    contact: {
      answer:
        'Lähettäkää yhteenveto yhteydenottolomakkeella: mitä on tapahtunut, millaista apua tarvitsette, mikä yhteys asialla on Taiwaniin, ja määräaika, jos tunnette sen. Ensimmäisessä vaiheessa ei vielä tarvitse lähettää henkilöllisyysasiakirjoja eikä koko todistusaineistoa. Toimisto ei lupaa vastausaikaa eikä vahvista tapaamista tämän sivun kautta. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/faq', '/fi/pricing'],
    },
    faq: {
      answer:
        'Tämä osa vastaa usein kysyttyihin kysymyksiin yleisen tiedon tasolla: kuusi oikeudenalaa, valmistautuminen ennen yhteydenottoa, kulujen vahvistaminen ja lähetetyn viestin merkitys. Lähetetty pyyntö odottaa asianajajan tarkastusta; se ei ole oikeudellinen lausunto eikä tapaaminen, eikä se synnytä suhdetta asianajajan ja päämiehen välillä. Neuvonta tapahtuu vain englanniksi, kiinaksi, japaniksi ja koreaksi.',
      sources: ['/fi/contact', '/fi/services'],
    },
  },
  cs: {
    services: {
      answer:
        'Kancelář vede šest agend podle tchajwanského práva: investice a zakládání společností, občanskoprávní spory a náhradu škody, manželství, rodinu a dědictví, pracovněprávní spory, trestní věci a duševní vlastnictví. Rozsah každé věci se potvrzuje zvlášť poté, co advokátka nebo advokát posoudí zaslaný obsah. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/faq', '/cs/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm je tchajwanská advokátní kancelář, kterou v roce 2016 založili absolventi National Taiwan University (國立臺灣大學), s pobočkami v Tchaj-peji, Kao-siungu, Tchaj-čungu a Pching-tungu. Od roku 2020 působí i účetní úsek; pobočka v Tchaj-čungu vede věci s vazbou na Koreu a Japonsko. Kancelář neslibuje výsledek. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/lawyers', '/cs/services'],
    },
    lawyers: {
      answer:
        'Tato stránka ukazuje profily advokátek a advokátů Hovering, provozního vedení a přidruženého účetnictví a auditu. Advokátka Wei Tseng (曾雋崴) je oprávněna vykonávat advokacii na Tchaj-wanu a je řídící advokátkou kanceláře; pracuje s klienty z Koreje, z Japonska a s dalšími mezinárodními klienty. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/about', '/cs/contact'],
    },
    pricing: {
      answer:
        'Tato stránka nezveřejňuje ceník. Nejprve se z Vašeho shrnutí potvrdí rozsah práce, poté se s Vámi potvrdí výše a způsob výpočtu, dříve než práce začne. Konzultace s advokátkou nebo advokátem může být úplatná; vedle odměny mohou vzniknout soudní nebo správní poplatky. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/contact', '/cs/faq'],
    },
    contact: {
      answer:
        'Zašlete shrnutí kontaktním formulářem: co se stalo, jakou pomoc potřebujete, jakou vazbu má věc na Tchaj-wan a lhůtu, znáte-li ji. V počáteční fázi zatím není třeba zasílat doklady totožnosti ani celý důkazní materiál. Kancelář neslibuje lhůtu k odpovědi a nepotvrzuje schůzku prostřednictvím této stránky. Porada probíhá pouze anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/faq', '/cs/pricing'],
    },
    faq: {
      answer:
        'Tato část odpovídá na časté otázky na úrovni obecných informací: šest agend kanceláře, příprava před kontaktem, potvrzení nákladů a význam odeslané zprávy. Odeslaná zpráva čeká na posouzení, není právním stanoviskem ani potvrzenou schůzkou a sama o sobě nezakládá vztah mezi advokátkou nebo advokátem a klientem. Porada probíhá pouze ve čtyřech jazycích: anglicky, čínsky, japonsky a korejsky.',
      sources: ['/cs/services', '/cs/contact'],
    },
  },
  hu: {
    services: {
      answer:
        'Az iroda hat ügycsoportban jár el a tajvani jog szerint: befektetés és cégalapítás, polgári jogi jogviták és kártérítés, házasság, család és öröklés, munkaügy, büntetőügyek és szellemi tulajdon. Az egyes ügyek terjedelmét külön erősítjük meg azt követően, hogy egy ügyvéd megvizsgálta a beküldött tartalmat. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/faq', '/hu/contact'],
    },
    about: {
      answer:
        'A Hovering International Law Firm tajvani ügyvédi iroda, amelyet 2016-ban a National Taiwan University (國立臺灣大學) végzettjei alapítottak, irodákkal Tajpejben, Kaohsiungban, Tajcsungban és Pingtungban. 2020 óta könyvviteli részleg is működik; a tajcsungi iroda koreai és japán kötődésű ügyekben jár el. Az iroda nem ígér eredményt. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/lawyers', '/hu/services'],
    },
    lawyers: {
      answer:
        'Ez az oldal a Hovering ügyvédeinek, működési vezetésének és a társult könyvvizsgálónak (könyvelőiroda) a profiljait mutatja. Wei Tseng ügyvéd (曾雋崴) Tajvanon ügyvédi tevékenységre jogosult, és az iroda vezető ügyvédje; koreai, japán és további nemzetközi ügyfelekkel dolgozik. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/about', '/hu/contact'],
    },
    pricing: {
      answer:
        'Ez az oldal nem tesz közzé árlistát. Előbb az összefoglalóból rögzítjük a munka terjedelmét, majd az összeget és a számítás módját erősítjük meg Önnel, a munka megkezdése előtt. Az ügyvéddel folytatott beszélgetés díjköteles lehet; a munkadíjon felül bírósági vagy hatósági költségek merülhetnek fel. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/contact', '/hu/faq'],
    },
    contact: {
      answer:
        'Küldjön összefoglalót a kapcsolatfelvételi űrlapon: mi történt, milyen segítségre van szüksége, milyen kötődése van az ügynek Tajvanhoz, és a határidő, ha ismeri. A kezdeti szakaszban még nem kell személyazonosító okmányokat vagy a teljes bizonyítékanyagot beküldeni. Az iroda nem ígér válaszadási határidőt, és nem erősít meg időpontot ezen az oldalon keresztül. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/faq', '/hu/pricing'],
    },
    faq: {
      answer:
        'Ez a rész gyakori kérdésekre válaszol általános tájékoztatás szintjén: a hat ügycsoport, a kapcsolatfelvétel előtti előkészület, a költségek megerősítése és az elküldött üzenet jelentése. Az elküldött üzenet vizsgálatra vár, nem jogi állásfoglalás és nem megerősített időpont, és önmagában nem hoz létre ügyvéd–ügyfél viszonyt. A tanácsadás kizárólag angolul, kínaiul, japánul és koreaiul zajlik.',
      sources: ['/hu/services', '/hu/contact'],
    },
  },
  ro: {
    services: {
      answer:
        'Cabinetul acoperă șase domenii de practică din dreptul taiwanez: investiții și înființare de societăți, litigii civile și despăgubiri, căsătorie, familie și succesiuni, muncă, cauze penale și proprietate intelectuală. Întinderea fiecărui mandat se confirmă separat, după ce un avocat a examinat conținutul trimis. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/faq', '/ro/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm este un cabinet de avocatură taiwanez, înființat în 2016 de absolvenți ai National Taiwan University (國立臺灣大學), cu birouri în Taipei, Kaohsiung, Taichung și Pingtung. Din 2020 există și o secțiune de contabilitate; biroul din Taichung tratează cauze cu legătură cu Coreea și Japonia. Cabinetul nu promite un rezultat. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/lawyers', '/ro/services'],
    },
    lawyers: {
      answer:
        'Această pagină arată profilurile avocaților Hovering, ale conducerii operaționale și ale cabinetului de contabilitate asociat. Avocata Wei Tseng (曾雋崴) este autorizată în Taiwan și este avocata coordonatoare a cabinetului; lucrează cu clienți din Coreea, din Japonia și cu alți clienți internaționali. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/about', '/ro/contact'],
    },
    pricing: {
      answer:
        'Această pagină nu publică o listă de prețuri. Mai întâi se confirmă obiectul mandatului din rezumatul dumneavoastră, apoi cuantumul onorariului și modul lui de calcul se confirmă cu dumneavoastră înainte ca lucrarea să înceapă. Discuția cu un avocat poate fi contra cost; pe lângă onorariu pot apărea taxe de instanță sau ale autorităților. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/contact', '/ro/faq'],
    },
    contact: {
      answer:
        'Trimiteți un rezumat prin formularul de contact: ce s-a întâmplat, de ce ajutor aveți nevoie, ce legătură are cauza cu Taiwanul și termenul, dacă îl cunoașteți. În faza inițială nu trebuie trimise încă acte de identitate sau întregul material probator. Cabinetul nu promite un termen de răspuns și nu confirmă o programare prin această pagină. Consultanța se desfășoară numai în engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/faq', '/ro/pricing'],
    },
    faq: {
      answer:
        'Această parte răspunde la întrebări frecvente la nivel de informații generale: cele șase domenii de practică, pregătirea înainte de contactare, confirmarea costurilor și înțelesul unui mesaj trimis. Un mesaj trimis așteaptă examinarea, nu este o opinie juridică și nici o programare confirmată, iar prin el însuși nu creează o relație între avocat și client. Consultanța se desfășoară în patru limbi: engleză, chineză, japoneză și coreeană.',
      sources: ['/ro/services', '/ro/contact'],
    },
  },
  uk: {
    services: {
      answer:
        'Фірма веде шість груп за правом Тайваню: інвестиції та створення товариств, цивільні спори та відшкодування шкоди, шлюб, сім’я та спадкування, трудові спори, кримінальні справи та інтелектуальна власність. Обсяг кожної справи підтверджують окремо після того, як адвокат розгляне надісланий зміст. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/faq', '/uk/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm — тайванська адвокатська фірма, заснована 2016 року випускниками National Taiwan University (國立臺灣大學), з офісами в містах Тайбей, Гаосюн, Тайчжун і Піндун. Від 2020 року діє й бухгалтерський відділ; офіс у Тайчжуні веде справи, пов’язані з Кореєю та Японією. Фірма не обіцяє результату. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/lawyers', '/uk/services'],
    },
    lawyers: {
      answer:
        'Ця сторінка показує профілі адвокатів Hovering, операційного керівництва та партнерської бухгалтерії. Адвокатка Wei Tseng (曾雋崴) уповноважена провадити адвокатську діяльність на Тайвані та є керівною адвокаткою фірми; вона працює з клієнтами з Кореї, Японії та іншими міжнародними клієнтами. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/about', '/uk/contact'],
    },
    pricing: {
      answer:
        'Ця сторінка не оприлюднює переліку цін. Спершу з Вашого викладу підтверджують обсяг роботи, потім розмір і спосіб обчислення підтверджують із Вами до початку роботи. Розмова з адвокатом може бути платною; крім гонорару можуть виникнути судові або адміністративні збори. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/contact', '/uk/faq'],
    },
    contact: {
      answer:
        'Надішліть виклад через форму звернення: що сталося, якої допомоги потребуєте, який зв’язок справа має з Тайванем, і строк, якщо Ви його знаєте. На початковому етапі ще не потрібно надсилати документи, що посвідчують особу, чи весь доказовий матеріал. Фірма не обіцяє строку відповіді та не підтверджує зустріч через цю сторінку. Консультація відбувається лише англійською, китайською, японською та корейською.',
      sources: ['/uk/faq', '/uk/pricing'],
    },
    faq: {
      answer:
        'Ця частина відповідає на часті питання на рівні загальних відомостей: шість груп роботи, підготовка перед зверненням, підтвердження витрат і значення надісланого повідомлення. Надіслане повідомлення очікує розгляду, не є юридичним висновком і не є підтвердженою зустріччю, а саме лише надсилання не створює відносин між адвокатом і клієнтом. Консультація відбувається чотирма мовами: англійською, китайською, японською та корейською.',
      sources: ['/uk/services', '/uk/contact'],
    },
  },
  el: {
    services: {
      answer:
        'Το γραφείο χειρίζεται έξι τομείς δραστηριότητας κατά το δίκαιο της Ταϊβάν: επενδύσεις και σύσταση εταιρειών, αστικές διαφορές και αποζημίωση, γάμο, οικογένεια και κληρονομικά, εργατικές διαφορές, ποινικές υποθέσεις και διανοητική ιδιοκτησία. Το εύρος κάθε υπόθεσης επιβεβαιώνεται χωριστά, αφού δικηγόρος εξετάσει το περιεχόμενο που στείλατε. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/faq', '/el/contact'],
    },
    about: {
      answer:
        'Η Hovering International Law Firm είναι ταϊβανέζικο δικηγορικό γραφείο, που ιδρύθηκε το 2016 από αποφοίτους του National Taiwan University (國立臺灣大學), με γραφεία στην Ταϊπέι, το Καοσιούνγκ, το Ταϊτσούνγκ και το Πινγκτούνγκ. Από το 2020 λειτουργεί και λογιστικό τμήμα· το γραφείο στο Ταϊτσούνγκ χειρίζεται υποθέσεις με δεσμό προς την Κορέα και την Ιαπωνία. Το γραφείο δεν υπόσχεται αποτέλεσμα. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/lawyers', '/el/services'],
    },
    lawyers: {
      answer:
        'Η σελίδα αυτή δείχνει τα προφίλ των δικηγόρων της Hovering, της λειτουργικής διεύθυνσης και του συνεργαζόμενου λογιστικού γραφείου. Η δικηγόρος Wei Tseng (曾雋崴) έχει άδεια στην Ταϊβάν και είναι η διευθύνουσα δικηγόρος του γραφείου· συνεργάζεται με εντολείς από την Κορέα, την Ιαπωνία και άλλους διεθνείς εντολείς. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/about', '/el/contact'],
    },
    pricing: {
      answer:
        'Η σελίδα αυτή δεν δημοσιεύει τιμοκατάλογο. Πρώτα επιβεβαιώνεται το αντικείμενο της εντολής από την περίληψή σας, έπειτα το ύψος και ο τρόπος υπολογισμού επιβεβαιώνονται μαζί σας πριν αρχίσει η εργασία. Η συζήτηση με δικηγόρο μπορεί να είναι με αμοιβή· πέρα από την αμοιβή μπορεί να προκύψουν δικαστικά τέλη ή έξοδα αρχών. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/contact', '/el/faq'],
    },
    contact: {
      answer:
        'Στείλτε περίληψη με τη φόρμα επικοινωνίας: τι συνέβη, ποια βοήθεια χρειάζεστε, ποιον δεσμό έχει η υπόθεση με την Ταϊβάν και την προθεσμία, αν τη γνωρίζετε. Στο αρχικό στάδιο δεν χρειάζεται ακόμη να σταλούν έγγραφα ταυτότητας ή το σύνολο των αποδεικτικών στοιχείων. Το γραφείο δεν υπόσχεται προθεσμία απάντησης και δεν επιβεβαιώνει ραντεβού μέσω αυτής της σελίδας. Η συμβουλευτική διεξάγεται μόνο στα αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/faq', '/el/pricing'],
    },
    faq: {
      answer:
        'Το μέρος αυτό απαντά σε συχνά ερωτήματα σε επίπεδο γενικών πληροφοριών: οι έξι τομείς δραστηριότητας, η προετοιμασία πριν την επικοινωνία, η επιβεβαίωση του κόστους και η σημασία ενός μηνύματος που έχει σταλεί. Ένα μήνυμα που έχει σταλεί αναμένει εξέταση, δεν είναι νομική γνώμη ούτε επιβεβαιωμένο ραντεβού, και από μόνο του δεν δημιουργεί σχέση δικηγόρου και εντολέα. Η συμβουλευτική διεξάγεται σε τέσσερις γλώσσες: αγγλικά, κινεζικά, ιαπωνικά και κορεατικά.',
      sources: ['/el/services', '/el/contact'],
    },
  },
  he: {
    services: {
      answer:
        'המשרד מטפל בשישה תחומי עיסוק לפי דין טאיוואן: השקעה והקמת חברות, סכסוכים אזרחיים ופיצויים, נישואין, משפחה וירושה, עבודה, עניינים פליליים וקניין רוחני. היקף כל עניין מאושר בנפרד לאחר שעורכת דין או עורך דין בדקו את התוכן שנשלח. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/faq', '/he/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm הוא משרד עורכי דין טאיוואני, שנוסד בשנת 2016 בידי בוגרי National Taiwan University (國立臺灣大學), ולו סניפים בטאיפיי, בקאושיונג, בטאיצ׳ונג ובפינגטונג. משנת 2020 פועלת גם מחלקת הנהלת חשבונות; הסניף בטאיצ׳ונג מטפל בעניינים בעלי זיקה לקוריאה וליפן. המשרד אינו מבטיח תוצאה. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/lawyers', '/he/services'],
    },
    lawyers: {
      answer:
        'עמוד זה מציג את הפרופילים של עורכות ועורכי הדין של Hovering, של ההנהלה התפעולית ושל רואה החשבון השותף. עורכת הדין Wei Tseng (曾雋崴) מוסמכת בטאיוואן והיא עורכת הדין המנהלת של המשרד; היא עובדת עם לקוחות מקוריאה, מיפן ועם לקוחות בין־לאומיים נוספים. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/about', '/he/contact'],
    },
    pricing: {
      answer:
        'עמוד זה אינו מפרסם מחירון. תחילה מאושר היקף העבודה מתוך התקציר שלכם, ולאחר מכן הגובה ואופן החישוב מאושרים עמכם לפני שהעבודה מתחילה. שיחה עם עורכת דין או עורך דין עשויה להיות בתשלום; מלבד שכר הטרחה עשויות להיווצר אגרות בית משפט או הוצאות רשויות. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/contact', '/he/faq'],
    },
    contact: {
      answer:
        'שלחו תקציר בטופס יצירת הקשר: מה קרה, לאיזו עזרה אתם זקוקים, מהי זיקת העניין לטאיוואן, והמועד אם הוא ידוע לכם. בשלב הראשון אין צורך לשלוח עדיין מסמכי זיהוי או את מכלול הראיות. המשרד אינו מבטיח מועד למענה ואינו מאשר פגישה דרך עמוד זה. הייעוץ מתקיים רק באנגלית, בסינית, ביפנית ובקוריאנית.',
      sources: ['/he/faq', '/he/pricing'],
    },
    faq: {
      answer:
        'חלק זה משיב על שאלות נפוצות ברמת מידע כללי: ששת תחומי העיסוק, ההכנה לפני הפנייה, אישור העלויות ומשמעותה של הודעה שנשלחה. הודעה שנשלחה ממתינה לבדיקה, אינה חוות דעת משפטית ואינה פגישה מאושרת, ושליחתה כשלעצמה אינה יוצרת יחסי עורך דין–לקוח. הייעוץ מתקיים בארבע שפות: אנגלית, סינית, יפנית וקוריאנית.',
      sources: ['/he/services', '/he/contact'],
    },
  },
  bn: {
    services: {
      answer:
        'কার্যালয় তাইওয়ানের আইন অনুসারে ছয় কর্মক্ষেত্রে সেবা দেয়: বিনিয়োগ ও কোম্পানি গঠন, দেওয়ানি বিরোধ ও ক্ষতিপূরণ, বিবাহ, পরিবার ও উত্তরাধিকার, শ্রম, ফৌজদারি এবং মেধাস্বত্ব। প্রতিটি বিষয়ের পরিধি আপনার পাঠানো বিষয়বস্তু যাচাইয়ের পরে আলাদা করে নিশ্চিত হয়। পরামর্শ কেবল ইংরেজি, চীনা, জাপানি ও কোরীয় ভাষায় হয়।',
      sources: ['/bn/faq', '/bn/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm তাইওয়ানের একটি আইন কার্যালয়, 2016 সালে National Taiwan University (國立臺灣大學)-এর স্নাতকদের প্রতিষ্ঠিত, তাইপেই, কাওসিউং, তাইচুং ও পিংতুং-এ কার্যালয়সহ। 2020 থেকে হিসাব বিভাগ আছে; তাইচুং কার্যালয় কোরিয়া ও জাপান-সংক্রান্ত বিষয়ে কাজ করে। কার্যালয় ফলাফলের প্রতিশ্রুতি দেয় না। পরামর্শ কেবল ইংরেজি, চীনা, জাপানি ও কোরীয় ভাষায় হয়।',
      sources: ['/bn/lawyers', '/bn/services'],
    },
    lawyers: {
      answer:
        'এই পাতা Hovering-এর আইনজীবী, পরিচালনা ব্যবস্থাপনা ও অংশীদার চার্টার্ড অ্যাকাউন্ট্যান্টের পরিচিতি দেখায়। আইনজীবী Wei Tseng (曾雋崴) তাইওয়ানে অনুমতিপ্রাপ্ত এবং কার্যালয়ের প্রধান আইনজীবী; তিনি কোরিয়া, জাপান ও অন্য আন্তর্জাতিক মক্কেলদের সঙ্গে কাজ করেন। আইনজীবীর সঙ্গে পরামর্শ কেবল ইংরেজি, চীনা (中文), জাপানি ও কোরীয় ভাষায় হয়; অন্য কোনো ভাষায় পরামর্শ দেওয়া হয় না।',
      sources: ['/bn/about', '/bn/contact'],
    },
    pricing: {
      answer:
        'এই পাতা মূল্যতালিকা প্রকাশ করে না। আগে আপনার পাঠানো সার থেকে কাজের পরিধি ঠিক হয়, তারপর ব্যয়ের অঙ্ক ও হিসাবের পদ্ধতি কাজ শুরুর আগে আপনার সঙ্গে নিশ্চিত হয়। আইনজীবীর সঙ্গে কথা মূল্য পরিশোধসাপেক্ষ হতে পারে; আইনজীবীর পারিশ্রমিকের বাইরে আদালত বা কর্তৃপক্ষের খরচও লাগতে পারে। পরামর্শ কেবল ইংরেজি, চীনা, জাপানি ও কোরীয় ভাষায় হয়।',
      sources: ['/bn/contact', '/bn/faq'],
    },
    contact: {
      answer:
        'যোগাযোগ ফর্ম থেকে আপনার সার পাঠান: কী ঘটেছে, কী সহায়তা দরকার, বিষয়টির তাইওয়ানের সঙ্গে কী যোগ এবং জানা থাকলে সময়সীমা। শুরুতে পরিচয়পত্র বা সম্পূর্ণ প্রমাণ পাঠানো আবশ্যক নয়। কার্যালয় উত্তরের সময়সীমার প্রতিশ্রুতি দেয় না এবং এই পাতা থেকে সাক্ষাৎ নির্ধারণ নিশ্চিত করে না। পরামর্শ কেবল ইংরেজি, চীনা, জাপানি ও কোরীয় ভাষায় হয়।',
      sources: ['/bn/faq', '/bn/pricing'],
    },
    faq: {
      answer:
        'এই অংশ সাধারণ তথ্যের স্তরে বারবার জিজ্ঞাস্য প্রশ্নের উত্তর দেয়: ছয় কর্মদল, যোগাযোগের আগে প্রস্তুতি, ব্যয় ঠিক হওয়ার পদ্ধতি এবং পাঠানো বার্তার অর্থ। পাঠানো অনুরোধ আইনজীবীর যাচাইয়ের অপেক্ষা করে; এটি আইনি মতামত নয়, সাক্ষাৎ নির্ধারণ নয় এবং আইনজীবী ও মক্কেলের সম্পর্ক তৈরি করে না। পরামর্শ কেবল ইংরেজি, চীনা, জাপানি ও কোরীয় ভাষায় হয়।',
      sources: ['/bn/contact', '/bn/services'],
    },
  },
  ur: {
    services: {
      answer:
        'دفتر تائیوان کے قانون کے مطابق چھ کام کے شعبوں میں خدمت دیتا ہے: سرمایہ کاری اور کمپنی کا قیام، دیوانی تنازعات اور تلافی، شادی، خاندان اور وراثت، ملازمت، فوجداری اور دانشورانہ ملکیت۔ ہر معاملے کے دائرے کی تصدیق اس مواد کی جانچ کے بعد الگ سے ہوتی ہے جو آپ بھیجتے ہیں۔ مشورہ صرف انگریزی، چینی، جاپانی اور کوریائی میں ہوتا ہے۔',
      sources: ['/ur/faq', '/ur/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm تائیوان کا ایک قانون دفتر ہے، 2016 میں National Taiwan University (國立臺灣大學) کے فارغ التحصیل وکلا نے قائم کیا، تائپے، کاؤشنگ، تائچونگ اور پنگٹنگ میں دفاتر کے ساتھ۔ 2020 سے اکاؤنٹنگ شعبہ ہے؛ تائچونگ دفتر کوریا اور جاپان سے جڑے معاملات کا کام کرتا ہے۔ دفتر نتیجے کا وعدہ نہیں کرتا۔ مشورہ صرف انگریزی، چینی، جاپانی اور کوریائی میں ہوتا ہے۔',
      sources: ['/ur/lawyers', '/ur/services'],
    },
    lawyers: {
      answer:
        'یہ صفحہ Hovering کے وکلا، آپریشنز کی قیادت اور شراکت دار محاسب کی پروفائلز دکھاتا ہے۔ وکیلہ Wei Tseng (曾雋崴) تائیوان میں مجاز ہیں اور دفتر کی منتظم وکیلہ ہیں؛ وہ کوریا، جاپان اور دیگر بین الاقوامی موکلوں کے ساتھ کام کرتی ہیں۔ مشورہ صرف انگریزی، چینی، جاپانی اور کوریائی میں ہوتا ہے۔',
      sources: ['/ur/about', '/ur/contact'],
    },
    pricing: {
      answer:
        'یہ صفحہ نرخ نامہ شائع نہیں کرتا۔ پہلے آپ کے بھیجے خلاصے سے کام کا دائرہ طے ہوتا ہے، پھر لاگت کی رقم اور حساب کا طریقہ کام شروع ہونے سے پہلے آپ کے ساتھ تصدیق ہوتی ہے۔ وکیل سے بات معاوضے والی خدمت ہو سکتی ہے؛ وکیل کی فیس کے علاوہ عدالت یا ادارے کی لاگتیں بھی لگ سکتی ہیں۔ مشورہ صرف انگریزی، چینی، جاپانی اور کوریائی میں ہوتا ہے۔',
      sources: ['/ur/contact', '/ur/faq'],
    },
    contact: {
      answer:
        'رابطہ فارم سے اپنا خلاصہ بھیجیں: کیا ہوا، کس مدد کی ضرورت ہے، معاملے کا تائیوان سے کیا تعلق ہے اور اگر معلوم ہو تو مہلت۔ شروع میں شناختی دستاویز یا مکمل ثبوت بھیجنا ضروری نہیں۔ دفتر جواب کی مدت کا وعدہ نہیں کرتا اور اس صفحے سے ملاقات کا وقت تصدیق نہیں کرتا۔ مشورہ صرف انگریزی، چینی، جاپانی اور کوریائی میں ہوتا ہے۔',
      sources: ['/ur/faq', '/ur/pricing'],
    },
    faq: {
      answer:
        'یہ حصہ عام معلومات کی سطح پر بار بار پوچھے جانے والے سوالات کا جواب دیتا ہے: چھ کام کے شعبے، رابطے سے پہلے تیاری، لاگت طے ہونے کا طریقہ اور بھیجے گئے پیغام کا مطلب۔ بھیجی گئی درخواست وکیل کی جانچ کا انتظار کرتی ہے؛ یہ قانونی رائے نہیں ہے، ملاقات کا وقت نہیں ہے اور وکیل اور موکل کے درمیان تعلق نہیں بناتا۔ مشورہ صرف انگریزی، چینی، جاپانی اور کوریائی میں ہوتا ہے۔',
      sources: ['/ur/contact', '/ur/services'],
    },
  },
  fa: {
    services: {
      answer:
        'دفتر شش زمینه را طبق قانون تایوان می‌پذیرد: سرمایه‌گذاری و تأسیس شرکت در تایوان، دعاوی مدنی و خسارت، ازدواج و خانواده و ارث، اختلافات کار، پرونده‌های کیفری، و مالکیت فکری. محدودهٔ هر پرونده پس از بررسی وکیل نسبت به آنچه می‌فرستید جداگانه تأیید می‌شود. مشاوره فقط به انگلیسی، چینی، ژاپنی و کره‌ای انجام می‌شود.',
      sources: ['/fa/faq', '/fa/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm دفتر وکالتی در تایوان است، در سال 2016 به دست فارغ‌التحصیلان National Taiwan University (國立臺灣大學) تأسیس شد، با دفاتر در تایپه، کائوشیونگ، تایچونگ و پینگتونگ. از سال 2020 بخش حسابداری دارد؛ دفتر تایچونگ امور مرتبط با کره و ژاپن را می‌پذیرد. دفتر هیچ تعهد به نتیجه نمی‌دهد. مشاوره فقط به انگلیسی، چینی، ژاپنی و کره‌ای انجام می‌شود.',
      sources: ['/fa/lawyers', '/fa/services'],
    },
    lawyers: {
      answer:
        'این صفحه نمایهٔ وکلا، مدیریت عملیات و حسابدار شریک Hovering را نشان می‌دهد. وکیل Wei Tseng (曾雋崴) مجاز به وکالت در تایوان و وکیلِ مدیر دفتر است؛ با موکلان کره، ژاپن و دیگر موکلان بین‌المللی کار می‌کند. مشاوره فقط به انگلیسی، چینی، ژاپنی و کره‌ای انجام می‌شود.',
      sources: ['/fa/about', '/fa/contact'],
    },
    pricing: {
      answer:
        'این صفحه فهرست نرخ ندارد. نخست محدودهٔ کار از خلاصه‌ای که می‌فرستید تعیین می‌شود، سپس مبلغ و نحوهٔ محاسبه پیش از شروع کار با شما تأیید می‌شود. مشاوره با وکیل ممکن است خدمتی با هزینه باشد و در کنار حق‌الوکاله ممکن است مبلغ دادگاه یا مرجع دولتی پیش آید. مشاوره فقط به انگلیسی، چینی، ژاپنی و کره‌ای انجام می‌شود.',
      sources: ['/fa/contact', '/fa/faq'],
    },
    contact: {
      answer:
        'خلاصه را از فرم تماس بفرستید: چه رخ داده، چه کمکی می‌خواهید، موضوع چه ربطی به تایوان دارد، و مهلت را اگر می‌دانید. در مرحلهٔ نخست نیازی به فرستادن مدارک هویت یا همهٔ ادله نیست. دفتر مهلت پاسخ وعده نمی‌دهد و وقت ملاقات را از این صفحه تأیید نمی‌کند. مشاوره فقط به انگلیسی، چینی، ژاپنی و کره‌ای انجام می‌شود.',
      sources: ['/fa/faq', '/fa/pricing'],
    },
    faq: {
      answer:
        'بخش پرسش‌ها در سطح اطلاعات عمومی پاسخ می‌دهد: شش زمینهٔ کار، نحوهٔ تهیهٔ خلاصه، تعیین هزینه، و معنای درخواست فرستاده‌شده. درخواست فرستاده‌شده در انتظار بررسی وکیل است؛ نظر حقوقی نیست، وقت ملاقات نیست، و رابطه میان وکیل و موکل پدید نمی‌آورد. مشاوره فقط به انگلیسی، چینی، ژاپنی و کره‌ای انجام می‌شود.',
      sources: ['/fa/contact', '/fa/services'],
    },
  },
  my: {
    services: {
      answer:
        'ရုံးသည် ထိုင်ဝမ်ဥပဒေအရ လုပ်ငန်းနယ်ပယ် ခြောက်ခုကို ဆောင်ရွက်သည်။ ရင်းနှီးမြှုပ်နှံမှုနှင့် ကုမ္ပဏီတည်ထောင်ခြင်း၊ တရားမမှုနှင့် လျော်ကြေး၊ အိမ်ထောင်ရေး၊ မိသားစုနှင့် အမွေဆက်ခံရေး၊ အလုပ်သမား၊ ရာဇဝတ်မှုနှင့် ဉာဏပစ္စည်းမူပိုင်ခွင့်တို့ ဖြစ်သည်။ အမှုတစ်ခုချင်း၏ အကျယ်အဝန်းကို သင်ပေးပို့သော အကြောင်းအရာကို ရှေ့နေ စစ်ဆေးပြီးမှ သီးခြား အတည်ပြုသည်။ တိုင်ပင်ဆွေးနွေးမှုကို အင်္ဂလိပ်၊ တရုတ် (中文)၊ ဂျပန်နှင့် ကိုရီးယားဖြင့်သာ ဆောင်ရွက်သည်။',
      sources: ['/my/faq', '/my/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm သည် ထိုင်ဝမ်ရှိ ဥပဒေရုံးဖြစ်ပြီး 2016 ခုနှစ်တွင် National Taiwan University (國立臺灣大學) ဘွဲ့ရများက တည်ထောင်ခဲ့သည်။ တိုင်ပေ၊ ကောင်းရှုံ၊ ထိုင်ချုံနှင့် ပင်တုံတို့တွင် ရုံးခွဲများ ရှိသည်။ 2020 ခုနှစ်မှစ၍ စာရင်းကိုင်ဌာန ရှိပြီး ထိုင်ချုံရုံးသည် ကိုရီးယားနှင့် ဂျပန်ဆက်စပ်ကိစ္စများကို ဆောင်ရွက်သည်။ ရလဒ်ကို အာမမခံပါ။ တိုင်ပင်ဆွေးနွေးမှုကို အင်္ဂလိပ်၊ တရုတ် (中文)၊ ဂျပန်နှင့် ကိုရီးယားဖြင့်သာ ဆောင်ရွက်သည်။',
      sources: ['/my/lawyers', '/my/services'],
    },
    lawyers: {
      answer:
        'ဤစာမျက်နှာသည် Hovering ၏ ရှေ့နေများ၊ လုပ်ငန်းစီမံခန့်ခွဲမှုနှင့် မိတ်ဖက် လက်မှတ်ရစာရင်းကိုင်၏ ကိုယ်ရေးအချက်အလက်များကို ပြသည်။ ရှေ့နေမ Wei Tseng (曾雋崴) သည် ထိုင်ဝမ်တွင် လုပ်ကိုင်ခွင့်ရှိပြီး ရုံး၏ အမှုဆောင်ရှေ့နေမဖြစ်သည်။ သူမသည် ကိုရီးယား၊ ဂျပန်နှင့် အခြား နိုင်ငံတကာ အမှုသည်များနှင့် လုပ်ကိုင်သည်။ တိုင်ပင်ဆွေးနွေးမှုကို အင်္ဂလိပ်၊ တရုတ် (中文)၊ ဂျပန်နှင့် ကိုရီးယားဖြင့်သာ ဆောင်ရွက်သည်။',
      sources: ['/my/about', '/my/contact'],
    },
    pricing: {
      answer:
        'ဤစာမျက်နှာတွင် နှုန်းထားစာရင်း မဖော်ပြပါ။ ဦးစွာ သင်ပေးပို့သော အကျဉ်းချုပ်မှ လုပ်ငန်းအကျယ်အဝန်းကို သတ်မှတ်ပြီး ပမာဏနှင့် တွက်ချက်ပုံကို အလုပ်မစမီ သင်နှင့် အတည်ပြုသည်။ ရှေ့နေနှင့် တိုင်ပင်ဆွေးနွေးမှုသည် အခကြေးငွေပေးရသော ဝန်ဆောင်မှု ဖြစ်နိုင်သည်။ ရှေ့နေကြေးအပြင် တရားရုံး သို့မဟုတ် အစိုးရအဖွဲ့ ကုန်ကျစရိတ်များ ရှိနိုင်သည်။ တိုင်ပင်ဆွေးနွေးမှုကို အင်္ဂလိပ်၊ တရုတ် (中文)၊ ဂျပန်နှင့် ကိုရီးယားဖြင့်သာ ဆောင်ရွက်သည်။',
      sources: ['/my/contact', '/my/faq'],
    },
    contact: {
      answer:
        'ဆက်သွယ်ပုံစံမှ အကျဉ်းချုပ် ပေးပို့ပါ။ ဖြစ်ပျက်သည်၊ မည်သည့်အကူအညီ လိုသည်၊ အမှု၏ ထိုင်ဝမ်နှင့် ဆက်စပ်မှုနှင့် သိပါက သတ်မှတ်ကာလကို ဖော်ပြပါ။ အစောပိုင်းအဆင့်တွင် ကိုယ်ပိုင်အထောက်အထား သို့မဟုတ် သက်သေအားလုံးကို မပေးပို့ရသေးပါ။ ရုံးသည် ပြန်ကြားချိန်ကို အာမမခံသည့်အပြင် ဤစာမျက်နှာမှ ချိန်းဆိုမှုကို အတည်မပြုပါ။ တိုင်ပင်ဆွေးနွေးမှုကို အင်္ဂလိပ်၊ တရုတ် (中文)၊ ဂျပန်နှင့် ကိုရီးယားဖြင့်သာ ဆောင်ရွက်သည်။',
      sources: ['/my/faq', '/my/pricing'],
    },
    faq: {
      answer:
        'မကြာခဏမေးသော မေးခွန်းအပိုင်းသည် အထွေထွေအချက်အလက် အဆင့်တွင် ဖြေသည်။ လုပ်ငန်းနယ်ပယ် ခြောက်ခု၊ ဆက်သွယ်မီ ပြင်ဆင်ပုံ၊ ကုန်ကျစရိတ် သတ်မှတ်ပုံနှင့် ပေးပို့ပြီးသော စာ၏ အဓိပ္ပာယ်တို့ ပါဝင်သည်။ ပေးပို့ပြီးသော တောင်းဆိုချက်သည် ရှေ့နေ စစ်ဆေးရန် စောင့်ဆိုင်းသည်။ ဥပဒေအကြံဉာဏ် မဟုတ်၊ ချိန်းဆိုမှု မဟုတ်၊ ရှေ့နေနှင့်အမှုသည် ဆက်ဆံရေး မဖြစ်ပေါ်ပါ။ တိုင်ပင်ဆွေးနွေးမှုကို အင်္ဂလိပ်၊ တရုတ် (中文)၊ ဂျပန်နှင့် ကိုရီးယားဖြင့်သာ ဆောင်ရွက်သည်။',
      sources: ['/my/contact', '/my/services'],
    },
  },
  ta: {
    services: {
      answer:
        'அலுவலகம் தைவான் சட்டத்தின்படி ஆறு பணிப் பிரிவுகளில் சேவை செய்கிறது: முதலீடு மற்றும் நிறுவனம் அமைத்தல், உரிமையியல் தகராறுகள் மற்றும் இழப்பீடு, திருமணம், குடும்பம் மற்றும் வாரிசுரிமை, தொழிலாளர், குற்றவியல் மற்றும் அறிவுசார் சொத்து. ஒவ்வொரு வழக்கின் எல்லையும் நீங்கள் அனுப்பும் உள்ளடக்கத்தை வழக்கறிஞர் பரிசீலித்த பிறகு தனித்தனியாக உறுதிப்படுகிறது. ஆலோசனை ஆங்கிலம், சீனம், ஜப்பானியம் மற்றும் கொரிய மொழி ஆகியவற்றிலேயே நடைபெறும்.',
      sources: ['/ta/faq', '/ta/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm தைவானின் ஒரு சட்ட அலுவலகம்; 2016-இல் National Taiwan University (國立臺灣大學) பட்டதாரிகளால் நிறுவப்பட்டது; தைப்பே, காவோசியூங், தைச்சுங் மற்றும் பிங்துங் அலுவலகங்களுடன். 2020 முதல் கணக்கியல் பிரிவு உள்ளது; தைச்சுங் அலுவலகம் கொரியா மற்றும் ஜப்பான் தொடர்பான வழக்குகளைக் கையாளுகிறது. அலுவலகம் முடிவை உறுதி செய்வதில்லை. ஆலோசனை ஆங்கிலம், சீனம், ஜப்பானியம் மற்றும் கொரிய மொழி ஆகியவற்றிலேயே நடைபெறும்.',
      sources: ['/ta/lawyers', '/ta/services'],
    },
    lawyers: {
      answer:
        'இந்தப் பக்கம் Hovering வழக்கறிஞர்கள், செயல்பாட்டு நிர்வாகம் மற்றும் கூட்டாளர் பட்டயக் கணக்காளரின் சுயவிவரங்களைக் காட்டுகிறது. வழக்கறிஞர் Wei Tseng (曾雋崴) தைவானில் தகுதி பெற்றவர் மற்றும் அலுவலகத்தின் நிர்வாக வழக்கறிஞர்; அவர் கொரியா, ஜப்பான் மற்றும் பிற பன்னாட்டு வாடிக்கையாளர்களுடன் பணி செய்கிறார். வழக்கறிஞருடனான ஆலோசனை ஆங்கிலம், சீனம் (中文), ஜப்பானியம் மற்றும் கொரிய மொழி ஆகியவற்றில் மட்டுமே நடைபெறும்; பிற மொழிகளில் ஆலோசனை வழங்கப்படுவதில்லை.',
      sources: ['/ta/about', '/ta/contact'],
    },
    pricing: {
      answer:
        'இந்தப் பக்கம் விலைப் பட்டியலை வெளியிடவில்லை. முதலில் நீங்கள் அனுப்பும் சுருக்கத்திலிருந்து பணி எல்லை தீர்மானிக்கப்படுகிறது; பிறகு செலவின் தொகையும் கணக்கீட்டு முறையும் பணி தொடங்கும் முன் உங்களுடன் உறுதிப்படுத்தப்படும். வழக்கறிஞருடனான உரையாடல் கட்டணச் சேவையாக இருக்கலாம்; வழக்கறிஞர் கட்டணத்திற்கு அப்பால் நீதிமன்றம் அல்லது அதிகார அமைப்பின் செலவுகளும் வரலாம். ஆலோசனை ஆங்கிலம், சீனம், ஜப்பானியம் மற்றும் கொரிய மொழி ஆகியவற்றிலேயே நடைபெறும்.',
      sources: ['/ta/contact', '/ta/faq'],
    },
    contact: {
      answer:
        'தொடர்புப் படிவத்தின் வழியாக உங்கள் சுருக்கத்தை அனுப்புங்கள்: என்ன நடந்தது, எந்த உதவி தேவை, வழக்கிற்கும் தைவானுக்கும் உள்ள தொடர்பு, தெரிந்தால் காலக்கெடு. தொடக்கத்தில் அடையாள ஆவணங்கள் அல்லது முழுச் சான்றையும் அனுப்ப வேண்டியதில்லை. அலுவலகம் பதிலளிக்கும் காலக்கெடுவை வாக்குறுதி அளிக்கவில்லை; இந்தப் பக்கத்திலிருந்து சந்திப்பையும் உறுதிப்படுத்தவில்லை. ஆலோசனை ஆங்கிலம், சீனம், ஜப்பானியம் மற்றும் கொரிய மொழி ஆகியவற்றிலேயே நடைபெறும்.',
      sources: ['/ta/faq', '/ta/pricing'],
    },
    faq: {
      answer:
        'இந்தப் பகுதி பொதுவான தகவல் மட்டத்தில் அடிக்கடி கேட்கப்படும் கேள்விகளுக்குப் பதில் தருகிறது: ஆறு பணிக் குழுக்கள், தொடர்புக்கு முன் தயாரிப்பு, செலவு தீர்மானிக்கப்படும் முறை மற்றும் அனுப்பிய செய்தியின் பொருள். அனுப்பிய கோரிக்கை வழக்கறிஞரின் பரிசீலனைக்காகக் காத்திருக்கிறது; இது சட்டக் கருத்து அல்ல, உறுதிப்படுத்தப்பட்ட சந்திப்பு அல்ல, வழக்கறிஞருக்கும் வாடிக்கையாளருக்கும் இடையே வழக்கு ஏற்பு உறவையும் உருவாக்காது. ஆலோசனை ஆங்கிலம், சீனம், ஜப்பானியம் மற்றும் கொரிய மொழி ஆகியவற்றிலேயே நடைபெறும்.',
      sources: ['/ta/contact', '/ta/services'],
    },
  },
  ne: {
    services: {
      answer:
        'फर्म ताइवानको कानुनअनुसार छ वटा कार्यक्षेत्रमा सेवा दिन्छ: लगानी र कम्पनी स्थापना, देवानी विवाद र क्षतिपूर्ति, विवाह, परिवार र उत्तराधिकार, श्रम, फौजदारी तथा बौद्धिक सम्पत्ति। प्रत्येक मुद्दाको दायरा तपाईंले पठाएको सामग्रीको जाँचपछि छुट्टै पुष्टि हुन्छ। परामर्श अङ्ग्रेजी, चिनियाँ, जापानी र कोरियालीमा मात्र हुन्छ।',
      sources: ['/ne/faq', '/ne/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ताइवानको कानुन फर्म हो, 2016 मा National Taiwan University (國立臺灣大學) का स्नातकहरूले स्थापना गरेको, ताइपेई, काओस्युङ, ताइचुङ र पिङतुङमा कार्यालयसहित। 2020 देखि लेखा विभाग छ; ताइचुङ कार्यालय कोरिया र जापानसँग जोडिएका मुद्दा हेर्छ। फर्म नतिजाको वाचा गर्दैन। परामर्श अङ्ग्रेजी, चिनियाँ, जापानी र कोरियालीमा मात्र हुन्छ।',
      sources: ['/ne/lawyers', '/ne/services'],
    },
    lawyers: {
      answer:
        'यो पृष्ठ Hovering का अधिवक्ता, सञ्चालन नेतृत्व र साझेदार चार्टर्ड एकाउन्टेन्टका प्रोफाइल देखाउँछ। अधिवक्ता Wei Tseng (曾雋崴) ताइवानमा व्यवसाय गर्न अधिकृत हुनुहुन्छ र फर्मकी प्रबन्ध अधिवक्ता हुनुहुन्छ; उहाँ कोरिया, जापान र अन्य अन्तर्राष्ट्रिय पक्षकारसँग काम गर्नुहुन्छ। परामर्श अङ्ग्रेजी, चिनियाँ, जापानी र कोरियालीमा मात्र हुन्छ।',
      sources: ['/ne/about', '/ne/contact'],
    },
    pricing: {
      answer:
        'यो पृष्ठ दरसूची प्रकाशित गर्दैन। पहिले तपाईंले पठाएको सारबाट कामको दायरा तय हुन्छ, त्यसपछि लागतको रकम र गणनाको तरिका काम सुरु हुनुअघि तपाईंसँग पुष्टि हुन्छ। अधिवक्तासँगको कुराकानी दस्तुर लाग्ने सेवा हुन सक्छ; अधिवक्ता शुल्कका अतिरिक्त अदालत वा निकायका लागत पनि लाग्न सक्छन्। परामर्श अङ्ग्रेजी, चिनियाँ, जापानी र कोरियालीमा मात्र हुन्छ।',
      sources: ['/ne/contact', '/ne/faq'],
    },
    contact: {
      answer:
        'सम्पर्क फारमबाट आफ्नो सार पठाउनुहोस्: के भयो, कुन सहयोग चाहिन्छ, मुद्दाको ताइवानसँग के सम्बन्ध छ र थाहा भए समयसीमा। सुरुमा परिचयपत्र वा पूरा प्रमाण पठाउन पर्दैन। फर्म जवाफको समयसीमाको वाचा गर्दैन र यस पृष्ठबाट निर्धारित भेट पुष्टि गर्दैन। परामर्श अङ्ग्रेजी, चिनियाँ, जापानी र कोरियालीमा मात्र हुन्छ।',
      sources: ['/ne/faq', '/ne/pricing'],
    },
    faq: {
      answer:
        'यो भाग सामान्य जानकारीको तहमा बारम्बार सोधिने प्रश्नको उत्तर दिन्छ: छ वटा कार्यसमूह, सम्पर्कअघिको तयारी, लागत तय हुने तरिका र पठाइएको सन्देशको अर्थ। पठाइएको अनुरोध अधिवक्ताको जाँचको प्रतीक्षा गर्छ; यो कानुनी राय होइन, निर्धारित भेट होइन र अधिवक्ता तथा पक्षकारबीचको सम्बन्ध बन्दैन। परामर्श अङ्ग्रेजी, चिनियाँ, जापानी र कोरियालीमा मात्र हुन्छ।',
      sources: ['/ne/contact', '/ne/services'],
    },
  },
  km: {
    services: {
      answer:
        'ការិយាល័យទទួលធ្វើការងារ ៦ ក្រុមតាមច្បាប់តៃវ៉ាន់ គឺការវិនិយោគនិងការបង្កើតក្រុមហ៊ុននៅតៃវ៉ាន់ វិវាទរដ្ឋប្បវេណីនិងសំណងការខូចខាត អាពាហ៍ពិពាហ៍ គ្រួសារ និងមរតក វិវាទពលកម្ម សំណុំរឿងព្រហ្មទណ្ឌ និងកម្មសិទ្ធិបញ្ញា។ វិសាលភាពនៃរឿងនីមួយៗត្រូវបានបញ្ជាក់ជាលក្ខណៈដាច់ដោយឡែក បន្ទាប់ពីមេធាវីពិនិត្យខ្លឹមសារដែលលោកអ្នកផ្ញើ។ ការពិគ្រោះយោបល់ធ្វើឡើងតែជាភាសាអង់គ្លេស ភាសាចិន (中文) ភាសាជប៉ុន និងភាសាកូរ៉េ។',
      sources: ['/km/faq', '/km/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm គឺជាការិយាល័យមេធាវីនៅតៃវ៉ាន់ បង្កើតឆ្នាំ 2016 ដោយមេធាវីដែលសិក្សានៅ National Taiwan University (國立臺灣大學) មានទីតាំងនៅតៃប៉ិ កៅស៊ុង តៃជុង និងពីងតុង ហើយមានផ្នែកគណនេយ្យតាំងពីឆ្នាំ 2020។ សាខាតៃជុងទទួលរឿងពាក់ព័ន្ធកូរ៉េ និងជប៉ុន។ យើងមិនធានាលទ្ធផលឡើយ។ ការពិគ្រោះយោបល់ធ្វើឡើងតែជាភាសាអង់គ្លេស ភាសាចិន (中文) ភាសាជប៉ុន និងភាសាកូរ៉េ។',
      sources: ['/km/lawyers', '/km/services'],
    },
    lawyers: {
      answer:
        'ទំព័រនេះណែនាំប្រវត្ដិមេធាវី អ្នកគ្រប់គ្រងប្រតិបត្ដិ និងគណនេយ្យករសាធារណៈដៃគូនៃ Hovering។ មេធាវីស្ដ្រី Wei Tseng (曾雋崴) មានសិទ្ធិអនុវត្ដវិជ្ជាជីវៈនៅតៃវ៉ាន់ និងជាមេធាវីគ្រប់គ្រងនៃការិយាល័យ។ លោកស្រីធ្វើការជាមួយអតិថិជនពីកូរ៉េ ពីជប៉ុន និងអតិថិជនអន្ដរជាតិផ្សេងទៀត។ ការពិគ្រោះយោបល់ធ្វើឡើងតែជាភាសាអង់គ្លេស ភាសាចិន (中文) ភាសាជប៉ុន និងភាសាកូរ៉េ។',
      sources: ['/km/about', '/km/contact'],
    },
    pricing: {
      answer:
        'ទំព័រនេះមិនបង្ហាញអត្រាថ្លៃសេវាទេ។ ការិយាល័យកំណត់វិសាលភាពការងារជាមុនពីសេចក្ដីសង្ខេបដែលលោកអ្នកផ្ញើ បន្ទាប់មកចំនួននិងវិធីគិតថ្លៃនឹងត្រូវបានបញ្ជាក់មុនចាប់ផ្ដើមការងារ។ ការពិគ្រោះយោបល់ជាមួយមេធាវីអាចជាសេវាដែលមានថ្លៃ ហើយក្រៅពីថ្លៃមេធាវីអាចមានថ្លៃតុលាការ ឬអាជ្ញាធរ។ ការពិគ្រោះយោបល់ធ្វើឡើងតែជាភាសាអង់គ្លេស ភាសាចិន (中文) ភាសាជប៉ុន និងភាសាកូរ៉េ។',
      sources: ['/km/contact', '/km/faq'],
    },
    contact: {
      answer:
        'សូមផ្ញើសេចក្ដីសង្ខេបតាមទម្រង់ទំនាក់ទំនង ដោយបញ្ជាក់ថាអ្វីបានកើតឡើង លោកអ្នកត្រូវការជំនួយអ្វី រឿងនេះពាក់ព័ន្ធតៃវ៉ាន់យ៉ាងណា និងកាលកំណត់បើមាន។ នៅដំណាក់កាលដំបូងមិនចាំបាច់ផ្ញើឯកសារអត្ដសញ្ញាណ ឬភស្ដុតាងទាំងអស់ទេ។ ការិយាល័យមិនសន្យារយៈពេលឆ្លើយតប និងមិនបញ្ជាក់ការណាត់ជួបតាមទំព័រនេះ។ ការពិគ្រោះយោបល់ធ្វើឡើងតែជាភាសាអង់គ្លេស ភាសាចិន (中文) ភាសាជប៉ុន និងភាសាកូរ៉េ។',
      sources: ['/km/faq', '/km/pricing'],
    },
    faq: {
      answer:
        'ផ្នែកសំណួរញឹកញាប់ឆ្លើយនៅកម្រិតព័ត៌មានទូទៅ ទាំងក្រុមការងារ ៦ ការត្រៀមមុនទាក់ទង របៀបកំណត់ថ្លៃសេវា និងន័យនៃការផ្ញើសំណើ។ សំណើដែលបានផ្ញើរង់ចាំមេធាវីពិនិត្យ មិនមែនជាយោបល់ផ្លូវច្បាប់ មិនមែនជាការណាត់ជួប និងមិនបង្កើតទំនាក់ទំនងមេធាវីនិងអតិថិជន។ ការពិគ្រោះយោបល់ធ្វើឡើងតែជាភាសាអង់គ្លេស ភាសាចិន (中文) ភាសាជប៉ុន និងភាសាកូរ៉េ។',
      sources: ['/km/contact', '/km/services'],
    },
  },
  mn: {
    services: {
      answer:
        'Фирм Тайванийн эрх зүйн дагуу зургаан бүлэг ажил хөтөлнө: хөрөнгө оруулалт ба компани байгуулах, иргэний хэрэг ба хохирол нөхөн төлүүлэх, гэрлэлт, гэр бүл, өв залгамжлал, хөдөлмөрийн маргаан, эрүүгийн хэрэг, оюуны өмч. Хэрэг бүрийн хэмжээг өмгөөлөгч таны илгээсэн агуулгыг хянасны дараа тусад нь баталгаажуулна. Зөвлөгөө зөвхөн англи, хятад, япон, солонгос хэлээр явагдана.',
      sources: ['/mn/faq', '/mn/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm нь 2016 онд National Taiwan University (國立臺灣大學)-ийн төгсөгчдийн байгуулсан Тайвань дахь өмгөөллийн фирм бөгөөд Тайбэй, Гаосюн, Тайжун, Пиндун хотод оффистой. 2020 оноос нягтлан бодох бүртгэлийн нэгж бий; Тайжун оффис Солонгос, Японтой холбоотой хэрэг хөтөлнө. Фирм үр дүн амлахгүй. Зөвлөгөө зөвхөн англи, хятад, япон, солонгос хэлээр явагдана.',
      sources: ['/mn/lawyers', '/mn/services'],
    },
    lawyers: {
      answer:
        'Энэ хуудас Hovering-ийн өмгөөлөгч, үйл ажиллагаа хариуцсан менежер, түнш нягтлан бодогчийн танилцуулгыг харуулна. Өмгөөлөгч Wei Tseng (曾雋崴) Тайваньд өмгөөлөгчөөр ажиллах эрхтэй, фирмийг удирдана; Солонгос, Япон болон бусад олон улсын үйлчлүүлэгчидтэй ажиллана. Өмгөөлөгчтэй хийх зөвлөгөө зөвхөн англи, хятад (中文), япон, солонгос хэлээр явагдана; бусад хэлээр зөвлөгөө өгдөггүй.',
      sources: ['/mn/about', '/mn/contact'],
    },
    pricing: {
      answer:
        'Энэ хуудас үнийн жагсаалт нийтлэхгүй. Ажлын хэмжээг эхлээд таны илгээсэн товч тоймоор тогтоож, дараа нь хэмжээ, тооцох аргыг ажил эхлэхээс өмнө тантай баталгаажуулна. Өмгөөлөгчийн зөвлөгөө төлбөртэй үйлчилгээ байж болно; хөлснөөс гадна шүүх, захиргааны зардал гарч болно. Зөвлөгөө зөвхөн англи, хятад, япон, солонгос хэлээр явагдана.',
      sources: ['/mn/contact', '/mn/faq'],
    },
    contact: {
      answer:
        'Холбоо барих маягтаар товч тойм илгээнэ үү: юу болсон, ямар тусламж хэрэгтэй, хэрэг Тайваньтай ямар холбоотой, хугацаа байвал түүнийг. Энэ шатанд иргэний үнэмлэх, бүх нотлох баримтыг илгээх шаардлагагүй. Фирм хариу өгөх хугацаа амлахгүй, энэ хуудсаар цаг товлолт баталгаажуулахгүй. Зөвлөгөө зөвхөн англи, хятад, япон, солонгос хэлээр явагдана.',
      sources: ['/mn/faq', '/mn/pricing'],
    },
    faq: {
      answer:
        'Энэ хэсэг түгээмэл асуултад ерөнхий мэдээллийн түвшинд хариулна: зургаан ажлын бүлэг, холбогдохоос өмнөх бэлтгэл, хөлсийг тогтоох арга, илгээсэн мессежийн утга. Илгээсэн хүсэлт өмгөөлөгчийн хяналтыг хүлээнэ; энэ нь эрх зүйн зөвлөгөө биш, цаг товлолт биш, өмгөөлөгч ба үйлчлүүлэгчийн харилцаа үүсгэхгүй. Зөвлөгөө зөвхөн англи, хятад, япон, солонгос хэлээр явагдана.',
      sources: ['/mn/contact', '/mn/services'],
    },
  },
  sk: {
    services: {
      answer:
        'Kancelária vedie šesť oblastí podľa taiwanského práva: investície a zakladanie spoločností, občianskoprávne spory a náhradu škody, manželstvo, rodinu a dedenie, pracovnoprávne spory, trestné veci a duševné vlastníctvo. Rozsah každej veci sa potvrdzuje osobitne potom, čo advokátka alebo advokát posúdi zaslaný obsah. Konzultácia prebieha iba anglicky, čínsky, japonsky a kórejsky.',
      sources: ['/sk/faq', '/sk/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm je taiwanská advokátska kancelária, ktorú v roku 2016 založili absolventi National Taiwan University (國立臺灣大學), so sídlami v Taipeji, Kaohsiungu, Taichungu a Pingtungu. Od roku 2020 pôsobí aj účtovný úsek; sídlo v Taichungu vedie veci s väzbou na Kóreu a Japonsko. Kancelária nesľubuje výsledok. Konzultácia prebieha iba anglicky, čínsky, japonsky a kórejsky.',
      sources: ['/sk/lawyers', '/sk/services'],
    },
    lawyers: {
      answer:
        'Táto stránka ukazuje profily advokátok a advokátov Hovering, prevádzkového vedenia a pridruženého účtovníctva a auditu. Advokátka Wei Tseng (曾雋崴) je oprávnená vykonávať advokáciu na Taiwane a je riadiacou advokátkou kancelárie; pracuje s klientmi z Kórey, z Japonska a s ďalšími medzinárodnými klientmi. Konzultácia prebieha iba anglicky, čínsky, japonsky a kórejsky.',
      sources: ['/sk/about', '/sk/contact'],
    },
    pricing: {
      answer:
        'Táto stránka nezverejňuje cenník. Najprv sa z Vášho zhrnutia potvrdí rozsah práce, potom sa s Vami potvrdí výška a spôsob výpočtu, skôr než práca začne. Konzultácia s advokátkou alebo advokátom môže byť odplatná; okrem odmeny môžu vzniknúť súdne alebo správne poplatky. Konzultácia prebieha iba anglicky, čínsky, japonsky a kórejsky.',
      sources: ['/sk/contact', '/sk/faq'],
    },
    contact: {
      answer:
        'Zašlite zhrnutie kontaktným formulárom: čo sa stalo, akú pomoc potrebujete, akú väzbu má vec na Taiwan a lehotu, ak ju poznáte. V počiatočnej fáze zatiaľ netreba zasielať doklady totožnosti ani celý dôkazný materiál. Kancelária nesľubuje lehotu na odpoveď a nepotvrdzuje stretnutie prostredníctvom tejto stránky. Konzultácia prebieha iba anglicky, čínsky, japonsky a kórejsky.',
      sources: ['/sk/faq', '/sk/pricing'],
    },
    faq: {
      answer:
        'Táto časť odpovedá na časté otázky na úrovni všeobecných informácií: šesť oblastí kancelárie, príprava pred kontaktom, potvrdenie nákladov a význam odoslanej správy. Odoslaná správa čaká na posúdenie, nie je právnym stanoviskom ani potvrdeným stretnutím a sama osebe nezakladá vzťah medzi advokátkou alebo advokátom a klientom. Konzultácia prebieha iba v štyroch jazykoch: anglicky, čínsky, japonsky a kórejsky.',
      sources: ['/sk/services', '/sk/contact'],
    },
  },
  bg: {
    services: {
      answer:
        'Кантората води шест направления по тайванско право: инвестиции и учредяване на дружества, граждански дела и обезщетение за вреди, брак, семейство и наследство, трудови спорове, наказателни дела и интелектуална собственост. Обхватът на всяко дело се потвърждава отделно, след като адвокатка или адвокат прегледа съдържанието, което изпращате. Консултацията се провежда само на английски, китайски, японски и корейски.',
      sources: ['/bg/faq', '/bg/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm е адвокатска кантора в Тайван, основана през 2016 г. от възпитаници на Националния тайвански университет (National Taiwan University, 國立臺灣大學), с офиси в градовете Тайпе, Гаосюн, Тайджун и Пиндун. От 2020 г. има счетоводна кантора Hovering Accounting Office; офисът в Тайджун води дела, свързани с Корея и Япония. Кантората не обещава резултат. Консултацията се провежда само на английски, китайски, японски и корейски.',
      sources: ['/bg/lawyers', '/bg/services'],
    },
    lawyers: {
      answer:
        'Тази страница представя адвокатките и адвокатите, оперативното ръководство и партньорското счетоводство на Hovering. Адвокатка Wei Tseng (曾雋崴) е оправомощена да упражнява адвокатска дейност в Тайван и ръководи кантората; работи с клиенти от Корея, Япония и с други международни клиенти. Консултацията се провежда само на английски, китайски, японски и корейски.',
      sources: ['/bg/about', '/bg/contact'],
    },
    pricing: {
      answer:
        'Тази страница не публикува ценоразпис. Обхватът на работата най-напред се определя по краткото изложение, което изпращате, след това размерът и начинът на изчисляване се потвърждават с Вас преди началото на работата. Консултацията с адвокатка или адвокат може да бъде платена услуга; освен хонорара могат да възникнат съдебни или административни разноски. Консултацията се провежда само на английски, китайски, японски и корейски.',
      sources: ['/bg/contact', '/bg/faq'],
    },
    contact: {
      answer:
        'Изпратете кратко изложение чрез формуляра за контакт: какво се е случило, каква помощ е нужна, каква връзка има делото с Тайван и срока, ако има такъв. На този етап още не е нужно да изпращате документи за самоличност или всички доказателства. Кантората не обещава срок за отговор и не потвърждава среща чрез тази страница. Консултацията се провежда само на английски, китайски, японски и корейски.',
      sources: ['/bg/faq', '/bg/pricing'],
    },
    faq: {
      answer:
        'Този раздел отговаря на чести въпроси на ниво общи сведения: шестте направления на работа, подготовката преди обръщението, начинът за определяне на хонорара и смисълът на изпратеното съобщение. Изпратеното запитване чака преглед от адвокатка или адвокат; това не е правна консултация, не е потвърдена среща и не създава отношения между адвокатка или адвокат и клиент. Консултацията се провежда само на четирите езика: английски, китайски, японски и корейски.',
      sources: ['/bg/contact', '/bg/services'],
    },
  },
  hr: {
    services: {
      answer:
        'Ured vodi šest područja prema tajvanskom pravu: ulaganja i osnivanje društava, građanskopravne sporove i naknadu štete, brak, obitelj i nasljeđivanje, radnopravne sporove, kaznene predmete i intelektualno vlasništvo. Opseg svakog predmeta potvrđuje se zasebno nakon što odvjetnica ili odvjetnik pregleda poslani sadržaj. Savjetovanje se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/hr/faq', '/hr/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm tajvanski je odvjetnički ured koji su 2016. osnovali diplomanti National Taiwan University (國立臺灣大學), s uredima u Taipeiju, Kaohsiungu, Taichungu i Pingtungu. Od 2020. djeluje i računovodstveni odjel; ured u Taichungu vodi predmete s vezom s Korejom i Japanom. Ured ne obećava ishod. Savjetovanje se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/hr/lawyers', '/hr/services'],
    },
    lawyers: {
      answer:
        'Ova stranica prikazuje profile odvjetnica i odvjetnika Hovering, operativnog vodstva te pridruženog računovodstva i revizije. Odvjetnica Wei Tseng (曾雋崴) ovlaštena je obavljati odvjetništvo na Tajvanu i vodeća je odvjetnica ureda; radi s klijentima iz Koreje, iz Japana i s drugim međunarodnim klijentima. Savjetovanje se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/hr/about', '/hr/contact'],
    },
    pricing: {
      answer:
        'Ova stranica ne objavljuje cjenik. Najprije se iz Vašeg sažetka potvrđuje opseg rada, zatim se s Vama potvrđuju iznos i način izračuna, prije nego rad počne. Savjetovanje s odvjetnicom ili odvjetnikom može biti naplatno; uz nagradu mogu nastati sudske ili upravne pristojbe. Savjetovanje se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/hr/contact', '/hr/faq'],
    },
    contact: {
      answer:
        'Pošaljite sažetak kontaktnim obrascem: što se dogodilo, kakva Vam je pomoć potrebna, kakvu vezu predmet ima s Tajvanom i rok, ako ga znate. U početnoj fazi još nije potrebno slati isprave o identitetu ni cjelokupni dokazni materijal. Ured ne obećava rok za odgovor i ne potvrđuje sastanak putem ove stranice. Savjetovanje se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/hr/faq', '/hr/pricing'],
    },
    faq: {
      answer:
        'Ovaj dio odgovara na česta pitanja na razini općih informacija: šest područja ureda, priprema prije kontakta, potvrda troškova i značenje poslane poruke. Poslana poruka čeka pregled, nije pravno mišljenje ni potvrđeni sastanak i sama po sebi ne uspostavlja odnos između odvjetnice ili odvjetnika i klijenta. Savjetovanje se odvija samo na četiri jezika: engleskom, kineskom, japanskom i korejskom.',
      sources: ['/hr/contact', '/hr/services'],
    },
  },
  sr: {
    services: {
      answer:
        'Kancelarija vodi šest oblasti po tajvanskom pravu: investicije i osnivanje društava, građanske sporove i naknadu štete, brak, porodicu i nasleđe, radnopravne sporove, krivične stvari i intelektualnu svojinu. Obim svake stvari potvrđuje se posebno nakon što advokatkinja ili advokat pregleda poslati sadržaj. Konsultacija se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/sr/faq', '/sr/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm je tajvanska advokatska kancelarija koju su 2016. osnovali diplomci National Taiwan University (國立臺灣大學), sa kancelarijama u Tajpeju, Kaohsiungu, Taichungu i Pingtungu. Od 2020. deluje i računovodstveno odeljenje; kancelarija u Taichungu vodi stvari sa vezom na Koreju i Japan. Kancelarija ne obećava ishod. Konsultacija se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/sr/lawyers', '/sr/services'],
    },
    lawyers: {
      answer:
        'Ova stranica pokazuje profile advokatkinja i advokata Hovering, operativnog rukovodstva i pridruženog računovodstva i revizije. Advokatkinja Wei Tseng (曾雋崴) ovlašćena je da obavlja advokatsku delatnost na Tajvanu i rukovodeća je advokatkinja kancelarije; radi sa klijentima iz Koreje, iz Japana i sa drugim međunarodnim klijentima. Konsultacija se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/sr/about', '/sr/contact'],
    },
    pricing: {
      answer:
        'Ova stranica ne objavljuje cenovnik. Najpre se iz Vašeg sažetka potvrđuje obim rada, zatim se sa Vama potvrđuju visina i način obračuna, pre nego što rad počne. Konsultacija sa advokatkinjom ili advokatom može biti uz naknadu; pored nagrade mogu nastati sudske ili upravne takse. Konsultacija se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/sr/contact', '/sr/faq'],
    },
    contact: {
      answer:
        'Pošaljite sažetak kontaktnim obrascem: šta se dogodilo, kakva Vam je pomoć potrebna, kakvu vezu stvar ima sa Tajvanom i rok, ako ga znate. U početnoj fazi još nije potrebno slati isprave identiteta niti celokupne dokaze. Kancelarija ne obećava rok za odgovor i ne potvrđuje sastanak preko ove stranice. Konsultacija se odvija samo na engleskom, kineskom, japanskom i korejskom.',
      sources: ['/sr/faq', '/sr/pricing'],
    },
    faq: {
      answer:
        'Ovaj deo odgovara na česta pitanja na nivou opštih informacija: šest oblasti kancelarije, priprema pre kontakta, potvrda troškova i značenje poslate poruke. Poslat zahtev čeka ocenu, nije pravno mišljenje niti potvrđen sastanak i samo po sebi ne zasniva odnos između advokatkinje ili advokata i klijenta. Konsultacija se odvija samo na četiri jezika: engleskom, kineskom, japanskom i korejskom.',
      sources: ['/sr/services', '/sr/contact'],
    },
  },
  sl: {
    services: {
      answer:
        'Pisarna vodi šest področij po tajvanskem pravu: naložbe in ustanavljanje družb, civilne spore in odškodnino, zakonsko zvezo, družino in dedovanje, delovnopravne spore, kazenske zadeve in intelektualno lastnino. Obseg vsake zadeve se potrdi posebej, potem ko odvetnica ali odvetnik oceni poslano vsebino. Posvet poteka samo v angleščini, kitajščini, japonščini in korejščini.',
      sources: ['/sl/faq', '/sl/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm je tajvanska odvetniška pisarna, ki so jo leta 2016 ustanovili odvetnice in odvetniki, diplomanti National Taiwan University (國立臺灣大學), s pisarnami v Tajpeju, Kaohsiungu, Taichungu in Pingtungu. Od leta 2020 deluje tudi računovodski oddelek; pisarna v Taichungu vodi zadeve z vezjo na Korejo in Japonsko. Pisarna ne obljublja izida. Posvet poteka samo v angleščini, kitajščini, japonščini in korejščini.',
      sources: ['/sl/lawyers', '/sl/services'],
    },
    lawyers: {
      answer:
        'Ta stran prikazuje profile odvetnic in odvetnikov Hovering, osebja za poslovanje in pridruženega računovodstva. Odvetnica Wei Tseng (曾雋崴) je pooblaščena za opravljanje odvetništva na Tajvanu in je vodilna odvetnica pisarne; dela s strankami iz Koreje, z Japonske in z drugimi mednarodnimi strankami. Posvet poteka samo v angleščini, kitajščini, japonščini in korejščini.',
      sources: ['/sl/about', '/sl/contact'],
    },
    pricing: {
      answer:
        'Ta stran ne objavlja cenika. Najprej se iz vašega povzetka potrdi obseg dela, nato se z vami potrdita višina in način izračuna, preden se delo začne. Posvet z odvetnico ali odvetnikom je lahko plačljiv; poleg nagrade lahko nastanejo sodne ali upravne takse. Posvet poteka samo v angleščini, kitajščini, japonščini in korejščini.',
      sources: ['/sl/contact', '/sl/faq'],
    },
    contact: {
      answer:
        'Pošljite povzetek prek obrazca za stik: kaj se je zgodilo, kakšno pomoč potrebujete, kakšno vez ima zadeva s Tajvanom in rok, če ga poznate. V začetni fazi še ni treba pošiljati osebnih dokumentov niti celotnega dokaznega gradiva. Pisarna ne obljublja roka za odgovor in ne potrjuje sestanka prek te strani. Posvet poteka samo v angleščini, kitajščini, japonščini in korejščini.',
      sources: ['/sl/faq', '/sl/pricing'],
    },
    faq: {
      answer:
        'Ta del odgovarja na pogosta vprašanja na ravni splošnih informacij: šest področij pisarne, priprava pred stikom, potrditev stroškov in pomen poslanega sporočila. Poslana prošnja čaka na oceno, ni pravno mnenje niti potrjen sestanek in sama po sebi ne vzpostavi razmerja med odvetnico ali odvetnikom in stranko. Posvet poteka samo v štirih jezikih: v angleščini, kitajščini, japonščini in korejščini.',
      sources: ['/sl/services', '/sl/contact'],
    },
  },
  lt: {
    services: {
      answer:
        'Kontora veda šešias sritis pagal Taivano teisę: investicijas ir įmonių steigimą, civilinius ginčus ir žalos atlyginimą, santuoką, šeimą ir paveldėjimą, darbo ginčus, baudžiamąsias bylas ir intelektinę nuosavybę. Kiekvienos bylos apimtis patvirtinama atskirai po to, kai advokatė arba advokatas įvertina atsiųstą turinį. Konsultacija vyksta tik anglų, kinų, japonų ir korėjiečių kalbomis.',
      sources: ['/lt/faq', '/lt/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm yra Taivano advokatų kontora, kurią 2016 m. įsteigė National Taiwan University (國立臺灣大學) absolventai, su biurais miestuose Taipėjus, Gaosiongas, Taidžongas ir Pingdongas. Nuo 2020 m. veikia ir apskaitos padalinys; Taidžongo biuras veda bylas, susijusias su Korėja ir Japonija. Kontora nežada rezultato. Konsultacija vyksta tik anglų, kinų, japonų ir korėjiečių kalbomis.',
      sources: ['/lt/lawyers', '/lt/services'],
    },
    lawyers: {
      answer:
        'Šis puslapis rodo Hovering advokačių ir advokatų, Korėjos operacijų vadovo ir susijusios apskaitos bei audito profilius. Advokatė Wei Tseng (曾雋崴) turi teisę verstis advokatės praktika Taivane ir yra vadovaujančioji advokatė kontoroje; dirba su klientais iš Korėjos, iš Japonijos ir su kitais tarptautiniais klientais. Konsultacija vyksta tik anglų, kinų, japonų ir korėjiečių kalbomis.',
      sources: ['/lt/about', '/lt/contact'],
    },
    pricing: {
      answer:
        'Šis puslapis neskelbia kainyno. Pirmiausia iš Jūsų santraukos patvirtinama darbo apimtis, tada su Jumis patvirtinamas dydis ir skaičiavimo būdas, prieš pradedant darbą. Konsultacija su advokate arba advokatu gali būti mokama; šalia atlygio gali atsirasti teismo ar administracinės rinkliavos. Konsultacija vyksta tik anglų, kinų, japonų ir korėjiečių kalbomis.',
      sources: ['/lt/contact', '/lt/faq'],
    },
    contact: {
      answer:
        'Atsiųskite santrauką kontaktine forma: kas įvyko, kokios pagalbos reikia, kokį ryšį byla turi su Taivanu, ir terminą, jei jį žinote. Pradiniame etape dar nereikia siųsti tapatybės dokumentų ar visos įrodymų medžiagos. Kontora nežada atsakymo termino ir nepatvirtina susitikimo per šį puslapį. Konsultacija vyksta tik anglų, kinų, japonų ir korėjiečių kalbomis.',
      sources: ['/lt/faq', '/lt/pricing'],
    },
    faq: {
      answer:
        'Ši dalis atsako į dažnus klausimus bendros informacijos lygiu: šešios kontoros sritys, pasirengimas prieš kreipiantis, išlaidų patvirtinimas ir išsiųsto pranešimo reikšmė. Išsiųstas pranešimas laukia įvertinimo, nėra teisinė nuomonė ir nėra patvirtintas susitikimas, ir pats savaime nesukuria advokato ir kliento santykių. Konsultacija vyksta tik keturiomis kalbomis: anglų, kinų, japonų ir korėjiečių.',
      sources: ['/lt/services', '/lt/contact'],
    },
  },
  lv: {
    services: {
      answer:
        'Birojs ved sešas jomas saskaņā ar Taivānas tiesībām: ieguldījumus un sabiedrību dibināšanu, civillietas un zaudējumu atlīdzību, laulību, ģimeni un mantojumu, darba strīdus, krimināllietas un intelektuālo īpašumu. Katras lietas apjoms tiek apstiprināts atsevišķi pēc tam, kad advokāte vai advokāts ir izvērtējis nosūtīto saturu. Konsultācija notiek tikai angļu, ķīniešu, japāņu un korejiešu valodā.',
      sources: ['/lv/faq', '/lv/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm ir Taivānas advokātu birojs, ko 2016. gadā dibināja National Taiwan University (國立臺灣大學) absolventi, ar birojiem Taipejā, Gaosjunā, Taidžunā un Pindunā. Kopš 2020. gada darbojas arī grāmatvedības daļa; Taidžunas birojs ved lietas ar saikni ar Koreju un Japānu. Birojs nesola iznākumu. Konsultācija notiek tikai angļu, ķīniešu, japāņu un korejiešu valodā.',
      sources: ['/lv/lawyers', '/lv/services'],
    },
    lawyers: {
      answer:
        'Šī lapa rāda Hovering advokātu un līdzstrādnieku, kā arī partnera grāmatvedības un revīzijas profilus. Advokāte Wei Tseng (曾雋崴) ir tiesīga praktizēt advokatūru Taivānā un ir biroja vadošā advokāte; viņa palīdz klientiem no Korejas, no Japānas un citiem starptautiskiem klientiem. Konsultācija notiek tikai angļu, ķīniešu, japāņu un korejiešu valodā.',
      sources: ['/lv/about', '/lv/contact'],
    },
    pricing: {
      answer:
        'Šī lapa nepublicē cenrādi. Vispirms no Jūsu kopsavilkuma apstiprina darba apjomu, pēc tam ar Jums apstiprina apmēru un aprēķina veidu, pirms darbs sākas. Konsultācija ar advokāti vai advokātu var būt pret samaksu; līdzās honorāram var rasties tiesas vai iestāžu nodevas. Konsultācija notiek tikai angļu, ķīniešu, japāņu un korejiešu valodā.',
      sources: ['/lv/contact', '/lv/faq'],
    },
    contact: {
      answer:
        'Nosūtiet kopsavilkumu saziņas veidlapā: kas ir noticis, kāda palīdzība Jums vajadzīga, kāda saikne lietai ir ar Taivānu, un termiņu, ja to zināt. Sākumposmā vēl nav jānosūta personas dokumenti vai visa pierādījumu kopa. Birojs nesola atbildes termiņu un neapstiprina tikšanos, izmantojot šo lapu. Konsultācija notiek tikai angļu, ķīniešu, japāņu un korejiešu valodā.',
      sources: ['/lv/faq', '/lv/pricing'],
    },
    faq: {
      answer:
        'Šī daļa atbild uz biežiem jautājumiem vispārīgas informācijas līmenī: sešas biroja jomas, sagatavošanās pirms saziņas, izmaksu apstiprinājums un nosūtīta ziņojuma nozīme. Nosūtīts ziņojums gaida izvērtējumu, nav juridisks atzinums un nav apstiprināta tikšanās, un pats par sevi nerada attiecības starp advokāti vai advokātu un klientu. Konsultācija notiek tikai četrās valodās: angļu, ķīniešu, japāņu un korejiešu.',
      sources: ['/lv/services', '/lv/contact'],
    },
  },
  et: {
    services: {
      answer:
        'Büroo tegeleb Taiwani õiguse järgi kuue valdkonnaga: investeeringud ja äriühingu asutamine, tsiviilvaidlused ja kahjuhüvitis, abielu, perekond ja pärimine, töövaidlused, kriminaalasjad ning intellektuaalomand. Iga asja ulatus kinnitatakse eraldi pärast seda, kui advokaat on saadetud sisu läbi vaadanud. Nõustamine toimub ainult inglise, hiina, jaapani ja korea keeles.',
      sources: ['/et/faq', '/et/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm on Taiwani advokaadibüroo, mille asutasid 2016. aastal National Taiwan University (國立臺灣大學) vilistlased, büroodega Taipeis, Kaohsiungis, Taichungis ja Pingtungis. Alates 2020. aastast tegutseb ka raamatupidamisüksus; Taichungi büroo tegeleb Koreaga ja Jaapaniga seotud asjadega. Büroo ei luba tulemust. Nõustamine toimub ainult inglise, hiina, jaapani ja korea keeles.',
      sources: ['/et/lawyers', '/et/services'],
    },
    lawyers: {
      answer:
        'Sellel lehel on Hoveringi advokaatide, tegevjuhtimise ja seotud audiitorbüroo profiilid. Advokaat Wei Tseng (曾雋崴) on Taiwani advokatuuri liige ja büroo juhtiv advokaat; ta töötab klientidega Koreast, Jaapanist ja teiste riikide klientidega. Nõustamine toimub ainult inglise, hiina, jaapani ja korea keeles.',
      sources: ['/et/about', '/et/contact'],
    },
    pricing: {
      answer:
        'Sellel lehel ei ole hinnakirja. Esmalt kinnitatakse teie kokkuvõtte põhjal töö ulatus, seejärel kinnitatakse teiega summa ja arvutusviis enne töö algust. Nõustamine advokaadiga võib olla tasuline; lisaks tasule võivad tekkida kohtu- või haldustasud. Nõustamine toimub ainult inglise, hiina, jaapani ja korea keeles.',
      sources: ['/et/contact', '/et/faq'],
    },
    contact: {
      answer:
        'Saatke kokkuvõte kontaktvormiga: mis juhtus, millist abi vajate, milline on asja side Taiwaniga, ja tähtaeg, kui see on teada. Algfaasis ei ole vaja saata isikut tõendavaid dokumente ega kogu tõendusmaterjali. Büroo ei luba vastamise tähtaega ega kinnita kohtumist selle lehe kaudu. Nõustamine toimub ainult inglise, hiina, jaapani ja korea keeles.',
      sources: ['/et/faq', '/et/pricing'],
    },
    faq: {
      answer:
        'Selles osas vastatakse korduvatele küsimustele üldise teabe tasemel: büroo kuus valdkonda, ettevalmistus enne ühendust, tasude kinnitamine ja saadetud teate tähendus. Saadetud teade ootab läbivaatamist; see ei ole õiguslik seisukoht ega kinnitatud kohtumine ja iseenesest ei tekita suhet advokaadi ja kliendi vahel. Nõustamine toimub ainult neljas keeles: inglise, hiina, jaapani ja korea keeles.',
      sources: ['/et/services', '/et/contact'],
    },
  },
  ca: {
    services: {
      answer:
        'El despatx atén sis àrees de pràctica segons el dret de Taiwan: inversió i constitució de societats, litigis civils i danys, matrimoni, família i successions, conflictes laborals, assumptes penals i propietat intel·lectual. L’abast de cada assumpte es confirma per separat després que una advocada o un advocat revisi el contingut enviat. La consulta es fa únicament en anglès, xinès, japonès i coreà.',
      sources: ['/ca/faq', '/ca/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm és un despatx d’advocats de Taiwan, fundat el 2016 per titulats de National Taiwan University (國立臺灣大學), amb oficines a Taipei, Kaohsiung, Taichung i Pingtung. Des del 2020 també hi ha una àrea de comptabilitat; l’oficina de Taichung atén assumptes relacionats amb Corea i el Japó. El despatx no promet un resultat. La consulta es fa únicament en anglès, xinès, japonès i coreà.',
      sources: ['/ca/lawyers', '/ca/services'],
    },
    lawyers: {
      answer:
        'Aquesta pàgina mostra els perfils dels advocats de Hovering, de la direcció d’operacions i del soci auditor. L’advocada Wei Tseng (曾雋崴) està habilitada per exercir a Taiwan i és l’advocada directora del despatx; treballa amb clients de Corea, del Japó i amb altres clients internacionals. La consulta es fa únicament en anglès, xinès, japonès i coreà.',
      sources: ['/ca/about', '/ca/contact'],
    },
    pricing: {
      answer:
        'Aquesta pàgina no publica una llista de tarifes. Primer es confirma l’abast del treball a partir del seu resum i després se’n confirmen amb vostè la quantia i el mode de càlcul, abans de començar. La consulta amb una advocada o un advocat pot ser un servei de pagament; a més dels honoraris poden sorgir taxes judicials o administratives. La consulta es fa únicament en anglès, xinès, japonès i coreà.',
      sources: ['/ca/contact', '/ca/faq'],
    },
    contact: {
      answer:
        'Enviï un resum pel formulari de contacte: què va passar, quina ajuda necessita, quin vincle té l’assumpte amb Taiwan i el termini, si el coneix. En la fase inicial encara no cal enviar documents d’identitat ni tot el material de prova. El despatx no promet un termini de resposta i no confirma una cita a través d’aquesta pàgina. La consulta es fa únicament en anglès, xinès, japonès i coreà.',
      sources: ['/ca/faq', '/ca/pricing'],
    },
    faq: {
      answer:
        'Aquesta part respon preguntes freqüents com a informació general: les sis àrees del despatx, la preparació abans del contacte, la confirmació d’honoraris i el significat d’un missatge enviat. Un missatge enviat espera revisió, no és assessorament jurídic ni una cita confirmada, i per si sol no crea una relació entre advocada o advocat i client. La consulta es fa únicament en quatre idiomes: anglès, xinès, japonès i coreà.',
      sources: ['/ca/services', '/ca/contact'],
    },
  },
  is: {
    services: {
      answer:
        'Skrifstofan vinnur sex málaflokka samkvæmt rétti Taívan: fjárfestingu og félagastofnun, einkamál og skaðabætur, hjúskap, fjölskyldu og erfðir, vinnurétt, refsirétt og hugverkarétt. Umfang hvers máls er staðfest sérstaklega eftir að lögmaður hefur metið sent efni. Ráðgjöf fer einungis fram á ensku, kínversku, japönsku og kóresku.',
      sources: ['/is/faq', '/is/contact'],
    },
    about: {
      answer:
        'Hovering International Law Firm er lögmannsstofa á Taívan, stofnuð árið 2016 af lögmönnum menntuðum við National Taiwan University (國立臺灣大學), með skrifstofur í Taipei, Kaohsiung, Taichung og Pingtung. Frá 2020 starfar einnig bókhaldsdeild; skrifstofan í Taichung vinnur mál sem tengjast Kóreu og Japan. Skrifstofan heitir ekki niðurstöðu. Ráðgjöf fer einungis fram á ensku, kínversku, japönsku og kóresku.',
      sources: ['/is/lawyers', '/is/services'],
    },
    lawyers: {
      answer:
        'Þessi síða sýnir prófíla lögmanna Hovering, rekstrarstjórnarinnar og tengds endurskoðunarfyrirtækis. Lögmaðurinn Wei Tseng (曾雋崴) hefur lögmannsréttindi á Taívan og er yfirlögmaður stofunnar; hún vinnur með skjólstæðingum frá Kóreu og Japan og öðrum alþjóðlegum skjólstæðingum. Ráðgjöf fer einungis fram á ensku, kínversku, japönsku og kóresku.',
      sources: ['/is/about', '/is/contact'],
    },
    pricing: {
      answer:
        'Þessi síða birtir ekki gjaldskrá. Fyrst er vinnuumfangið ákveðið út frá samantektinni sem þú sendir, síðan eru fjárhæð og útreikningsaðferð staðfestar við þig áður en vinna hefst. Samtal við lögmann getur verið greidd þjónusta; til viðbótar við þóknun geta komið dómstóla- eða stjórnvaldsgjöld. Ráðgjöf fer einungis fram á ensku, kínversku, japönsku og kóresku.',
      sources: ['/is/contact', '/is/faq'],
    },
    contact: {
      answer:
        'Sendu samantektina með tengiliðaeyðublaðinu: hvað gerðist, hvers konar aðstoð þú þarft, hvaða tengsl málið hefur við Taívan og frestinn ef þú þekkir hann. Í fyrsta skrefi þarftu enn ekki að senda persónuskilríki eða öll sönnunargögn. Skrifstofan heitir engum svarfresti og staðfestir engan tíma í gegnum þessa síðu. Ráðgjöf fer einungis fram á ensku, kínversku, japönsku og kóresku.',
      sources: ['/is/faq', '/is/pricing'],
    },
    faq: {
      answer:
        'Þessi hluti svarar algengum spurningum á stigi almennra upplýsinga: sex málaflokkarnir, undirbúningur fyrir samband, hvernig kostnaður er ákveðinn og merking sendrar beiðni. Send beiðni bíður mats lögmanns; hún er ekki lögfræðilegt álit, ekki staðfestur tími, og stofnar ekki samband milli lögmanns og skjólstæðings. Ráðgjöf fer einungis fram á ensku, kínversku, japönsku og kóresku.',
      sources: ['/is/contact', '/is/services'],
    },
  },
};
