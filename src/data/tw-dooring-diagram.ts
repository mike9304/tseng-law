import type { TrafficDiagram } from './traffic-diagrams';

export const TW_DOORING_DIAGRAM = {
  "kind": "video",
  "playback": "manual",
  "playbackTools": true,
  "id": "dooring-hypothetical",
  "mp4": "/videos/traffic/tw-dooring.mp4",
  "webm": "/videos/traffic/tw-dooring.webm",
  "mobileMp4": "/videos/traffic/tw-dooring-mobile.mp4",
  "mobileWebm": "/videos/traffic/tw-dooring-mobile.webm",
  "poster": "/images/traffic/tw-dooring-poster.webp",
  "mobilePoster": "/images/traffic/tw-dooring-poster-mobile.webp",
  "width": 1600,
  "height": 1080,
  "mobileWidth": 1080,
  "mobileHeight": 1350,
  "durationSeconds": 12,
  "copy": {
    "zh-hant": {
      "alt": "固定俯視假設示意。道路靠右通行，橙色小客車 A 停在右側停車格內，左前車門（駕駛座側）向車道打開。藍綠色機車 B 從同向後方接近。車門以前端鉸鏈為軸旋轉，扇形範圍與機車點線路徑相交；最後車門與機車仍有間隔，未呈現接觸。假設示意，非事故重建。",
      "caption": "A 小客車停在圖中的路邊停車格內，駕駛座車門朝車道方向打開。B 機車由後方沿同向路徑接近；車門掃過的範圍進入該路徑，畫面在接觸前定格。停車位置與開門時的注意義務，須分別判斷。",
      "legend": "橙色圓標 A 是停放的小客車；藍綠色方標 B 是機車。扇形及細線表示車門掃過的空間，點線表示機車的假設行進路徑，均不是道路標線。白色箭頭表示本圖設定的通行方向。",
      "assumption": "假設示意，非事故重建。停車格、車道、車型、尺寸、位置、車門角度、間距、路徑及動畫時間均為說明用假設，不是法律安全標準。本圖不認定該停車位置合法，也不判定責任或過失比例。格內停放不代表開門時無須注意周圍人車。 本圖只示意駕駛座車門向車道開啟，未演示乘客上下車、從車外開門上車或關門；不表示注意義務只限於駕駛人或下車。相關規則與個案說明見本文。 定格是方便觀察的編輯安排，不表示騎士已成功煞停或採取了特定避險動作。未呈現碰撞、傷害或真實事故。",
      "videoDescription": "無聲假設動畫：A停在圖中的右側停車格，左前車門逐漸向車道開啟；B沿同向點線由後方接近。扇形顯示車門掃過空間，與B路徑相交。最後在接觸前編輯定格，再以淡色轉場回到起始畫面。定格不表示騎士煞停成功，轉場不是倒車或關門動作。尺寸、角度、間距、速度與影片時間皆為示意設定，不能據此計算過失比例。",
      "stages": {
        "label": "四階段靜態圖：車門未開、向外開、掃過路徑、接觸前定格",
        "alts": [
          "A 停在圖中的路邊停車格內，駕駛座車門尚未打開。B 從同向後方接近，點線路徑與關閉的車門分開。假設示意，非事故重建。",
          "A 的左前門以前端鉸鏈為軸向車道打開，扇形顯示逐漸增加的掃過空間。B 仍位於車後方。假設示意，非事故重建。",
          "車門打開後，扇形掃過範圍與 B 的假設行進路徑相交。B 正從後方接近，尚未碰到車門。假設示意，非事故重建。",
          "畫面在接觸前定格。A 車門伸入車道及 B 的假設路徑，B 與車門仍有可見間隔。此為觀察用定格，不表示騎士已成功煞停。假設示意，非事故重建。"
        ]
      }
    }
  },
  "stills": [
    {
      "poster": "/images/traffic/tw-dooring-step-01.webp",
      "mobilePoster": "/images/traffic/tw-dooring-step-01-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-dooring-step-02.webp",
      "mobilePoster": "/images/traffic/tw-dooring-step-02-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-dooring-step-03.webp",
      "mobilePoster": "/images/traffic/tw-dooring-step-03-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-dooring-step-04.webp",
      "mobilePoster": "/images/traffic/tw-dooring-step-04-mobile.webp"
    }
  ]
} as const satisfies TrafficDiagram;
