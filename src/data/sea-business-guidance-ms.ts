import type { SeaBusinessCopy } from '@/data/sea-business-guidance';

export const seaBusinessMs: SeaBusinessCopy = {
  heading: 'Panduan untuk syarikat',
  relatedLabel: 'Bacaan berkaitan',
  englishLabel: 'Maklumat dalam bahasa Inggeris',
  languageNote:
    'Halaman ini ditulis dalam bahasa Melayu. Perundingan dengan peguam dijalankan dalam bahasa Inggeris, Cina, Jepun atau Korea; tiada perundingan dalam bahasa Melayu dan kami tidak berjanji untuk menyediakan jurubahasa.',
  'company-setup': {
    title: 'Penubuhan syarikat di Taiwan',
    description:
      'Pilihan bentuk perniagaan, dokumen pelabur dan urusan perundangan bagi syarikat asing yang akan beroperasi di Taiwan.',
    intro:
      'Rancangan jualan, struktur pelabur dan peranan syarikat induk menentukan bentuk kehadiran yang perlu dipertimbangkan di Taiwan. Anak syarikat, pejabat cawangan dan pejabat perwakilan merupakan bentuk yang berbeza, bukan sekadar nama lain bagi susunan yang sama.',
    sections: [
      {
        heading: 'Pelaburan dan lesen aktiviti perniagaan',
        paragraphs: [
          'Prosedur pelaburan asing dan pendaftaran perniagaan perlu ditentukan mengikut bentuk pelaburannya. Bidang tertentu memerlukan kelulusan sebelum pendaftaran dan mungkin juga memerlukan lesen operasi berasingan. Pendaftaran syarikat bukan kebenaran untuk menjalankan setiap jenis aktiviti.',
        ],
        sources: ['investment'],
      },
      {
        heading: 'Sebelum modal dipindahkan',
        paragraphs: [
          'Huraian aktiviti, struktur pemilikan dan cadangan alamat membolehkan peguam mengenal pasti perkara yang perlu disemak sebelum dokumen disediakan. Perjanjian penyewaan, kontrak dengan rakan niaga dan penggunaan cap dagangan juga boleh disemak dalam skop kerja yang dipersetujui.',
          'Jika pelabur atau pengurus akan bekerja di Taiwan, hak individu tersebut untuk bekerja perlu disemak secara berasingan. Pendaftaran syarikat dengan sendirinya tidak memberikan hak bekerja.',
        ],
        sources: ['work'],
      },
      {
        heading: 'Maklumat untuk perbincangan awal',
        paragraphs: [
          'E-mel awal boleh menyatakan bidang perniagaan, syarikat induk atau pelabur, susunan pemilikan dan jadual pelaksanaan yang dirancang. Terangkan dokumen yang tersedia; dokumen pengenalan diri asal tidak perlu dihantar semasa pertama kali berhubung.',
        ],
        items: [
          'Produk atau perkhidmatan yang akan ditawarkan di Taiwan, pelanggan dan cara operasinya',
          'Bentuk kehadiran yang dipertimbangkan, alamat dan anggaran modal jika sudah diketahui',
          'Isu pengambilan pekerja, kontrak atau pelesenan yang sudah diketahui oleh syarikat',
        ],
      },
    ],
  },
  'debt-collection': {
    title: 'Kutipan hutang di Taiwan',
    description:
      'Dokumen urus niaga, permohonan perintah pembayaran dan penilaian pilihan bagi menangani hutang yang belum dibayar oleh rakan niaga di Taiwan.',
    intro:
      'Hutang yang belum dibayar perlu dikaitkan dengan kontrak dan bukti pelaksanaan kewajipan. Dokumen tersebut menunjukkan pihak yang wajib membayar, bahagian yang telah sampai tempoh bayaran, serta sama ada penghutang mempertikaikan penghantaran barang, kerja atau jumlah tuntutan.',
    sections: [
      {
        heading: 'Menilai tuntutan dan kemungkinan pemulihan hutang',
        paragraphs: [
          'Peguam boleh menyemak kontrak, surat-menyurat dan rekod pembayaran bagi menilai tuntutan bayaran, rundingan atau prosiding mahkamah. Bukti kewujudan hutang dan kemungkinan menerima wang secara sebenar perlu dinilai secara berasingan.',
          'Nama di sisi undang-undang serta alamat penghutang, klausa penyelesaian pertikaian, bayaran sebahagian dan aset yang diketahui boleh mempengaruhi langkah yang dicadangkan. Tiada jaminan bahawa keseluruhan hutang dapat diperoleh semula atau kes selesai dalam tempoh yang tetap.',
        ],
      },
      {
        heading: 'Had penggunaan perintah pembayaran',
        paragraphs: [
          'Prosedur perintah pembayaran tidak boleh digunakan jika kewajipan timbal balik yang mesti dipenuhi oleh pemohon belum dilaksanakan, atau jika perintah tersebut mesti disampaikan di luar negara atau melalui notis awam.',
        ],
        sources: ['civil'],
      },
      {
        heading: 'Bantahan selepas perintah disampaikan',
        paragraphs: [
          'Penghutang boleh mengemukakan bantahan tanpa menyatakan alasan dalam tempoh 20 hari selepas perintah pembayaran disampaikan secara sah. Bantahan yang sah dan menepati tempoh menyebabkan perintah itu tidak lagi berkuat kuasa setakat bahagian yang dipertikaikan; permohonan tersebut kemudiannya dianggap sebagai tindakan sivil atau permohonan pengantaraan.',
        ],
        sources: ['payment'],
      },
      {
        heading: 'Dokumen yang sudah tersedia',
        paragraphs: [
          'Dalam mesej pertama, nyatakan jumlah dan mata wang, tarikh akhir bayaran, nama penghutang serta tarikh yang berkaitan dengan urus niaga tersebut. Kontrak, pesanan, bukti penghantaran, invois, mesej dan bukti bayaran membantu menjelaskan baki tuntutan yang masih belum dibayar. Jika sudah ada surat mahkamah atau notis tarikh akhir, sertakan tarikh penerimaannya.',
        ],
      },
    ],
  },
};
