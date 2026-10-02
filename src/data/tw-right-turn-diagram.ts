import type { TrafficDiagram } from './traffic-diagrams';

/** Reviewed native-only hypothetical illustration; playback requires explicit user action. */
export const TW_RIGHT_TURN_DIAGRAM = {
  "kind": "video",
  "playback": "manual",
  "id": "right-turn-hypothetical",
  "mp4": "/videos/traffic/tw-right-turn.mp4",
  "webm": "/videos/traffic/tw-right-turn.webm",
  "mobileMp4": "/videos/traffic/tw-right-turn-mobile.mp4",
  "mobileWebm": "/videos/traffic/tw-right-turn-mobile.webm",
  "poster": "/images/traffic/tw-right-turn-poster.webp",
  "mobilePoster": "/images/traffic/tw-right-turn-poster-mobile.webp",
  "width": 1600,
  "height": 1080,
  "mobileWidth": 1080,
  "mobileHeight": 1350,
  "durationSeconds": 12,
  "copy": {
    "zh-hant": {
      "alt": "俯視假設圖：橙色小客車 A 向右轉，右方向燈亮起；藍綠色機車 B 位於其右後側，朝前方直行。兩車尚有間隔，畫面標示「交會前定格」。彩色點線為假設路徑，非事故重建。",
      "caption": "A 在 B 的左前方開啟右方向燈，接著開始右轉。B 沿圖中的直行路徑前進；畫面在兩條路徑的交會處之前定格，未呈現接觸。",
      "legend": "橙色 A 為小客車，藍綠色 B 為機車。橘黃色閃光表示 A 的右方向燈；彩色點線為假設行進路徑，不是道路標線。白色箭頭僅表示本圖設定的行進方向。",
      "assumption": "假設示意，非事故重建。車道配置、車型、尺寸、前後位置、路徑、速度與時間均為說明用假設，不是法律安全標準。實際行車規則須依現場標誌、標線、號誌及專用車道等配置判斷。本圖未設定號誌狀態，不表示機車永遠優先，也不表示右轉車必負全部責任。",
      "videoDescription": "這段12秒無聲動畫依序顯示右方向燈開啟、開始右轉、兩車路徑接近與交會前定格。橙色小客車 A 從藍綠色機車 B 的左前方開始右轉，B 沿假設路徑直行；畫面沒有碰撞或受傷。定格與循環轉場是閱讀安排，並非實際反應時間或煞停結果。圖中沒有三十公尺尺度、號誌狀態或特定車道管制，不能據此認定準時打燈、違規、優先順序或過失比例。此為一般小客車與機車的假設示意，不呈現大型車內輪差或視野死角。",
      "stages": {
        "label": "四階段靜態圖：右方向燈、開始右轉、路徑接近、交會前定格",
        "alts": [
          "A 小客車位於 B 機車的左前方，開啟右方向燈；兩車朝同一方向。假設示意，非事故重建。",
          "A 小客車已開始向右轉動，B 機車保持直行；定格顯示兩車的前後位置。假設示意，非事故重建。",
          "A 小客車朝右側路口轉向，B 機車沿直行路徑前進，兩車仍未接觸。彩色點線是說明用假設路徑。假設示意，非事故重建。",
          "A 小客車與 B 機車停在兩條假設路徑的交會處之前，車體之間仍有間隔，未呈現碰撞。假設示意，非事故重建。"
        ]
      }
    }
  },
  "stills": [
    {
      "poster": "/images/traffic/tw-right-turn-step-01.webp",
      "mobilePoster": "/images/traffic/tw-right-turn-step-01-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-right-turn-step-02.webp",
      "mobilePoster": "/images/traffic/tw-right-turn-step-02-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-right-turn-step-03.webp",
      "mobilePoster": "/images/traffic/tw-right-turn-step-03-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-right-turn-step-04.webp",
      "mobilePoster": "/images/traffic/tw-right-turn-step-04-mobile.webp"
    }
  ]
} as const satisfies TrafficDiagram;
