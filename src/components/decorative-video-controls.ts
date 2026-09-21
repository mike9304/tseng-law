import type { PublicLocale8 } from '@/lib/public-guidance';

export type DecorativeVideoControlLabels = {
  pause: string;
  play: string;
  replay: string;
};

export const DECORATIVE_VIDEO_CONTROL_LABELS = {
  ko: {
    pause: '영상 일시정지',
    play: '영상 재생',
    replay: '영상 다시 보기',
  },
  'zh-hant': {
    pause: '暫停影片',
    play: '播放影片',
    replay: '重新播放影片',
  },
  en: {
    pause: 'Pause video',
    play: 'Play video',
    replay: 'Replay video',
  },
  ja: {
    pause: '動画を一時停止',
    play: '動画を再生',
    replay: '動画をもう一度再生',
  },
  // WO-O22 B: the guidance languages reuse the labels their pack already ships
  // (`guidanceContent[locale].home.video*Label`), so the cinematic opening's
  // video controls are announced in the page language without new copy.
  vi: {
    pause: 'Tạm dừng video',
    play: 'Phát video',
    replay: 'Phát lại video',
  },
  id: {
    pause: 'Jeda video',
    play: 'Putar video',
    replay: 'Putar ulang video',
  },
  th: {
    pause: 'หยุดวิดีโอชั่วคราว',
    play: 'เล่นวิดีโอ',
    replay: 'เล่นวิดีโออีกครั้ง',
  },
  fil: {
    pause: 'I-pause ang video',
    play: 'I-play ang video',
    replay: 'I-play muli ang video',
  },
  ar: {
    pause: 'إيقاف الفيديو مؤقتًا',
    play: 'تشغيل الفيديو',
    replay: 'إعادة تشغيل الفيديو',
  },
  de: {
    pause: 'Video anhalten',
    play: 'Video abspielen',
    replay: 'Video erneut abspielen',
  },
  es: {
    pause: 'Pausar el vídeo',
    play: 'Reproducir el vídeo',
    replay: 'Volver a reproducir el vídeo',
  },
  fr: {
    pause: 'Mettre la vidéo en pause',
    play: 'Lire la vidéo',
    replay: 'Relire la vidéo',
  },
  pt: {
    pause: 'Pausar o vídeo',
    play: 'Reproduzir o vídeo',
    replay: 'Voltar a reproduzir o vídeo',
  },
  'zh-hans': {
    pause: '暂停影片',
    play: '播放影片',
    replay: '重新播放影片',
  },
  ms: {
    pause: 'Jeda video',
    play: 'Mainkan video',
    replay: 'Mainkan semula video',
  },
  ru: {
    pause: 'Приостановить видео',
    play: 'Воспроизвести видео',
    replay: 'Воспроизвести видео снова',
  },
  tr: {
    pause: 'Videoyu duraklat',
    play: 'Videoyu oynat',
    replay: 'Videoyu yeniden oynat',
  },
  it: {
    pause: 'Mettere in pausa il video',
    play: 'Riprodurre il video',
    replay: 'Riprodurre di nuovo il video',
  },
  nl: {
    pause: 'Video pauzeren',
    play: 'Video afspelen',
    replay: 'Video opnieuw afspelen',
  },
  pl: {
    pause: 'Wstrzymać wideo',
    play: 'Odtworzyć wideo',
    replay: 'Odtworzyć wideo ponownie',
  },
  hi: {
    pause: 'वीडियो रोकें',
    play: 'वीडियो चलाएँ',
    replay: 'वीडियो फिर चलाएँ',
  },
  sv: {
    pause: 'Pausa videon',
    play: 'Spela videon',
    replay: 'Spela videon igen',
  },
  da: {
    pause: 'Sæt videoen på pause',
    play: 'Afspil videoen',
    replay: 'Afspil videoen igen',
  },
  nb: {
    pause: 'Sett videoen på pause',
    play: 'Spill av videoen',
    replay: 'Spill av videoen på nytt',
  },
  fi: {
    pause: 'Keskeyttäkää video',
    play: 'Toistakaa video',
    replay: 'Toistakaa video uudelleen',
  },
  cs: { pause: 'Pozastavit video', play: 'Přehrát video', replay: 'Přehrát video znovu' },
  hu: { pause: 'Videó szüneteltetése', play: 'Videó lejátszása', replay: 'Videó újrajátszása' },
  ro: { pause: 'Opriți videoclipul', play: 'Redați videoclipul', replay: 'Redați din nou videoclipul' },
  uk: { pause: 'Зупинити відео', play: 'Відтворити відео', replay: 'Відтворити відео ще раз' },
  el: { pause: 'Παύση του βίντεο', play: 'Αναπαραγωγή του βίντεο', replay: 'Νέα αναπαραγωγή του βίντεο' },
  he: { pause: 'השהיית הסרטון', play: 'הפעלת הסרטון', replay: 'הפעלת הסרטון מחדש' },
  bn: {
    pause: 'ভিডিও থামান',
    play: 'ভিডিও চালান',
    replay: 'ভিডিও আবার চালান',
  },
  ur: {
    pause: 'ویڈیو روکیں',
    play: 'ویڈیو چلائیں',
    replay: 'ویڈیو پھر چلائیں',
  },
  fa: {
    pause: 'توقف ویدئو',
    play: 'پخش ویدئو',
    replay: 'پخش دوبارهٔ ویدئو',
  },
  my: { // SCAFFOLD(th)
    pause: 'หยุดวิดีโอชั่วคราว',
    play: 'เล่นวิดีโอ',
    replay: 'เล่นวิดีโออีกครั้ง',
  },
  ta: { // SCAFFOLD(hi)
    pause: 'वीडियो रोकें',
    play: 'वीडियो चलाएँ',
    replay: 'वीडियो फिर चलाएँ',
  },
  ne: { // SCAFFOLD(hi)
    pause: 'वीडियो रोकें',
    play: 'वीडियो चलाएँ',
    replay: 'वीडियो फिर चलाएँ',
  },
  km: { // SCAFFOLD(th)
    pause: 'หยุดวิดีโอชั่วคราว',
    play: 'เล่นวิดีโอ',
    replay: 'เล่นวิดีโออีกครั้ง',
  },
  mn: { // SCAFFOLD(ru)
    pause: 'Приостановить видео',
    play: 'Воспроизвести видео',
    replay: 'Воспроизвести видео снова',
  },
  sk: { pause: 'Pozastavit video', play: 'Přehrát video', replay: 'Přehrát video znovu' }, // SCAFFOLD(cs)
  bg: {
    pause: 'Пауза на видеото',
    play: 'Пуснете видеото',
    replay: 'Пуснете видеото отново',
  },
  hr: { pause: 'Pauzirajte videozapis', play: 'Pokrenite videozapis', replay: 'Ponovno pokrenite videozapis' },
  sr: { pause: 'Pozastavit video', play: 'Přehrát video', replay: 'Přehrát video znovu' }, // SCAFFOLD(cs)
  sl: { pause: 'Zaustavi video', play: 'Predvajaj video', replay: 'Predvajaj video znova' },
  lt: { pause: 'Pristabdyti vaizdo įrašą', play: 'Leisti vaizdo įrašą', replay: 'Leisti vaizdo įrašą iš naujo' },
  lv: { pause: 'Pozastavit video', play: 'Přehrát video', replay: 'Přehrát video znovu' }, // SCAFFOLD(cs)
  et: { pause: 'Pozastavit video', play: 'Přehrát video', replay: 'Přehrát video znovu' }, // SCAFFOLD(cs)
  ca: { pause: 'Pozastavit video', play: 'Přehrát video', replay: 'Přehrát video znovu' }, // SCAFFOLD(cs)
  is: { pause: 'Pozastavit video', play: 'Přehrát video', replay: 'Přehrát video znovu' }, // SCAFFOLD(cs)
} as const satisfies Record<PublicLocale8, DecorativeVideoControlLabels>;
