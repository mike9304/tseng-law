// SEA business guidance: isolated from the 45-language core-page dictionary.
import type { SeaBusinessLocale } from '@/lib/sea-business-routes';
export type SeaSourceKey = 'investment' | 'work' | 'civil' | 'payment';
export interface SeaBusinessPage {
  title: string; description: string; intro: string;
  sections: { heading: string; paragraphs: string[]; items?: string[]; sources?: SeaSourceKey[] }[];
}
export interface SeaBusinessCopy {
  heading: string; relatedLabel: string; englishLabel: string; languageNote: string;
  'company-setup': SeaBusinessPage; 'debt-collection': SeaBusinessPage;
}
export const SEA_BUSINESS_SOURCES: Record<SeaSourceKey, { title: string; href: string }> = {
  investment: { title: 'MOEA — Invest Taiwan', href: 'https://investtaiwan.nat.gov.tw/showPageengInvestmentStatus?lang=eng&search=InvestmentStatus' },
  work: { title: 'Contact TAIWAN — Work permits', href: 'https://contacttaiwan.tw/MainOne/faq.aspx?faq=16' },
  civil: { title: 'Code of Civil Procedure, Article 509', href: 'https://law.moj.gov.tw/ENG/LawClass/LawAll.aspx?pcode=B0010001' },
  payment: { title: '司法院 — 支付命令的效力', href: 'https://www.judicial.gov.tw/tw/cp-1303-2724-b486e-1.html' },
};
export const seaBusinessContent: Record<SeaBusinessLocale, SeaBusinessCopy> = {
  "vi": {
    "heading": "Hướng dẫn cho doanh nghiệp",
    "relatedLabel": "Tài liệu cùng chủ đề",
    "englishLabel": "Thông tin bằng tiếng Anh",
    "languageNote": "Trang này được viết bằng tiếng Việt. Việc tư vấn với luật sư được thực hiện bằng tiếng Anh, tiếng Trung, tiếng Nhật hoặc tiếng Hàn; chúng tôi không cam kết bố trí phiên dịch.",
    "company-setup": {
      "title": "Thành lập công ty tại Đài Loan",
      "description": "Lựa chọn hình thức hiện diện, hồ sơ nhà đầu tư và các công việc pháp lý khi doanh nghiệp nước ngoài hoạt động tại Đài Loan.",
      "intro": "Công ty con, chi nhánh và văn phòng đại diện là những hình thức hiện diện khác nhau. Việc lựa chọn cần dựa vào hoạt động dự kiến tại Đài Loan, cơ cấu nhà đầu tư và vai trò của công ty mẹ.",
      "sections": [
        {
          "heading": "Đầu tư, đăng ký và giấy phép chuyên ngành",
          "paragraphs": [
            "Thủ tục đầu tư nước ngoài và đăng ký doanh nghiệp cần được xác định theo hình thức đầu tư. Một số ngành cần chấp thuận trước khi đăng ký và cũng có thể cần giấy phép hoạt động riêng. Không nên coi giấy đăng ký công ty là giấy phép cho mọi hoạt động."
          ],
          "sources": [
            "investment"
          ]
        },
        {
          "heading": "Những việc cần xác định trước khi chuyển vốn",
          "paragraphs": [
            "Bản mô tả hoạt động, cơ cấu sở hữu và địa chỉ dự kiến cho phép luật sư xác định những vấn đề cần kiểm tra trước khi chuẩn bị hồ sơ. Hợp đồng thuê địa điểm, hợp đồng với đối tác và việc sử dụng nhãn hiệu cũng có thể được xem xét trong phạm vi công việc đã thỏa thuận.",
            "Nếu nhà đầu tư hoặc người quản lý dự định làm việc tại Đài Loan, quyền làm việc của người đó cần được kiểm tra riêng. Đăng ký công ty không tự nó cấp quyền làm việc."
          ],
          "sources": [
            "work"
          ]
        },
        {
          "heading": "Tài liệu cho lần trao đổi đầu tiên",
          "paragraphs": [
            "Email ban đầu có thể nêu ngành nghề, công ty mẹ hoặc nhà đầu tư, cơ cấu sở hữu và thời điểm dự kiến triển khai. Chỉ cần mô tả các tài liệu đang có; không cần gửi bản gốc giấy tờ định danh trong lần liên hệ đầu."
          ],
          "items": [
            "Sản phẩm hoặc dịch vụ sẽ cung cấp tại Đài Loan, khách hàng và cách vận hành dự kiến",
            "Hình thức hiện diện đang cân nhắc, địa điểm và vốn dự kiến nếu đã xác định",
            "Các yêu cầu về tuyển dụng, hợp đồng hoặc giấy phép mà doanh nghiệp đã biết"
          ]
        }
      ]
    },
    "debt-collection": {
      "title": "Thu hồi công nợ tại Đài Loan",
      "description": "Hồ sơ giao dịch, thủ tục yêu cầu thanh toán và việc đánh giá hướng xử lý khi đối tác tại Đài Loan chưa thanh toán.",
      "intro": "Hóa đơn, hợp đồng và chứng từ giao hàng trả lời những câu hỏi khác nhau: ai phải trả tiền, khoản nào đã đến hạn và nghĩa vụ đối ứng đã được thực hiện hay chưa. Hồ sơ cần xác định cả phần tiền còn thiếu lẫn những điểm bên nợ đang tranh chấp.",
      "sections": [
        {
          "heading": "Từ hồ sơ giao dịch đến phương án xử lý",
          "paragraphs": [
            "Luật sư có thể xem xét hợp đồng, trao đổi giữa các bên và lịch sử thanh toán để đánh giá yêu cầu trả tiền, thương lượng hoặc thủ tục tại tòa. Có giấy tờ xác nhận khoản nợ và thực tế thu hồi được tiền là hai vấn đề cần đánh giá riêng.",
            "Tên pháp lý và địa chỉ của bên nợ, điều khoản giải quyết tranh chấp, khoản thanh toán từng phần và tài sản đã biết đều có thể ảnh hưởng đến phương án đề xuất. Không có cam kết thu hồi đủ tiền hoặc hoàn tất trong một thời gian cố định."
          ]
        },
        {
          "heading": "Lệnh thanh toán và quyền phản đối của bên nợ",
          "paragraphs": [
            "Không thể dùng thủ tục lệnh thanh toán nếu nghĩa vụ đối ứng mà người yêu cầu phải thực hiện vẫn chưa được thực hiện, hoặc nếu lệnh phải được tống đạt ở nước ngoài hay bằng thông báo công khai."
          ],
          "sources": [
            "civil"
          ]
        },
        {
          "heading": "Thời hạn tính từ khi tống đạt",
          "paragraphs": [
            "Bên nợ có thể phản đối mà không cần nêu lý do trong 20 ngày sau khi lệnh thanh toán được tống đạt hợp lệ. Phản đối đúng hạn và hợp lệ làm lệnh mất hiệu lực trong phạm vi bị phản đối; hồ sơ khi đó được xử lý như khởi kiện hoặc yêu cầu hòa giải."
          ],
          "sources": [
            "payment"
          ]
        },
        {
          "heading": "Những tài liệu đã có",
          "paragraphs": [
            "Khi liên hệ, hãy nêu số tiền và loại tiền, ngày đến hạn, tên bên nợ và các mốc thời gian liên quan. Hợp đồng, đơn đặt hàng, chứng từ giao nhận, hóa đơn, tin nhắn và chứng từ thanh toán giúp xác định phần yêu cầu còn tồn tại. Nếu đã có thư của tòa hoặc thời hạn được thông báo, hãy nêu rõ ngày nhận."
          ]
        }
      ]
    }
  },
  "id": {
    "heading": "Panduan untuk perusahaan",
    "relatedLabel": "Bacaan terkait",
    "englishLabel": "Informasi dalam bahasa Inggris",
    "languageNote": "Halaman ini ditulis dalam bahasa Indonesia. Konsultasi dengan advokat berlangsung dalam bahasa Inggris, Tionghoa, Jepang, atau Korea; kami tidak menjanjikan penyediaan penerjemah lisan.",
    "company-setup": {
      "title": "Pendirian perusahaan di Taiwan",
      "description": "Pilihan bentuk usaha, dokumen investor, dan pekerjaan hukum bagi perusahaan asing yang akan beroperasi di Taiwan.",
      "intro": "Rencana penjualan, struktur investor, dan peran perusahaan induk menentukan bentuk kehadiran yang perlu dipertimbangkan di Taiwan. Anak perusahaan, kantor cabang, dan kantor perwakilan merupakan bentuk yang berbeda, bukan sekadar nama lain untuk pengaturan yang sama.",
      "sections": [
        {
          "heading": "Penanaman modal dan izin kegiatan usaha",
          "paragraphs": [
            "Prosedur investasi asing dan pendaftaran usaha perlu ditentukan menurut bentuk investasinya. Bidang tertentu memerlukan persetujuan sebelum pendaftaran dan dapat pula memerlukan izin operasional tersendiri. Pendaftaran perusahaan bukan izin untuk menjalankan setiap jenis kegiatan."
          ],
          "sources": [
            "investment"
          ]
        },
        {
          "heading": "Sebelum modal dikirim",
          "paragraphs": [
            "Uraian kegiatan, struktur kepemilikan, dan rencana alamat memungkinkan advokat mengidentifikasi persoalan yang perlu diperiksa sebelum dokumen disiapkan. Perjanjian sewa, kontrak dengan mitra, dan penggunaan merek juga dapat ditinjau dalam lingkup pekerjaan yang disepakati.",
            "Jika investor atau manajer akan bekerja di Taiwan, hak orang tersebut untuk bekerja perlu diperiksa secara terpisah. Pendaftaran perusahaan dengan sendirinya tidak memberikan hak bekerja."
          ],
          "sources": [
            "work"
          ]
        },
        {
          "heading": "Informasi untuk pembicaraan awal",
          "paragraphs": [
            "Email awal dapat menyebutkan bidang usaha, perusahaan induk atau investor, susunan kepemilikan, dan rencana waktu pelaksanaan. Jelaskan dokumen yang tersedia; dokumen identitas asli tidak perlu dikirim pada kontak pertama."
          ],
          "items": [
            "Produk atau jasa yang akan ditawarkan di Taiwan, pelanggan, dan cara operasinya",
            "Bentuk kehadiran yang dipertimbangkan, alamat, dan perkiraan modal bila sudah diketahui",
            "Persoalan perekrutan, kontrak, atau perizinan yang sudah diketahui perusahaan"
          ]
        }
      ]
    },
    "debt-collection": {
      "title": "Penagihan piutang di Taiwan",
      "description": "Dokumen transaksi, permohonan perintah pembayaran, dan penilaian pilihan penanganan tagihan yang belum dibayar mitra di Taiwan.",
      "intro": "Tagihan yang belum dibayar perlu dihubungkan dengan kontrak dan bukti pelaksanaan kewajiban. Dokumen tersebut menunjukkan siapa yang wajib membayar, bagian yang telah jatuh tempo, serta apakah debitur mempermasalahkan penyerahan barang, pekerjaan, atau jumlah tagihan.",
      "sections": [
        {
          "heading": "Menilai tuntutan dan kemungkinan pemulihan",
          "paragraphs": [
            "Advokat dapat meninjau kontrak, korespondensi, dan riwayat pembayaran untuk menilai tuntutan pembayaran, negosiasi, atau proses pengadilan. Bukti adanya piutang dan kemungkinan menerima uang secara nyata perlu dinilai secara terpisah.",
            "Nama hukum serta alamat debitur, klausul penyelesaian sengketa, pembayaran sebagian, dan aset yang diketahui dapat memengaruhi langkah yang diusulkan. Tidak ada jaminan seluruh piutang akan pulih atau perkara selesai dalam waktu tetap."
          ]
        },
        {
          "heading": "Batas penggunaan perintah pembayaran",
          "paragraphs": [
            "Prosedur perintah pembayaran tidak dapat digunakan bila kewajiban timbal balik yang harus dipenuhi pemohon belum dilaksanakan, atau bila perintah harus disampaikan di luar negeri maupun melalui pemberitahuan publik."
          ],
          "sources": [
            "civil"
          ]
        },
        {
          "heading": "Keberatan setelah perintah disampaikan",
          "paragraphs": [
            "Debitur dapat mengajukan keberatan tanpa menyebutkan alasan dalam 20 hari setelah perintah pembayaran disampaikan secara sah. Keberatan yang sah dan tepat waktu menghilangkan keberlakuan perintah sejauh yang disengketakan; permohonan kemudian diperlakukan sebagai gugatan atau permohonan mediasi."
          ],
          "sources": [
            "payment"
          ]
        },
        {
          "heading": "Dokumen yang sudah tersedia",
          "paragraphs": [
            "Dalam pesan pertama, sebutkan jumlah dan mata uang, tanggal jatuh tempo, nama debitur, serta tanggal yang berkaitan dengan transaksi. Kontrak, pesanan, bukti penyerahan, faktur, pesan, dan bukti pembayaran membantu menjelaskan bagian tagihan yang tersisa. Jika sudah ada surat pengadilan atau pemberitahuan tenggat, cantumkan tanggal penerimaannya."
          ]
        }
      ]
    }
  },
  "fil": {
    "heading": "Gabay para sa negosyo",
    "relatedLabel": "Kaugnay na babasahin",
    "englishLabel": "Impormasyon sa Ingles",
    "languageNote": "Nakasulat sa Filipino ang pahinang ito. Ang konsultasyon sa abogado ay sa Ingles, Tsino, Hapones, o Koreano; hindi namin ipinapangakong may maibibigay na interpreter.",
    "company-setup": {
      "title": "Pagtatatag ng kumpanya sa Taiwan",
      "description": "Mga uri ng presensiya sa negosyo, dokumento ng mamumuhunan, at usaping legal para sa dayuhang kumpanyang papasok sa Taiwan.",
      "intro": "Magkaiba ang subsidiary, sangay, at representative office. Ang pagpili ay nakaugnay sa aktuwal na gagawin ng negosyo sa Taiwan, sa mga mamumuhunan, at sa papel na pananatilihin ng kumpanyang magulang.",
      "sections": [
        {
          "heading": "Pamumuhunan, pagpaparehistro, at pahintulot sa operasyon",
          "paragraphs": [
            "Kailangang tukuyin ang proseso ng dayuhang pamumuhunan at pagpaparehistro ayon sa uri ng pamumuhunan. May mga larangang nangangailangan ng pahintulot bago magparehistro at maaari ring mangailangan ng hiwalay na permit sa operasyon. Ang pagpaparehistro ng kumpanya ay hindi pahintulot para sa lahat ng uri ng gawain."
          ],
          "sources": [
            "investment"
          ]
        },
        {
          "heading": "Mga usapin bago maglipat ng kapital",
          "paragraphs": [
            "Mula sa paglalarawan ng operasyon, pagmamay-ari, at planong lokasyon, matutukoy ng abogado ang mga usaping kailangang suriin bago ihanda ang aplikasyon. Maaari ring saklawin ng napagkasunduang trabaho ang kontrata sa pag-upa, kasunduan sa kasosyo, at paggamit ng tatak.",
            "Kung magtatrabaho sa Taiwan ang mamumuhunan o tagapamahala, hiwalay na sinusuri ang kanyang karapatang magtrabaho. Hindi ito kusang ibinibigay ng pagpaparehistro ng kumpanya."
          ],
          "sources": [
            "work"
          ]
        },
        {
          "heading": "Impormasyon para sa unang pag-uusap",
          "paragraphs": [
            "Maaaring ilagay sa unang email ang uri ng negosyo, kumpanyang magulang o mamumuhunan, pagmamay-ari, at planong pagsisimula. Ilarawan muna ang hawak na mga dokumento; hindi kailangang magpadala ng orihinal na pagkakakilanlan sa unang pakikipag-ugnayan."
          ],
          "items": [
            "Produkto o serbisyong ilalaan sa Taiwan, mga kliyente, at planong paraan ng operasyon",
            "Pinag-iisipang anyo ng negosyo, lokasyon, at kapital kung natukoy na",
            "Mga usapin sa pagkuha ng empleyado, kontrata, o permit na alam na ng kumpanya"
          ]
        }
      ]
    },
    "debt-collection": {
      "title": "Pagsingil ng utang sa Taiwan",
      "description": "Mga dokumento ng transaksiyon, payment order, at pagpili ng hakbang kapag hindi nagbayad ang kasosyo sa Taiwan.",
      "intro": "Hindi pareho ang pinatutunayan ng invoice, kontrata, at katibayan ng paghahatid. Kailangang makita kung sino ang may pananagutang magbayad, aling halaga ang takda nang bayaran, at kung natupad ang katumbas na obligasyon ng naniningil.",
      "sections": [
        {
          "heading": "Pananagutan at aktuwal na makokolekta",
          "paragraphs": [
            "Maaaring suriin ng abogado ang kontrata, palitan ng mensahe, at kasaysayan ng pagbabayad para timbangin ang demandang magbayad, negosasyon, o proseso sa hukuman. Hiwalay na tanong ang pagkakaroon ng ebidensiya ng utang at ang posibilidad na aktuwal na makasingil.",
            "Nakaaapekto sa mungkahing hakbang ang legal na pangalan at address ng may utang, kasunduan sa pagresolba ng alitan, bahagyang bayad, at mga ari-ariang alam nang mayroon siya. Walang pangakong mababawi ang buong halaga o matatapos ang usapin sa isang takdang panahon."
          ]
        },
        {
          "heading": "Kung kailan hindi magagamit ang payment order",
          "paragraphs": [
            "Hindi magagamit ang proseso ng payment order kapag hindi pa natutupad ng aplikante ang katumbas na obligasyong dapat niyang gawin, o kapag kailangang ihatid ang order sa ibang bansa o sa pamamagitan ng pampublikong abiso."
          ],
          "sources": [
            "civil"
          ]
        },
        {
          "heading": "Dalawampung araw mula sa paghahatid",
          "paragraphs": [
            "Maaaring tumutol ang may utang nang walang ibinibigay na dahilan sa loob ng 20 araw mula sa wastong paghahatid ng payment order. Kapag nasa oras at naaayon sa batas ang pagtutol, nawawalan ng bisa ang order sa bahaging tinututulan; itinuturing na paghahain ng kaso o paghingi ng mediation ang aplikasyon."
          ],
          "sources": [
            "payment"
          ]
        },
        {
          "heading": "Mga hawak na dokumento",
          "paragraphs": [
            "Sa unang mensahe, ilagay ang halaga at salapi, takdang araw ng bayad, pangalan ng may utang, at kaugnay na mga petsa. Makikita sa kontrata, purchase order, resibo ng paghahatid, invoice, mensahe, at katibayan ng bayad kung ano pa ang hindi nababayaran. Kung may natanggap nang sulat ng hukuman o abiso ng deadline, sabihin kung kailan ito natanggap."
          ]
        }
      ]
    }
  },
  "th": {
    "heading": "ข้อมูลสำหรับธุรกิจ",
    "relatedLabel": "บทความที่เกี่ยวข้อง",
    "englishLabel": "ข้อมูลภาษาอังกฤษ",
    "languageNote": "หน้านี้เป็นภาษาไทย การปรึกษากับทนายความใช้ภาษาอังกฤษ จีน ญี่ปุ่น หรือเกาหลี โดยไม่ได้รับประกันว่าจะจัดหาล่ามให้ได้",
    "company-setup": {
      "title": "การจัดตั้งบริษัทในไต้หวัน",
      "description": "รูปแบบการดำเนินธุรกิจ เอกสารของผู้ลงทุน และงานกฎหมายสำหรับบริษัทต่างชาติที่ต้องการประกอบธุรกิจในไต้หวัน",
      "intro": "บริษัทลูก สาขา และสำนักงานตัวแทนเป็นรูปแบบที่แตกต่างกัน การเลือกรูปแบบต้องพิจารณากิจกรรมที่จะทำในไต้หวัน โครงสร้างผู้ลงทุน และบทบาทของบริษัทแม่ประกอบกัน",
      "sections": [
        {
          "heading": "การลงทุน การจดทะเบียน และใบอนุญาตเฉพาะธุรกิจ",
          "paragraphs": [
            "ควรพิจารณาขั้นตอนการลงทุนต่างชาติและการจดทะเบียนตามรูปแบบการลงทุน ธุรกิจบางประเภทต้องได้รับความเห็นชอบก่อนจดทะเบียน และอาจต้องมีใบอนุญาตดำเนินกิจการแยกต่างหากด้วย การจดทะเบียนบริษัทจึงไม่ได้อนุญาตให้ประกอบกิจกรรมทุกประเภท"
          ],
          "sources": [
            "investment"
          ]
        },
        {
          "heading": "ข้อมูลก่อนโอนเงินทุน",
          "paragraphs": [
            "รายละเอียดกิจการ โครงสร้างผู้ถือหุ้น และสถานที่ตั้งที่วางแผนไว้ช่วยให้ทนายความระบุประเด็นที่ต้องตรวจสอบก่อนเตรียมคำขอ สัญญาเช่า ข้อตกลงกับคู่ค้า และการใช้เครื่องหมายการค้าอาจอยู่ในขอบเขตงานที่ตกลงกันด้วย",
            "หากผู้ลงทุนหรือผู้จัดการจะทำงานในไต้หวัน ต้องตรวจสอบสิทธิในการทำงานของบุคคลนั้นแยกต่างหาก การจดทะเบียนบริษัทไม่ได้ให้สิทธิทำงานโดยอัตโนมัติ"
          ],
          "sources": [
            "work"
          ]
        },
        {
          "heading": "ข้อมูลสำหรับการติดต่อครั้งแรก",
          "paragraphs": [
            "อีเมลฉบับแรกอาจระบุประเภทธุรกิจ บริษัทแม่หรือผู้ลงทุน โครงสร้างการถือหุ้น และกำหนดเริ่มดำเนินการ เพียงอธิบายว่ามีเอกสารใดอยู่แล้ว โดยยังไม่ต้องส่งเอกสารยืนยันตัวตนฉบับจริงในการติดต่อครั้งแรก"
          ],
          "items": [
            "สินค้าหรือบริการที่จะเสนอในไต้หวัน กลุ่มลูกค้า และรูปแบบการดำเนินงาน",
            "รูปแบบกิจการที่กำลังพิจารณา สถานที่ตั้ง และเงินทุนโดยประมาณหากทราบแล้ว",
            "ประเด็นการจ้างงาน สัญญา หรือใบอนุญาตที่บริษัททราบอยู่แล้ว"
          ]
        }
      ]
    },
    "debt-collection": {
      "title": "การติดตามหนี้ในไต้หวัน",
      "description": "เอกสารการค้า คำสั่งให้ชำระเงิน และการประเมินแนวทางเมื่อคู่ค้าในไต้หวันยังไม่ชำระหนี้",
      "intro": "ใบแจ้งหนี้ สัญญา และหลักฐานส่งมอบใช้ยืนยันคนละประเด็น เอกสารต้องแสดงว่าใครมีหน้าที่จ่าย ยอดใดถึงกำหนดแล้ว และผู้เรียกร้องได้ปฏิบัติหน้าที่ตอบแทนของตนหรือยัง รวมถึงส่วนที่ลูกหนี้โต้แย้ง",
      "sections": [
        {
          "heading": "สิทธิเรียกร้องกับโอกาสได้รับเงินคืน",
          "paragraphs": [
            "ทนายความอาจตรวจสอบสัญญา การติดต่อระหว่างคู่กรณี และประวัติชำระเงิน เพื่อประเมินการทวงถาม การเจรจา หรือกระบวนการศาล หลักฐานว่ามีหนี้กับโอกาสได้รับเงินจริงเป็นประเด็นที่ต้องประเมินแยกกัน",
            "ชื่อและที่อยู่ตามกฎหมายของลูกหนี้ ข้อกำหนดระงับข้อพิพาท การชำระบางส่วน และทรัพย์สินที่ทราบ อาจมีผลต่อแนวทางที่เสนอ ไม่มีการรับประกันว่าจะเรียกคืนได้เต็มจำนวนหรือเสร็จภายในระยะเวลาตายตัว"
          ]
        },
        {
          "heading": "ข้อจำกัดของคำสั่งให้ชำระเงิน",
          "paragraphs": [
            "ไม่อาจใช้กระบวนการคำสั่งให้ชำระเงินได้ หากผู้ยื่นคำขอยังไม่ได้ปฏิบัติหน้าที่ตอบแทนที่ตนต้องทำ หรือหากต้องส่งคำสั่งในต่างประเทศหรือโดยประกาศต่อสาธารณะ"
          ],
          "sources": [
            "civil"
          ]
        },
        {
          "heading": "การคัดค้านหลังได้รับคำสั่ง",
          "paragraphs": [
            "ลูกหนี้คัดค้านได้โดยไม่ต้องระบุเหตุผลภายใน 20 วันหลังส่งคำสั่งให้ชำระเงินโดยชอบ การคัดค้านที่ชอบด้วยกฎหมายและยื่นทันเวลาทำให้คำสั่งไม่มีผลเฉพาะส่วนที่คัดค้าน และให้ถือคำขอเป็นการฟ้องคดีหรือคำขอไกล่เกลี่ย"
          ],
          "sources": [
            "payment"
          ]
        },
        {
          "heading": "เอกสารที่มีอยู่แล้ว",
          "paragraphs": [
            "ในการติดต่อครั้งแรก ระบุจำนวนเงิน สกุลเงิน วันครบกำหนด ชื่อลูกหนี้ และวันที่เกี่ยวข้อง สัญญา ใบสั่งซื้อ หลักฐานส่งมอบ ใบแจ้งหนี้ ข้อความ และหลักฐานชำระเงินช่วยแสดงยอดที่ยังค้าง หากได้รับเอกสารศาลหรือแจ้งกำหนดเวลาแล้ว ให้ระบุวันที่ได้รับด้วย"
          ]
        }
      ]
    }
  }
};
