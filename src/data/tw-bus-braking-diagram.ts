import type { TrafficDiagram } from './traffic-diagrams';

export const TW_BUS_BRAKING_DIAGRAM = {
  "kind": "video",
  "playback": "manual",
  "playbackTools": true,
  "id": "bus-braking-hypothetical",
  "width": 1600,
  "height": 1080,
  "mobileWidth": 1080,
  "mobileHeight": 1920,
  "durationSeconds": 16,
  "mp4": "/videos/traffic/bus-braking-landscape.mp4",
  "webm": "/videos/traffic/bus-braking-landscape.webm",
  "poster": "/images/traffic/bus-braking-landscape-poster.png",
  "mobileMp4": "/videos/traffic/bus-braking-portrait.mp4",
  "mobileWebm": "/videos/traffic/bus-braking-portrait.webm",
  "mobilePoster": "/images/traffic/bus-braking-portrait-poster.png",
  "copy": {
    "zh-hant": {
      "alt": "概念分割示意：灰色公車在右側車道煞車，前方轎車與公車保持間隔；另一畫面中，一名無可辨識臉部的成年乘客握住扶桿，身體向前傾。非本案重建。",
      "caption": "概念示意，非本案重建。片中的小客車及道路配置均為合成例示，並非判決所載機車或現場道路的重建。兩個畫面同步呈現公車煞車、乘客向前傾與回穩，沒有呈現跌倒或受傷；片末分別提出駕駛有無過失、運送人是否負責的問題，未作責任判斷。",
      "legend": "公車煞車與乘客動作",
      "assumption": "概念示意，非本案重建",
      "videoDescription": "這是一段 16 秒、無聲的 3D 教育示意。橫式左邊、直式上方是車外；另一邊是以剖視方式呈現的車內。全程標示「概念示意，非本案重建」。0 至 3 秒，灰色公車在右側車道向前行駛，沙色轎車從前方右側支路轉入。車內一名穿著衣褲、沒有可辨識五官的成年乘客站在走道上，手握黃色扶桿。3 至 6 秒，公車漸進煞停，兩車保持間隔；乘客上身在煞車開始後向車頭方向傾斜，手仍接觸扶桿，之後逐漸回穩。畫面沒有跌落、碰撞或傷勢。7 秒起兩個場景停住，分別顯示「為什麼煞車？」及「何時、如何失去平衡？」。11 至 16 秒，文字改為「駕駛有無過失？」及「運送人是否負責？」。片中的小客車及道路配置均為合成例示，並非判決所載機車或現場道路的重建。畫面只呈現前傾與回穩，不代表已經跌倒或受傷；本文對摔倒受傷的敘述，以所引判決為依據。本片的道路、車速、車距、姿勢及動作時間均為製作假設，不是判決事實、事故重建、人體受傷模型或因果關係證明；扶桿接觸只是此示意的安排，不描述當事人的行為。實際法律意義須與原稿及判決另行核對。",
      "stages": {
        "label": "靜態步驟",
        "alts": [
          "步驟 1：行進。概念示意，非本案重建。",
          "步驟 2：煞車與前傾。概念示意，非本案重建。",
          "步驟 3：暫停觀察。概念示意，非本案重建。",
          "步驟 4：法律問題。概念示意，非本案重建。"
        ]
      }
    }
  },
  "stills": [
    {
      "poster": "/images/traffic/bus-braking-landscape-stage-01.png",
      "mobilePoster": "/images/traffic/bus-braking-portrait-stage-01.png"
    },
    {
      "poster": "/images/traffic/bus-braking-landscape-stage-02.png",
      "mobilePoster": "/images/traffic/bus-braking-portrait-stage-02.png"
    },
    {
      "poster": "/images/traffic/bus-braking-landscape-stage-03.png",
      "mobilePoster": "/images/traffic/bus-braking-portrait-stage-03.png"
    },
    {
      "poster": "/images/traffic/bus-braking-landscape-stage-04.png",
      "mobilePoster": "/images/traffic/bus-braking-portrait-stage-04.png"
    }
  ]
} as const satisfies TrafficDiagram;
