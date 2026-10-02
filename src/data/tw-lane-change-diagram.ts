import type { TrafficDiagram } from './traffic-diagrams';

/** Original hypothetical Blender illustration, authored for this Taiwan-only column. */
export const TW_LANE_CHANGE_DIAGRAM = {
  "kind": "video",
  "id": "lane-change-hypothetical",
  "mp4": "/videos/traffic/tw-lane-change.mp4",
  "webm": "/videos/traffic/tw-lane-change.webm",
  "mobileMp4": "/videos/traffic/tw-lane-change-mobile.mp4",
  "mobileWebm": "/videos/traffic/tw-lane-change-mobile.webm",
  "poster": "/images/traffic/tw-lane-change-poster.webp",
  "mobilePoster": "/images/traffic/tw-lane-change-poster-mobile.webp",
  "width": 1600,
  "height": 1080,
  "mobileWidth": 1080,
  "mobileHeight": 1350,
  "durationSeconds": 12,
  "copy": {
    "zh-hant": {
      "alt": "俯視同向兩車道。橙色 A 車開啟左方向燈後向左變換車道，左前輪越過車道線，車身仍跨在兩車道之間；藍綠色 B 車在左側原車道直行。畫面停在兩車接觸前。假設示意，非事故重建。",
      "legend": "A 車為橙色、圓形字母標記，向左變換車道；B 車為藍綠色、方形字母標記，在原車道直行。橘黃色閃光表示 A 車的左方向燈，白色箭頭表示同向行進。A、B 不代表判決當事人。",
      "caption": "A 車打左方向燈後向左移動。圖中依序顯示車輪跨線、車身尚未完全進入左側車道，並在接觸前定格。畫面未呈現前方障礙物、碰撞或損害。",
      "assumption": "假設示意，非事故重建。車道、車型、尺寸、位置、速度與時間皆為說明用假設，並非法律安全標準，也不表示與任何判決的事故位置、速度或經過相同。方向燈或接觸部位不會自動決定責任比例。",
      "stages": {
        "label": "四階段靜態圖：打燈、車輪跨線、車身跨道、接觸前定格",
        "alts": [
          "第1階段：橙色 A 車在右側車道開啟左方向燈，藍綠色 B 車在左側車道直行。假設示意，非事故重建。",
          "第2階段：A 車左前輪已越過車道線，B 車在左側車道繼續直行。假設示意，非事故重建。",
          "第3階段：A 車身仍跨在兩車道之間，尚未完全進入左側車道；B 車維持原車道直行。假設示意，非事故重建。",
          "第4階段：畫面在兩車接觸前定格，未呈現碰撞；A 車身尚未完全進入左側車道。假設示意，非事故重建。"
        ]
      }
    }
  },
  "stills": [
    {
      "poster": "/images/traffic/tw-lane-change-step-01.webp",
      "mobilePoster": "/images/traffic/tw-lane-change-step-01-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-lane-change-step-02.webp",
      "mobilePoster": "/images/traffic/tw-lane-change-step-02-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-lane-change-step-03.webp",
      "mobilePoster": "/images/traffic/tw-lane-change-step-03-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-lane-change-step-04.webp",
      "mobilePoster": "/images/traffic/tw-lane-change-step-04-mobile.webp"
    }
  ]
} as const satisfies TrafficDiagram;
