import type { TrafficDiagram } from './traffic-diagrams';

export const TW_STARTING_ENTRY_DIAGRAM = {
  "kind": "video",
  "playback": "manual",
  "playbackTools": true,
  "id": "starting-entry-hypothetical",
  "mp4": "/videos/traffic/tw-starting-entry.mp4",
  "webm": "/videos/traffic/tw-starting-entry.webm",
  "mobileMp4": "/videos/traffic/tw-starting-entry-mobile.mp4",
  "mobileWebm": "/videos/traffic/tw-starting-entry-mobile.webm",
  "poster": "/images/traffic/tw-starting-entry-poster.webp",
  "mobilePoster": "/images/traffic/tw-starting-entry-poster-mobile.webp",
  "width": 1600,
  "height": 1080,
  "mobileWidth": 1080,
  "mobileHeight": 1350,
  "durationSeconds": 12,
  "copy": {
    "zh-hant": {
      "alt": "假設起駛情境的俯視圖：橙色 A 車從右側淺色起步區進入車道，朝畫面上方轉向；藍綠色 B 車在同一車道後方，兩車尚有間隔。圖上標示「假設示意，非事故重建」。",
      "caption": "本圖以 A 車從路邊停放處起駛作為說明前提。A 先保持靜止並閃方向燈，之後進入 B 正在行進的車道，畫面在兩車接觸前定格。這不是完成觀察或禮讓的操作示範，也不是本文兩件判決的事故重建。",
      "legend": "A：橙色、圓形字母標記的小客車，從畫面右側起步區進入車道。 B：藍綠色、方形字母標記的小客車，沿車道向畫面上方行進。 橙色與藍綠色點線是本例假設的行進路徑，不是道路標線。",
      "assumption": "本例以路邊停放車起駛進入道路為前提；淺色起步區是說明設定，不據圖形認定真實土地、停車場出口或交岔路口的法律性質。 本例不是新竹或臺中判決的重建；兩件實案均涉及機車，本圖只有兩輛小客車。圖中未呈現建築物、遮擋物或反射鏡，不能拿來推論臺中案的視線。 方向燈閃爍及「觀察周圍」字幕不證明已完成注意或禮讓。89條要求起駛前顯示方向燈，注意前後左右有無障礙或車輛行人，並讓行進中的車輛行人優先通行；本圖不是依規定完成全套動作的示範。 未畫行人不代表無須注意行人。 車型、尺寸、位置、曲線、車距與播放時間都是說明安排，不是實際事故數值、法定安全距離、觀察時間或過失比例。 接觸前定格是編輯安排，不能據此判定煞停成功、是否已完成進入車道，或誰應負責；末段淡出重設不是倒車。",
      "videoDescription": "固定俯視畫面中，橙色 A 車起初停在右側淺色起步區，車頭朝左，方向燈閃爍；藍綠色 B 車沿車道向上行進。A 隨後沿橙色彎曲點線進入車道，逐漸轉向上方，與 B 的行進路徑重疊。兩車排列成 A 前、B 後時，畫面在尚有間隔處定格，沒有呈現碰撞。末段淡出後重設，不是車輛倒退。畫面沒有呈現駕駛實際察看前後左右的動作，不能據此認定已完成注意或讓行。",
      "stages": {
        "label": "停住，觀察周圍（畫面標題） / 開始進入車道 / 行進路徑交會 / 接觸前定格",
        "alts": [
          "A 停在右側起步區，B 位於車道後方。「觀察周圍」是本階段的說明文字，畫面未呈現駕駛實際察看各方向。假設示意，非事故重建。",
          "A 從右側起步區向左移動，車頭開始朝畫面上方轉向，B 沿車道向上行進。假設示意，非事故重建。",
          "A 車身已進入 B 的行進路徑，B 位於後方，兩車尚未接觸。假設示意，非事故重建。",
          "A 與 B 朝同一方向排列，A 在前、B 在後，仍有可見間隔；這是編輯定格，不表示駕駛已成功煞停。假設示意，非事故重建。"
        ]
      }
    }
  },
  "stills": [
    {
      "poster": "/images/traffic/tw-starting-entry-step-01.png",
      "mobilePoster": "/images/traffic/tw-starting-entry-step-01-mobile.png"
    },
    {
      "poster": "/images/traffic/tw-starting-entry-step-02.png",
      "mobilePoster": "/images/traffic/tw-starting-entry-step-02-mobile.png"
    },
    {
      "poster": "/images/traffic/tw-starting-entry-step-03.png",
      "mobilePoster": "/images/traffic/tw-starting-entry-step-03-mobile.png"
    },
    {
      "poster": "/images/traffic/tw-starting-entry-step-04.png",
      "mobilePoster": "/images/traffic/tw-starting-entry-step-04-mobile.png"
    }
  ]
} as const satisfies TrafficDiagram;
