import type { TrafficDiagram } from './traffic-diagrams';

export const TW_FLASHING_JUNCTION_DIAGRAM = {
  "kind": "video",
  "playback": "manual",
  "playbackTools": true,
  "id": "flashing-red-yellow-hypothetical",
  "mp4": "/videos/traffic/tw-flashing-junction.mp4",
  "webm": "/videos/traffic/tw-flashing-junction.webm",
  "mobileMp4": "/videos/traffic/tw-flashing-junction-mobile.mp4",
  "mobileWebm": "/videos/traffic/tw-flashing-junction-mobile.webm",
  "poster": "/images/traffic/tw-flashing-junction-poster.webp",
  "mobilePoster": "/images/traffic/tw-flashing-junction-poster-mobile.webp",
  "width": 1600,
  "height": 1080,
  "mobileWidth": 1080,
  "mobileHeight": 1620,
  "durationSeconds": 28,
  "copy": {
    "zh-hant": {
      "alt": "假設示意，非事故重建。十字路口中，圓形標記 A 向北面對閃紅，方形標記 B 向東面對閃黃；A 未先停進入後，畫面在兩車接觸前定格。",
      "caption": "假設示意，非事故重建。A 向北面對閃紅，B 向東面對閃黃；圖中設定 B 的方向為幹線道。第一段 A 先停、讓 B 通過交會區，再以認為安全後續行的假設前進；第二段另設 A 未先停即進入的情境，並在兩車接觸前定格。B 仍應減速接近、注意安全、小心通過。兩段配時與位置都是假設，不據此判定責任比例。",
      "legend": "圓形標記 A 向北面對閃紅；方形標記 B 向東面對閃黃，圖中設定 B 的方向為幹線道。",
      "assumption": "假設示意，非事故重建。兩車、四向路口、右側通行、車道與停止線位置、車體尺寸及行進路徑均為說明用假設，未對應任何真實地點、判決或事故。 本圖設定東西向 B 所在方向為幹線道，A 所在方向面對閃紅；道路寬度與車身顏色不決定法律上的優先順序。 模型單位、位移及時間均為教學編排，不是實測公尺、車速、反應時間、煞車距離或法定安全間隔。 兩盞燈始終分屬不同接近方向，不是在同一方向先紅後黃。同步明暗僅為教學安排，不能推定實際號誌配時；定格時亮度也隨畫面停止。 圖中放大的號誌標籤、A／B 標記、文字引線和彩色點線是編輯註記，不是現場交通設施或法定路面標線。 未設定視線障礙、天候、行人或第三車；不能由本圖推定真實駕駛必然看見對方，亦不能推定必然可避讓。 16–18 秒是說明用比較轉場，隱藏車輛重新定位，不代表倒車或真實時間連續。 停止於接觸之前的定格是教學停格，不表示兩車在現實中能於該位置煞停。 5–7 秒、11–12 秒與最後 6 秒為教學停格。B 在停格中不動，不表示閃黃方向有一律停車的要求。 兩段配時均為假設；畫面中的速度變化不證明已履行減速或注意義務，兩段也不是僅改變 A 行為的單一變數實驗。",
      "videoDescription": "影片比較兩段假設。第一段 A 停在停止線前，等待 B 通過兩條路徑的交會區，再以認為安全後續行的設定前進。第二段 A 未先停便進入，結尾是接觸前的教學停格。A 的停等和全畫面教學停格不同；定格也不表示 B 有一律停車的義務或兩車能在現實中及時煞停。B 在兩段中都仍有減速接近、注意安全、小心通過的義務。道路、車輛、位置與配時皆是假設，不是事故重建或責任比例計算。",
      "stages": {
        "label": "六階段靜態圖",
        "alts": [
          "A 由南向北接近閃紅路口，B 由西向東接近閃黃路口。A 為圓形標記，B 為方形標記；本圖假設 B 所在方向為幹線道。假設示意，非事故重建。",
          "第一種假設：A 減速後完全停在停止線前，車頭尚未跨線，觀察 B 的接近方向。假設示意，非事故重建。",
          "A 等待，B 先行：A 留在停止線前，B 沿幹線道的向東路徑通過路口。B 仍應減速、注意安全；動畫速度不證明已履行該義務。假設示意，非事故重建。",
          "B 已通過兩車路徑交會區，A 在先停、讓行並確認安全後，沿向北路徑續行。假設示意，非事故重建。",
          "第二種假設使用相同路口與方向：A 未在停止線前停車即持續前進；B 向東接近並逐步減慢。兩車路徑接近。假設示意，非事故重建。",
          "畫面在 A 與 B 接觸前定格，車體保留間隔。此為教學暫停，不代表實際煞停能力；優先通行不等於當然免責，也不由此判定責任比例。假設示意，非事故重建。"
        ]
      }
    }
  },
  "stills": [
    {
      "poster": "/images/traffic/tw-flashing-junction-step-01.webp",
      "mobilePoster": "/images/traffic/tw-flashing-junction-step-01-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-flashing-junction-step-02.webp",
      "mobilePoster": "/images/traffic/tw-flashing-junction-step-02-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-flashing-junction-step-03.webp",
      "mobilePoster": "/images/traffic/tw-flashing-junction-step-03-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-flashing-junction-step-04.webp",
      "mobilePoster": "/images/traffic/tw-flashing-junction-step-04-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-flashing-junction-step-05.webp",
      "mobilePoster": "/images/traffic/tw-flashing-junction-step-05-mobile.webp"
    },
    {
      "poster": "/images/traffic/tw-flashing-junction-step-06.webp",
      "mobilePoster": "/images/traffic/tw-flashing-junction-step-06-mobile.webp"
    }
  ]
} as const satisfies TrafficDiagram;
